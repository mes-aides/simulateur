/*
 * Remove specific_situations
 */
var _ = require('lodash')

var VERSION = 48


module.exports = {
    function: function(situation) {
        situation.demandeur.temps_travail_semaine = undefined
        return situation
    },
    version: VERSION
}
