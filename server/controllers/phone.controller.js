import { db } from "../util/db.js";

//verifying OTP worked well but the only constraint is that, it was expensive
//i was not opportuned to implement static OTP but it would have been the same
//pattern i did the email own also if i was oportuned
//
//i USED message central here, and the handle all the otp verification (ranging from the generation to the validation)

export const verifyOTP = async (req, res) => {
  //add joi for this
  const { phone, otpCode } = req.body;

  try {
    const authToken = await generateAuthToken();

    const [user] = await new Promise((resolve, reject) => {
      const query = "SELECT verification_id FROM users WHERE phone = ?";
      db.query(query, [phone], (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });

    console.log(user);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const body = await validateOtp(
      otpCode,
      phone,
      user.verification_id,
      authToken,
    );

    if (
      body.data.verificationStatus === "VERIFICATION_COMPLETED" &&
      body.data.errorMessage == null
    ) {
      const updateQuery = `
        UPDATE users 
        SET is_verified = TRUE, verification_id = NULL 
        WHERE phone = ?`;

      await new Promise((resolve, reject) => {
        db.query(updateQuery, [phone], (error, results) => {
          if (error) return reject(error);
          resolve(results);
        });
      });

      res.status(200).send("OTP verification done!");
    } else {
      res.status(400).send(`Bad Request: ${body.data.errorMessage}`);
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    res.status(500).send(error.toString());
  }
};
