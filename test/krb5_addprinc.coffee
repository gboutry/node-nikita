
lib = if process.env.MECANO_COV then 'lib-cov' else 'lib'
mecano = require "../#{lib}"
test = require './test'
they = require 'ssh2-they'
ldap = require 'ldapjs'

describe 'krb5_addprinc', ->

  config = test.config()
  return unless config.test_krb5

  they 'create a new principal without a randkey', (ssh, next) ->
    mecano.krb5_addprinc
      ssh: ssh
      principal: "mecano@#{config.krb5.realm}"
      randkey: true
      kadmin_server: config.krb5.kadmin_server
      kadmin_principal: config.krb5.kadmin_principal
      kadmin_password: config.krb5.kadmin_password
    , (err, created) ->
      return next err if err
      created.should.be.ok
      mecano.krb5_addprinc
        ssh: ssh
        principal: "mecano@#{config.krb5.realm}"
        randkey: true
        kadmin_server: config.krb5.kadmin_server
        kadmin_principal: config.krb5.kadmin_principal
        kadmin_password: config.krb5.kadmin_password
      , (err, created) ->
        return next err if err
        created.should.not.be.ok
        mecano.krb5_delprinc
          ssh: ssh
          principal: "mecano@#{config.krb5.realm}"
          kadmin_server: config.krb5.kadmin_server
          kadmin_principal: config.krb5.kadmin_principal
          kadmin_password: config.krb5.kadmin_password
        , (err, removed) ->
          return next err if err

  they 'create a new principal with a password', (ssh, next) ->
    mecano.krb5_addprinc
      ssh: ssh
      principal: "mecano@#{config.krb5.realm}"
      password: 'password'
      kadmin_server: config.krb5.kadmin_server
      kadmin_principal: config.krb5.kadmin_principal
      kadmin_password: config.krb5.kadmin_password
    , (err, created) ->
      return next err if err
      created.should.be.ok
      mecano.krb5_addprinc
        ssh: ssh
        principal: "mecano@#{config.krb5.realm}"
        password: 'password'
        kadmin_server: config.krb5.kadmin_server
        kadmin_principal: config.krb5.kadmin_principal
        kadmin_password: config.krb5.kadmin_password
      , (err, created) ->
        return next err if err
        created.should.not.be.ok
        mecano.krb5_delprinc
          ssh: ssh
          principal: "mecano@#{config.krb5.realm}"
          kadmin_server: config.krb5.kadmin_server
          kadmin_principal: config.krb5.kadmin_principal
          kadmin_password: config.krb5.kadmin_password
        , (err, removed) ->
          return next err if err

