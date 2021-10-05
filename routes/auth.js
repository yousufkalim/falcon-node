// Init
const router = require("express").Router();
const { Register, Login, updateProfile } = require("../controllers/auth.js");
const {
  registerUserValidator,
  loginUserValidator,
  isValidated,
  updateProfileValidator,
} = require("../middleware/validators");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// Routes
// register user
router.post(
  "/register",
  upload.single("image"),
  registerUserValidator,
  isValidated,
  Register
);
// login user
router.post("/login", loginUserValidator, isValidated, Login);
// update profile
router.put(
  "/update/:id",
  upload.single("image"),
  auth(),
  updateProfileValidator,
  isValidated,
  updateProfile
);

// Export
module.exports = router;
