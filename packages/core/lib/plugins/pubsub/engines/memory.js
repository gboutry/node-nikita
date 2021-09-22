// Generated by CoffeeScript 2.6.0
// # `nikita.kv.memory`

// ## Source Code
module.exports = function() {
  var store;
  store = {};
  return {
    set: function(key, value) {
      var base, promise, results;
      if (store[key] == null) {
        store[key] = {};
      }
      store[key].value = value;
      if ((base = store[key]).promises == null) {
        base.promises = [];
      }
      results = [];
      while (promise = store[key].promises.shift()) {
        results.push(promise.call(null, store[key].value));
      }
      return results;
    },
    get: function(key) {
      return new Promise(function(resolve) {
        var base, ref, ref1;
        if ((ref = store[key]) != null ? ref.value : void 0) {
          return resolve((ref1 = store[key]) != null ? ref1.value : void 0);
        } else {
          if (store[key] == null) {
            store[key] = {};
          }
          if ((base = store[key]).promises == null) {
            base.promises = [];
          }
          return store[key].promises.push(resolve);
        }
      });
    }
  };
};
