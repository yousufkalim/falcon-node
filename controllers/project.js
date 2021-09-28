const STRINGS = require("../utils/texts");
const Project = require("../models/project");
const User = require("../models/user");
const populateQuery = [
  {
    path: "Projects",
    populate: [
      {
        path: "Project",
      },
    ],
  },
  {
    path: "Blogs",
    populate: [
      {
        path: "Blog",
      },
    ],
  },
];

//get single Project

exports.getSingleProject = async (req, res) => {
  try {
    let ProjectId = req.params.id;
    let project = await Project.findOne({ _id: ProjectId }).populate(
      populateQuery
    ); // Check if Project exist
    if (!project)
      return res.status(404).send({ message: STRINGS.ERRORS.ProjectNotFound });

    return res.json({ message: STRINGS.TEXTS.ProjectFetched, Project });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//get all Projects by user

exports.getAllProjectsByUser = async (req, res) => {
  try {
    let userId = req.user.id;
    let user = await User.findById({ _id: userId }).populate(populateQuery); // Check if user exist
    if (!user)
      return res.status(404).send({ message: STRINGS.ERRORS.userNotFound });
    return res.json({ message: STRINGS.TEXTS.ProjectFetched, user });
  } catch (error) {
    console.log("Error------>", error);

    res.status(500).json({ message: error.message });
  }
};

//create createProject

exports.createProject = async (req, res) => {
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
    let newProject = await new Project({
      title: title,
      description: description,
      image: uploadedPicture,
    });
    await newProject.save(); //create new Project
    await User.findOneAndUpdate(
      //update user
      {
        _id: userId,
      },
      {
        $push: {
          Projects: newProject._id,
        },
      },
      {
        new: true,
      }
    ).populate(populateQuery);
    res.json({ message: STRINGS.TEXTS.ProjectCreated, newProject });
  } catch (error) {
    console.log("Error------>", error);

    res.status(500).json({ message: error.message });
  }
};
//update Project

exports.updateProject = async (req, res) => {
  try {
    let ProjectId = req.params.id;
    const { title, description } = req.body;

    let project = await Project.findOne({ _id: ProjectId }); // Check if Project exist
    if (!project)
      return res.status(404).send({ message: STRINGS.ERRORS.ProjectNotFound });
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
    let newProject = await Project.findOneAndUpdate(
      //update Project
      {
        _id: ProjectId,
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
    res.json({ message: STRINGS.TEXTS.ProjectUpdated, newProject });
  } catch (error) {
    console.log("Error------>", error);

    res.status(500).json({ message: error.message });
  }
};

//delete single Project

exports.deleteProjectByUser = async (req, res) => {
  try {
    let ProjectId = req.params.id;
    let userId = req.user.id;

    let project = await Project.findOne({ _id: ProjectId }); // Check if Project exist
    if (!project)
      return res.status(404).send({ message: STRINGS.ERRORS.ProjectNotFound });
    await User.findOneAndUpdate(
      //remove Project from user
      {
        _id: userId,
      },
      {
        $pull: {
          Projects: ProjectId,
        },
      },
      {
        new: true,
      }
    );
    await Project.findByIdAndRemove({ _id: ProjectId }); //remove Project
    return res.json({ message: STRINGS.TEXTS.ProjectDeleted });
  } catch (error) {
    console.log("Error------>", error);
    res.status(500).json({ message: error.message });
  }
};
