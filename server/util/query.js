import { db } from "./db.js";

//some random queries that i took out of register and login
//when it is getting too dirty
export const generateUsername = (email) => {
  const randomNumber = Math.floor(Math.random() * 1000);
  const atIndex = email.indexOf("@");
  if (atIndex !== -1) {
    let username = email.substring(0, atIndex);
    username = `${username}${randomNumber}`;
    return username;
  } else {
    return `${email}${randomNumber}`;
  }
};

export const executeQuery = (access) => {
  const query = access.includes("@")
    ? "SELECT * FROM users WHERE email = ?"
    : "SELECT * FROM users WHERE phone = ?";
  const params = [access];

  return new Promise((resolve, reject) => {
    db.query(query, params, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};
