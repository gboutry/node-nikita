// Generated by CoffeeScript 2.5.1
// # `nikita.file.upload`

// Upload a file to a remote location. Options are identical to the "write"
// function with the addition of the "binary" option.

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `status`   
//   Value is "true" if file was uploaded.   

// ## Example

// ```js
// const {status} = await nikita.file.upload({
//   ssh: ssh
//   source: '/tmp/local_file',
//   target: '/tmp/remote_file'
// })
// console.info(`File was uploaded: ${status}`)
// ```

// ## Schema
var fs, handler, path, schema, utils;

schema = {
  type: 'object',
  properties: {
    'content': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'function'
        }
      ],
      description: `Text to be written.`
    },
    'from': {
      oneOf: [
        {
          type: 'string'
        },
        {
          instanceof: 'RegExp'
        }
      ],
      description: `Name of the marker from where the content will be replaced.`
    },
    'md5': {
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      default: false,
      description: `Validate uploaded file with md5 checksum (only for binary upload for
now), may be the string checksum or will be deduced from source if
"true".`
    },
    'sha1': {
      default: false,
      oneOf: [
        {
          type: 'string'
        },
        {
          typeof: 'boolean'
        }
      ],
      description: `Validate uploaded file with sha1 checksum (only for binary upload for
now), may be the string checksum or will be deduced from source if
"true".`
    },
    'source': {
      type: 'string',
      description: `File path from where to extract the content, do not use conjointly
with content.`
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
      description: `File path where to write content to. Pass the content.`
    }
  },
  required: ['source', 'target']
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var algo, stage_target, stats, status;
  if (config.md5 != null) {
    algo = 'md5';
  } else if (config.sha1 != null) {
    algo = 'sha1';
  } else {
    algo = 'md5';
  }
  log({
    message: `Source is \"${config.source}\"`,
    level: 'DEBUG',
    module: 'nikita/lib/file/upload'
  });
  log({
    message: `Destination is \"${config.target}\"`,
    level: 'DEBUG',
    module: 'nikita/lib/file/upload'
  });
  log({
    message: "Entering file.upload",
    level: 'DEBUG',
    module: 'nikita/lib/file/upload'
  });
  // Stat the target and redefine its path if a directory
  stats = (await this.call({
    raw_output: true
  }, async function() {
    var err;
    try {
      ({stats} = (await this.fs.base.stat({
        ssh: false,
        sudo: false,
        target: config.target
      })));
      if (utils.stats.isFile(stats.mode)) {
        // Target is a file
        return stats;
      }
      if (!utils.stats.isDirectory(stats.mode)) {
        // Target is invalid
        throw Error(`Invalid Target: expect a file, a symlink or a directory for ${JSON.stringify(config.target)}`);
      }
      // Target is a directory
      config.target = path.resolve(config.target, path.basename(config.source));
      try {
        ({stats} = (await this.fs.base.stat({
          ssh: false,
          sudo: false,
          target: config.target
        })));
        if (utils.stats.isFile(stats.mode)) {
          return stats;
        }
        throw Error(`Invalid target: ${config.target}`);
      } catch (error) {
        err = error;
        if (err.code === 'NIKITA_FS_STAT_TARGET_ENOENT') {
          return null;
        }
        throw err;
      }
    } catch (error) {
      err = error;
      if (err.code === 'NIKITA_FS_STAT_TARGET_ENOENT') {
        return null;
      }
      throw err;
    }
  }));
  // Now that we know the real name of the target, define a temporary file to write
  stage_target = `${config.target}.${Date.now()}${Math.round(Math.random() * 1000)}`;
  ({status} = (await this.call(async function() {
    var hash, hash_source, hash_target, match;
    if (!stats) {
      return true;
    }
    ({hash} = (await this.fs.hash({
      target: config.source,
      algo: algo
    })));
    hash_source = hash;
    ({hash} = (await this.fs.hash({
      target: config.target,
      algo: algo,
      ssh: false,
      sudo: false
    })));
    hash_target = hash;
    match = hash_source === hash_target;
    log(match ? {
      message: `Hash matches as '${hash_source}'`,
      level: 'INFO',
      module: 'nikita/lib/file/download'
    } : {
      message: `Hash dont match, source is '${hash_source}' and target is '${hash_target}'`,
      level: 'WARN',
      module: 'nikita/lib/file/download'
    });
    return !match;
  })));
  if (!status) {
    return;
  }
  this.fs.mkdir({
    ssh: false,
    sudo: false,
    target: path.dirname(stage_target)
  });
  await this.fs.base.createReadStream({
    target: config.source,
    stream: function(rs) {
      var ws;
      ws = fs.createWriteStream(stage_target);
      return rs.pipe(ws);
    }
  });
  this.fs.move({
    ssh: false,
    sudo: false,
    source: stage_target,
    target: config.target
  });
  log({
    message: "Unstaged uploaded file",
    level: 'INFO',
    module: 'nikita/lib/file/upload'
  });
  if (config.mode != null) {
    this.fs.chmod({
      ssh: false,
      sudo: false,
      target: config.target,
      mode: config.mode
    });
  }
  if ((config.uid != null) || (config.gid != null)) {
    this.fs.chown({
      ssh: false,
      sudo: false,
      target: config.target,
      uid: config.uid,
      gid: config.gid
    });
  }
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  schema: schema
};

// ## Dependencies
fs = require('fs');

path = require('path');

utils = require('./utils');
