export const translations = {
    fr: {
        welcome: 'Bienvenue sur TMIA Psycho-Quest V2.0',
        subtitle: 'Questionnaire comportemental intelligent pour la mode',
        start: 'Commencer l\'Analyse',
        admin: 'Admin',
        questionOf: 'Question {{current}} / {{total}}',
        next: 'Suivant',
        previous: 'Précédent',
        finish: 'Terminer',
        analyzing: 'Analyse en cours...',
        answerChanges: 'Changements',
        restart: 'Recommencer',
        personas: {
            visionnaire: 'Visionnaire',
            prudent: 'Prudent',
            creatif: 'Créatif',
            pragmatique: 'Pragmatique',
            traditionnel: 'Traditionnel'
        },
        questions: [
            {
                id: 1,
                text: 'Quelle image résonne le plus avec vous?',
                options: ['Innovation', 'Analyse', 'Émotion', 'Business', 'Tradition']
            },
            {
                id: 2,
                text: 'Face à une nouvelle technologie, vous:',
                options: ['Adopte vite', 'Attend des preuves', 'Sceptique', 'Calcule le ROI', "Je préfère l\'ancien"]
            },
            {
                id: 3,
                text: "Combien de temps pour livrer 5 designs ?",
                options: ['< 1 semaine', '1-2 semaines', '2-4 semaines', '> 1 mois', 'Variable']
            },
            {
                id: 4,
                text: 'Quelle est votre priorité en design ?',
                options: ['Innovation', 'Minimiser risques', 'Émotion', 'ROI', 'Savoir-faire']
            },
            {
                id: 5,
                text: 'Si une IA génère 10 designs en 30s, vous:',
                options: ['Testez', 'Voulez des preuves', "Craignez la perte du style", 'Calculez le coût', 'Non merci']
            },
            {
                id: 6,
                text: 'Ce qui vous convainc le plus ?',
                options: ['Démo live', 'Données', 'Témoignages', 'ROI prouvé', 'Contrôle total']
            },
            {
                id: 7,
                text: "L'IA dans la mode est :",
                options: ['Révolution', 'À surveiller', 'Menace', 'Outil rentable', 'Pas nécessaire']
            }
        ],
        personaDetails: {
            visionnaire: {
                title: 'Visionnaire',
                strengths: 'Rapide à adopter, orienté innovation',
                weaknesses: 'Parfois impulsif'
            },
            prudent: {
                title: 'Prudent',
                strengths: 'Analytique, recherche de preuves',
                weaknesses: 'Risque d\'hésitation'
            },
            creatif: {
                title: 'Créatif',
                strengths: 'Explorateur, beaucoup d\'idées',
                weaknesses: 'Peut changer d\'avis souvent'
            },
            pragmatique: {
                title: 'Pragmatique',
                strengths: 'Orienté ROI, concret',
                weaknesses: 'Moins exploratoire'
            },
            traditionnel: {
                title: 'Traditionnel',
                strengths: 'Respect du savoir-faire',
                weaknesses: 'Résistant au changement'
            }
        }
        ,
        personaStrengths: {
            visionnaire: ["Innovation rapide", "Vision stratégique", "Adoption précoce", "Leadership technologique"],
            prudent: ["Analyse rigoureuse", "Décisions sûres", "Minimise les risques", "Validation systématique"],
            creatif: ["Originalité unique", "Émotion forte", "Authenticité", "Sensibilité artistique"],
            pragmatique: ["Focus ROI", "Exécution rapide", "Efficacité maximale", "Orientation résultats"],
            traditionnel: ["Maîtrise technique", "Qualité constante", "Expérience profonde", "Savoir-faire artisanal"]
        },
        personaWeaknesses: {
            visionnaire: ["Impatience", "Risques élevés", "Manque de validation"],
            prudent: ["Lenteur décision", "Opportunités manquées", "Paralysie par l'analyse"],
            creatif: ["Résistance à l'IA", "Peur du changement", "Perfectionnisme paralysant"],
            pragmatique: ["Vision court terme", "Néglige créativité"],
            traditionnel: ["Résistance innovation", "Adaptation lente", "Rigidité méthodologique"]
        },
        personaTmiaFit: {
            visionnaire: "TMIA parfait pour vous: vitesse + innovation + prédiction temps réel",
            prudent: "AI Battle + Time Capsule vous donneront les preuves vérifiables nécessaires",
            creatif: "TMIA est votre assistant créatif, jamais votre remplaçant",
            pragmatique: "TMIA = 250h économisées/an, ROI mesurable immédiatement",
            traditionnel: "TMIA préserve votre contrôle total sur le processus créatif"
        }
    },
    en: {
        welcome: 'Welcome to TMIA Psycho-Quest V2.0',
        subtitle: 'Smart behavioral questionnaire for fashion',
        start: 'Start Analysis',
        admin: 'Admin',
        questionOf: 'Question {{current}} / {{total}}',
        next: 'Next',
        previous: 'Previous',
        finish: 'Finish',
        analyzing: 'Analyzing...',
        answerChanges: 'Changes',
        restart: 'Restart',
        personas: {
            visionnaire: 'Visionary',
            prudent: 'Prudent',
            creatif: 'Creative',
            pragmatique: 'Pragmatic',
            traditionnel: 'Traditional'
        },
        questions: [
            { id: 1, text: 'Which image resonates most?', options: ['Innovation', 'Analysis', 'Emotion', 'Business', 'Tradition'] },
            { id: 2, text: 'Facing new tech you:', options: ['Adopt quickly', 'Wait for evidence', 'Skeptical', 'Calculate ROI', 'Prefer old'] },
            { id: 3, text: 'Time to deliver 5 designs?', options: ['< 1 week', '1-2 weeks', '2-4 weeks', '> 1 month', 'Variable'] },
            { id: 4, text: 'Design priority?', options: ['Innovation', 'Minimize risk', 'Emotion', 'ROI', 'Craftsmanship'] },
            { id: 5, text: 'AI generates 10 designs in 30s, you:', options: ['Test it', 'Want proof', 'Fear loss of style', 'Check cost', 'No thanks'] },
            { id: 6, text: 'What convinces you most?', options: ['Live demo', 'Data', 'Testimonials', 'Proven ROI', 'Control'] },
            { id: 7, text: 'AI in fashion is:', options: ['Revolution', 'To watch', 'Threat', 'Useful tool', 'Not necessary'] }
        ],
        personaDetails: {
            visionnaire: { title: 'Visionary', strengths: 'Quick adopter, innovation-driven', weaknesses: 'Sometimes impulsive' },
            prudent: { title: 'Prudent', strengths: 'Analytical, seeks evidence', weaknesses: 'May hesitate' },
            creatif: { title: 'Creative', strengths: 'Idea generator', weaknesses: 'May change mind often' },
            pragmatique: { title: 'Pragmatic', strengths: 'ROI-focused', weaknesses: 'Less exploratory' },
            traditionnel: { title: 'Traditional', strengths: 'Values craftsmanship', weaknesses: 'Resistant to change' }
        }
    },
    ar: {
        welcome: 'مرحبا بكم في TMIA Psycho-Quest V2.0',
        subtitle: 'استبيان سلوكي ذكي لصناعة الأزياء',
        start: 'ابدأ التحليل',
        admin: 'الإدارة',
        questionOf: 'السؤال {{current}} / {{total}}',
        next: 'التالي',
        previous: 'السابق',
        finish: 'إنهاء',
        analyzing: 'جاري التحليل...',
        answerChanges: 'التغييرات',
        restart: 'إعادة',
        personas: { visionnaire: 'رؤيوي', prudent: 'حذر', creatif: 'مبدع', pragmatique: 'براغماتي', traditionnel: 'تقليدي' },
        questions: [
            { id: 1, text: 'أي صورة تتجاوب معك أكثر؟', options: ['الابتكار', 'التحليل', 'العاطفة', 'الأعمال', 'التقليد'] },
            { id: 2, text: 'عند مواجهة تقنية جديدة، أنت:', options: ['تتبنى بسرعة', 'تنتظر الأدلة', 'متشكك', 'تحسب العائد', 'أفضل القديم'] },
            { id: 3, text: 'كم من الوقت لتسليم 5 تصاميم؟', options: ['< أسبوع', '1-2 أسابيع', '2-4 أسابيع', '> شهر', 'متغير'] },
            { id: 4, text: 'أولوية التصميم؟', options: ['الابتكار', 'تقليل المخاطر', 'العاطفة', 'العائد', 'الحرفية'] },
            { id: 5, text: 'إذا ولدت IA 10 تصاميم في 30s، أنت:', options: ['تجرب', 'تريد أدلة', 'تخشى فقدان الأسلوب', 'تحسب التكلفة', 'لا شكرا'] },
            { id: 6, text: 'ما الذي يقنعك أكثر؟', options: ['عرض مباشر', 'البيانات', 'الشهادات', 'عائد مثبت', 'التحكم'] },
            { id: 7, text: 'الذكاء الاصطناعي في الموضة:', options: ['ثورة', 'للرصد', 'تهديد', 'أداة مربحة', 'غير ضروري'] }
        ],
        personaDetails: {
            visionnaire: { title: 'رؤيوي', strengths: 'متبنى سريع، موجه نحو الابتكار', weaknesses: 'أحيانًا متهور' },
            prudent: { title: 'حذر', strengths: 'تحليلي، يبحث عن الأدلة', weaknesses: 'قد يتردد' },
            creatif: { title: 'مبدع', strengths: 'مولد أفكار', weaknesses: 'قد يغيّر رأيه كثيرًا' },
            pragmatique: { title: 'براغماتي', strengths: 'مركز على العائد', weaknesses: 'أقل استكشافًا' },
            traditionnel: { title: 'تقليدي', strengths: 'يقدّر الحرفية', weaknesses: 'مقاوم للتغيير' }
        }
    }
};

