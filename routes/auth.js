const router = require("express").Router();
const User = require("../model/User");
const { registrationValidation, loginValidation } = require("../validations");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  // Lets validate the user data
  const { error } = registrationValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking user email already exists or not
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) return res.status(400).send("Email already exists");

  //   Encrypting the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    const savedUser = await user.save();
    res.status(200).send({ user: savedUser._id });
  } catch (err) {
    res.status(400).send({ status: Failed, msg: err });
  }
});

router.post("/login", async (req, res) => {
  // Lets validate the user data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // checking user email exists or not
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid Email");

  // Checking user password
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("Invalid Password");

  //   create and assign token for the user
  const token = JWT.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
