const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true, // 공백 없애는 역할
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
    type: Number, // 관리자와 일반 유저 구분
    default: 0,
  },
  image: String,
  token: {
    type: String, // 유효성 관리
  },
  tokenExp: {
    type: Number, // 유효기간 설정
  },
});

// 비밀번호 암호화
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    return next(err);
  }
});

// 비밀번호 비교
userSchema.methods.comparePassword = async function (plainPassword) {
  try {
    return await bcrypt.compare(plainPassword, this.password);
  } catch (err) {
    throw err;
  }
};

// 토큰 생성
userSchema.methods.generateToken = async function () {
  try {
    const token = jwt.sign({ id: this._id.toHexString() }, "secretToken");
    this.token = token;
    await this.save();
    return token;
  } catch (err) {
    throw err;
  }
};

// 토큰으로 유저를 찾는 메서드
userSchema.statics.findByToken = async function (token) {
  try {
    // 토큰을 디코드
    const decoded = jwt.verify(token, "secretToken");

    // 디코딩된 정보를 기반으로 유저를 찾기
    return await this.findOne({ _id: decoded.id, token: token });
  } catch (err) {
    throw new Error("토큰이 유효하지 않습니다.");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
