const { streamData } = require('../resources/dataStream');

const citiesByTag = (req, res) => {
    try {
        const { tag, isActive } = req.query;

        const str = streamData();
        str.pipe(res);
    } catch(error) {
        console.log('[CITIES-BY-TAG][ERROR] Failed to retrieve a city', error);
        res.status(500).json(error);
    }
};

module.exports = citiesByTag;