// Generated by CoffeeScript 2.6.0
// # `nikita.db.query`

// Make requests to a database.

// ## Hooks
var command, connection_config, definitions, escape, handler, jdbc, on_action, utils;

on_action = function({config}) {
  var ref;
  return config.engine = (ref = config.engine) != null ? ref.toLowerCase() : void 0;
};

// ## Schema definitions
definitions = {
  config: {
    type: 'object',
    properties: {
      'admin_username': {
        type: 'string',
        description: `The login of the database administrator. It should have the necessary
permissions such as to  create accounts when using the
\`nikita.db.user\` action.`
      },
      'admin_password': {
        type: 'string',
        description: `The password of the database administrator.`
      },
      'database': {
        type: ['null', 'string'],
        description: `The default database name, provide the value \`null\` if you want to
ensore no default database is set.`
      },
      'grep': {
        oneOf: [
          {
            type: 'string'
          },
          {
            instanceof: 'RegExp'
          }
        ],
        description: `Ensure the query output match a string or a regular expression`
      },
      'engine': {
        type: 'string',
        enum: ['mariadb', 'mysql', 'postgresql'],
        description: `The engine type, can be MariaDB, MySQL or PostgreSQL. Values
are converted to lower cases.`
      },
      'host': {
        type: 'string',
        description: `The hostname of the database.`
      },
      'port': {
        type: 'integer',
        description: `Port to the associated database.`
      },
      'silent': {
        type: 'boolean',
        default: true
      },
      'trim': {
        type: 'boolean',
        default: false
      }
    },
    required: ['admin_password', 'command', 'engine', 'host', 'admin_username']
  }
};

// ## Handler
handler = async function({config}) {
  var $status, stdout;
  ({$status, stdout} = (await this.execute({
    command: command(config),
    trim: config.trim
  })));
  if (config.grep && typeof config.grep === 'string') {
    return {
      stdout: stdout,
      $status: stdout.split('\n').some(function(line) {
        return line === config.grep;
      })
    };
  }
  if (config.grep && utils.regexp.is(config.grep)) {
    return {
      stdout: stdout,
      $status: stdout.split('\n').some(function(line) {
        return config.grep.test(line);
      })
    };
  }
  return {
    status: $status,
    stdout: stdout
  };
};


// ## Escape

// Escape SQL for Bash processing.
escape = function(sql) {
  return sql.replace(/[\\"]/g, "\\$&");
};

// ## Command

// Build the CLI query command.
command = function(...opts) {
  var config, i, k, len, opt, v;
  config = {};
  for (i = 0, len = opts.length; i < len; i++) {
    opt = opts[i];
    if (typeof opt === 'string') {
      opt = {
        command: opt
      };
    }
    for (k in opt) {
      v = opt[k];
      config[k] = v;
    }
  }
  switch (config.engine) {
    case 'mariadb':
    case 'mysql':
      if (config.path == null) {
        config.path = 'mysql';
      }
      if (config.port == null) {
        config.port = '3306';
      }
      return [
        "mysql",
        `-h${config.host}`,
        `-P${config.port}`,
        `-u${config.admin_username}`,
        `-p'${config.admin_password}'`,
        config.database ? `-D${config.database}` : void 0,
        config.mysql_config ? `${config.mysql_config}` : void 0,
        // -N, --skip-column-names   Don't write column names in results.
        // -s, --silent              Be more silent. Print results with a tab as separator, each row on new line.
        // -r, --raw                 Write fields without conversion. Used with --batch.
        config.silent ? "-N -s -r" : void 0,
        config.command ? `-e \"${escape(config.command)}\"` : void 0
      ].join(' ');
    case 'postgresql':
      if (config.path == null) {
        config.path = 'psql';
      }
      if (config.port == null) {
        config.port = '5432';
      }
      return [
        `PGPASSWORD=${config.admin_password}`,
        "psql",
        `-h ${config.host}`,
        `-p ${config.port}`,
        `-U ${config.admin_username}`,
        config.database ? `-d ${config.database}` : void 0,
        config.postgres_config ? `${config.postgres_config}` : void 0,
        // -t, --tuples-only        Print rows only
        // -A, --no-align           Unaligned table output mode
        // -q, --quiet              Run quietly (no messages, only query output)
        "-tAq",
        config.command ? `-c \"${config.command}\"` : void 0
      ].join(' ');
    default:
      throw Error(`Unsupported engine: ${JSON.stringify(config.engine)}`);
  }
};


// ## Parse JDBC URL

// Enrich the result of `url.parse` with the "engine" and "db" properties.

// Example:

// ```
// parse 'jdbc:mysql://host1:3306,host2:3306/hive?createDatabaseIfNotExist=true'
// { engine: 'mysql',
//   addresses:
//    [ { host: 'host1', port: '3306' },
//      { host: 'host2', port: '3306' } ],
//   database: 'hive' }
// ```
jdbc = function(jdbc) {
  var _, addresses, database, engine;
  if (/^jdbc:mysql:/.test(jdbc)) {
    [_, engine, addresses, database] = /^jdbc:(.*?):\/+(.*?)\/(.*?)(\?(.*)|$)/.exec(jdbc);
    addresses = addresses.split(',').map(function(address) {
      var host, port;
      [host, port] = address.split(':');
      return {
        host: host,
        port: port || 3306
      };
    });
    return {
      engine: 'mysql',
      addresses: addresses,
      database: database
    };
  } else if (/^jdbc:postgresql:/.test(jdbc)) {
    [_, engine, addresses, database] = /^jdbc:(.*?):\/+(.*?)\/(.*?)(\?(.*)|$)/.exec(jdbc);
    addresses = addresses.split(',').map(function(address) {
      var host, port;
      [host, port] = address.split(':');
      return {
        host: host,
        port: port || 5432
      };
    });
    return {
      engine: 'postgresql',
      addresses: addresses,
      database: database
    };
  } else {
    throw Error('Invalid JDBC URL');
  }
};

// ## Copy config
connection_config = function(opts) {
  var config, k, v;
  config = {};
  for (k in opts) {
    v = opts[k];
    if (k !== 'admin_username' && k !== 'admin_password' && k !== 'database' && k !== 'engine' && k !== 'host' && k !== 'port' && k !== 'silent') {
      continue;
    }
    config[k] = v;
  }
  return config;
};

// ## Exports
module.exports = {
  handler: handler,
  hooks: {
    on_action: on_action
  },
  metadata: {
    global: 'db',
    definitions: definitions
  },
  // Utils
  command: command,
  connection_config: connection_config,
  escape: escape,
  jdbc: jdbc
};

// ## Dependencies
utils = require('@nikitajs/core/lib/utils');
