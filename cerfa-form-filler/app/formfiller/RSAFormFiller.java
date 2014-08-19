package formfiller;

import java.util.EnumMap;

import models.Individu;
import models.Individu.Civilite;
import models.Individu.IndividuRole;
import models.Individu.Nationalite;
import models.Individu.StatutMarital;
import models.Logement.LogementType;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.StringUtils;
import org.joda.time.LocalDate;

public class RSAFormFiller extends FormFiller {

    private static final Object[][] checkboxes = {
        {"demandeur.homme", 0, 102, 703},
        {"demandeur.femme", 0,  30, 703},
        {"conjoint.homme",  0, 378, 703},
        {"conjoint.femme",  0, 306, 703},

        {"demandeur.francais", 0, 30, 578},
        {"demandeur.ue",       0, 91, 578},
        {"demandeur.non_ue",   0, 178, 578},
        {"conjoint.francais",  0, 306, 578},
        {"conjoint.ue",        0, 368, 578},
        {"conjoint.non_ue",    0, 457, 578},

        {"demandeur.inscrit_caf.oui", 0,  30, 475},
        {"demandeur.inscrit_caf.non", 0, 102, 475},
        {"conjoint.inscrit_caf.oui",  0, 306, 475},
        {"conjoint.inscrit_caf.non",  0, 378, 475},

        {"logement.locataire",       0,  30, 175},
        {"logement.payant",          0,  30, 161},
        {"logement.gratuit",         0,  30, 133},
        {"logement.proprio_pret",    0,  30, 147},
        {"logement.proprio_no_pret", 0, 203, 147},

        {"seul",      1, 31, 671},
        {"en_couple", 1, 31, 746},

        {"mariage",           1, 45, 731},
        {"pacs",              1, 45, 716},
        {"relation_libre",    1, 45, 701},
        {"separe",            1, 45, 656},
        {"pacs_rompu",        1, 45, 641},
        {"divorce",           1, 45, 626},
        {"veuf",              1, 45, 611},
        {"concubinage_rompu", 1, 45, 596},
        {"celibataire",       1, 45, 581},

        {"enceinte.oui", 1, 155, 551},
        {"enceinte.non", 1, 193, 551},

        {"pension_alimentaire.separe",          1, 31, 338},
        {"pension_alimentaire.has_child_alone", 1, 31, 310},
    };

    private static final Object[][] textFields = {
        {"demandeur.nom",             0, 155, 687},
        {"demandeur.nom_usage",       0, 133, 670},
        {"demandeur.prenom",          0, 170, 648},
        {"demandeur.pays_naissance",  0, 115, 620, 9},
        {"demandeur.ville_naissance", 0,  83, 605, 7},
        {"demandeur.num_allocataire", 0, 100, 460},

        {"conjoint.nom",             0, 430, 687},
        {"conjoint.nom_usage",       0, 408, 670},
        {"conjoint.prenom",          0, 442, 648},
        {"conjoint.pays_naissance",  0, 390, 620, 9},
        {"conjoint.ville_naissance", 0, 358, 605, 7},
        {"conjoint.num_allocataire", 0, 375, 460},

        {"adresse.numero",      0, 45, 378},
        {"adresse.rue",         0, 135, 378},
        {"adresse.ville",       0, 253, 350},
        {"adresse.mail.gauche", 0, 92, 321, 10},
        {"adresse.mail.droite", 0, 267, 321, 10},

        {"adresse.conjoint.numero", 0, 45, 235},
        {"adresse.conjoint.rue",    0, 135, 235},
        {"adresse.conjoint.ville",  0, 253, 207},
        {"adresse.conjoint.pays",   0, 480, 207},

        {"enfant.1.nom",            1, 117, 515, 7},
        {"enfant.1.lien_parente",   1, 117, 496, 7},
        {"enfant.1.date_naissance", 1, 117, 484, 7},
        {"enfant.1.lieu_naissance", 1, 117, 472, 7},
        {"enfant.1.nationalite",    1, 117, 453, 7},
        {"enfant.1.nir",            1, 117, 430, 7},
        {"enfant.1.date_arrivee",   1, 117, 406, 7},
        {"enfant.1.situation",      1, 117, 387, 6},

        {"enfant.2.nom",            1, 230, 515, 7},
        {"enfant.2.lien_parente",   1, 230, 496, 7},
        {"enfant.2.date_naissance", 1, 230, 484, 7},
        {"enfant.2.lieu_naissance", 1, 230, 472, 7},
        {"enfant.2.nationalite",    1, 230, 453, 7},
        {"enfant.2.nir",            1, 230, 430, 7},
        {"enfant.2.date_arrivee",   1, 230, 406, 7},
        {"enfant.2.situation",      1, 230, 387, 6},

        {"enfant.3.nom",            1, 343, 515, 7},
        {"enfant.3.lien_parente",   1, 343, 496, 7},
        {"enfant.3.date_naissance", 1, 343, 484, 7},
        {"enfant.3.lieu_naissance", 1, 343, 472, 7},
        {"enfant.3.nationalite",    1, 343, 453, 7},
        {"enfant.3.nir",            1, 343, 430, 7},
        {"enfant.3.date_arrivee",   1, 343, 406, 7},
        {"enfant.3.situation",      1, 343, 387, 6},

        {"enfant.4.nom",            1, 456, 515, 7},
        {"enfant.4.lien_parente",   1, 456, 496, 7},
        {"enfant.4.date_naissance", 1, 456, 484, 7},
        {"enfant.4.lieu_naissance", 1, 456, 472, 7},
        {"enfant.4.nationalite",    1, 456, 453, 7},
        {"enfant.4.nir",            1, 456, 430, 7},
        {"enfant.4.date_arrivee",   1, 456, 406, 7},
        {"enfant.4.situation",      1, 456, 387, 6},

        {"current_date", 4, 150, 200},
    };

