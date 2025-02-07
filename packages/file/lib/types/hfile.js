// Generated by CoffeeScript 2.7.0
// # `nikita.file.types.hfile`

// HFile is an XML format used accros Hadoop components which contains keys and
// value properties.

// ## Schema definitions
var builder, definitions, handler, parse, stringify, xmldom;

definitions = {
  config: {
    type: 'object',
    properties: {
      'merge': {
        type: 'boolean',
        description: `Read the target if it exists and merge its content, optional.`
      },
      'source': {
        type: ['object', 'string'],
        description: `Default configuration properties or the path to a default
configuration file to get initial value from, optional.`
      },
      'target': {
        type: 'string',
        description: `Configuration file where to write, required.`
      },
      'properties': {
        type: 'object',
        description: `Configuration properties to write, required.`
      },
      'transform': {
        oneOf: [
          {
            typeof: 'function'
          },
          {
            type: 'null'
          }
        ],
        default: null,
        description: `User defined function used to transform properties.`
      },
      // File configuration properties
      'backup': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/backup'
      },
      'backup_mode': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/backup_mode'
      },
      'eof': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/eof'
      },
      'encoding': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/encoding',
        default: 'utf8'
      },
      'uid': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/uid'
      },
      'gid': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/gid'
      },
      'mode': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/mode'
      },
      'local': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/local'
      },
      'unlink': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/unlink'
      }
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var data, err, fnl_props, i, j, k, keys, l, len, len1, len2, org_props, ref, ref1, ref2, ref3, v;
  fnl_props = {};
  org_props = {};
  // Read target properties
  log({
    message: `Read target properties from '${config.target}'`,
    level: 'DEBUG',
    module: '@nikita/file/lib/types/hfile'
  });
  try {
    // Populate org_props and, if merge, fnl_props
    ({data} = (await this.fs.base.readFile({
      encoding: config.encoding,
      target: config.target
    })));
    org_props = parse(data);
    if (config.merge) {
      fnl_props = {};
      for (k in org_props) {
        v = org_props[k];
        fnl_props[k] = v;
      }
    }
  } catch (error) {
    err = error;
    if (err.code !== 'NIKITA_FS_CRS_TARGET_ENOENT') {
      throw err;
    }
  }
  // Read source properties
  if (config.source && typeof config.source === 'string') {
    log({
      message: `Read source properties from ${config.source}`,
      level: 'DEBUG',
      module: '@nikita/file/lib/types/hfile'
    });
    // Populate config.source
    ({data} = (await this.fs.base.readFile({
      $ssh: config.local ? false : void 0,
      encoding: config.encoding,
      target: config.target
    })));
    config.source = parse(data);
  }
  // Merge source properties
  if (config.source) {
    // Note, source properties overwrite current ones by source, not sure
    // if this is the safest approach
    log({
      message: "Merge source properties",
      level: 'DEBUG',
      module: '@nikita/file/lib/types/hfile'
    });
    ref = config.source;
    for (k in ref) {
      v = ref[k];
      if (typeof v === 'number') {
        v = `${v}`;
      }
      if (fnl_props[k] === void 0 || fnl_props[k] === null) {
        fnl_props[k] = v;
      }
    }
  }
  // Merge user properties
  log({
    message: "Merge user properties",
    level: 'DEBUG',
    module: '@nikita/file/lib/types/hfile'
  });
  ref1 = config.properties;
  for (k in ref1) {
    v = ref1[k];
    if (typeof v === 'number') {
      v = `${v}`;
    }
    if (v == null) {
      delete fnl_props[k];
    } else if (Array.isArray(v)) {
      fnl_props[k] = v.join(',');
    } else if (typeof v !== 'string') {
      throw Error(`Invalid value type '${typeof v}' for property '${k}'`);
    } else {
      fnl_props[k] = v;
    }
  }
  if (config.transform) {
    // Apply transformation
    fnl_props = config.transform(fnl_props);
  }
  // Final merge
  keys = {};
  ref2 = Object.keys(org_props);
  for (i = 0, len = ref2.length; i < len; i++) {
    k = ref2[i];
    keys[k] = true;
  }
  ref3 = Object.keys(fnl_props);
  for (j = 0, len1 = ref3.length; j < len1; j++) {
    k = ref3[j];
    if (keys[k] == null) {
      keys[k] = true;
    }
  }
  keys = Object.keys(keys);
  for (l = 0, len2 = keys.length; l < len2; l++) {
    k = keys[l];
    if (org_props[k] === fnl_props[k]) {
      continue;
    }
    log({
      message: `Property '${k}' was '${org_props[k]}' and is now '${fnl_props[k]}'`,
      level: 'WARN',
      module: '@nikita/file/lib/types/hfile'
    });
  }
  return (await this.file({
    content: stringify(fnl_props),
    target: config.target,
    source: void 0,
    backup: config.backup,
    backup_mode: config.backup_mode,
    eof: config.eof,
    encoding: config.encoding,
    uid: config.uid,
    gid: config.gid,
    mode: config.mode,
    local: config.local,
    unlink: config.unlink
  }));
};


// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};

// ## `parse(xml, [property])`

// Parse an xml document and retrieve one or multiple properties.

// Retrieve all properties: `properties = parse(xml)`
// Retrieve a property: `value = parse(xml, property)`
parse = function(markup, property) {
  var child, doc, i, j, len, len1, name, properties, propertyChild, ref, ref1, ref2, ref3, ref4, ref5, value;
  properties = {};
  doc = new xmldom.DOMParser().parseFromString(markup);
  ref = doc.documentElement.childNodes;
  for (i = 0, len = ref.length; i < len; i++) {
    propertyChild = ref[i];
    if (((ref1 = propertyChild.tagName) != null ? ref1.toUpperCase() : void 0) !== 'PROPERTY') {
      continue;
    }
    name = value = void 0;
    ref2 = propertyChild.childNodes;
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      child = ref2[j];
      if (((ref3 = child.tagName) != null ? ref3.toUpperCase() : void 0) === 'NAME') {
        name = child.childNodes[0].nodeValue;
      }
      if (((ref4 = child.tagName) != null ? ref4.toUpperCase() : void 0) === 'VALUE') {
        value = ((ref5 = child.childNodes[0]) != null ? ref5.nodeValue : void 0) || '';
      }
    }
    if (property && name === property && (value != null)) {
      return value;
    }
    if (name && (value != null)) {
      properties[name] = value;
    }
  }
  return properties;
};

// ## `stringify(properties)`

// Convert a property object into a valid Hadoop XML markup. Properties are
// ordered by name.

// Convert an object into a string:

// ```
// markup = stringify({
//   'fs.defaultFS': 'hdfs://namenode:8020'
// });
// ```

// Convert an array into a string:

// ```
// stringify([{
//   name: 'fs.defaultFS', value: 'hdfs://namenode:8020'
// }])
// ```
stringify = function(properties) {
  var i, j, k, ks, len, len1, markup, name, property, value;
  markup = builder.create('configuration', {
    version: '1.0',
    encoding: 'UTF-8'
  });
  if (Array.isArray(properties)) {
    properties.sort(function(el1, el2) {
      return el1.name > el2.name;
    });
    for (i = 0, len = properties.length; i < len; i++) {
      ({name, value} = properties[i]);
      property = markup.ele('property');
      property.ele('name', name);
      property.ele('value', value);
    }
  } else {
    ks = Object.keys(properties);
    ks.sort();
    for (j = 0, len1 = ks.length; j < len1; j++) {
      k = ks[j];
      property = markup.ele('property');
      property.ele('name', k);
      property.ele('value', properties[k]);
    }
  }
  return markup.end({
    pretty: true
  });
};

// ## Dependencies
xmldom = require('xmldom');

builder = require('xmlbuilder');
