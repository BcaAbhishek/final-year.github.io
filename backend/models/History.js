const mongoose = require("mongoose");

const historySchema = new mongoose.Schema({
userId: String,
data: Object,
createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("History", historySchema);