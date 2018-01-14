#!/usr/local/bin/node

const cheerio = require('cheerio')
const fs = require('fs')
const options = require('quasix-getopt').parse()

start()

function start () {
  if (options['u']) return usageAndExit()

  const required = ['file']
  required.forEach(opt => {
    if (!options[opt]) return usageAndExit(opt)
  })

  fs.readFile(options.file, parseHtml)
}

function parseHtml (err, data) {
  if (err) throw err

  const doc = cheerio.load(data.toString())
  console.log(doc.html())
}

function usageAndExit (missingOpt) {
  usage()

  if (missingOpt) {
    console.log(`Option "missingOpt" is required.`)
  }

  process.exit(!!missingOpt ? 1 : 0)
}

function usage () {
  console.log(`Usage: node parse.js --file`)
}
