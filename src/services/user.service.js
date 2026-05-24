const User = require('../models/User.model');
const ApiError = require('../utils/ApiError');

// ─── Get my full profile ───────────────────────────────────────────────────────
const getMyProfile = async (userId) => {
  // populate() does a second DB query to join the referenced Destination docs
  // We only select the fields we actually need — never over-fetch
  const user = await User.findById(userId)
    .populate('wishlist', 'name country coverImage averageRating price')
    .populate('savedDestinations', 'name country coverImage averageRating price');

  if (!user) throw new ApiError(404, 'User not found');

  return user.toSafeObject();
};

// ─── Update my profile ────────────────────────────────────────────────────────
// PATCH semantics: only update fields that were actually sent
// Never do a full document replacement (that's PUT, and it's dangerous)
const updateMyProfile = async (userId, updateData) => {
  // Whitelist allowed top-level fields
  // This prevents a user from sending { role: 'admin' } and escalating privileges
  const allowedFields = ['name', 'avatar', 'profile'];

  const sanitizedUpdate = {};
  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      sanitizedUpdate[field] = updateData[field];
    }
  });

  if (Object.keys(sanitizedUpdate).length === 0) {
    throw new ApiError(400, 'No valid fields provided for update');
  }

  // For nested profile fields, we need dot-notation to do partial updates
  // Without this, sending { profile: { bio: "hello" } } would WIPE all other profile fields
  const flatUpdate = {};
  if (sanitizedUpdate.profile) {
    Object.entries(sanitizedUpdate.profile).forEach(([key, value]) => {
      flatUpdate[`profile.${key}`] = value; // e.g. "profile.bio": "hello"
    });
    delete sanitizedUpdate.profile;
  }
  Object.assign(flatUpdate, sanitizedUpdate);

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: flatUpdate },         // $set: only update specified fields, leave rest untouched
    {
      new: true,                  // return the updated document, not the old one
      runValidators: true,        // run schema validators on the updated fields
    }
  );

  if (!user) throw new ApiError(404, 'User not found');

  return user.toSafeObject();
};

// ─── Change password ──────────────────────────────────────────────────────────
const changePassword = async (userId, { currentPassword, newPassword }) => {
  // Must explicitly select password — it's excluded by default (select: false)
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) throw new ApiError(401, 'Current password is incorrect');

  // Assign to trigger the pre-save hook which hashes it
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully' };
};

// ─── Wishlist: toggle a destination ──────────────────────────────────────────
// Industry pattern: one endpoint that adds if not present, removes if present
// Frontend doesn't need to track state — the API is the source of truth
const toggleWishlist = async (userId, destinationId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  // Check if this destinationId is already in the wishlist array
  const isWishlisted = user.wishlist.some(
    (id) => id.toString() === destinationId
  );

  let updatedUser;

  if (isWishlisted) {
    // $pull: remove a value from an array — atomic, safe, one query
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: destinationId } },
      { new: true }
    ).populate('wishlist', 'name country coverImage averageRating price');

    return { action: 'removed', wishlist: updatedUser.wishlist };
  } else {
    // $addToSet: add to array ONLY if not already present — prevents duplicates
    // Never use $push for this — it allows duplicates
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: destinationId } },
      { new: true }
    ).populate('wishlist', 'name country coverImage averageRating price');

    return { action: 'added', wishlist: updatedUser.wishlist };
  }
};

// ─── Saved destinations: toggle ───────────────────────────────────────────────
const toggleSavedDestination = async (userId, destinationId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');

  const isSaved = user.savedDestinations.some(
    (id) => id.toString() === destinationId
  );

  let updatedUser;

  if (isSaved) {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { savedDestinations: destinationId } },
      { new: true }
    ).populate('savedDestinations', 'name country coverImage averageRating price');

    return { action: 'removed', savedDestinations: updatedUser.savedDestinations };
  } else {
    updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { savedDestinations: destinationId } },
      { new: true }
    ).populate('savedDestinations', 'name country coverImage averageRating price');

    return { action: 'added', savedDestinations: updatedUser.savedDestinations };
  }
};

// ─── Get my wishlist ──────────────────────────────────────────────────────────
const getMyWishlist = async (userId) => {
  const user = await User.findById(userId).populate(
    'wishlist',
    'name country coverImage averageRating price category isFeatured'
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user.wishlist;
};

// ─── Get my saved destinations ────────────────────────────────────────────────
const getMySavedDestinations = async (userId) => {
  const user = await User.findById(userId).populate(
    'savedDestinations',
    'name country coverImage averageRating price category isFeatured'
  );
  if (!user) throw new ApiError(404, 'User not found');
  return user.savedDestinations;
};

// ─── Deactivate my account ────────────────────────────────────────────────────
// Industry practice: never hard-delete user accounts
// Set isActive: false — data is preserved, auditable, recoverable
const deactivateAccount = async (userId) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { isActive: false },
    { new: true }
  );
  if (!user) throw new ApiError(404, 'User not found');
  return { message: 'Account deactivated successfully' };
};

module.exports = {
  getMyProfile,
  updateMyProfile,
  changePassword,
  toggleWishlist,
  toggleSavedDestination,
  getMyWishlist,
  getMySavedDestinations,
  deactivateAccount,
};