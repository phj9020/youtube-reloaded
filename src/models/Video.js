import mongoose from 'mongoose';

// 1. create schema
const videoSchema = new mongoose.Schema({
    title:{type: String, required: true, trim: true, maxLength: 50},
    description: {type: String, required: true, trim: true, minLength: 10},
    createdAt: {type:Date, required: true, default: Date.now },
    hashtags: [{type: String, trim: true}],
    fileUrl: {type: String, required: true},
    thumbnailUrl: {type: String, required: true},
    meta: {
        views:{type:Number, required: true, default: 0},
    },
    comments: [{type:mongoose.Schema.Types.ObjectId, ref:"Comment"}],
    owner: {type: mongoose.Schema.Types.ObjectId, required:true, ref:"User"}
});

// schema.static
videoSchema.static('formatHashtags', function(hashtags){
    return hashtags.split(",").map(word => word.startsWith("#") ? word : `#${word}`)
})

// 2. create model
const Video = mongoose.model("Video", videoSchema)

export default Video;