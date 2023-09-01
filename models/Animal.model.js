const { Schema, model } = require("mongoose");

const animalSchema = new mongoose.Schema({
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
    },
    profileImage: {
      type: String,
      required: true
    },
    timestamps: true,
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Animal = model("Animal", userSchema);
module.exports = Animal;
