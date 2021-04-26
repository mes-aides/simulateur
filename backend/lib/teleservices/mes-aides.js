var openfisca = require('../openfisca')
var computeAides = require('../mes-aides').computeAides

function MesAides(situation) {
    this.situation = situation
}

MesAides.prototype.toInternal = function() {
    throw new Errro('Not implemented')
}

MesAides.prototype.toExternal = function() {
    const p = new Promise((resolve, reject) => {
        openfisca.calculate(this.situation, (err, result) => {
          const additions = {
            _id: this.situation._id,
            external_id: this.situation.external_id,
          }
          if (err) {
            return reject(Object.assign(err, additions))
          }

          resolve(Object.assign(computeAides(this.situation, result), additions))
        })
    })
    return p
}

module.exports = MesAides
