import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from './src/modules/admin/admin.model.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const { MONGO_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;

    if (!MONGO_URL || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
      throw new Error(
        'MONGO_URL, ADMIN_EMAIL, and ADMIN_PASSWORD must be set before seeding an admin.'
      );
    }

    if (ADMIN_PASSWORD.length < 8) {
      throw new Error('ADMIN_PASSWORD must be at least 8 characters long.');
    }

    await mongoose.connect(MONGO_URL);
    console.log('Connected to MongoDB');

    const email = ADMIN_EMAIL.toLowerCase().trim();

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      console.log(`Admin with email ${email} already exists. No changes made.`);
    } else {
      console.log('Creating new admin...');
      const admin = new Admin({
        name: process.env.ADMIN_NAME || 'Admin',
        email,
        password: ADMIN_PASSWORD,
      });
      await admin.save();
    }

    console.log('✅ Admin seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding admin:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
