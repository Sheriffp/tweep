import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getUserProfile = async (req, res) => {
	try {
		const { username } = req.params;

		const user = await User.findOne({ username }).select("-password");

		if (!user) return res.status(200).json({ error: "User not found" });

		res.status(200).json({ user });
	} catch (error) {
		console.error("Error getting user profile", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};

export const updateProfile = async (req, res) => {
	try {
		const userId = req.user._id; //from protect route
		const user = await User.findByIdAndUpdate({ _id: userId }, req.body, {
			new: true
		});

		if (!user) return res.status(200).json({ error: "User not found" });

		res.status(200).json({ user });
	} catch (error) {
		console.error("Error in update profile controller", error);
	}
};

export const getCurrentUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId);
		if (!user) return res.status(200).json({ error: "User not found" });

		res.status(200).json({ user });
	} catch (error) {
		console.error("Error in get current user controller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};

export const followUser = async (req, res) => {
	try {
		const userId = req.user._id;
		const { targetUserId } = req.params;

		if (userId === targetUserId)
			return res
				.status(200)
				.json({ error: "You cannot follow yourself" });

		const currentUser = await User.findById(userId);
		const targetUser = await User.findById(targetUserId);

		if (!currentUser || !targetUser)
			return res.status(200).json({ error: "User not found" });

		const isFollowing = currentUser.following.includes(targetUserId);

		if (isFollowing) {
			//unfollow
			await User.findByIdAndUpdate(currentUser._id, {
				$pull: { following: targetUserId }
			});
			await User.findByIdAndUpdate(targetUserId, {
				$pull: { followers: currentUser._id }
			});
		} else {
			//follow
			await User.findByIdAndUpdate(currentUser._id, {
				$push: { following: targetUserId }
			});
			await User.findByIdAndUpdate(targetUserId, {
				$push: { followers: currentUser._id }
			});
			//create a notification
			await Notification.create({
				from: currentUser._id,
				to: targetUserId,
				type: "follow"
			});
		}
		res.status(200).json({
			message: isFollowing
				? "User unfollowed succeasfully"
				: "User followed successfully"
		});
	} catch (error) {
		console.error("Error in follow user controller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};
