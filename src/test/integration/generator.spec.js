/* global describe,it */
'use strict'

const assert = require('assert')
const cev = require('../../main')

describe('cev', function () {
  it('should work with nothing', function (done) {
    assert.deepStrictEqual(cev(), {})
    done()
  })
  it('should work with no prefix specified', function (done) {
    const opts = {
      noPrefix: true,
      prefix: 'GOO'
    }
    const obj = {
      foo: 1,
      bar: {
        sna: 1,
        fu: 2
      }
    }
    const expected = {
      foo: 'FOO',
      bar: {
        sna: 'BAR_SNA',
        fu: 'BAR_FU'
      }
    }
    const actual = cev(obj, opts)
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with a flat object with defaults', function (done) {
    const obj = {
      foo: 1
    }
    const expected = {
      foo: 'NODE_APP_FOO'
    }
    const actual = cev(obj)
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with a flat object with a function and defaults', function (done) {
    const obj = {
      foo: function () {
      }
    }
    const expected = {}
    const actual = cev(obj)
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with a deep object with a function and defaults', function (done) {
    const obj = {
      foo: {
        bar: function () {
        }
      }
    }
    const expected = {}
    const actual = cev(obj)
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with a flat object with non-defaults', function (done) {
    const prefix = 'PRE'
    const separator = '_'
    const casing = cev.CASING_UPPER
    const empties = true
    const obj = {
      foo: 1
    }
    const expected = {
      foo: prefix + separator + 'FOO'
    }
    const actual = cev(obj, {
      prefix: prefix,
      separator: separator,
      casing: casing,
      empties: empties
    })
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with a deep object with defaults', function (done) {
    const obj = {
      foo: 1,
      bar: {
        goo: 1
      }
    }
    const expected = {
      foo: 'NODE_APP_FOO',
      bar: {
        goo: 'NODE_APP_BAR_GOO'
      }
    }
    const actual = cev(obj)
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with a deep object with non-defaults', function (done) {
    const prefix = 'PRE'
    const separator = '_'
    const casing = cev.CASING_UPPER
    const empties = true
    const obj = {
      foo: 1,
      bar: {
        goo: 1,
        hoo: {}
      },
      loo: function () {
      }
    }
    const expected = {
      foo: prefix + separator + 'FOO',
      bar: {
        goo: prefix + separator + 'BAR' + separator + 'GOO',
        hoo: {}
      }
    }
    const actual = cev(obj, {
      prefix: prefix,
      separator: separator,
      casing: casing,
      empties: empties
    })
    assert.deepStrictEqual(actual, expected)
    done()
  })
  it('should work with __format feature', function (done) {
    const obj = {
      foo: 1,
      bar: {
        goo: 2
      },
      snafu: 3
    }
    const expected = {
      foo: {
        __name: 'NODE_APP_FOO',
        __format: 'json'
      },
      bar: {
        goo: {
          __name: 'NODE_APP_BAR_GOO',
          __format: 'number'
        }
      },
      snafu: 'NODE_APP_SNAFU'
    }
    const actual = cev(obj, {
      useFormat: true,
      formats: {
        foo: 'json',
        bar: {
          goo: 'number'
        }
      }
    })
    assert.deepStrictEqual(actual, expected)
    done()
  })
})
