import express from 'express';
import User from '../model/userModel.js';
import bcrypt from 'bcrypt';
import isAuthenticated from '../middleware/auth.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { username, password } = req.body;
    try {
        let user = await User.findOne({ username });

        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({ username, password: hashedPassword });

        await user.save();

        res.status(200).json({ success: true, msg: 'User signed up successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
        return res.status(400).json({ message: 'User not found' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
        return res.status(400).json({ message: 'Invalid password' });
    }
    req.session.userId = user._id
    req.session.userId = user._id;
    req.session.save(function(err) {
        res.json({ message: 'Login successful', userId: user._id });
      })
});

router.post('/logout', isAuthenticated, (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.status(500).send('Server error');
        }

        // You might also want to clear the related cookie here
        res.clearCookie('sid');

        res.status(200).send('Logout successful');
    });
   
});

export default router;
