const fs = require('fs')
const _ = require('lodash')

require('./vue.config.js')

const indexFilePath = 'dist/index.html'
const content = fs.readFileSync(indexFilePath, 'utf-8')
const compiled = _.template(content)
fs.writeFileSync(indexFilePath, compiled({
  ...process.env,
  BASE_URL: 'https://mes-aides.org/'
}))
