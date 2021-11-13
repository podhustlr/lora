const { format } = require('util')
const { Storage } = require('@google-cloud/storage')

const audioBucket = process.env.AUDIO_STORAGE_BUCKET

// Instantiate a storage client
const storage = new Storage()

// Grabbing a pointer to a storage bucket
const bucket = storage.bucket(audioBucket)

module.exports = {
    uploadBlob: function (filePath) {
        bucket.upload(filePath, {
            destination: 'latest.mp3',
        })
    }
}
