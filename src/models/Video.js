import mongoose from 'mongoose';

// 1. create schema
const videoSchema = new mongoose.Schema({
    title:{type: String, required: true},
    description: {type: String, required: true},
    createdAt: {type:Date, required: true, default: Date.now },
    hashtags: [{ type: String }],
    meta: {
        views:{ type:Number, required: true, default: 0},
        rating: {type:Number, required: true, default: 0},
    },
});

// 2. create model
const Video = mongoose.model("Video", videoSchema)

export default Video;