var Validator = require('./validator'),
path = require('path');

module.exports = new Validator(path.join(__dirname, 'schemas'));