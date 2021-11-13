// env settings
const
    express = require('express'),
    app = express(),
    formidable = require('formidable'),
    path = require('path'),
    fs = require('fs'),
    speech = require('@google-cloud/speech'),
    helpers = require('./helpers'),
    storage = require('./storage')

// server settings
const
    port = process.env.SERVER_PORT || 4444,
    folder = path.join(__dirname, 'files')

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
}

// Setup STT client
const client = new speech.SpeechClient()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.post('/upload', (req, res) => {
    function upload() {
        fs.readdir(folder, (err, files) => {
            if (err) {
                console.log('Unable to scan audio directory: ' + err)
                return
            }
            files.forEach(file => {
                storage.uploadBlob(folder + '/' + file)
            })
        })
    }

    helpers.removeContents(folder)

    const form = new formidable.IncomingForm()
    form.uploadDir = folder
    form.parse(req, (_, fields, files) => {
        console.log('\n-----------')
        console.log('Fields', fields)
        console.log('Received:', Object.keys(files))
        console.log()
    })

    // This is a bad, bad thing
    setTimeout(() => {  upload() }, 2000);
    res.sendStatus(200)
})

app.get('/analyze', (req, res) => {
    console.log('\n-----------')
    console.log('Analyzing...')

    async function analyze() {
        const gcsUri = 'gs://' + process.env.AUDIO_STORAGE_BUCKET + '/latest.mp3'

        const audio = {
            uri: gcsUri,
        }
        const config = {
            encoding: 'MP3',
            sampleRateHertz: 44100,
            languageCode: 'en-us',
        }
        const request = {
            audio: audio,
            config: config,

        }

        // Detects speech in the audio file
        const [response] = await client.recognize(request);
        const transcription = response.results
            .map(result => result.alternatives[0].transcript)
            .join('\n');
        res.json({'transcription': transcription})
    }
    analyze()
})

module.exports.startServer = function () {
    app.listen(port, () => {
        console.log('\nServer running on http://localhost:' + port)
    })
}
