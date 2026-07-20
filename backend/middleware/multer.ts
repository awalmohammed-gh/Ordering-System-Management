import multer from "multer";

const storage = multer.diskStorage({
    filename:(req,file,cb) =>{
        cb(null, Date.now() + "_" + file.originalname)
    }
})

export const upload = multer({storage})