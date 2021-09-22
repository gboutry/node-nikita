// Generated by CoffeeScript 2.6.0
var registry, utils;

registry = require('./registry');

utils = require('./utils');

module.exports = {
  '': {
    handler: (function() {})
  },
  'assert': '@nikitajs/core/lib/actions/assert',
  'call': {
    '': '@nikitajs/core/lib/actions/call'
  },
  'execute': {
    '': '@nikitajs/core/lib/actions/execute',
    'assert': '@nikitajs/core/lib/actions/execute/assert',
    'wait': '@nikitajs/core/lib/actions/execute/wait'
  },
  'fs': {
    'base': {
      'chmod': '@nikitajs/core/lib/actions/fs/base/chmod',
      'chown': '@nikitajs/core/lib/actions/fs/base/chown',
      'copy': '@nikitajs/core/lib/actions/fs/base/copy',
      'createReadStream': '@nikitajs/core/lib/actions/fs/base/createReadStream',
      'createWriteStream': '@nikitajs/core/lib/actions/fs/base/createWriteStream',
      'exists': '@nikitajs/core/lib/actions/fs/base/exists',
      'lstat': '@nikitajs/core/lib/actions/fs/base/lstat',
      'mkdir': '@nikitajs/core/lib/actions/fs/base/mkdir',
      'readdir': '@nikitajs/core/lib/actions/fs/base/readdir',
      'readFile': '@nikitajs/core/lib/actions/fs/base/readFile',
      'readlink': '@nikitajs/core/lib/actions/fs/base/readlink',
      'rename': '@nikitajs/core/lib/actions/fs/base/rename',
      'rmdir': '@nikitajs/core/lib/actions/fs/base/rmdir',
      'stat': '@nikitajs/core/lib/actions/fs/base/stat',
      'symlink': '@nikitajs/core/lib/actions/fs/base/symlink',
      'unlink': '@nikitajs/core/lib/actions/fs/base/unlink',
      'writeFile': '@nikitajs/core/lib/actions/fs/base/writeFile'
    },
    'assert': '@nikitajs/core/lib/actions/fs/assert',
    'chmod': '@nikitajs/core/lib/actions/fs/chmod',
    'chown': '@nikitajs/core/lib/actions/fs/chown',
    'copy': '@nikitajs/core/lib/actions/fs/copy',
    'glob': '@nikitajs/core/lib/actions/fs/glob',
    'hash': '@nikitajs/core/lib/actions/fs/hash',
    'link': '@nikitajs/core/lib/actions/fs/link',
    'mkdir': '@nikitajs/core/lib/actions/fs/mkdir',
    'move': '@nikitajs/core/lib/actions/fs/move',
    'remove': '@nikitajs/core/lib/actions/fs/remove',
    'wait': '@nikitajs/core/lib/actions/fs/wait'
  },
  'registry': {
    'get': {
      metadata: {
        raw: true
      },
      handler: function({
          parent,
          args: [namespace]
        }) {
        return parent.registry.get(namespace);
      }
    },
    'register': {
      metadata: {
        raw: true
      },
      handler: function({
          parent,
          args: [namespace, action]
        }) {
        return parent.registry.register(namespace, action);
      }
    },
    'registered': {
      metadata: {
        raw: true
      },
      handler: function({
          parent,
          args: [namespace]
        }) {
        return parent.registry.registered(namespace);
      }
    },
    'unregister': {
      metadata: {
        raw: true
      },
      handler: function({
          parent,
          args: [namespace]
        }) {
        return parent.registry.unregister(namespace);
      }
    }
  },
  'ssh': {
    'open': '@nikitajs/core/lib/actions/ssh/open',
    'close': '@nikitajs/core/lib/actions/ssh/close',
    'root': '@nikitajs/core/lib/actions/ssh/root'
  },
  'wait': '@nikitajs/core/lib/actions/wait'
};

(async function() {
  var err;
  try {
    return (await registry.register(module.exports));
  } catch (error) {
    err = error;
    console.error(err.stack);
    return process.exit(1);
  }
})();
