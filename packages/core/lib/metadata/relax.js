// Generated by CoffeeScript 2.5.1
var utils;

utils = require('../utils');

module.exports = {
  name: '@nikitajs/core/lib/metadata/relax',
  hooks: {
    'nikita:session:action': function(action, handler) {
      var base;
      if ((base = action.metadata).relax == null) {
        base.relax = false;
      }
      if (typeof action.metadata.relax === 'string' || action.metadata.relax instanceof RegExp) {
        action.metadata.relax = [action.metadata.relax];
      }
      if (!(typeof action.metadata.relax === 'boolean' || action.metadata.relax instanceof Array)) {
        throw utils.error('METADATA_RELAX_INVALID_VALUE', ["configuration `relax` expects a boolean, string, array or regexp", `value, got ${JSON.stringify(action.metadata.relax)}.`]);
      }
      return handler;
    },
    'nikita:session:result': function(args) {
      if (!args.action.metadata.relax) {
        return;
      }
      if (!args.error) {
        return;
      }
      if (args.error.code === 'METADATA_RELAX_INVALID_VALUE') {
        return;
      }
      if (args.action.metadata.relax === true || args.action.metadata.relax.includes(args.error.code) || args.action.metadata.relax.some(function(v) {
        return args.error.code.match(v);
      })) {
        if (args.output == null) {
          args.output = {};
        }
        args.output.error = args.error;
        return args.error = void 0;
      }
    }
  }
};
