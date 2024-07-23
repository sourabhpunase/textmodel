
// // const tf = require('@tensorflow/tfjs');
// // const express = require('express');
// // const cors = require('cors');
// // const use = require('@tensorflow-models/universal-sentence-encoder');

// // const app = express();
// // app.use(cors({
// //     origin: 'http://localhost:5173'  // Allow requests from localhost:5173
// // }));
// // const port = 3000;

// // // Middleware to parse JSON requests
// // app.use(express.json());

// // const locations = {
// //     forest: "You are in a dense forest. Sunlight filters through the leaves.",
// //     cave: "You stand at the entrance of a dark, mysterious cave.",
// //     beach: "Soft sand beneath your feet, you hear the gentle waves of the ocean.",
// //     mountain: "You're on a snow-capped mountain peak with a breathtaking view.",
// //     castle: "Before you looms an ancient castle with high stone walls."
// // };

// // const answers = [
// //     "The capital of France is Paris.",
// //     "The capital of India is  new delhi.",
// //     "The tallest mountain in the world is Mount Everest.",
// //     "The square root of 64 is 8.",
// //     "Python is a popular programming language."
// // ];

// // const locationEmbeddings = {};
// // let model;
// // let answerEmbeddings = [];

// // // Load the Universal Sentence Encoder model and compute embeddings
// // use.load().then(m => {
// //     model = m;

// //     // Generate embeddings for locations
// //     const locationDescriptions = Object.values(locations);
// //     model.embed(locationDescriptions).then(embeddings => {
// //         const embeddingsArray = embeddings.arraySync();
// //         Object.keys(locations).forEach((key, index) => {
// //             locationEmbeddings[key] = embeddingsArray[index];
// //         });
// //         console.log('Model and location embeddings loaded');
// //     });

// //     // Generate embeddings for answers
// //     model.embed(answers).then(embeddings => {
// //         answerEmbeddings = embeddings.arraySync();
// //         console.log('Model and answer embeddings loaded');
// //     });
// // });

// // app.post('/game', async (req, res) => {
// //     const { command, currentLocation } = req.body;

// //     if (!command || !model) {
// //         return res.status(400).send('Bad Request');
// //     }

// //     if (command.toLowerCase() === 'encoding') {
// //         if (!currentLocation) {
// //             return res.status(400).send('No current location specified');
// //         }

// //         const locationDescription = locations[currentLocation];
// //         const locationEmbedding = locationEmbeddings[currentLocation];
// //         return res.json({ 
// //             location: currentLocation, 
// //             description: locationDescription, 
// //             embedding: locationEmbedding 
// //         });
// //     }

// //     const commandEmbedding = await model.embed([command]);
// //     const commandEmbeddingArray = commandEmbedding.arraySync()[0];

// //     let bestMatch = '';
// //     let maxSimilarity = -Infinity;

// //     for (const [location, embedding] of Object.entries(locationEmbeddings)) {
// //         const similarity = cosineSimilarity(commandEmbeddingArray, embedding);
// //         if (similarity > maxSimilarity) {
// //             maxSimilarity = similarity;
// //             bestMatch = location;
// //         }
// //     }

// //     res.json({ 
// //         location: bestMatch, 
// //         description: locations[bestMatch] 
// //     });
// // });

// // app.post('/embed', async (req, res) => {
// //     const { text } = req.body;

// //     if (!text || !model) {
// //         return res.status(400).send('Bad Request');
// //     }

// //     const embeddings = await model.embed([text]);
// //     const embeddingArray = embeddings.arraySync();

// //     res.json({ embeddings: embeddingArray[0] });
// // });

// // app.post('/answer', async (req, res) => {
// //     const { question } = req.body;

// //     if (!question || !model) {
// //         return res.status(400).send('Bad Request');
// //     }

// //     // Compute embedding for the input question
// //     const questionEmbedding = await model.embed([question]);
// //     const questionEmbeddingArray = questionEmbedding.arraySync()[0];

// //     // Find the most similar answer
// //     let maxSimilarity = -Infinity;
// //     let bestAnswer = '';

