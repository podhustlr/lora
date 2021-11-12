var auth = require('./auth')
var server = require('../server/server')

function main() {
    console.log('Creating GCP key...\n')
    auth.createKey()
    console.log('Booting server...\n')
    server.startServer()
}

if (require.main === module) {
    main()
}
