const express = require("express");
// express 모듈 가져오기
const app = express();
//새로운 express app 만들기
const port = 5002;
//포트 번호 설정

const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");

const cookieParser = require("cookie-parser");

const { auth } = require("./middleware/auth");

//application/x-www-form-urlencoded 처럼 생긴 데이터를 가져오는 코드
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 으로 된 데이터를 가져오는 코드
app.use(bodyParser.json());
app.use(cookieParser());

//몽고디비 연결하기
const mongoose = require("mongoose");
mongoose
  .connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello world!"));
//root 디렉토리에 오면 hello world 출력

app.post("/api/users/register", async (req, res) => {
  // 회원 가입 할 때 필요한 정보들을 client를 가져오면
  // 그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  try {
    const doc = await user.save();
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.status(500).json({ success: false, err });
  }
});

app.post("/api/users/login", async (req, res) => {
  try {
    // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(404).json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다.",
      });
    }

    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 확인한다.
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({
        loginSuccess: false,
        message: "비밀번호가 틀렸습니다.",
      });
    }

    // 비밀번호까지 맞다면 토큰을 생성한다.
    const token = await user.generateToken();

    // 토큰을 저장한다. 쿠키, 로컬스토리지 등에
    res.cookie("x_auth", token).status(200).json({ loginSuccess: true, userID: user._id });
  } catch (err) {
    return res.status(500).json({ success: false, err: err.message });
  }
});

// 인증
app.get("/api/users/auth", auth, async (req, res) => {
  try {
    res.status(200).json({
      _id: req.user._id,
      isAdmin: req.user.role === 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
    });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
});

// 로그아웃
app.get("/api/users/logout", auth, async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: "" });
    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, err: err.message });
  }
});
app.listen(port, () => console.log(`example app listening on port ${port}!`));
//해당 포트 번호에서 실행
