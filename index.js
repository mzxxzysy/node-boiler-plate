const express = require("express");
// express 모듈 가져오기
const app = express();
//새로운 express app 만들기
const port = 5002;
//포트 번호 설정

//몽고디비 연결하기
const mongoose = require("mongoose");
mongoose
  .connect("mongodb+srv://jsy:root1234!!@boiler-plate.luuuy.mongodb.net/?retryWrites=true&w=majority&appName=boiler-plate", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("hello world!"));
//root 디렉토리에 오면 hello world 출력
app.listen(port, () => console.log(`example app listening on port ${port}!`));
//해당 포트 번호에서 실행
