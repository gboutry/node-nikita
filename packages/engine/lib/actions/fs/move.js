// Generated by CoffeeScript 2.5.1
// # `nikita.fs.move`

// Move files and directories. It is ok to overwrite the target file if it
// exists, in which case the source file will no longer exists.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   Value is "true" if resource was moved.

// ## Example

// ```js
// const {status} = await nikita.fs.move({
//   source: __dirname,
//   target: '/tmp/my_dir'
// })
// console.info(`Directory was moved: ${status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'force': {
      oneOf: [
        {
          type: 'integer'
        },
        {
          type: 'boolean'
        }
      ],
      default: false,
      description: `Force the replacement of the file without checksum verification, speed
up the action and disable the \`moved\` indicator in the callback.`
    },
    'source': {
      type: 'string',
      description: `File or directory to move.`
    },
    'source_md5': {
      type: 'string',
      description: `Source md5 checkum if known, otherwise computed.`
    },
    'target': {
      type: 'string',
      description: `Final name of the moved resource.`
    },
    'target_md5': {
      type: 'string',
      description: `Destination md5 checkum if known, otherwise computed if target exists.`
    }
  },
  required: ['source', 'target']
};

// ## Handler
handler = async function({
    config,
    metadata,
    tools: {log, path},
    ssh
  }) {
  var exists, hash;
  log({
    message: "Entering move",
    level: 'DEBUG',
    module: 'nikita/lib/system/move'
  });
  // SSH connection
  ssh = this.ssh(config.ssh);
  log({
    message: "Stat target",
    level: 'DEBUG',
    module: 'nikita/lib/system/move'
  });
  ({exists} = (await this.fs.base.exists(config.target)));
  if (!exists) {
    log({
      message: `Rename ${config.source} to ${config.target}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    this.fs.base.rename({
      source: config.source,
      target: config.target
    });
    return true;
  }
  if (config.force) {
    log({
      message: `Remove ${config.target}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    this.fs.remove({
      target: config.target
    });
    log({
      message: `Rename ${config.source} to ${config.target}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    this.fs.base.rename({
      source: config.source,
      target: config.target
    });
    return true;
  }
  if (!config.target_md5) {
    log({
      message: "Get target md5",
      level: 'DEBUG',
      module: 'nikita/lib/system/move'
    });
    ({hash} = (await this.fs.hash(config.target)));
    log({
      message: "Destination md5 is \"hash\"",
      level: 'INFO',
      module: 'nikita/lib/system/move'
    });
    config.target_md5 = hash;
  }
  if (!config.source_md5) {
    log({
      message: "Get source md5",
      level: 'DEBUG',
      module: 'nikita/lib/system/move'
    });
    ({hash} = (await this.fs.hash(config.source)));
    log({
      message: "Source md5 is \"hash\"",
      level: 'INFO',
      module: 'nikita/lib/system/move'
    });
    config.source_md5 = hash;
  }
  if (config.source_md5 === config.target_md5) {
    log({
      message: `Remove ${config.source}`,
      level: 'WARN',
      module: 'nikita/lib/system/move'
    });
    this.fs.remove({
      target: config.source
    });
    return false;
  }
  log({
    message: `Remove ${config.target}`,
    level: 'WARN',
    module: 'nikita/lib/system/move'
  });
  this.fs.remove({
    target: config.target
  });
  log({
    message: `Rename ${config.source} to ${config.target}`,
    level: 'WARN',
    module: 'nikita/lib/system/move'
  });
  this.fs.base.rename({
    source: config.source,
    target: config.target
  });
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  schema: schema
};
