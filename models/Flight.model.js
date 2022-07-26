const { Schema, model, Types, default: mongoose } = require('mongoose');

const flightSchema = new Schema({
	user: { type: Types.ObjectId, ref: 'User' },
	date: { type: String, required: true },
	eobt: { type: Number, required: true, minLength: 4, maxLength: 4 },
	departure: { type: String, required: true, minLength: 4, maxLength: 4 },
	arrival: { type: String, required: true, minLength: 4, maxLength: 4 },
	alternative: { type: String, required: true, minLength: 4, maxLength: 4 },
	distance: { type: Number, required: true },
	flightTime: { type: Number, required: true },
	aircraft: [{ type: mongoose.Types.ObjectId, ref: 'Aircraft' }],
});

const FlightModel = model('Flight', flightSchema);

module.exports = FlightModel;
