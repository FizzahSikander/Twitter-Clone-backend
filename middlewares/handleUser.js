import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const jwtSecret = "secret by hamoudi";

export const handleRegister = async (req, res) => {
  const { name, email, password, nickname, ...rest } = req.body;

  const emailExist = await User.findOne({ email });
  if (emailExist)
    return res.status(400).json({ error: "Email already exists" });

  const nicknameExist = await User.findOne({ nickname });
  if (nicknameExist)
    return res.status(400).json({ error: "Nickname is taken" });

  const hashed = await bcrypt.hash(password, 5);

  const newUser = new User({
    name,
    email,
    nickname,
    password: hashed,

    ...rest,
  });

  await newUser.save();

  res.status(201).json({ message: "User created" });
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
    .json({ message: "Authenticated" });
};

export const validateUser = async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) return res.status(401).json({ error: "No token provided" });

  jwt.verify(token, jwtSecret, async (err, decoded) => {
    if (err) return res.status(403).json({ error: "Unauthorized token" });

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
