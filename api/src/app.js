/**
 * @file Main application file for the Game API
 * @requires express
 * @requires cors
 * @requires path
 * @requires ./config/config
 * @requires ./routes/api
 * @requires ./services/embeddingService
 * @requires swagger-ui-express
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/config');
const apiRoutes = require('./routes/api');
const embeddingService = require('./services/embeddingService');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger/swagger.json');

const app = express();

app.use(cors({
    origin: config.corsOrigin
}));

app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api', apiRoutes);

// Serve JSDoc documentation
app.use('/docs', express.static(path.join(__dirname, '../docs')));

embeddingService.loadModel().then(() => {
    console.log('Model loaded successfully');
}).catch(error => {
    console.error('Error loading model:', error);
});

module.exports = app;