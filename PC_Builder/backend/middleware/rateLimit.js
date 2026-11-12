// shortcut: in-memory counters reset on restart and are per-instance; move to Redis if the backend scales past one instance.
const rateLimit = ({ windowMs, max, message }) => {
    const hits = new Map();

    return (req, res, next) => {
        const now = Date.now();
        const entry = hits.get(req.ip);

        if (!entry || now > entry.resetAt) {
            hits.set(req.ip, { count: 1, resetAt: now + windowMs });
            if (hits.size > 10000) {
                for (const [ip, e] of hits) if (now > e.resetAt) hits.delete(ip);
            }
            return next();
        }

        entry.count += 1;
        if (entry.count > max) {
            res.set('Retry-After', Math.ceil((entry.resetAt - now) / 1000));
            return res.status(429).json({ action: 'chat', reply: message, message });
        }
        next();
    };
};

module.exports = { rateLimit };
