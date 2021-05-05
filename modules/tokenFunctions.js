require('dotenv').config();
// https://www.npmjs.com/package/jsonwebtoken
const { sign, verify } = require('jsonwebtoken'); // ! check details about JWT

module.exports = {
  generateAccessToken: (data) => {
    return sign(data, process.env.ACCESS_SECRET, { expiresIn: '1d' }); // ! check expiresIn
  },

  generateRefreshToken: (data) => {
    return sign(data, process.env.REFRESH_SECRET, { expiresIn: '2d' });
  },

  sendAccessToken: (res, accessToken) => {
    res.status(200).json({
      accessToken,
      message: 'sign in succeeded',
    });
  },

  sendRefreshToken: (res, refreshToken) => {
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'None',
    });
  },

  isAuthorized: (req) => {
    const authorization = req.headers['authorization'];
    if (!authorization) {
      return null;
    }
    // const token = authorization.split(' ')[1];
    try {
      return verify(authorization, process.env.ACCESS_SECRET);
    } catch (err) {
      // return null if invalid token
      console.log(err);
      return 'invalid token';
    }
  },

  checkAccessToken: (req, res) => {
    const accessTokenData = this.isAuthorized(req);
    if (!accessTokenData) {
      res.status(201).json({
        message: 'no token in request headers',
      });
    } else if (accessTokenData === 'invalid token') {
      res.status(201).json({
        message: 'invalid token',
      });
    }
    return accessTokenData;

    // ! check refactoring?
    // const accessTokenData = checkAccessToken(req, res);
    // if (!accessTokenData || accessTokenData === 'invalid token') {
    //   return;
    // }
  },

  checkRefeshToken: (refreshToken) => {
    try {
      return verify(refreshToken, process.env.REFRESH_SECRET);
    } catch (err) {
      // return null if refresh token is not valid
      return null;
    }
  },

  resendAccessToken: (res, accessToken, data) => {
    res.status(200).json({
      accessToken,
      userInfo: data,
      message: 'access token resended(by refresh token)',
    });
  },
};
