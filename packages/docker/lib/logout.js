// Generated by CoffeeScript 2.6.0
// # `nikita.docker.logout`

// Log out from a Docker registry or the one defined by the `registry` option.

// ## Output

// * `err`   
//   Error object if any.   
// * `$status`   
//   True if logout.

// ## Schema definitions
var definitions, handler, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'docker': {
        $ref: 'module://@nikitajs/docker/lib/tools/execute#/definitions/docker'
      },
      'registry': {
        type: 'string',
        description: `Address of the registry server, default to "https://index.docker.io/v1/".`
      }
    }
  }
};

// ## Handler
handler = async function({config}) {
  var command;
  if (config.container == null) {
    // Validate parameters
    return callback(Error('Missing container parameter'));
  }
  // rm is false by default only if config.service is true
  command = 'logout';
  if (config.registry != null) {
    command += ` \"${config.registry}\"`;
  }
  return (await this.execute({
    command: utils.wrap(config, command)
  }, docker.callback));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'docker',
    definitions: definitions
  }
};

// ## Dependencies
utils = require('./utils');
