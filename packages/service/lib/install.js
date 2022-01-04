// Generated by CoffeeScript 2.6.1
// # `nikita.service.install`

// Install a service. Yum, Yay, Yaourt, Pacman and apt-get are supported.

// ## Output

// * `$status`   
//   Indicates if the service was installed.

// ## Example

// ```js
// const {$status} = await nikita.service.install({
//   name: 'ntp'
// })
// console.info(`Package installed: ${$status}`)
// ```

// ## Schema definitions
var definitions, handler, utils;

definitions = {
  config: {
    type: 'object',
    properties: {
      'cache': {
        type: 'boolean',
        description: `Cache the list of installed and outdated packages.`
      },
      'cacheonly': {
        type: 'boolean',
        description: `Run the yum command entirely from system cache, don't update cache.`
      },
      'code': {
        $ref: 'module://@nikitajs/core/lib/actions/execute#/definitions/config/properties/code',
        description: `Error code applied when using nikita.service.`
      },
      'installed': {
        type: 'array',
        items: {
          type: 'string'
        },
        description: `Cache a list of installed services. If an array, the service will be
installed if a key of the same name exists; if anything else
(default), no caching will take place.`
      },
      'name': {
        type: 'string',
        description: `Package name, required unless provided as main argument.`
      },
      'outdated': {
        type: 'array',
        items: {
          type: 'string'
        },
        // oneOf: [
        //   {type: 'boolean'}
        //   {type: 'array', items: type: 'string'}
        // ]
        description: `Cache a list of outdated services. If an array, the service will be
updated if a key of the same name exists; If true, the option will be
converted to an array with all the outdated service names as keys; if
anything else (default), no caching will take place.`
      },
      'pacman_flags': {
        type: 'array',
        default: [],
        description: `Additionnal flags passed to the \`pacman -S\` command.`
      },
      'yaourt_flags': {
        type: 'array',
        default: [],
        description: `Additionnal flags passed to the \`yaourt -S\` command.`
      },
      'yay_flags': {
        type: 'array',
        default: [],
        description: `Additionnal flags passed to the \`yay -S\` command.`
      }
    },
    required: ['name']
  }
};

