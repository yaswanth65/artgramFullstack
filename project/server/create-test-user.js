require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Simple user schema for testing
const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: 'customer' },
    passwordResetCode: String,
    passwordResetExpires: Date,
    createdAt: Date,
    updatedAt: Date
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function createTestUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Check if user already exists
        const existingUser = await User.findOne({ email: 'yaswanth.akhil65@gmail.com' });
        if (existingUser) {
            console.log('User already exists:', existingUser.email);
            return;
        }

        // Create test user
        const hashedPassword = await bcrypt.hash('password123', 12);
        const user = new User({
            name: 'Yaswanth Akhil',
            email: 'yaswanth.akhil65@gmail.com',
            password: hashedPassword,
            role: 'customer'
        });

        await user.save();
        console.log('✅ Test user created successfully:', user.email);
        console.log('Password: password123');

    } catch (error) {
        console.error('❌ Error creating test user:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    }
}

createTestUser();
