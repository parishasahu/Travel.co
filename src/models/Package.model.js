const mongoose = require('mongoose');

const packageSchema = new mongoose.Schema(
  {
    // ── Core relation ────────────────────────────────────────────────────────
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Package must belong to a destination'],
    },

    title: {
      type: String,
      required: [true, 'Package title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      required: [true, 'Package description is required'],
      maxlength: [3000, 'Description cannot exceed 3000 characters'],
    },

    // ── Duration ─────────────────────────────────────────────────────────────
    duration: {
      days: {
        type: Number,
        required: [true, 'Duration in days is required'],
        min: [1, 'Duration must be at least 1 day'],
      },
      nights: {
        type: Number,
        required: [true, 'Duration in nights is required'],
        min: [0, 'Nights cannot be negative'],
      },
    },

    // ── Pricing ───────────────────────────────────────────────────────────────
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    // Optional sale price — if set and lower than price, show as discounted
    discountPrice: {
      type: Number,
      default: null,
      validate: {
        validator: function (val) {
          // discountPrice must be less than the regular price
          return val === null || val < this.price;
        },
        message: 'Discount price must be less than the regular price',
      },
    },
    currency: {
      type: String,
      default: 'USD',
    },

    // ── What's included / excluded ───────────────────────────────────────────
    inclusions: {
      type: [String], // e.g. ["Flights", "Hotel", "Breakfast", "Airport Transfer"]
      default: [],
    },
    exclusions: {
      type: [String], // e.g. ["Visa fees", "Travel insurance", "Personal expenses"]
      default: [],
    },

    // ── Group details ─────────────────────────────────────────────────────────
    maxGroupSize: {
      type: Number,
      default: 10,
      min: [1, 'Group size must be at least 1'],
    },
    minGroupSize: {
      type: Number,
      default: 1,
    },

    // ── Availability ──────────────────────────────────────────────────────────
    availableFrom: {
      type: Date,
      default: null,
    },
    availableTo: {
      type: Date,
      default: null,
    },
    // Days of week this package runs: [0=Sun, 1=Mon, ... 6=Sat]
    availableDays: {
      type: [Number],
      default: [0, 1, 2, 3, 4, 5, 6], // all days by default
    },

    // ── Type ──────────────────────────────────────────────────────────────────
    type: {
      type: String,
      enum: ['resort', 'villa', 'safari', 'cruise', 'adventure', 'cultural', 'honeymoon'],
      required: [true, 'Package type is required'],
    },

    coverImage: {
      type: String,
      default: null,
    },

    // ── Flags ─────────────────────────────────────────────────────────────────
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
packageSchema.index({ destination: 1, isActive: 1 });
packageSchema.index({ price: 1 });
packageSchema.index({ type: 1 });
packageSchema.index({ isFeatured: 1 });

// ─── Virtual: effective price ─────────────────────────────────────────────────
// Returns discountPrice if available, else regular price
// Use this in your frontend to always show the right price
packageSchema.virtual('effectivePrice').get(function () {
  return this.discountPrice !== null ? this.discountPrice : this.price;
});

// ─── Virtual: discount percentage ────────────────────────────────────────────
packageSchema.virtual('discountPercentage').get(function () {
  if (!this.discountPrice) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

const Package = mongoose.model('Package', packageSchema);
module.exports = Package;