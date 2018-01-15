#!/usr/local/bin/node

const ch = require('cheerio')
const fs = require('fs')
const options = require('quasix-getopt').parse()
let doc = null

start()

function start () {
  if (options['u']) return usageAndExit()

  const required = ['file']
  required.forEach(opt => {
    if (!options[opt]) return usageAndExit(opt)
  })

  fs.readFile(options.file, (err, data) => {
    if (err) return exit(err)

    doc = ch.load(data.toString())
    const rows = getRows(doc)

    // Row 0 is the header, so start at row 1.
    for (let i = 1; i === 1/* TODO restore me !!rows[i] */; i++) {
      parseRow(rows[i])
    }
  })
}

function parseRow (row) {
  const cells = doc(row).find('td')
  const nation = doc(cells[0]).attr('text')
  console.log(cells)
}

function getRows (doc) {
  return doc('table').find('table').find('tr')
}

function usageAndExit (missingOpt) {
  usage()

  if (missingOpt) {
    console.log(`Option "missingOpt" is required.`)
  }

  process.exit(missingOpt ? 1 : 0)
}

function usage () {
  console.log(`Usage: node parse.js --file`)
}

function exit (err) {
  if (err) console.error(err.message)
  process.exit(err.message ? 1 : 0)
}
