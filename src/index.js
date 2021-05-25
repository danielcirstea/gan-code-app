const helmet = require('helmet');
const express = require('express');
const app = express();

const packageJson = require('../package.json');
const config = require('./config')();
const controllers = require('./controllers');

app.use(helmet());

app.get('/cities-by-tag', controllers.citiesByTag);
app.use('*', (_req, res) => res.status(200).json({ name: packageJson.name, version: packageJson.version, status: 'online '}));

app.listen(config.port, () => console.log(`[APP][START] App listening on port ${config.port}.`));