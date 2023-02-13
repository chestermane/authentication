const bcrypt = require("bcrypt");

export const hashPassword = (password) => {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return false;

    bcrypt.hash(password, salt, (err, hash) => {
      if (err) return false;
      console.log(hash);
    });
  });
};
