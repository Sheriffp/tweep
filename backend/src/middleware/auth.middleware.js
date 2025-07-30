import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
	try {
		const { token } = req.headers;
		if (!token) {
			return res
				.status(200)
				.json({ message: "Not authorized - login to continue" });
		}

		const decodedToken = jwt.verify(token, ENV.JWT_SECRET);

		const user = await User.findById(decodedToken.userId).select(
			"-password"
		);

		if (!user) {
			return res
				.status(200)
				.json({ message: "Not authorized - invalid token" });
		}

		req.user = user;
		next();
	} catch (error) {
		console.error("Error in protect route", error);
		res.status(200).json({ message: "Internal Server Error" });
	}
};
