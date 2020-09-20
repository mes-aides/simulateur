const config = require("./index");
const Agenda = require("agenda");
const openfisca = require("../lib/openfisca");
const mongoose = require("mongoose");

const agenda = new Agenda({ db: { address: config.mongo.uri } });

const TEST_TASK = "test";
const SIMULATION_TASK = "simulation";

agenda.define(TEST_TASK, async job => {
    console.log("*** TEST_TASK ***");
});

agenda.define(SIMULATION_TASK, async job => {
    const { salaireOffset, situationId } = job.attrs.data;
    console.log(`Agenda.simulation - start simulation for ${situationId} for offset ${salaireOffset}`)
    const Simulation = mongoose.model("Simulation");
    const Situation = mongoose.model("Situation");

    const situation = await Situation.findById(situationId);

    Object.keys(situation.demandeur.salaire_net).forEach(
        month => (situation.demandeur.salaire_net[month] += salaireOffset)
    );

    const simulation = await situation.compute();
    simulation._id = undefined;
    simulation.situation = situation;
    simulation.parameters = {
        salaireOffset
    }

    await Simulation.create(simulation);
});

agenda.on("ready", function() {
    agenda.start();
});

module.exports = {
    agenda,
    TEST_TASK,
    SIMULATION_TASK
};
