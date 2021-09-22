// Generated by CoffeeScript 2.6.0
// # `nikita.krb5.addprinc`

// Create a new Kerberos principal with a password or an optional keytab.

// ## Example

// ```js
// const {$status} = await nikita.krb5.addprinc({
//   admin: {
//     password: 'pass',
//     principal: 'me/admin@MY_REALM',
//     server: 'localhost'
//   },
//   keytab: '/etc/security/keytabs/my.service.keytab',
//   gid: 'myservice',
//   principal: 'myservice/my.fqdn@MY.REALM',
//   randkey: true,
//   uid: 'myservice'
// })
// console.info(`Principal was created or modified: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler, mutate, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'admin': {
        $ref: 'module://@nikitajs/krb5/lib/execute#/definitions/config/properties/admin'
      },
      'keytab': {
        type: 'string',
        description: `Path to the file storing key entries.`
      },
      'password': {
        type: 'string',
        description: `Password associated to this principal.`
      },
      'password_sync': {
        type: 'boolean',
        default: false,
        description: `Wether the password should be created if the principal already exists.`
      },
      'principal': {
        type: 'string',
        description: `Principal to be created.`
      },
      'randkey': {
        type: 'boolean',
        description: `Generate a random key.`
      }
    },
    required: ['admin', 'principal'],
    oneOf: [
      {
        required: ['password']
      },
      {
        required: ['randkey']
      }
    ]
  }
};

// ## Handler
handler = async function({config}) {
  var $status, base, cache_name, ref;
  if (/.*@.*/.test((ref = config.admin) != null ? ref.principal : void 0)) {
    // Normalize realm and principal for later usage of config
    if ((base = config.admin).realm == null) {
      base.realm = config.admin.principal.split('@')[1];
    }
  }
  if (!/^\S+@\S+$/.test(config.principal)) {
    config.principal = `${config.principal}@${config.admin.realm}`;
  }
  // Start execution
  ({$status} = (await this.krb5.execute({
    $shy: true,
    admin: config.admin,
    command: `getprinc ${config.principal}`,
    grep: new RegExp(`^.*${utils.regexp.escape(config.principal)}$`)
  })));
  if (!$status) {
    await this.krb5.execute({
      $retry: 3,
      admin: config.admin,
      command: config.password ? `addprinc -pw ${config.password} ${config.principal}` : `addprinc -randkey ${config.principal}`
    });
  }
  if (config.password && config.password_sync) {
    cache_name = `/tmp/nikita_${Math.random()}`;
    await this.krb5.execute({
      $retry: 3,
      // Test the user password
      // On success, write the ticket to a temporary location before cleanup
      $unless_execute: `if ! echo ${config.password} | kinit '${config.principal}' -c '${cache_name}'; then exit 1; else kdestroy -c '${cache_name}'; fi`,
      admin: config.admin,
      command: `cpw -pw ${config.password} ${config.principal}`
    });
  }
  if (!config.keytab) {
    return;
  }
  return (await this.krb5.ktadd(config));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'krb5',
    definitions: definitions
  }
};

// ## Dependencies
utils = require('@nikitajs/core/lib/utils');

({mutate} = require('mixme'));
