// Generated by CoffeeScript 2.5.1
var errors, is_object, is_object_literal, merge, normalize_hook, toposort, utils;

({is_object_literal, is_object, merge} = require('mixme'));

toposort = require('toposort');

utils = require('./utils');

normalize_hook = function(event, hook) {
  if (!Array.isArray(hook)) {
    hook = [hook];
  }
  return hook.map(function(hook) {
    if (typeof hook === 'function') {
      hook = {
        handler: hook
      };
    } else if (!is_object(hook || typeof hook !== 'function')) {
      throw utils.error('PLUGINS_HOOK_INVALID_HANDLER', ['no hook handler function could be found,', 'a hook must be defined as a function', 'or as an object with an handler property', `got ${JSON.stringify(hook)}.`]);
    }
    hook.event = event;
    if (typeof hook.after === 'string') {
      // hook.after ?= []
      hook.after = [hook.after];
    }
    if (typeof hook.before === 'string') {
      // hook.before ?= []
      hook.before = [hook.before];
    }
    return hook;
  });
};

module.exports = function({action, chain, parent, plugins = []} = {}) {
  var i, len, obj, plugin, store;
  // Internal plugin store
  store = [];
  // Public API definition
  obj = {
    // Register new plugins
    register: function(plugin) {
      var event, hook, ref;
      if (!is_object_literal(plugin)) {
        throw utils.error('PLUGINS_REGISTER_INVALID_ARGUMENT', ['a plugin must consist of keys representing the hook module name', 'associated with function implementing the hook,', `got ${plugin}.`]);
      }
      if (plugin.hooks == null) {
        plugin.hooks = {};
      }
      ref = plugin.hooks;
      for (event in ref) {
        hook = ref[event];
        plugin.hooks[event] = normalize_hook(event, hook);
      }
      store.push(plugin);
      return chain || this;
    },
    get: function({event, hooks = [], sort = true}) {
      var after, before, edges, edges_after, edges_before, hook, i, index, len, plugin;
      hooks = [
        ...normalize_hook(event,
        hooks),
        ...utils.array.flatten((function() {
          var i,
        len,
        results;
          results = [];
          for (i = 0, len = store.length; i < len; i++) {
            plugin = store[i];
            if (!plugin.hooks[event]) {
              continue;
            }
            results.push((function() {
              var j,
        len1,
        ref,
        results1;
              ref = plugin.hooks[event];
              results1 = [];
              for (j = 0, len1 = ref.length; j < len1; j++) {
                hook = ref[j];
                results1.push(merge({
                  module: plugin.module
                },
        hook));
              }
              return results1;
            })());
          }
          return results;
        })()),
        ...(parent ? parent.get({
          event: event,
          sort: false
        }) : [])
      ];
      if (!sort) {
        return hooks;
      }
      // Topological sort
      index = {};
      for (i = 0, len = hooks.length; i < len; i++) {
        hook = hooks[i];
        index[hook.module] = hook;
      }
      edges_after = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = hooks.length; j < len1; j++) {
          hook = hooks[j];
          if (!hook.after) {
            continue;
          }
          results.push((function() {
            var k, len2, ref, results1;
            ref = hook.after;
            results1 = [];
            for (k = 0, len2 = ref.length; k < len2; k++) {
              after = ref[k];
              // This check assume the plugin has the same hooks which is not always the case
              if (!index[after]) {
                throw errors.PLUGINS_HOOK_AFTER_INVALID({
                  event: event,
                  module: hook.module,
                  after: after
                });
              }
              results1.push([index[after], hook]);
            }
            return results1;
          })());
        }
        return results;
      })();
      edges_before = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = hooks.length; j < len1; j++) {
          hook = hooks[j];
          if (!hook.before) {
            continue;
          }
          results.push((function() {
            var k, len2, ref, results1;
            ref = hook.before;
            results1 = [];
            for (k = 0, len2 = ref.length; k < len2; k++) {
              before = ref[k];
              if (!index[before]) {
                throw errors.PLUGINS_HOOK_BEFORE_INVALID({
                  event: event,
                  module: hook.module,
                  before: before
                });
              }
              results1.push([hook, index[before]]);
            }
            return results1;
          })());
        }
        return results;
      })();
      edges = [...edges_after, ...edges_before];
      edges = utils.array.flatten(edges, 0);
      return toposort.array(hooks, edges);
    },
    // Call a hook against each registered plugin matching the hook event
    hook: async function({args = [], handler, hooks = [], event, silent}) {
      var hook, i, len;
      if (arguments.length !== 1) {
        throw utils.error('PLUGINS_INVALID_ARGUMENTS_NUMBER', ['function hook expect 1 object argument,', `got ${arguments.length} arguments.`]);
      } else if (!is_object_literal(arguments[0])) {
        throw utils.error('PLUGINS_INVALID_ARGUMENT_PROPERTIES', ['function hook expect argument to be a literal object', 'with the event, args, hooks and handler properties,', `got ${JSON.stringify(arguments[0])} arguments.`]);
      } else if (typeof event !== 'string') {
        throw utils.error('PLUGINS_INVALID_ARGUMENT_EVENT', ['function hook expect a event properties in its first argument,', `got ${JSON.stringify(arguments[0])} argument.`]);
      }
      // Retrieve the event hooks
      hooks = this.get({
        hooks: hooks,
        event: event
      });
// Call the hooks
      for (i = 0, len = hooks.length; i < len; i++) {
        hook = hooks[i];
        switch (hook.handler.length) {
          case 1:
            await hook.handler.call(this, args);
            break;
          case 2:
            handler = (await hook.handler.call(this, args, handler));
        }
      }
      if (silent) {
        // Call the final handler
        return handler;
      }
      if (handler) {
        return handler.call(this, args);
      }
    }
  };
// Register initial plugins
  for (i = 0, len = plugins.length; i < len; i++) {
    plugin = plugins[i];
    obj.register(plugin(action));
  }
  // return the object
  return obj;
};

errors = {
  PLUGINS_HOOK_AFTER_INVALID: function({event, module, after}) {
    throw utils.error('PLUGINS_HOOK_AFTER_INVALID', [`the hook ${JSON.stringify(event)}`, module ? `in plugin ${JSON.stringify(module)}` : void 0, 'references an after dependency', `in plugin ${JSON.stringify(after)} which does not exists`]);
  },
  PLUGINS_HOOK_BEFORE_INVALID: function({event, module, before}) {
    throw utils.error('PLUGINS_HOOK_BEFORE_INVALID', [`the hook ${JSON.stringify(event)}`, module ? `in plugin ${JSON.stringify(module)}` : void 0, 'references a before dependency', `in plugin ${JSON.stringify(before)} which does not exists`]);
  }
};
