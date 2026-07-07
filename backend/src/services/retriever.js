require("dotenv").config();

const { Chroma } = require("@langchain/community/vectorstores/chroma");
const { getEmbeddings } = require("./embeddings");

const COLLECTION_NAME = process.env.COLLECTION_NAME || "pdf_docs";
const CHROMA_URL = process.env.CHROMA_URL || "http://localhost:8000";

let vectorStore = null;

/**
 * Returns a singleton Chroma vector store instance.
 * Lazy-initialised on first call so the server can boot
 * even if ChromaDB isn't ready yet.
 */
const getVectorStore = async () => {
  if (!vectorStore) {
    vectorStore = await Chroma.fromExistingCollection(getEmbeddings(), {
      collectionName: COLLECTION_NAME,
      url: CHROMA_URL,
    });
  }
  return vectorStore;
};

/**
 * Retrieve the top-k most relevant chunks for a query.
 * @param {string} query  - The user's question (or condensed question).
 * @param {number} k      - Number of chunks to return (default 4).
 * @returns {Promise<import("@langchain/core/documents").Document[]>}
 */
const retrieveContext = async (query, k = 4) => {
  const store = await getVectorStore();
  const docs = await store.similaritySearch(query, k);
  return docs;
};

module.exports = { retrieveContext };