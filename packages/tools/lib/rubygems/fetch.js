// Generated by CoffeeScript 2.6.0
// # `nikita.tools.rubygems.fetch`

// Fetch a Ruby gem.

// ## Output

// * `$status`   
//   Indicate if a gem was fetch.
// * `filename`   
//   Name of the gem file.
// * `filepath`   
//   Path of the gem file.

// ## Example

// ```js
// const {$status, filename, filepath} = await nikita.tools.rubygems.fetch({
//   name: 'json',
//   version: '2.1.0',
//   cwd: '/tmp/my_gems'
// })
// console.info(`Gem fetched: ${$status}`)
// ```

// ## Implementation

// We do not support gem returning specification with binary strings because we
// couldn't find any suitable parser on NPM.

// ## Schema definitions
var definitions, handler, path;

definitions = {
  config: {
    type: 'object',
    properties: {
      'cwd': {
        type: 'string',
        description: `Directory storing gems.`
      },
      'gem_bin': {
        type: 'string',
        default: 'gem',
        description: `Path to the gem command.`
      },
      'name': {
        type: 'string',
        description: `Name of the gem.`
      },
      'version': {
        type: 'string',
        description: `Version of the gem.`
      }
    },
    required: ['name']
  }
};

// ## Handler
handler = async function({config}) {
  var $status, k, ref, stdout, v;
  // Global Options
  if (config.ruby == null) {
    config.ruby = {};
  }
  ref = config.ruby;
  for (k in ref) {
    v = ref[k];
    if (config[k] == null) {
      config[k] = v;
    }
  }
  // Get version
  if (!config.version) {
    ({$status, stdout} = (await this.execute({
      $shy: true,
      command: `${config.gem_bin} specification ${config.name} version -r | grep '^version' | sed 's/.*: \\(.*\\)$/\\1/'`,
      cwd: config.cwd,
      bash: config.bash
    })));
    if ($status) {
      config.version = stdout.trim();
    }
  }
  config.target = `${config.name}-${config.version}.gem`;
  // Fetch package
  ({$status} = (await this.execute({
    command: `${config.gem_bin} fetch ${config.name} -v ${config.version}`,
    cwd: config.cwd,
    bash: config.bash
  })));
  return {
    $status: $status,
    filename: config.target,
    filepath: path.resolve(config.cwd, config.target)
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'ruby',
    definitions: definitions
  }
};

// ## Dependencies
path = require('path');
