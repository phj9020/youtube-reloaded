let videos = [{
    title: "video 1",
    rating: 5,
    comment: 2,
    createdAt: "2 min ago",
    views: 1,
    id: 1
}, {
    title: "video 2",
    rating: 4,
    comment: 22,
    createdAt: "5 min ago",
    views: 10,
    id: 2
},{
    title: "video 3",
    rating: 2,
    comment: 1,
    createdAt: "10 min ago",
    views: 23,
    id:3
}];

export const trending = (req, res) => {
    return res.render("home", {pageTitle: "Home", videos});
}

export const watch = (req, res) => {
    // get id number value from url /1 
    const {id} = req.params;
    // access DB : get selected id video object 
    const video = videos[id - 1];
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video})
}    

export const getEdit = (req, res) => {
    const {id} = req.params;
    // access DB : get selected id video object 
    const video = videos[id - 1]; 
    return res.render("edit", {pageTitle: `Editing ${video.title}`, video})
}

export const postEdit = (req, res) => {
    const {id} = req.params;
    // get new input value 
    const {title} = req.body;
    // change DB value 
    videos[id - 1].title = title;

    return res.redirect(`/videos/${id}`);
}

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = (req, res) => {
    const {title, description} = req.body;
    // add video to the videos array
    const newVideo = {
        title: title,
        rating: 5,
        comment: 2,
        createdAt: "2 min ago",
        views: 1,
        description: description,
        id: videos.length + 1
    }
    videos.push(newVideo);
    console.log(videos);

    return res.redirect("/");
}

export const search = (req, res) => res.send("Search")


export const deleteVideo = (req, res) => res.send("Delete Videos")