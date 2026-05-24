const mongoose = require('mongoose');

// ─── Snapshot sub-schema ──────────────────────────────────────────────────────
// This is a point-in-time copy of the package/destination data
// captured at the moment the booking was created
const packageSnapshotSchema = new mongoose.Schema(
  {
    title: String,
    duration: {
      days: Number,
      nights: Number,
    },
    type: String,
    inclusions: [String],
    coverImage: String,
    // The price the user actually paid — this never changes
    priceAtBooking: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const destinationSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    country: String,
    continent: String,
    coverImage: String,
    slug: String,
  },
  { _id: false }
);

// ─── Main Booking schema ──────────────────────────────────────────────────────
const bookingSchema = new mongoose.Schema(
  {
    // ── References (for querying relationships) ────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Package',
      required: [true, 'Booking must reference a package'],
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Booking must reference a destination'],
    },

    // ── Snapshots (for display — never changes after creation) ────────────
    packageSnapshot: {
      type: packageSnapshotSchema,
      required: true,
    },
    destinationSnapshot: {
      type: destinationSnapshotSchema,
      required: true,
    },

    // ── Guest details ──────────────────────────────────────────────────────
    guests: {
      adults: {
        type: Number,
        required: [true, 'Number of adults is required'],
        min: [1, 'At least 1 adult is required'],
      },
      children: {
        type: Number,
        default: 0,
        min: [0, 'Children count cannot be negative'],
      },
    },

    // ── Travel dates ───────────────────────────────────────────────────────
    travelDate: {
      type: Date,
      required: [true, 'Travel date is required'],
    },
    returnDate: {
      type: Date,
      default: null,
    },

    // ── Pricing (locked at booking time) ───────────────────────────────────
    totalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },

    // ── Status state machine ───────────────────────────────────────────────
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'pending',
    },

    // ── Cancellation details ───────────────────────────────────────────────
    cancellation: {
      cancelledAt: { type: Date, default: null },
      cancelledBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null,
      },
      reason: { type: String, default: null },
    },

    // ── Special requests from the user ────────────────────────────────────
    specialRequests: {
      type: String,
      maxlength: [500, 'Special requests cannot exceed 500 characters'],
      default: null,
    },

    // ── Payment (stub for Day 7 Stripe integration) ────────────────────────
    payment: {
      method: {
        type: String,
        enum: ['card', 'bank_transfer', 'pending'],
        default: 'pending',
      },
      status: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid',
      },
      transactionId: { type: String, default: null },
      paidAt: { type: Date, default: null },
    },

    // ── Unique reference shown to user ─────────────────────────────────────
    // e.g. "LT-2024-AB3X9" — human-readable booking reference
    bookingReference: {
      type: String,
      unique: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
bookingSchema.index({ user: 1, createdAt: -1 });       // user's booking history
bookingSchema.index({ package: 1, travelDate: 1 });    // check availability
bookingSchema.index({ status: 1 });                    // admin filtering by status
//bookingSchema.index({ bookingReference: 1 });          // reference lookups
bookingSchema.index({ destination: 1, status: 1 });    // destination booking reports

// ─── Virtual: total guests ────────────────────────────────────────────────────
bookingSchema.virtual('totalGuests').get(function () {
  return this.guests.adults + this.guests.children;
});

// ─── Virtual: is cancellable ──────────────────────────────────────────────────
bookingSchema.virtual('isCancellable').get(function () {
  return ['pending', 'confirmed'].includes(this.status);
});

// ─── Pre-save hook: generate booking reference ────────────────────────────────
bookingSchema.pre('save', function (next) {
  if (!this.bookingReference) {
    // Format: LT-YEAR-RANDOMCHARS  e.g. LT-2024-X7K2M
    const year = new Date().getFullYear();
    const chars = Math.random().toString(36).substring(2, 7).toUpperCase();
    this.bookingReference = `LT-${year}-${chars}`;
  }
  next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;