var mongoose = require("mongoose"); 

const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");


// https://stackoverflow.com/questions/34967482/lookup-on-objectids-in-an-array

exports.updateUser = (req, res) => {

	User.findByIdAndUpdate(
	  { _id: req.params.userId },
	  { $set: req.body },
	  { new: true, useFindAndModify: false },
	  (err, user) => {
	    if (err) {
	      return res.status(400).json({
	        error: "You are not authorized to update this user",
	        "message" : "Unable to update user"
	      });
	    }
	    user.salt = undefined;
	    user.encry_password = undefined;
	    res.json(user);
	  }
	);
}


exports.getPost = (req, res) => {
	Post.findById({_id : req.params.postId}, (err, post) => {
		if(err) {
			res.status(400).json({
				error : "Post not found",
				message : "Post not found"
			})
		}
		res.json(post)
	})
}

exports.updatePost = (req, res) => {

	console.log("Updaed psot", req.body, " ", req.params.userId, " postId", req.params.postId)
	Post.findByIdAndUpdate(
	  { _id: req.params.postId },
	  { $set: req.body },
	  { new: true, useFindAndModify: false },
	  (err, newPost) => {
	    if (err) {
	      return res.status(400).json({
	        error: "You are not authorized to update this post",
	        "message" : "Unable to update post"
	      });
	    }
	    res.json(newPost);
	  }
	);
}

exports.createPost = (req, res) => {

	console.log('Hello createPost', req.params.userId )
	var userId = req.params.userId;
	req.body.createdBy = userId;

	const newPost = new Post(req.body);
	newPost.save((err, doc) => {
		if (err) {
	        return res.status(400).json({
	          error : "NOT able to save post in DB",
	          message : "NOT able to save post in DB"
	        });
	    }

	    User.findOneAndUpdate(
	        { _id: userId },
	        { $push: { posts : doc._id} },
	        { new: true },
	        (error, user) => {
	           	if (error) {
	            	return res.status(400).json({
	                	error : "Unable to save post to user",
	                	message : "Unable to save post to user"
	            	});
	        	}

	            res.json(user);
	        }
	    );
	})
}


exports.createComment = (req, res) => {
	var userId = req.params.userId;
	var postId = req.params.postId;

	req.body.createdBy = userId;
	req.body.onPost = postId;


	const newComment = new Comment(req.body);
	newComment.save((err, doc) => {
		if (err) {
	        return res.status(400).json({
	          error : "NOT able to save comment in DB",
	          message : "NOT able to save comment in DB"
	        });
	    }

	    Post.findOneAndUpdate(
	        { _id: postId },
	        { $push: { comments : doc._id} },
	        { new: true },
	        (error, newPost) => {
	           	if (error) {
	            	return res.status(400).json({
	                	error : "Unable to save comment to user",
	                	message : "Unable to save comment to user"
	            	});
	        	}

	            res.json(newPost);
	        }
	    );
	})
}


exports.createLike = (req, res) => {
	var postId = req.params.postId;
	var userId = req.params.userId;

	console.log('postId', postId,  "userId", userId)

	Post.findOneAndUpdate(
	    { _id: postId },
	    { $push: { likes : userId} },
	    { new: true },
	    (error, newpost) => {
	       	if (error) {
	        	return res.status(400).json({
	            	error : "Unable to Like",
	            	message : "Unable to Like"
	        	});
	    	}

	        res.json(newpost);
	    }
	);
}

exports.createFollow = (req, res) => {
	const fromId = req.params.fromId, toId = req.params.toId;
	console.log("createFollow fromId", fromId, "toId", toId);

	//Creating a follow request from currId
	User.findOneAndUpdate(
	    { _id: fromId },
	    { $push: { follows : toId} },
	    { new: true },
	    (error, follows) => {
	       	if (error) {
	        	return res.status(400).json({
	            	error : "Unable to Follow",
	            	message : "Unable to Follow"
	        	});
	    	}

	    	//Updating the followers of other user
	    	User.findOneAndUpdate(
	    	    { _id: toId },
	    	    { $push: { followers : fromId} },
	    	    { new: true },
	    	    (err, doc) => {
	    	       	if (error) {
	    	        	return res.status(400).json({
	    	            	error : "Unable to Follow",
	    	            	message : "Unable to Follow"
	    	        	});
	    	    	}

	    	        res.json(doc);
	    	    }
	    	);
	    }
	);
}


