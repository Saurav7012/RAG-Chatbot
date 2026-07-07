require("dotenv").config();

const { GoogleGenerativeAIEmbeddings } = require("@langchain/google-genai");

const getEmbeddings = () => {
  return new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GEMINI_API_KEY,
    modelName: "gemini-embedding-001",
  });
};

module.exports = { getEmbeddings };