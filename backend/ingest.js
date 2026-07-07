require("dotenv").config();

const fs = require("fs");
const path = require("path");
const pdfParse = require("pdf-parse");
const { Document } = require("@langchain/core/documents");
const { RecursiveCharacterTextSplitter } = require("langchain/text_splitter");
const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { getEmbeddings } = require("./src/services/embeddings");

const PDF_PATH = path.join(__dirname, "docs", "documentation.pdf");
const COLLECTION_NAME = process.env.COLLECTION_NAME || "pdf_docs";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

const run = async () => {
  try {
    console.log("📄 Checking for PDF...");
    if (!fs.existsSync(PDF_PATH)) {
      throw new Error(
        `PDF not found at ${PDF_PATH}.\nPlease place your PDF in the docs/ folder and name it documentation.pdf`
      );
    }
    console.log(`✅ Found PDF: ${PDF_PATH}`);

    console.log("\n📖 Loading PDF...");
    const dataBuffer = fs.readFileSync(PDF_PATH);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData.text || pdfData.text.trim().length === 0) {
      throw new Error(
        "No extractable text found in PDF. It may be a scanned/image-based PDF that needs OCR."
      );
    }

    const rawDocs = [
      new Document({
        pageContent: pdfData.text,
        metadata: {
          source: "documentation.pdf",
          totalPages: pdfData.numpages,
        },
      }),
    ];
    console.log(`✅ PDF loaded — ${pdfData.numpages} page(s) found`);

    console.log("\n✂️  Splitting into chunks...");
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const chunks = await splitter.splitDocuments(rawDocs);
    console.log(`✅ Split into ${chunks.length} chunks`);

    console.log("\n🔍 Sample chunk (first one):");
    console.log("─".repeat(50));
    console.log(chunks[0].pageContent.substring(0, 300) + "...");
    console.log("─".repeat(50));

    console.log("\n🧠 Generating embeddings and storing in ChromaDB...");
    console.log("⏳ This may take a moment depending on PDF size...");

    const embeddings = getEmbeddings(); //just the model config

    await Chroma.fromDocuments(chunks, embeddings, {
      collectionName: COLLECTION_NAME,
      url: CHROMA_URL,
      collectionMetadata: {
        "hnsw:space": "cosine",
      },
    });

    console.log(`\n✅ Successfully stored ${chunks.length} chunks in ChromaDB`);
    console.log(`📦 Collection name: "${COLLECTION_NAME}"`);
    console.log(`🌐 ChromaDB URL: ${CHROMA_URL}`);
    console.log("\n🎉 Ingestion complete! You can now start the server and chat.");

  } catch (error) {
    console.error("\n❌ Ingestion failed:");
    console.error(error.message);
    process.exit(1);
  }
};

run();