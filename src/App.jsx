import { useState, useRef, useEffect, createContext, useContext } from "react";

const ThemeCtx = createContext(null);
const useTheme = () => useContext(ThemeCtx);
const LangCtx = createContext("fr");
const useLang = () => useContext(LangCtx);

const I18N = {
  fr:{
    // tabs
    tab_home:"RÃ©sumÃ©",tab_scan:"DÃ©pistage",tab_history:"Historique",tab_chat:"Assistant",tab_profile:"Profil",
    // settings
    settings:"RÃ©glages",appearance:"Apparence",dark_mode:"Mode sombre",dark_on:"ActivÃ©",dark_off:"DÃ©sactivÃ©",lang_label:"Langue",
    privacy_title:"DonnÃ©es & ConfidentialitÃ©",photo_label:"Photos",photo_desc:"AnalysÃ©es localement Â· Aucune conservation",
    analyses_label:"Analyses",analyses_desc:"MÃ©tadonnÃ©es anonymisÃ©es si consentement",legal_label:"Base lÃ©gale",legal_desc:"RGPD Art. 9.2.j Â· Recherche mÃ©dicale",hosting_label:"HÃ©bergement",hosting_desc:"Serveurs EU (Frankfurt)",
    about_title:"Ã propos",version_label:"Version",version_val:"bÃªta Â· Mars 2026",author_label:"Auteur",author_val:"Siouala Ramy",compliance_label:"ConformitÃ©",compliance_val:"RGPD Â· HDS Â· CE marquage en cours",
    reset_btn:"RÃ©initialiser les donnÃ©es",disclaimer:"Outil de sensibilisation acadÃ©mique. Ne constitue pas un dispositif mÃ©dical rÃ©glementÃ©.",
    // home
    greet_morning:"Bonjour",greet_afternoon:"Bon aprÃ¨s-midi",greet_evening:"Bonsoir",
    health_title:"Suivi de santÃ©",ring_rdv:"Prochain RDV",ring_rdv_unit:"avant prochain FO",ring_glyc:"GlycÃ©mie",ring_glyc_unit:"g/L aujourd'hui",ring_vision:"AcuitÃ© visuelle",ring_vision_unit:"dernier Snellen",
    last_retina:"Dernier rÃ©sultat rÃ©tinien",glyc_today:"GlycÃ©mie aujourd'hui",glyc_tap:"Appuyez pour ajouter",measure:"mesure",measures:"mesures",
    stat_analyses:"Analyses",stat_acuite:"AcuitÃ©",stat_mesures:"Mesures",stat_rdv:"Prochain FO",stat_total:"total",stat_glycemie:"glycÃ©mie",stat_fo:"fond d'Åil",
    guest_mode:"Mode invitÃ©",guest_desc:"CrÃ©ez un compte pour tout sauvegarder.",guest_btn:"CrÃ©er",rdv_btn:"ð¥ Prendre RDV ophtalmologue â",
    // scan
    scan_title:"DÃ©pistage",scan_subtitle:"Analyse IA â Fond d'Åil",scan_step1:"Import",scan_step2:"Analyse",scan_step3:"RÃ©sultat",
    scan_photo_title:"Photo de fond d'Åil",scan_photo_desc:"Importez une rÃ©tinographie depuis votre galerie.",scan_gallery:"ð¼ï¸ Galerie",scan_camera:"ð· CamÃ©ra",
    scan_info:"Utilisez une vraie rÃ©tinographie (fond d'Åil), pas une photo frontale de l'Åil.",
    scan_change:"Changer",scan_analyze:"Analyser â",scan_analyzing:"Analyse en coursâ¦",scan_ai:"L'IA examine votre rÃ©tinographie",
    scan_result_title:"RÃ©sultat ICDR",scan_level:"Niveau",scan_confidence:"Confiance",scan_findings:"Signes observÃ©s",
    scan_urgent:"â ï¸ RÃ©sultat nÃ©cessitant une consultation ophtalmologique urgente.",scan_doctolib:"ð¥ Prendre RDV sur Doctolib â",
    scan_footer:(s)=>`AnalysÃ© en ${s}s Â· Outil de sensibilisation â pas un diagnostic`,scan_save:"â Enregistrer dans mon historique",scan_error:"Analyse impossible. Le serveur est peut-Ãªtre en cours de dÃ©marrage, rÃ©essayez.",
    // history
    hist_title:"Historique",hist_entries:(n)=>`${n} entrÃ©e${n!==1?"s":""}`,hist_empty_title:"Aucune entrÃ©e",hist_empty_desc:"Vos analyses apparaÃ®tront ici.",
    hist_all:"Tout",hist_retina:"RÃ©tine",hist_glyc:"GlycÃ©mie",hist_vision:"AcuitÃ©",
    hist_snellen:"AcuitÃ© Snellen",hist_parinaud:"AcuitÃ© Parinaud",
    // chat
    chat_subtitle:"Appuyez sur un sujet pour en savoir plus",chat_tool:"RetinaScore â Outil acadÃ©mique",chat_disclaimer_inline:"Ces informations sont indicatives et ne remplacent pas un avis mÃ©dical.",chat_footer:"Pas un avis mÃ©dical Â· Sources : HAS 2024 Â· SFO",
    faq:[
      {q:"Qu'est-ce que la rÃ©tinopathie diabÃ©tique ?",short:"RÃ©tinopathie",a:"La rÃ©tinopathie diabÃ©tique (RD) est une complication du diabÃ¨te touchant les vaisseaux rÃ©tiniens. Elle Ã©volue silencieusement avant d'affecter la vision â d'oÃ¹ l'importance du dÃ©pistage annuel mÃªme sans symptÃ´me.",icon:"ðï¸",color:"#0a84ff"},
      {q:"Ã quoi correspond le score ICDR (0 Ã  4) ?",short:"Score ICDR",a:"L'ICDR classe la RD de 0 (aucun signe) Ã  4 (forme prolifÃ©rante). Niveau 0â1 : contrÃ´le annuel. Niveau 2 : ophtalmologue sous 6 mois. Niveaux 3â4 : consultation urgente.",icon:"ð",color:"#ff9f0a"},
      {q:"Quelle est la cible de glycÃ©mie ?",short:"GlycÃ©mie",a:"HbA1c < 7 %. GlycÃ©mie Ã  jeun : 0,70â1,26 g/L. Post-prandiale < 1,60 g/L (recommandations HAS 2024). Un Ã©quilibre glycÃ©mique strict ralentit la progression de la rÃ©tinopathie.",icon:"ð",color:"#30d158"},
      {q:"Quels sont les traitements disponibles ?",short:"Traitements",a:"Selon le stade : laser pan-rÃ©tinien (PPR), injections intra-vitrÃ©ennes anti-VEGF (Ranibizumab, Aflibercept) pour l'ÅdÃ¨me maculaire, ou vitrectomie en cas de complications sÃ©vÃ¨res.",icon:"ð",color:"#bf5af2"},
      {q:"Ã quelle frÃ©quence faire le fond d'Åil ?",short:"FrÃ©quence",a:"Fond d'Åil annuel obligatoire dÃ¨s le diagnostic pour le diabÃ¨te de type 2. Pour le type 1, Ã  partir de 5 ans d'Ã©volution. En cas de grossesse ou HbA1c dÃ©sÃ©quilibrÃ©e : surveillance plus rapprochÃ©e.",icon:"ð",color:"#ff375f"},
      {q:"Comment prÃ©venir la rÃ©tinopathie ?",short:"PrÃ©vention",a:"ContrÃ´le glycÃ©mique strict (HbA1c < 7 %), pression artÃ©rielle < 130/80 mmHg, arrÃªt du tabac, activitÃ© physique rÃ©guliÃ¨re et suivi ophtalmologique annuel.",icon:"ð¡ï¸",color:"#34c759"},
      {q:"Mes donnÃ©es sont-elles confidentielles ?",short:"ConfidentialitÃ©",a:"Vos photos sont analysÃ©es localement. Seules des mÃ©tadonnÃ©es anonymisÃ©es sont conservÃ©es avec votre consentement explicite. Base lÃ©gale : RGPD Art. 9.2.j â recherche mÃ©dicale.",icon:"ð",color:"#ff9f0a"},
    ],
    // icdr
    icdr:[
      {label:"Aucun signe",advice:"Votre rÃ©tine semble saine. Continuez vos contrÃ´les annuels."},
      {label:"Atteinte lÃ©gÃ¨re",advice:"Micro-anÃ©vrismes dÃ©tectÃ©s. ContrÃ´le ophtalmologique dans 12 mois."},
      {label:"Atteinte modÃ©rÃ©e",advice:"LÃ©sions modÃ©rÃ©es. Consultez un ophtalmologue sous 6 mois."},
      {label:"Atteinte sÃ©vÃ¨re",advice:"Atteinte sÃ©vÃ¨re. Consultation ophtalmologique urgente."},
      {label:"Forme prolifÃ©rante",advice:"URGENCE. Consultez un ophtalmologue immÃ©diatement."},
    ],
  },
  en:{
    tab_home:"Summary",tab_scan:"Screening",tab_history:"History",tab_chat:"Assistant",tab_profile:"Profile",
    settings:"Settings",appearance:"Appearance",dark_mode:"Dark mode",dark_on:"On",dark_off:"Off",lang_label:"Language",
    privacy_title:"Data & Privacy",photo_label:"Photos",photo_desc:"Analysed locally Â· No retention",
    analyses_label:"Analyses",analyses_desc:"Anonymised metadata if consent given",legal_label:"Legal basis",legal_desc:"GDPR Art. 9.2.j Â· Medical research",hosting_label:"Hosting",hosting_desc:"EU servers (Frankfurt)",
    about_title:"About",version_label:"Version",version_val:"beta Â· March 2026",author_label:"Author",author_val:"Siouala Ramy",compliance_label:"Compliance",compliance_val:"GDPR Â· HDS Â· CE marking in progress",
    reset_btn:"Reset all data",disclaimer:"Academic awareness tool. Not a regulated medical device.",
    greet_morning:"Good morning",greet_afternoon:"Good afternoon",greet_evening:"Good evening",
    health_title:"Health tracking",ring_rdv:"Next appt.",ring_rdv_unit:"before next FE",ring_glyc:"Blood sugar",ring_glyc_unit:"g/L today",ring_vision:"Visual acuity",ring_vision_unit:"last Snellen",
    last_retina:"Last retinal result",glyc_today:"Blood sugar today",glyc_tap:"Tap to add",measure:"reading",measures:"readings",
    stat_analyses:"Analyses",stat_acuite:"Acuity",stat_mesures:"Readings",stat_rdv:"Next FE",stat_total:"total",stat_glycemie:"blood sugar",stat_fo:"fundus exam",
    guest_mode:"Guest mode",guest_desc:"Create an account to save everything.",guest_btn:"Create",rdv_btn:"ð¥ Book ophthalmologist â",
    scan_title:"Screening",scan_subtitle:"AI analysis â Fundus",scan_step1:"Import",scan_step2:"Analysis",scan_step3:"Result",
    scan_photo_title:"Fundus photo",scan_photo_desc:"Import a retinal photo from your gallery.",scan_gallery:"ð¼ï¸ Gallery",scan_camera:"ð· Camera",
    scan_info:"Use a real fundus photograph, not a frontal photo of the eye.",
    scan_change:"Change",scan_analyze:"Analyse â",scan_analyzing:"Analysingâ¦",scan_ai:"AI is examining your retinal image",
    scan_result_title:"ICDR Result",scan_level:"Level",scan_confidence:"Confidence",scan_findings:"Observed signs",
    scan_urgent:"â ï¸ This result requires urgent ophthalmological consultation.",scan_doctolib:"ð¥ Book an appointment â",
    scan_footer:(s)=>`Analysed in ${s}s Â· Awareness tool â not a diagnosis`,scan_save:"â Save to my history",scan_error:"Analysis failed. The server may be starting up, please retry.",
    hist_title:"History",hist_entries:(n)=>`${n} entr${n!==1?"ies":"y"}`,hist_empty_title:"No entries",hist_empty_desc:"Your analyses will appear here.",
    hist_all:"All",hist_retina:"Retina",hist_glyc:"Blood sugar",hist_vision:"Acuity",hist_snellen:"Snellen acuity",hist_parinaud:"Parinaud acuity",
    chat_subtitle:"Tap a topic to learn more",chat_tool:"RetinaScore â Academic tool",chat_disclaimer_inline:"This information is indicative and does not replace medical advice.",chat_footer:"Not medical advice Â· Sources: HAS 2024 Â· SFO",
    faq:[
      {q:"What is diabetic retinopathy?",short:"Retinopathy",a:"Diabetic retinopathy (DR) is a diabetes complication affecting retinal blood vessels. It progresses silently before affecting vision â hence the importance of annual screening even without symptoms.",icon:"ðï¸",color:"#0a84ff"},
      {q:"What does the ICDR score (0â4) mean?",short:"ICDR score",a:"ICDR classifies DR from 0 (no signs) to 4 (proliferative form). Level 0â1: annual check. Level 2: ophthalmologist within 6 months. Levels 3â4: urgent consultation.",icon:"ð",color:"#ff9f0a"},
      {q:"What is the target blood sugar?",short:"Blood sugar",a:"HbA1c < 7%. Fasting blood glucose: 0.70â1.26 g/L. Post-prandial < 1.60 g/L (HAS 2024). Strict glycaemic control slows retinopathy progression.",icon:"ð",color:"#30d158"},
      {q:"What treatments are available?",short:"Treatments",a:"Depending on stage: pan-retinal laser (PRP), intravitreal anti-VEGF injections (Ranibizumab, Aflibercept) for macular oedema, or vitrectomy for severe complications.",icon:"ð",color:"#bf5af2"},
      {q:"How often should I have a fundus exam?",short:"Frequency",a:"Annual fundus exam mandatory from diagnosis for type 2 diabetes. For type 1, from 5 years of onset. During pregnancy or with uncontrolled HbA1c: more frequent monitoring.",icon:"ð",color:"#ff375f"},
      {q:"How to prevent retinopathy?",short:"Prevention",a:"Strict glycaemic control (HbA1c < 7%), blood pressure < 130/80 mmHg, no smoking, regular physical activity and annual eye check.",icon:"ð¡ï¸",color:"#34c759"},
      {q:"Is my data confidential?",short:"Privacy",a:"Your photos are analysed locally. Only anonymised metadata is retained with your explicit consent. Legal basis: GDPR Art. 9.2.j â medical research.",icon:"ð",color:"#ff9f0a"},
    ],
    icdr:[
      {label:"No signs",advice:"Your retina appears healthy. Continue annual check-ups."},
      {label:"Mild NPDR",advice:"Microaneurysms detected. Ophthalmological check within 12 months."},
      {label:"Moderate NPDR",advice:"Moderate lesions. See an ophthalmologist within 6 months."},
      {label:"Severe NPDR",advice:"Severe involvement. Urgent ophthalmological consultation."},
      {label:"Proliferative DR",advice:"EMERGENCY. See an ophthalmologist immediately."},
    ],
  },
  de:{
    tab_home:"Ãbersicht",tab_scan:"Screening",tab_history:"Verlauf",tab_chat:"Assistent",tab_profile:"Profil",
    settings:"Einstellungen",appearance:"Darstellung",dark_mode:"Dunkelmodus",dark_on:"An",dark_off:"Aus",lang_label:"Sprache",
    privacy_title:"Daten & Datenschutz",photo_label:"Fotos",photo_desc:"Lokal analysiert Â· Keine Speicherung",
    analyses_label:"Analysen",analyses_desc:"Anonymisierte Metadaten bei Einwilligung",legal_label:"Rechtsgrundlage",legal_desc:"DSGVO Art. 9.2.j Â· Medizinische Forschung",hosting_label:"Hosting",hosting_desc:"EU-Server (Frankfurt)",
    about_title:"Ãber",version_label:"Version",version_val:"Beta Â· MÃ¤rz 2026",author_label:"Autor",author_val:"Siouala Ramy",compliance_label:"KonformitÃ¤t",compliance_val:"DSGVO Â· HDS Â· CE-Kennzeichnung laufend",
    reset_btn:"Alle Daten zurÃ¼cksetzen",disclaimer:"Akademisches Sensibilisierungstool. Kein zugelassenes Medizinprodukt.",
    greet_morning:"Guten Morgen",greet_afternoon:"Guten Tag",greet_evening:"Guten Abend",
    health_title:"GesundheitsÃ¼bersicht",ring_rdv:"NÃ¤chster Termin",ring_rdv_unit:"bis nÃ¤chster AU",ring_glyc:"Blutzucker",ring_glyc_unit:"g/L heute",ring_vision:"SehschÃ¤rfe",ring_vision_unit:"letzter Snellen",
    last_retina:"Letztes Netzhautergebnis",glyc_today:"Blutzucker heute",glyc_tap:"Tippen zum HinzufÃ¼gen",measure:"Messung",measures:"Messungen",
    stat_analyses:"Analysen",stat_acuite:"SehschÃ¤rfe",stat_mesures:"Messungen",stat_rdv:"NÃ¤chste AU",stat_total:"gesamt",stat_glycemie:"Blutzucker",stat_fo:"Augenuntersuchung",
    guest_mode:"Gastmodus",guest_desc:"Erstellen Sie ein Konto, um alles zu speichern.",guest_btn:"Erstellen",rdv_btn:"ð¥ Augenarzt buchen â",
    scan_title:"Screening",scan_subtitle:"KI-Analyse â Fundus",scan_step1:"Import",scan_step2:"Analyse",scan_step3:"Ergebnis",
    scan_photo_title:"Fundusfoto",scan_photo_desc:"Importieren Sie eine Netzhautaufnahme aus Ihrer Galerie.",scan_gallery:"ð¼ï¸ Galerie",scan_camera:"ð· Kamera",
    scan_info:"Verwenden Sie ein echtes Fundusfoto, kein frontales Augenfoto.",
    scan_change:"Ãndern",scan_analyze:"Analysieren â",scan_analyzing:"Analyse lÃ¤uftâ¦",scan_ai:"KI untersucht Ihre Netzhautaufnahme",
    scan_result_title:"ICDR-Ergebnis",scan_level:"Niveau",scan_confidence:"Konfidenz",scan_findings:"Beobachtete Zeichen",
    scan_urgent:"â ï¸ Dieses Ergebnis erfordert eine dringende augenÃ¤rztliche Konsultation.",scan_doctolib:"ð¥ Termin buchen â",
    scan_footer:(s)=>`Analysiert in ${s}s Â· Sensibilisierungstool â keine Diagnose`,scan_save:"â In meiner Historie speichern",scan_error:"Analyse fehlgeschlagen. Der Server startet mÃ¶glicherweise, bitte erneut versuchen.",
    hist_title:"Verlauf",hist_entries:(n)=>`${n} Eintrag${n!==1?"eintrÃ¤ge":""}`,hist_empty_title:"Keine EintrÃ¤ge",hist_empty_desc:"Ihre Analysen erscheinen hier.",
    hist_all:"Alle",hist_retina:"Netzhaut",hist_glyc:"Blutzucker",hist_vision:"SehschÃ¤rfe",hist_snellen:"Snellen-SehschÃ¤rfe",hist_parinaud:"Parinaud-SehschÃ¤rfe",
    chat_subtitle:"Thema antippen fÃ¼r mehr Infos",chat_tool:"RetinaScore â Akademisches Tool",chat_disclaimer_inline:"Diese Informationen sind indikativ und ersetzen keinen Arzt.",chat_footer:"Kein medizinischer Rat Â· Quellen: HAS 2024 Â· SFO",
    faq:[
      {q:"Was ist diabetische Retinopathie?",short:"Retinopathie",a:"Die diabetische Retinopathie (DR) ist eine Diabetes-Komplikation, die die NetzhautgefÃ¤Ãe betrifft. Sie schreitet still voran, bevor sie das Sehen beeintrÃ¤chtigt.",icon:"ðï¸",color:"#0a84ff"},
      {q:"Was bedeutet der ICDR-Score (0â4)?",short:"ICDR-Score",a:"ICDR klassifiziert DR von 0 (keine Zeichen) bis 4 (proliferative Form). Stufe 0â1: jÃ¤hrliche Kontrolle. Stufe 2: Augenarzt in 6 Monaten. Stufen 3â4: dringende Konsultation.",icon:"ð",color:"#ff9f0a"},
      {q:"Was ist der Zielwert fÃ¼r den Blutzucker?",short:"Blutzucker",a:"HbA1c < 7%. NÃ¼chternblutzucker: 0,70â1,26 g/L. Postprandial < 1,60 g/L. Strikte Einstellung verlangsamt die Retinopathie.",icon:"ð",color:"#30d158"},
      {q:"Welche Behandlungen gibt es?",short:"Behandlungen",a:"Je nach Stadium: panretinale Laserkoagulation, intravitreale Anti-VEGF-Injektionen oder Vitrektomie bei schweren Komplikationen.",icon:"ð",color:"#bf5af2"},
      {q:"Wie oft sollte ich zur Augenuntersuchung?",short:"HÃ¤ufigkeit",a:"JÃ¤hrliche Augenuntersuchung ab Diagnose bei Typ-2-Diabetes. Bei Typ 1 ab 5 Jahren Krankheitsdauer. In der Schwangerschaft: engmaschigere Ãberwachung.",icon:"ð",color:"#ff375f"},
      {q:"Wie lÃ¤sst sich Retinopathie vorbeugen?",short:"PrÃ¤vention",a:"Strenge Blutzuckerkontrolle (HbA1c < 7%), Blutdruck < 130/80 mmHg, Nichtrauchen, kÃ¶rperliche AktivitÃ¤t und jÃ¤hrliche Augenuntersuchung.",icon:"ð¡ï¸",color:"#34c759"},
      {q:"Sind meine Daten vertraulich?",short:"Datenschutz",a:"Ihre Fotos werden lokal analysiert. Nur anonymisierte Metadaten werden mit Ihrer Einwilligung gespeichert. Rechtsgrundlage: DSGVO Art. 9.2.j.",icon:"ð",color:"#ff9f0a"},
    ],
    icdr:[
      {label:"Keine Zeichen",advice:"Ihre Netzhaut scheint gesund. JÃ¤hrliche Kontrollen fortsetzen."},
      {label:"Leichte DR",advice:"Mikroaneurysmen erkannt. AugenÃ¤rztliche Kontrolle in 12 Monaten."},
      {label:"MÃ¤Ãige DR",advice:"MÃ¤Ãige LÃ¤sionen. Augenarzt innerhalb von 6 Monaten aufsuchen."},
      {label:"Schwere DR",advice:"Schwere Beteiligung. Dringende augenÃ¤rztliche Konsultation."},
      {label:"Proliferative DR",advice:"NOTFALL. Sofort einen Augenarzt aufsuchen."},
    ],
  },
  ro:{
    tab_home:"Rezumat",tab_scan:"Screening",tab_history:"Istoric",tab_chat:"Asistent",tab_profile:"Profil",
    settings:"SetÄri",appearance:"Aspect",dark_mode:"Mod Ã®ntunecat",dark_on:"Activat",dark_off:"Dezactivat",lang_label:"LimbÄ",
    privacy_title:"Date & ConfidenÈialitate",photo_label:"Fotografii",photo_desc:"Analizate local Â· FÄrÄ stocare",
    analyses_label:"Analize",analyses_desc:"Metadate anonimizate cu consimÈÄmÃ¢nt",legal_label:"Temei legal",legal_desc:"GDPR Art. 9.2.j Â· Cercetare medicalÄ",hosting_label:"GÄzduire",hosting_desc:"Servere UE (Frankfurt)",
    about_title:"Despre",version_label:"Versiune",version_val:"beta Â· Martie 2026",author_label:"Autor",author_val:"Siouala Ramy",compliance_label:"Conformitate",compliance_val:"GDPR Â· HDS Â· Marcare CE Ã®n curs",
    reset_btn:"ResetaÈi datele",disclaimer:"Instrument academic de sensibilizare. Nu este un dispozitiv medical reglementat.",
    greet_morning:"BunÄ dimineaÈa",greet_afternoon:"BunÄ ziua",greet_evening:"BunÄ seara",
    health_title:"Monitorizare sÄnÄtate",ring_rdv:"UrmÄtoarea prog.",ring_rdv_unit:"pÃ¢nÄ la FO",ring_glyc:"Glicemie",ring_glyc_unit:"g/L azi",ring_vision:"Acuitate vizualÄ",ring_vision_unit:"ultimul Snellen",
    last_retina:"Ultimul rezultat retinian",glyc_today:"Glicemie azi",glyc_tap:"AtingeÈi pentru a adÄuga",measure:"mÄsurÄtoare",measures:"mÄsurÄtori",
    stat_analyses:"Analize",stat_acuite:"Acuitate",stat_mesures:"MÄsurÄtori",stat_rdv:"Urm. FO",stat_total:"total",stat_glycemie:"glicemie",stat_fo:"fund de ochi",
    guest_mode:"Mod invitat",guest_desc:"CreaÈi un cont pentru a salva totul.",guest_btn:"Creare",rdv_btn:"ð¥ Programare oftalmolog â",
    scan_title:"Screening",scan_subtitle:"AnalizÄ IA â Fund de ochi",scan_step1:"Import",scan_step2:"AnalizÄ",scan_step3:"Rezultat",
    scan_photo_title:"Fotografie fund de ochi",scan_photo_desc:"ImportaÈi o retinografie din galeria dvs.",scan_gallery:"ð¼ï¸ Galerie",scan_camera:"ð· CamerÄ",
    scan_info:"FolosiÈi o retinografie realÄ, nu o fotografie frontalÄ a ochiului.",
    scan_change:"SchimbaÈi",scan_analyze:"AnalizaÈi â",scan_analyzing:"AnalizÄ Ã®n cursâ¦",scan_ai:"IA examineazÄ retinografia dvs.",
    scan_result_title:"Rezultat ICDR",scan_level:"Nivel",scan_confidence:"Ãncredere",scan_findings:"Semne observate",
    scan_urgent:"â ï¸ Rezultat ce necesitÄ consultaÈie oftalmologicÄ urgentÄ.",scan_doctolib:"ð¥ ProgramaÈi o consultaÈie â",
    scan_footer:(s)=>`Analizat Ã®n ${s}s Â· Instrument de sensibilizare â nu un diagnostic`,scan_save:"â Salvare Ã®n istoricul meu",scan_error:"AnalizÄ imposibilÄ. Serverul poate porni, reÃ®ncercaÈi.",
    hist_title:"Istoric",hist_entries:(n)=>`${n} Ã®nregistrare${n!==1?"i":""}`,hist_empty_title:"Nicio Ã®nregistrare",hist_empty_desc:"Analizele dvs. vor apÄrea aici.",
    hist_all:"Toate",hist_retina:"RetinÄ",hist_glyc:"Glicemie",hist_vision:"Acuitate",hist_snellen:"Acuitate Snellen",hist_parinaud:"Acuitate Parinaud",
    chat_subtitle:"AtingeÈi un subiect pentru mai multe informaÈii",chat_tool:"RetinaScore â Instrument academic",chat_disclaimer_inline:"Aceste informaÈii sunt orientative Èi nu Ã®nlocuiesc sfatul medical.",chat_footer:"Nu este sfat medical Â· Surse: HAS 2024 Â· SFO",
    faq:[
      {q:"Ce este retinopatia diabeticÄ?",short:"Retinopatie",a:"Retinopatia diabeticÄ (RD) este o complicaÈie a diabetului care afecteazÄ vasele retiniene. EvolueazÄ tÄcut Ã®nainte de a afecta vederea â de aceea screeningul anual este esenÈial.",icon:"ðï¸",color:"#0a84ff"},
      {q:"Ce Ã®nseamnÄ scorul ICDR (0â4)?",short:"Scor ICDR",a:"ICDR clasificÄ RD de la 0 (fÄrÄ semne) la 4 (formÄ proliferativÄ). Nivel 0â1: control anual. Nivel 2: oftalmolog Ã®n 6 luni. Niveluri 3â4: consultaÈie urgentÄ.",icon:"ð",color:"#ff9f0a"},
      {q:"Care este Èinta glicemiei?",short:"Glicemie",a:"HbA1c < 7%. Glicemie Ã  jeun: 0,70â1,26 g/L. Post-prandial < 1,60 g/L. Controlul strict al glicemiei Ã®ncetineÈte progresia retinopatiei.",icon:"ð",color:"#30d158"},
      {q:"Ce tratamente sunt disponibile?",short:"Tratamente",a:"Ãn funcÈie de stadiu: laser pan-retinian, injecÈii intravitreene anti-VEGF sau vitrectomie Ã®n caz de complicaÈii severe.",icon:"ð",color:"#bf5af2"},
      {q:"CÃ¢t de des trebuie fÄcut fundul de ochi?",short:"FrecvenÈÄ",a:"Fund de ochi anual obligatoriu de la diagnostic pentru diabetul de tip 2. Pentru tipul 1, dupÄ 5 ani de evoluÈie.",icon:"ð",color:"#ff375f"},
      {q:"Cum se previne retinopatia?",short:"PrevenÈie",a:"Control glicemic strict (HbA1c < 7%), tensiune < 130/80 mmHg, renunÈarea la fumat, activitate fizicÄ regulatÄ Èi control oftalmic anual.",icon:"ð¡ï¸",color:"#34c759"},
      {q:"Datele mele sunt confidenÈiale?",short:"ConfidenÈialitate",a:"Fotografiile dvs. sunt analizate local. Doar metadate anonimizate sunt pÄstrate cu consimÈÄmÃ¢ntul dvs. explicit. Temei legal: GDPR Art. 9.2.j.",icon:"ð",color:"#ff9f0a"},
    ],
    icdr:[
      {label:"FÄrÄ semne",advice:"Retina dvs. pare sÄnÄtoasÄ. ContinuaÈi controalele anuale."},
      {label:"Afectare uÈoarÄ",advice:"Microanevrisme detectate. Control oftalmologic Ã®n 12 luni."},
      {label:"Afectare moderatÄ",advice:"Leziuni moderate. ConsultaÈi un oftalmolog Ã®n 6 luni."},
      {label:"Afectare severÄ",advice:"Afectare severÄ. ConsultaÈie oftalmologicÄ urgentÄ."},
      {label:"FormÄ proliferativÄ",advice:"URGENÈÄ. ConsultaÈi imediat un oftalmolog."},
    ],
  },
};

