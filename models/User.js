const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, //공백 없애주는 역할
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    //관리자와 일반 유저 구분
    type: Number,
    default: 0,
  },
  image: String,
  token: {
    //유효성 관리
    type: String,
  },
  tokenExp: {
    //유효기간 설정
    type: Number,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = { User };
