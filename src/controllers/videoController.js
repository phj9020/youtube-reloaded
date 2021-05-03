import Video from '../models/Video';
import User from '../models/User';


export const home = async(req, res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"}).populate("owner");
    return res.render("home", {pageTitle:"Home", videos})
}

export const watch = async(req, res) => {
    // get id number value from url /1 
    const {id} = req.params;
    // find video which has a specific id from video object and populate("owner")
    const video = await Video.findById(id).populate("owner");

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


    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async(req, res) => {
    const {session : {user : {_id}}}=req;
    const {path: fileUrl} = req.file;
    const { body: { title, description, hashtags}} = req;

    console.log(_id)
    // save Data in Video Schema format 
    try{
        const newVideo = await Video.create({
            title: title,
            description: description,
            fileUrl: fileUrl,
            hashtags: Video.formatHashtags(hashtags),
            owner: _id,
        })

        // push newVideo id in videos array in User model
        const user = await User.findById(_id);
        user.videos.push(newVideo._id);

        // save user model 
        user.save();

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
        return res.status(403).redirect("/");
    }
    
    // delete video 
    await Video.findByIdAndDelete(id);
    
    return res.redirect("/");
}


export const registerView = async(req,res) => {
    const {id} = req.params;
    const video = await Video.findById(id);
    if(!video) {
        // res.status()는 뒤에 .render()가 있어야만 쓸 수 있다 
        // 여기서는 render할 필요 없이 백엔드 view처리만 해야한다
        return res.sendStatus(404);
    }
    video.meta.views = video.meta.views + 1;
    await video.save();
    return res.sendStatus(200);
}