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
    required: false, // Optional for Google users
    minlength: [6, 'Password must be at least 6 characters'],
  },
  googleId: {
    type: String,
    unique: true,
    sparse: true,
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
    enum: ['user', 'seller', 'admin'],
    default: 'user',
  },
  sellerProfile: {
    shopName: { type: String, default: '' },
    shopDescription: { type: String, default: '' },
    shopLogo: { type: String, default: '' },
    shopBanner: { type: String, default: '' },
    location: {
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    deliveryOptions: {
      sameDay: { type: Boolean, default: false },
      nextDay: { type: Boolean, default: true },
      standard: { type: Boolean, default: true },
      freeAbove: { type: Number, default: 499 },
    },
    isVerified: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    totalSales: { type: Number, default: 0 },
  },
  wishlist: {
    type: Array,
    default: [],
  },
  cart: {
    type: Array,
    default: [],
  },
  giftNote: {
    type: Object,
    default: null,
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
