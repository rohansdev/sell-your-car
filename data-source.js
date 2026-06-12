const { DataSource } = require('typeorm');
const ormconfig = require('./ormconfig.js');

module.exports = new DataSource(ormconfig);
