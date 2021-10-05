// Init
const router = require("express").Router();
const {
  createBlog,
  updateBlog,
  getSingleBlog,
  getAllBlogs,
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
router.get("/", getAllBlogs);
// create Blog
router.post(
  "/create",
  auth(),
  upload.single("image"),
  createBlogValidator,
  isValidated,
  createBlog
);
// update Blog
router.put(
  "/update/:id",
  auth(),
  upload.single("image"),
  createBlogValidator,
  isValidated,
  updateBlog
);
// delete Blog By User
router.delete("/:id", auth(), deleteBlogByUser);
// Export
module.exports = router;
