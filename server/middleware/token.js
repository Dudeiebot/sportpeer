import jwt from "jsonwebtoken";

export const authToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(403).json({ message: "Token is not valid" });
  }
};

export const generateJwtToken = (userId) => {
  const time = 3600000 * 60 * 60; // 1 hour
  return jwt.sign({ id: userId }, process.env.JWT_SECRET_KEY, {
    expiresIn: time,
  });
};
