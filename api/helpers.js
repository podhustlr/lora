const fs = require('fs')
const path = require('path')

module.exports = {
    removeContents: function (filePath) {
        fs.readdir(filePath, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(filePath, file), err => {
                    if (err) throw err;
                });
            }
        });
    }
}
