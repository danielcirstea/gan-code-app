const fs = require('fs');
const JSONStream = require('JSONStream');

const getCitiesByTag = (req, res) => {
    try {
        const { tag, isActive } = req.query;
        const stream = fs.createReadStream(__dirname + '/data/addresses.json');

        let cities = [];

        stream
            .pipe(JSONStream.parse())
            .on('data', data => {
                data.forEach(item => {
                    if (item.tags.includes(tag) && item.isActive === !!isActive) cities.push(item);
                })
            })
            .on('end', () => {
                res.status(200).json({ cities });
            })

    } catch (error) {
        console.log('[CITIES-BY-TAG][ERROR] Failed to retrieve a city', error);
        res.status(500).json(error);
    }
};


const getAllCities = (_req, res) => {
    try {
        const stream = fs.createReadStream(__dirname + '/data/addresses.json');

        stream
            .pipe(JSONStream.parse())
            .on('data', data => {
                res.status(200).json(data);
            });

    } catch (error) {
        console.log('[ALL-CITIES][ERROR] Failed to retrieve a city', error);
        res.status(500).json(error);
    }
};

module.exports = {
    getCitiesByTag,
    getAllCities,
};