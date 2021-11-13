// env settings
const
    express = require('express'),
    app = express(),
    formidable = require('formidable'),
    path = require('path'),
    fs = require('fs'),
    speech = require('@google-cloud/speech'),
    audio = require('./audio'),
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
    function transform(file) {
        audio.convertToLinear16(folder + '/' + file, folder + '/' + file + '.raw')
    }

    function upload(transform) {
        fs.readdir(folder, (err, files) => {
            if (err) {
                console.log('Unable to scan audio directory: ' + err)
                return
            }
            files.forEach(file => {
                transform(file)
                storage.uploadBlob(folder + '/' + file + '.raw')
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
    setTimeout(() => {  upload(transform) }, 2000);
    res.sendStatus(200)
})

app.get('/analyze', (req, res) => {
    console.log('\n-----------')
    console.log('Analyzing...')

    async function analyze() {
        const gcsUri = 'gs://raw_audio_fabulasdemachina/latest.raw'

        const audio = {
            uri: gcsUri,
        }
        const config = {
            encoding: 'LINEAR16',
            sampleRateHertz: 1600,
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
