// Generated by CoffeeScript 2.6.0
var selfTemplated;

selfTemplated = require('self-templated');

module.exports = {
  name: '@nikitajs/core/lib/plugins/templated',
  hooks: {
    'nikita:action': {
      // Note, conditions plugins define templated as a dependency
      before: ['@nikitajs/core/lib/plugins/metadata/schema'],
      handler: async function(action) {
        var templated;
        templated = (await action.tools.find(function(action) {
          return action.metadata.templated;
        }));
        if (templated !== true) {
          return;
        }
        return selfTemplated(action, {
          array: true,
          compile: false,
          mutate: true,
          partial: {
            assertions: true,
            conditions: true,
            config: true,
            metadata: true
          }
        });
      }
    }
  }
};
