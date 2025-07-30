import Post from "../models/Post.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import Comment from "../models/Comment.js";

export const getComments = async (req, res) => {
	try {
		const { postId } = req.params;
		const comments = await Comment.find({ post: postId })
			.sort({
				createdAt: -1
			})
			.populate("user", "username firstName lastName profilePicture");

		res.status(200).json({ comments });
	} catch (error) {
		console.error("Error in get comments controlller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};

export const createComment = async (req, res) => {
	try {
		const userId = req.user._id; //from protect route middleware
		const { postId } = req.params;
		const { content } = req.body;

		if (!content || content.trim() === "") {
			return res
				.status(200)
				.json({ error: "Comment box cannot be empty" });
		}
		const post = await Post.findById(postId);

		if (!post) res.status(200).json({ error: "Post not found" });

		const comment = await Comment.create({
			user: user._id,
			post: postId,
			content
		});

		await Post.findByIdAndUpdate(postId, {
			$push: { comments: comment._id }
		});

		if (post.user.toString() !== userId.toString()) {
			await Notification.create({
				from: user._id,
				to: post.user,
				type: "comment",
				post: postId,
				comment: comment._id
			});
		}

		res.status(201).json({ comments });
	} catch (error) {
		console.error("Error in create comment controlller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};

export const deleteComment = async (req, res) => {
	try {
		const userId = req.user._id;
		const { commentId } = req.params;
		const comment = await Comment.findById(commentId);

		if (!comment) {
			return res.status(200).json({ error: "Comment not found" });
		}
		if (comment.user.toString() !== userId.toString()) {
			return res
				.status(200)
				.json({ error: "You can only delete your own comments" });
		}

		await Post.findByIdAndUpdate(comment.post, {
			$pull: { comments: commentId }
		});
		await Comment.findByIdAndDelete(commentId);
		res.status(200).json({ message: "Comment deleted successfully" });
	} catch (error) {
		console.error("Error in delete comment controlller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};
