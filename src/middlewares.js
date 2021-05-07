import multer from "multer";
import multerS3 from "multer-s3";
import aws from 'aws-sdk';

const s3 = new aws.S3({ 
    // pass aws key and secret
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})

const multerUploader = multerS3({
        s3: s3,
        bucket: 'wetubereload',
        acl: 'public-read',
})

export const localsMiddleware = (req,res,next) => {
    // console.log("req.session",req.session)
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
        req.flash('error', "Not Authorized");
        // if user not logged-in redirect to login page 
        return res.redirect("/login");
    }
}

// if user logged-in, user will redirected to home 
export const publicOnlyMiddleware = (req, res, next) => {
    if(!req.session.loggedIn) {
        return next();
    } else {
        req.flash('error',"Not Authorized");
        return res.redirect("/");
    }
}

// lets save file in uploads folder 
export const avatarMulterMiddleware = multer({
    dest: 'uploads/avatars/', 
    limits: {fileSize: 3000000}, 
    storage: multerUploader
    }
); 

export const videoMulterMiddeleware = multer({
    dest: 'uploads/videos/', 
    limits: {filzeSize: 50000000}, 
    storage: multerUploader
    }
);