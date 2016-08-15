var jsonvalidate, validate, fs, yaml, path;

jsonvalidate = require('jsonschema').validate;
fs = require('fs');
yaml = require('js-yaml');
path = require('path');

function Validator(options) {
  options = options || {};
  if (typeof options === 'string') options = {
    path: options
  };

  if (!options.path) throw new Error('options.path is required');

  options.format = options.format || 'yml';
  this.options = options;
}

Validator.prototype.validate = function(key, obj) {
  var r, schema, format = this.options.format,
    location = path.join(this.options.path, key + '.' + format);
  if (format === 'json')
    schema = require(location);
  else {
    schema = fs.readFileSync(location, 'utf8');
    schema = yaml.safeLoad(schema);
  }

  r = jsonvalidate(obj, schema);

  return {
    isValid: r.errors.length === 0,
    errors: r.errors,
    message: r.errors.length > 0 ? r.errors[0].stack : void 0
  };
}


Validator.prototype.isValid = function(key, obj) {
  var r = this.validate(key, obj);
  return r.isValid;
}

Validator.prototype.assert = function(key, obj) {
  var r = this.validate(key, obj);
  if (!r.isValid) throw new Error(r.message);
  return r.isValid;
}

module.exports = Validator;
