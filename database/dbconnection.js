import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://shameemsaifudeen456:123qweasd@cluster0.ys6mrv6.mongodb.net/?retryWrites=true&w=majority', { 
            useNewUrlParser: true,
            useUnifiedTopology: true, 
        });

        console.log("MongoDB connection SUCCESS");
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectDB;
