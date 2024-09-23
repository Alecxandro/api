import mongoose from "mongoose";
import autopopulate from 'mongoose-autopopulate'

const userScheme = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true, trim: true },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'principal', 'instructor', 'student'],
    },
    dateCreated: { type: Date, default: Date.now },
    lastUpdate: { type: Date, default: Date.now},
})

userScheme.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});
userScheme.plugin(autopopulate)

const User = mongoose.model('User', userScheme)

export default User