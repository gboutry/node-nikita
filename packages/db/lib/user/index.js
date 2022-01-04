// Generated by CoffeeScript 2.6.1
// # `nikita.db.user`

// Create a user for the destination database.

// ## Schema definitions
var command, definitions, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      'username': {
        type: 'string',
        description: `The username of a user with privileges on the database, used unless
admin_username is provided.`
      },
      'password': {
        type: 'string',
        description: `The password of a user with privileges on the database, used unless
admin_password is provided.`
      },
      'admin_username': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/admin_username'
      },
      'admin_password': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/admin_password'
      },
      'engine': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/engine'
      },
      'host': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/host'
      },
      'port': {
        $ref: 'module://@nikitajs/db/lib/query#/definitions/config/properties/port'
      }
    },
    required: ['username', 'password', 'admin_username', 'admin_password', 'engine', 'host']
  }
};

// ## Hander
handler = async function({config}) {
  var command_password_change, command_password_is_invalid, command_user_create, command_user_exists;
  // Commands
  switch (config.engine) {
    case 'mariadb':
      command_user_exists = command(config, `SELECT User FROM mysql.user WHERE User='${config.username}'`) + ` | grep ${config.username}`;
      command_user_create = command(config, `CREATE USER ${config.username} IDENTIFIED BY '${config.password}';`);
      command_password_is_invalid = command(config, {
        admin_username: config.username,
        admin_password: config.password
      }, '\\dt') + " 2>&1 >/dev/null | grep -e '^ERROR 1045.*'";
      command_password_change = command(config, `SET PASSWORD FOR ${config.username} = PASSWORD ('${config.password}');`);
      break;
    case 'mysql':
      command_user_exists = command(config, `SELECT User FROM mysql.user WHERE User='${config.username}'`) + ` | grep ${config.username}`;
      command_user_create = command(config, `CREATE USER ${config.username} IDENTIFIED BY '${config.password}';`);
      command_password_is_invalid = command(config, {
        admin_username: config.username,
        admin_password: config.password
      }, '\\dt') + " 2>&1 >/dev/null | grep -e '^ERROR 1045.*'";
      command_password_change = command(config, `ALTER USER ${config.username} IDENTIFIED BY '${config.password}';`);
      break;
    case 'postgresql':
      command_user_exists = command(config, `SELECT 1 FROM pg_roles WHERE rolname='${config.username}'`) + " | grep 1";
      command_user_create = command(config, `CREATE USER ${config.username} WITH PASSWORD '${config.password}';`);
      command_password_is_invalid = command(config, {
        admin_username: config.username,
        admin_password: config.password
      }, '\\dt') + " 2>&1 >/dev/null | grep -e '^psql:\\sFATAL.*password\\sauthentication\\sfailed\\sfor\\suser.*'";
      command_password_change = command(config, `ALTER USER ${config.username} WITH PASSWORD '${config.password}';`);
  }
  return (await this.execute({
    command: `signal=3
if ${command_user_exists}; then
  echo '[INFO] User already exists'
else
  ${command_user_create}
  echo '[WARN] User created'
  signal=0
fi
if [ $signal -eq 3 ]; then
  if ! ${command_password_is_invalid}; then
    echo '[INFO] Password not modified'
  else
    ${command_password_change}
    echo '[WARN] Password modified'
    signal=0
  fi
fi
exit $signal`,
    code: [, 3],
    trap: true
  }));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    global: 'db',
    definitions: definitions
  }
};

// ## Dependencies
({command} = require('../query'));
