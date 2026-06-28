import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/modules/admin/admin.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    if (!process.env.MONGO_URL) {
      console.error('MONGO_URL is not defined in .env file');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    const email = 'rumman.ahmed.work@gmail.com';
    const password = 'rumman@143';

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists. Updating password...`);
      existingAdmin.password = password; // pre-save hook will hash it
      await existingAdmin.save();
    } else {
      console.log('Creating new admin...');
      const admin = new Admin({
        name: 'Rumman Ahmed',
        email,
        password,
      });
      await admin.save();
    }

    console.log('✅ Admin seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
