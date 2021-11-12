const fs = require('fs')
const gcpKeyFile = './gcp.json'

module.exports = {
    createKey: function () {
        // Key is read in base64 format
        let buff = Buffer.from(process.env.GCP_KEY, 'base64')
        let gcpKey = buff.toString('ascii')

        fs.writeFile(gcpKeyFile, gcpKey, err => {
            if (err) {
                console.log(err)
                return
            }
            console.log('Key written\n')
        })
    }
}
