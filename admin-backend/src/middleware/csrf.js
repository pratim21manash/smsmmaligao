const configuredOrigins = () => [
  process.env.CLIENT_URL,
  "http://localhost:5173",
  "http://localhost:5174",
  "https://backend-fix-maligaon.vercel.app",
  "https://www.stmarysmaligaon.in",
].filter(Boolean);

export const isAllowedOrigin = (origin) => configuredOrigins().includes(origin);

// Cookie-authenticated writes must originate from the trusted frontend. This
// blocks cross-site form submissions while still allowing local development.
export const verifyTrustedOrigin = (req, res, next) => {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) return next();

  const origin = req.get("origin");
  const isProduction = process.env.NODE_ENV === "production" || process.env.RENDER === "true";

  if (!origin && !isProduction) return next();
  if (origin && isAllowedOrigin(origin)) return next();

  return res.status(403).json({
    success: false,
    message: "Request origin is not allowed",
  });
};
