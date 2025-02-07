// Generated by CoffeeScript 2.7.0
// # `nikita.tools.compress`

// Compress an archive. Multiple compression types are supported. Unless
// specified as an option, format is derived from the source extension. At the
// moment, supported extensions are '.tgz', '.tar.gz', 'tar.xz', 'tar.bz2' and '.zip'.

// ## Output

// * `$status`   
//   Value is "true" if file was compressed.   

// ## Example

// ```js
// const {$status} = await nikita.tools.compress({
//   source: '/path/to/file.tgz'
//   destation: '/tmp'
// })
// console.info(`File was compressed: ${$status}`)
// ```

// ## Schema definitions
var definitions, ext_to_type, handler;

definitions = {
  config: {
    type: 'object',
    properties: {
      clean: {
        type: 'boolean',
        description: `Remove the source file or directory on completion.`
      },
      format: {
        type: 'string',
        enum: ['tgz', 'tar', 'zip', 'bz2', 'xz'],
        description: `Compression tool and format to be used.`
      },
      source: {
        type: 'string',
        description: `Source of the file or directory to compress.`
      },
      target: {
        type: 'string',
        description: `Destination path of the generated archive, default to the source
parent directory.`
      }
    },
    required: ['source', 'target']
  }
};

// ## Handler
handler = async function({
    config,
    tools: {path}
  }) {
  var dir, format, name, output;
  config.source = path.normalize(config.source);
  config.target = path.normalize(config.target);
  dir = path.dirname(config.source);
  name = path.basename(config.source);
  // Deal with format option
  if (config.format != null) {
    format = config.format;
  } else {
    format = ext_to_type(config.target, path);
  }
  // Run compression
  output = (await this.execute((function() {
    switch (format) {
      case 'tgz':
        return `tar czf ${config.target} -C ${dir} ${name}`;
      case 'tar':
        return `tar cf  ${config.target} -C ${dir} ${name}`;
      case 'bz2':
        return `tar cjf ${config.target} -C ${dir} ${name}`;
      case 'xz':
        return `tar cJf ${config.target} -C ${dir} ${name}`;
      case 'zip':
        return `(cd ${dir} && zip -r ${config.target} ${name} && cd -)`;
    }
  })()));
  await this.fs.remove({
    $if: config.clean,
    target: config.source,
    recursive: true
  });
  return output;
};

// ## Extention to type

// Convert a full path, a filename or an extension into a supported compression 
// type.
ext_to_type = function(name, path) {
  if (/((.+\.)|^\.|^)(tar\.gz|tgz)$/.test(name)) {
    return 'tgz';
  } else if (/((.+\.)|^\.|^)tar$/.test(name)) {
    return 'tar';
  } else if (/((.+\.)|^\.|^)zip$/.test(name)) {
    return 'zip';
  } else if (/((.+\.)|^\.|^)bz2$/.test(name)) {
    return 'bz2';
  } else if (/((.+\.)|^\.|^)xz$/.test(name)) {
    return 'xz';
  } else {
    throw Error(`Unsupported Extension: ${JSON.stringify(path.extname(name))}`);
  }
};

// ## Exports
module.exports = {
  handler: handler,
  metadata: {
    definitions: definitions
  },
  tools: {
    ext_to_type: ext_to_type
  }
};
