import {find} from 'lodash'
import Commune from '../../lib/Commune'

const communeModule = {
  namespaced: true,
  state: {
    queries: {}
  },
  getters: {
    getMostPopulated(state) {
      return (codePostal, code) => state.queries[codePostal] && state.queries[codePostal] && find(state.queries[codePostal].results, { code }) || Commune.getMostPopulated(state.queries[codePostal].results)
    }
  },
  mutations: {
    create: function(state, codePostal) {
      state.queries = {
        [codePostal]: {
          fetching: true,
          results: []
        },
        ...state.queries
      }
    },
    addResults: function(state, {codePostal, results}) {
      let q = {
        ...state.queries[codePostal],
        fetching: false,
        results: results,
      }
      state.queries[codePostal] = q
    }
  },
  actions: {
    fetch: function({commit, state}, codePostal) {
      if (!state.queries[codePostal]) {
        commit('create', codePostal)
        return Commune.get(codePostal)
        .then(results => {
          commit('addResults', {codePostal, results})
          return state.queries[codePostal]
        })
      } else {
        return Promise.resolve(state.queries[codePostal])
      }
    },
  },
}

export default communeModule
