const fs = require('fs')
const gcpKeyFile = './gcp.json'

function createKey() {
    fs.writeFile(gcpKeyFile, process.env.GCP_KEY, err => {
        if (err) {
            console.log(err)
            return
        }
    })
}
