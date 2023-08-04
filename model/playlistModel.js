import mongoose from 'mongoose';

const PublicPlaylistSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    movies: [
        {
            movieId: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            poster: {
                type: String,
                required: false,
            },
        }
    ]
});

const PublicPlaylist = mongoose.model('PublicPlaylist', PublicPlaylistSchema);

export default PublicPlaylist;
