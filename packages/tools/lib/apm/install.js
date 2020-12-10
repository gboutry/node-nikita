// Generated by CoffeeScript 2.5.1
  // # `nikita.tools.apm`

// Install Atom packages with APM.

// ## Hooks
var handler, on_action, schema,
  indexOf = [].indexOf;

on_action = function({config, metadata}) {
  if (typeof metadata.argument === 'string') {
    config.name = metadata.argument;
  }
  if (typeof config.name === 'string') {
    return config.name = [config.name];
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'name': {
      type: 'array',
      items: {
        type: 'string'
      },
      description: `Name of the package(s) to install.`
    },
    'upgrade': {
      type: 'boolean',
      default: false,
      description: `Upgrade all packages.`
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var install, installed, outdated, pkgs, stdout, upgrade;
  config.name = config.name.map(function(pkg) {
    return pkg.toLowerCase();
  });
  outdated = [];
  installed = [];
  // Note, cant see a difference between update and upgrade after printing help
  ({stdout} = (await this.execute({
    command: "apm outdated --json",
    shy: true
  })));
  pkgs = JSON.parse(stdout);
  outdated = pkgs.map(function(pkg) {
    return pkg.name.toLowerCase();
  });
  if (config.upgrade && outdated.length) {
    await this.execute({
      command: "apm upgrade --no-confirm"
    });
    outdated = [];
  }
  ({stdout} = (await this.execute({
    command: "apm list --installed --json",
    shy: true
  })));
  pkgs = JSON.parse(stdout);
  installed = pkgs.user.map(function(pkg) {
    return pkg.name.toLowerCase();
  });
  // Upgrade
  upgrade = config.name.filter(function(pkg) {
    return indexOf.call(outdated, pkg) >= 0;
  });
  if (upgrade.length) {
    await this.execute({
      command: `apm upgrade ${upgrade.join(' ')}`
    });
    log({
      message: `APM Updated Packages: ${upgrade.join(', ')}`
    });
  }
  // Install
  install = config.name.filter(function(pkg) {
    return indexOf.call(installed, pkg) < 0;
  });
  if (install.length) {
    await this.execute({
      command: `apm install ${install.join(' ')}`
    });
    return log({
      message: `APM Installed Packages: ${install.join(', ')}`
    });
  }
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  schema: schema
};