const STORE_KEY = "_rs8_data";
const _loadStore = () => { try { return JSON.parse(localStorage.getItem(STORE_KEY)||"{}"); } catch { return {}; } };
const _saveStore = (s) => { try { localStorage.setItem(STORE_KEY, JSON.stringify(s)); } catch {} };
if (!window._rs8) window._rs8 = _loadStore();
const DB = {
  get:(k,fb=null)=>{try{const v=window._rs8[k];return v!==undefined?JSON.parse(v):fb;}catch{return fb;}},
  set:(k,v)=>{window._rs8[k]=JSON.stringify(v);_saveStore(window._rs8);},
  del:(k)=>{delete window._rs8[k];_saveStore(window._rs8);},
};

const ICDR_META=[
  {level:0,color:"#30d158",bg:"rgba(48,209,88,0.12)",emoji:"â"},
  {level:1,color:"#ffd60a",bg:"rgba(255,214,10,0.12)",emoji:"ð¡"},
  {level:2,color:"#ff9f0a",bg:"rgba(255,159,10,0.12)",emoji:"ð "},
  {level:3,color:"#ff453a",bg:"rgba(255,69,58,0.12)",emoji:"ð´"},
  {level:4,color:"#bf5af2",bg:"rgba(191,90,242,0.12)",emoji:"ð¨"},
];
const getICDR=(lang)=>ICDR_META.map((m,i)=>({...m,...(I18N[lang]||I18N.fr).icdr[i]}));
// backward compat â default FR
const ICDR=getICDR("fr");

const SNELLEN=[
  {f:"1/10", size:52,row:"E F"},
  {f:"3/10", size:40,row:"F P Z"},
  {f:"5/10", size:30,row:"E D F C"},
  {f:"7/10", size:24,row:"P E C F D"},
  {f:"8/10", size:20,row:"L P E D"},
  {f:"9/10", size:17,row:"T O Z"},
  {f:"10/10",size:14,row:"E F P"},
];

