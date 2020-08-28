const mongoose = require("mongoose");

const simulationSchema = {
    situation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Situation"
    }
};

mongoose.model("Simulation", new mongoose.Schema(simulationSchema, { strict: false }));
