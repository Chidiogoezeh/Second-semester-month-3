import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }
});

UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return; 
    
    // Using 12 rounds for 2026 security standards
    this.password = await bcrypt.hash(this.password, 12);
});

export default mongoose.model('User', UserSchema);