const PARINAUD=[
  {p:"P14", label:"TrÃ¨s grands caractÃ¨res",  size:34, text:"Vision de loin."},
  {p:"P8",  label:"Grands caractÃ¨res",        size:24, text:"Consultez un ophtalmologue."},
  {p:"P6",  label:"CaractÃ¨res normaux",       size:19, text:"La glycÃ©mie doit rester bien Ã©quilibrÃ©e."},
  {p:"P4",  label:"Lecture standard",         size:15, text:"ContrÃ´le ophtalmologique annuel obligatoire."},
  {p:"P3",  label:"Texte courant fin",        size:12, text:"Le dÃ©pistage prÃ©coce permet de sauver la vision."},
  {p:"P2",  label:"Petits caractÃ¨res",        size:10, text:"La rÃ©tinopathie Ã©volue silencieusement sans symptÃ´mes."},
  {p:"P1.5",label:"TrÃ¨s petits caractÃ¨res",  size:8,  text:"Le fond de l'Åil est examinÃ© Ã  la lampe Ã  fente."},
];

const FAQ=[
  {keys:["retinopathie","rd","rÃ©tine"],a:"La rÃ©tinopathie diabÃ©tique est une complication du diabÃ¨te touchant les vaisseaux rÃ©tiniens. Elle Ã©volue silencieusement avant d'affecter la vision."},
  {keys:["icdr","score","niveau"],a:"L'ICDR classe la rÃ©tinopathie de 0 (absence) Ã  4 (forme prolifÃ©rante). Chaque stade nÃ©cessite un suivi adaptÃ©."},
  {keys:["traitement","laser","vegf","vitrectomie"],a:"Traitements selon le stade : laser pan-rÃ©tinien (PPR), injections anti-VEGF (Ranibizumab, Aflibercept), ou vitrectomie."},
  {keys:["glycemie","hba1c","sucre","diabete"],a:"Cible HbA1c < 7%. GlycÃ©mie Ã  jeun : 0,70â1,26 g/L. Post-prandiale < 1,60 g/L (HAS 2024)."},
  {keys:["depistage","frequence","fond"],a:"Fond d'Åil annuel obligatoire en cas de diabÃ¨te, mÃªme sans symptÃ´me. DÃ¨s le diagnostic pour le type 2, aprÃ¨s 5 ans pour le type 1."},
  {keys:["prevention","prevenir","proteger"],a:"ContrÃ´le glycÃ©mique strict (HbA1c < 7%), pression artÃ©rielle < 130/80 mmHg, arrÃªt du tabac, et suivi ophtalmologique annuel."},
  {keys:["donnees","securite","rgpd","confidentiel"],a:"Vos photos ne sont jamais stockÃ©es sur nos serveurs. Seules les mÃ©tadonnÃ©es anonymisÃ©es sont conservÃ©es avec votre consentement. RGPD Art. 9.2.j."},
  {keys:["salut","bonjour","bonsoir","hello"],a:"Bonjour ! Je suis l'assistant RetinaScore. Je peux rÃ©pondre Ã  vos questions sur la rÃ©tinopathie diabÃ©tique, la glycÃ©mie, l'acuitÃ© visuelle ou l'application."},
];

const DARK={isDark:true,bg:"transparent",bg2:"rgba(28,28,30,0.88)",bg3:"rgba(44,44,46,0.82)",bg4:"#3a3a3c",text:"#ffffff",text2:"rgba(235,235,245,0.85)",text3:"#8e8e93",text4:"#48484a",border:"rgba(255,255,255,0.08)",glass:"rgba(255,255,255,0.07)",glassBorder:"rgba(255,255,255,0.16)",glassHigh:"rgba(255,255,255,0.10)",glassShadow:"0 8px 32px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.14)",sf:"'SF Pro Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",sm:"'SF Pro Text',-apple-system,BlinkMacSystemFont,system-ui,sans-serif"};
const LIGHT={isDark:false,bg:"transparent",bg2:"rgba(255,255,255,0.55)",bg3:"rgba(242,242,247,0.50)",bg4:"#e5e5ea",text:"#000000",text2:"#1c1c1e",text3:"#636366",text4:"#aeaeb2",border:"rgba(0,0,0,0.07)",glass:"rgba(255,255,255,0.22)",glassBorder:"rgba(255,255,255,0.45)",glassHigh:"rgba(255,255,255,0.38)",glassShadow:"0 8px 32px rgba(0,0,0,0.08),inset 0 1px 0 rgba(255,255,255,0.55)",sf:"'SF Pro Display',-apple-system,BlinkMacSystemFont,system-ui,sans-serif",sm:"'SF Pro Text',-apple-system,BlinkMacSystemFont,system-ui,sans-serif"};

// ââ Ring SVG ââââââââââââââââââââââââââââââââââââââââââââââââââ
function Ring({size=130,sw=12,progress=0,color,delay=0}){
  const r=(size-sw)/2, circ=2*Math.PI*r;
  const [go,setGo]=useState(false);
  useEffect(()=>{const tid=setTimeout(()=>setGo(true),delay+80);return()=>clearTimeout(tid);},[delay]);
  const eff=progress>0?Math.max(0.05,Math.min(progress,1)):0;
  const offset=circ*(1-eff);
  return(
    <svg width={size} height={size} overflow="visible" style={{transform:"rotate(-90deg)",display:"block"}}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color+"28"} strokeWidth={sw}/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={sw}
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={go?offset:circ}
        style={{transition:`stroke-dashoffset 1.4s cubic-bezier(.4,0,.2,1) ${delay}ms`,filter:`drop-shadow(0 0 6px ${color}bb)`}}/>
    </svg>
  );
}

function TripleRings({rings,size=150}){
  const sw=11,gap=6;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0,overflow:"visible"}}>
      {rings.map((r,i)=>{
        const s=size-i*(sw+gap)*2, off=i*(sw+gap);
        return <div key={i} style={{position:"absolute",top:off,left:off,overflow:"visible"}}><Ring size={s} sw={sw} progress={r.prog} color={r.color} delay={i*200}/></div>;
      })}
    </div>
  );
}

// ââ Shared UI âââââââââââââââââââââââââââââââââââââââââââââââââ
function Card({children,style={},onClick}){
  const t=useTheme();
  return(
    <div onClick={onClick} style={{
      background:t.glass,
      backdropFilter:"blur(24px) saturate(1.8)",
      WebkitBackdropFilter:"blur(24px) saturate(1.8)",
      borderRadius:20,padding:"14px 16px",
      border:`1px solid ${t.glassBorder}`,
      boxShadow:t.glassShadow,
      cursor:onClick?"pointer":"default",...style
    }}>{children}</div>
  );
}

function SecTitle({children,mt=22}){
  const t=useTheme();
  return <div style={{color:t.text,fontSize:20,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4,marginTop:mt,marginBottom:10}}>{children}</div>;
}

function PrimaryBtn({label,onClick,color="#0a84ff",disabled=false,style={}}){
  const t=useTheme();
  return(
    <button onClick={onClick} disabled={disabled} style={{
      width:"100%",padding:"14px 0",borderRadius:14,border:"none",
      background:disabled?t.bg3:color,
      color:disabled?t.text4:"#fff",
      fontSize:16,fontWeight:700,fontFamily:t.sm,
      cursor:disabled?"not-allowed":"pointer",
      boxShadow:disabled?"none":`0 4px 18px ${color}44`,
      transition:"all .18s",...style
    }}>{label}</button>
  );
}

function FIn({label,value,onChange,placeholder,type="text",inputMode}){
  const t=useTheme();
  return(
    <div style={{marginBottom:10}}>
      {label&&<div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:5,fontFamily:t.sm}}>{label}</div>}
      <input value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} type={type} inputMode={inputMode}
        style={{width:"100%",background:t.bg3,border:`1px solid ${t.bg4}`,borderRadius:12,padding:"12px 14px",color:t.text,fontSize:15,fontFamily:t.sm,outline:"none"}}/>
    </div>
  );
}

function InfoBox({color,text,icon="ð¡"}){
  return(
    <div style={{background:color+"14",borderRadius:12,padding:"10px 13px",border:`1px solid ${color}28`,display:"flex",gap:8,alignItems:"flex-start",marginBottom:12}}>
      <span style={{fontSize:13,flexShrink:0,marginTop:1}}>{icon}</span>
      <div style={{color,fontSize:12,lineHeight:1.5}}>{text}</div>
    </div>
  );
}

function BackBtn({onBack,label="Retour"}){
  return(
    <button onClick={onBack} style={{background:"none",border:"none",color:"#0a84ff",fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0,marginBottom:14}}>
      <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth={2.5} strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>{label}
    </button>
  );
}

function Spark({values,color}){
  if(!values||values.length<2) return null;
  const w=56,h=28,mn=Math.min(...values)-.1,mx=Math.max(...values)+.1;
  const pts=values.map((v,i)=>`${2+(i/(values.length-1))*(w-4)},${h-2-((v-mn)/(mx-mn))*(h-4)}`).join(" ");
  return <svg width={w} height={h}><polyline points={pts} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/></svg>;
}


