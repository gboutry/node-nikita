// Generated by CoffeeScript 2.5.1
// # `nikita.docker.unpause`

// Unpause all processes within a container.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   True if container was unpaused.

// ## Example

// ```js
// const {status} = await nikita.docker.unpause({
//   container: 'toto'
// })
// console.info(`Container was unpaused: ${status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'boot2docker': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/boot2docker'
    },
    'container': {
      type: 'string',
      description: `Name/ID of the container`
    },
    'compose': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/compose'
    },
    'machine': {
      $ref: 'module://@nikitajs/docker/lib/tools/execute#/properties/machine'
    }
  },
  required: ['container']
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  if (config.container == null) {
    // Validation
    throw Error('Missing container parameter');
  }
  return (await this.docker.tools.execute({
    command: `unpause ${config.container}`
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'docker',
    schema: schema
  }
};
