'use strict'

const path = require('path')

const DEFAULT_PREFIX = 'NODE_APP'
const DEFAULT_NO_PREFIX = false
const PACKAGE_NAME_PREFIX_PLACEHOLDER = '@'
const DEFAULT_SEPARATOR = '_'
const CASING_UPPER = 'upper'
const CASING_LOWER = 'lower'
const CASING_UNCHANGED = 'unchanged'
const DEFAULT_CASING = CASING_UPPER
const DEFAULT_EMPTIES = false

/**
 * Generates an object suitable for use with [config](https://npmjs.com/package/config)'s `config/custom-environment-variables.json`, skipping any functions encountered in the given object.
 * Example:
 * ```
 *   const fs = require('fs');
 *   const config = require('config');
 *   const cev = require('config-custom-environment-variables-generator');
 *   fs.writeFileSync('config/custom-environment-variables.json', JSON.stringify(cev.generate(config, { prefix: 'MYAPP' }), null, 2)));
 * ```
 * @param {object} obj An object, most likely the one returned by `require('config')`.
 * @param {object} [opts] An object containing options to control how the returned object generates environment variable names, containing the following properties.
 * @param {string} [opts.prefix='NODE_APP'] Prefix to use on environment variables.  Use `@` to use the name of your application (see exported `DEFAULT_PREFIX`).
 * @param {boolean} [opts.noPrefix=false] Overrides use of any prefix (see exported `DEFAULT_NO_PREFIX`).
 * @param {separator} [opts.separator='_'] The word separator in environment variables (see exported `DEFAULT_SEPARATOR`).
 * @param {'upper'|'lower'|undefined} [opts.casing='upper'] The case to use.  `upper` forces upper case, `lower` forces lower case, else case is unchanged (see exported `DEFAULT_CASING`, `CASING_UPPER`, `CASING_LOWER`, and `CASING_UNCHANGED`).
 * @param {boolean} [opts.empties=false] If `true`, preserves empty objects that didn't have any environment variables, else skips entries that wouldn't have any environment variables (functions are always skipped).
 * @returns {object} An object containing the generated environment variables for each key in the input object.
 */
const generate = function generate (obj, opts) {
  obj = obj || {}
  opts = opts || {}

  let prefix = ''
  const noPrefix = opts.noPrefix
  if (!noPrefix) {
    prefix = opts.prefix || module.exports.DEFAULT_PREFIX
    if (prefix === PACKAGE_NAME_PREFIX_PLACEHOLDER) {
      prefix = require(path.resolve('package.json')).name
    }
  }
  const separator = opts.separator || module.exports.DEFAULT_SEPARATOR
  const keys = Object.keys(opts)
  const casing = keys.indexOf('casing') === -1
    ? DEFAULT_CASING
    : opts.casing.toString().toLowerCase()
  const empties = keys.indexOf('empties') === -1
    ? DEFAULT_EMPTIES
    : (!!opts.empties)

  const vars = {}

  Object.keys(obj).forEach(function (key) {
    if ((obj[key] instanceof Function)) {
      return null // skip
    } else if (obj[key] instanceof Object) { // recurse
      const pre = applyCasing((prefix ? (prefix + separator) : '') + key, casing)
      vars[key] = generate(obj[key], {
        prefix: pre,
        separator: separator,
        casing: casing,
        empties: empties
      })
      if ((!Object.keys(vars[key]).length) && !empties) delete vars[key]
    } else { // add
      const v = applyCasing((prefix ? prefix + separator : '') + key, casing)
      vars[key] = v
    }
  })
  return vars
}

function applyCasing (value, casing) {
  value = value.toString()
  switch (casing) {
    case CASING_UPPER:
      return value.toUpperCase()
    case CASING_LOWER:
      return value.toLowerCase()
    default: // CASING_UNCHANGED
      return value
  }
}

module.exports = generate
module.exports.generate = generate
module.exports.DEFAULT_PREFIX = DEFAULT_PREFIX
module.exports.DEFAULT_NO_PREFIX = DEFAULT_NO_PREFIX
module.exports.DEFAULT_SEPARATOR = DEFAULT_SEPARATOR
module.exports.DEFAULT_EMPTIES = DEFAULT_EMPTIES
module.exports.DEFAULT_CASING = DEFAULT_CASING
module.exports.CASING_UPPER = CASING_UPPER
module.exports.CASING_LOWER = CASING_LOWER
module.exports.CASING_UNCHANGED = CASING_UNCHANGED
