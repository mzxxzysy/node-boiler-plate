const { User } = require("../models/User");

let auth = async (req, res, next) => {
  try {
    // 클라이언트 쿠키에서 토큰을 가져온다.
    const token = req.cookies.x_auth;

    // 토큰을 복호화한 후 유저를 찾는다.
    const user = await User.findByToken(token);
    if (!user) {
      return res.status(401).json({ isAuth: false, error: true });
    }

    // 유저가 있다면 요청 객체에 추가
    req.token = token;
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ isAuth: false, error: true, message: err.message });
  }
};

module.exports = { auth };
