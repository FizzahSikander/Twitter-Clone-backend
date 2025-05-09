import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const handleRegister = async (req, res) => {
    const { user, email, password } = req.body;
    console.log(req.body);

    const emailExist = await User.findOne({ email });
    if (emailExist) return res.status(400).json({ error: 'Email already exists' });

    const usernameExist = await User.findOne({ username: user });
    if (usernameExist) return res.status(400).json({ error: 'Username already exists' });

    const hashed = await bcrypt.hash(password, 5);

    const newUser = new User({
        username: user,
        email: email,
        password: hashed,
    });

    await newUser.save();

    res.status(201).json({ message: 'User created' });
};

export const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    const pass = await bcrypt.compare(password, user.password);
    if (!pass) return res.status(400).json({ error: 'Wrong password' });

    const token = jwt.sign({ id: user._id, username: user.username }, 'secret by hamoudi', { expiresIn: '1h' });

    res.cookie('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 1000,
    }).status(200).json({ message: 'Authenticated' });
};
