// Drops keys starting with "$" from JSON bodies so input like {"email": {"$gt": ""}}
// can't smuggle MongoDB operators into queries (NoSQL injection).
const strip = (value) => {
    if (Array.isArray(value)) return value.forEach(strip);
    if (value && typeof value === 'object') {
        for (const key of Object.keys(value)) {
            if (key.startsWith('$')) delete value[key];
            else strip(value[key]);
        }
    }
};

const sanitizeBody = (req, res, next) => {
    strip(req.body);
    next();
};

// For building a $regex from user text: treat it as literal text, not a pattern.
const escapeRegex = (text) => String(text).slice(0, 100).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

module.exports = { sanitizeBody, escapeRegex, strip };
