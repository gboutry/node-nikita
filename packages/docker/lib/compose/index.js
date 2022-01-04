// Generated by CoffeeScript 2.6.1
// # `nikita.docker.compose`

// Create and start containers according to a docker-compose.yml file
// `nikita.docker.compose` is an alias to `nikita.docker.compose.up`

// ## Output

// *   `err`   
//     Error object if any.   
// *   `executed`   
//     if command was executed   
// *   `stdout`   
//     Stdout value(s) unless `stdout` option is provided.   
// *   `stderr`   
//     Stderr value(s) unless `stderr` option is provided.   

// ## Schema definitions
var definitions, handler, path, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'content': {
        type: 'object',
        description: `The content of the docker-compose.yml to write if not exist.`
      },
      'eof': {
        type: 'boolean',
        default: true,
        description: `Inherited from nikita.file use when writing docker-compose.yml file.`
      },
      'backup': {
        type: ['string', 'boolean'],
        default: false,
        description: `Create a backup, append a provided string to the filename extension or
a timestamp if value is not a string, only apply if the target file
exists and is modified.`
      },
      'detached': {
        type: 'boolean',
        default: true,
        description: `Run containers in detached mode.`
      },
      'force': {
        type: 'boolean',
        default: false,
        description: `Force to re-create the containers if the config and image have not
changed.`
      },
      'services': {
        type: 'array',
        items: {
          type: 'string'
        },
        description: `Specify specific services to create.`
      },
      'target': {
        type: 'string',
        description: `The docker-compose.yml absolute's file's path, required if no content
is specified.`
      }
    }
  }
};

// ## Handler
handler = async function({
    config,
    tools: {find, log}
  }) {
  var $status, clean_target, containers, err, k, ref, stdout, v;
  // Global config
  config.docker = (await find(function({
      config: {docker}
    }) {
    return docker;
  }));
  ref = config.docker;
  for (k in ref) {
    v = ref[k];
    if (config[k] == null) {
      config[k] = v;
    }
  }
  if ((config.target == null) && (config.content == null)) {
    // Validate parameters
    throw Error('Missing docker-compose content or target');
  }
  if (config.content && (config.target == null)) {
    if (config.target == null) {
      config.target = `/tmp/nikita_docker_compose_${Date.now()}/docker-compose.yml`;
    }
    clean_target = true;
  }
  if (config.compose_env == null) {
    config.compose_env = [];
  }
  if (config.compose_env.length && (config.target_env == null)) {
    if (config.target_env == null) {
      config.target_env = `/tmp/nikita_docker_compose_${Date.now()}/.env`;
    }
    clean_target = true;
  }
  if (config.recreate == null) {
    config.recreate = false; // TODO: move to schema
  }
  if (config.services == null) {
    config.services = [];
  }
  if (!Array.isArray(config.services)) {
    config.services = [config.services];
  }
  await this.file.yaml({
    $if: config.content != null,
    backup: config.backup,
    content: config.content,
    eof: config.eof,
    target: config.target
  });
  await this.file({
    $if: config.compose_env.length,
    backup: config.backup,
    // If compose_env is an object
    // content: Object.keys(config.compose_env)
    //   .map( (key) => "#{key}=#{config.compose_env[key]}")
    //   .join('\n')
    // If compose_env is an array
    content: config.compose_env.join('\n'),
    eof: config.eof,
    target: config.target_env
  });
  ({$status, stdout} = (await this.docker.tools.execute({
    $shy: true,
    command: `--file ${config.target} ps -q | xargs docker ${utils.opts(config)} inspect`,
    compose: true,
    cwd: config.cwd,
    uid: config.uid,
    code: [0, 123],
    stdout_log: false
  })));
  if (!$status) {
    $status = true;
  } else {
    containers = JSON.parse(stdout);
    $status = containers.some(function(container) {
      return !container.State.Running;
    });
    if ($status) {
      log("Docker created, need start");
    }
  }
  try {
    return (await this.docker.tools.execute({
      $if: config.force || $status,
      command: [`--file ${config.target} up`, config.detached ? '-d' : void 0, config.force ? '--force-recreate' : void 0, ...config.services].join(' '),
      compose: true,
      cwd: path.dirname(config.target),
      uid: config.uid
    }));
  } catch (error) {
    err = error;
    throw err;
  } finally {
    await this.fs.remove({
      $if: clean_target,
      target: config.target
    });
    await this.fs.remove({
      $if: clean_target && config.target_env,
      target: config.target_env
    });
  }
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};

// ## Dependencies
utils = require('../utils');

path = require('path');
