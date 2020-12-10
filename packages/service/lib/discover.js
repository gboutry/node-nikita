// Generated by CoffeeScript 2.5.1
// # `nikita.service.discover`

// Discover the OS init loader.
// For now it only supports Centos/Redhat OS in version 6 or 7, Ubuntu.
// Store properties in the nikita state object.

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `status`   
//   Indicate a change in service such as a change in installation, update, 
//   start/stop or startup registration.   
// * `loader`   
//   the init loader name   

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'strict': {
      type: 'boolean',
      default: false,
      description: `Throw an error if the OS is not supported.`
    },
    'shy': {
      type: 'boolean',
      default: true
    },
    'cache': {
      type: 'boolean',
      default: true,
      description: `Disable cache.`
    }
  }
};

// ## Handler
handler = async function({
    config,
    parent: {state}
  }) {
  var data, detected, err, loader;
  detected = false;
  loader = null;
  if (state['nikita:service:loader'] == null) {
    try {
      data = (await this.execute({
        shy: config.shy,
        command: `if command -v systemctl >/dev/null; then exit 1; fi ;
if command -v service >/dev/null; then exit 2; fi ;
exit 3 ;`,
        code: [1, 2]
      }));
      loader = (function() {
        switch (data.code) {
          case 1:
            return 'systemctl';
          case 2:
            return 'service';
        }
      })();
      if (config.cache) {
        state['nikita:service:loader'] = loader;
      }
      if (config.cache && (loader == null)) {
        loader = state['nikita:service:loader'] != null;
      }
      return {
        status: data.status,
        loader: loader
      };
    } catch (error) {
      err = error;
      if (err.exit_code === 3 && config.strict) {
        throw Error("Undetected Operating System Loader");
      }
    }
  }
};

// ## Export
module.exports = {
  handler: handler,
  schema: schema
};
