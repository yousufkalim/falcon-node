const STRINGS = require("../utils/texts");
const Blog = require("../models/blog");
const User = require("../models/user");
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

//get single Blog

exports.getSingleBlog = async (req, res) => {
  try {
    let BlogId = req.params.id;
    let blog = await Blog.findOne({ _id: BlogId }).populate(populateQuery); // Check if Blog exist
    if (!blog)
      return res.status(404).send({ message: STRINGS.ERRORS.BlogNotFound });

    return res.json({ message: STRINGS.TEXTS.BlogFetched, Blog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all Blogs by user

exports.getAllBlogsByUser = async (req, res) => {
  try {
    let userId = req.user.id;
    let user = await User.findById({ _id: userId }).populate(populateQuery); // Check if user exist
    if (!user)
      return res.status(404).send({ message: STRINGS.ERRORS.userNotFound });
    return res.json({ message: STRINGS.TEXTS.BlogFetched, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//create Blog
exports.createBlog = async (req, res) => {
  try {
    let userId = req.user.id;
    let { title, description } = req.body; //req body

    let uploadedPicture;
    if (req.files && req.files.image) {
      if (
        req.files.image[0].mimetype == "image/jpeg" ||
        req.files.image[0].mimetype == "image/jpg" ||
        req.files.image[0].mimetype == "image/png"
      ) {
        uploadedPicture = req.files.image[0].filename;
      } else {
        return res
          .status(401)
          .json({ message: STRINGS.ERRORS.allowedImagesType });
      }
    } else {
      return res.status(400).json({ message: STRINGS.ERRORS.imageRequired });
    }
    let newBlog = await new Blog({
      title: title,
      description: description,
      image: uploadedPicture,
    });
    await newBlog.save(); //create new Blog
    await User.findOneAndUpdate(
      //update user
      {
        _id: userId,
      },
      {
        $push: {
          Blogs: newBlog._id,
        },
      },
      {
        new: true,
      }
    ).populate(populateQuery);
    res.json({ message: STRINGS.TEXTS.BlogCreated, newBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
//update Blog

exports.updateBlog = async (req, res) => {
  try {
    let BlogId = req.params.id;
    const { title, description } = req.body;

    let blog = await Blog.findOne({ _id: BlogId }); // Check if Blog exist
    if (!blog)
      return res.status(404).send({ message: STRINGS.ERRORS.BlogNotFound });
    let uploadedPicture;
    if (req.files && req.files.image) {
      if (
        req.files.image[0].mimetype == "image/jpeg" ||
        req.files.image[0].mimetype == "image/jpg" ||
        req.files.image[0].mimetype == "image/png"
      ) {
        uploadedPicture = req.files.image[0].filename;
      } else {
        return res
          .status(401)
          .json({ message: STRINGS.ERRORS.allowedImagesType });
      }
    } else {
      return res.status(400).json({ message: STRINGS.ERRORS.imageRequired });
    }
    let newBlog = await Blog.findOneAndUpdate(
      //update Blog
      {
        _id: BlogId,
      },
      {
        $set: {
          title: title,
          description: description,
          image: uploadedPicture,
        },
      },
      {
        new: true,
      }
    ).populate(populateQuery);
    res.json({ message: STRINGS.TEXTS.BlogUpdated, newBlog });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete single Blog

exports.deleteBlogByUser = async (req, res) => {
  try {
    let BlogId = req.params.id;
    let userId = req.user.id;

    let blog = await Blog.findOne({ _id: BlogId }); // Check if Blog exist
    if (!blog)
      return res.status(404).send({ message: STRINGS.ERRORS.BlogNotFound });
    await User.findOneAndUpdate(
      //remove Blog from user
      {
        _id: userId,
      },
      {
        $pull: {
          Blogs: BlogId,
        },
      },
      {
        new: true,
      }
    );
    await Blog.findByIdAndRemove({ _id: BlogId }); //remove Blog
    return res.json({ message: STRINGS.TEXTS.BlogDeleted });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
