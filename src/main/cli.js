#!/usr/bin/env node
'use strict'

const stdio = require('stdio')
const eol = require('os').EOL
const fs = require('fs')
const os = require('os')
const generator = require('./generator')
const { parseFormats } = require('./cli-support')

const DEFAULT_PRETTY = 2
const DEFAULT_VERBOSE = false

const errln = function (text) {
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
  },
  formatKey: {
    key: 'k',
    description: '(multiple allowed) give in the form "path.to.key=format", where format is one of the allowed config __format values',
    args: 1,
    multiple: true,
    required: false
  },
  _meta_: {
    minArgs: 0,
    maxArgs: 1,
    description: 'File to write to; omit for stdout.'
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
  empties: opts.empties,
  formats: parseFormats(opts.format)
})

let indentation = parseInt(opts.pretty)
if (isNaN(indentation)) {
  process.stderr.write(`WARN: could not parse '--pretty ${opts.pretty}'; reverting to ${DEFAULT_PRETTY}${os.EOL}`)
  indentation = DEFAULT_PRETTY
}

const json = JSON.stringify(vars, null, indentation)

let file = ''
if (opts.args) {
  file = opts.args[0].trim()
}

if (file) {
  fs.writeFileSync(file, json)
} else {
  process.stdout.write(json)
}
