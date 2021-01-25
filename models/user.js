var mongoose = require("mongoose");
const {Schema, model} = require('mongoose');
const crypto = require("crypto");
const uuidv1 = require("uuid/v1");

var userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
      unique: true
    },
    firstname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      required: true
    },
    encry_password: {
      type: String,
      required: true
    },
    posts : [{
      type : Schema.Types.ObjectId, 
      ref : "Post"
    }],
    follows : [{
      type : Schema.Types.ObjectId, 
      ref : "User"
    }],
    followers : [{
      type : Schema.Types.ObjectId, 
      ref : "User"
    }],
    salt: String,
    role: {
      type: Number,
      default: 0  //O for user, 1 For admin
    },
  },
  { timestamps: true }
);


userSchema
  .virtual("password")
  .set(function(password) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  .get(function() {
    return this._password;
  });

userSchema.methods = {
  autheticate: function(plainpassword) {
    return this.securePassword(plainpassword) === this.encry_password;
  },

  securePassword: function(plainpassword) {
    console.log(plainpassword)
    if (!plainpassword) return "";
    try {
      return crypto
        .createHmac("sha256", this.salt)
        .update(plainpassword)
        .digest("hex");
    } catch (err) {
      return "";
    }
  }
};

module.exports = mongoose.model("User", userSchema);














// var mongoose = require("mongoose");
// const {Schema, model} = require('mongoose');
// const crypto = require("crypto");
// const uuidv1 = require("uuid/v1");

// var userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       maxlength: 32,
//       trim: true,
//       unique: true
//     },
//     firstname: {
//       type: String,
//       maxlength: 32,
//       trim: true
//     },
//     lastname: {
//       type: String,
//       maxlength: 32,
//       trim: true
//     },
//     email: {
//       type: String,
//       trim: true,
//       required: true
//     },
//     encry_password: {
//       type: String,
//       required: true
//     },
//     posts : [{
//       type : Schema.Types.ObjectId, 
//       ref : "Post"
//     }],
//     follows : [{
//       name : {type : String},
//       userId : { type : Schema.Types.ObjectId, ref : "User" }
//     }],
//     followers : [{
//       name : {type : String},
//       userId : { type : Schema.Types.ObjectId, ref : "User" }
//     }],
//     salt: String,
//     role: {
//       type: Number,
//       default: 0  //O for user, 1 For admin
//     },
//   },
//   { timestamps: true }
// );


// userSchema
//   .virtual("password")
//   .set(function(password) {
//     this._password = password;
//     this.salt = uuidv1();
//     this.encry_password = this.securePassword(password);
//   })
//   .get(function() {
//     return this._password;
//   });

// userSchema.methods = {
//   autheticate: function(plainpassword) {
//     return this.securePassword(plainpassword) === this.encry_password;
//   },

//   securePassword: function(plainpassword) {
//     console.log(plainpassword)
//     if (!plainpassword) return "";
//     try {
//       return crypto
//         .createHmac("sha256", this.salt)
//         .update(plainpassword)
//         .digest("hex");
//     } catch (err) {
//       return "";
//     }
//   }
// };

// module.exports = mongoose.model("User", userSchema);






















