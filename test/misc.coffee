
lib = if process.env.MECANO_COV then 'lib-cov' else 'lib'
misc = require "../#{lib}/misc"
test = require './test'
they = require 'ssh2-they'
fs = require 'ssh2-fs'

describe 'misc', ->

  scratch = test.scratch @

  describe 'array', ->

    it 'intersect', ->
      misc.array.intersect(['a', 'c', 'd'], ['e', 'd', 'c']).should.eql ['c', 'd']
      misc.array.intersect(['a', 'c', 'd'], []).should.eql []
      misc.array.intersect([], ['e', 'd', 'c']).should.eql []

  describe 'object', ->

    describe 'equals', ->

      it 'compare two objects', ->
        misc.object.equals({a: '1', b: '2'}, {a: '1', b: '2'}).should.be.true
        misc.object.equals({a: '1', b: '1'}, {a: '2', b: '2'}).should.be.false
        misc.object.equals({a: '1', b: '2', c: '3'}, {a: '1', b: '2', c: '3'}, ['a', 'c']).should.be.true
        misc.object.equals({a: '1', b: '-', c: '3'}, {a: '1', b: '+', c: '3'}, ['a', 'c']).should.be.true
        misc.object.equals({a: '1', b: '-', c: '3'}, {a: '1', b: '+', c: '3'}, ['a', 'b']).should.be.false

  describe 'pidfileStatus', ->

    they 'give 0 if pidfile math a running process', (ssh, next) ->
      fs.writeFile ssh, "#{scratch}/pid", "#{process.pid}", (err) ->
        misc.pidfileStatus ssh, "#{scratch}/pid", (err, status) ->
          status.should.eql 0
          next()

    they 'give 1 if pidfile does not exists', (ssh, next) ->
      misc.pidfileStatus ssh, "#{scratch}/pid", (err, status) ->
        status.should.eql 1
        next()

    they 'give 2 if pidfile exists but match no process', (ssh, next) ->
      fs.writeFile ssh, "#{scratch}/pid", "666666666", (err) ->
        misc.pidfileStatus ssh, "#{scratch}/pid", (err, status) ->
          status.should.eql 2
          next()






