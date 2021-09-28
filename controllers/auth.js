//Login User
const STRINGS = require("../utils/texts");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const User = require("../models/user");
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
    let { firstName, lastName, email, password } = req.body; //req body
    let user = await User.findOne({ email: email }); // check if user already exists
    if (user)
      return res.status(404).json({ message: STRINGS.ERRORS.userExists });

    let uploadedPicture;
    if (req.file) {
      uploadedPicture = req.file.filename;
    } else {
      return res.status(400).json({ message: STRINGS.ERRORS.imageRequired });
    }

    const hash = await bcrypt.hash(password, +ENV.BCRYPT_SALT); // hashing password
    user = await new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hash,
      image: uploadedPicture,
    });
    await user.save(); //create new User

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

// update profile
exports.updateProfile = async (req, res) => {
  try {
    const data = req.body;
    let userId = req.params.id;
    let uploadedPicture = data.image;
    if (req.file && req.file) {
      uploadedPicture = req.file.filename;
    }
    let user = await User.findOneAndUpdate(
      {
        _id: userId,
      },
      {
        $set: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          image: uploadedPicture,
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