    private static final Object[][] numberFields = {
        {"demandeur.date_naissance",        0, 114, 635,  8, 15.7f},
        {"demandeur.departement_naissance", 0, 261, 608,  2},
        {"demandeur.nir",                   0,  31, 507, 15, 15.1f},
        {"conjoint.date_naissance",         0, 390, 635,  8, 15.7f},
        {"conjoint.departement_naissance",  0, 537, 608,  2},
        {"conjoint.nir",                    0, 308, 507, 15, 15.1f},

        {"adresse.code_postal",          0,  90, 352, 5, 14.9f},
        {"adresse.date_arrivee",         0, 184, 293, 8},
        {"adresse.conjoint.code_postal", 0,  90, 209, 5, 14.9f},

        {"tel.fixe",   0,  94, 338, 10, 14.9f},
        {"tel.mobile", 0, 378, 338, 10, 14.9f},

        {"statut_marital.date.mariage",           1, 172, 732, 8},
        {"statut_marital.date.pacs",              1, 172, 717, 8},
        {"statut_marital.date.relation_libre",    1, 334, 702, 8},
        {"statut_marital.date.separe",            1, 216, 657, 8},
        {"statut_marital.date.pacs_rompu",        1, 230, 642, 8},
        {"statut_marital.date.divorce",           1, 187, 627, 8},
        {"statut_marital.date.veuf",              1, 180, 612, 8},
        {"statut_marital.date.concubinage_rompu", 1, 278, 597, 8},
    };

    private static final EnumMap<IndividuRole, EnumMap<Civilite, String>> civiliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<IndividuRole, EnumMap<Nationalite, String>> nationaliteCheckboxes = new EnumMap<>(IndividuRole.class);
    private static final EnumMap<LogementType, String> logementTypeCheckboxes = new EnumMap<>(LogementType.class);
    private static final EnumMap<StatutMarital, String> statutMaritalCheckboxes = new EnumMap<>(StatutMarital.class);
    private static final EnumMap<StatutMarital, String> statutMaritalDates = new EnumMap<>(StatutMarital.class);

    private int currentEnfant = 1;

    public RSAFormFiller() {
        initCiviliteCheckboxes();
        initNationaliteCheckboxes();
        initLogementTypeCheckboxes();
        initStatutMaritalFields();
    }

