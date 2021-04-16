import User from '../models/User';

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join"})
}

export const postJoin = async(req, res) => {
    const { name, email, username, password, location} = req.body;
        await User.create({
            name: name,
            email: email,
            username: username,
            password: password,
            location: location
        })
        return res.redirect("/login");
    
}

export const edit = (req, res) => {
    res.send("edit user ›")
}

export const remove = (req, res) => {    
    res.send("delete user")
}

export const login = (req, res) => {
    res.send("Login")
}

export const profile = (req, res) => {
    res.send("Profile")
}

export const logout = (req, res) => {
    res.send("Log Out")
}