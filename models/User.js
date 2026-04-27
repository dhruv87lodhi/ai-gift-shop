import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  phone: {
    type: String,
    required: false,
  },
  profileImage: {
    type: String,
    default: '',
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  wishlist: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  orders: [{
    orderId: String,
    date: { type: Date, default: Date.now },
    status: String,
    total: Number,
    items: Array,
  }],
  addresses: [{
    name: String,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    phone: String,
    isDefault: { type: Boolean, default: false },
  }],
  giftReminders: [{
    name: String,
    occasion: String,
    date: Date,
    relationship: String,
  }],
}, {
  timestamps: true,
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
