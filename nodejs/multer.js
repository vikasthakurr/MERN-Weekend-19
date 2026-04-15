import express from "express";
import multer from "multer";

const app = express();
// const upload = multer({ dest: "uploads/" });
//disk storage from multer format perseveration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/register", upload.single("dp"), (req, res) => {
  console.log(req.file);
  res.send("file uploaded");
});
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
