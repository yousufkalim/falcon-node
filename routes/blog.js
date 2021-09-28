// Init
const router = require("express").Router();
const {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogsByUser,
  deleteBlogByUser,
} = require("../controllers/blog.js");
const {
  createBlogValidator,
  isValidated,
} = require("../middleware/validators");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/multer");
// get single Blog
router.get("/:id", auth(), getSingleBlog);
// get All Blogs By User
router.get("/", auth(), getAllBlogsByUser);
// create Blog
router.post(
  "/create",
  auth(),
  upload,
  createBlogValidator,
  isValidated,
  createBlog
);
// update Blog
router.put(
  "/update/:id",
  auth(),
  upload,
  createBlogValidator,
  isValidated,
  updateBlog
);
// delete Blog By User
router.delete("/:id", auth(), deleteBlogByUser);
// Export
module.exports = router;
