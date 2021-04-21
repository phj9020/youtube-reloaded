import multer from "multer";

export const localsMiddleware = (req,res,next) => {
    console.log("req.session",req.session)
    res.locals.loggedIn = Boolean(req.session.loggedIn);
    res.locals.siteName="Youtube";
    res.locals.loggedInUser= req.session.user || {};
    
    next();
}


export const privateMiddleware = (req, res, next) => {
    // if user logged-in allow connection 
    if(req.session.loggedIn) {
        next();
    } else {
        // if user not logged-in redirect to login page 
        return res.redirect("/login");
    }
}

// if user logged-in, user will redirected to home 
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        return res.redirect("/");
    }
}

// lets save file in uploads folder 
export const avatarMulterMiddleware = multer({dest: 'uploads/avatars/', limits: {fileSize: 3000000} }); 

export const videoMulterMiddeleware = multer({dest: 'uploads/videos/', limits: {filzeSize: 50000000} });