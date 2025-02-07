// Generated by CoffeeScript 2.7.0
// # `nikita.log.md`

// Write log to the host filesystem in Markdown.

// ## Example

// ```js
// nikita(async function(){
//   await this.log.md({
//     basedir: './logs',
//     filename: 'nikita.log'
//   })
//   await this.call(({tools: {log}}) => {
//     log({message: 'hello'})
//   })
// })
// ```

// ## Schema definitions
var definitions, handler, log_fs, merge;

definitions = {
  config: {
    type: 'object',
    allOf: [
      {
        properties: {
          divider: {
            type: 'string',
            default: ' : ',
            description: `The characters used to join the hierarchy of headers to create a
markdown header.`
          },
          enter: {
            type: 'boolean',
            default: true,
            description: `Enable or disable the entering messages.`
          },
          serializer: {
            type: 'object',
            default: {},
            description: `Internal property, expose access to the serializer object passed
to the \`log.fs\` action.`
          }
        }
      },
      {
        $ref: 'module://@nikitajs/log/lib/fs#/definitions/config'
      }
    ]
  }
};

// ## Handler
handler = async function({config}) {
  var serializer, state;
  state = {};
  serializer = {
    'diff': function(log) {
      if (log.message) {
        return `\n\`\`\`diff\n${log.message}\`\`\`\n`;
      }
    },
    'nikita:action:start': function({action}) {
      var act, bastard, content, header, headers, walk;
      content = [];
      // Header message
      if (action.metadata.header) {
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
        header = headers.reverse().join(config.divider);
        content.push('\n');
        content.push('#'.repeat(headers.length));
        content.push(` ${header}\n`);
      }
      // Entering message
      act = action.parent;
      bastard = void 0;
      while (act) {
        bastard = act.metadata.bastard;
        if (bastard !== void 0) {
          break;
        }
        act = act.parent;
      }
      if (config.enter && action.metadata.module && action.metadata.log !== false && bastard !== true) {
        content.push([
          '\n',
          'Entering',
          ' ',
          `${action.metadata.module}`,
          ' ',
          '(',
          `${(action.metadata.position.map(function(index) {
            return index + 1;
          })).join('.')}`,
          ')',
          '\n'
        ].join(''));
      }
      return content.join('');
    },
    'stdin': function(log) {
      var out;
      out = [];
      if (log.message.indexOf('\n') === -1) {
        out.push(`\nRunning Command: \`${log.message}\`\n`);
      } else {
        out.push(`\n\`\`\`stdin\n${log.message}\n\`\`\`\n`);
      }
      return out.join('');
    },
    // 'stderr': (log) ->
    //   "\n```stderr\n#{log.message}```\n"
    'stdout_stream': function(log) {
      var out;
      if (log.message === null) {
        state.stdout_count = 0;
      } else if (state.stdout_count === void 0) {
        state.stdout_count = 1;
      } else {
        state.stdout_count++;
      }
      out = [];
      if (state.stdout_count === 1) {
        out.push('\n```stdout\n');
      }
      if (state.stdout_count > 0) {
        out.push(log.message);
      }
      if (state.stdout_count === 0) {
        out.push('\n```\n');
      }
      return out.join('');
    },
    'text': function(log) {
      var content;
      content = [];
      content.push(`\n${log.message}`);
      if (log.module && log.module !== '@nikitajs/core/lib/actions/call') {
        content.push(` (${log.depth}.${log.level}, written by ${log.module})`);
      }
      content.push("\n");
      return content.join('');
    }
  };
  config.serializer = merge(serializer, config.serializer);
  return (await this.log.fs(config));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};

// ## Dependencies
({merge} = require('mixme'));

log_fs = require('./fs');
