const { format } = require('date-fns');
const { v4: uuid } = require('uuid');

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const logEvents = async (message, fileName) => {
    const datetime = `${format(new Date(), 'ddMMyyyy\tHH:mm:ss')}`;
    const logItem = `${datetime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {
            await fsPromises.mkdir(path.join(__dirname, 'logs'));
        }
        
        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', fileName), logItem);
    } catch (error) {
        console.error(error);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'request-log.txt');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };