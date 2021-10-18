//npm install multer dulu
const multer = require('multer')
const fs = require('fs')

module.exports = {
    uploader: (directory, fileNamePrefix) => {
        // Lokasi penyimpanan file default di dalam folder public
        let defaultDir = './public'

        // diskStorage : untuk menyimpan file dari FE ke directory BE
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const pathDir = defaultDir + directory

                // cek dulu udh ada belum direktorinya
                if (fs.existsSync(pathDir)) {
                    console.log('Directory ada ✔')
                    cb(null, pathDir)
                } else {
                    //bikin filenya trus balikin ke function ini
                    fs.mkdir(pathDir, { recursive: true }, err => cb(err, pathDir))
                }
            },
            filename: (req, file, cb) => {
                let ext = file.originalname.split('.')
                //rename filenya
                let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1]
                cb(null, filename)
            }
        })

        const fileFilter = (req, file, cb) => {
            const ext = /\.(jpg|jpeg|png|gif|pdf|txt|JPG|PNG|JPEG)/
            if (!file.originalname.match(ext)) {
                return cb(new Error("Your file type are denied"), false)
            }
            cb(null, true)
        }

        return multer({
            storage,
            fileFilter
        })
    }
}