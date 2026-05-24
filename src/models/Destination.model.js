const mongoose = require('mongoose');
const slugify = require('../utils/slugify');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      unique: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    // Auto-generated from name — never set manually
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    country: {
      type: String,
      required: [true, 'Country is required'],
      trim: true,
    },

    continent: {
      type: String,
      required: [true, 'Continent is required'],
      enum: {
        values: ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania', 'Antarctica'],
        message: '{VALUE} is not a valid continent',
      },
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: {
        values: ['beach', 'mountain', 'city', 'desert', 'forest', 'island', 'cultural', 'adventure'],
        message: '{VALUE} is not a valid category',
      },
    },

    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },

    // Short version for cards and previews
    summary: {
      type: String,
      maxlength: [300, 'Summary cannot exceed 300 characters'],
    },

    // ── Images ──────────────────────────────────────────────────────────────
    coverImage: {
      type: String,
      required: [true, 'Cover image is required'],
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 10,
        message: 'A destination can have at most 10 images',
      },
    },

    // ── Location (GeoJSON-compatible) ────────────────────────────────────────
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number], // [longitude, latitude] — GeoJSON order
        default: [0, 0],
      },
      address: String,
    },

    // ── Ratings (computed, not user-input) ───────────────────────────────────
    // We update these whenever a review is added/removed
    // Storing them here avoids expensive aggregation on every page load
    averageRating: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be below 0'],
      max: [5, 'Rating cannot exceed 5'],
      set: (val) => Math.round(val * 10) / 10, // round to 1 decimal: 4.666 → 4.7
    },
    reviewCount: {
      type: Number,
      default: 0,
    },

    // ── Pricing hint (actual pricing is on Package model) ────────────────────
    // This is the "starting from" price shown on destination cards
    startingPrice: {
      type: Number,
      default: null,
    },
    currency: {
      type: String,
      default: 'USD',
    },

    // ── Flags ────────────────────────────────────────────────────────────────
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ── Meta (for SEO) ───────────────────────────────────────────────────────
    tags: {
      type: [String],
      default: [],
    },

    // Who created this — links to admin user
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    // Include virtual fields when converting to JSON or Object
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
// Add these BEFORE going to production
//destinationSchema.index({ slug: 1 });                    // unique lookups by slug
destinationSchema.index({ category: 1, isActive: 1 });  // category filter page
destinationSchema.index({ continent: 1, isActive: 1 }); // continent filter
destinationSchema.index({ isFeatured: 1, isActive: 1 }); // featured section
destinationSchema.index({ averageRating: -1 });          // sort by top rated
destinationSchema.index({ startingPrice: 1 });           // sort by price
destinationSchema.index({ name: 'text', country: 'text', tags: 'text' }); // full-text search

// ─── Virtual: packages ────────────────────────────────────────────────────────
// Virtuals are computed fields — they don't exist in the DB
// This virtual lets us do destination.populate('packages') to get all packages
destinationSchema.virtual('packages', {
  ref: 'Package',          // the model to join
  localField: '_id',       // destination's _id
  foreignField: 'destination', // Package.destination field
});

// ─── Pre-save hook: auto-generate slug ───────────────────────────────────────
destinationSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = slugify(this.name);
  }
  next();
});

const Destination = mongoose.model('Destination', destinationSchema);
module.exports = Destination;