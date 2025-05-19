import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { uploadImg } from "../configs/cloudinary.js";

const jwtSecret = "secret by hamoudi";

export const handleRegister = async (req, res) => {
  const { name, email, password, nickname, ...rest } = req.body;



  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res.status(400).json({ error: "Email already exists" });

  const nicknameExist = await User.findOne({ nickname });
  if (nicknameExist)
    return res.status(400).json({ error: "Nickname is taken" });

  const imgBuffer = req.file?.buffer;

  let imageUrl
  if (imgBuffer) {
    imageUrl = await uploadImg(imgBuffer)

  }



  const hashed = await bcrypt.hash(password, 5);

  const newUser = new User({
    name,
    email,
    nickname,
    password: hashed,
    ...(imageUrl && { image: imageUrl }),

    ...rest,
  });

  await newUser.save();
  const { password: _, __v, ...safeUser } = newUser.toObject();
res.status(201).json({ message: "User created", user: safeUser });


};

export const handleLogin = async (req, res) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Email not found" });

  const pass = await bcrypt.compare(password, user.password);
  if (!pass) return res.status(400).json({ error: "Wrong password" });

  const token = jwt.sign({ id: user._id, username: user.username }, jwtSecret, {
    expiresIn: "1h",
  });

  res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      maxAge: 60 * 60 * 1000,
    })
    .status(200)
    .json({ message: "Authenticated", user });
};

export const validateUser = async (req, res, next) => {
  const token = req.cookies?.token;


  if (!token) return res.status(403).json({ error: "No token provided" });

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) return res.status(401).json({ error: "Unauthorized token" });

    const user = await User.findById(decoded.id).lean();
    if (!user) return res.status(400).json({ error: "User not found" });
    user.id = user._id.toString();
    delete user._id;
    delete user.__v;
    delete user.password;
    req.user = user;

    next();
  });
};








export const getUser = async (req, res) => {
  const { username } = req.params

  const user = await User.findOne({ nickname: username })
  console.log(user)

  res.status(200).json({ user })
};



export const logoutUser = (req, res) => {
  res
    .clearCookie('token', {
      httpOnly: true,
      secure: true,
    }).status(200).json({ message: 'Logged out' });
};
