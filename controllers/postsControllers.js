// const { v4: uuidv4 } = require("uuid");
const { validationResult } = require("express-validator");
// const mongoose = require("mongoose");
const HttpError = require("../models/httpError");

const Post = require("../models/post");
const User = require("../models/user");

// TODO : Once Users model is done complete the postsBy UserId one

// ! : THIS MIGHT CAUSE PROBLEM, PLEASE CONFIRM
// *~~~~~~~~~~GETTING ALL THE POSTS~~~~~~~~~~~~~~~~~

const getPosts = async (req, res, next) => {
  let posts;
  try {
    posts = await Post.find({});
  } catch (err) {
    const error = new HttpError("Fettching Posts Faild, Try Again Later", 500);
    return next(error);
  }

  res.json({ posts: posts.map((post) => post.toObject({ getters: true })) });
};

// *~~~~~~~~~~GETTING ALL THE POSTS BY USER ID~~~~~~~~~~~~~~~~~

const getPostsByUserId = async (req, res, next) => {
  const userId = req.params.uid;

  let user;

  try {
    user = await User.findById(userId).populate("posts");
  } catch (err) {
    const error = new HttpError(
      "Fetching Posts went wrong, please try again later",
      500
    );
    return next(error);
  }

  if (!user || user.posts.length === 0) {
    return next(
      new HttpError("Could not find posts for the provided user id.", 404)
    );
  }

  res.json({
    posts: user.posts.map((post) => {
      post.toObject({ getters: true });
    }),
  });
};

// *~~~~~~~~~~GETTING POST BY POST ID~~~~~~~~~~~~~~~~~

const getPostById = async (req, res, next) => {
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId).populate("creatorId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find the post",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError(
      "Could not find a post for the provided Id",
      404
    );
    return next(error);
  }

  res.json({ post: post.toObject({ getters: true }) });
};

// *~~~~~~~~~~~~~~~~CREATING POST~~~~~~~~~~~~

const createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("invalid inputs passed, please check your data", 422)
    );
  }

  const { image, location, price, contact, description, breed, creatorId } =
    req.body;

  const createdPost = new Post({
    image: image,
    location: location,
    price: price,
    contact: contact,
    description: description,
    breed: breed,
    creatorId: creatorId,
  });

  let user;
  try {
    user = await User.findById(creatorId);
  } catch (err) {
    const error = new HttpError(
      "Oh NO! Creating post failed, please try again",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError("Could not find user for provided id", 404);
    return next(error);
  }

  console.log(user);
  console.log(typeof user);

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await createdPost.save({ session: sess });
    await createdPost.save();
    console.log(createdPost);
    // user.posts.push(createdPost);
    // console.log("PUSHED!!!!!");
    // user.markModified("posts");
    // console.log("MODIFIED!!!!!");
    // await user.save({ session: sess });
    // await user.save();
    // console.log("SAVEDDD!!!!!");
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "RIP Creating post failed, please try again.",
      500
    );
    return next(error);
  }

  res.status(201).json({ post: createdPost });
};

// *~~~~~~~~~~~~~~~~UPDATE POST~~~~~~~~~~~~~~~~~

const updatePost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("invalid inputs passed, please check your data", 422)
    );
  }

  const { location, price, description, contact, breed } = req.body;
  const postId = req.params.pid;

  let post;
  try {
    post = await Post.findById(postId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update your post",
      500
    );
    return next(error);
  }

  if (post.creatorId.toString() !== req.userData.userId) {
    const error = new HttpError(
      "Trynna be sneaky aye! You are not allowed to edit this post. See ya!",
      401
    );
    return next(error);
  }
  // post.title = title;
  // post.description = description;
  // post.content = content;
  // post.tags = tags;
  // post.image= image;
  post.location = location;
  post.price = price;
  post.contact = contact;
  post.description = description;
  post.breed = breed;
  // post.creatorId= creatorId;

  try {
    await post.save();
  } catch (err) {
    const error = new HttpError(
      "something went wrong, could not update your post",
      500
    );
    return next(error);
  }

  res.status(200).json({ post: post.toObject({ getters: true }) });
};

// *~~~~~~~~~~~~~~DELETE POST~~~~~~~~~~~~~~~~

const deletePost = async (req, res, next) => {
  const postId = req.params.pid;

  let post;

  try {
    post = await Post.findById(postId).populate("creatorId");
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not delete the post",
      500
    );
    return next(error);
  }

  if (!post) {
    const error = new HttpError("Could not find a place for this Id", 404);
    return next(error);
  }

  if (post.creatorId.id !== req.userData.userId) {
    const error = new HttpError(
      "Trynna be sneaky aye! You are not allowed to delete this post. See ya!",
      403
    );
    return next(error);
  }

  try {
    // const sess = await mongoose.startSession();
    // sess.startTransaction();
    // await post.remove({ session: sess });
    await post.remove();
    // post.creatorId.posts.pull(post);
    // await post.creatorId.save({ session: sess });
    // await post.creatorId.save();
    // await sess.commitTransaction();
  } catch (err) {
    const error = new HttpError(
      "RIP Something went wrong, could not delete the post.",
      500
    );
    return next(error);
  }

  res.status(200).json({ message: "Post Deleted!" });
};

exports.getPosts = getPosts;
exports.getPostById = getPostById;
exports.getPostsByUserId = getPostsByUserId;
exports.createPost = createPost;
exports.updatePost = updatePost;
exports.deletePost = deletePost;
