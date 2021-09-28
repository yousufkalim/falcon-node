const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const STRINGS = require("../utils/texts");

const userSchema = new Schema({
  password: String,
  email: {
    type: String,
    trim: true,
  },
  firstName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
  },
  password: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  Blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Blog",
      required: false,
    },
  ],
  Projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: false,
    },
  ],
});

module.exports = mongoose.model(STRINGS.MODALS.USER, userSchema);
