// Pure function — no side effects, fully testable
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')        // spaces → hyphens
    .replace(/[^\w\-]+/g, '')    // remove non-word chars (except hyphens)
    .replace(/\-\-+/g, '-')      // collapse multiple hyphens
    .replace(/^-+/, '')          // trim leading hyphens
    .replace(/-+$/, '');         // trim trailing hyphens
};

// Examples:
// "Bali, Indonesia"  → "bali-indonesia"
// "Côte d'Azur"      → "cte-dazur"
// "New  York  City"  → "new-york-city"

module.exports = slugify;