const { Schema, model, default: mongoose } = require('mongoose');

const userSchema = new Schema({
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  passwordHash: { type: String, required: true },
  flight: [{ type: mongoose.Types.ObjectId, ref: 'Flight' }],
  aircraft: [{ type: mongoose.Types.ObjectId, ref: 'Aircraft' }],
  isActive: { type: Boolean, default: true },
});

const UserModel = model('User', userSchema);

module.exports = UserModel;
