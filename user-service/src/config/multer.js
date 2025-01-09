import path, { join } from "path";
import fs from "fs";
import multer from "multer";
const { v4: uuidv4 } = require("uuid");

const uploadDir = path.join(__dirname, "..", "..", "public", "avatars");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const user = req.user;
    const extension = path.extname(file.originalname);
    const customName = `${user.id}${extension}`;
    req.avatar = `${process.env.BASE_URL_SERVER}/avatars/${customName}`;
    cb(null, customName);
  },
});

const uploadAvatar = multer({ storage });

const uploadDirCourt = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "badminton-court"
);
if (!fs.existsSync(uploadDirCourt)) {
  fs.mkdirSync(uploadDirCourt);
}

const storageCourt = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirCourt);
  },
  filename: (req, file, cb) => {
    const uuidRandom = uuidv4();
    const { id } = req.params;
    const createPath = id ?? uuidRandom;
    const existPath = req?.imageCourt
      ? req?.imageCourt.split("/").pop().split(".")[0]
      : null;
    const extension = path.extname(file.originalname);
    const customName = `${existPath ?? createPath}${extension}`;
    req.imageCourt = `${process.env.BASE_URL_SERVER}/badminton-court/${customName}`;
    cb(null, customName);
  },
});

const uploadDirBadmintonGather = path.join(
  __dirname,
  "..",
  "..",
  "public",
  "badminton-gather"
);
if (!fs.existsSync(uploadDirBadmintonGather)) {
  fs.mkdirSync(uploadDirBadmintonGather);
}

const storageBadmintonGather = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirBadmintonGather);
  },
  filename: (req, file, cb) => {
    const uuidRandom = uuidv4();
    const { id } = req.params;
    const createPath = id ?? uuidRandom;
    const existPath = req?.imgCourt
      ? req?.imgCourt.split("/").pop().split(".")[0]
      : null;
    const extension = path.extname(file.originalname);
    const customName = `${existPath ?? createPath}${extension}`;
    req.imgCourt = `${process.env.BASE_URL_SERVER}/badminton-gather/${customName}`;
    cb(null, customName);
  },
});

const uploadImgCourt = multer({ storage: storageCourt });

const uploadBadmintonGather = multer({ storage: storageBadmintonGather });

export { uploadAvatar, uploadImgCourt, uploadBadmintonGather };
