import express from 'express';
import User from '../model/userModel.js';
import PublicPlaylist from '../model/playlistModel.js';
import isAuthenticated from '../middleware/auth.js';

const router = express.Router();

router.post('/CreatePlaylist', async (req, res) => {
    console.log(req.session);

    const { name, publicPlaylist } = req.body;
    const user = await User.findById(req.session.userId);
    if (!user) {
        res.status(404).send('User not found');
        return;
    }

    if (publicPlaylist) {
        const newPlaylist = new PublicPlaylist({ name, movies: [], createdBy: user._id });
        await newPlaylist.save();
    } else {
        const newPlaylist = { name, movies: [] };
        user.privatePlaylists.push(newPlaylist);
        await user.save();
    }

    res.status(200).send('Playlist created successfully');
});

router.get('/public-playlists', async (req, res) => {
    console.log(req.session);

    const playlists = await PublicPlaylist.find();
    res.json(playlists);
});

router.get('/private-playlists', async (req, res) => {
    console.log(req.session);

    const user = await User.findById(req.session.userId);
    if (user) {
        res.json(user.privatePlaylists);
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});

router.post('/public-playlists/:name', async (req, res) => {
    console.log(req.session);

    const { movieId, title, poster } = req.body;
    const movie = { movieId, title, poster };

    const result = await PublicPlaylist.updateOne(
        { name: req.params.name },
        { $push: { movies: movie } }
    );
    
    if (result.nModified === 0) return res.status(404).json({ error: 'Playlist not found' });
    res.json({ message: 'Movie added successfully' });
});

router.post('/private-playlists/:playlistName', async (req, res) => {
    console.log(req.session);

    const { movieId, title, poster } = req.body;
    const user = await User.findById(req.session.userId);

    if (!user) return res.status(404).json({ error: 'User not found' });

    const playlist = user.privatePlaylists.find(playlist => playlist.name === req.params.playlistName);

    if (!playlist) return res.status(404).json({ error: 'Playlist not found' });

    playlist.movies.push({ movieId, title, poster });
    await user.save();

    res.json({ message: 'Movie added successfully' });
});

export default router;
