// Generated by CoffeeScript 2.7.0
// # `nikita.lxc.list`

// List the networks managed by LXD.

// ## Example

// ```js
// const { list } = await nikita.lxc.network.list();
// console.info(`LXD networks: ${list}`);
// ```

// ## Schema definitions
var definitions, handler;

definitions = {};

// ## Handler
handler = async function({config}) {
  var data, i;
  ({data} = (await this.lxc.query({
    $shy: false,
    path: "/1.0/networks"
  })));
  return {
    list: (function() {
      var j, len, results;
      results = [];
      for (j = 0, len = data.length; j < len; j++) {
        i = data[j];
        results.push(i.split('/').pop());
      }
      return results;
    })()
  };
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions,
    shy: true
  }
};