    private void initCiviliteCheckboxes() {
        EnumMap<Civilite, String> demandeurCheckboxes = new EnumMap<>(Civilite.class);
        demandeurCheckboxes.put(Civilite.HOMME, "demandeur.homme");
        demandeurCheckboxes.put(Civilite.FEMME, "demandeur.femme");
        civiliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Civilite, String> conjointCheckboxes = new EnumMap<>(Civilite.class);
        conjointCheckboxes.put(Civilite.HOMME, "conjoint.homme");
        conjointCheckboxes.put(Civilite.FEMME, "conjoint.femme");
        civiliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initNationaliteCheckboxes() {
        EnumMap<Nationalite, String> demandeurCheckboxes = new EnumMap<>(Nationalite.class);
        demandeurCheckboxes.put(Nationalite.FRANCAISE, "demandeur.francais");
        demandeurCheckboxes.put(Nationalite.EEE_UE_SUISSE, "demandeur.ue");
        demandeurCheckboxes.put(Nationalite.AUTRE, "demandeur.non_ue");
        nationaliteCheckboxes.put(IndividuRole.DEMANDEUR, demandeurCheckboxes);

        EnumMap<Nationalite, String> conjointCheckboxes = new EnumMap<>(Nationalite.class);
        conjointCheckboxes.put(Nationalite.FRANCAISE, "conjoint.francais");
        conjointCheckboxes.put(Nationalite.EEE_UE_SUISSE, "conjoint.ue");
        conjointCheckboxes.put(Nationalite.AUTRE, "conjoint.non_ue");
        nationaliteCheckboxes.put(IndividuRole.CONJOINT, conjointCheckboxes);
    }

    private void initLogementTypeCheckboxes() {
        logementTypeCheckboxes.put(LogementType.LOCATAIRE, "logement.locataire");
        logementTypeCheckboxes.put(LogementType.PAYANT, "logement.payant");
        logementTypeCheckboxes.put(LogementType.GRATUIT, "logement.gratuit");
    }

    private void initStatutMaritalFields() {
        statutMaritalCheckboxes.put(StatutMarital.MARIAGE, "mariage");
        statutMaritalCheckboxes.put(StatutMarital.PACS, "pacs");
        statutMaritalCheckboxes.put(StatutMarital.RELATION_LIBRE, "relation_libre");
        statutMaritalCheckboxes.put(StatutMarital.SEPARE, "separe");
        statutMaritalCheckboxes.put(StatutMarital.PACS_ROMPU, "pacs_rompu");
        statutMaritalCheckboxes.put(StatutMarital.DIVORCE, "divorce");
        statutMaritalCheckboxes.put(StatutMarital.VEUF, "veuf");
        statutMaritalCheckboxes.put(StatutMarital.CONCUBINAGE_ROMPU, "concubinage_rompu");
        statutMaritalCheckboxes.put(StatutMarital.CELIBATAIRE, "celibataire");

        statutMaritalDates.put(StatutMarital.MARIAGE, "statut_marital.date.mariage");
        statutMaritalDates.put(StatutMarital.PACS, "statut_marital.date.pacs");
        statutMaritalDates.put(StatutMarital.RELATION_LIBRE, "statut_marital.date.relation_libre");
        statutMaritalDates.put(StatutMarital.SEPARE, "statut_marital.date.separe");
        statutMaritalDates.put(StatutMarital.PACS_ROMPU, "statut_marital.date.pacs_rompu");
        statutMaritalDates.put(StatutMarital.DIVORCE, "statut_marital.date.divorce");
        statutMaritalDates.put(StatutMarital.VEUF, "statut_marital.date.veuf");
        statutMaritalDates.put(StatutMarital.CONCUBINAGE_ROMPU, "statut_marital.date.concubinage_rompu");
    }

    @Override
    public Object[][] getCheckboxes() {
        return checkboxes;
    }

    @Override
    public Object[][] getTextFields() {
        return textFields;
    }

    @Override
    public Object[][] getNumberFields() {
        return numberFields;
    }

    @Override
    public void fill() {
        for (Individu individu : situation.individus) {
            if (IndividuRole.DEMANDEUR == individu.role) {
                fillDemandeur(individu);
            } else if (IndividuRole.CONJOINT == individu.role) {
                fillConjoint(individu);
            } else if (IndividuRole.ENFANT == individu.role) {
                fillEnfant(individu);
            }
        }

        fillLogement();
        fillContact();
        fillCurrentDate();
    }

    private void fillDemandeur(Individu demandeur) {
        String civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.civilite);
        checkbox(civiliteCheckbox);
        appendText("demandeur.nom", demandeur.lastName);
        appendText("demandeur.nom_usage", demandeur.nomUsage);
        appendText("demandeur.prenom", demandeur.firstName);
        appendNumber("demandeur.date_naissance", demandeur.dateDeNaissance.replaceAll("/", ""));

        if (null != demandeur.paysNaissance) {
            appendText("demandeur.pays_naissance", demandeur.paysNaissance);
            if ("france".equals(demandeur.paysNaissance.toLowerCase())) {
                appendText("demandeur.ville_naissance", demandeur.villeNaissance);
                if (null != demandeur.departementNaissance) {
                    appendNumber("demandeur.departement_naissance", String.valueOf(demandeur.departementNaissance));
                }
            }
        }

        String checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.DEMANDEUR).get(demandeur.nationalite);
        checkbox(checkboxNationalite);
        appendNumber("demandeur.nir", demandeur.nir);

