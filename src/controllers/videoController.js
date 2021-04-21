import Video from '../models/Video';

export const home = async(req, res) => {
    const videos = await Video.find({}).sort({createdAt:"desc"});
    return res.render("home", {pageTitle:"Home", videos})
}

export const watch = async(req, res) => {
    // get id number value from url /1 
    const {id} = req.params;
    // find video which has a specific id from video object 
    const video = await Video.findById(id);
    if(!video) {
        return res.render("404", {pageTitle: "Video Not Found"})
    }
    return res.render("watch", {pageTitle: video.title, video})
}    

export const getEdit = async(req, res) => {
    const {id} = req.params;
    // access DB : get selected id video object 
    const video= await Video.findById(id);

    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video Not Found"})
    }
    return res.render("edit", {pageTitle: `Editing ${video.title}`, video})
}

export const postEdit = async(req, res) => {
    const {id} = req.params;
    // get edited input value 
    const {title, description, hashtags} = req.body;
    // find Video by id if video exists
    const video = await Video.exists({ _id: id });
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video Not Found"})
    }
    // update new value in DB
    await Video.findByIdAndUpdate(id,{
        title: title,
        description: description,
        hashtags: Video.formatHashtags(hashtags)
    })
    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async(req, res) => {
    const {path: fileUrl} = req.file;
    const { body: { title, description, hashtags}} = req;
    // save Data in Video Schema format 
    try{
        await Video.create({
            title: title,
            description: description,
            fileUrl: fileUrl,
            hashtags: Video.formatHashtags(hashtags)
        })
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
        })
    }
    return res.render("search", {pageTitle: `Search for ${keyword}`, videos});
}


export const deleteVideo = async(req, res) => {
    const {id} = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect("/");
}