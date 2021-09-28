// Init
const router = require("express").Router();
const {
  createProject,
  updateProject,
  getSingleProject,
  getAllProjectsByUser,
  deleteProjectByUser,
} = require("../controllers/project.js");
const {
  createProjectValidator,
  isValidated,
} = require("../middleware/validators");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");

// get single Project
router.get("/:id", auth(), getSingleProject);
// get All Projects By User
router.get("/", auth(), getAllProjectsByUser);
// create Project
router.post(
  "/create",
  auth(),
  upload,
  createProjectValidator,
  isValidated,
  createProject
);
// update Project
router.put(
  "/update/:id",
  auth(),
  upload,
  createProjectValidator,
  isValidated,
  updateProject
);

// delete Project By User
router.delete("/:id", auth(), deleteProjectByUser);
// Export
module.exports = router;