// //     for (let i = 0; i < answerEmbeddings.length; i++) {
// //         const similarity = cosineSimilarity(questionEmbeddingArray, answerEmbeddings[i]);
// //         if (similarity > maxSimilarity) {
// //             maxSimilarity = similarity;
// //             bestAnswer = answers[i];
// //         }
// //     }

// //     res.json({ answer: bestAnswer });
// // });

// // app.post('/decode', async (req, res) => {
// //     const { embedding } = req.body;

// //     if (!embedding || !model) {
// //         return res.status(400).send('Bad Request');
// //     }

// //     let maxSimilarity = -Infinity;
// //     let bestMatch = '';

// //     const allEmbeddings = { ...locationEmbeddings, ...answerEmbeddings.reduce((acc, emb, idx) => {
// //         acc[`answer_${idx}`] = emb;
// //         return acc;
// //     }, {}) };

// //     for (const [text, emb] of Object.entries(allEmbeddings)) {
// //         const similarity = cosineSimilarity(embedding, emb);
// //         if (similarity > maxSimilarity) {
// //             maxSimilarity = similarity;
// //             bestMatch = text;
// //         }
// //     }

// //     const responseText = bestMatch.startsWith('answer_')
// //         ? answers[parseInt(bestMatch.split('_')[1], 10)]
// //         : locations[bestMatch];

// //     res.json({ text: responseText });
// // });

// // app.post('/autocomplete', async (req, res) => {
// //     const { prefix } = req.body;

// //     if (!prefix || !model) {
// //         return res.status(400).send('Bad Request');
// //     }

// //     try {
// //         // Generate embedding for the prefix
// //         const prefixEmbedding = await model.embed([prefix]);
// //         const prefixEmbeddingArray = prefixEmbedding.arraySync()[0];

// //         // Compute the similarity of the prefix with each location description
// //         const locationDescriptions = Object.keys(locations);
// //         const locationEmbeddings = await Promise.all(
// //             locationDescriptions.map(async (description) => {
// //                 const embedding = await model.embed([locations[description]]);
// //                 return {
// //                     description,
// //                     embedding: embedding.arraySync()[0],
// //                 };
// //             })
// //         );

// //         // Compute the similarity for each location description
// //         const suggestions = locationEmbeddings
// //             .map(({ description, embedding }) => ({
// //                 description,
// //                 similarity: cosineSimilarity(prefixEmbeddingArray, embedding),
// //             }))
// //             .sort((a, b) => b.similarity - a.similarity)
// //             .slice(0, 5) // Limit to top 5 suggestions
// //             .map(({ description }) => description);

// //         res.json({ suggestions });
// //     } catch (error) {
// //         console.error('Error in /autocomplete:', error);
// //         res.status(500).send('Internal Server Error');
// //     }
// // });

// // // Helper function to compute cosine similarity between two vectors
// // function cosineSimilarity(vecA, vecB) {
// //     const dotProduct = vecA.reduce((sum, a, idx) => sum + a * vecB[idx], 0);
// //     const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
// //     const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
// //     return dotProduct / (normA * normB);
// // }

// // app.listen(port, () => {
// //     console.log(`Server is running on http://localhost:${port}`);
// // });

// const express = require('express');
// const cors = require('cors');
// const config = require('./src/config/config');
// const apiRoutes = require('./src/routes/api');
// const embeddingService = require('./src/services/embeddingService');
// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('../swagger/swagger.json');

// const app = express();

// app.use(cors({
//     origin: config.corsOrigin
// }));

// app.use(express.json());

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// app.use('/api', apiRoutes);

// embeddingService.loadModel().then(() => {
//     console.log('Model loaded successfully');
// }).catch(error => {
//     console.error('Error loading model:', error);
// });

// module.exports = app;

/**
 * @file Server entry point
 * @requires ./src/app
 * @requires ./src/config/config
 */

const app = require('./src/app');
const config = require('./src/config/config');

app.listen(config.port, () => {
    console.log(`Server is running on http://localhost:${config.port}`);
});