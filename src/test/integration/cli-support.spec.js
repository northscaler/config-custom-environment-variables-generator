/* global describe,it */
'use strict'

const assert = require('assert')
const { parseFormats } = require('../../main/cli-support')

describe('parseFormats', function () {
  it('should work', function (done) {
    const expected = {
      foo: {
        bar: 'json',
        goo: 'number'
      }
    }
    const actual = parseFormats([
      'foo.bar=json',
      'foo.goo=number'
    ])
    assert.deepStrictEqual(actual, expected)
    done()
  })
})
