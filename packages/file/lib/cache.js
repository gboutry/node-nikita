// Generated by CoffeeScript 2.7.0
  // # `nikita.file.cache`

// Download a file and place it on a local or remote folder for later usage.

// ## Output

// * `$status`   
  //   Value is "true" if cache file was created or modified.

// ## HTTP example

// Cache can be used from the `file.download` action:

// ```js
  // const {$status} = await nikita.file.download({
  //   source: 'https://github.com/wdavidw/node-nikita/tarball/v0.0.1',
  //   cache_dir: '/var/tmp'
  // })
  // console.info(`File downloaded: ${$status}`)
  // ```

// ## Schema definitions
var definitions, errors, handler, path, protocols_ftp, protocols_http, url, utils,
  indexOf = [].indexOf;

definitions = {
  config: {
    type: 'object',
    properties: {
      'cache_dir': {
        type: 'string',
        description: `Path of the cache directory.`
      },
      'cache_file': {
        type: ['boolean', 'string'],
        description: `Alias for 'target'.`
      },
      'cache_local': {
        type: 'boolean',
        description: `Apply to SSH mode, treat the cache file and directories as local from
where the command is used instead of over SSH.`
      },
      'cookies': {
        type: 'array',
        items: {
          type: 'string'
        },
        default: [],
        description: `Extra cookies  to include in the request when sending HTTP to a
server.`
      },
      'fail': {
        type: 'boolean',
        description: `Send an error if the HTTP response code is invalid. Similar to the
curl option of the same name.`
      },
      'force': {
        type: 'boolean',
        description: `Overwrite the target file if it exists, bypass md5 verification.`
      },
      'http_headers': {
        type: 'array',
        items: {
          type: 'string'
        },
        default: [],
        description: `Extra header to include in the request when sending HTTP to a server.`
      },
      'location': {
        type: 'boolean',
        description: `If the server reports that the requested page has moved to a different
location (indicated with a Location: header and a 3XX response code),
this option will make curl redo the request on the new place.`
      },
      'md5': {
        type: ['boolean', 'string'],
        default: false,
        description: `Validate file with md5 checksum (only for binary upload for now),
may be the string checksum or will be deduced from source if "true".`
      },
      'proxy': {
        type: 'string',
        description: `Use the specified HTTP proxy. If the port number is not specified, it
is assumed at port 1080. See curl(1) man page.`
      },
      'sha1': {
        default: false,
        type: ['boolean', 'string'],
        description: `Validate file with sha1 checksum (only for binary upload for now),
may be the string checksum or will be deduced from source if "true".`
      },
      'sha256': {
        default: false,
        type: ['boolean', 'string'],
        description: `Validate file with sha256 checksum (only for binary upload for now),
may be the string checksum or will be deduced from source if "true".`
      },
      'source': {
        type: 'string',
        description: `File, HTTP URL, FTP, GIT repository. File is the default protocol if
source is provided without any.`
      },
      'target': {
        type: ['boolean', 'string'],
        description: `Cache the file on the executing machine, equivalent to cache unless an
ssh connection is provided. If a string is provided, it will be the
cache path. Default to the basename of source.`
      }
    },
    required: ['source'],
    anyOf: [
      {
        required: ['target']
      },
      {
        required: ['cache_file']
      },
      {
        required: ['cache_dir']
      }
    ]
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var $status, _hash, algo, cookie, hash, header, ref, u;
  if (config.target == null) {
    config.target = config.cache_file;
  }
  if (config.target == null) {
    config.target = path.basename(config.source);
  }
  config.target = path.resolve(config.cache_dir, config.target);
  if (/^file:\/\//.test(config.source)) {
    config.source = config.source.substr(7);
  }
  // todo, also support config.algo and config.hash
  // replace alog and _hash with
  // config.algo = null
  // config.hash = false
  if (config.md5 != null) {
    algo = 'md5';
    _hash = config.md5;
  } else if (config.sha1 != null) {
    algo = 'sha1';
    _hash = config.sha1;
  } else if (config.sha256 != null) {
    algo = 'sha256';
    _hash = config.sha256;
  } else {
    algo = 'md5';
    _hash = false;
  }
  u = url.parse(config.source);
  if (u.protocol !== null) {
    log({
      message: "Bypass source hash computation for non-file protocols",
      level: 'WARN'
    });
  } else {
    if (_hash === true) {
      _hash = (await this.fs.hash(config.source));
      _hash = (_hash != null ? _hash.hash : void 0) ? _hash.hash : false;
      log({
        message: `Computed hash value is '${_hash}'`,
        level: 'INFO'
      });
    }
  }
  // Download the file if
  // - file doesnt exist
  // - option force is provided
  // - hash isnt true and doesnt match
  ({$status} = (await this.call(async function() {
    var exists, hash;
    log({
      message: `Check if target (${config.target}) exists`,
      level: 'DEBUG'
    });
    ({exists} = (await this.fs.base.exists({
      target: config.target
    })));
    if (exists) {
      log({
        message: "Target file exists",
        level: 'INFO'
      });
      // If no checksum , we ignore MD5 check
      if (config.force) {
        log({
          message: "Force mode, cache will be overwritten",
          level: 'DEBUG'
        });
        return true;
      } else if (_hash && typeof _hash === 'string') {
        // then we compute the checksum of the file
        log({
          message: `Comparing ${algo} hash`,
          level: 'DEBUG'
        });
        ({hash} = (await this.fs.hash(config.target)));
        // And compare with the checksum provided by the user
        if (_hash === hash) {
          log({
            message: "Hashes match, skipping",
            level: 'DEBUG'
          });
          return false;
        }
        log({
          message: "Hashes don't match, delete then re-download",
          level: 'WARN'
        });
        await this.fs.base.unlink({
          target: config.target
        });
        return true;
      } else {
        log({
          message: "Target file exists, check disabled, skipping",
          level: 'DEBUG'
        });
        return false;
      }
    } else {
      log({
        message: "Target file does not exists",
        level: 'INFO'
      });
      return true;
    }
  })));
  if (!$status) {
    return $status;
  }
  // Place into cache
  if (ref = u.protocol, indexOf.call(protocols_http, ref) >= 0) {
    await this.fs.mkdir({
      $ssh: config.cache_local ? false : void 0,
      target: path.dirname(config.target)
    });
    await this.execute({
      $ssh: config.cache_local ? false : void 0,
      $unless_exists: config.target,
      command: [
        'curl',
        config.fail ? '--fail' : void 0,
        u.protocol === 'https:' ? '--insecure' : void 0,
        config.location ? '--location' : void 0,
        ...((function() {
          var i,
        len,
        ref1,
        results;
          ref1 = config.http_headers;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            header = ref1[i];
            results.push(`--header '${header.replace('\'',
        '\\\'')}'`);
          }
          return results;
        })()),
        ...((function() {
          var i,
        len,
        ref1,
        results;
          ref1 = config.cookies;
          results = [];
          for (i = 0, len = ref1.length; i < len; i++) {
            cookie = ref1[i];
            results.push(`--cookie '${cookie.replace('\'',
        '\\\'')}'`);
          }
          return results;
        })()),
        `-s ${config.source}`,
        `-o ${config.target}`,
        config.proxy ? `-x ${config.proxy}` : void 0
      ].join(' ')
    });
  } else {
    await this.fs.mkdir({ // todo: copy shall handle this
      target: `${path.dirname(config.target)}`
    });
    await this.fs.copy({
      source: `${config.source}`,
      target: `${config.target}`
    });
  }
  // Validate the cache
  ({hash} = (await this.fs.hash({
    $if: _hash,
    target: config.target
  })));
  if (hash == null) {
    hash = false;
  }
  if (_hash !== hash) {
    throw errors.NIKITA_FILE_INVALID_TARGET_HASH({
      config: config,
      hash: hash,
      _hash: _hash
    });
  }
  return {};
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'source',
    definitions: definitions
  }
};

module.exports.protocols_http = protocols_http = ['http:', 'https:'];

module.exports.protocols_ftp = protocols_ftp = ['ftp:', 'ftps:'];

// ## Errors
errors = {
  NIKITA_FILE_INVALID_TARGET_HASH: function({config, hash, _hash}) {
    return utils.error('NIKITA_FILE_INVALID_TARGET_HASH', [`target ${JSON.stringify(config.target)} got ${hash} instead of ${_hash}`]);
  }
};

// ## Dependencies
path = require('path');

url = require('url');

utils = require('./utils');
