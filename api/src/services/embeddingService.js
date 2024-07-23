const tf = require('@tensorflow/tfjs');
const use = require('@tensorflow-models/universal-sentence-encoder');
const { locations, answers } = require('../models/embeddings');
const { cosineSimilarity } = require('../utils/mathUtils');

let model;
const locationEmbeddings = {};
let answerEmbeddings = [];

exports.loadModel = async () => {
    model = await use.load();
    await generateEmbeddings();
    console.log('Model and embeddings loaded');
};

async function generateEmbeddings() {
    const locationDescriptions = Object.values(locations);
    const embeddings = await model.embed(locationDescriptions);
    const embeddingsArray = embeddings.arraySync();
    Object.keys(locations).forEach((key, index) => {
        locationEmbeddings[key] = embeddingsArray[index];
    });

    const answerEmbeddingsResult = await model.embed(answers);
    answerEmbeddings = answerEmbeddingsResult.arraySync();
}

exports.isModelLoaded = () => !!model;

exports.getLocationEmbedding = async (location) => locationEmbeddings[location];

exports.findBestMatchingLocation = async (command) => {
    const commandEmbedding = await model.embed([command]);
    const commandEmbeddingArray = commandEmbedding.arraySync()[0];

    let bestMatch = '';
    let maxSimilarity = -Infinity;

    for (const [location, embedding] of Object.entries(locationEmbeddings)) {
        const similarity = cosineSimilarity(commandEmbeddingArray, embedding);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            bestMatch = location;
        }
    }

    return bestMatch;
};

exports.getEmbedding = async (text) => {
    const embeddings = await model.embed([text]);
    return embeddings.arraySync()[0];
};

exports.findBestMatchingAnswer = async (question) => {
    const questionEmbedding = await model.embed([question]);
    const questionEmbeddingArray = questionEmbedding.arraySync()[0];

    let maxSimilarity = -Infinity;
    let bestAnswer = '';

    for (let i = 0; i < answerEmbeddings.length; i++) {
        const similarity = cosineSimilarity(questionEmbeddingArray, answerEmbeddings[i]);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            bestAnswer = answers[i];
        }
    }

    return bestAnswer;
};

exports.decodeEmbedding = async (embedding) => {
    let maxSimilarity = -Infinity;
    let bestMatch = '';

    const allEmbeddings = { ...locationEmbeddings, ...answerEmbeddings.reduce((acc, emb, idx) => {
        acc[`answer_${idx}`] = emb;
        return acc;
    }, {}) };

    for (const [text, emb] of Object.entries(allEmbeddings)) {
        const similarity = cosineSimilarity(embedding, emb);
        if (similarity > maxSimilarity) {
            maxSimilarity = similarity;
            bestMatch = text;
        }
    }

    return bestMatch.startsWith('answer_')
        ? answers[parseInt(bestMatch.split('_')[1], 10)]
        : locations[bestMatch];
};

exports.getAutocompleteSuggestions = async (prefix) => {
    const prefixEmbedding = await model.embed([prefix]);
    const prefixEmbeddingArray = prefixEmbedding.arraySync()[0];

    const locationDescriptions = Object.keys(locations);
    const locationEmbeddings = await Promise.all(
        locationDescriptions.map(async (description) => {
            const embedding = await model.embed([locations[description]]);
            return {
                description,
                embedding: embedding.arraySync()[0],
            };
        })
    );

    return locationEmbeddings
        .map(({ description, embedding }) => ({
            description,
            similarity: cosineSimilarity(prefixEmbeddingArray, embedding),
        }))
        .sort((a, b) => b.similarity - a.similarity)
        .slice(0, 5)
        .map(({ description }) => description);
};