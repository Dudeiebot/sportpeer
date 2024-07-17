import bcrypt from "bcrypt";
import Joi from "joi";
import jwt from "jsonwebtoken";
import { db } from "../util/db.js";
import { sender } from "../util/mail.js";
import { sendOtp, generateAuthToken } from "../util/phone.js";
import { generateUsername, executeQuery } from "../util/query.js";
import { sendEmailVerification, sendPhoneVerification } from "../util/mail.js";
import { generateJwtToken } from "../middleware/token.js";

// Taking all our register, login and logout api integration
//  req  to res

export const register = async (req, res) => {
  const { email, phoneNos, password, bio, sportInterest, verificationMethod } =
    req.body;
  const username = generateUsername(email);

  try {
    const hashedpassword = await bcrypt.hash(password, 10);
    const verificationtoken =
      verificationMethod === "email" ? crypto.randomUUID() : null;

    // insert user into database
    const userquery = await new Promise((resolve, reject) => {
      const query =
        "insert into users (username, email, bio, phone, password, verification_token) values (?, ?, ?, ?, ?, ?)";
      db.query(
        query,
        [username, email, bio, phoneNos, hashedpassword, verificationtoken],
        (error, results) => {
          if (error) return reject(error);
          resolve(results);
        },
      );
    });

    const userid = userquery.insertId;

    // our sport interests data is an array, so we have to go through it one by one to insert it in our database
    //  that is the most efficient way i can think of
    //  because we need to have a connection between our every individual and their favorite sport
    //  and you cant limit them to a sport
    //  so i have 2 bd that communicates with their id
    //  i can use the user_id and the sport_id to form a connection between like minded people

    // insert sports interests into profiles table
    for (let sport of sportInterest) {
      const query =
        "insert into profiles (user_id, favorite_sport) values (?, ?)";
      await new Promise((resolve, reject) => {
        db.query(query, [userid, sport], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });
    }

    // send verification based on method
    if (verificationMethod === "email") {
      await sendEmailVerification(email, verificationtoken, req, res);
    } else if (verificationMethod === "phone") {
      await sendPhoneVerification(phonenos, res);
    }
  } catch (error) {
    if (error.code === "er_dup_entry") {
      return res.status(400).json({ message: "email address already exists" });
    }
    console.error("error registering user:", error);
    return res.status(500).json({ message: "internal server error" });
  }
};

//LOGIN
export const login = async (req, res) => {
  const { access, password } = req.body;

  try {
    const userresults = await executeQuery(access);
    const user = userresults[0];

    // validate password
    const ispasswordvalid = await bcrypt.compare(password, user.password);
    if (!ispasswordvalid) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // check if user is verified
    if (!user.is_verified) {
      return res
        .status(401)
        .json({ message: "please verify your account before logging in" });
    }

    // generate jwt token
    const token = generateJwtToken(user.id);

    const { password: userPassword, ...userInfo } = user;
    // Send response with JWT token in cookie
    res
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 3600000 * 60 * 60, // 1 hour
      })
      .status(200)
      .json(userInfo);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//logout
export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "logout successfully" });
};
