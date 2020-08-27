import _ from 'lodash';

const communes = require('@etalab/decoupage-administratif/data/communes.json');

const index = {};
communes.forEach(function(commune) {
    if (!commune.codesPostaux) {
        return;
    }

    commune.codesPostaux.forEach(function(codePostal) {
        if (!(codePostal in index)) {
            index[codePostal] = [];
        }

        index[codePostal].push(commune);
    });
});


const Commune = {
  /**
   * @param {string} postalCode
   */
  get: function(postalCode) {
    return index[postalCode] || [];
  },
  getMostPopulated: function(communes) {
    return _.maxBy(communes, 'population') || (communes && communes.length && communes[0]) || {};
  }
}

export default Commune
