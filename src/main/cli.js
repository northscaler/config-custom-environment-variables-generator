#!/usr/bin/env node
'use strict'

const stdio = require('stdio')
const eol = require('os').EOL
const generator = require('./generator')

const DEFAULT_PRETTY = 2
const DEFAULT_VERBOSE = false

var errln = function (text) {
  process.stderr.write(text + eol)
}

const opts = stdio.getopt({
  separator: {
    key: 's',
    description: 'Separator.',
    args: 1,
    mandatory: false,
    default: generator.DEFAULT_SEPARATOR
  },
  prefix: {
    key: 'p',
    description: 'Prefix; use an at-sign (\'@\') for your application\'s name.',
    args: 1,
    mandatory: false,
    default: generator.DEFAULT_PREFIX
  },
  noprefix: {
    key: 'n',
    description: 'Do not use a prefix; supercedes --prefix.',
    args: 0,
    mandatory: false,
    default: generator.DEFAULT_NO_PREFIX
  },
  casing: {
    key: 'c',
    args: 1,
    description: 'Casing: "' + generator.CASING_UPPER + '", "' + generator.CASING_LOWER + '", or "' + generator.CASING_UNCHANGED + '".',
    mandatory: false,
    default: generator.DEFAULT_CASING
  },
  pretty: {
    key: 'f',
    args: 1,
    description: 'Format prettily with given number of spaces for indentation.',
    mandatory: false,
    default: DEFAULT_PRETTY
  },
  empties: {
    key: 'e',
    args: 0,
    description: 'If present, preserves sections that wouldn\'t have any environment variables.  Functions are always skipped.',
    mandatory: false,
    default: generator.DEFAULT_EMPTIES
  },
  verbose: {
    key: 'v',
    args: 0,
    description: 'Be verbose.',
    mandatory: false,
    default: DEFAULT_VERBOSE
  }
})

if (opts.verbose) {
  errln('Options: ' + JSON.stringify(opts, null, 2))
}

const vars = generator.generate(require('config'), {
  noPrefix: opts.noprefix,
  prefix: opts.prefix,
  separator: opts.separator,
  casing: opts.casing,
  empties: opts.empties
})

process.stdout.write(JSON.stringify(vars, null, opts.pretty))
