// Generated by CoffeeScript 2.6.0
  // # `nikita.tools.npm.uninstall`

// Remove one or more NodeJS packages.

// ## Example

// The following action uninstalls the coffescript package globally.

// ```js
  // const {$status} = await nikita.tools.npm.uninstall({
  //   name: 'coffeescript',
  //   global: true
  // })
  // console.info(`Package was uninstalled: ${$status}`)
  // ```

// ## Schema definitions
var definitions, handler,
  indexOf = [].indexOf;

definitions = {
  config: {
    type: 'object',
    properties: {
      'cwd': {
        $ref: 'module://@nikitajs/core/lib/actions/execute#/definitions/config/properties/cwd'
      },
      'name': {
        type: 'array',
        items: {
          type: 'string'
        },
        description: `Name of the package(s) to remove.`
      },
      'global': {
        type: 'boolean',
        default: false,
        description: `Uninstalls the current package context as a global package.`
      }
    },
    required: ['name'],
    if: {
      properties: {
        'global': {
          const: false
        }
      }
    },
    then: {
      required: ['cwd']
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var global, installed, pkgs, stdout, uninstall;
  global = config.global ? '-g' : '';
  // Get installed packages
  installed = [];
  ({stdout} = (await this.execute({
    $shy: true,
    command: `npm list --json ${global}`,
    code: [0, 1],
    cwd: config.cwd,
    stdout_log: false
  })));
  pkgs = JSON.parse(stdout);
  if (Object.keys(pkgs).length) {
    installed = Object.keys(pkgs.dependencies);
  }
  // Uninstall
  uninstall = config.name.filter(function(pkg) {
    return indexOf.call(installed, pkg) >= 0;
  });
  if (!uninstall.length) {
    return;
  }
  await this.execute({
    command: `npm uninstall ${global} ${uninstall.join(' ')}`,
    cwd: config.cwd
  });
  return log({
    message: `NPM uninstalled packages: ${uninstall.join(', ')}`
  });
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'name',
    definitions: definitions
  }
};
