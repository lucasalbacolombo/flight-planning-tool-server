require('dotenv').config();
const express = require('express');
const cors = require('cors');
require('./config/db.config')();

const app = express();
app.use(express.json());
app.use(cors({ origin: process.env.REACT_APP_URL }));

const userRouter = require('./routes/user.routes');
app.use('/user', userRouter);

const flightRouter = require('./routes/flight.routes');
app.use('/flight', flightRouter);

const aircraftRouter = require('./routes/aircraft.routes');
app.use('/aircraft', aircraftRouter);

app.listen(Number(process.env.PORT), () => {
	console.log('Server up at port: ', process.env.PORT);
});
