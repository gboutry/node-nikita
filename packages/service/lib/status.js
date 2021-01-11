// Generated by CoffeeScript 2.5.1
// # `nikita.service.status`

// Status of a service.
// Note, does not throw an error if service is not installed.

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `status`   
//   Indicates if the startup behavior has changed.   

// ## Example

// ```js
// const {status} = await nikita.service.status([{
//   ssh: ssh,
//   name: 'gmetad'
// })
// console.info(`Service status: ${status}`)
// ```

// ## Notes

// Historically, we had the following two config:

// * `code_started` (int|string|array)   
// Expected code(s) returned by the command for STARTED status, int or array of
// int, default to 0.   
// * `code_stopped` (int|string|array)   
// Expected code(s) returned by the command for STOPPED status, int or array of 
// int, default to 3.

// We might think about re-integrating them.

// ## Hooks
var handler, on_action, schema;

on_action = function({config, metadata}) {
  if (typeof metadata.argument === 'string') {
    return config.name = metadata.argument;
  }
};

// ## Schema
schema = {
  type: 'object',
  properties: {
    'arch_chroot': {
      $ref: 'module://@nikitajs/engine/lib/actions/execute#/properties/arch_chroot'
    },
    'name': {
      $ref: 'module://@nikitajs/service/lib/install#/properties/name'
    },
    'rootdir': {
      $ref: 'module://@nikitajs/engine/lib/actions/execute#/properties/rootdir'
    }
  },
  required: ['name']
};

// ## Handler
handler = async function({
    config,
    tools: {log}
  }) {
  var err, status;
  log({
    message: `Status for service ${config.name}`,
    level: 'INFO',
    module: 'nikita/lib/service/status'
  });
  try {
    ({status} = (await this.execute({
      command: `ls /lib/systemd/system/*.service /etc/systemd/system/*.service /etc/rc.d/* /etc/init.d/* 2>/dev/null | grep -w "${config.name}" || exit 3
if command -v systemctl >/dev/null 2>&1; then
  systemctl status ${config.name} || exit 3
elif command -v service >/dev/null 2>&1; then
  service ${config.name} status || exit 3
else
  echo "Unsupported Loader" >&2
  exit 2
fi`,
      code: 0,
      code_skipped: 3,
      arch_chroot: config.arch_chroot,
      rootdir: config.rootdir
    })));
    return log({
      message: `Status for ${config.name} is ${status ? 'started' : 'stoped'}`,
      level: 'INFO',
      module: 'nikita/lib/service/status'
    });
  } catch (error) {
    err = error;
    if (err.exit_code === 2) {
      throw Error("Unsupported Loader");
    }
  }
};

// ## Export
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    schema: schema
  }
};