// ## Handler
handler = async function({
    config,
    parent: {state},
    tools: {log}
  }) {
  var $status, cacheonly, err, flag, i, installedIndex, j, k, l, len, len1, len2, outdatedIndex, pkg, ref, ref1, ref2, ref3, ref4, stdout;
  if (config.cache) {
    // Config
    if (config.installed == null) {
      config.installed = state['nikita:execute:installed'];
    }
  }
  if (config.cache) {
    if (config.outdated == null) {
      config.outdated = state['nikita:execute:outdated'];
    }
  }
  cacheonly = config.cacheonly ? '-C' : '';
  ref = config.pacman_flags;
  for (i = j = 0, len = ref.length; j < len; i = ++j) {
    flag = ref[i];
    if (/^-/.test(flag)) {
      continue;
    }
    if (flag.length === 1) {
      config.pacman_flags[i] = `-${flag}`;
    }
    if (flag.length > 1) {
      config.pacman_flags[i] = `--${flag}`;
    }
  }
  ref1 = config.yay_flags;
  for (i = k = 0, len1 = ref1.length; k < len1; i = ++k) {
    flag = ref1[i];
    if (/^-/.test(flag)) {
      continue;
    }
    if (flag.length === 1) {
      config.yay_flags[i] = `-${flag}`;
    }
    if (flag.length > 1) {
      config.yay_flags[i] = `--${flag}`;
    }
  }
  ref2 = config.yaourt_flags;
  for (i = l = 0, len2 = ref2.length; l < len2; i = ++l) {
    flag = ref2[i];
    if (/^-/.test(flag)) {
      continue;
    }
    if (flag.length === 1) {
      config.yaourt_flags[i] = `-${flag}`;
    }
    if (flag.length > 1) {
      config.yaourt_flags[i] = `--${flag}`;
    }
  }
  // Start real work
  log({
    message: `Install service ${config.name}`,
    level: 'INFO'
  });
  // List installed packages
  if (config.installed == null) {
    try {
      ({$status, stdout} = (await this.execute({
        $shy: true,
        command: `if command -v yum >/dev/null 2>&1; then
  rpm -qa --qf "%{NAME}\n"
elif command -v pacman >/dev/null 2>&1; then
  pacman -Qqe
elif command -v apt-get >/dev/null 2>&1; then
  dpkg -l | grep \'^ii\' | awk \'{print $2}\'
else
  echo "Unsupported Package Manager" >&2
  exit 2
fi`,
        code: [0, 1],
        // arch_chroot: config.arch_chroot
        // arch_chroot_rootdir: config.arch_chroot_rootdir
        stdin_log: false,
        stdout_log: false
      })));
      if ($status) {
        log({
          message: "Installed packages retrieved",
          level: 'INFO'
        });
        config.installed = (function() {
          var len3, m, ref3, results;
          ref3 = utils.string.lines(stdout);
          results = [];
          for (m = 0, len3 = ref3.length; m < len3; m++) {
            pkg = ref3[m];
            results.push(pkg);
          }
          return results;
        })();
      }
    } catch (error) {
      err = error;
      if (err.exit_code === 2) {
        throw Error("Unsupported Package Manager");
      }
    }
  }
  // List packages waiting for update
  if (config.outdated == null) {
    try {
      ({$status, stdout} = (await this.execute({
        $shy: true,
        command: `if command -v yum >/dev/null 2>&1; then
  yum ${cacheonly} check-update -q | sed 's/\\([^\\.]*\\).*/\\1/'
elif command -v pacman >/dev/null 2>&1; then
  pacman -Qu | sed 's/\\([^ ]*\\).*/\\1/'
elif command -v apt-get >/dev/null 2>&1; then
  apt-get -u upgrade --assume-no | grep '^\\s' | sed 's/\\s/\\n/g'
else
  echo "Unsupported Package Manager" >&2
  exit 2
fi`,
        code: [0, 1],
        // arch_chroot: config.arch_chroot
        // arch_chroot_rootdir: config.arch_chroot_rootdir
        stdin_log: false,
        stdout_log: false
      })));
      if ($status) {
        log({
          message: "Outdated package list retrieved",
          level: 'INFO'
        });
        config.outdated = utils.string.lines(stdout.trim());
      } else {
        config.outdated = [];
      }
    } catch (error) {
      err = error;
      if (err.exit_code === 2) {
        throw Error("Unsupported Package Manager");
      }
    }
  }
  // Install the package
  if (((ref3 = config.installed) != null ? ref3.indexOf(config.name) : void 0) === -1 || ((ref4 = config.outdated) != null ? ref4.indexOf(config.name) : void 0) !== -1) {
    try {
      ({$status} = (await this.execute({
        command: `if command -v yum >/dev/null 2>&1; then
  yum install -y ${cacheonly} ${config.name}
elif command -v yay >/dev/null 2>&1; then
  yay --noconfirm -S ${config.name} ${config.yay_flags.join(' ')}
elif command -v yaourt >/dev/null 2>&1; then
  yaourt --noconfirm -S ${config.name} ${config.yaourt_flags.join(' ')}
elif command -v pacman >/dev/null 2>&1; then
  pacman --noconfirm -S ${config.name} ${config.pacman_flags.join(' ')}
elif command -v apt-get >/dev/null 2>&1; then
  env DEBIAN_FRONTEND=noninteractive apt-get install -y ${config.name}
else
  echo "Unsupported Package Manager: yum, pacman, apt-get supported" >&2
  exit 2
fi`,
        code: config.code
      })));
      // arch_chroot: config.arch_chroot
      // arch_chroot_rootdir: config.arch_chroot_rootdir
      log($status ? {
        message: `Package \"${config.name}\" is installed`,
        level: 'WARN',
        module: 'nikita/lib/service/install'
      } : {
        message: `Package \"${config.name}\" is already installed`,
        level: 'INFO',
        module: 'nikita/lib/service/install'
      });
      // Enrich installed array with package name unless already there
      installedIndex = config.installed.indexOf(config.name);
      if (installedIndex === -1) {
        config.installed.push(config.name);
      }
      // Remove package name from outdated if listed
      if (config.outdated) {
        outdatedIndex = config.outdated.indexOf(config.name);
        if (outdatedIndex !== -1) {
          config.outdated.splice(outdatedIndex, 1);
        }
      }
    } catch (error) {
      err = error;
      if (err.exit_code === 2) {
        throw Error("Unsupported Package Manager: yum, yaourt, pacman, apt-get supported");
      }
      throw utils.error('NIKITA_SERVICE_INSTALL', ['failed to install package,', `name is \`${config.name}\``], {
        target: config.target
      });
    }
  }
  if (config.cache) {
    log({
      message: "Caching installed on \"nikita:execute:installed\"",
      level: 'INFO'
    });
    state['nikita:execute:installed'] = config.installed;
    log({
      message: "Caching outdated list on \"nikita:execute:outdated\"",
      level: 'INFO'
    });
    state['nikita:execute:outdated'] = config.outdated;
    return {
      $status: true
    };
  }
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    argument_to_config: 'name',
    definitions: definitions
  }
};

// ## Dependencies
utils = require('@nikitajs/core/lib/utils');
