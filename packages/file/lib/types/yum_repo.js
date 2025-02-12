// Generated by CoffeeScript 2.7.0
// # `nikita.file.types.yum_repo`

// Yum is a packet manager for centos/redhat. It uses .repo file located in 
// "/etc/yum.repos.d/" directory to configure the list of available mirrors.

// ## Schema definitions
var definitions, handler, path, utils;

definitions = {
  config: {
    type: 'object',
    required: ['target']
  }
};

// This action honors all the config from "nikita.file.ini".

// ## Handler
handler = async function({config}) {
  // Set the target directory to yum's default path if target is a file name
  config.target = path.resolve('/etc/yum.repos.d', config.target);
  return (await this.file.ini({
    parse: utils.ini.parse_multi_brackets,
    escape: false
  }, config));
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  }
};

// ## Dependencies
path = require('path');

utils = require('../utils');
