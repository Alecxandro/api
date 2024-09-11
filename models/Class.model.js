import mongoose from "mongoose";
import autopopulate from 'mongoose-autopopulate'

const classSchema =  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'Instructor', autopopulate: true },
    students: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', autopopulate: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', autopopulate: { select: 'username email'} },
    dateCreated: { type: Date, default: Date.now },
    lastUpdated: { type: Date, default: Date.now }
})

classSchema.pre('save', function(next) {
    this.lastUpdated = Date.now();
    next();
});

classSchema.plugin(autopopulate);

const Class = mongoose.model('Class', classSchema);
export default Class;