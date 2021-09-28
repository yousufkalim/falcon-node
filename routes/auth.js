// Init
const router = require("express").Router();
const {
  Register,
  Login,
  updatePassword,
  updateProfile,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth.js");
const {
  registerUserValidator,
  loginUserValidator,
  isValidated,
  forgotPasswordValidator,
  resetPasswordValidator,
  updateProfileValidator,
  updatePasswordValidator,
} = require("../middleware/validators");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// Routes
// register user
router.post("/register", upload, registerUserValidator, isValidated, Register);
// login user
router.post("/login", loginUserValidator, isValidated, Login);

// forgot password
router.post("/forgot", forgotPasswordValidator, isValidated, forgotPassword);

//set new password
router.post(
  "/setPasssword",
  resetPasswordValidator,
  isValidated,
  resetPassword
);
// update profile
router.put(
  "/update/:id",
  upload,

  auth(),
  updateProfileValidator,
  isValidated,
  updateProfile
);
// update profile password
router.put(
  "/updatePassword/:id",
  auth(),
  updatePasswordValidator,
  isValidated,
  updatePassword
);

// Export
module.exports = router;
