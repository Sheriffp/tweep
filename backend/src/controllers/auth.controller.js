import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../config/env.js";

const createToken = userId => {
	return jwt.sign({ userId }, ENV.JWT_SECRET);
};
export const login = async (req, res) => {
	try {
		const { email, password } = req.body;

		if (!email || !password) {
			return res.status(200).json({
				success: false,
				message: "All fields are required"
			});
		}

		if (!email.includes("@")) {
			return res.status(200).json({
				success: false,
				message: "Enter a valid email"
			});
		}

		const user = await User.findOne({ email });

		if (!user) {
			return res.status(200).json({
				success: false,
				message: "Invalid email or password"
			});
		}

		const isPasswordCorrect = await user.comparePassword(password);

		if (!isPasswordCorrect) {
			return res.status(200).json({
				success: false,
				message: "Invalid email or password"
			});
		}

		const token = createToken(user._id);

		res.status(200).json({
			success: true,
			token,
			user: {
				id: user._id,
				email: user.email,
				firstName: user.firstName,
				lastName: user.lastName,
				username: user.username,
				profilePicture: user.profilePicture,
				bannerImage: user.bannerImage,
				bio: user.bio,
				followers: user.followers,
				following: user.following,
				createdAt: user.createdAt
			},

			message: "Login successful"
		});
	} catch (error) {
		console.error("Error in login controller", error);
		res.status(200).json({
			success: false,
			message: "Internal Server Error"
		});
	}
};

export const signup = async (req, res) => {
	try {
		const { email, password, firstName, lastName, username } = req.body;

		if (!email || !password || !firstName || !lastName || !username) {
			return res.status(200).json({
				success: false,
				message: "All fields are required"
			});
		}
		if (!email.includes("@")) {
			return res.status(200).json({
				success: false,
				message: "Enter a valid email"
			});
		}

		if (username.length < 3) {
			return res.status(200).json({
				success: false,
				message: "Username must be at least 3 characters long"
			});
		}

		if (password.length < 6) {
			return res.status(200).json({
				success: false,
				message: "Password must be at least 6 characters long"
			});
		}

		const userEmailExist = await User.findOne({ email });

		if (userEmailExist) {
			return res.status(200).json({
				success: false,
				message: "User exist already, change email"
			});
		}

		const userEmailUsername = await User.findOne({ username });

		if (userEmailUsername) {
			return res.status(200).json({
				success: false,
				message: "User exist already, change username"
			});
		}

		const newUser = await User.create({ ...req.body });

		return res.status(200).json({
			success: true,
			message: "Signup successful, login to continue"
		});
	} catch (error) {
		console.error("Error in signup controller", error);
		res.status(200).json({
			success: false,
			message: "Internal Server Error"
		});
	}
};
