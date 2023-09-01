const { Schema, model } = require("mongoose");

const animalSchema = new mongoose.Schema(
  {
    name: { 
      type: String,
      required: true,
    },
    race: {
      type: String,
      required: true,
    },
    years: {
      type: number,
      required: true
    },
    description: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: "non-binary"
    },
    profileImage: {
      type: String,
      default: "https://static.vecteezy.com/system/resources/thumbnails/009/734/564/small/default-avatar-profile-icon-of-social-media-user-vector.jpg"
    },
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  {
    timestamps: true,
  }
);

const Animal = model("Animal", animalSchema);
module.exports = Animal;