// ââ Tab Bar ââââââââââââââââââââââââââââââââââââââââââââââââââââ
function TabBar({tab,set}){
  const i=I18N[useLang()]||I18N.fr;
  const t=useTheme();
  const tColor={home:"#30d158",scan:"#0a84ff",history:"#ff9f0a",chat:"#ff9f0a",profile:"#8e8e93"};
  const tabs=[{id:"home",label:i.tab_home},{id:"scan",label:i.tab_scan},{id:"history",label:i.tab_history},{id:"chat",label:i.tab_chat},{id:"profile",label:i.tab_profile}];
  const icons={
    home:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 22V12h6v10"/></svg>,
    scan:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2"/><circle cx={12} cy={12} r={3}/></svg>,
    history:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><circle cx={12} cy={12} r={9}/><path d="M12 7v5l3 3"/></svg>,
    chat:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
    profile:<svg width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx={12} cy={7} r={4}/></svg>,
  };
  return(
    <div style={{
      position:"fixed",bottom:0,left:0,right:0,zIndex:999,
      background:t.isDark?"rgba(18,18,20,0.70)":"rgba(250,250,252,0.65)",
      backdropFilter:"blur(48px) saturate(2.4)",
      WebkitBackdropFilter:"blur(48px) saturate(2.4)",
      borderTop:`0.5px solid ${t.isDark?"rgba(255,255,255,0.12)":"rgba(0,0,0,0.07)"}`,
      boxShadow:t.isDark?"0 -1px 0 rgba(255,255,255,0.06)":"0 -1px 0 rgba(0,0,0,0.04)",
      paddingBottom:"env(safe-area-inset-bottom, 0px)",
    }}>
      <div style={{display:"flex",maxWidth:430,margin:"0 auto"}}>
        {tabs.map(tb=>{
          const active=tab===tb.id;
          const color=tColor[tb.id];
          return(
            <button key={tb.id} onClick={()=>set(tb.id)}
              style={{flex:1,border:"none",background:"transparent",cursor:"pointer",
                display:"flex",flexDirection:"column",alignItems:"center",gap:2,
                padding:"8px 0 10px",WebkitTapHighlightColor:"transparent",outline:"none",
              }}
            >
              <div style={{
                color:active?color:t.text4,
                display:"flex",alignItems:"center",justifyContent:"center",
                marginBottom:1,
                background:active?(t.isDark?color+"2a":color+"1e"):"transparent",
                borderRadius:14,padding:"5px 16px",
                transition:"background .22s, color .22s",
              }}>
                {icons[tb.id]}
              </div>
              <span style={{fontSize:10,fontFamily:t.sm,color:active?color:t.text4,fontWeight:active?600:400,transition:"color .22s"}}>{tb.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}


// ââ HOME ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function HomeScreen({user,scans,glycLogs,onNavigate,onGoGlyc,onGoVision,onGoRDV,onGoScan}){
  const t=useTheme();
  const lang=useLang(); const i=I18N[lang]||I18N.fr; const ICDR=getICDR(lang);
  const now=new Date();
  const h=now.getHours();
  const greet=h<12?i.greet_morning:h<18?i.greet_afternoon:i.greet_evening;
  const name=user?.name?.split(" ")[0]||null;
  const last=scans[0];
  const lastLevel=last?.icdr_level??null;
  const daysSince=last?Math.floor((Date.now()-new Date(last.date))/86400000):null;
  const rdvList=DB.get("rdvs",[]);
  const today=new Date().toISOString().slice(0,10);
  const nextRdv=rdvList.filter(r=>r.date>=today).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const daysUntilRdv=nextRdv?Math.ceil((new Date(nextRdv.date+"T12:00")-Date.now())/(86400000)):null;
  const daysUntilScan=daysSince!=null?Math.max(0,365-daysSince):null;
  const daysUntil=daysUntilRdv??daysUntilScan;
  const rdvProg=daysUntil!=null?Math.max(0,Math.min(1,1-daysUntil/365)):0;
  const todayKey=now.toISOString().slice(0,10);
  const todayG=glycLogs.filter(g=>g.date===todayKey);
  const avgG=todayG.length?todayG.reduce((a,g)=>a+g.value,0)/todayG.length:null;
  const lastVision=DB.get("last_vision",null);
  const rings=[
    {prog:rdvProg,color:"#ff375f",label:i.ring_rdv,value:daysUntil!=null?daysUntil+"j":"â",unit:nextRdv?nextRdv.type:i.ring_rdv_unit},
    {prog:avgG?Math.max(0,1-Math.abs(avgG-1.0)/0.8):0,color:"#30d158",label:i.ring_glyc,value:avgG?avgG.toFixed(2):"â",unit:i.ring_glyc_unit},
    {prog:lastVision?parseFloat(lastVision):0,color:"#0a84ff",label:i.ring_vision,value:lastVision||"â",unit:i.ring_vision_unit},
  ];
  const dateStr=now.toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long"});
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      {/* Header */}
      <div style={{paddingTop:56,paddingBottom:4}} className="fade-up">
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>{dateStr.charAt(0).toUpperCase()+dateStr.slice(1)}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:2}}>
          <div style={{color:t.text,fontSize:32,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>{greet}{name?", "+name:""}</div>
          <button onClick={()=>onNavigate("settings")} style={{width:36,height:36,borderRadius:"50%",background:t.bg2,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke={t.text3} strokeWidth={1.8} strokeLinecap="round">
              <circle cx={12} cy={12} r={3}/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </div>
      </div>
      {/* Activity rings card */}
      <Card style={{marginTop:14}} className="fade-up-1">
        <div style={{color:t.text,fontSize:15,fontWeight:600,fontFamily:t.sf,marginBottom:14}}>{i.health_title}</div>
        <div style={{display:"flex",gap:14,alignItems:"center"}}>
          <TripleRings rings={rings} size={148}/>
          <div style={{flex:1,display:"flex",flexDirection:"column",gap:13}}>
            {rings.map((r,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                <div style={{width:9,height:9,borderRadius:"50%",background:r.color,marginTop:4,flexShrink:0,boxShadow:`0 0 7px ${r.color}`}}/>
                <div>
                  <div style={{color:t.text3,fontSize:10,fontFamily:t.sm}}>{r.label}</div>
                  <div style={{color:r.color,fontSize:18,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4,lineHeight:1.1}}>{r.value}<span style={{fontSize:10,color:t.text4,fontWeight:400,marginLeft:3}}>{r.unit}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
      {/* Last scan result */}
      {lastLevel!=null&&(
        <div style={{background:ICDR[lastLevel].bg,borderRadius:18,padding:"14px 16px",marginTop:12,border:`1px solid ${ICDR[lastLevel].color}33`}} className="fade-up-2">
          <div style={{color:ICDR[lastLevel].color,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontFamily:t.sm,marginBottom:7}}>{i.last_retina}</div>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:8}}>
            <span style={{fontSize:32}}>{ICDR[lastLevel].emoji}</span>
            <div>
              <div style={{color:t.text,fontSize:18,fontWeight:700,fontFamily:t.sf}}>{ICDR[lastLevel].label}</div>
              <div style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{new Date(last.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
          </div>
          <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55}}>{ICDR[lastLevel].advice}</div>
          {lastLevel>=3&&<a href="https://www.doctolib.fr/ophtalmologue" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",width:"100%",marginTop:10,padding:"11px 0",borderRadius:12,border:"none",background:"#ff453a",color:"#fff",fontSize:14,fontWeight:700,fontFamily:t.sm,textAlign:"center"}}>{i.rdv_btn}</a>}
        </div>
      )}
      {/* Glycemia quick card */}
      <Card style={{marginTop:12}} onClick={onGoGlyc} className="fade-up-2">
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div>
            <div style={{color:"#30d158",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontFamily:t.sm,marginBottom:5}}>{i.glyc_today}</div>
            {avgG!=null
              ?<div style={{display:"flex",alignItems:"baseline",gap:6}}><span style={{color:t.text,fontSize:26,fontWeight:700,fontFamily:t.sf}}>{avgG.toFixed(2)}</span><span style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>g/L Â· {todayG.length} {todayG.length>1?i.measures:i.measure}</span></div>
              :<div style={{color:t.text3,fontSize:14,fontFamily:t.sm}}>{i.glyc_tap}</div>}
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            {todayG.length>=2&&<Spark values={todayG.map(g=>g.value)} color="#30d158"/>}
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke={t.text3} strokeWidth={2.5} strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
          </div>
        </div>
      </Card>
      {/* Quick stats grid */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginTop:12}} className="fade-up-3">
        {[["ð",i.stat_analyses,String(scans.length),i.stat_total,"#ff375f",onGoScan],["ð",i.stat_acuite,lastVision||"â","Snellen","#0a84ff",onGoVision],["ð",i.stat_mesures,String(glycLogs.length),i.stat_glycemie,"#30d158",onGoGlyc],["ð",i.stat_rdv,daysUntil!=null?daysUntil+"j":"â",i.stat_fo,"#ffd60a",onGoRDV]].map(([ico,lbl,val,sub,color,action])=>(
          <Card key={lbl} style={{padding:"12px 13px",cursor:action?"pointer":"default"}} onClick={action||undefined}>
            <div style={{fontSize:20,marginBottom:5}}>{ico}</div>
            <div style={{color:t.text3,fontSize:10,fontFamily:t.sm,marginBottom:1}}>{lbl}</div>
            <div style={{color:color,fontSize:22,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4}}>{val}</div>
            <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,marginTop:1}}>{sub}</div>
          </Card>
        ))}
      </div>
      {!user&&<Card style={{marginTop:12,display:"flex",alignItems:"center",gap:12}}>
        <span style={{fontSize:22}}>ð¤</span>
        <div style={{flex:1}}><div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{i.guest_mode}</div><div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{i.guest_desc}</div></div>
        <button onClick={()=>onNavigate("auth")} style={{background:"#0a84ff",border:"none",borderRadius:10,padding:"7px 12px",color:"#fff",fontSize:12,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>{i.guest_btn}</button>
      </Card>}
    </div>
  );
}


// ââ GLYCEMIA ââââââââââââââââââââââââââââââââââââââââââââââââââ
function GlycChart({data}){
  const svgW=300,h=100;
  const vals=data.map(d=>d.avg);
  const mn=Math.min(...vals,.6),mx=Math.max(...vals,1.8);
  const pts=data.map((d,i)=>({x:6+(i/Math.max(data.length-1,1))*(svgW-12),y:6+((mx-d.avg)/(mx-mn+.001))*(h-12)}));
  const pathD=pts.map((p,i)=>`${i===0?"M":"L"}${p.x},${p.y}`).join(" ");
  const areaD=pathD+` L${pts[pts.length-1].x},${h} L${pts[0].x},${h} Z`;
  const tY1=6+((mx-1.26)/(mx-mn+.001))*(h-12);
  const tY2=6+((mx-.7)/(mx-mn+.001))*(h-12);
  return(
    <svg viewBox={`0 0 ${svgW} ${h}`} style={{width:"100%",height:h}}>
      <defs><linearGradient id="gg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#30d158" stopOpacity=".3"/><stop offset="100%" stopColor="#30d158" stopOpacity="0"/></linearGradient></defs>
      <rect x={0} y={tY1} width={svgW} height={tY2-tY1} fill="rgba(52,199,89,.07)" rx={2}/>
      <path d={areaD} fill="url(#gg)"/><path d={pathD} fill="none" stroke="#30d158" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={3} fill="#30d158"/>)}
    </svg>
  );
}

function GlycRow({g,color,t,showDate=false}){
  return(
    <div style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11}}>
      <div style={{width:36,height:36,borderRadius:10,background:color+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
        <div style={{width:10,height:10,borderRadius:"50%",background:color,boxShadow:`0 0 6px ${color}`}}/>
      </div>
      <div style={{flex:1}}>
        <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{g.moment==="Couche"?"CouchÃ©":g.moment}{showDate&&<span style={{color:t.text4,fontWeight:400,fontSize:12}}> Â· {g.date}</span>}</div>
        {g.note&&<div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:1}}>{g.note}</div>}
      </div>
      <div><span style={{color,fontSize:18,fontWeight:700,fontFamily:t.sf}}>{g.value.toFixed(2)}</span><span style={{color:t.text4,fontSize:11}}> g/L</span></div>
    </div>
  );
}

function GlycemiaScreen({glycLogs,onSave,onBack,lang="fr"}){
  const t=useTheme();
  const [view,setView]=useState("chart");
  const [form,setForm]=useState({moment:"Matin",value:"",note:"",date:new Date().toISOString().slice(0,10)});
  const [err,setErr]=useState("");
  const TARGETS={Matin:[.7,1.26],Midi:[.7,1.6],Soir:[.7,1.6],Couche:[.7,1.4],Autre:[.7,1.6]};
  const getColor=(val,mom)=>{const [lo,hi]=TARGETS[mom]||TARGETS.Autre;if(val<lo||val>hi) return"#ff453a";if(val>hi*.9) return"#ff9f0a";return"#30d158";};
  const handleAdd=()=>{
    const v=parseFloat(form.value.replace(",","."));
    if(isNaN(v)||v<.5||v>4){setErr("Valeur entre 0.5 et 4.0 g/L");return;}
    const isToday=form.date===new Date().toISOString().slice(0,10);
    const time=isToday?new Date().toLocaleTimeString("fr-FR",{hour:"2-digit",minute:"2-digit"}):"â";
    onSave({id:Date.now().toString(),date:form.date,time,moment:form.moment,value:v,note:form.note});
    setForm(f=>({...f,value:"",note:"",date:new Date().toISOString().slice(0,10)}));setErr("");setView("chart");
  };
  const dates=[...new Set(glycLogs.map(g=>g.date))].sort().slice(-14);
  const chartData=dates.map(d=>{const dl=glycLogs.filter(g=>g.date===d);return{date:d,avg:dl.reduce((a,g)=>a+g.value,0)/dl.length};});
  const todayStr=new Date().toISOString().slice(0,10);
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56}}>
        <BackBtn onBack={onBack} label="RÃ©sumÃ©"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
          <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>GlycÃ©mie</div>
          <button onClick={()=>setView(view==="add"?"chart":"add")} style={{background:view==="add"?t.bg3:"#0a84ff",border:"none",borderRadius:20,padding:"7px 15px",color:view==="add"?t.text3:"#fff",fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>{view==="add"?"Annuler":"+ Ajouter"}</button>
        </div>
        {view!=="add"&&<div style={{display:"flex",background:t.bg2,borderRadius:12,padding:3,marginBottom:14,border:`1px solid ${t.border}`}}>
          {[["chart","Courbe"],["table","Tableau"]].map(([v,l])=>(
            <button key={v} onClick={()=>setView(v)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:view===v?t.bg4:"transparent",color:view===v?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
          ))}
        </div>}
      </div>
      {view==="add"&&<Card className="fade-up">
        <div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:12}}>Nouvelle mesure</div>
        <div style={{marginBottom:12}}>
          <div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontFamily:t.sm}}>Moment</div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
            {["Matin","Midi","Soir","Couche","Autre"].map(m=>(
              <button key={m} onClick={()=>setForm(f=>({...f,moment:m}))} style={{padding:"6px 13px",borderRadius:20,border:"none",cursor:"pointer",fontFamily:t.sm,fontSize:13,fontWeight:600,background:form.moment===m?"#0a84ff":t.bg3,color:form.moment===m?"#fff":t.text3,transition:"all .18s"}}>{m==="Couche"?"CouchÃ©":m}</button>
            ))}
          </div>
        </div>
        <FIn label="GlycÃ©mie (g/L)" value={form.value} onChange={v=>setForm(f=>({...f,value:v}))} placeholder="ex: 1.10" inputMode="decimal"/>
        <FIn label="Date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
        <FIn label="Note (optionnel)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))} placeholder="ex: aprÃ¨s repas lÃ©ger"/>
        <InfoBox color="#0a84ff" text={form.moment==="Matin"?"Cible Ã  jeun : 0.70â1.26 g/L (HAS 2024)":"Cible post-prandiale : 0.70â1.60 g/L (HAS 2024)"} icon="ð¯"/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,marginBottom:10}}>{err}</div>}
        <PrimaryBtn label="Enregistrer" onClick={handleAdd}/>
      </Card>}
      {view==="chart"&&<div className="fade-up">
        {chartData.length===0
          ?<Card style={{textAlign:"center",padding:44}}><div style={{fontSize:40,marginBottom:12}}>ð</div><div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:6}}>Aucune mesure</div><div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Appuyez sur + Ajouter.</div></Card>
          :<>
            <Card style={{marginBottom:12}}>
              <div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sf,marginBottom:12}}>14 derniers jours</div>
              <GlycChart data={chartData}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
                {[chartData[0],chartData[chartData.length-1]].map((d,i)=><span key={i} style={{color:t.text4,fontSize:10,fontFamily:t.sm}}>{new Date(d.date+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short"})}</span>)}
              </div>
            </Card>
            <SecTitle mt={0}>Aujourd'hui</SecTitle>
            {glycLogs.filter(g=>g.date===todayStr).length===0
              ?<div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Aucune mesure aujourd'hui.</div>
              :glycLogs.filter(g=>g.date===todayStr).map(g=><GlycRow key={g.id} g={g} color={getColor(g.value,g.moment)} t={t}/>)
            }
          </>
        }
      </div>}
      {view==="table"&&<div className="fade-up">
        {glycLogs.length===0
          ?<Card style={{textAlign:"center",padding:44}}><div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Aucune mesure.</div></Card>
          :[...glycLogs].reverse().map(g=><GlycRow key={g.id} g={g} color={getColor(g.value,g.moment)} t={t} showDate/>)
        }
      </div>}
      <InfoBox color="#ff9f0a" text="Ne modifiez jamais votre traitement sans avis mÃ©dical. Valeurs indicatives." icon="â ï¸"/>
    </div>
  );
}


// ââ SCAN ââââââââââââââââââââââââââââââââââââââââââââââââââââââ
function ScanScreen({user,onDone}){
  const t=useTheme(); const lang=useLang(); const i=I18N[lang]||I18N.fr; const ICDR=getICDR(lang);
  const [step,setStep]=useState("pick");
  const [img,setImg]=useState(null);
  const [b64,setB64]=useState(null);
  const [res,setRes]=useState(null);
  const [err,setErr]=useState("");
  const [elapsed,setElapsed]=useState(null);
  const fileRef=useRef();
  const camRef=useRef();
  const load=f=>{
    if(!f) return;
    const r=new FileReader();
    r.onload=e=>{setImg(e.target.result);setB64(e.target.result.split(",")[1]);setStep("preview");};
    r.readAsDataURL(f);
  };
  const getBase=()=>"";
  const analyzeLocal=async()=>{
    const resp=await fetch(`${getBase()}/analyze`,{
      method:"POST",headers:{"Content-Type":"application/json"},
      body:JSON.stringify({image:b64}),
      signal:AbortSignal.timeout(12000),
    });
    if(!resp.ok) throw new Error("backend_error");
    return await resp.json();
  };
  const analyze=async()=>{
    setStep("analyzing");setErr("");const t0=Date.now();
    try{
      const parsed=await analyzeLocal();
      setElapsed(((Date.now()-t0)/1000).toFixed(1));
      setRes(parsed);setStep("result");
    }catch(e){
      setErr(i.scan_error);
      setStep("preview");
    }
  };
  const save=()=>{
    const scan={id:Date.now().toString(),icdr_level:res.icdr_level,findings:res.findings||[],confidence:res.confidence,notes:res.notes,image:img,date:new Date().toISOString(),elapsed};
    if(user?.consentGiven){const all=DB.get("global_scans",[]);all.push({...scan,image:null});DB.set("global_scans",all);}
    onDone(scan);
  };
  const cur={pick:0,preview:0,analyzing:1,result:2}[step]||0;
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:16}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>{i.scan_title}</div>
        <div style={{color:t.text3,fontSize:14,fontFamily:t.sm,marginTop:3}}>{i.scan_subtitle}</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:22}}>
        {[i.scan_step1,i.scan_step2,i.scan_step3].map((s,si)=>(
          <div key={s} style={{flex:1}}>
            <div style={{height:3,borderRadius:2,background:si<cur?"#30d158":si===cur?"#0a84ff":t.bg3,marginBottom:4,transition:"all .3s"}}/>
            <div style={{color:si<cur?"#30d158":si===cur?"#0a84ff":t.text4,fontSize:10,fontWeight:600,fontFamily:t.sm,textAlign:"center"}}>{s}</div>
          </div>
        ))}
      </div>
      {step==="pick"&&<div className="fade-up">
        <div style={{background:t.bg2,borderRadius:20,padding:"38px 18px",textAlign:"center",border:`2px dashed ${t.bg4}`,marginBottom:14}}>
          <div style={{fontSize:48,marginBottom:10}}>ðï¸</div>
          <div style={{color:t.text,fontSize:17,fontWeight:600,fontFamily:t.sf,marginBottom:5}}>{i.scan_photo_title}</div>
          <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,lineHeight:1.6}}>{i.scan_photo_desc}</div>
        </div>
        <input ref={fileRef} type="file" accept="image/*" onChange={e=>load(e.target.files[0])} style={{display:"none"}}/>
        <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={e=>load(e.target.files[0])} style={{display:"none"}}/>
        <div style={{display:"flex",gap:10,marginBottom:12}}>
          <button onClick={()=>fileRef.current.click()} style={{flex:1,padding:"13px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>{i.scan_gallery}</button>
          <button onClick={()=>camRef.current.click()} style={{flex:1,padding:"13px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:7}}>{i.scan_camera}</button>
        </div>
        <InfoBox color="#0a84ff" text={i.scan_info}/>
      </div>}
      {step==="preview"&&<div className="fade-up">
        <img src={img} alt="" style={{width:"100%",borderRadius:18,objectFit:"contain",maxHeight:280,background:"#111",display:"block",marginBottom:12}}/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,background:"rgba(255,69,58,.1)",borderRadius:10,padding:"10px 13px",marginBottom:10}}>{err}</div>}
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>{setImg(null);setB64(null);setStep("pick");setErr("");}} style={{flex:1,padding:"13px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer"}}>{i.scan_change}</button>
          <button onClick={analyze} style={{flex:2,padding:"13px 0",borderRadius:13,border:"none",background:"#0a84ff",color:"#fff",fontFamily:t.sm,fontSize:15,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 14px rgba(10,132,255,.35)"}}>{i.scan_analyze}</button>
        </div>
      </div>}
      {step==="analyzing"&&<div style={{display:"flex",flexDirection:"column",alignItems:"center",paddingTop:50,gap:20}} className="fade-up">
        {img&&<img src={img} alt="" style={{width:100,height:100,borderRadius:20,objectFit:"cover",background:"#111",opacity:.4}}/>}
        <div style={{position:"relative",width:50,height:50}}>
          <div style={{width:50,height:50,borderRadius:"50%",border:`3px solid ${t.bg3}`}}/>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",border:"3px solid transparent",borderTopColor:"#0a84ff",animation:"spin 1s linear infinite"}}/>
        </div>
        <div style={{color:t.text,fontSize:17,fontWeight:600,fontFamily:t.sf}}>{i.scan_analyzing}</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>{i.scan_ai}</div>
      </div>}
      {step==="result"&&res&&(()=>{
        const info=ICDR[Math.min(Math.max(res.icdr_level,0),4)];
        return(
          <div className="fade-up">
            {img&&<img src={img} alt="" style={{width:"100%",borderRadius:18,objectFit:"contain",maxHeight:200,background:"#111",display:"block",marginBottom:12}}/>}
            <div style={{background:info.bg,borderRadius:20,padding:"16px",border:`1px solid ${info.color}44`,marginBottom:12}}>
              <div style={{color:info.color,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,fontFamily:t.sm,marginBottom:7}}>{i.scan_result_title}</div>
              <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:9}}>
                <span style={{fontSize:38}}>{info.emoji}</span>
                <div>
                  <div style={{color:t.text,fontSize:19,fontWeight:700,fontFamily:t.sf}}>{info.label}</div>
                  <div style={{color:info.color,fontSize:12,fontFamily:t.sm}}>{i.scan_level} {res.icdr_level}/4 Â· {i.scan_confidence} {res.confidence}%</div>
                </div>
              </div>
              <div style={{display:"flex",gap:3,marginBottom:10}}>{ICDR.map((_,i)=><div key={i} style={{flex:1,height:4,borderRadius:2,background:i<=res.icdr_level?info.color:t.bg4}}/>)}</div>
              <div style={{background:t.isDark?"rgba(0,0,0,.28)":"rgba(255,255,255,.6)",borderRadius:11,padding:"11px 13px"}}>
                <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55}}>{info.advice}</div>
              </div>
            </div>
            {res.findings&&res.findings.length>0&&<Card style={{marginBottom:12}}>
              <div style={{color:t.text3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:9,fontFamily:t.sm}}>{i.scan_findings}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{res.findings.map((f,i)=><span key={i} style={{background:t.bg3,color:t.text2,borderRadius:20,padding:"4px 11px",fontSize:12,fontFamily:t.sm}}>{f}</span>)}</div>
            </Card>}
            {res.icdr_level>=3&&<div style={{background:"rgba(255,69,58,.1)",borderRadius:13,padding:"12px 13px",border:"1px solid rgba(255,69,58,.25)",marginBottom:12}}>
              <div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,lineHeight:1.5,marginBottom:9}}>{i.scan_urgent}</div>
              <a href="https://www.doctolib.fr/ophtalmologue" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",width:"100%",padding:"11px 0",borderRadius:11,background:"#ff453a",color:"#fff",fontSize:14,fontWeight:700,fontFamily:t.sm,textAlign:"center"}}>{i.scan_doctolib}</a>
            </div>}
            <div style={{color:t.text4,fontSize:11,fontFamily:t.sm,textAlign:"center",marginBottom:11}}>{i.scan_footer(elapsed)}</div>
            <PrimaryBtn label={i.scan_save} onClick={save} color="#30d158"/>
          </div>
        );
      })()}
    </div>
  );
}


