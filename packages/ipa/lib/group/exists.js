// Generated by CoffeeScript 2.5.1
// # `nikita.ipa.group.exists`

// Check if a group exists inside FreeIPA.

// ## Example

// ```js
// const {status} = await nikita.ipa.group.exists({
//   cn: 'somegroup',
//   connection: {
//     url: "https://ipa.domain.com/ipa/session/json",
//     principal: "admin@DOMAIN.COM",
//     password: "mysecret"
//   }
// })
// console.info(`Group exists: ${status}`)
// ```

// ## Schema
var handler, schema;

schema = {
  type: 'object',
  properties: {
    'cn': {
      type: 'string',
      description: `Name of the group to check for existence.`
    },
    'connection': {
      $ref: 'module://@nikitajs/network/lib/http',
      required: ['principal', 'password']
    }
  },
  required: ['cn', 'connection']
};

// ## Handler
handler = async function({config}) {
  var base, err;
  if ((base = config.connection.http_headers)['Referer'] == null) {
    base['Referer'] = config.connection.referer || config.connection.url;
  }
  try {
    await this.ipa.group.show({
      connection: config.connection,
      cn: config.cn
    });
    return {
      status: true,
      exists: true
    };
  } catch (error) {
    err = error;
    if (err.code !== 4001) { // group not found
      throw err;
    }
    return {
      status: false,
      exists: false
    };
  }
};


// ## Export
module.exports = {
  handler: handler,
  metadata: {
    schema: schema,
    shy: true
  }
};