exports.createUnfollow = (req, res) => {
	const fromId = req.params.fromId, toId = req.params.toId;
	console.log("createUnfollow fromId", fromId, "toId", toId);

	//Creating a follow request from currId
	User.findOneAndUpdate(
	    { _id: fromId },
	    { $pull: { follows : toId} },
	    { new: true },
	    (error, follows) => {
	       	if (error) {
	        	return res.status(400).json({
	            	error : "Unable to Follow",
	            	message : "Unable to Follow"
	        	});
	    	}

	    	//Updating the followers of other user
	    	User.findOneAndUpdate(
	    	    { _id: toId },
	    	    { $pull: { followers : fromId} },
	    	    { new: true },
	    	    (err, doc) => {
	    	       	if (error) {
	    	        	return res.status(400).json({
	    	            	error : "Unable to Follow",
	    	            	message : "Unable to Follow"
	    	        	});
	    	    	}

	    	        res.json(doc);
	    	    }
	    	);
	    }
	);
}


exports.getAllUser = (req, res) => {
	User.find().exec((err, users) => {
		if (err) {
	        return res.status(400).json({
	          error : "NO user found in DB",
	          message : "NO user found in DB"
	        });
	    }

	    res.json(users);
	})
}

exports.getAllPost = (req, res) => {
	console.log("getAllPost", req.params.pageNumber)
	var page = req.params.pageNumber;
	var limit = 4;

	Post.aggregate(
	[
	   	{ $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "userData" }},
	   	{ $project : {"comments" : 1, "likes" : 1, "description" : 1, "createdBy": 1,  "createdAt" : 1, userData : {"username": 1, "email": 1} }},
	   	{ $sort:     {"createdAt": -1}},
	   	{ $skip: (page-1)*5 },
	   	{ $limit: limit }

	]).exec((err, posts) => {
		if (err) {
	        return res.status(400).json({
	          error : "NO post found in DB",
	          message : "NO user found in DB"
	        });
	    }

	    res.json(posts);
	})
}

exports.getAllPostUser = (req, res) => {
	console.log("getAllPostUser", req.params.userId)

	Post.aggregate(
	[	
		{ $match : { "createdBy" : mongoose.Types.ObjectId(req.params.userId) }},
		{ $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "userData" }},
		{ $project : {"comments" : 1, "likes" : 1, "description" : 1, "createdBy": 1,  "createdAt" : 1, userData : {"username": 1, "email": 1} }},
		{ $sort:     {"createdAt": -1}},

	]).exec((err, posts) => {
		if (err) {
	        return res.status(400).json({
	          error : "NO post found in DB",
	          message : "NO user found in DB"
	        });
	    }

	    res.json(posts);
	})
}

exports.getUser = (req, res) => {
	User.findById(req.params.userId).exec((err, user) => {
		if (err) {
	        return res.status(400).json({
	          error : "NO user found in DB",
	          message : "NO user found in DB"
	        });
	    }

	    res.json(user);
	})
}

exports.getAllComments = (req, res) => {

	Comment.aggregate(
	[	
		{ $match : { "onPost" : mongoose.Types.ObjectId(req.params.postId) }},
		{ $lookup: { from: "users", localField: "createdBy", foreignField: "_id", as: "userData" }},
		{ $project : {"createdBy" : 1, "onPost" : 1, "description" : 1, "createdAt" : 1, userData : {"username": 1, "email": 1} }},
		{ $sort:     {"createdAt": -1}},

	]).exec((err, comments) => {
		if (err) {
	        return res.status(400).json({
	          error : "NO post found in DB",
	          message : "NO user found in DB"
	        });
	    }

	    res.json(comments);
	})
}


exports.getAllFollowers = (req, res) => {

	User.aggregate([
		{ $match : { "_id" : mongoose.Types.ObjectId(req.params.userId) }},
		{ $lookup: { from: 'users', localField: "followers", foreignField: "_id", as: "list"} },
	   	{ $project : {"email" : 1, "followers" : 1, "follows" : 1, "username": 1,  "createdAt" : 1, list : {"email" : 1, "username" : 1, _id : 1} }},
	]).exec((err, doc) => {
		if(err) res.send(err)
		console.log()
		res.json(doc[0].list)
	})
}

exports.getAllFollowing = (req, res) => {
	console.log('getAllFollowing', req.params.userId)
	User.aggregate([
		{ $match : { "_id" : mongoose.Types.ObjectId(req.params.userId) }},
		{ $lookup : { from: 'users', localField: "follows", foreignField: "_id", as: "list" } },
		{ $project : {"email" : 1, "followers" : 1, "follows" : 1, "username": 1,  "createdAt" : 1, list : {"email" : 1, "username" : 1, _id : 1} }},
	]).exec((err, doc) => {
		if(err) res.send(err)
		console.log(doc)
		res.json(doc[0].list)
	})
}


exports.checkFollow = (req, res) => {
	const currId = req.params.userId, toId = req.params.toId;

	User.findById(currId).exec((err, user) => {
		if (err) {
	        return res.status(400).json({
	          error : "NO user found in DB",
	          message : "NO user found in DB"
	        });
	    }

	    const followList = user.follows;
	    for(id of followList) {
	    	if(id == toId){
	    		return res.json({ follow : true })
	    	}
	    }
	    	
	    res.json({ follow : false })
	})
}

