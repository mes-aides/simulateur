var Promise = require('bluebird');
var openfisca = Promise.promisifyAll(require('../openfisca'));
var request = Promise.promisify(openfisca.sendToOpenfisca('calculate', (s) => s));

var common = require('../openfisca/mapping/common');
var { base, build, extractResults } = require('../openfisca/bulk');
var droitsDescription = require('../../../app/js/constants/benefits');

function OpenFiscaAxe(situation) {
    this.situation = situation;
}

OpenFiscaAxe.prototype.toInternal = function() {
    return {};
};

var benefits = [];
for (var level in droitsDescription) {
    for (var provider in droitsDescription[level]) {
        for (var prestation in droitsDescription[level][provider].prestations) {
            benefits.push(Object.assign({
                id: prestation,
                provider: Object.assign({id: provider, level: level}, droitsDescription[level][provider])
            }, droitsDescription[level][provider].prestations[prestation]));
        }
    }
}

var benefitIds = ['irpp'].concat(benefits.map(b => b.id));
var variable = 'salaire_net';

function fetch(s) {
    var fs = Promise.promisifyAll(require('fs'));
    var os = require('os');
    var path = require('path');
    var cachePath = path.join(os.tmpdir(), 'situation_' + s.source._id + '_' + base);
    if (false && fs.existsSync(cachePath)) {
        return fs.readFileAsync(cachePath)
            .then(data => { s.response = JSON.parse(data); })
            .then(() => s);
    } else {
        return request(s.request)
            .then(payload => {
                s.response = payload;
                return fs.writeFileAsync(cachePath, JSON.stringify(payload, null, 2));
            })
            .then(() => s);
    }
}

OpenFiscaAxe.prototype.toExternal = function() {

    var s = {
        source: this.situation,
        request: build(this.situation, variable)
    };

    return fetch(s)
        .then(s => {
            var results = extractResults(s, benefitIds);
            var jsonResults = Object.keys(results).map(k => {
                return Object.assign({name: k},
                    results[k], {[variable]: parseInt(k)});
            });
            return {
                names: [variable].concat(benefitIds),
                data: jsonResults
            };
        });
};

module.exports = OpenFiscaAxe;
