const router = require('express').Router();
const UserModel = require('../models/User.model');
const AircraftModel = require('../models/Aircraft.model');
const FlightModel = require('../models/Flight.model');

const isAuth = require('../middlewares/isAuth');
const attachCurrentUser = require('../middlewares/attachCurrentUser');

router.post('/create-aircraft', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const loggedInUser = req.currentUser;

		const createAircraft = await AircraftModel.create({
			...req.body,
			user: loggedInUser._id,
		});

		await UserModel.findOneAndUpdate(
			{ _id: loggedInUser._id },
			{ $push: { aircraft: createAircraft._id } }
		);

		return res.status(201).json(createAircraft);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.get('/aircrafts', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const loggedInUser = req.currentUser;

		const userAircrafts = await AircraftModel.find({ user: loggedInUser._id });

		return res.status(200).json(userAircrafts);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.get('/:aircraftId', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const { aircraftId } = req.params;

		const foundAircraft = await AircraftModel.findOne({
			_id: aircraftId,
		}).populate('flight');

		return res.status(200).json(foundAircraft);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.patch(
	'/edit/:aircraftId',
	isAuth,
	attachCurrentUser,
	async (req, res) => {
		try {
			const { aircraftId } = req.params;

			const body = { ...req.body };

			delete body.flight;

			const updatedAircraft = await AircraftModel.findOneAndUpdate(
				{ _id: aircraftId },
				{ ...body },
				{ new: true, runValidators: true }
			);
			return res.status(200).json(updatedAircraft);
		} catch (err) {
			console.log(err);
			return res.status(500).json(err);
		}
	}
);

router.delete(
	'/delete/:aircraftId',
	isAuth,
	attachCurrentUser,
	async (req, res) => {
		try {
			const { aircraftId } = req.params;
			const loggedInUser = req.currentUser;

			const deleteAircraft = await AircraftModel.deleteOne({
				_id: req.params.aircraftId,
			});

			await FlightModel.updateMany(
				{ aircraft: aircraftId },
				{ $pull: { aircraft: aircraftId } }
			);

			await UserModel.findOneAndUpdate(
				{ _id: loggedInUser._id },
				{ $pull: { aircraft: aircraftId } },
				{ runValidators: true }
			);

			return res.status(200).json(deleteAircraft);
		} catch (err) {
			console.log(err);

			return res.status(500).json(err);
		}
	}
);

module.exports = router;
