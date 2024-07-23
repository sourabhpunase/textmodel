/**
 * @file Utility functions for mathematical operations
 */

/**
 * Compute cosine similarity between two vectors
 * @param {number[]} vecA First vector
 * @param {number[]} vecB Second vector
 * @returns {number} Cosine similarity
 */
exports.cosineSimilarity = (vecA, vecB) => {
  const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dotProduct / (normA * normB);
};