import User from '../models/User';
import bcrypt from 'bcrypt';


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

export const edit = (req, res) => {
    res.send("edit user ›")
}

export const remove = (req, res) => {    
    res.send("delete user")
}

export const getLogin = (req, res) => {
    res.render("login", {pageTitle: "Login"})
}

export const postLogin = async (req, res) => {
    const {email, password} = req.body;
    const pageTitle= "Login";
    // check if email exist 
    const user = await User.findOne({email: email})
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

export const profile = (req, res) => {
    res.send("Profile")
}

export const logout = (req, res) => {
    res.send("Log Out")
}