const StreamArray = require('stream-json/streamers/StreamArray');
const fs = require('fs');

const streamData = () => {
    let chunks = [];
    const stream = StreamArray.withParser();

    fs.createReadStream(__dirname + '/addresses.json').pipe(stream.input);
    
    stream.on('data', ({ value }) => chunks.push(value));
    stream.on('error', error => console.log('[APP][DATA-STREAM] Failed with error', error));

    return stream;
};

module.exports = {
    streamData
};