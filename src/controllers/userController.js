import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'node-fetch';


export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join"})
}

export const postJoin = async(req, res) => {
    const { name, email, username, password1, password2, location} = req.body;
    const pageTitle = "Join";

    // check password match 
    if(password1 !== password2) {
        return res.status(400).render("join", {pageTitle: pageTitle, errorMessage: "Password Confirmation does not match"})
    }

    // check email or uesrname already exist 
    const exist = await User.exists({$or: [{username: username}, {email: email}]});
    if(exist) {
        return res.status(400).render("join", {pageTitle: pageTitle, errorMessage: "This Username/Email is already taken"})
    }
    
    // save User info in DB
    try {
        await User.create({
            name: name,
            email: email,
            username: username,
            password: password2,
            location: location
        })
        return res.redirect("/login");
    } catch(error) {
        return res.status(400).render("join", {pageTitle:pageTitle, errorMessage: error._message })
    }
}

export const getEdit = (req, res) => {
    return res.render("edit-profile", {pageTitle: "Edit Profile"})
}

export const postEdit = async(req, res) => {
    // Update Profile in DB
    // 1. find id in req.session, find input value in req.body
    const { session: {user : {_id}}, body : {email, username, name, location} } = req;

    // check if input email from session
    if(req.session.user.email !== email) {
        const exist = await User.exists({email: req.body.email}); 
        
        if(exist) {
            return res.status(400).render("edit-profile", {pageTitle:"Edit Profile", errorMessage:"This email is already taken. Please use another email"})
        }
        // 2. find by id and update in mongodb
        const updatedUser = await User.findByIdAndUpdate(_id, {
            name: name,
            email: email,
            username: username,
            location: location
        }, {new: true});
        // 3. update session with new object
        req.session.user = updatedUser;
        return res.redirect("/users/edit");
    } 
    
    // check if input username is different from session
    if(req.session.user.username !== username) {
        // 2. find by id and update in mongodb
        const updatedUser = await User.findByIdAndUpdate(_id, {
            name: name,
            email: email,
            username: username,
            location: location
        }, {new: true});
        // 3. update session with new object
        req.session.user = updatedUser;
        return res.redirect("/users/edit");
    }
    return res.render("edit-profile", {pageTitle:"Edit Profile", errorMessage:"This Email/Username is same as before"})
}

export const remove = (req, res) => {    
    res.send("delete user")
}

export const profile = (req, res) => {
    res.send("Profile")
}

export const getLogin = (req, res) => {
    res.render("login", {pageTitle: "Login"})
}

export const postLogin = async (req, res) => {
    const {email, password} = req.body;
    const pageTitle= "Login";
    // check if email exist 
    const user = await User.findOne({email: email, socialLogin: false})
    if(!user) {
        return res.status(400).render("login", {pageTitle, errorMessage:"Account with this email does not exist"})
    }
    // check if password match
    // get user object by email and get password 
    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        return res.status(400).render("login", {pageTitle, errorMessage: "Wrong Password"})
    }
    // store user in session to remember user is logged in
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/")
}


export const logout = (req, res) => {
    // destroy session (logout)
    req.session.destroy();
    return res.redirect("/");
}


// 1. send user to github : redirect github login url 
export const startGithubLogin = (req, res) => {
    const baseURL = `https://github.com/login/oauth/authorize`;
    const configObject = {
        client_id:process.env.GITHUB_CLIENT_ID,
        allow_signup: false,
        scope: "read:user user:email",
    }
    const params = new URLSearchParams(configObject).toString();
    const redirectedURL = `${baseURL}?${params}`;
    return res.redirect(redirectedURL)
}

// 2. return with code github provided -> get code value & make postURL and POST 
export const finishGithubLogin = async(req, res) => {
    const baseURL = `https://github.com/login/oauth/access_token`;
    const configObject = {
        client_id:process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: req.query.code
    }
    const params = new URLSearchParams(configObject).toString();
    const postURL = `${baseURL}?${params}`;

    // post url 
    const tokenRequest = await (await fetch(postURL, {
        method: 'POST',
        headers: {
            Accept: 'application/json'
        }
    })).json();
    
    // 3. get access token  
    // if access token exist 
    if("access_token" in tokenRequest) {
        // get access token & acess api
        const {access_token} = tokenRequest;
        const apiUrl = "https://api.github.com";
        // get user data
        const userData = await (await fetch(`${apiUrl}/user`, {
            method: "GET",
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();

        console.log(userData);

        // get email data ( array of private email / public email)
        const emailData= await (await fetch(`${apiUrl}/user/emails`, {
            method: "GET",
            headers: {
                Authorization: `token ${access_token}`
            }
        })).json();

        // find email in emailData Array which both primary and verified is true  
        const githubEmailObj = emailData.find(email => email.primary === true && email.verified === true);
        
        if(!githubEmailObj) {
            // to do : set notification 
            return res.redirect("/login");
        }

        // check if email already exist in local, let them login 
        let user = await User.findOne({email: githubEmailObj.email});

        if(!user) {
            // if github email doesn't exist in mongod DB, create account 
            user = await User.create({
                    email: githubEmailObj.email,
                    socialLogin: true,
                    avatarUrl: userData.avatar_url,
                    username: userData.login,
                    password: "",
                    name: userData.name,
                    location: userData.location,
                });
        } 
        // login 
        req.session.loggedIn = true;
        req.session.user = user;
        return res.redirect("/")
        
    } else {
        return res.redirect("/login");
    }
}