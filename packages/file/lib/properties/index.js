// Generated by CoffeeScript 2.6.0
// # `nikita.file.properties`

// Write a file in the Java properties format.

// ## Example

// Use a custom delimiter with spaces around the equal sign.

// ```js
// const {$status} = await nikita.file.properties({
//   target: "/path/to/target.json",
//   content: { key: "value" },
//   separator: ' = '
//   merge: true
// })
// console.info(`File was written: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'backup': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/backup'
      },
      'comment': {
        $ref: 'module://@nikitajs/file/lib/properties/read#/definitions/config/properties/comment'
      },
      'content': {
        type: 'object',
        default: {},
        description: `List of properties to write.`
      },
      'merge': {
        type: 'boolean',
        default: false,
        description: `Merges content properties with target file.`
      },
      'local': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/local'
      },
      'separator': {
        default: '=',
        $ref: 'module://@nikitajs/file/lib/properties/read#/definitions/config/properties/separator'
      },
      'sort': {
        type: 'boolean',
        default: false,
        description: `Sort the properties before writting them.`
      },
      'target': {
        $ref: 'module://@nikitajs/file/lib/index#/definitions/config/properties/target'
      },
      'trim': {
        $ref: 'module://@nikitajs/file/lib/properties/read#/definitions/config/properties/trim'
      }
    },
    required: ['target']
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var $status, data, exists, fnl_props, k, key, keys, org_props, properties, ref, v;
  // Trim
  if (!config.trim) {
    fnl_props = config.content;
  } else {
    fnl_props = {};
    ref = config.content;
    for (k in ref) {
      v = ref[k];
      k = k.trim();
      if (typeof v === 'string') {
        v = v.trim();
      }
      fnl_props[k] = v;
    }
  }
  org_props = {};
  log({
    message: `Merging \"${config.merge ? 'true' : 'false'}\"`,
    level: 'DEBUG'
  });
  // Read Original
  ({exists} = (await this.fs.base.exists({
    target: config.target
  })));
  if (exists) {
    ({properties} = (await this.file.properties.read({
      target: config.target,
      separator: config.separator,
      comment: config.comment,
      trim: config.trim
    })));
  }
  org_props = properties || {};
  // Diff
  ({$status} = (await this.call(function() {
    var i, j, key, keys, l, len, len1, len2, ref1, ref2, ref3, status;
    status = false;
    keys = {};
    ref1 = Object.keys(org_props);
    for (i = 0, len = ref1.length; i < len; i++) {
      k = ref1[i];
      keys[k] = true;
    }
    ref2 = Object.keys(fnl_props);
    for (j = 0, len1 = ref2.length; j < len1; j++) {
      k = ref2[j];
      keys[k] = true;
    }
    ref3 = Object.keys(keys);
    for (l = 0, len2 = ref3.length; l < len2; l++) {
      key = ref3[l];
      if (`${org_props[key]}` !== `${fnl_props[key]}`) {
        log({
          message: `Property '${key}' was '${org_props[k]}' and is now '${fnl_props[k]}'`,
          level: 'WARN'
        });
        if (fnl_props[key] != null) {
          status = true;
        }
      }
    }
    return status;
  })));
  // Merge
  if (config.merge) {
    for (k in fnl_props) {
      v = fnl_props[k];
      org_props[k] = fnl_props[k];
    }
    fnl_props = org_props;
  }
  // Write data
  keys = config.sort ? Object.keys(fnl_props).sort() : Object.keys(fnl_props);
  data = (function() {
    var i, len, results;
    results = [];
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (fnl_props[key] != null) {
        results.push(`${key}${config.separator}${fnl_props[key]}`);
      } else {
        results.push(`${key}`);
      }
    }
    return results;
  })();
  await this.file({
    $shy: true,
    target: `${config.target}`,
    content: data.join('\n'),
    backup: config.backup,
    eof: true
  });
  if (config.uid || config.gid) {
    await this.system.chown({
      target: config.target,
      uid: config.uid,
      gid: config.gid
    });
  }
  if (config.mode) {
    await this.system.chmod({
      target: config.target,
      mode: config.mode
    });
  }
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};
