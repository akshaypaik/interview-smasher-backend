import multer from "multer";
import path from "path";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.resolve(`./uploads/user-profile-pictures/${file.originalname}`);
    
    // Check if the directory exists, if not, create it
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    return cb(null, uploadDir); 
  },

  filename: function (req, file, cb) {
    console.log("file: ", file);
    const mimetype = file.mimetype;
    const fileType = mimetype.split("/").pop();
    const fileNamePrefix = file.originalname.split("@")[0];
    const fileName = `${fileNamePrefix}.${fileType}`;
    return cb(null, fileName); 
  },
});

// Only allow images
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

const upload = multer({ storage: storage });

export default upload;