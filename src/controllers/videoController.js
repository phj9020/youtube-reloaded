import Video from '../models/Video';
import User from '../models/User';
import Comment from '../models/Comment';


export const home = async(req, res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
    return res.render("home", {pageTitle:"Home", videos})
}

export const watch = async(req, res) => {
    // get id number value from url /1 
    const {id} = req.params;
    // find video which has a specific id from video object and populate("owner")
    const video = await (await (await Video.findById(id).populate("owner").populate("comments")));
    
    if(!video) {
        return res.render("404", {pageTitle: "Video Not Found"})
    }

    return res.render("watch", {pageTitle: video.title, video})
}    

export const getEdit = async(req, res) => {
    const {id} = req.params;
    const {user : {_id}} = req.session;
    // access DB : get selected id video object 
    const video= await Video.findById(id);
    
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video Not Found"})
    }

    // protect to access edit page if user is not owner of the video
    if(String(video.owner) !== String(_id)) {
        req.flash('error',"You are not owner of the Video");
        return res.status(403).redirect("/");
    }

    return res.render("edit", {pageTitle: `Editing ${video.title}`, video})
}

export const postEdit = async(req, res) => {
    const {id} = req.params;
    // get edited input value 
    const {title, description, hashtags} = req.body;

    // update new value in DB
    await Video.findByIdAndUpdate(id,{
        title: title,
        description: description,
        hashtags: Video.formatHashtags(hashtags)
    });

    req.flash('info',"Video has been updated");
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async(req, res) => {
    const {session : {user : {_id}}}=req;
    const {video, thumbnail} = req.files;
    const { body: { title, description, hashtags}} = req;
    const isHeroku = process.env.NODE_ENV === "production";
    // save Data in Video Schema format 
    try{
        const newVideo = await Video.create({
            title: title,
            description: description,
            fileUrl: isHeroku ? video[0].location : video[0].path,
            thumbnailUrl: isHeroku ? thumbnail[0].location : thumbnail[0].path,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        })

        // push newVideo id in videos array in User model
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);

        // save user model 
        user.save();
        req.flash('success',"Video has been uploaded");
        return res.redirect("/");
    } catch(error) {
        res.status(400).render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
    }
}

export const search = async(req, res) => {
    const {keyword} = req.query;
    let videos= [];

    if(keyword) {
        // search 
        videos = await Video.find({
            title: {
                $regex: new RegExp(keyword, "i")
            }
        }).populate("owner");
    }
    return res.render("search", {pageTitle: `Search for ${keyword}`, videos});
}


export const deleteVideo = async(req, res) => {
    const {id} = req.params;
    const {user : {_id}} = req.session;

    const video = await Video.findById(id);
    
    //if video doesnt exist -> 404 
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video Not Found"})
    }

    // if user is not owner of video redirect to home 
    if(String(video.owner) !== String(_id)) {
        req.flash('error',"Not Authorized");
        return res.status(403).redirect("/");
    }
    
    // delete video 
    await Video.findByIdAndDelete(id);
    req.flash('info',"Video has been deleted");
    return res.redirect("/");
}


export const registerView = async(req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video) {
        // res.status()??? ?????? .render()??? ???????????? ??? ??? ?????? 
        // ???????????? render??? ?????? ?????? ????????? view????????? ????????????
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}


export const createComment = async(req,res) => {
    const { id } = req.params;
    const { text } = req.body;
    const { user } = req.session;
    
    const video = await Video.findById(id);

    if(!video) {
        return res.sendStatus(404);
    }
    const comment = await Comment.create({
        text: text,
        owner: user._id,
        video: id
    });

    video.comments.push(comment._id);
    video.save();
    return res.status(201).json({newCommentId : comment._id});
}


export const deleteComment = async(req,res) => {
    const { id } = req.params;
    const { commentId } = req.body;
    
    const video = await Video.findById(id);
    const selectedComment = commentId;
    video.comments.pop(selectedComment);
    video.save();

    await Comment.findByIdAndDelete(commentId);

    return res.sendStatus(204);
}