// Generated by CoffeeScript 2.5.1
// # `nikita.lxd.stop`

// Stop a running Linux Container.

// ## Example

// ```js
// const {status} = await nikita.lxd.stop({
//   container: "myubuntu"
// })
// console.info(`The container was stopped: ${status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'container': {
      $ref: 'module://@nikitajs/lxd/lib/init#/properties/container'
    }
  },
  required: ['container']
};

// ## Handler
handler = async function({config}) {
  return (await this.execute({
    command: `lxc list -c ns --format csv | grep '${config.container},STOPPED' && exit 42
lxc stop ${config.container}`,
    code_skipped: 42
  }));
};

// ## Export
module.exports = {
  handler: handler,
  metadata: {
    schema: schema
  }
};
