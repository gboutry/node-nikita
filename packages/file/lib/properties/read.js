// Generated by CoffeeScript 2.5.1
// # `nikita.file.properties.read`

// Read a file in the Java properties format.

// ## Example

// Use a custom delimiter with spaces around the equal sign.

// ```js
// const {properties} = await nikita.file.properties.read({
//   target: "/path/to/target.json",
//   separator: ' = '
// })
// console.info(`Properties:`, properties)
// ```

// ## Schema
var handler, quote, schema;

schema = {
  type: 'object',
  properties: {
    'comment': {
      type: 'boolean',
      default: false,
      description: `Preserve comments, key is the comment while value is "null".`
    },
    'encoding': {
      $ref: 'module://@nikitajs/file/src/index#/properties/encoding',
      default: 'utf8'
    },
    'separator': {
      type: 'string',
      default: '=',
      description: `The caracter to use for separating property and value. '=' by default.`
    },
    'target': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'function'
        }
      ],
      description: `File to read and parse.`
    },
    'trim': {
      type: 'boolean',
      description: `Trim keys and value.`
    }
  },
  required: ['target']
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var _, data, i, k, len, line, lines, properties, v;
  log({
    message: "Entering file.properties",
    level: 'DEBUG',
    module: 'nikita/lib/file/properties/read'
  });
  ({data} = (await this.fs.base.readFile({
    target: config.target,
    encoding: config.encoding
  })));
  properties = {};
  // Parse
  lines = data.split(/\r\n|[\n\r\u0085\u2028\u2029]/g);
  for (i = 0, len = lines.length; i < len; i++) {
    line = lines[i];
    if (/^\s*$/.test(line)) { // Empty line
      continue;
    }
    if (/^#/.test(line)) { // Comment
      if (config.comment) {
        properties[line] = null;
      }
      continue;
    }
    [_, k, v] = RegExp(`^(.*?)${quote(config.separator)}(.*)$`).exec(line);
    if (config.trim) {
      k = k.trim();
    }
    if (config.trim) {
      v = v.trim();
    }
    properties[k] = v;
  }
  return {
    properties: properties
  };
};

// ## Exports
module.exports = {
  handler: handler,
  schema: schema
};

// ## Dependencies
quote = require('regexp-quote');
