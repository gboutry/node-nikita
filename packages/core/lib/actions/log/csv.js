// Generated by CoffeeScript 2.5.1
// # `nikita.log.csv`

// Write log to the host filesystem in CSV.

// ## Config

// * `archive` (boolean)   
//   Save a copy of the previous logs inside a dedicated directory, default is
//   "false".   
// * `basedir` (string)    
//   Directory where to store logs relative to the process working directory.
//   Default to the "log" directory. Note, if the "archive" option is activated
//   log file will be stored accessible from "./log/latest".   
// * `filename` (string)   
//   Name of the log file, contextually rendered with all config passed to
//   the mustache templating engine. Default to "{{shortname}}.log", where 
//   "shortname" is the ssh host or localhost.   

// Global config can be alternatively set with the "log_csv" property.

// ## Handler
var handler, log_fs;

handler = async function({config}) {
  // Obtains config from "log_csv" namespace
  return (await this.call({
    $: log_fs
  }, config, {
    serializer: {
      'nikita:action:start': function({action}) {
        var header, headers, walk;
        if (!action.metadata.header) {
          return;
        }
        walk = function(parent) {
          var precious, results;
          precious = parent.metadata.header;
          results = [];
          if (precious !== void 0) {
            results.push(precious);
          }
          if (parent.parent) {
            results.push(...(walk(parent.parent)));
          }
          return results;
        };
        headers = walk(action);
        header = headers.reverse().join(' : ');
        return `header,,${JSON.stringify(header)}\n`;
      },
      'text': function(log) {
        return `${log.type},${log.level},${JSON.stringify(log.message)}\n`;
      }
    }
  }));
};

// ## Exports
module.exports = {
  ssh: false,
  handler: handler
};

// ## Dependencies
log_fs = require('./fs');
