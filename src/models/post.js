const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PostSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, {
  timestamps: true
});

PostSchema.static('getPostsPagination', async function (currentPage, perPage) {
  const count = await this.find().countDocuments();
  const posts = await this.find().skip((currentPage - 1) * perPage).limit(perPage).sort({
    createdAt: -1
  });
  return {
    posts: posts,
    totalItems: count
  };
});

module.exports = mongoose.model("Post", PostSchema);