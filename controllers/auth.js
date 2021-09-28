//Login User
const STRINGS = require("../utils/texts");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
const MailService = require("../services/mail.service");
const ENV = process.env;
const populateQuery = [
  {
    path: "Blogs",
    populate: [
      {
        path: "Blog",
      },
    ],
  },
  {
    path: "Projects",
    populate: [
      {
        path: "Project",
      },
    ],
  },
];
// register user
exports.Register = async (req, res) => {
  try {
    const data = req.body;
    let user = await User.findOne({ email: data.email }); // check if user already exists
    if (user)
      return res.status(404).json({ message: STRINGS.ERRORS.userExists });

    const hash = await bcrypt.hash(data.password, +ENV.BCRYPT_SALT); // hashing password
    data.password = hash;
    user = await new User(data).save(); //user saved
    res.json({ message: STRINGS.TEXTS.userCreated });
  } catch (error) {
    console.log(error.message, "error.message");
    res.json({ message: error.message });
  }
};
// login user
exports.Login = async (req, res) => {
  try {
    const data = req.body;

    let user = await User.findOne({ email: data.email }); // Check if user exist

    if (!user)
      return res.status(404).json({ message: STRINGS.ERRORS.emailInvalid });
    const isCorrect = await bcrypt.compare(data.password, user.password); // Check if user password is correct
    if (!isCorrect)
      return res.status(404).json({ message: STRINGS.ERRORS.passwordInvalid });

    const token = await JWT.sign(
      { id: user._id, role: user.role },
      ENV.JWT_SECRET
    ); //token generation

    const result = {
      user,
      token,
    };
    res.json({ message: STRINGS.TEXTS.loginSuccess, result });
  } catch (error) {
    console.log("Error--->", error);
    res.status(500).json({ message: error.message });
  }
};

// forgot password

exports.forgotPassword = async (req, res) => {
  try {
    const data = req.body;

    let user = await User.findOne({ email: data.email }); // Check if user exist
    if (!user)
      return res.status(404).json({ message: STRINGS.ERRORS.userNotFound });

    var resetPasswordToken = Math.floor(1000 + Math.random() * 9000);
    const resetPasswordExpires = Date.now() + 900000;

    user = await User.findOneAndUpdate(
      {
        _id: user._id,
      },
      {
        $set: {
          resetPasswordToken: resetPasswordToken,
          resetPasswordExpires: resetPasswordExpires,
        },
      },
      {
        new: true,
      }
    );
    let emailService = new MailService();
    await emailService.sendForgotPasswordEmail(user, resetPasswordToken); //email send for verification

    res.json({ message: STRINGS.TEXTS.emailSent });
  } catch (error) {
    console.log("Error--->", error);
    res.status(500).json({ message: error.message });
  }
};

// reset password
exports.resetPassword = async (req, res) => {
  try {
    const { resetPasswordToken, password } = req.body;
    let user = await User.findOne({ resetPasswordToken: resetPasswordToken }); // Check if token exist
    if (!user)
      return res.status(404).send({ message: STRINGS.ERRORS.tokenInvalid });
    if (user.resetPasswordExpires < Date.now())
      return res.status(401).send({ message: STRINGS.ERRORS.tokenExpired }); //check reset token expiration is greator than date.now()

    const salt = bcrypt.genSaltSync(15);
    const hash = await bcrypt.hash(password, salt);
    user = await User.findOneAndUpdate(
      {
        resetPasswordToken: resetPasswordToken,
      },
      {
        $set: {
          password: hash,
        },
      }
    ).populate(populateQuery);
    res.json({ message: STRINGS.TEXTS.passwordUpdated, user });
  } catch (error) {
    console.log("Error--->", error);
    res.status(500).json({ message: error.message });
  }
};

// update profile
exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;
    let userId = req.params.id;
    let user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
      },
      {
        new: true,
      }
    ).populate(populateQuery);
    if (!user)
      return res.status(404).send({ message: STRINGS.ERRORS.userNotFound });
    res.json({ message: STRINGS.TEXTS.profileUpdated, user });
  } catch (error) {
    console.log("Error--->", error);
    res.status(500).json({ message: error.message });
  }
};

// update password
exports.updatePassword = async (req, res) => {
  try {
    const data = req.body;
    let userId = req.params.id;
    let oldPassword = data.old_password;
    let newPassword = data.new_password;
    let user = await User.findOne({ _id: req.params.id }); // Check if token exist
    if (!user)
      return res.status(404).send({ message: STRINGS.ERRORS.userNotFound });
    // Check if user password is correct
    const isCorrect = await bcrypt.compare(oldPassword, user.password);
    if (!isCorrect)
      return res
        .status(404)
        .send({ message: STRINGS.ERRORS.oldpasswordInvalid });
    const hash = await bcrypt.hash(newPassword, +ENV.BCRYPT_SALT); // hashing password

    user = await User.findByIdAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          password: hash,
        },
      },
      {
        new: true,
      }
    ).populate(populateQuery);

    res.json({ message: STRINGS.TEXTS.profileUpdated, user });
  } catch (error) {
    console.log("Error--->", error);
    res.status(500).json({ message: error.message });
  }
};
