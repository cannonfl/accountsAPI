'use strict'

const winston = require('winston')

var logger = new (winston.Logger)({
  level: 'verbose'
})

logger.add(winston.transports.Console, {
  name: 'console.info',
  colorize: true,
  showLevel: true
})

module.exports = logger
