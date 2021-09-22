// Generated by CoffeeScript 2.6.0
// # `nikita.fs.base.chown`

// Change ownership of a file.

// ## Hooks
var definitions, handler, on_action;

on_action = function({config, metadata}) {
  if ((typeof config.uid === 'string') && /\d+/.test(config.uid)) {
    // String to integer coercion
    config.uid = parseInt(config.uid);
  }
  if ((typeof config.gid === 'string') && /\d+/.test(config.gid)) {
    return config.gid = parseInt(config.gid);
  }
};

// ## Schema definitions
definitions = {
  config: {
    type: 'object',
    properties: {
      'gid': {
        type: ['integer', 'string'],
        description: `Unix group name or id who owns the target file.`
      },
      'target': {
        type: 'string',
        description: `Location of the file which permissions will change.`
      },
      'uid': {
        type: ['integer', 'string'],
        description: `Unix user name or id who owns the target file.`
      }
    },
    required: ['target']
  }
};

// ## Handler
handler = async function({config}) {
  if (config.uid === false) {
    // Normalization
    config.uid = null;
  }
  if (config.gid === false) {
    config.gid = null;
  }
  if (!((config.uid != null) || (config.gid != null))) {
    // Validation
    throw Error("Missing one of uid or gid option");
  }
  return (await this.execute([config.uid != null ? `chown ${config.uid} ${config.target}` : void 0, config.gid != null ? `chgrp ${config.gid} ${config.target}` : void 0].join('\n')));
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    argument_to_config: 'target',
    log: false,
    raw_output: true,
    definitions: definitions
  }
};