// ââ HISTORY âââââââââââââââââââââââââââââââââââââââââââââââââââ
function HistoryScreen({scans,glycLogs,onScanDetail}){
  const t=useTheme(); const lang=useLang(); const i=I18N[lang]||I18N.fr; const ICDR=getICDR(lang);
  const [filter,setFilter]=useState("all");
  const visionLogs=DB.get("vision_history",[]);
  const all=[
    ...scans.map(s=>({...s,_k:"retina"})),
    ...glycLogs.map(g=>({...g,_k:"glyc",date:g.date+"T"+(g.time||"00:00")})),
    ...visionLogs.map(v=>({...v,_k:"vision"})),
  ].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const shown=filter==="all"?all:all.filter(i=>i._k===filter);
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:4}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>{i.hist_title}</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,marginTop:2,marginBottom:14}}>{i.hist_entries(all.length)}</div>
      </div>
      <div style={{display:"flex",background:t.bg2,borderRadius:12,padding:3,marginBottom:14,border:`1px solid ${t.border}`}}>
        {[["all",i.hist_all],["retina",i.hist_retina],["glyc",i.hist_glyc],["vision",i.hist_vision]].map(([v,l])=>(
          <button key={v} onClick={()=>setFilter(v)} style={{flex:1,padding:"8px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:12,fontWeight:600,background:filter===v?t.bg4:"transparent",color:filter===v?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
        ))}
      </div>
      {shown.length===0
        ?<Card style={{textAlign:"center",padding:44}}><div style={{fontSize:40,marginBottom:12}}>ð</div><div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:6}}>{i.hist_empty_title}</div><div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>{i.hist_empty_desc}</div></Card>
        :shown.map(item=>{
          if(item._k==="retina"){
            const info=ICDR[Math.min(Math.max(item.icdr_level,0),4)];
            return(
              <div key={item.id} onClick={()=>onScanDetail(item)} style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11,cursor:"pointer"}}>
                {item.image
                  ?<img src={item.image} alt="" style={{width:44,height:44,borderRadius:11,objectFit:"cover",background:"#111",flexShrink:0}}/>
                  :<div style={{width:44,height:44,borderRadius:11,background:info.bg,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:20}}>{info.emoji}</div>}
                <div style={{flex:1,minWidth:0}}>
                  <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{info.label}</div>
                  <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{new Date(item.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}</div>
                </div>
                <div style={{background:info.bg,borderRadius:20,padding:"3px 10px",border:`1px solid ${info.color}33`,flexShrink:0}}>
                  <span style={{color:info.color,fontSize:11,fontWeight:700,fontFamily:t.sm}}>N{item.icdr_level}</span>
                </div>
              </div>
            );
          }
          if(item._k==="vision"){
            const col=item.best&&parseFloat(item.best)>=0.8?"#30d158":item.best&&parseFloat(item.best)>=0.5?"#ffd60a":"#ff453a";
            return(
              <div key={item.id} style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11}}>
                <div style={{width:44,height:44,borderRadius:11,background:"rgba(10,132,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>ð</div>
                <div style={{flex:1}}>
                  <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{item.testType==="snellen"?i.hist_snellen:i.hist_parinaud}</div>
                  <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{new Date(item.date).toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})} Â· OD {item.OD} Â· OG {item.OG}</div>
                </div>
                {item.best&&<div><span style={{color:col,fontSize:17,fontWeight:700,fontFamily:t.sf}}>{item.best}</span><span style={{color:t.text4,fontSize:11}}>/10</span></div>}
              </div>
            );
          }
          const col=item.value>=.7&&item.value<=1.6?"#30d158":"#ff453a";
          return(
            <div key={item.id} style={{background:t.bg2,borderRadius:14,padding:"11px 13px",marginBottom:8,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11}}>
              <div style={{width:44,height:44,borderRadius:11,background:col+"18",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,fontSize:18}}>ð</div>
              <div style={{flex:1}}>
                <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>GlycÃ©mie {item.moment==="Couche"?"CouchÃ©":item.moment}</div>
                <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{item.date?.slice(0,10)} Â· {item.time}</div>
              </div>
              <div><span style={{color:col,fontSize:17,fontWeight:700,fontFamily:t.sf}}>{typeof item.value==="number"?item.value.toFixed(2):"â"}</span><span style={{color:t.text4,fontSize:11}}> g/L</span></div>
            </div>
          );
        })
      }
      <GlycemiaRiskScore glycLogs={glycLogs} lang={lang}/>
    </div>
  );
}

// ââ VISION ââââââââââââââââââââââââââââââââââââââââââââââââââââ

function GlycemiaRiskScore({glycLogs,lang}){
  const t=useTheme();
  const [result,setResult]=useState(null);
  const [loading,setLoading]=useState(false);
  const [err,setErr]=useState("");
  const [open,setOpen]=useState(false);

  const API="https://retineye-api.up.railway.app";

  const LABELS={
    fr:{title:"Score de risque ophtalmologique",btn:"Calculer mon score",computing:"Calcul en cours...",
      low:"Faible",moderate:"Modéré",high:"Élevé",
      reco:"Recommandation",why:"Pourquoi ce score ?",
      disclaimer:"Outil de sensibilisation uniquement — ne remplace pas un ophtalmologiste.",
      nodata:"Ajoutez au moins 3 mesures de glycémie pour calculer le score.",
      err:"Erreur serveur — vérifiez votre connexion.",recalc:"↩ Recalculer"},
    en:{title:"Ophthalmic risk score",btn:"Calculate my score",computing:"Calculating...",
      low:"Low",moderate:"Moderate",high:"High",
      reco:"Recommendation",why:"Why this score?",
      disclaimer:"Awareness tool only — does not replace an ophthalmologist.",
      nodata:"Add at least 3 blood glucose readings to calculate the score.",
      err:"Server error — check your connection.",recalc:"↩ Recalculate"},
    de:{title:"Ophthalmisches Risiko-Score",btn:"Meinen Score berechnen",computing:"Berechnung...",
      low:"Gering",moderate:"Mäßig",high:"Hoch",
      reco:"Empfehlung",why:"Warum dieser Score?",
      disclaimer:"Nur Sensibilisierungstool — ersetzt keinen Augenarzt.",
      nodata:"Fügen Sie mindestens 3 Blutzuckermessungen hinzu.",
      err:"Serverfehler — Verbindung prüfen.",recalc:"↩ Neu berechnen"},
    ro:{title:"Scor de risc oftalmologic",btn:"Calculează scorul meu",computing:"Se calculează...",
      low:"Scăzut",moderate:"Moderat",high:"Ridicat",
      reco:"Recomandare",why:"De ce acest scor?",
      disclaimer:"Instrument de sensibilizare — nu înlocuiește un oftalmolog.",
      nodata:"Adăugați cel puțin 3 măsurători de glicemie.",
      err:"Eroare server — verificați conexiunea.",recalc:"↩ Recalculează"},
  };
  const L=LABELS[lang]||LABELS.fr;

  const getRiskColor=lvl=>lvl==="faible"||lvl==="low"||lvl==="Gering"||lvl==="Scăzut"?"#30d158":lvl==="modéré"||lvl==="moderate"||lvl==="Mäßig"||lvl==="Moderat"?"#ff9f0a":"#ff453a";

  const compute=async()=>{
    if(glycLogs.length<3){setErr(L.nodata);return;}
    setLoading(true);setErr("");
    try{
      const entries=glycLogs.map(g=>({value:g.value,timestamp:new Date(g.date+"T12:00:00").getTime(),unit:"g/L"}));
      const r=await fetch(API+"/glycemia-risk",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({glucose_entries:entries,hba1c_entries:[],diabetes_type:"DT2"})
      });
      if(!r.ok) throw new Error("HTTP "+r.status);
      const d=await r.json();
      setResult(d);
    }catch(e){setErr(L.err);}
    finally{setLoading(false);}
  };

  const scoreColor=result?getRiskColor(result.risk_level):"#636366";

  return(
    <div style={{marginTop:20,borderRadius:16,overflow:"hidden",border:"1px solid "+t.sep}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"14px 16px",background:t.bg2,border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"space-between",fontFamily:t.sf}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>🔬</span>
          <span style={{color:t.text,fontSize:15,fontWeight:600}}>{L.title}</span>
        </div>
        <span style={{color:t.text3,fontSize:18,transform:open?"rotate(180deg)":"none",transition:"0.2s"}}>{open?"▲":"▼"}</span>
      </button>
      {open&&(
        <div style={{padding:"16px",background:t.bg2,borderTop:"1px solid "+t.sep}}>
          {!result&&(
            <>
              {err&&<div style={{padding:"10px 14px",borderRadius:10,background:"#ff453a22",color:"#ff453a",fontSize:13,marginBottom:12}}>{err}</div>}
              <button onClick={compute} disabled={loading} style={{width:"100%",padding:"12px",background:loading?"#636366":"#0a84ff",border:"none",borderRadius:12,color:"#fff",fontSize:15,fontWeight:600,fontFamily:t.sf,cursor:loading?"not-allowed":"pointer"}}>
                {loading?"⏳ "+L.computing:"🧮 "+L.btn}
              </button>
            </>
          )}
          {result&&(
            <div>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
                <div>
                  <div style={{color:t.text3,fontSize:12,marginBottom:6}}>{L.title}</div>
                  <div style={{display:"inline-flex",alignItems:"center",gap:6,background:scoreColor,color:"#fff",borderRadius:99,padding:"5px 14px",fontWeight:700,fontSize:14}}>
                    {result.risk_level==="faible"||result.risk_level==="low"?L.low:result.risk_level==="modéré"||result.risk_level==="moderate"?L.moderate:L.high}
                  </div>
                </div>
                <div style={{textAlign:"center",background:t.bg3,borderRadius:14,padding:"10px 16px",minWidth:70}}>
                  <div style={{color:scoreColor,fontSize:28,fontWeight:700,lineHeight:1}}>{result.score}</div>
                  <div style={{color:t.text3,fontSize:10}}>/100</div>
                </div>
              </div>
              <div style={{height:6,borderRadius:3,background:t.sep,marginBottom:14,overflow:"hidden"}}>
                <div style={{height:"100%",width:result.score+"%",background:scoreColor,borderRadius:3,transition:"width 0.8s ease"}}/>
              </div>
              <div style={{background:t.bg3,borderRadius:12,padding:"12px 14px",marginBottom:10}}>
                <div style={{color:t.text3,fontSize:11,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>📋 {L.reco}</div>
                <div style={{color:t.text,fontSize:13,lineHeight:1.5}}>{result.recommendation}</div>
              </div>
              <div style={{background:t.bg3,borderRadius:12,padding:"12px 14px",marginBottom:12}}>
                <div style={{color:t.text3,fontSize:11,fontWeight:600,marginBottom:6,textTransform:"uppercase",letterSpacing:.5}}>💡 {L.why}</div>
                <div style={{color:t.text,fontSize:13,lineHeight:1.5}}>{result.explanation}</div>
              </div>
              <button onClick={()=>setResult(null)} style={{width:"100%",padding:"9px",background:"transparent",border:"1px solid "+t.sep,borderRadius:10,color:t.text3,fontSize:13,cursor:"pointer",fontFamily:t.sf}}>{L.recalc}</button>
              <div style={{marginTop:10,fontSize:11,color:t.text3,textAlign:"center",lineHeight:1.4}}>⚕️ {L.disclaimer}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VisionScreen({onBack}){
  const t=useTheme();
  const [testType,setTestType]=useState("snellen");
  const [phase,setPhase]=useState("intro");
  const [line,setLine]=useState(0);
  const [eye,setEye]=useState("OD");
  const [done,setDone]=useState({OD:null,OG:null});
  const SCALE=testType==="snellen"?SNELLEN:PARINAUD;
  const getLabel=item=>testType==="snellen"?item.f:item.p;
  const ac=v=>{
    if(!v||v==="<1/10"||v==="<P14") return"#ff453a";
    if(testType==="snellen"){const n=parseFloat(v);if(n>=.8)return"#30d158";if(n>=.5)return"#ffd60a";if(n>=.3)return"#ff9f0a";return"#ff453a";}
    const idx=PARINAUD.findIndex(p=>p.p===v);if(idx>=5)return"#30d158";if(idx>=3)return"#ffd60a";if(idx>=1)return"#ff9f0a";return"#ff453a";
  };
  const answer=ok=>{
    if(ok){
      if(line<SCALE.length-1){setLine(l=>l+1);}
      else{const res=getLabel(SCALE[line]);const nd={...done,[eye]:res};setDone(nd);nextEyeOrResult(nd);}
    }else{
      const res=line>0?getLabel(SCALE[line-1]):(testType==="snellen"?"<1/10":"<P14");
      const nd={...done,[eye]:res};setDone(nd);nextEyeOrResult(nd);
    }
  };
  const nextEyeOrResult=(nd)=>{
    if(eye==="OD"){setEye("OG");setLine(0);}
    else{
      if(testType==="snellen"){
        const best=Math.max(parseFloat(nd.OD)||0,parseFloat(nd.OG)||0);
        DB.set("last_vision",String(best));
        const hist=DB.get("vision_history",[]);
        DB.set("vision_history",[{id:Date.now().toString(),date:new Date().toISOString(),testType,OD:nd.OD,OG:nd.OG,best:String(best)},...hist].slice(0,50));
      } else {
        const hist=DB.get("vision_history",[]);
        DB.set("vision_history",[{id:Date.now().toString(),date:new Date().toISOString(),testType,OD:nd.OD,OG:nd.OG,best:null},...hist].slice(0,50));
      }
      setPhase("result");
    }
  };
  const reset=()=>{setPhase("intro");setLine(0);setEye("OD");setDone({OD:null,OG:null});};
  const switchTest=(type)=>{setTestType(type);reset();};
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:14}}>
        {onBack&&<BackBtn onBack={onBack} label="RÃ©sumÃ©"/>}
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>AcuitÃ© visuelle</div>
        <div style={{color:t.text3,fontSize:14,fontFamily:t.sm,marginTop:3}}>Snellen (loin) Â· Parinaud (prÃ¨s)</div>
      </div>
      <div style={{display:"flex",background:t.bg2,borderRadius:12,padding:3,marginBottom:16,border:`1px solid ${t.border}`}}>
        {[["snellen","ðï¸ Snellen"],["parinaud","ð Parinaud"]].map(([v,l])=>(
          <button key={v} onClick={()=>switchTest(v)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontSize:13,fontWeight:600,background:testType===v?t.bg4:"transparent",color:testType===v?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
        ))}
      </div>
      {phase==="intro"&&<div className="fade-up">
        <Card style={{marginBottom:14}}>
          <div style={{fontSize:30,textAlign:"center",marginBottom:12}}>{testType==="snellen"?"ð":"ð"}</div>
          {(testType==="snellen"
            ?["Ãcran Ã  40 cm (longueur d'un bras).","Couvrez complÃ¨tement un Åil.","Lisez la derniÃ¨re ligne visible nettement.","Ne plissez pas les yeux."]
            :["Tenez l'Ã©cran Ã  30â35 cm des yeux.","Couvrez complÃ¨tement un Åil.","Lisez le texte aussi petit que possible.","ArrÃªtez-vous quand c'est flou."]
          ).map((txt,i)=>(
            <div key={i} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}>
              <div style={{minWidth:20,height:20,borderRadius:"50%",background:"#0a84ff",display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
              <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.5}}>{txt}</div>
            </div>
          ))}
        </Card>
        <InfoBox color="#ffd60a" text="Test indicatif sur Ã©cran. Ne remplace pas un examen ophtalmologique officiel." icon="â ï¸"/>
        <PrimaryBtn label="DÃ©marrer le test" onClick={()=>setPhase("test")}/>
      </div>}
      {phase==="test"&&<div className="fade-up">
        <div style={{display:"flex",gap:8,marginBottom:14}}>
          {[["OD","Åil droit"],["OG","Åil gauche"]].map(([e,l])=>(
            <div key={e} style={{flex:1,background:eye===e?"rgba(10,132,255,.1)":t.bg2,borderRadius:13,padding:"9px 0",textAlign:"center",border:`1px solid ${eye===e?"#0a84ff44":t.border}`}}>
              <div style={{color:eye===e?"#0a84ff":t.text3,fontSize:11,fontWeight:700,fontFamily:t.sm}}>{done[e]?"â ":eye===e?"â¶ ":""}{l}</div>
              {done[e]&&<div style={{color:ac(done[e]),fontSize:13,fontWeight:700,fontFamily:t.sm}}>{done[e]}</div>}
            </div>
          ))}
        </div>
        <Card style={{textAlign:"center",marginBottom:14,padding:"22px 14px"}}>
          <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,marginBottom:8}}>Ligne {line+1}/{SCALE.length} Â· Cible {getLabel(SCALE[line])}</div>
          {testType==="snellen"
            ?<div style={{color:t.text,fontFamily:"'Courier New',monospace",fontWeight:900,letterSpacing:Math.max(4,14-line*2),userSelect:"none",margin:"12px 0 6px",fontSize:SNELLEN[line].size,lineHeight:1.2}}>{SNELLEN[line].row}</div>
            :<div style={{color:t.text,fontFamily:t.sm,userSelect:"none",margin:"14px 8px 8px",fontSize:PARINAUD[line].size,lineHeight:1.5,fontWeight:500,textAlign:"left"}}>{PARINAUD[line].text}</div>
          }
          <div style={{color:t.text4,fontSize:10,fontFamily:t.sm}}>Distance : {testType==="snellen"?"40 cm":"30â35 cm"}</div>
        </Card>
        <div style={{display:"flex",gap:10}}>
          <button onClick={()=>answer(false)} style={{flex:1,padding:13,borderRadius:13,border:"1px solid rgba(255,69,58,.25)",background:"rgba(255,69,58,.08)",color:"#ff453a",fontFamily:t.sm,fontSize:14,fontWeight:600,cursor:"pointer"}}>ðµ Flou</button>
          <button onClick={()=>answer(true)} style={{flex:1,padding:13,borderRadius:13,border:"none",background:"#30d158",color:"#fff",fontFamily:t.sm,fontSize:14,fontWeight:600,cursor:"pointer",boxShadow:"0 3px 12px rgba(52,199,89,.3)"}}>â Je lis</button>
        </div>
      </div>}
      {phase==="result"&&<div className="fade-up">
        <Card style={{textAlign:"center",padding:26,marginBottom:14}}>
          <div style={{fontSize:34,marginBottom:10}}>ð</div>
          <div style={{color:t.text,fontSize:20,fontWeight:700,fontFamily:t.sf,marginBottom:4}}>RÃ©sultats {testType==="snellen"?"Snellen":"Parinaud"}</div>
          <div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginBottom:16}}>{testType==="snellen"?"Vision de loin (40 cm)":"Vision de prÃ¨s (30â35 cm)"}</div>
          <div style={{display:"flex",gap:10}}>
            {[["Åil droit","OD"],["Åil gauche","OG"]].map(([l,e])=>(
              <div key={e} style={{flex:1,background:t.bg3,borderRadius:13,padding:"13px 6px"}}>
                <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginBottom:4}}>{l}</div>
                <div style={{color:ac(done[e]),fontSize:23,fontWeight:800,fontFamily:t.sf}}>{done[e]||"â"}</div>
              </div>
            ))}
          </div>
        </Card>
        <InfoBox color={t.text4} text="Test indicatif sur Ã©cran. Valeur non standardisÃ©e." icon="â¹ï¸"/>
        <div style={{display:"flex",gap:10}}>
          <button onClick={reset} style={{flex:1,padding:13,borderRadius:13,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontFamily:t.sm,fontSize:14,cursor:"pointer"}}>Refaire</button>
          <button onClick={()=>switchTest(testType==="snellen"?"parinaud":"snellen")} style={{flex:1,padding:13,borderRadius:13,border:"none",background:"rgba(10,132,255,.12)",color:"#0a84ff",fontFamily:t.sm,fontSize:13,fontWeight:600,cursor:"pointer"}}>{testType==="snellen"?"Tester Parinaud â":"Tester Snellen â"}</button>
        </div>
      </div>}
    </div>
  );
}


