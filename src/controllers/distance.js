const fs = require('fs');
const JSONStream = require('JSONStream');
const { getCrowFlyDistance } = require('./utils');

const inputDistance = {}; //in-memory store


const computeDistance = (req, res) => {
    try {
        const { from, to } = req.query;
        const stream = fs.createReadStream(__dirname + '/data/addresses.json');

        const coords = {};

        stream
            .pipe(JSONStream.parse())
            .on('data', data => {
                data.forEach(item => {
                    if (item.guid === from) {
                        coords.lat1 = item.latitude;
                        coords.lon1 = item.longitude;
                    }

                    if (item.guid === to) {
                        coords.lat2 = item.latitude;
                        coords.lon2 = item.longitude;
                    }

                })
            })
            .on('end', () => {
                const rawDistance = getCrowFlyDistance(coords);
                const response = {
                    distance: Math.round(rawDistance * 100) / 100,
                    unit: 'km',
                    from: { guid: from },
                    to: { guid: to }
                };

                res.status(200).json(response);
            })

    } catch (error) {
        console.log('[COMPUTE-DISTANCE][ERROR] Failed to compute distance', error);
        res.status(500).json(error);
    }
};

const computeResultsUrl = (req, res) => {
    try {
        const { from, distance } = req.query;
        inputDistance.from = from;
        inputDistance.distance = distance;

        const url = req.protocol + '://' + req.get('host');

        return res.status(202).json({ resultsUrl: url + '/area-result/2152f96f-50c7-4d76-9e18-f7033bd14428' });
    } catch (error) {
        console.log('[COMPUTE-AREA-URL][ERROR] Failed to compute results url', error);
        res.status(500).json(error);
    }
};

const computeAllDistances = (_req, res) => {
    try {
        const { from, distance } = inputDistance;
        const stream = fs.createReadStream(__dirname + '/data/addresses.json');
        const cities = [];

        stream
            .pipe(JSONStream.parse())
            .on('data', data => {
                const coords = {};

                for (let city of data) {
                    if (city.guid === from) {
                        coords.lat1 = city.latitude;
                        coords.lon1 = city.longitude;

                        break;
                    }
                }

                data.forEach(item => {
                    if (item.guid !== from) {
                        const lat2 = item.latitude;
                        const lon2 = item.longitude;
                        const computedDistance = getCrowFlyDistance({ lat1: coords.lat1, lon1: coords.lon1, lat2, lon2 });
                        if (computedDistance <= distance) cities.push(item);
                    }
                })
            })
            .on('end', () => {
                res.status(200).json({ cities });
            })
    } catch (error) {
        console.log('[COMPUTE-ALL-DISTANCES][ERROR] Failed to compute all distances', error);
        res.status(500).json(error);
    }
};


module.exports = {
    computeDistance,
    computeResultsUrl,
    computeAllDistances,
}