'use strict'

// let b64 = require('js-base64-file')
let path = require('path')
let crypto = require('crypto')
let uml = require('node-plantuml')
let fs = require('fs-extra')
let tmp = require('tmp')

const PLUGIN_NAME = 'remark-plantuml'

module.exports = function (source, destination) {
  let unique = crypto.createHmac('sha1', PLUGIN_NAME).update(source).digest('hex')
  let umlPath = path.join(tmp.tmpdir, `${unique}.uml`)
  let svgFilename = `${unique}.png`
  let svgPath = path.join(tmp.tmpdir, svgFilename)

  fs.outputFileSync(umlPath, source)
  let gen = uml.generate(umlPath)
  gen.out.pipe(fs.createWriteStream(svgPath))
  fs.removeSync(umlPath)

  return `${path.resolve(svgPath)}`
}
