/**
 * @file Controller for handling game-related requests
 * @requires ../services/embeddingService
 * @requires ../models/embeddings
 */

const embeddingService = require('../services/embeddingService');
const { locations } = require('../models/embeddings');

/**
 * Handle game command
 * @async
 * @param {import('express').Request} req - Express request object
 * @param {import('express').Response} res - Express response object
 * @returns {Promise<void>}
 */
exports.handleGameCommand = async (req, res) => {
    const { command, currentLocation } = req.body;

    if (!command || !embeddingService.isModelLoaded()) {
        return res.status(400).send('Bad Request');
    }

    if (command.toLowerCase() === 'encoding') {
        if (!currentLocation) {
            return res.status(400).send('No current location specified');
        }

        const locationDescription = locations[currentLocation];
        const locationEmbedding = await embeddingService.getLocationEmbedding(currentLocation);
        return res.json({ 
            location: currentLocation, 
            description: locationDescription, 
            embedding: locationEmbedding 
        });
    }

    const bestMatch = await embeddingService.findBestMatchingLocation(command);

    res.json({ 
        location: bestMatch, 
        description: locations[bestMatch] 
    });
};