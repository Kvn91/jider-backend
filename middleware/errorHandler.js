const { logEvents } = require('./logEvents');

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    logEvents(`${err.name}\t${err.message}`, 'error-log.txt');
    res.status(500).send(err.message);
}

module.exports = errorHandler;