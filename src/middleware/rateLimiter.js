import ratelimit from "../config/upstash.js";

const rateLimiter = async (req, res, next) => {
  try {
    // in real world applications, you would use req.ip or req.headers['x-forwarded-for'] to get the client's IP address
    const { success } = await ratelimit.limit("my-rate-limit"); // Use req.ip to get the client's IP address

    if (!success) {
      console.log("Rate limit exceeded for IP:", req.ip);
      return res
        .status(429)
        .json({ error: "Rate limit exceeded. Please try again later." });
    }

    next(); // Proceed to the next middleware or route handler if rate limit is not exceeded
  } catch (error) {
    console.log("Rate limit error", error);
    next(error); // Pass the error to the next middleware
  }
};

export default rateLimiter;
