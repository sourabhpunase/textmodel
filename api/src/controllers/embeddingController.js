/**
 * @file Controller for handling embedding-related requests
 * @requires ../services/embeddingService
 */

const embeddingService = require('../services/embeddingService');

/**
 * Get embedding for text
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getEmbedding = async (req, res) => {
    const { text } = req.body;

    if (!text || !embeddingService.isModelLoaded()) {
        return res.status(400).send('Bad Request');
    }

    const embeddings = await embeddingService.getEmbedding(text);
    res.json({ embeddings });
};

/**
 * Get answer for question
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getAnswer = async (req, res) => {
    const { question } = req.body;

    if (!question || !embeddingService.isModelLoaded()) {
        return res.status(400).send('Bad Request');
    }

    const bestAnswer = await embeddingService.findBestMatchingAnswer(question);
    res.json({ answer: bestAnswer });
};

/**
 * Decode embedding
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.decodeEmbedding = async (req, res) => {
    const { embedding } = req.body;

    if (!embedding || !embeddingService.isModelLoaded()) {
        return res.status(400).send('Bad Request');
    }

    const decodedText = await embeddingService.decodeEmbedding(embedding);
    res.json({ text: decodedText });
};