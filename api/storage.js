const { format } = require('util')
const { Storage } = require('@google-cloud/storage')

const audioBucket = 'fabulas-de-machina-audio-content'

// Instantiate a storage client
const storage = new Storage()

// Grabbing a pointer to a storage bucket
const bucket = storage.bucket(audioBucket)

module.exports = {
    uploadBlob: function (filePath) {
        let blob = bucket.file(filePath)
        let blobStream = blob.createWriteStream()

        blobStream.on('error', err => {
            next(err)
        })

        blobStream.on('finish', () => {
            // Construct gsUri that file can be accessed
            const gsUri = format('gs://${bucket.name}/${blob.name}')
        })

        return gsUri
    }
}
