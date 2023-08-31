const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    animal: { type: Schema.Types.ObjectId, ref: 'Animal' },
    text: String,
    timestamps: true
});

const Comment = model("Comment", commentSchema);
module.exports = Comment;
  