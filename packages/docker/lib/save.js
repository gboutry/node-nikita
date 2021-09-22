// Generated by CoffeeScript 2.6.0
// # `nikita.docker.save`

// Save Docker images.

// ## Output

// * `err`   
//   Error object if any.
// * `$status`   
//   True if container was saved.
// * `stdout`   
//   Stdout value(s) unless `stdout` option is provided.
// * `stderr`   
//   Stderr value(s) unless `stderr` option is provided.

// ## Example

// ```js
// const {$status} = await nikita.docker.save({
//   image: 'nikita/load_test:latest',
//   output: `${scratch}/nikita_saved.tar`,
// })
// console.info(`Container was saved: ${$status}`)
// ```

// ## Hooks
var definitions, handler, on_action;

on_action = function({config}) {
  return config.output != null ? config.output : config.output = config.target;
};

// ## Schema definitions
definitions = {
  config: {
    type: 'object',
    properties: {
      'docker': {
        $ref: 'module://@nikitajs/docker/lib/tools/execute#/definitions/docker'
      },
      'image': {
        type: 'string',
        description: `Name/ID of base image.`
      },
      'tag': {
        type: 'string',
        description: `Tag of the image.`
      },
      'output': {
        type: 'string',
        description: `TAR archive output path.`
      },
      'target': {
        type: 'string',
        description: `Shortcut for "output" option, required.`
      }
    },
    required: ['image', 'output']
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  // Saves image to local tmp path, than copy it
  log({
    message: `Extracting image ${config.output} to file:${config.image}`,
    level: 'INFO'
  });
  return (await this.docker.tools.execute({
    command: [`save -o ${config.output} ${config.image}`, config.tag != null ? `:${config.tag}` : void 0].join('')
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    global: 'docker',
    definitions: definitions
  }
};
