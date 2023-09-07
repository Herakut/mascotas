const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
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
      type: String,
      // default: "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    animals: [{ type: Schema.Types.ObjectId, ref: 'Animal'}],
  },
  {
    timestamps: true
  }
);

const User = model("User", userSchema);
module.exports = User;