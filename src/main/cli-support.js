const _ = {
  set: require('lodash.set')
}

module.exports = {
  parseFormats: formats => {
    const rv = {}
    for (const it of formats) {
      const [path, format] = it.split('=').map(v => v.trim())
      _.set(rv, path, format)
    }
    return rv
  }
}
