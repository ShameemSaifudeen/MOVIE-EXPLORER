import mongoose from 'mongoose';

const MovieSchema = new mongoose.Schema({
    movieId: String,
    title: String,
    poster: String
  }, { _id: false });
  
  const PrivatePlaylistSchema = new mongoose.Schema({
    name: String,
    movies: [MovieSchema]
  }, { _id: false });

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: { 
        type: String,
        required: true,
    },
    privatePlaylists: [PrivatePlaylistSchema]
});

const User = mongoose.model('User', UserSchema);

export default User;
