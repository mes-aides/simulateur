function Simulation(simulation) {
  this.simulation = simulation
}

Simulation.prototype.toInternal = function () {
  return [
    {
      label: "Votre simulation",
      formattedValue: "l’intégralité des informations saisies.",
    },
  ]
}

Simulation.prototype.toExternal = function () {
  return Promise.resolve(this.simulation)
}

export default Simulation