// ââ ASSISTANT âââââââââââââââââââââââââââââââââââââââââââââââââ
function ChatScreen(){
  const t=useTheme(); const lang=useLang(); const i=I18N[lang]||I18N.fr;
  const [open,setOpen]=useState(null);
  const items=i.faq;
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:4}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>{i.tab_chat}</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,marginTop:2,marginBottom:16}}>{i.chat_subtitle}</div>
      </div>
      <Card style={{marginBottom:20,display:"flex",gap:12,alignItems:"center"}}>
        <div style={{width:44,height:44,borderRadius:14,background:"linear-gradient(135deg,#0a84ff,#30d158)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>ðï¸</div>
        <div>
          <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{i.chat_tool}</div>
          <div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:2,lineHeight:1.4}}>{i.chat_disclaimer_inline}</div>
        </div>
      </Card>
      {/* Bulles interactives */}
      <div style={{display:"flex",flexWrap:"wrap",gap:10,marginBottom:20}}>
        {items.map((item,i)=>(
          <button key={i} onClick={()=>setOpen(open===i?null:i)}
            style={{
              display:"flex",alignItems:"center",gap:8,
              padding:"10px 18px 10px 12px",
              borderRadius:50,
              border:`1.5px solid ${open===i?item.color:t.border}`,
              background:open===i?(t.isDark?item.color+"30":item.color+"18"):t.glass,
              backdropFilter:"blur(20px)",
              WebkitBackdropFilter:"blur(20px)",
              cursor:"pointer",
              outline:"none",
              WebkitTapHighlightColor:"transparent",
              transition:"all .18s",
              boxShadow:open===i?`0 4px 14px ${item.color}30`:"none",
            }}>
            <span style={{fontSize:18,lineHeight:1}}>{item.icon}</span>
            <span style={{color:open===i?item.color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{item.short}</span>
          </button>
        ))}
      </div>
      {/* RÃ©ponse */}
      {open!==null&&(
        <div className="fade-up" style={{
          background:items[open].color+(t.isDark?"22":"15"),
          borderRadius:20,
          padding:"16px",
          border:`1.5px solid ${items[open].color}44`,
          marginBottom:16,
          boxShadow:`0 6px 24px ${items[open].color}18`,
        }}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{width:38,height:38,borderRadius:12,background:items[open].color+"28",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{items[open].icon}</div>
            <div style={{color:t.text,fontSize:14,fontWeight:700,fontFamily:t.sm,flex:1,lineHeight:1.3}}>{items[open].q}</div>
          </div>
          <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.65}}>{items[open].a}</div>
        </div>
      )}
      <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,textAlign:"center",marginTop:8}}>{i.chat_footer}</div>
    </div>
  );
}


// ââ PROFILE âââââââââââââââââââââââââââââââââââââââââââââââââââ
function ProfileScreen({user,scans,onDelete,onLogout,onShowAuth,onUpdateConsent,detail,setDetail}){
  const t=useTheme(); const lang=useLang(); const ICDR=getICDR(lang);
  if(detail){
    const info=ICDR[Math.min(Math.max(detail.icdr_level,0),4)];
    return(
      <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
        <div style={{paddingTop:56}}><BackBtn onBack={()=>setDetail(null)} label="Profil"/></div>
        {detail.image&&<img src={detail.image} alt="" style={{width:"100%",borderRadius:18,objectFit:"contain",maxHeight:230,background:"#111",display:"block",marginBottom:12}}/>}
        <div style={{background:info.bg,borderRadius:18,padding:"15px",border:`1px solid ${info.color}44`,marginBottom:12}}>
          <div style={{display:"flex",alignItems:"center",gap:11,marginBottom:8}}>
            <span style={{fontSize:34}}>{info.emoji}</span>
            <div>
              <div style={{color:t.text,fontSize:18,fontWeight:700,fontFamily:t.sf}}>{info.label}</div>
              <div style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{new Date(detail.date).toLocaleDateString("fr-FR",{day:"numeric",month:"long",year:"numeric"})}</div>
            </div>
          </div>
          <div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55}}>{info.advice}</div>
        </div>
        {detail.findings?.length>0&&<Card style={{marginBottom:12}}>
          <div style={{color:t.text3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontFamily:t.sm}}>Signes observÃ©s</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>{detail.findings.map((f,i)=><span key={i} style={{background:t.bg3,color:t.text2,borderRadius:20,padding:"4px 11px",fontSize:12,fontFamily:t.sm}}>{f}</span>)}</div>
        </Card>}
        {(detail.notes||detail.confidence)&&<Card style={{marginBottom:12}}>
          <div style={{color:t.text3,fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontFamily:t.sm}}>Analyse IA</div>
          {detail.notes&&<div style={{color:t.text2,fontSize:13,fontFamily:t.sm,lineHeight:1.55,marginBottom:detail.confidence?10:0}}>{detail.notes}</div>}
          {detail.confidence&&<div>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
              <span style={{color:t.text3,fontSize:11,fontFamily:t.sm}}>Score de confiance</span>
              <span style={{color:"#0a84ff",fontSize:11,fontWeight:700,fontFamily:t.sm}}>{detail.confidence}%</span>
            </div>
            <div style={{height:5,borderRadius:3,background:t.bg3,overflow:"hidden"}}>
              <div style={{width:`${detail.confidence}%`,height:"100%",borderRadius:3,background:"linear-gradient(90deg,#0a84ff,#30d158)",transition:"width .6s ease"}}/>
            </div>
          </div>}
        </Card>}
        {detail.icdr_level>=3&&<a href="https://www.doctolib.fr/ophtalmologue" target="_blank" rel="noopener noreferrer" style={{display:"block",textDecoration:"none",width:"100%",padding:"11px 0",borderRadius:12,background:"#ff453a",color:"#fff",fontSize:14,fontWeight:700,fontFamily:t.sm,textAlign:"center",marginBottom:10}}>ð¥ Prendre RDV ophtalmologue â</a>}
        <button onClick={()=>{onDelete(detail.id);setDetail(null);}} style={{width:"100%",padding:12,borderRadius:12,border:"1px solid rgba(255,69,58,.25)",background:"rgba(255,69,58,.08)",color:"#ff453a",fontFamily:t.sm,fontSize:14,cursor:"pointer"}}>ðï¸ Supprimer</button>
      </div>
    );
  }
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:18}}>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Profil</div>
      </div>
      {!user
        ?<Card style={{textAlign:"center",padding:30,marginBottom:12}}>
          <div style={{fontSize:44,marginBottom:12}}>ð¤</div>
          <div style={{color:t.text,fontSize:17,fontWeight:700,fontFamily:t.sf,marginBottom:7}}>Mode invitÃ©</div>
          <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,lineHeight:1.6,marginBottom:16}}>CrÃ©ez un compte pour sauvegarder vos donnÃ©es partout.</div>
          <PrimaryBtn label="CrÃ©er un compte" onClick={onShowAuth}/>
        </Card>
        :<Card style={{display:"flex",alignItems:"center",gap:14,marginBottom:12}}>
          <div style={{width:52,height:52,borderRadius:"50%",background:"linear-gradient(135deg,#0a84ff,#30d158)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:700,color:"#fff",fontFamily:t.sf,flexShrink:0}}>{user.name?.charAt(0).toUpperCase()}</div>
          <div>
            <div style={{color:t.text,fontSize:17,fontWeight:700,fontFamily:t.sf}}>{user.name}</div>
            <div style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{user.email}</div>
            <span style={{background:"rgba(10,132,255,.12)",color:"#0a84ff",borderRadius:20,padding:"2px 9px",fontSize:11,fontFamily:t.sm,fontWeight:700,marginTop:3,display:"inline-block"}}>DiabÃ¨te {user.diabetes}</span>
          </div>
        </Card>
      }
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
        {[["Analyses",scans.length,"#ff375f"],["Normaux",scans.filter(s=>s.icdr_level===0).length,"#30d158"],["ModÃ©rÃ©s+",scans.filter(s=>s.icdr_level>=2).length,"#ff9f0a"],["Urgents",scans.filter(s=>s.icdr_level>=3).length,"#ff453a"]].map(([l,v,c])=>(
          <Card key={l} style={{padding:"12px 13px"}}>
            <div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginBottom:2}}>{l}</div>
            <div style={{color:c,fontSize:25,fontWeight:700,fontFamily:t.sf,letterSpacing:-.4}}>{v}</div>
          </Card>
        ))}
      </div>
      {user&&<Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:9}}>
          <div style={{width:32,height:32,borderRadius:10,background:user.consentGiven?"rgba(48,209,88,.15)":"rgba(255,159,10,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>{user.consentGiven?"ð¬":"ð"}</div>
          <div><div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>Contribution recherche</div><div style={{color:user.consentGiven?"#30d158":"#ff9f0a",fontSize:12,fontFamily:t.sm}}>{user.consentGiven?"ActivÃ©e":"DÃ©sactivÃ©e"}</div></div>
        </div>
        <button onClick={onUpdateConsent} style={{width:"100%",padding:10,borderRadius:11,border:`1px solid ${user.consentGiven?"rgba(255,69,58,.25)":"rgba(52,199,89,.3)"}`,background:user.consentGiven?"rgba(255,69,58,.08)":"rgba(48,209,88,.1)",color:user.consentGiven?"#ff453a":"#30d158",fontFamily:t.sm,fontSize:13,fontWeight:600,cursor:"pointer"}}>{user.consentGiven?"DÃ©sactiver":"Activer le partage anonyme"}</button>
      </Card>}
      <Card style={{marginBottom:12}}>
        <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sf,marginBottom:11}}>ð Recommandations</div>
        {[["Fond d'Åil","/ 12 mois","#0a84ff"],["HbA1c","/ 3 mois","#30d158"],["Tension","RÃ©guliÃ¨rement","#ff9f0a"]].map(([l,r,c])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:8,marginBottom:8,borderBottom:`1px solid ${t.bg3}`}}>
            <span style={{color:t.text2,fontSize:13,fontFamily:t.sm}}>{l}</span>
            <span style={{color:c,fontSize:12,fontFamily:t.sm,fontWeight:600}}>{r}</span>
          </div>
        ))}
      </Card>
      {user
        ?<button onClick={onLogout} style={{width:"100%",padding:13,borderRadius:13,border:"1px solid rgba(255,69,58,.25)",background:"rgba(255,69,58,.08)",color:"#ff453a",fontFamily:t.sm,fontSize:14,fontWeight:600,cursor:"pointer",marginTop:4}}>Se dÃ©connecter</button>
        :<PrimaryBtn label="CrÃ©er un compte ou se connecter" onClick={onShowAuth} style={{marginTop:4}}/>
      }
      <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,textAlign:"center",marginTop:14}}>RetinaScore v8 Â· ThÃ¨se mÃ©decine 2026 Â· RGPD EU</div>
    </div>
  );
}

