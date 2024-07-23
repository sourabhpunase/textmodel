/**
 * @file API routes definition
 * @requires express
 * @requires ../controllers/gameController
 * @requires ../controllers/embeddingController
 * @requires ../controllers/autocompleteController
 */

const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const embeddingController = require('../controllers/embeddingController');
const autocompleteController = require('../controllers/autocompleteController');

/**
 * @route POST /game
 * @group Game - Operations related to game commands
 * @param {object} request.body - Command and current location
 * @param {string} request.body.command - The command to process
 * @param {string} request.body.currentLocation - The current location in the game
 * @returns {object} 200 - An object containing the best matching location and description
 * @returns {Error} 400 - Bad request if command is missing or model is not loaded
 * @example
 * // Request example
 * {
 *   "command": "move north",
 *   "currentLocation": "forest"
 * }
 * @example
 * // Response example
 * {
 *   "location": "cave",
 *   "description": "You stand at the entrance of a dark, mysterious cave."
 * }
 */
router.post('/game', gameController.handleGameCommand);

/**
 * @route POST /embed
 * @group Embedding - Operations related to text embeddings
 * @param {object} request.body - Text to embed
 * @param {string} request.body.text - The text to generate embeddings for
 * @returns {object} 200 - An object containing the generated embeddings
 * @returns {Error} 400 - Bad request if text is missing or model is not loaded
 * @example
 * // Request example
 * {
 *   "text": "Hello world"
 * }
 * @example
 * // Response example
 * {
 *   "embeddings": [0.1, 0.2, 0.3, ...]
 * }
 */
router.post('/embed', embeddingController.getEmbedding);

/**
 * @route POST /answer
 * @group Embedding - Operations related to answering questions
 * @param {object} request.body - Question to answer
 * @param {string} request.body.question - The question to answer
 * @returns {object} 200 - An object containing the most relevant answer
 * @returns {Error} 400 - Bad request if question is missing or model is not loaded
 * @example
 * // Request example
 * {
 *   "question": "What is the capital of France?"
 * }
 * @example
 * // Response example
 * {
 *   "answer": "The capital of France is Paris."
 * }
 */
router.post('/answer', embeddingController.getAnswer);

/**
 * @route POST /decode
 * @group Embedding - Operations related to decoding embeddings
 * @param {object} request.body - Embedding to decode
 * @param {number[]} request.body.embedding - The embedding to decode
 * @returns {object} 200 - An object containing the text associated with the embedding
 * @returns {Error} 400 - Bad request if embedding is missing or model is not loaded
 * @example
 * // Request example
 * {
 *   "embedding": [0.1, 0.2, 0.3, ...]
 * }
 * @example
 * // Response example
 * {
 *   "text": "You are in a dense forest."
 * }
 */
router.post('/decode', embeddingController.decodeEmbedding);

/**
 * @route POST /autocomplete
 * @group Autocomplete - Operations related to autocomplete suggestions
 * @param {object} request.body - Prefix for autocomplete
 * @param {string} request.body.prefix - The prefix to get suggestions for
 * @returns {object} 200 - An object containing the top autocomplete suggestions
 * @returns {Error} 400 - Bad request if prefix is missing or model is not loaded
 * @example
 * // Request example
 * {
 *   "prefix": "You are in a"
 * }
 * @example
 * // Response example
 * {
 *   "suggestions": ["dense forest", "dark cave", "sunny beach"]
 * }
 */
router.post('/autocomplete', autocompleteController.getSuggestions);

module.exports = router;
