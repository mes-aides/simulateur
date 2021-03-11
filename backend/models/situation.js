var mongoose = require('mongoose');
var _ = require('lodash');
var specificSituations = require('../../src/constants/specificSituations').specificSituations;
var ressources = require('../../app/js/constants/ressources');
var benefits = require('../../app/js/constants/benefits/back');
var mesAides = require('../lib/mes-aides');
var openfisca = require('../lib/openfisca');
var utils = require('../lib/utils');
var computeAides = mesAides.computeAides.bind(benefits);

var familleDef = {
    parisien: Boolean,
    proprietaire_proche_famille: Boolean,
    rsa_isolement_recent: Boolean,
};

var foyerFiscalDef = {
    rfr: Object,
    taxe_fonciere_sur_avis: Object,
};

var ressourcesDefs = _.concat(
    ressources.ressourceTypes,
    ressources.categoriesRnc,
    ressources.patrimoineTypes)
    .reduce(function(result, ressource) {
        result[ressource.id] = Object;
        return result;
    }, {});

var statutMaritalValues = [
    'marie',
    'pacse',
    'celibataire',
];

var specificSituationFields = specificSituations.reduce((fields, situation) => {
    fields[situation.id] = Boolean
    return fields
}, {})

var individuDef = Object.assign({
    _id: false,
    id: String,
    aah_restriction_substantielle_durable_acces_emploi: Boolean,
    agepi_temps_travail_semaine: Number,
    ass_precondition_remplie: Boolean,
    boursier: Boolean,
    date_arret_de_travail: Date,
    date_debut_chomage: Date,
    date_naissance: Date,
    duree_possession_titre_sejour: Number,
    echelon_bourse: Number,
    enfant_a_charge: Object,
    enfant_place: Boolean,
    _firstName: String,
    garde_alternee: Boolean,
    gir: { type: String, default: 'non_defini' },
    habite_chez_parents: Boolean,
    _hasRessources: Boolean,
    nationalite: { type: String },
    _role: { type: String, enum: ['demandeur', 'conjoint', 'enfant'] },
    scolarite: { type: String, enum: ['inconnue', 'college', 'lycee'] },
    statut_marital: { type: String, enum: statutMaritalValues },
    taux_incapacite: Number,
    tns_auto_entrepreneur_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
    tns_autres_revenus_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
    tns_micro_entreprise_type_activite: { type: String, enum: ['achat_revente', 'bic', 'bnc'] },
}, ressourcesDefs, specificSituationFields);

var statutOccupationLogementValues = [
    'primo_accedant',
    'proprietaire',
    'locataire_vide',
    'locataire_meuble',
    'loge_gratuitement',
    'locataire_foyer',
    'sans_domicile',
];

var menageDef = {
    charges_locatives: Number,
    _codePostal: String,
    coloc: Boolean,
    depcom: String,
    logement_chambre: Boolean,
    loyer: Number,
    _nomCommune: String,
    participation_frais: Boolean,
    statut_occupation_logement: { type: String, enum: statutOccupationLogementValues },
    aide_logement_date_pret_conventionne: String,
};

var situation = {
    createdAt: { type: Date, default: Date.now },
    dateDeValeur: Date,
    external_id: String,
    famille: familleDef,
    foyer_fiscal: foyerFiscalDef,
    demandeur: individuDef,
    conjoint: { type: individuDef, default: null },
    enfants: [individuDef],
    menage: menageDef,
    modifiedFrom: String,
    status: { type: String, default: 'new', enum: ['new', 'test', 'investigation'] },
    token: String,
    version: Number,
};

var SituationSchema = new mongoose.Schema(situation, { minimize: false });

SituationSchema.statics.cookiePrefix = 'situation_';
SituationSchema.virtual('cookieName').get(function() {
    return `${SituationSchema.statics.cookiePrefix}${this._id}`;
});
SituationSchema.virtual('returnPath').get(function() {
    return '/foyer/resultat?situationId=' + this._id;
});

SituationSchema.methods.isAccessible = function(keychain) {
    return ['demo', 'investigation', 'test'].includes(this.status) || (keychain && keychain[this.cookieName] === this.token);
};

SituationSchema.methods.getIndividus = function() {
    return _.filter([].concat(this.demandeur, this.conjoint, ...(this.enfants || [])))
}

SituationSchema.methods.compute = function() {
    var that = this;
    return new Promise(function(resolve, reject) {
        openfisca.calculate(that, function(err, openfiscaResponse) {
            if (err) {
                return reject(err);
            }

            var aides = computeAides(that, openfiscaResponse, false);
            resolve(aides);
        });
    });
};

SituationSchema.pre('save', function(next) {
    if (!this.isNew) { return next(); }
    var situation = this;
    utils.generateToken()
        .then(function(token) {
            situation.token = token;
        })
        .then(next)
        .catch(next);
});

mongoose.model('Situation', SituationSchema);
mongoose.model('LegacySituation', new mongoose.Schema({}, { strict: false }));
