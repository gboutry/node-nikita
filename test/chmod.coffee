
fs = require 'fs'
path = require 'path'
fs.exists ?= path.exists
lib = if process.env.MECANO_COV then 'lib-cov' else 'lib'
mecano = require "../#{lib}"
test = require './test'
they = require 'ssh2-they'

describe 'chmod', ->

  scratch = test.scratch @

  they 'change a permission of a file', (ssh, next) ->
    mecano
      ssh: ssh
    .touch
      destination: "#{scratch}/a_file"
      mode: 0o754
    .chmod
      destination: "#{scratch}/a_file"
      mode: 0o744
    , (err, modified) ->
      return next err if err
      modified.should.be.True
    .chmod
      destination: "#{scratch}/a_file"
      mode: 0o744
    , (err, modified) ->
      return next err if err
      modified.should.not.be.True
    .then next

