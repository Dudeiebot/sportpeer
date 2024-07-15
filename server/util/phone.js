import { db } from "../util/db.js";
import "dotenv/config";
import request from "request";

const email = process.env.EMAIL;
const customerId = process.env.CUSTOMERID;
const password = process.env.OTP_PASSWORD;

export const generateAuthToken = async () => {
  const base64String = Buffer.from(password).toString("base64");

  const url = `https://cpaas.messagecentral.com/auth/v1/authentication/token?country=IN&customerId=${customerId}&email=${email}&key=${base64String}&scope=NEW`;

  const options = {
    url: url,
    headers: {
      accept: "*/*",
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.error("Error generating auth token:", error);
        reject(error);
        return;
      }

      console.log("Auth Token:", body);
      const authToken = JSON.parse(body).token;

      resolve(authToken);
    });
  });
};

// Function to send OTP via Message Central
export const sendOtp = async (mobileNumber, authToken) => {
  const url = `https://cpaas.messagecentral.com/verification/v2/verification/send?countryCode=234&customerId=${customerId}&flowType=SMS&mobileNumber=${mobileNumber}`;

  const options = {
    url: url,
    method: "POST",
    json: true,
    headers: {
      accept: "*/*",
      authToken: authToken,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.error("Error sending OTP:", error);
        reject(error);
        return;
      }

      console.log("OTP Sent Response:", body);

      // Store the verificationId in the database
      const verificationId = body.data.verificationId;

      const updateQuery = `
        UPDATE users 
        SET verification_id = ? 
        WHERE phone = ?`;

      db.query(
        updateQuery,
        [verificationId, mobileNumber],
        (error, results) => {
          if (error) {
            console.error(
              "Error updating verificationId in the database:",
              error,
            );
            reject(error);
            return;
          }
          resolve(body);
        },
      );
    });
  });
};

const validateOtp = async (
  otpCode,
  mobileNumber,
  verificationId,
  authToken,
) => {
  const url = `https://cpaas.messagecentral.com/verification/v2/verification/validateOtp?countryCode=234&mobileNumber=${mobileNumber}&verificationId=${verificationId}&customerId=${customerId}&code=${otpCode}`;

  const options = {
    url: url,
    method: "GET",
    json: true,
    headers: {
      accept: "*/*",
      authToken: authToken,
    },
  };

  return new Promise((resolve, reject) => {
    request(options, (error, response, body) => {
      if (error) {
        console.error("Error validating OTP:", error);
        reject(error);
        return;
      }
      console.log("Request:", options);
      console.log("Body:", body);

      resolve(body);
    });
  });
};

export const sendPhoneVerification = async (phoneNos, res) => {
  try {
    const authToken = await generateAuthToken();
    const response = await sendOtp(phoneNos, authToken);

    console.log("OTP Sent Response:", response);
    res.status(200).json({
      message: "OTP sent successfully to your phone number. Please verify.",
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
