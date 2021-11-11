const
    express = require('express'),
    app = express(),
    formidable = require('formidable'),
    path = require('path'),
    fs = require('fs')

const
    port = process.env.SERVER_PORT || 4444,
    folder = path.join(__dirname, 'files')

if (!fs.existsSync(folder)) {
    fs.mkdirSync(folder)
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
        res.send('file uploaded!')
        res.sendStatus(200)
    })
})

app.get('/analyze', (req, res) => {
    console.log('\n-----------')
    console.log('Analyzing...')
    console.log()

    fs.readdir(folder, (err, files) => {
        files.forEach(file => {
            console.log(file) // Processing the file

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
