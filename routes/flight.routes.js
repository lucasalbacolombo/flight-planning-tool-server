const router = require('express').Router();
const UserModel = require('../models/User.model');
const AircraftModel = require('../models/Aircraft.model');
const FlightModel = require('../models/Flight.model');

const isAuth = require('../middlewares/isAuth');
const attachCurrentUser = require('../middlewares/attachCurrentUser');

router.post('/create-flight', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const loggedInUser = req.currentUser;

		const createFlight = await FlightModel.create({
			...req.body,
			user: loggedInUser._id,
		});

		await UserModel.findOneAndUpdate(
			{ _id: loggedInUser._id },
			{ $push: { flight: createFlight._id } }
		);

		return res.status(201).json(createFlight);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.get('/flights', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const loggedInUser = req.currentUser;

		const userFlights = await FlightModel.find({ user: loggedInUser._id });

		return res.status(200).json(userFlights);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.get('/:flightId', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const { flightId } = req.params;

		const foundFlight = await FlightModel.findOne({ _id: flightId }).populate(
			'aircraft'
		);

		return res.status(200).json(foundFlight);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.patch('/edit/:flightId', isAuth, attachCurrentUser, async (req, res) => {
	try {
		const { flightId } = req.params;

		const body = { ...req.body };

		delete body.aircraft;

		const updatedFlight = await FlightModel.findOneAndUpdate(
			{ _id: flightId },
			{ ...body },
			{ new: true, runValidators: true }
		);
		return res.status(200).json(updatedFlight);
	} catch (err) {
		console.log(err);
		return res.status(500).json(err);
	}
});

router.delete(
	'/delete/:flightId',
	isAuth,
	attachCurrentUser,
	async (req, res) => {
		try {
			const { flightId } = req.params;
			const loggedInUser = req.currentUser;

			const deleteFlight = await FlightModel.deleteOne({
				_id: req.params.flightId,
			});

			await AircraftModel.updateMany(
				{ flight: flightId },
				{ $pull: { flight: flightId } }
			);

			await UserModel.findOneAndUpdate(
				{ _id: loggedInUser._id },
				{ $pull: { flight: flightId } },
				{ runValidators: true }
			);

			return res.status(200).json(deleteFlight);
		} catch (err) {
			console.log(err);

			return res.status(500).json(err);
		}
	}
);

module.exports = router;
