const 
    spawn = require('child_process').spawn,
    cmd = 'ffmpeg' // not failproof: requires ffmpeg to be in PATH

module.exports = {
    // TODO: error handling for bad exit signal
    convertToLinear16: function(filePath, exportPath){
        var args = [
            '-i', filePath,
            '-f', 's16le',
            '-acodec', 'pcm_s16le',
            exportPath
        ]

        var proc = spawn(cmd, args)
        proc.stdout.on('data', function(data) {
            console.log(data);
        });
        
        proc.stderr.setEncoding("utf8")
        proc.stderr.on('data', function(data) {
            console.log(data);
        });
        
        proc.on('close', function() {
            console.log('finished');
        });
    }
}
