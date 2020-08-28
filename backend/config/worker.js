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
    const { salaireOffset, situation } = job.attrs.data;
    console.log(`Agenda.simulation - start simulation for ${situation._id} for offset ${salaireOffset}`)
    const Simulation = mongoose.model("Simulation");

    Object.keys(situation.demandeur.salaire_net).forEach(
        month => (situation.demandeur.salaire_net[month] += salaireOffset)
    );

    openfisca.calculate(situation, (err, simulation) => {
        if (err) throw err;
        simulation.situation = situation;
        Simulation.create(simulation);
        console.log(`Agenda.simulation - finish simulation for ${situation._id} for offset ${salaireOffset}`)
    });
});

agenda.on("ready", function() {
    agenda.start();
});

module.exports = {
    agenda,
    TEST_TASK,
    SIMULATION_TASK
};
