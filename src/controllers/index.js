const { getCitiesByTag, getAllCities } = require('./cities');
const { computeDistance, computeAllDistances, computeResultsUrl } = require('./distance');

module.exports = {
    computeDistance,
    getCitiesByTag,
    computeAllDistances,
    computeResultsUrl,
    getAllCities,
};