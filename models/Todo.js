import mongoose from 'mongoose';

const TodoSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    status: { type: String, enum: ['pending', 'completed', 'deleted'], default: 'pending' }
}, { timestamps: true });

export default mongoose.model('Todo', TodoSchema);