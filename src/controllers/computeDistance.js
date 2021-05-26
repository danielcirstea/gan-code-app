const fs = require('fs');
const JSONStream = require('JSONStream');


const getCrowFlyDistance = coords => {
    const { lat1, lon1, lat2, lon2 } = coords;
    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;

    return d;
}

const computeDistance = (req, res) => {
    try {
        const { from, to } = req.query;
        const stream = fs.createReadStream(__dirname + '/data/addresses.json');

        const coords = {};

        stream
            .pipe(JSONStream.parse())
            .on('data', data => {
                data.map(item => {
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
                    distance:  Math.round(rawDistance * 100) / 100,
                    unit: 'km',
                    from: { guid: from},
                    to: { guid: to }
                };

                res.status(200).json(response);
            })

    } catch (error) {
        console.log('[COMPUTE-DISTANCE][ERROR] Failed to compute distance', error);
        res.status(500).json(error);
    }
};

module.exports = computeDistance;