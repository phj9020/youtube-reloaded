import mongoose from 'mongoose';

// 1. create schema
const videoSchema = new mongoose.Schema({
    title:{type: String, required: true, trim: true, maxLength: 50},
    description: {type: String, required: true, trim: true, minLength: 20},
    createdAt: {type:Date, required: true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    meta: {
        views:{type:Number, required: true, default: 0},
        rating: {type:Number, required: true, default: 0},
    },
});

// 2. create model
const Video = mongoose.model("Video", videoSchema)

export default Video;