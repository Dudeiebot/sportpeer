import bcrypt from "bcrypt";
import { db } from "../util/db.js";

export const updateUserName = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { userName } = req.body;

  if (id != tokenUserId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!userName || userName.trim() === "") {
    return res.status(400).json({ message: "Invalid Username" });
  }

  try {
    const query = "UPDATE users SET username = ? WHERE id = ?";
    await db.query(query, [userName, id]);
    return res.status(200).json({ message: "Username successfully changed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.message });
  }
};

export const updateEmail = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { email } = req.body;

  if (id != tokenUserId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!email) {
    return res.status(400).json({ message: "Invalid Email" });
  }

  try {
    const query = "UPDATE users SET email = ? WHERE id = ?";
    await db.query(query, [email, id]);
    return res.status(200).json({ message: "Email successfully changed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: error.message });
  }
};

export const updatePass = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { oldPass, newPass } = req.body;

  if (id != tokenUserId) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  if (!newPass || !oldPass) {
    return res
      .status(400)
      .json({ message: "Please provide both old and new passwords" });
  }

  try {
    const userResults = await new Promise((resolve, reject) => {
      const query = "SELECT password FROM users WHERE id = ?";
      db.query(query, [id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResults[0];
    const isPasswordValid = await bcrypt.compare(oldPass, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid old password" });
    }

    const hashedNewPass = await bcrypt.hash(newPass, 10);
    const updateQuery = "UPDATE users SET password = ? WHERE id = ?";
    await new Promise((resolve, reject) => {
      db.query(updateQuery, [hashedNewPass, id], (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    return res.status(200).json({ message: "Password successfully changed" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};
