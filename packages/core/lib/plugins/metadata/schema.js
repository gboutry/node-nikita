// Generated by CoffeeScript 2.6.0
/*
The plugin enrich the config object with default values defined in the JSON
schema. Thus, it mst be defined after every module which modify the config
object.
*/
var mutate, utils;

utils = require('../../utils');

({mutate} = require('mixme'));

module.exports = {
  name: '@nikitajs/core/lib/plugins/metadata/schema',
  require: ['@nikitajs/core/lib/plugins/tools/schema'],
  hooks: {
    'nikita:schema': function({schema}) {
      return mutate(schema.definitions.metadata.properties, {
        definitions: {
          type: 'object',
          description: `Schema definition or \`false\` to disable schema validation in the
current action.`
        }
      });
    },
    'nikita:action': {
      after: ['@nikitajs/core/lib/plugins/global', '@nikitajs/core/lib/plugins/metadata/disabled'],
      handler: async function(action) {
        var err;
        if (action.metadata.schema === false) {
          return;
        }
        err = (await action.tools.schema.validate(action));
        if (err) {
          throw err;
        }
      }
    }
  }
};
