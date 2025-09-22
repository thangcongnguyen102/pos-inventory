// utils/validateUserInput.js
function validateUserInput(username, password) {
    return (
      typeof username === "string" &&
      typeof password === "string" &&
      username.trim() !== "" &&
      password.trim() !== ""
    );
  }
  module.exports = validateUserInput;
  