export const t = (lang = 'fr', key, vars = {}) => {
    const parts = key.split('.');
    let val = translations[lang] || translations.fr;
    for (const p of parts) {
        if (!val) break;
        val = val[p] !== undefined ? val[p] : val[p.replace(/\{\{(.*?)\}\}/g, '')];
    }
    if (typeof val === 'string') return val.replace(/\{\{(.*?)\}\}/g, (_, g) => vars[g.trim()] || '');
    return val;
};

export const getQuestions = (lang = 'fr') => {
    const q = translations[lang] && translations[lang].questions ? translations[lang].questions : translations.fr.questions;
    // Map to shape used by the app: { text, options: [{l,t,s}] }
    // We'll provide simple persona scores per option by position
    const personaOrder = ['visionnaire', 'prudent', 'creatif', 'pragmatique', 'traditionnel'];
    return q.map((item, idx) => ({
        id: item.id,
        text: item.text,
        options: item.options.map((opt, i) => ({
            l: `${item.id}_${i}`,
            t: opt,
            // Simple heuristic: each option maps stronger to a persona by index
            s: personaOrder.reduce((acc, p, pi) => ({ ...acc, [p]: (i === pi ? 2 : i === (pi + 1) % 5 ? 1 : 0) }), {})
        }))
    }));
};

export const getPersonaInfo = (lang = 'fr', persona) => {
    const details = translations[lang] && translations[lang].personaDetails ? translations[lang].personaDetails : translations.fr.personaDetails;
    return details[persona] || { title: persona };
};
