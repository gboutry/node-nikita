// Generated by CoffeeScript 2.5.1
// Registration of `nikita.file` actions
var registry;

registry = require('@nikitajs/engine/lib/registry');

module.exports = {
  file: {
    '': '@nikitajs/file/lib',
    cache: '@nikitajs/file/lib/cache',
    cson: '@nikitajs/file/lib/cson',
    download: '@nikitajs/file/lib/download',
    ini: '@nikitajs/file/lib/ini',
    json: '@nikitajs/file/lib/json',
    properties: {
      '': '@nikitajs/file/lib/properties',
      read: '@nikitajs/file/lib/properties/read'
    },
    render: '@nikitajs/file/lib/render',
    touch: '@nikitajs/file/lib/touch',
    types: {
      'systemd': {
        'resolved': '@nikitajs/file/lib/types/systemd/resolved',
        'timesyncd': '@nikitajs/file/lib/types/systemd/timesyncd'
      },
      'ceph_conf': '@nikitajs/file/lib/types/ceph_conf',
      'hfile': '@nikitajs/file/lib/types/hfile',
      'krb5_conf': '@nikitajs/file/lib/types/krb5_conf',
      'locale_gen': '@nikitajs/file/lib/types/locale_gen',
      'my_cnf': '@nikitajs/file/lib/types/my_cnf',
      'pacman_conf': '@nikitajs/file/lib/types/pacman_conf',
      'ssh_authorized_keys': '@nikitajs/file/lib/types/ssh_authorized_keys',
      'wireguard_conf': '@nikitajs/file/lib/types/wireguard_conf',
      'yum_repo': '@nikitajs/file/lib/types/yum_repo'
    },
    upload: '@nikitajs/file/lib/upload',
    yaml: '@nikitajs/file/lib/yaml'
  }
};

(async function() {
  var err;
  try {
    return (await registry.register(module.exports));
  } catch (error) {
    err = error;
    console.error(err.stack);
    return process.exit(1);
  }
})();
