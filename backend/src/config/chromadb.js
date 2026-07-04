const { ChromaClient } = require("chromadb");

const client = new ChromaClient({
  path: process.env.CHROMA_URL || "http://localhost:8000",
});

const getClient = () => client;

module.exports = { getClient };