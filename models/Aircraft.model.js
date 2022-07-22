const { Schema, model, default: mongoose } = require('mongoose');

const aircraftSchema = new Schema({
	user: { type: mongoose.Types.ObjectId, ref: 'User' },
	registration: { type: String, required: true },
	make: { type: String, required: true },
	model: { type: String, required: true },
	icaoCode: { type: String, required: true },
	fuelPerHour: { type: Number, required: true },
	fuelCapacity: { type: Number, required: true },
	flight: [{ type: mongoose.Types.ObjectId, ref: 'Flight' }],
});

const AircraftModel = model('Aircraft', aircraftSchema);

module.exports = AircraftModel;
