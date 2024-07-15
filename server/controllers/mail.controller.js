import { db } from "../util/db.js";

export const verifyEmail = async (req, res) => {
  const { token } = req.query;

  try {
    const result = await new Promise((resolve, reject) => {
      const query =
        "UPDATE users SET is_verified = TRUE, verification_token = NULL WHERE verification_token = ?";
      db.query(query, [token], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    res.status(200).json({ message: "Email verified successfully" });
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
