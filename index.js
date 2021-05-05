require('dotenv').config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const { sequelize } = require('./models');
const cookieParser = require('cookie-parser');

const app = express();
app.use(logger('dev'));

// ! ★ express ====================================
// https://expressjs.com/ko/
// (1) https://expressjs.com/ko/4x/api.html#express.json
app.use(express.json());
// (2) https://expressjs.com/ko/4x/api.html#express.urlencoded, https://stackoverflow.com/questions/29960764/what-does-extended-mean-in-express-4-0/45690436#45690436
// app.use(express.urlencoded({ extended: false }));
// ================================================

// ! ★ cors =======================================
// https://www.npmjs.com/package/cors
// (1) Simple Usage (Enable All CORS Requests)
// app.use(cors());
// (2) Configuring CORS
// ex1>
// app.use(
//   cors({
//     origin: '*',
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
//     preflightContinue: false,
//     optionsSuccessStatus: 204,
//   }),
// );
// ex2>
app.use(
  cors({
    origin: [
      'https://g-nal.com',
      'https://www.g-nal.com',
      `http://localhost:${process.env.CLIENT_PORT}`,
      `https://localhost:${process.env.CLIENT_PORT}`,
    ],
    method: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // ! check HEAD?
    credentials: true,
  }),
);
// ================================================

// ! ★ cookie Parser ==============================
// https://www.npmjs.com/package/cookie-parser
app.use(cookieParser());
// ================================================

// ! ★ sequelize sync =============================
// sequelize
//   .sync({ force: false, alter: false })
//   .then(() => console.log('DB 접속 성공'))
//   .catch((err) => console.log(err));
// ================================================

// ! routing ======================================
// (1) https://expressjs.com/ko/4x/api.html#express.router
// (2) https://expressjs.com/ko/4x/api.html#router

const indexRouter = require('./routes/index');
const accountsRouter = require('./routes/accounts');
const refreshTokenRouter = require('./routes/refreshToken');
const imageRouter = require('./routes/image');

app.use('/', indexRouter);
app.use('/accounts', accountsRouter);
app.use('/refreshtoken', refreshTokenRouter);
app.use('/image', imageRouter);

// ! 추가 중 =======================================

// ================================================

app.listen(process.env.SERVER_PORT, () => {
  console.log(`server on ${process.env.SERVER_PORT}`);
});
