const multer  = require('multer');
const MIME_TYPE_MAP = {
    'image/jpeg':'jpeg',
    'image/jpg': 'jpg',
    'image/png': 'png'
}

const imgStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isVaild = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("invaild image");
        if(isVaild){
            error =  null
        }
        cb(error, 'backend/images');
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('-');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+"-"+Date.now()+'.'+ext);
    }
});

module.exports = multer({storage:imgStorage}).single('image')