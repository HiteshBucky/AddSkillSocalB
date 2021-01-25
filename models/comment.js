const mongoose = require('mongoose');
const {Schema, model} = require('mongoose');
const {ObjectId} = mongoose.Schema();

var commentSchema = new Schema({
	description : {
		type : String,
		trim : true,
		required : true
	},
	createdBy : {
		type : Schema.Types.ObjectId,
		ref : "User"
	},
	onPost : {
		type : Schema.Types.ObjectId,
		ref : "Post"
	}
}, {timestamps : true})

const Comment = model("Comment", commentSchema)

module.exports = Comment;
