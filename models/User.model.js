const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  profileImg: {
    type: String
  },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  animals: [{ type: Schema.Types.ObjectId, ref: 'Animal'}],
  timestamps: true
});

const User = model("User", userSchema);
module.exports = User;