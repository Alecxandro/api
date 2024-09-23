import mongoose from "mongoose";
import autopopulate from 'mongoose-autopopulate'

const courseSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: { select: 'username email'} },
    dateCreated: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
})

courseSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

courseSchema.plugin(autopopulate);

const Course = mongoose.model('Course', courseSchema)

export default Course