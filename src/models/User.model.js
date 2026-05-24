const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// ─── Embedded sub-schema for profile details ──────────────────────────────────
// Why a sub-schema? It gives us validation and structure on nested data.
// These fields travel with the user document — no extra DB query needed.
const profileSchema = new mongoose.Schema(
  {
    bio: {
      type: String,
      maxlength: [300, 'Bio cannot exceed 300 characters'],
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    country: {
      type: String,
      trim: true,
      default: null,
    },
    city: {
      type: String,
      trim: true,
      default: null,
    },
    dateOfBirth: {
      type: Date,
      default: null,
    },
    travelStyle: {
      type: String,
      enum: ['luxury', 'adventure', 'cultural', 'relaxation', 'budget', null],
      default: null,
    },
    languages: {
      type: [String],
      default: [],
    },
  },
  { _id: false } // No separate _id for embedded sub-docs — they're not standalone
);

// ─── Main User schema ─────────────────────────────────────────────────────────
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [50, 'Name cannot exceed 50 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Embedded ──────────────────────────────────────────────────────────────
    profile: {
      type: profileSchema,
      default: () => ({}), // every new user gets an empty profile object
    },

    // ── Referenced ────────────────────────────────────────────────────────────
    // ObjectId arrays — Mongoose will join these via populate()
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination', // tells Mongoose which model to join
      },
    ],
    savedDestinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
      },
    ],
    // Bookings are stored on the Booking model itself (user field there)
    // We query bookings by userId — no array needed here
  },
  {
    timestamps: true,
  }
);

// ─── Pre-save hook: hash password ─────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
  
});

// ─── Instance method: password comparison ─────────────────────────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance method: safe user object (no password, no __v) ─────────────────
userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

const User = mongoose.model('User', userSchema);
module.exports = User;