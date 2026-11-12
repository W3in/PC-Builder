const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const { priceOrder } = require('../services/orderPricing');

const createPaymentIntent = async (req, res) => {
    const { orderItems, couponCode } = req.body;

    try {
        // Never trust an amount from the browser: price the cart from the database.
        const { totalPrice } = await priceOrder(orderItems, couponCode);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalPrice, // VND is a zero-decimal currency in Stripe
            currency: 'vnd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: { userId: req.user._id.toString() },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            amount: totalPrice,
        });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message, message: error.message });
    }
};

module.exports = { createPaymentIntent, stripe };
