const { user } = require('../models');
const {
  checkRefeshToken,
  generateAccessToken,
  resendAccessToken,
} = require('../modules/tokenFunctions');

module.exports = {
  refreshTokenModule: (req, res) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(201)
        .json({ message: 'your cookie does not have refresh token' });
    }

    const refreshTokenData = checkRefeshToken(refreshToken);
    if (!refreshTokenData) {
      return res.status(202).json({
        message: 'invalid refresh token, please log in again',
      });
    }

    const { userId } = refreshTokenData;
    user
      .findOne({ where: { userId } })
      .then((data) => {
        if (!data) {
          return res.status(203).json({
            message: 'refresh token has been tempered',
          });
        }
        const { id, email } = data.dataValues;
        const userInfo = { userId: id, email };

        const newAccessToken = generateAccessToken(userInfo);
        resendAccessToken(res, newAccessToken, data.dataValues);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};
