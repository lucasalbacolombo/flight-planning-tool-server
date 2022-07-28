const mongoose = require('mongoose');

async function connect() {
	try {
		const dbConnection = await mongoose.connect(process.env.MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});

		console.log('Connect to DB:', dbConnection.connections[0].name);
	} catch (err) {
		console.log('Connection error', err);
	}
}

module.exports = connect;