const LANGS=[{code:"fr",flag:"ð«ð·",label:"FranÃ§ais"},{code:"en",flag:"ð¬ð§",label:"English"},{code:"de",flag:"ð©ðª",label:"Deutsch"},{code:"ro",flag:"ð·ð´",label:"RomÃ¢nÄ"}];

// ââ SETTINGS ââââââââââââââââââââââââââââââââââââââââââââââââââ
function SettingsScreen({onBack,darkMode,setDarkMode,onReset,lang,setLang}){
  const t=useTheme();
  const i=I18N[lang]||I18N.fr;
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56,paddingBottom:4}}>
        <BackBtn onBack={onBack} label={i.tab_home}/>
        <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>{i.settings}</div>
      </div>
      <SecTitle mt={22}>{i.appearance}</SecTitle>
      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,214,10,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>{darkMode?"ð":"âï¸"}</div>
            <div><div style={{color:t.text,fontSize:15,fontWeight:600,fontFamily:t.sm}}>{i.dark_mode}</div><div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:1}}>{darkMode?i.dark_on:i.dark_off}</div></div>
          </div>
          <div onClick={()=>setDarkMode(!darkMode)} style={{width:50,height:30,borderRadius:15,background:darkMode?"#30d158":"rgba(120,120,128,0.32)",cursor:"pointer",position:"relative",transition:"background .25s",flexShrink:0}}>
            <div style={{width:26,height:26,borderRadius:"50%",background:"#fff",position:"absolute",top:2,left:darkMode?22:2,transition:"left .25s",boxShadow:"0 2px 6px rgba(0,0,0,0.25)"}}/>
          </div>
        </div>
      </Card>
      <Card style={{marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:12}}>
          <div style={{width:34,height:34,borderRadius:10,background:"rgba(10,132,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>ð</div>
          <div style={{color:t.text,fontSize:15,fontWeight:600,fontFamily:t.sm}}>{i.lang_label}</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
          {LANGS.map(({code,flag,label})=>(
            <div key={code} onClick={()=>setLang(code)} style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",borderRadius:11,border:`1px solid ${lang===code?"#0a84ff44":t.border}`,background:lang===code?"rgba(10,132,255,.12)":t.glass,cursor:"pointer",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)"}}>
              <span style={{fontSize:18}}>{flag}</span>
              <span style={{color:lang===code?"#0a84ff":t.text,fontSize:13,fontWeight:lang===code?700:500,fontFamily:t.sm}}>{label}</span>
              {lang===code&&<div style={{marginLeft:"auto",width:7,height:7,borderRadius:"50%",background:"#0a84ff",flexShrink:0}}/>}
            </div>
          ))}
        </div>
      </Card>
      <SecTitle>{i.privacy_title}</SecTitle>
      <Card style={{marginBottom:12}}>
        {[["ð·",i.photo_label,i.photo_desc,"#30d158"],["ð",i.analyses_label,i.analyses_desc,"#0a84ff"],["âï¸",i.legal_label,i.legal_desc,"#ffd60a"],["ð",i.hosting_label,i.hosting_desc,"#30d158"]].map(([ico,l,d,c])=>(
          <div key={l} style={{display:"flex",gap:12,marginBottom:10,alignItems:"flex-start"}}>
            <div style={{width:30,height:30,borderRadius:9,background:c+"18",display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{ico}</div>
            <div><div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{l}</div><div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1,lineHeight:1.4}}>{d}</div></div>
          </div>
        ))}
      </Card>
      <SecTitle>{i.about_title}</SecTitle>
      <Card>
        {[[i.version_label,i.version_val],[i.author_label,i.author_val],[i.compliance_label,i.compliance_val]].map(([l,v])=>(
          <div key={l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:9,marginBottom:9,borderBottom:`1px solid ${t.bg3}`}}>
            <span style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>{l}</span>
            <span style={{color:t.text,fontSize:13,fontFamily:t.sm,fontWeight:500}}>{v}</span>
          </div>
        ))}
        <div style={{color:t.text4,fontSize:11,fontFamily:t.sm,lineHeight:1.5,marginTop:4}}>{i.disclaimer}</div>
      </Card>
      <button
        onClick={onReset}
        style={{width:"100%",marginTop:32,padding:"15px 0",background:"rgba(255,59,48,0.15)",border:"1px solid rgba(255,59,48,0.30)",borderRadius:14,color:"#ff3b30",fontSize:16,fontWeight:700,fontFamily:t.sm,cursor:"pointer",letterSpacing:-.2,backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)"}}
      >
        {i.reset_btn}
      </button>
    </div>
  );
}


