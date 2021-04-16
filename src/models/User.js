import mongoose from 'mongoose';
import bcrypt from 'bcrypt';


const userSchema = new mongoose.Schema({
    email: {type:String, required: true, unique: true},
    username : {type: String, required: true, unique: true},
    password: {type: String, required: true},
    name: {type: String, required: true},
    location: String
})

// add middleware to hash password before save in database
userSchema.pre("save", async function() {
    console.log(this.password)
    this.password = await bcrypt.hash(this.password, 5);
})


const User = mongoose.model("User", userSchema);

export default User;