import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { db } from "../util/db.js";
import { sender } from "../util/mail.js";
import { sendOtp, generateAuthToken } from "../util/phone.js";
import { generateUsername, executeQuery } from "../util/query.js";
import { sendEmailVerification, sendPhoneVerification } from "../util/mail.js";
import { generateJwtToken } from "../middleware/token.js";

export const register = async (req, res) => {
  const { email, phoneNos, password, sportInterest, verificationMethod } =
    req.body;
  const username = generateUsername(email);

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken =
      verificationMethod === "email" ? crypto.randomUUID() : null;

    // Insert user into database
    const userQuery = await new Promise((resolve, reject) => {
      const query =
        "INSERT INTO users (username, email, phone, password, verification_token) VALUES (?, ?, ?, ?, ?)";
      db.query(
        query,
        [username, email, phoneNos, hashedPassword, verificationToken],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        },
      );
    });

    const userId = userQuery.insertId;

    // Insert sports interests into profiles table
    for (let sport of sportInterest) {
      const query =
        "INSERT INTO profiles (user_id, favorite_sport) VALUES (?, ?)";
      await new Promise((resolve, reject) => {
        db.query(query, [userId, sport], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
    }

    // Send verification based on method
    if (verificationMethod === "email") {
      await sendEmailVerification(email, verificationToken, req, res);
    } else if (verificationMethod === "phone") {
      await sendPhoneVerification(phoneNos, res);
    }
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ message: "Email address already exists" });
    }
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { access, password } = req.body;

  try {
    const userResults = await executeQuery(access);
    const user = userResults[0];

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res
        .status(401)
        .json({ message: "Please verify your account before logging in" });
    }

    // Generate JWT token
    const token = generateJwtToken(user.id);

    // Send response with JWT token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000 * 60 * 60, // 1 hour
      })
      .status(200)
      .json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "logout successfully" });
};