// ââ RDV SCREEN ââââââââââââââââââââââââââââââââââââââââââââââââ
function RDVScreen({onBack}){
  const t=useTheme();
  const [rdvs,setRdvs]=useState(()=>DB.get("rdvs",[]));
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({date:"",type:"Fond d'Åil",note:""});
  const [err,setErr]=useState("");
  const types=["Fond d'Åil","HbA1c","Ophtalmologue","DiabÃ©tologue","Autre"];
  const save=()=>{
    if(!form.date){setErr("Date requise.");return;}
    const newRdv={id:Date.now().toString(),...form};
    const updated=[...rdvs,newRdv].sort((a,b)=>a.date.localeCompare(b.date));
    setRdvs(updated);DB.set("rdvs",updated);
    setForm({date:"",type:"Fond d'Åil",note:""});setErr("");setShowForm(false);
  };
  const del=(id)=>{const updated=rdvs.filter(r=>r.id!==id);setRdvs(updated);DB.set("rdvs",updated);};
  const today=new Date().toISOString().slice(0,10);
  const upcoming=rdvs.filter(r=>r.date>=today);
  const past=rdvs.filter(r=>r.date<today);
  const rdvColor={"Fond d'Åil":"#0a84ff","HbA1c":"#30d158","Ophtalmologue":"#bf5af2","DiabÃ©tologue":"#ff9f0a","Autre":"#8e8e93"};
  const formatDate=d=>new Date(d+"T12:00").toLocaleDateString("fr-FR",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
  const daysUntil=d=>{
    const diff=Math.ceil((new Date(d+"T12:00")-new Date())/(1000*60*60*24));
    if(diff===0) return"Aujourd'hui";if(diff===1) return"Demain";if(diff>0) return`Dans ${diff} jours`;return`Il y a ${-diff} jours`;
  };
  return(
    <div style={{padding:"0 16px",background:"transparent",minHeight:"100%",paddingBottom:140}}>
      <div style={{paddingTop:56}}>
        <BackBtn onBack={onBack} label="RÃ©sumÃ©"/>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={{color:t.text,fontSize:30,fontWeight:700,letterSpacing:-.8,fontFamily:t.sf}}>Rendez-vous</div>
          <button onClick={()=>setShowForm(!showForm)} style={{background:showForm?t.bg3:"#0a84ff",border:"none",borderRadius:20,padding:"7px 15px",color:showForm?t.text3:"#fff",fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>{showForm?"Annuler":"+ Ajouter"}</button>
        </div>
      </div>
      {showForm&&<Card style={{marginBottom:16}} className="fade-up">
        <div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:12}}>Nouveau rendez-vous</div>
        <div style={{marginBottom:10}}>
          <div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontFamily:t.sm}}>Type</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
            {types.map(tp=>(
              <button key={tp} onClick={()=>setForm(f=>({...f,type:tp}))} style={{padding:"6px 12px",borderRadius:20,border:`1px solid ${form.type===tp?(rdvColor[tp]||"#0a84ff")+"55":t.bg4}`,cursor:"pointer",fontFamily:t.sm,fontSize:12,fontWeight:600,background:form.type===tp?(rdvColor[tp]||"#0a84ff")+"22":"transparent",color:form.type===tp?(rdvColor[tp]||"#0a84ff"):t.text3,transition:"all .18s"}}>{tp}</button>
            ))}
          </div>
        </div>
        <FIn label="Date du rendez-vous" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))} type="date"/>
        <FIn label="Note (optionnel)" value={form.note} onChange={v=>setForm(f=>({...f,note:v}))} placeholder="ex: Dr Martin, HÃ´pital LariboisiÃ¨re"/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,marginBottom:8}}>{err}</div>}
        <PrimaryBtn label="Enregistrer" onClick={save}/>
      </Card>}
      {upcoming.length===0&&!showForm&&<Card style={{textAlign:"center",padding:44,marginBottom:12}}>
        <div style={{fontSize:40,marginBottom:12}}>ð</div>
        <div style={{color:t.text,fontSize:16,fontWeight:600,fontFamily:t.sf,marginBottom:6}}>Aucun rendez-vous</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm}}>Ajoutez vos prochains RDV mÃ©dicaux.</div>
      </Card>}
      {upcoming.length>0&&<>
        <div style={{color:t.text3,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,fontFamily:t.sm,marginBottom:8}}>Ã venir</div>
        {upcoming.map((r,i)=>{
          const color=rdvColor[r.type]||"#8e8e93";
          const du=daysUntil(r.date);
          const isClose=r.date<=new Date(Date.now()+7*86400000).toISOString().slice(0,10);
          return(
            <div key={r.id} style={{background:i===0?color+"14":t.bg2,borderRadius:15,padding:"13px 14px",marginBottom:9,border:`1px solid ${i===0?color+"33":t.border}`,display:"flex",alignItems:"flex-start",gap:12}}>
              <div style={{width:40,height:40,borderRadius:12,background:color+"20",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>
                {r.type==="Fond d'Åil"?"ðï¸":r.type==="HbA1c"?"ð©¸":r.type==="Ophtalmologue"?"ð¬":r.type==="DiabÃ©tologue"?"ð":"ð"}
              </div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}>
                  <div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{r.type}</div>
                  {isClose&&<span style={{background:color+"20",color,fontSize:10,fontWeight:700,borderRadius:20,padding:"2px 7px",fontFamily:t.sm}}>BientÃ´t</span>}
                </div>
                <div style={{color,fontSize:12,fontFamily:t.sm,fontWeight:600,marginBottom:1}}>{du}</div>
                <div style={{color:t.text3,fontSize:11,fontFamily:t.sm}}>{formatDate(r.date)}</div>
                {r.note&&<div style={{color:t.text4,fontSize:11,fontFamily:t.sm,marginTop:2}}>{r.note}</div>}
              </div>
              <button onClick={()=>del(r.id)} style={{background:"none",border:"none",color:t.text4,fontSize:18,cursor:"pointer",padding:"0 0 0 4px",flexShrink:0}}>Ã</button>
            </div>
          );
        })}
      </>}
      {past.length>0&&<>
        <div style={{color:t.text4,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:.8,fontFamily:t.sm,marginTop:16,marginBottom:8}}>PassÃ©s</div>
        {past.map(r=>{
          const color=rdvColor[r.type]||"#8e8e93";
          return(
            <div key={r.id} style={{background:t.bg2,borderRadius:13,padding:"11px 13px",marginBottom:7,border:`1px solid ${t.border}`,display:"flex",alignItems:"center",gap:11,opacity:.6}}>
              <div style={{width:34,height:34,borderRadius:10,background:t.bg3,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>
                {r.type==="Fond d'Åil"?"ðï¸":r.type==="HbA1c"?"ð©¸":r.type==="Ophtalmologue"?"ð¬":r.type==="DiabÃ©tologue"?"ð":"ð"}
              </div>
              <div style={{flex:1}}>
                <div style={{color:t.text3,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{r.type}</div>
                <div style={{color:t.text4,fontSize:11,fontFamily:t.sm}}>{new Date(r.date+"T12:00").toLocaleDateString("fr-FR",{day:"numeric",month:"short",year:"numeric"})}</div>
              </div>
              <button onClick={()=>del(r.id)} style={{background:"none",border:"none",color:t.text4,fontSize:16,cursor:"pointer"}}>Ã</button>
            </div>
          );
        })}
      </>}
    </div>
  );
}


// ââ LANDING âââââââââââââââââââââââââââââââââââââââââââââââââââ
function LandingScreen({onGuest,onLogin,onRegister}){
  const t=useTheme();
  const [a,setA]=useState(false);
  useEffect(()=>{setTimeout(()=>setA(true),60);},[]);
  return(
    <div style={{minHeight:"100%",background:"transparent",display:"flex",flexDirection:"column",padding:"0 20px 44px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-80,left:"50%",transform:"translateX(-50%)",width:320,height:320,borderRadius:"50%",background:"radial-gradient(circle,rgba(10,132,255,.14) 0%,transparent 70%)",pointerEvents:"none"}}/>
      <div style={{paddingTop:88,textAlign:"center",opacity:a?1:0,transform:a?"translateY(0)":"translateY(14px)",transition:"all .5s ease"}}>
        <div style={{width:82,height:82,borderRadius:24,background:"linear-gradient(145deg,#0a84ff,#30d158)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 16px",boxShadow:"0 16px 50px rgba(10,132,255,.28)"}}>
          <svg width={38} height={38} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.6} strokeLinecap="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx={12} cy={12} r={3}/></svg>
        </div>
        <div style={{color:t.text,fontSize:34,fontWeight:800,letterSpacing:-1.2,fontFamily:t.sf}}>RetinaScore</div>
        <div style={{color:t.text3,fontSize:14,marginTop:7,fontFamily:t.sm,lineHeight:1.6}}>DÃ©pistage de la rÃ©tinopathie diabÃ©tique<br/>par intelligence artificielle</div>
      </div>
      <div style={{marginTop:36,display:"flex",flexDirection:"column",gap:9,opacity:a?1:0,transform:a?"translateY(0)":"translateY(14px)",transition:"all .6s ease .1s"}}>
        {[["ðï¸","Analyse IA","Score ICDR 0â4 sur votre fond d'Åil"],["ð","Suivi complet","GlycÃ©mie, acuitÃ© visuelle, historique"],["ð","DonnÃ©es privÃ©es","Photos jamais stockÃ©es Â· RGPD EU"]].map(([e,title,desc])=>(
          <div key={title} style={{background:t.bg2,borderRadius:16,padding:"13px 15px",border:`1px solid ${t.border}`,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:21,flexShrink:0}}>{e}</span>
            <div><div style={{color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm}}>{title}</div><div style={{color:t.text3,fontSize:12,fontFamily:t.sm,marginTop:2,lineHeight:1.4}}>{desc}</div></div>
          </div>
        ))}
      </div>
      <div style={{marginTop:"auto",paddingTop:30,display:"flex",flexDirection:"column",gap:10,opacity:a?1:0,transform:a?"translateY(0)":"translateY(16px)",transition:"all .7s ease .2s"}}>
        <button onClick={onGuest} style={{width:"100%",padding:"15px 0",borderRadius:16,border:"none",cursor:"pointer",background:"linear-gradient(135deg,#0a84ff,#30d158)",color:"#fff",fontSize:17,fontWeight:700,fontFamily:t.sm,boxShadow:"0 6px 24px rgba(10,132,255,.3)"}}>Essayer sans compte â</button>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{flex:1,height:1,background:t.bg3}}/><span style={{color:t.text4,fontSize:12,fontFamily:t.sm}}>ou</span><div style={{flex:1,height:1,background:t.bg3}}/></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onLogin} style={{flex:1,padding:"13px 0",borderRadius:14,border:`1px solid ${t.bg4}`,background:t.bg2,color:t.text,fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>Connexion</button>
          <button onClick={onRegister} style={{flex:1,padding:"13px 0",borderRadius:14,border:"1px solid rgba(10,132,255,.4)",background:"rgba(10,132,255,.1)",color:"#0a84ff",fontSize:14,fontWeight:600,fontFamily:t.sm,cursor:"pointer"}}>CrÃ©er un compte</button>
        </div>
        <div style={{color:t.text4,fontSize:10,fontFamily:t.sm,textAlign:"center",lineHeight:1.5}}>Outil acadÃ©mique Â· Ne remplace pas un avis mÃ©dical</div>
      </div>
    </div>
  );
}

// ââ AUTH MODAL ââââââââââââââââââââââââââââââââââââââââââââââââ
function AuthModal({mode:initMode,onClose,onLogin}){
  const t=useTheme();
  const [mode,setMode]=useState(initMode);
  const [f,setF]=useState({name:"",email:"",password:"",dob:"",diabetes:"Type 2"});
  const [err,setErr]=useState("");
  const [busy,setBusy]=useState(false);
  const [showConsent,setShowConsent]=useState(false);
  const [pending,setPending]=useState(null);
  const submit=async()=>{
    setErr("");if(!f.email||!f.password) return setErr("Email et mot de passe requis.");
    setBusy(true);await new Promise(r=>setTimeout(r,600));
    if(mode==="register"){
      if(!f.name){setBusy(false);return setErr("PrÃ©nom requis.");}
      const users=DB.get("users",{});if(users[f.email]){setBusy(false);return setErr("Email dÃ©jÃ  utilisÃ©.");}
      const u={...f,id:Date.now().toString(),consentGiven:false,createdAt:new Date().toISOString()};
      users[f.email]=u;DB.set("users",users);setPending(u);setBusy(false);setShowConsent(true);
    }else{
      const users=DB.get("users",{});const u=users[f.email];
      if(!u||u.password!==f.password){setBusy(false);return setErr("Identifiants incorrects.");}
      DB.set("sess",{email:f.email});setBusy(false);
      if(!u.consentGiven){setPending(u);setShowConsent(true);}else onLogin(u);
    }
  };
  const handleConsent=a=>{
    const users=DB.get("users",{});const u={...pending,consentGiven:a,consentDate:new Date().toISOString()};
    users[u.email]=u;DB.set("users",users);DB.set("sess",{email:u.email});onLogin(u);
  };
  if(showConsent) return <ConsentScreen onAccept={()=>handleConsent(true)} onDecline={()=>handleConsent(false)}/>;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.85)",display:"flex",alignItems:"flex-end",zIndex:2000,backdropFilter:"blur(14px)",WebkitBackdropFilter:"blur(14px)"}} onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{width:"100%",maxWidth:430,margin:"0 auto",background:t.bg2,borderRadius:"22px 22px 0 0",padding:"10px 20px 44px",border:`1px solid ${t.border}`,animation:"slideUp .28s ease"}}>
        <style>{`@keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{width:36,height:4,borderRadius:2,background:t.bg4,margin:"12px auto 18px"}}/>
        <div style={{display:"flex",background:t.bg3,borderRadius:11,padding:3,marginBottom:18}}>
          {[["login","Connexion"],["register","Inscription"]].map(([m,l])=>(
            <button key={m} onClick={()=>{setMode(m);setErr("");}} style={{flex:1,padding:"8px 0",borderRadius:9,border:"none",cursor:"pointer",fontSize:14,fontWeight:600,background:mode===m?t.bg4:"transparent",color:mode===m?t.text:t.text3,fontFamily:t.sm,transition:"all .18s"}}>{l}</button>
          ))}
        </div>
        {mode==="register"&&<>
          <FIn label="PrÃ©nom & Nom" value={f.name} onChange={v=>setF(p=>({...p,name:v}))} placeholder="Marie Dupont"/>
          <FIn label="Date de naissance" value={f.dob} onChange={v=>setF(p=>({...p,dob:v}))} type="date"/>
          <div style={{marginBottom:10}}>
            <div style={{color:t.text3,fontSize:11,fontWeight:600,textTransform:"uppercase",letterSpacing:.6,marginBottom:6,fontFamily:t.sm}}>Type de diabÃ¨te</div>
            <div style={{display:"flex",gap:6}}>
              {["Type 1","Type 2","Gestation.","Aucun"].map(d=>(
                <button key={d} onClick={()=>setF(p=>({...p,diabetes:d}))} style={{flex:1,padding:"7px 3px",borderRadius:9,border:"none",cursor:"pointer",fontFamily:t.sm,fontSize:11,fontWeight:600,background:f.diabetes===d?"#0a84ff":t.bg3,color:f.diabetes===d?"#fff":t.text3,transition:"all .18s"}}>{d}</button>
              ))}
            </div>
          </div>
        </>}
        <FIn label="Email" value={f.email} onChange={v=>setF(p=>({...p,email:v}))} placeholder="vous@email.fr" type="email"/>
        <FIn label="Mot de passe" value={f.password} onChange={v=>setF(p=>({...p,password:v}))} placeholder="â¢â¢â¢â¢â¢â¢â¢â¢" type="password"/>
        {err&&<div style={{color:"#ff453a",fontSize:13,fontFamily:t.sm,marginBottom:9}}>{err}</div>}
        <PrimaryBtn label={busy?"â¦":mode==="login"?"Se connecter":"CrÃ©er mon compte"} onClick={submit} disabled={busy} style={{marginTop:12}}/>
        <button onClick={onClose} style={{width:"100%",marginTop:9,padding:"11px 0",borderRadius:13,border:"none",background:"transparent",color:t.text3,fontSize:13,fontFamily:t.sm,cursor:"pointer"}}>Continuer sans compte â</button>
      </div>
    </div>
  );
}

// ââ CONSENT âââââââââââââââââââââââââââââââââââââââââââââââââââ
function ConsentScreen({onAccept,onDecline}){
  const t=useTheme();
  const [ck,setCk]=useState({a:false,b:false,c:false});
  const all=Object.values(ck).every(Boolean);
  return(
    <div style={{minHeight:"100%",background:"transparent",display:"flex",flexDirection:"column",padding:"0 20px 44px",overflowY:"auto"}}>
      <div style={{paddingTop:60,paddingBottom:22,textAlign:"center"}} className="fade-up">
        <div style={{width:62,height:62,borderRadius:18,background:"rgba(10,132,255,.1)",border:"1px solid rgba(10,132,255,.3)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 14px"}}>
          <svg width={26} height={26} viewBox="0 0 24 24" fill="none" stroke="#0a84ff" strokeWidth={1.6} strokeLinecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
        </div>
        <div style={{color:t.text,fontSize:23,fontWeight:700,fontFamily:t.sf}}>Consentement Ã©clairÃ©</div>
        <div style={{color:t.text3,fontSize:13,fontFamily:t.sm,marginTop:5}}>Une seule fois â modifiable dans les rÃ©glages</div>
      </div>
      <Card style={{marginBottom:9}}>
        <div style={{color:"#0a84ff",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.9,fontFamily:t.sm,marginBottom:9}}>DonnÃ©es collectÃ©es si acceptÃ©</div>
        {[["ð","Score ICDR","RÃ©sultat IA de chaque analyse"],["ð","Date","Pour le suivi longitudinal"],["ð¥","Type de diabÃ¨te","Contextualisation mÃ©dicale"]].map(([e,l,d])=>(
          <div key={l} style={{display:"flex",gap:10,marginBottom:7,alignItems:"flex-start"}}><span style={{fontSize:15,flexShrink:0}}>{e}</span><div><div style={{color:t.text,fontSize:13,fontWeight:600,fontFamily:t.sm}}>{l}</div><div style={{color:t.text3,fontSize:11,fontFamily:t.sm,marginTop:1}}>{d}</div></div></div>
        ))}
      </Card>
      <Card style={{marginBottom:9}}>
        <div style={{color:"#30d158",fontSize:10,fontWeight:700,textTransform:"uppercase",letterSpacing:.9,fontFamily:t.sm,marginBottom:8}}>Jamais collectÃ©s</div>
        {["Photos de fond d'Åil","Nom ou identitÃ©","Localisation GPS"].map(l=>(
          <div key={l} style={{display:"flex",gap:7,marginBottom:5,alignItems:"center"}}><span style={{color:"#30d158",fontSize:11}}>â</span><span style={{color:t.text3,fontSize:12,fontFamily:t.sm}}>{l}</span></div>
        ))}
      </Card>
      <InfoBox color="#ffd60a" text="RGPD Art. 9.2.j Â· HÃ©bergement EU Â· Conservation 5 ans Â· Retrait possible Ã  tout moment" icon="âï¸"/>
      <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:16}}>
        {[["a","Cet outil est une aide au dÃ©pistage, pas un diagnostic mÃ©dical."],["b","J'accepte l'utilisation anonyme de mes analyses pour amÃ©liorer l'IA."],["c","Je peux retirer ce consentement Ã  tout moment dans les rÃ©glages."]].map(([k,txt])=>(
          <div key={k} onClick={()=>setCk(c=>({...c,[k]:!c[k]}))} style={{display:"flex",gap:10,cursor:"pointer",background:t.bg2,borderRadius:12,padding:"11px 12px",border:`1px solid ${ck[k]?"rgba(10,132,255,.4)":t.border}`,transition:"border .18s"}}>
            <div style={{width:20,height:20,borderRadius:5,border:`2px solid ${ck[k]?"#0a84ff":t.bg4}`,background:ck[k]?"#0a84ff":"transparent",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .18s"}}>
              {ck[k]&&<svg width={11} height={11} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={3} strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>}
            </div>
            <div style={{color:ck[k]?t.text:t.text3,fontSize:12,fontFamily:t.sm,lineHeight:1.5,transition:"color .18s"}}>{txt}</div>
          </div>
        ))}
      </div>
      <PrimaryBtn label="J'accepte et je continue" onClick={onAccept} disabled={!all} style={{marginBottom:9}}/>
      <button onClick={onDecline} style={{width:"100%",padding:"12px 0",borderRadius:13,border:`1px solid ${t.bg4}`,background:"transparent",color:t.text3,fontSize:14,fontFamily:t.sm,cursor:"pointer"}}>Continuer sans accepter</button>
    </div>
  );
}


// ââ APP ROOT ââââââââââââââââââââââââââââââââââââââââââââââââââ
export default function App(){
  const [darkMode,setDarkMode]=useState(()=>DB.get("darkMode",false));
  const [lang,setLang]=useState(()=>DB.get("lang","fr"));
  const t=darkMode?DARK:LIGHT;

  useEffect(()=>{DB.set("darkMode",darkMode);},[darkMode]);
  useEffect(()=>{DB.set("lang",lang);},[lang]);

  const [screen,setScreen]=useState("landing");
  const [tab,setTab]=useState("home");
  const [user,setUser]=useState(null);
  const [scans,setScans]=useState(()=>DB.get("guest_scans",[]));
  const [glycLogs,setGlycLogs]=useState(()=>DB.get("guest_glyc",[]));
  const [authMode,setAuthMode]=useState("login");
  const [showAuth,setShowAuth]=useState(false);
  const [subScreen,setSubScreen]=useState(null);
  const [detail,setDetail]=useState(null);
  const [screenKey,setScreenKey]=useState(0);

  useEffect(()=>{DB.set("guest_scans",scans);},[scans]);
  useEffect(()=>{DB.set("guest_glyc",glycLogs);},[glycLogs]);

  const login=u=>{setUser(u);setScreen("app");setShowAuth(false);};
  const logout=()=>{DB.del("sess");setUser(null);setScans([]);setGlycLogs([]);setScreen("landing");};
  const resetAllData=()=>{if(window.confirm("RÃ©initialiser toutes les donnÃ©es ? Cette action est irrÃ©versible.")){localStorage.removeItem(STORE_KEY);window.location.reload();}};
  const addScan=s=>{setScans(p=>[s,...p]);setTab("home");};
  const addGlyc=g=>{setGlycLogs(p=>[...p,g]);};
  const delScan=id=>setScans(p=>p.filter(s=>s.id!==id));
  const updateConsent=()=>{
    if(!user) return;
    const users=DB.get("users",{});
    const u={...user,consentGiven:!user.consentGiven};
    users[u.email]=u;DB.set("users",users);setUser(u);
  };
  const switchTab=(v)=>{setTab(v);setSubScreen(null);setDetail(null);setScreenKey(k=>k+1);};

  const navigate=dest=>{
    if(dest==="settings") setSubScreen("settings");
    else if(dest==="glycemia") setSubScreen("glycemia");
    else if(dest==="auth"){setAuthMode("register");setShowAuth(true);}
  };

  const renderMain=()=>{
    if(subScreen==="settings") return <SettingsScreen onBack={()=>setSubScreen(null)} darkMode={darkMode} setDarkMode={setDarkMode} onReset={resetAllData} lang={lang} setLang={setLang}/>;
    if(subScreen==="glycemia") return <GlycemiaScreen glycLogs={glycLogs} onSave={g=>{addGlyc(g);}} onBack={()=>setSubScreen(null)}/>;
    if(subScreen==="vision") return <VisionScreen onBack={()=>setSubScreen(null)}/>;
    if(subScreen==="rdv") return <RDVScreen onBack={()=>setSubScreen(null)}/>;
    switch(tab){
      case"home": return <HomeScreen user={user} scans={scans} glycLogs={glycLogs} onNavigate={navigate} onGoGlyc={()=>setSubScreen("glycemia")} onGoVision={()=>setSubScreen("vision")} onGoRDV={()=>setSubScreen("rdv")} onGoScan={()=>switchTab("scan")}/>;
      case"scan": return <ScanScreen user={user} onDone={s=>{addScan(s);setSubScreen(null);}}/>;
      case"history": return <HistoryScreen scans={scans} glycLogs={glycLogs} onScanDetail={s=>{setDetail(s);setTab("profile");}}/>;
      case"chat": return <ChatScreen/>;
      case"profile": return <ProfileScreen user={user} scans={scans} onDelete={delScan} onLogout={logout} onShowAuth={()=>{setAuthMode("register");setShowAuth(true);}} onUpdateConsent={updateConsent} detail={detail} setDetail={setDetail}/>;
      default: return null;
    }
  };

  const showTab=!subScreen||subScreen==="vision";

  // ââ Landing screen (no tab bar)
  if(screen==="landing") return(
    <ThemeCtx.Provider value={t}>
      <div style={{background:t.isDark?"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.22) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 82% 78%, rgba(191,90,242,0.16) 0%, transparent 100%), #000000":"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.09) 0%, transparent 100%), #f2f2f7",width:"100vw",height:"100vh",overflow:"hidden",position:"relative",maxWidth:430,margin:"0 auto"}}>
        <div style={{width:"100%",height:"100%",overflowY:"auto",overflowX:"hidden"}}>
          <LandingScreen onGuest={()=>setScreen("app")} onLogin={()=>{setAuthMode("login");setShowAuth(true);}} onRegister={()=>{setAuthMode("register");setShowAuth(true);}}/>
        </div>
        {showAuth&&<AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onLogin={login}/>}
      </div>
    </ThemeCtx.Provider>
  );

  // ââ Main app
  return(
    <ThemeCtx.Provider value={t}>
    <LangCtx.Provider value={lang}>
      {/* Global keyframe injection */}
      <style>{`
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes slideUp{from{transform:translateY(100%);opacity:0}to{transform:translateY(0);opacity:1}}
        .screen-in{animation:screenIn .3s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up{animation:fadeUp .38s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up-1{animation:fadeUp .38s .07s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up-2{animation:fadeUp .38s .14s cubic-bezier(.25,.46,.45,.94) both}
        .fade-up-3{animation:fadeUp .38s .22s cubic-bezier(.25,.46,.45,.94) both}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes screenIn{from{opacity:0;transform:translateY(10px) scale(0.99)}to{opacity:1;transform:translateY(0) scale(1)}}
      `}</style>

      <div style={{
        background:t.isDark
          ?"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.22) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 82% 78%, rgba(191,90,242,0.16) 0%, transparent 100%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(48,209,88,0.07) 0%, transparent 100%), #000000"
          :"radial-gradient(ellipse 65% 55% at 18% 22%, rgba(10,132,255,0.22) 0%, transparent 100%), radial-gradient(ellipse 55% 65% at 82% 78%, rgba(191,90,242,0.16) 0%, transparent 100%), radial-gradient(ellipse 40% 40% at 50% 50%, rgba(48,209,88,0.09) 0%, transparent 100%), #f2f2f7",
        width:"100vw",
        height:"100%",
        maxWidth:430,
        margin:"0 auto",
        position:"relative",
        overflow:"hidden",
      }}>

        {/* ââ Scrollable screen area â content scrolls UNDER the glass tab bar */}
        <div
          key={screenKey}
          className="screen-in"
          style={{
            width:"100%",
            height:"100%",
            overflowY:"auto",
            overflowX:"hidden",
            WebkitOverflowScrolling:"touch",
          }}
        >
          {renderMain()}
        </div>

        {/* ââ Floating glass tab bar â FIXED over content */}
        {showTab&&<TabBar tab={tab} set={switchTab}/>}

        {/* ââ Auth modal */}
        {showAuth&&<AuthModal mode={authMode} onClose={()=>setShowAuth(false)} onLogin={login}/>}
      </div>
    </LangCtx.Provider>
    </ThemeCtx.Provider>
  );
}
