const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const {ObjectId} = mongoose.Schema();

var postSchema = new Schema({
	description : {
		type : String,
		trim : true,
		required : true
	},
	createdBy : {
		type : Schema.Types.ObjectId,
		ref : "User"
	},
	comments : [{
      type : Schema.Types.ObjectId, 
      ref : "Comment"
    }],
    likes : [{
      type : Schema.Types.ObjectId, 
      ref : "User"
    }],
	
}, {timestamps : true})

const Post = model("Post", postSchema)

module.exports = Post;
