const diseaseTranslations = {
  en: {
    Papaya_healthy: {
      name: "Healthy Papaya",
      plant: "Papaya",
      cause: "The leaf is healthy with no visible signs of disease or infection.",
      symptoms: [
        "Uniform green leaf color",
        "No spots or lesions",
        "Normal leaf texture",
        "Healthy veins and margins",
      ],
      treatment: [
        "No treatment required",
        "Maintain regular watering",
        "Apply balanced fertilizer periodically",
        "Monitor plants regularly to prevent disease",
      ],
    },
    papaya_diseased_spots: {
      name: "Papaya Diseased Spots",
      plant: "Papaya",
      cause:
        "Leaf Spot Disease caused by fungal or bacterial pathogens, often encouraged by high humidity and poor air circulation.",
      symptoms: [
        "Brown or black spots on leaves",
        "Yellowing around infected areas",
        "Dry or dead leaf tissue",
        "Premature leaf fall",
      ],
      treatment: [
        "Remove and destroy infected leaves",
        "Apply a recommended fungicide or bactericide",
        "Avoid overhead watering",
        "Improve air circulation around the plant",
        "Keep the field free from infected plant debris",
      ],
    },

    Pepper__bell___Bacterial_spot: {
      name: "Bell Pepper Bacterial Spot",
      plant: "Bell Pepper",
      cause: "Caused by Xanthomonas bacteria.",
      symptoms: ["Small brown spots", "Yellow halo around spots", "Leaf drop"],
      treatment: ["Remove infected leaves", "Apply copper-based bactericide", "Avoid overhead irrigation"],
    },
    Pepper__bell___healthy: {
      name: "Healthy Bell Pepper",
      plant: "Bell Pepper",
      cause: "No disease detected.",
      symptoms: ["Healthy green leaves", "Normal plant growth"],
      treatment: ["Continue regular watering", "Apply balanced fertilizer", "Monitor for pests"],
    },

    Potato___Early_blight: {
      name: "Potato Early Blight",
      plant: "Potato",
      cause: "Caused by Alternaria solani fungus.",
      symptoms: ["Dark brown concentric spots", "Yellowing leaves", "Premature leaf fall"],
      treatment: ["Apply fungicide", "Remove infected leaves", "Maintain field sanitation"],
    },
    Potato___healthy: {
      name: "Healthy Potato",
      plant: "Potato",
      cause: "No disease detected.",
      symptoms: ["Fresh green leaves", "Healthy growth"],
      treatment: ["Maintain irrigation", "Apply recommended fertilizers"],
    },
    Potato___Late_blight: {
      name: "Potato Late Blight",
      plant: "Potato",
      cause: "Caused by Phytophthora infestans.",
      symptoms: ["Water-soaked lesions", "Brown leaf patches", "White fungal growth"],
      treatment: ["Use Mancozeb fungicide", "Destroy infected plants", "Avoid excess moisture"],
    },

    Tomato_Bacterial_spot: {
      name: "Tomato Bacterial Spot",
      plant: "Tomato",
      cause: "Caused by Xanthomonas bacteria.",
      symptoms: ["Small dark leaf spots", "Yellow halos", "Leaf drop"],
      treatment: ["Copper bactericide", "Remove infected leaves", "Avoid wet foliage"],
    },
    Tomato_Early_blight: {
      name: "Tomato Early Blight",
      plant: "Tomato",
      cause: "Caused by Alternaria solani fungus.",
      symptoms: ["Dark circular spots", "Yellow leaves", "Leaf drying"],
      treatment: ["Apply fungicide", "Remove infected leaves", "Improve air circulation"],
    },
    Tomato_Late_blight: {
      name: "Tomato Late Blight",
      plant: "Tomato",
      cause: "Caused by Phytophthora infestans.",
      symptoms: ["Brown patches", "White fungal growth", "Rapid leaf drying"],
      treatment: ["Apply Mancozeb", "Destroy infected plants", "Reduce humidity"],
    },
    Tomato_Leaf_Mold: {
      name: "Tomato Leaf Mold",
      plant: "Tomato",
      cause: "Caused by Passalora fulva fungus.",
      symptoms: ["Yellow upper leaf spots", "Olive-green mold underneath", "Leaf curling"],
      treatment: ["Improve ventilation", "Apply fungicide", "Reduce humidity"],
    },
    Tomato_Septoria_leaf_spot: {
      name: "Tomato Septoria Leaf Spot",
      plant: "Tomato",
      cause: "Caused by Septoria lycopersici fungus.",
      symptoms: ["Small circular spots", "Dark margins", "Yellow leaves"],
      treatment: ["Apply fungicide", "Remove infected leaves", "Avoid overhead watering"],
    },
    Tomato_Spider_mites_Two_spotted_spider_mite: {
      name: "Tomato Spider Mite",
      plant: "Tomato",
      cause: "Infestation by spider mites.",
      symptoms: ["Tiny yellow specks", "Webbing on leaves", "Leaf drying"],
      treatment: ["Apply miticide", "Increase humidity", "Remove heavily infected leaves"],
    },
    Tomato__Target_Spot: {
      name: "Tomato Target Spot",
      plant: "Tomato",
      cause: "Caused by Corynespora cassiicola fungus.",
      symptoms: ["Target-like circular lesions", "Brown leaf spots", "Leaf drop"],
      treatment: ["Apply fungicide", "Remove infected leaves", "Improve drainage"],
    },
    Tomato__Tomato_YellowLeaf__Curl_Virus: {
      name: "Tomato Yellow Leaf Curl Virus",
      plant: "Tomato",
      cause: "Caused by Tomato Yellow Leaf Curl Virus.",
      symptoms: ["Yellow curled leaves", "Stunted growth", "Reduced fruit production"],
      treatment: ["Control whiteflies", "Remove infected plants", "Use virus-resistant varieties"],
    },
    Tomato_Tomato_YellowLeafCurl_Virus: {
      name: "Tomato Yellow Leaf Curl Virus",
      plant: "Tomato",
      cause: "Caused by Tomato Yellow Leaf Curl Virus.",
      symptoms: ["Yellow curled leaves", "Stunted growth", "Reduced fruit production"],
      treatment: ["Control whiteflies", "Remove infected plants", "Use virus-resistant varieties"],
    },
    Tomato__Tomato_mosaic_virus: {
      name: "Tomato Mosaic Virus",
      plant: "Tomato",
      cause: "Caused by Tomato Mosaic Virus.",
      symptoms: ["Mosaic leaf pattern", "Leaf curling", "Poor fruit quality"],
      treatment: ["Remove infected plants", "Disinfect tools", "Use certified disease-free seeds"],
    },
    Tomato_healthy: {
      name: "Healthy Tomato",
      plant: "Tomato",
      cause: "No disease detected.",
      symptoms: ["Healthy green leaves", "Normal growth"],
      treatment: ["Continue watering", "Apply balanced fertilizer", "Regular field monitoring"],
    },
  },

  hi: {
    Papaya_healthy: {
      name: "स्वस्थ पपीता",
      plant: "पपीता",
      cause: "पत्ते में कोई दिखाई देने वाली बीमारी या संक्रमण नहीं है।",
      symptoms: ["एकसमान हरा पत्ता रंग", "कोई धब्बे या घाव नहीं", "सामान्य पत्ता बनावट", "स्वस्थ शिराएँ और सीमाएँ"],
      treatment: ["कोई उपचार आवश्यक नहीं", "नियमित सिंचाई बनाए रखें", "संतुलित उर्वरक समय-समय पर लगाएं", "रोग से बचाव के लिए नियमित रूप से पौधों की निगरानी करें"],
    },
    papaya_diseased_spots: {
      name: "पपीते की पत्ती पर धब्बा रोग",
      plant: "पपीता",
      cause: "पत्ते का धब्बा रोग कवक या जीवाणु रोगज़नक़ों के कारण होता है, अक्सर अधिक नमी और खराब हवा के circulação से बढ़ता है।",
      symptoms: ["पत्तियों पर भूरे या काले धब्बे", "संक्रमित क्षेत्रों के आसपास पीलापन", "सूखे या मृत पत्ते", "समय से पहले पत्तों का गिरना"],
      treatment: ["संक्रमित पत्तियों को हटाकर नष्ट करें", "अनुशंसित फफूंदनाशक या जीवाणुनाशक लगाएं", "ओवरहेड सिंचाई से बचें", "पौधे के आसपास हवा का संचार बेहतर करें", "खेत को संक्रमित पौध debris से मुक्त रखें"],
    },
    Pepper__bell___Bacterial_spot: {
      name: "शिमला मिर्च जीवाणु धब्बा",
      plant: "शिमला मिर्च",
      cause: "Xanthomonas जीवाणु के कारण।",
      symptoms: ["छोटे भूरे धब्बे", "धब्बों के आसपास पीला हल्का", "पत्तियों का झड़ना"],
      treatment: ["संक्रमित पत्तियों को हटाएं", "कॉपर-आधारित जीवाणुनाशक लगाएं", "ओवरहेड सिंचाई से बचें"],
    },
    Pepper__bell___healthy: {
      name: "स्वस्थ शिमला मिर्च",
      plant: "शिमला मिर्च",
      cause: "कोई बीमारी नहीं पाई गई।",
      symptoms: ["स्वस्थ हरे पत्ते", "सामान्य पौधों की वृद्धि"],
      treatment: ["नियमित सिंचाई जारी रखें", "संतुलित उर्वरक लगाएं", "कीटों पर नजर रखें"],
    },
    Potato___Early_blight: {
      name: "आलू प्रारंभिक झुलसा",
      plant: "आलू",
      cause: "Alternaria solani कवक के कारण।",
      symptoms: ["गहरे भूरे केंद्रित धब्बे", "पत्तियाँ पीली पड़ना", "समय से पहले पत्तियों का गिरना"],
      treatment: ["फफूंदनाशक लगाएं", "संक्रमित पत्तियाँ हटाएं", "खेत की स्वच्छता बनाए रखें"],
    },
    Potato___Late_blight: {
      name: "आलू देर से झुलसा",
      plant: "आलू",
      cause: "Phytophthora infestans के कारण।",
      symptoms: ["जल-भीगा घाव", "भूरे पत्ती धब्बे", "सफेद कवक वृद्धि"],
      treatment: ["Mancozeb फफूंदनाशक का उपयोग करें", "संक्रमित पौधों को नष्ट करें", "अधिक नमी से बचें"],
    },
    Potato___healthy: {
      name: "स्वस्थ आलू",
      plant: "आलू",
      cause: "कोई बीमारी नहीं पाई गई।",
      symptoms: ["ताज़े हरे पत्ते", "स्वस्थ वृद्धि"],
      treatment: ["सिंचाई बनाए रखें", "अनुशंसित उर्वरक लगाएं"],
    },
    Tomato_Bacterial_spot: {
      name: "टमाटर जीवाणु धब्बा",
      plant: "टमाटर",
      cause: "Xanthomonas जीवाणु के कारण।",
      symptoms: ["छोटे गहरे पत्ती धब्बे", "पीले हल्के", "पत्तियों का झड़ना"],
      treatment: ["कॉपर जीवाणुनाशक", "संक्रमित पत्तियाँ हटाएं", "गीले पत्तों से बचें"],
    },
    Tomato_Early_blight: {
      name: "टमाटर प्रारंभिक झुलसा",
      plant: "टमाटर",
      cause: "Alternaria solani कवक के कारण।",
      symptoms: ["गहरे गोल धब्बे", "पीली पत्तियाँ", "पत्तियों का सुखना"],
      treatment: ["फफूंदनाशक लगाएं", "संक्रमित पत्तियाँ हटाएं", "हवा का संचार बेहतर करें"],
    },
    Tomato_Late_blight: {
      name: "टमाटर देर से झुलसा",
      plant: "टमाटर",
      cause: "Phytophthora infestans के कारण।",
      symptoms: ["भूरे धब्बे", "सफेद कवक वृद्धि", "तेज़ी से पत्तियों का सुखना"],
      treatment: ["Mancozeb लगाएं", "संक्रमित पौधों को नष्ट करें", "नमी कम करें"],
    },
    Tomato_Leaf_Mold: {
      name: "टमाटर पत्ती फफूंदी",
      plant: "टमाटर",
      cause: "Passalora fulva कवक के कारण।",
      symptoms: ["ऊपरी पत्तियों पर पीले धब्बे", "नीचे जैतून-हरी फफूंदी", "पत्तियाँ मुड़ना"],
      treatment: ["हवा का संवहन सुधारें", "फफूंदनाशक लगाएं", "नमी कम करें"],
    },
    Tomato_Septoria_leaf_spot: {
      name: "टमाटर सेप्टोरिया पत्ती धब्बा",
      plant: "टमाटर",
      cause: "Septoria lycopersici कवक के कारण।",
      symptoms: ["छोटे गोल धब्बे", "गहरे किनारे", "पीली पत्तियाँ"],
      treatment: ["फफूंदनाशक लगाएं", "संक्रमित पत्तियाँ हटाएं", "ओवरहेड सिंचाई से बचें"],
    },
    Tomato_Spider_mites_Two_spotted_spider_mite: {
      name: "टमाटर स्पाइडर माइट",
      plant: "टमाटर",
      cause: "स्पाइडर मिट्स का संक्रमण।",
      symptoms: ["छोटे पीले धब्बे", "पत्तियों पर जाला", "पत्तियों का सुखना"],
      treatment: ["मिटिसाइड लगाएं", "नमी बढ़ाएं", "अत्यधिक संक्रमित पत्तियाँ हटाएं"],
    },
    Tomato__Target_Spot: {
      name: "टमाटर टारगेट स्पॉट",
      plant: "टमाटर",
      cause: "Corynespora cassiicola कवक के कारण।",
      symptoms: ["लक्ष्य जैसी गोल lesión", "भूरे पत्ती धब्बे", "पत्तियों का झड़ना"],
      treatment: ["फफूंदनाशक लगाएं", "संक्रमित पत्तियाँ हटाएं", "जल निकासी सुधारें"],
    },
    Tomato__Tomato_YellowLeaf__Curl_Virus: {
      name: "टमाटर पीला पत्ती मुड़न वायरस",
      plant: "टमाटर",
      cause: "टमाटर पीला पत्ती मुड़न वायरस के कारण।",
      symptoms: ["पीली मुड़ी हुई पत्तियाँ", "बौना crescimento", "फल उत्पादन कम"],
      treatment: ["सफेद मक्खियों पर नियंत्रण", "संक्रमित पौधों को हटाएं", "वायरस-प्रतिरोधी किस्में उपयोग करें"],
    },
    Tomato__Tomato_mosaic_virus: {
      name: "टमाटर मोज़ेक वायरस",
      plant: "टमाटर",
      cause: "टमाटर मोज़ेक वायरस के कारण।",
      symptoms: ["मोज़ेक पत्ती पैटर्न", "पत्तियाँ मुड़ना", "खराब फल गुणवत्ता"],
      treatment: ["संक्रमित पौधों को हटाएं", "उपकरणों को कीटाणुरहित करें", "प्रमाणित रोग-मुक्त बीजों का उपयोग करें"],
    },
    Tomato_healthy: {
      name: "स्वस्थ टमाटर",
      plant: "टमाटर",
      cause: "कोई बीमारी नहीं पाई गई।",
      symptoms: ["स्वस्थ हरे पत्ते", "सामान्य वृद्धि"],
      treatment: ["सिंचाई जारी रखें", "संतुलित उर्वरक लगाएँ", "नियमित खेत की निगरानी करें"],
    },
  },

  te: {
    Papaya_healthy: {
      name: "ఆరోగ్యకరమైన బొప్పాయి",
      plant: "బొప్పాయి",
      cause: "ఆకు ఆరోగ్యంగా ఉంది మరియు ఏదైనా దృశ్యమాన వ్యాధి లేదా సంక్రమణ గుర్తించబడలేదు.",
      symptoms: ["ఏకరీతి పచ్చని ఆకు రంగు", "ఎటువంటి మచ్చలు లేదా గాయాలు లేవు", "సాధారణ ఆకు నిర్మాణం", "ఆరోగ్యకరమైన నాళాలు మరియు అంచులు"],
      treatment: ["ఎటువంటి చికిత్స అవసరం లేదు", "క్రమం తప్పకుండా నీరు అందించండి", "సమతుల్య ఎరువులను కాలానుగుణంగా ఉపయోగించండి", "వ్యాధి నివారించడానికి మొక్కలను క్రమం తప్పకుండా పర్యవేక్షించండి"],
    },
    papaya_diseased_spots: {
      name: "బొప్పాయి ఆకు మచ్చల వ్యాధి",
      plant: "బొప్పాయి",
      cause: "ఆకు మచ్చల వ్యాధి శిలీంధ్ర లేదా బ్యాక్టీరియా జన్యువుల వల్ల వస్తుంది, తరచుగా అధిక ఆర్ద్రత మరియుPoor air circulation వల్ల పెరుగుతుంది.",
      symptoms: ["ఆకులపై గోధుమ లేదా నల్ల మచ్చలు", "సంక్రమణ జరిగిన ప్రాంతాల చుట్టూ పసుపు రంగు", "పొడి లేదా చనిపోయిన ఆకు కణజాలం", "ముందస్తు ఆకు క్షీణత"],
      treatment: ["సంక్రమణ చెందిన ఆకులను తొలగించి నాశనం చేయండి", "సిఫార్సు చేసిన శిలీంధ్రనాశకం లేదా బ్యాక్టీరియానాశకం ఉపయోగించండి", "ఎగువ నుండి నీరు వదలకుండా జాగ్రత్త తీసుకోండి", "మొక్క చుట్టూ గాలి ప్రసరణను మెరుగుపరచండి", "పంటలో సంక్రమణ చెందిన మొక్క కుళ్లిన పదార్థం లేకుండా ఉంచండి"],
    },
    Pepper__bell___Bacterial_spot: {
      name: "క్యాప్సికం బ్యాక్టీరియా మచ్చ",
      plant: "క్యాప్సికం",
      cause: "Xanthomonas బ్యాక్టీరియా వల్ల।",
      symptoms: ["చిన్న గోధుమ మచ్చలు", "మచ్చల చుట్టూ పసుపు హాలో", "ఆకు వేయడం"],
      treatment: ["సంక్రమణ చెందిన ఆకులను తొలగించండి", "కాపర్-బేస్డ్ బ్యాక్టీరియానాశకం ఉపయోగించండి", "ఎగువ నుండి నీటి పారుదల నుండి దూరంగా ఉండండి"],
    },
    Pepper__bell___healthy: {
      name: "ఆరోగ్యకరమైన క్యాప్సికం",
      plant: "క్యాప్సికం",
      cause: "ఏ వ్యాధి గుర్తించబడలేదు.",
      symptoms: ["ఆరోగ్యకరమైన పచ్చని ఆకులు", "సాధారణ మొక్కల వృద్ధి"],
      treatment: ["క్రమం తప్పకుండా నీటిపారుదల చేయండి", "సమతుల్య ఎరువును ఉపయోగించండి", "పెంపకం కీటకాల కోసం పర్యవేక్షించండి"],
    },
    Potato___Early_blight: {
      name: "బంగాళాదుంప ప్రారంభ బ్లైట్",
      plant: "బంగాళాదుంప",
      cause: "Alternaria solani శిలీంధ్రం వల్ల।",
      symptoms: ["గాఢ గోధుమ కేంద్రీకృత మచ్చలు", "ఆకులు పసుపు రంగు", "ముందస్తు ఆకు క్షీణత"],
      treatment: ["శిలీంధ్రనాశకం ఉపయోగించండి", "సంక్రమణ చెందిన ఆకులను తొలగించండి", "పంట సానిటేషన్ నిర్వహించండి"],
    },
    Potato___Late_blight: {
      name: "బంగాళాదుంప చివరి బ్లైట్",
      plant: "బంగాళాదుంప",
      cause: "Phytophthora infestans వల్ల।",
      symptoms: ["నీరు పీల్చుకున్న గాయాలు", "గోధుమ ఆకు మచ్చలు", "తెల్ల శిలీంధ్ర వృద్ధి"],
      treatment: ["Mancozeb శిలీంధ్రనాశకం ఉపయోగించండి", "సంక్రమణ చెందిన మొక్కలను నాశనం చేయండి", "అధిక తేమను నివారించండి"],
    },
    Potato___healthy: {
      name: "ఆరోగ్యకరమైన బంగాళాదుంప",
      plant: "బంగాళాదుంప",
      cause: "ఏ వ్యాధి గుర్తించబడలేదు.",
      symptoms: ["తాజా పచ్చని ఆకులు", "ఆరోగ్యకరమైన వృద్ధి"],
      treatment: ["నీటిపారుదల కొనసాగించండి", "సిఫారసు చేసిన ఎరువులను ఉపయోగించండి"],
    },
    Tomato_Bacterial_spot: {
      name: "టమాటా బ్యాక్టీరియా మచ్చ",
      plant: "టమాటా",
      cause: "Xanthomonas బ్యాక్టీరియా వల్ల।",
      symptoms: ["చిన్న గాఢ ఆకు మచ్చలు", "పసుపు హాలోలు", "ఆకు వేయడం"],
      treatment: ["కాపర్ బ్యాక్టీరియానాశకం", "సంక్రమణ చెందిన ఆకులను తొలగించండి", "తేమ ఉన్న ఆకులను నివారించండి"],
    },
    Tomato_Early_blight: {
      name: "టమాటా ప్రారంభ బ్లైట్",
      plant: "టమాటా",
      cause: "Alternaria solani శిలీంధ్రం వల్ల।",
      symptoms: ["గాఢ వృత్తాకార మచ్చలు", "పసుపు ఆకులు", "ఆకు వాతావరణం"],
      treatment: ["శిలీంధ్రనాశకం ఉపయోగించండి", "సంక్రమణ చెందిన ఆకులను తొలగించండి", "గాలి ప్రసరణ మెరుగుపరచండి"],
    },
    Tomato_Late_blight: {
      name: "టమాటా చివరి బ్లైట్",
      plant: "టమాటా",
      cause: "Phytophthora infestans వల్ల।",
      symptoms: ["గోధుమ మచ్చలు", "తెల్ల శిలీంధ్ర వృద్ధి", "త్వరిత ఆకు వాతావరణం"],
      treatment: ["Mancozeb ఉపయోగించండి", "సంక్రమణ చెందిన మొక్కలను నాశనం చేయండి", "తేమను తగ్గించండి"],
    },
    Tomato_Leaf_Mold: {
      name: "టమాటా ఆకు ఫంగస్",
      plant: "టమాటా",
      cause: "Passalora fulva శిలీంధ్రం వల్ల।",
      symptoms: ["పైభాగంలోని పసుపు మచ్చలు", "కింద జిట్టి-हरी శిలీంధ్రం", "ఆకు ముడుచుకోవడం"],
      treatment: ["వెంటిలేషన్ మెరుగుపరచండి", "శిలీంధ్రనాశకం ఉపయోగించండి", "తేమను తగ్గించండి"],
    },
    Tomato_Septoria_leaf_spot: {
      name: "టమాటా సెప్టోరియా ఆకు మచ్చ",
      plant: "టమాటా",
      cause: "Septoria lycopersici శిలీంధ్రం వల్ల।",
      symptoms: ["చిన్న వృత్తాకార మచ్చలు", "గాఢ అంచులు", "పసుపు ఆకులు"],
      treatment: ["శిలీంధ్రనాశకం ఉపయోగించండి", "సంక్రమణ చెందిన ఆకులను తొలగించండి", "ఎగువ నుండి నీటి పారుదల నుండి దూరంగా ఉండండి"],
    },
    Tomato_Spider_mites_Two_spotted_spider_mite: {
      name: "టమాటా స్పైడర్ మైట్",
      plant: "టమాటా",
      cause: "స్పైడర్ మైట్స్ ఉనికి。",
      symptoms: ["చిన్న పసుపు చుక్కలు", "ఆకులపై వెబ్", "ఆకు వాతావరణం"],
      treatment: ["మితిసైడ్ ఉపయోగించండి", "తేమను పెంచండి", "గుర్తింపు ఉన్న ఆకులను తొలగించండి"],
    },
    Tomato__Target_Spot: {
      name: "టమాటా టార్గెట్ స్పాట్",
      plant: "టమాటా",
      cause: "Corynespora cassiicola శిలీంధ్రం వల్ల।",
      symptoms: ["లక్ష్యంలా వృత్తాకార గాయాలు", "గోధుమ ఆకు మచ్చలు", "ఆకు వేయడం"],
      treatment: ["శిలీంధ్రనాశకం ఉపయోగించండి", "సంక్రమణ చెందిన ఆకులను తొలగించండి", "నిర్వాహక నీటి వ్యవస్థ మెరుగుపరచండి"],
    },
    Tomato__Tomato_YellowLeaf__Curl_Virus: {
      name: "టమాటా పసుపు ఆకు ముడత వైరస్",
      plant: "టమాటా",
      cause: "టమాటా పసుపు ఆకు ముడత వైరస్ వల్ల।",
      symptoms: ["పసుపు ముడుచుకున్న ఆకులు", "పొదిగిన వృద్ధి", "తక్కువ పండు ఉత్పత్తి"],
      treatment: ["వైట్‌ఫ్లైల్స్ నియంత్రించండి", "సంక్రమణ చెందిన మొక్కలను తొలగించండి", "వైరస్-రెసిస్టెంట్ జాతులను ఉపయోగించండి"],
    },
    Tomato_Tomato_YellowLeafCurl_Virus: {
      name: "టమాటా పసుపు ఆకు ముడత వైరస్",
      plant: "టమాటా",
      cause: "టమాటా పసుపు ఆకు ముడత వైరస్ వల్ల।",
      symptoms: ["పసుపు ముడుచుకున్న ఆకులు", "పొదిగిన వృద్ధి", "తక్కువ పండు ఉత్పత్తి"],
      treatment: ["వైట్‌ఫ్లైల్స్ నియంత్రించండి", "సంక్రమణ చెందిన మొక్కలను తొలగించండి", "వైరస్-రెసిస్టెంట్ జాతులను ఉపయోగించండి"],
    },
    Tomato__Tomato_mosaic_virus: {
      name: "టమాటా మొజాయిక్ వైరస్",
      plant: "టమాటా",
      cause: "టమాటా మొజాయిక్ వైరస్ వల్ల।",
      symptoms: ["మొజాయిక్ ఆకు నమూనా", "ఆకు ముడుచుకోవడం", "పల్స్ నాణ్యత తగ్గడం"],
      treatment: ["సంక్రమణ చెందిన మొక్కలను తొలగించండి", "పరికరాలను శుభ్రం చేయండి", "ధృవీకరించిన వ్యాధి-రహిత విత్తనాలను ఉపయోగించండి"],
    },
    Tomato_healthy: {
      name: "ఆరోగ్యకరమైన టమాటా",
      plant: "టమాటా",
      cause: "ఏ వ్యాధి గుర్తించబడలేదు.",
      symptoms: ["ఆరోగ్యకరమైన పచ్చని ఆకులు", "సాధారణ వృద్ధి"],
      treatment: ["నీటిపారుదల చేస్తూ ఉండండి", "సమతుల్య ఎరువును ఉపయోగించండి", "క్రమం తప్పకుండా పంటను పర్యవేక్షించండి"],
    },
  },
};

