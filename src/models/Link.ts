import { Schema, model, Types } from 'mongoose'

const schema = new Schema({
	to: { type: String, required: true }, // original link
	from: { type: String, required: true, unique: true }, // short link
	code: { type: String, required: true, unique: true },
	date: { type: Date, default: Date.now },
	clicks: { type: Number, default: 0 },
	owner: { type: Types.ObjectId, ref: 'User' }
})

export default model('Link', schema)
