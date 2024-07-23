/**
 * @file Controller for handling autocomplete requests
 * @requires ../services/embeddingService
 */

const embeddingService = require('../services/embeddingService');

/**
 * Get autocomplete suggestions
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.getSuggestions = async (req, res) => {
    const { prefix } = req.body;

    if (!prefix || !embeddingService.isModelLoaded()) {
        return res.status(400).send('Bad Request');
    }

    try {
        const suggestions = await embeddingService.getAutocompleteSuggestions(prefix);
        res.json({ suggestions });
    } catch (error) {
        console.error('Error in /autocomplete:', error);
        res.status(500).send('Internal Server Error');
    }
};