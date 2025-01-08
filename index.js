const express = require("express");
// express 모듈 가져오기
const app = express();
//새로운 express app 만들기
const port = 5002;
//포트 번호 설정

const bodyParser = require("body-parser");
const { User } = require("./models/User");

const config = require("./config/key");

//application/x-www-form-urlencoded 처럼 생긴 데이터를 가져오는 코드
app.use(bodyParser.urlencoded({ extended: true }));
//application/json 으로 된 데이터를 가져오는 코드
app.use(bodyParser.json());

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

app.post("/register", async (req, res) => {
  //뢰원 가입 할 때 필요한 정보들을 client를 가져오면
  //그것들을 데이터베이스에 넣어준다.

  const user = new User(req.body);

  try {
    const doc = await user.save();
    return res.status(200).json({ success: true, data: doc });
  } catch (err) {
    return res.json({ success: false, err });
  }
});

app.listen(port, () => console.log(`example app listening on port ${port}!`));
//해당 포트 번호에서 실행
