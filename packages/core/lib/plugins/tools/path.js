// Generated by CoffeeScript 2.7.0
var os, path;

os = require('os');

path = require('path');

module.exports = {
  name: '@nikitajs/core/lib/plugins/tools/path',
  hooks: {
    'nikita:action': {
      after: '@nikitajs/core/lib/plugins/ssh',
      handler: function(action) {
        if (action.tools == null) {
          action.tools = {};
        }
        // Path is alwaws posix over ssh
        // otherwise it is platform dependent
        action.tools.path = !action.ssh ? os.platform === 'win32' ? path.win32 : path.posix : path.posix;
        // Local is agnostic of ssh
        action.tools.path.local = os.platform === 'win32' ? path.win32 : path.posix;
        // Reinject posix and win32 path for conveniency
        action.tools.path.posix = path.posix;
        return action.tools.path.win32 = path.win32;
      }
    }
  }
};
