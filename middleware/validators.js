// Init
const { check, validationResult } = require("express-validator");

/*
====================
Validations
====================
*/

// user register Validation
exports.registerUserValidator = [
  check("firstName", "firstName name is required.").notEmpty(),
  check("lastName", "lastName name is required.").notEmpty(),
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage("Password min length must be 6 characters"),
  check("confirm_password", "Confirm Password is required")
    .notEmpty()
    .trim()
    .isLength({ min: 4 })
    .withMessage("Confirm Password min length must be 6 characters")
    .custom(async (confirmPassword, { req }) => {
      const password = req.body.password;

      if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password must be same");
      }
    }),
];

// user login Validation
exports.loginUserValidator = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("password", "Password is required.")
    .notEmpty()
    .trim()
    .isLength({ min: 6 })
    .withMessage("min length must be 6 characters"),
];

// update profile Validation
exports.updateProfileValidator = [
  check("email", "Email is required.").notEmpty().isEmail().trim(),
  check("firstName", "firstName is required.").notEmpty().trim(),
  check("lastName", "lastName is required.").notEmpty().trim(),
];

// create Blog  Validation
exports.createBlogValidator = [
  check("title", "title is required.").notEmpty().trim(),
  check("description", "description is required.").notEmpty().trim(),
];
// create Project  Validation
exports.createProjectValidator = [
  check("title", "title is required.").notEmpty().trim(),
  check("description", "description is required.").notEmpty().trim(),
];

/*
======================
Result
======================
*/
exports.isValidated = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let message = errors.array()[0].msg;
    res.status(400).send({ message: message });
  } else {
    next();
  }
};
