const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentIntentController = async (req, res) => {
  const { amount, currency = "usd", rideId } = req.body;

  if (!amount) {
    return res.status(400).json({
      success: false,
      message: "Amount is required.",
    });
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to cents
      currency,
      metadata: { rideId },
    });

    return res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return res.status(500).json({
      success: false,
      message: "Error creating payment intent. Please try again.",
    });
  }
};

module.exports = createPaymentIntentController;
