let visit = require('unist-util-visit')
let build = require('./plantuml.js')

const PLUGIN_NAME = 'remark-plantuml'

function plantuml () {
  return function transformer (ast, vFile, next) {
    visitCodeBlock(ast, vFile)
    if (typeof next === 'function') { return next(null, ast, vFile) } else { return ast }
  }
}

function visitCodeBlock (ast, vFile) {
  return visit(ast, 'code', (node, index, parent) => {
    let {lang, value, position} = node

    if (lang !== 'plantuml') { return node } // do nothing...

    let graphSvgFilename
    try {
      graphSvgFilename = build(value)
      vFile.info(`Building graph from ${lang} code block`, position, PLUGIN_NAME)
    } catch (error) {
      vFile.message(error, position, PLUGIN_NAME)
      return node
    }

    let image = {
      type: 'image',
      title: 'PlantUML image',
      url: graphSvgFilename
    }

    parent.children.splice(index, 1, image)

    return node
  })
}

module.exports = plantuml
