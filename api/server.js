const
    express = require('express'),
    app = express(),
    formidable = require('formidable'),
    path = require('path'),
    fs = require('fs'),
    speech = require('@google-cloud/speech')
    linear16 = require('linear16')


const
    port = process.env.SERVER_PORT || 4444,
    folder = path.join(__dirname, 'files')

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
}

// Setup STT client
const 
    client = new speech.SpeechClient(),
    config = {
        encoding: 'LINEAR16',
        sampleRateHertz: 1600,
        languageCode: 'en-us',
    }

app.set('port', port)

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    next()
})

app.post('/upload', (req, res) => {
    const form = new formidable.IncomingForm()

    form.uploadDir = folder
    form.parse(req, (_, fields, files) => {
        console.log('\n-----------')
        console.log('Fields', fields)
        console.log('Received:', Object.keys(files))
        console.log()
        res.send('File uploaded!')
        res.sendStatus(200)
    })
})

app.get('/analyze', (req, res) => {
    console.log('\n-----------')
    console.log('Analyzing...')
    console.log()

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            // Processing the file
            console.log(file)

            // Converts audio file to LINEAR16
            const l16Audio = await linear16(file, file + '.wav')
            
            const audio = {
                uri: l16Audio
            }

            const request = {
                audio: audio,
                config: config
            }
            
            const [response] = await client.recognize(request)
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join('\n')

            console.log(transcription)

            // Removing the file, no need to keep it in the server
            fs.unlink(path.join(folder, file), err => {
                if (err) throw err;
            });
        })
    })

    res.sendStatus(200)
})

app.listen(port, () => {
    console.log('\nUpload server running on http://localhost:' + port)
})
