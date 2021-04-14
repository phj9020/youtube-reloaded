import Video from '../models/Video';

export const home = async(req, res) => {
    const videos = await Video.find({});
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
        return res.render("404", {pageTitle: "Video Not Found"})

    }
    return res.render("edit", {pageTitle: `Editing ${video.title}`, video})
}

export const postEdit = (req, res) => {
    const {id} = req.params;
    // get new input value 
    const {title} = req.body;
    // change DB value 
    

    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async(req, res) => {
    const { title, description, hashtags} = req.body;
    // save Data in Video Schema format 
    try{
        await Video.create({
            title: title,
            description: description,
            hashtags: hashtags.split(",").map(word=>`#${word}`)
        })
        return res.redirect("/");
    } catch(error) {
        res.render("upload", {pageTitle: "Upload Video", errorMessage: error._message});
    }
}

export const search = (req, res) => res.send("Search")


export const deleteVideo = (req, res) => res.send("Delete Videos")