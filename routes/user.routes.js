const router = require('express').Router();
const bcrypt = require('bcrypt');
const UserModel = require('../models/User.model');

const generateToken = require('../config/jwt.config');
const isAuth = require('../middlewares/isAuth');
const attachCurrentUser = require('../middlewares/attachCurrentUser');

const saltRounds = 10;

router.post('/signup', async (req, res) => {
	try {
		const { password } = req.body;

		if (
			!password ||
			!password.match(
				/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[$*&@#])[0-9a-zA-Z$*&@#]{8,}$/
			)
		) {
			return res.status(400).json({
				message:
					'Password is required and must have at least 8 characters, uppercase and lowercase letters, numbers and special characters.',
			});
		}

		const salt = await bcrypt.genSalt(saltRounds);
		const passwordHash = await bcrypt.hash(password, salt);

		const createUser = await UserModel.create({
			...req.body,
			passwordHash: passwordHash,
		});

		delete createUser._doc.passwordHash;

		return res.status(201).json(createUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

router.post('/login', async (req, res) => {
	try {
		const { email, password } = req.body;

		const user = await UserModel.findOne({ email: email });

		if (user.isActive === true) {
		}

		if (!user) {
			return res.status(400).json({ msg: 'Wrong password or email.' });
		}

		if (await bcrypt.compare(password, user.passwordHash)) {
			delete user._doc.passwordHash;
			const token = generateToken(user);

			return res.status(200).json({
				token: token,
				user: { ...user._doc },
			});
		} else {
			return res.status(400).json({ msg: 'Wrong password or email.' });
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

router.get('/profile', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const loggedInUser = req.currentUser;
		const user = await UserModel.findOne({ _id: loggedInUser._id }).populate(
			'flight',
			'aircraft'
		);

		return res.status(200).json(user);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.patch('/update-profile', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const loggedInUser = req.currentUser;

		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: loggedInUser._id },
			{ ...req.body },
			{ runValidators: true, new: true }
		);

		delete updatedUser._doc.passwordHash;

		return res.status(200).json(updatedUser);
	} catch (error) {
		console.log(error);
		return res.status(500).json(error);
	}
});

//SOFT DELETE

router.delete(
	'/disable-profile',
	isAuth,
	attachCurrentUser,
	async (req, res) => {
		try {
			const disabledUser = await UserModel.findOneAndUpdate(
				{ _id: req.currentUser._id },
				{ isActive: false, disabledOn: Date.now() },
				{ runValidators: true, new: true }
			);

			delete disabledUser._doc.passwordHash;

			return res.status(200).json(disabledUser);
		} catch (error) {
			console.log(error);
			return res.status(500).json(error);
		}
	}
);

module.exports = router;
