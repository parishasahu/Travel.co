const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    // ── Core relations ────────────────────────────────────────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Review must belong to a destination'],
    },
    // Optional: link to the booking that earned this review
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      default: null,
    },

    // ── Review content ────────────────────────────────────────────────────────
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
      default: null,
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [20, 'Comment must be at least 20 characters'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },

    // ── Subcategory ratings (optional, like Airbnb's detailed ratings) ────────
    subRatings: {
      accommodation: { type: Number, min: 1, max: 5, default: null },
      valueForMoney: { type: Number, min: 1, max: 5, default: null },
      activities:    { type: Number, min: 1, max: 5, default: null },
      transport:     { type: Number, min: 1, max: 5, default: null },
    },

    // ── Moderation ────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'flagged', 'removed'],
      default: 'active',
    },
    flagReason: {
      type: String,
      default: null,
    },

    // ── Helpful votes (future feature placeholder) ────────────────────────────
    helpfulVotes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ─── Compound unique index ─────────────────────────────────────────────────────
// This is the DB-level guarantee that one user = one review per destination
// Even if your service layer check fails, the DB will reject duplicates
reviewSchema.index({ user: 1, destination: 1 }, { unique: true });
reviewSchema.index({ destination: 1, status: 1, createdAt: -1 });
reviewSchema.index({ user: 1, createdAt: -1 });

// ─── Static method: recalculate destination stats ────────────────────────────
// Static methods live on the MODEL CLASS, not on instances
// We call Review.recalculateDestinationStats(destinationId)
reviewSchema.statics.recalculateDestinationStats = async function (destinationId) {
  const Destination = mongoose.model('Destination');

  // MongoDB aggregation: compute average and count in one query
  const stats = await this.aggregate([
    {
      // Stage 1: filter only active reviews for this destination
      $match: {
        destination: new mongoose.Types.ObjectId(destinationId),
        status: 'active',
      },
    },
    {
      // Stage 2: group and compute
      $group: {
        _id: '$destination',
        averageRating: { $avg: '$rating' },
        reviewCount:   { $sum: 1 },
      },
    },
  ]);

  // Update the destination with new stats
  // If no reviews exist yet, reset to defaults
  if (stats.length > 0) {
    await Destination.findByIdAndUpdate(destinationId, {
      averageRating: Math.round(stats[0].averageRating * 10) / 10,
      reviewCount:   stats[0].reviewCount,
    });
  } else {
    await Destination.findByIdAndUpdate(destinationId, {
      averageRating: 0,
      reviewCount:   0,
    });
  }
};

// ─── Post-save hook: recalculate after every save ─────────────────────────────
// 'post' hooks run AFTER the operation completes
// 'this' refers to the saved document instance
reviewSchema.post('save', async function () {
  await this.constructor.recalculateDestinationStats(this.destination);
});

// ─── Post-delete hook: recalculate after deletion ────────────────────────────
// findByIdAndDelete triggers this hook
reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.recalculateDestinationStats(doc.destination);
  }
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;