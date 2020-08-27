# OpenFisca API

From [Documentation de OpenFisca - api.gouv.fr](https://api.gouv.fr/documentation/openfisca)

```json
{
    "individus": {
        "Claude": {
            "salaire_de_base": {
                "2017": 20000
            }
        },
        "Dominique": {
            "salaire_de_base": {
                "2017": 30000
            }
        },
        "Camille": {}
    },
    "menages": {
        "menage_1": {
            "personne_de_reference": ["Claude"],
            "conjoint": ["Dominique"],
            "enfants": ["Camille"],
            "revenu_disponible": {
                "2017": null
            },
            "impots_directs": {
                "2017": null
            }
        }
    },
    "familles": {
        "famille_1": {
            "parents": ["Claude", "Dominique"],
            "enfants": ["Camille"]
        }
    },
    "foyers_fiscaux": {
        "foyer_fiscal_1": {
            "declarants": ["Claude", "Dominique"],
            "personnes_a_charge": ["Camille"]
        }
    }
}
```


## Debug from command line

~~~bash
curl -X POST "https://fr.openfisca.org/api/latest/calculate" -H  "accept: application/json" -H  "Content-Type: application/json" -d @doc/openfisca-body.json
~~~

## Link

-   [Using the /calculate endpoint — OpenFisca documentation](https://openfisca.org/doc/openfisca-web-api/input-output-data.html)
