var express = require('express');
var router = express.Router();

const User = require("../models/user");

const { createPost, createComment, createLike, createFollow, getAllPost, 
	getAllPostUser, getAllUser, getUser, getAllComments, getAllFollowers, getAllFollowing, 
	checkFollow, createUnfollow } = require("../controllers/users");


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});


//Post Method
router.post('/createpost/:userId', createPost)
router.post('/creatcomment/:userId/:postId', createComment)
router.post('/creatLike/:userId/:postId', createLike)
router.post('/createfollow/:fromId/:toId', createFollow)
router.post('/createUnfollow/:fromId/:toId', createUnfollow)

//Get Method
router.get('/post/page/:pageNumber', getAllPost);
router.get('/posts/:userId', getAllPostUser)
router.get('/users', getAllUser);
router.get('/users/:userId', getUser);
router.get('/users/followers/:userId', getAllFollowers);
router.get('/users/following/:userId', getAllFollowing);
router.get('/comments/:postId', getAllComments);
router.get('/checkfollow/:userId/:toId', checkFollow)

module.exports = router;
