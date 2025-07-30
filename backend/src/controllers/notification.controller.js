import User from "../models/User.js";
import Notification from "../models/Notification.js";

export const getNotifications = async (req, res) => {
	try {
		const userId = req.user._id;
		const notifications = await Notification.find({ to: userId })
			.sort({
				createdAt: -1
			})
			.populate("post", "username firstName lastName profilePicture")
			.populate("post", "content image")
			.populate("comment", "content");
		res.status(200).json({ notifications });
	} catch (error) {
		console.error("Error in get notifications controlller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};

export const deleteNotification = async (req, res) => {
	try {
		const userId = req.user._id;
		const { notificationId } = req.params;
		const notification = await findOneAndDelete({
			_id: notificationId,
			to: userId
		});
		if (!notification)
			return res.status(200).json({ error: "Notification not found" });

		res.status(200).json({ message: "Notification deleted successfully" });
	} catch (error) {
		console.error("Error in delete notification controlller", error);
		res.status(200).json({ error: "Internal Server Error" });
	}
};
