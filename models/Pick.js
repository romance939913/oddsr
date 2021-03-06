const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PickSchema = new Schema({
    betType: {
        type: String,
        required: true
    },
    team: {
        type: String,
        required: true
    },
    spread: {
        type: String,
        required: true
    },
    globalGameId: {
        type: Number,
        required: true,
    },
    Outcome: {
        type: String,
        required: true,
        default: "Pending"
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Pick = mongoose.model("picks", PickSchema);

module.exports = Pick;