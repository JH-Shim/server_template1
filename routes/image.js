const express = require('express');
const router = express.Router();

const multer = require('multer');

const aws = require('aws-sdk');
var multerS3 = require('multer-s3');

const s3 = new aws.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.REGION,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'bucket name',
    contentType: multerS3.AUTO_CONTENT_TYPE, // ! 콘텐츠 타입을 자동으로 세팅(이 설정을 하지 않을 경우, 해당 사진이 저장된 URL로 입장 시 사진다운로드가 진행됨)
    acl: 'public-read', // ! 클라이언트에서 자유롭게 가용하기 위함
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 }, // ! 용량과 관련
});
// ! cf> 서버에 폴더 하나 만들어서 사진을 업로드 하고 싶다면 아래와 같이 하면 됨.
// const upload = multer({
//   dest: 'image/',
// });

const imageController = require('../controllers/image');

router.post('/', upload.single('image'), imageController.index);
router.post('/s3', upload.single('image'), imageController.S3);
router.post('/album', imageController.album);
router.post('/albumpost', upload.single('image'), imageController.albumPost);
router.post('/food', imageController.food);
router.post('/foodpost', upload.single('image'), imageController.foodPost);
router.post('/profile', imageController.profile);
router.post(
  '/profilepost',
  upload.single('image'),
  imageController.profilePost,
);

// ! check 여러 사진을 한번에 업로드 하는 것도 금방 구현하니깐, 필요한 부분이라고 생각되면 합시다.
// app.post('/upload', upload.array('photos', 3), function (req, res, next) {
//   res.send('Successfully uploaded ' + req.files.length + ' files!');
// });

module.exports = router;