        if (null != demandeur.inscritCaf) {
            if (demandeur.inscritCaf) {
                checkbox("demandeur.inscrit_caf.oui");
                appendText("demandeur.num_allocataire", demandeur.numeroAllocataire);
            } else {
                checkbox("demandeur.inscrit_caf.non");
            }
        }

        if (null != demandeur.statusMarital) {
            if (demandeur.statusMarital.isAlone) {
                checkbox("seul");
            } else {
                checkbox("en_couple");
            }

            String statutMaritalCheckbox = statutMaritalCheckboxes.get(demandeur.statusMarital);
            checkbox(statutMaritalCheckbox);

            String statutMaritalDateField = statutMaritalDates.get(demandeur.statusMarital);
            if (null != statutMaritalDateField && null != demandeur.dateSituationFamiliale) {
                appendNumber(statutMaritalDateField, demandeur.dateSituationFamiliale.replaceAll("/", ""));
            }
        }

        if (demandeur.enceinte) {
            checkbox("enceinte.oui");
        } else {
            checkbox("enceinte.non");
        }

        fillPensionAlimentaire(demandeur);
    }

    private void fillConjoint(Individu conjoint) {
        String civiliteCheckbox = civiliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.civilite);
        checkbox(civiliteCheckbox);
        appendText("conjoint.nom", conjoint.lastName);
        appendText("conjoint.nom_usage", conjoint.nomUsage);
        appendText("conjoint.prenom", conjoint.firstName);
        appendNumber("conjoint.date_naissance", conjoint.dateDeNaissance.replaceAll("/", ""));

        if (null != conjoint.paysNaissance) {
            appendText("conjoint.pays_naissance", conjoint.paysNaissance);
            if ("france".equals(conjoint.paysNaissance.toLowerCase())) {
                appendText("conjoint.ville_naissance", conjoint.villeNaissance);
                if (null != conjoint.departementNaissance) {
                    appendNumber("conjoint.departement_naissance", String.valueOf(conjoint.departementNaissance));
                }
            }
        }

        String checkboxNationalite = nationaliteCheckboxes.get(IndividuRole.CONJOINT).get(conjoint.nationalite);
        checkbox(checkboxNationalite);
        appendNumber("conjoint.nir", conjoint.nir);

        if (null != conjoint.inscritCaf) {
            if (conjoint.inscritCaf) {
                checkbox("conjoint.inscrit_caf.oui");
                appendText("conjoint.num_allocataire", conjoint.numeroAllocataire);
            } else {
                checkbox("conjoint.inscrit_caf.non");
            }
        }
    }

    private void fillEnfant(Individu individu) {
        if (currentEnfant > 4) {
            return;
        }

        String nomPrenom = null;
        if (null != individu.lastName) {
            nomPrenom = individu.lastName;
            if (null != individu.firstName) {
                nomPrenom += " " + individu.firstName;
            }
        }
        appendText(String.format("enfant.%d.nom", currentEnfant), nomPrenom);

        if (null != individu.lienParente) {
            appendText(String.format("enfant.%d.lien_parente", currentEnfant), individu.lienParente.formValue);
        }

        appendText(String.format("enfant.%d.date_naissance", currentEnfant), individu.dateDeNaissance);
        if (null != individu.paysNaissance) {
            if ("france".equals(individu.paysNaissance.toLowerCase())) {
                if (null != individu.villeNaissance) {
                    String lieuNaissance = individu.villeNaissance;
                    if (null != individu.departementNaissance) {
                        lieuNaissance = String.format("%s (%d)", individu.villeNaissance, individu.departementNaissance);
                    }
                    appendText(String.format("enfant.%d.lieu_naissance", currentEnfant), lieuNaissance);
                }
            } else {
                appendText(String.format("enfant.%d.lieu_naissance", currentEnfant), individu.paysNaissance);
            }
        }

        if (Nationalite.FRANCAISE == individu.nationalite) {
            appendText(String.format("enfant.%d.nationalite", currentEnfant), "Française");
        }

        appendText(String.format("enfant.%d.nir", currentEnfant), individu.nir);
        appendText(String.format("enfant.%d.date_arrivee", currentEnfant), individu.dateArriveeFoyer);
        if (null != individu.situation) {
            appendText(String.format("enfant.%d.situation", currentEnfant), individu.situation.formValue);
        }

        currentEnfant++;
    }

    private void fillLogement() {
        if (null != situation.logement.adresse) {
            String[] addressTokens = situation.logement.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(String.valueOf(number.charAt(0)))) {
                    appendText("adresse.numero", number);
                    addressTokens = ArrayUtils.remove(addressTokens, 0);
                }
                String address = StringUtils.join(addressTokens, " ");
                appendText("adresse.rue", address);
            }
        }

        appendNumber("adresse.code_postal", situation.logement.codePostal);
        appendText("adresse.ville", situation.logement.ville);

        String logementTypeCheckbox = logementTypeCheckboxes.get(situation.logement.type);
        checkbox(logementTypeCheckbox);

        if (LogementType.PROPRIETAIRE == situation.logement.type) {
            if (null == situation.logement.loyer || Integer.valueOf(0).equals(situation.logement.loyer)) {
                checkbox("logement.proprio_no_pret");
            } else {
                checkbox("logement.proprio_pret");
            }
        }

        if (null != situation.logement.dateArrivee) {
            appendNumber("adresse.date_arrivee", situation.logement.dateArrivee.replaceAll("/", ""));
        }

        if (false == situation.logement.conjointMemeAdresse && null != situation.logement.conjoint) {
            String[] addressTokens = situation.logement.conjoint.adresse.split(" ");
            if (addressTokens.length > 1) {
                String number = addressTokens[0];
                if (StringUtils.isNumeric(String.valueOf(number.charAt(0)))) {
                    appendText("adresse.conjoint.numero", number);
                }
                addressTokens = ArrayUtils.remove(addressTokens, 0);
                String address = StringUtils.join(addressTokens, " ");
                appendText("adresse.conjoint.rue", address);
            }

            appendNumber("adresse.conjoint.code_postal", situation.logement.conjoint.codePostal);
            appendText("adresse.conjoint.ville", situation.logement.conjoint.ville);
            appendText("adresse.conjoint.pays", situation.logement.conjoint.pays);
        }
    }

    private void fillContact() {
        if (null != situation.phoneNumber) {
            if (StringUtils.startsWithAny(situation.phoneNumber, "06", "+336", "07", "+337")) {
                appendNumber("tel.mobile", situation.phoneNumber);
            } else {
                appendNumber("tel.fixe", situation.phoneNumber);
            }
        }

        if (null != situation.email) {
            String[] parts =  situation.email.split("@");
            if (parts.length > 1) {
                appendText("adresse.mail.gauche", parts[0]);
                appendText("adresse.mail.droite", parts[1]);
            } else {
                appendText("adresse.mail.gauche", situation.email);
            }
        }
    }

    private void fillPensionAlimentaire(Individu demandeur) {
        if (StatutMarital.SEPARE == demandeur.statusMarital) {
            checkbox("pension_alimentaire.separe");
        }

        if (null != demandeur.statusMarital && demandeur.statusMarital.isAlone && childrenNb() > 0) {
            checkbox("pension_alimentaire.has_child_alone");
        }
    }

    private int childrenNb() {
        int nb = 0;
        for (Individu individu : situation.individus) {
            if (IndividuRole.ENFANT == individu.role) {
                nb++;
            }
        }

        return nb;
    }

    private void fillCurrentDate() {
        String currentDate = LocalDate.now().toString("dd/MM/yyyy");
        appendText("current_date", currentDate);
    }
}