const plantTranslations = {
  en: {
    Papaya: "Papaya",
    "Bell Pepper": "Bell Pepper",
    Potato: "Potato",
    Tomato: "Tomato",
  },
  hi: {
    Papaya: "पपीता",
    "Bell Pepper": "शिमला मिर्च",
    Potato: "आलू",
    Tomato: "टमाटर",
  },
  te: {
    Papaya: "బొప్పాయి",
    "Bell Pepper": "క్యాప్సికం",
    Potato: "బంగాళాదుంప",
    Tomato: "టమాటా",
  },
};

function normalizeDiseaseKey(diseaseKey = "") {
  const key = String(diseaseKey || "").trim();
  if (!key) return "";

  const aliases = {
    Tomato_Tomato_YellowLeafCurl_Virus: "Tomato__Tomato_YellowLeaf__Curl_Virus",
    Tomato__Tomato_YellowLeafCurl_Virus: "Tomato__Tomato_YellowLeaf__Curl_Virus",
    Tomato_Tomato_YellowLeaf__Curl_Virus: "Tomato__Tomato_YellowLeaf__Curl_Virus",
  };

  return aliases[key] || key;
}

function formatDiseaseLabel(diseaseKey = "") {
  return String(diseaseKey || "")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim();
}

export function getLocalizedDiseaseDetails(diseaseKey, language = "en") {
  const normalizedKey = normalizeDiseaseKey(diseaseKey);
  return (
    diseaseTranslations?.[language]?.[normalizedKey] ||
    diseaseTranslations?.[language]?.[diseaseKey] ||
    diseaseTranslations?.en?.[normalizedKey] ||
    diseaseTranslations?.en?.[diseaseKey] ||
    { name: formatDiseaseLabel(diseaseKey), plant: "", cause: "", symptoms: [], treatment: [] }
  );
}

export function getLocalizedPlantName(plantName, language = "en") {
  return plantTranslations?.[language]?.[plantName] || plantName;
}

export default diseaseTranslations;