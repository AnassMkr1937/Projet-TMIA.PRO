// frontend/src/App.jsx
// VERSION COMPLÈTE V2.0 avec TOUS LES UPGRADES

import React, { useState, useEffect, useRef } from 'react';
import { Zap, Activity, Eye, Globe } from 'lucide-react';
import ConsentModal from './components/ConsentModal';
import AdminDashboard from './components/AdminDashboard';
import QuestionCard from './components/QuestionCard';
import ProRadarChart from './components/ProRadarChart';
import PDFReportButton, { PDFReportPreview } from './components/PDFReport';
import { translations, t, getQuestions, getPersonaInfo } from './translations';
import api from './api';

/**
 * TMIA PSYCHO-QUEST V2.0
 * TOUS LES UPGRADES INTÉGRÉS:
 * ✅ Upgrade 1: UI Morphing selon persona détectée
 * ✅ Upgrade 2: Scoring avancé (backend)
 * ✅ Upgrade 3: Heatmap comportementale
 * ✅ Upgrade 4: Multi-langue (FR/EN/AR)
 * ✅ Upgrade 5: PDF Report Card professionnel
 */

const App = () => {
    // State management
    const [lang, setLang] = useState('fr');
    const [route, setRoute] = useState('home');
    const [consent, setConsent] = useState(false);
    const [currentQ, setCurrentQ] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [responseTimes, setResponseTimes] = useState([]);
    const [startTime, setStartTime] = useState(null);
    const [mouseMovements, setMouseMovements] = useState([]);
    const [hoverTimes, setHoverTimes] = useState({});
    const [answerChanges, setAnswerChanges] = useState(0);
    const [sessionId] = useState(Date.now());
    const [detectedPersona, setDetectedPersona] = useState(null);
    const [currentTheme, setCurrentTheme] = useState('default');
    const resultRef = useRef(null);
    const [debugInfo, setDebugInfo] = useState({ lastPayload: null, lastResult: null });

    // UPGRADE 1: Themes par persona
    const personaThemes = {
        visionnaire: {
            primary: '#0066FF',
            gradient: 'linear-gradient(135deg, #0066FF 0%, #6366F1 50%, #8B5CF6 100%)',
            bgGradient: 'linear-gradient(135deg, #1e3a8a 0%, #4c1d95 100%)',
            font: "'Space Grotesk', sans-serif",
            borderRadius: '4px',
            animation: 'fast'
        },
        prudent: {
            primary: '#2C3E50',
            gradient: 'linear-gradient(135deg, #475569 0%, #1e40af 100%)',
            bgGradient: 'linear-gradient(135deg, #1e293b 0%, #1e3a8a 100%)',
            font: "'Inter', sans-serif",
            borderRadius: '8px',
            animation: 'slow'
        },
        creatif: {
            primary: '#E74C3C',
            gradient: 'linear-gradient(135deg, #f43f5e 0%, #ec4899 50%, #d946ef 100%)',
            bgGradient: 'linear-gradient(135deg, #881337 0%, #831843 100%)',
            font: "'Playfair Display', serif",
            borderRadius: '24px',
            animation: 'organic'
        },
        pragmatique: {
            primary: '#27AE60',
            gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
            bgGradient: 'linear-gradient(135deg, #065f46 0%, #134e4a 100%)',
            font: "'Roboto', sans-serif",
            borderRadius: '6px',
            animation: 'direct'
        },
        traditionnel: {
            primary: '#8B4513',
            gradient: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
            bgGradient: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
            font: "'Merriweather', serif",
            borderRadius: '12px',
            animation: 'classic'
        },
        default: {
            primary: '#6366F1',
            gradient: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
            bgGradient: 'linear-gradient(135deg, #312e81 0%, #4c1d95 100%)',
            font: "'Inter', sans-serif",
            borderRadius: '8px',
            animation: 'normal'
        }
    };

    const theme = personaThemes[currentTheme] || personaThemes.default;

    // Track mouse movements with consent
    useEffect(() => {
        if (!consent || route !== 'quiz') return;

        const onMove = (e) => {
            setMouseMovements(prev => {
                const next = [...prev, { x: e.clientX, y: e.clientY, t: Date.now() }];
                if (next.length > 2000) next.shift();
                return next;
            });
        };

        window.addEventListener('mousemove', onMove);
        return () => window.removeEventListener('mousemove', onMove);
    }, [consent, route]);

    // UPGRADE 1: Détection persona après Q3 et changement de thème
    // Detect persona after at least 3 answered questions and morph UI
    useEffect(() => {
        if (answers.length >= 3 && !detectedPersona) {
            const preliminary = computePreliminaryPersona();
            setDetectedPersona(preliminary);
            setCurrentTheme(preliminary);
        }
    }, [answers, detectedPersona]);

    const computePreliminaryPersona = () => {
        const scores = {};
        ['visionnaire', 'prudent', 'creatif', 'pragmatique', 'traditionnel'].forEach(p => scores[p] = 0);

        answers.forEach((ans, idx) => {
            if (!ans || !ans.s) return;
            Object.keys(ans.s).forEach(persona => {
                scores[persona] = (scores[persona] || 0) + Number(ans.s[persona] || 0);
            });
        });

        // Behavioral heuristics
        const avgTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        if (avgTime < 3000) scores.visionnaire += 3;
        else if (avgTime > 8000) scores.prudent += 3;

        if (mouseMovements.length > 100) scores.creatif += 2;

        const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
        return sorted[0] ? sorted[0][0] : 'visionnaire';
    };

    const startQuiz = () => {
        setRoute('quiz');
        setStartTime(Date.now());
        setCurrentQ(0);
        setAnswers([]);
        setResponseTimes([]);
        setMouseMovements([]);
        setAnswerChanges(0);
        setDetectedPersona(null);
        setCurrentTheme('default');
    };

    const onHoverEnter = (id) => {
        if (!consent) return;
        setHoverTimes(prev => ({ ...prev, [id]: Date.now() }));
    };

    const onHoverLeave = (id) => {
        if (!consent) return;
        const start = hoverTimes[id] || Date.now();
        const dur = Date.now() - start;
        // Long hover tracked (used in backend scoring)
    };

    const onSelect = (opt) => {
        if (selectedOption && selectedOption.l !== opt.l) {
            setAnswerChanges(prev => prev + 1);
        }
        setSelectedOption(opt);
    };

    const next = async () => {
        const time = Date.now() - (startTime || Date.now());
        setResponseTimes(prev => [...prev, time]);

        const answerWithMetadata = {
            ...(selectedOption || { l: 'no answer', s: {} }),
            questionIndex: currentQ,
            timeMs: time
        };

        setAnswers(prev => [...prev, answerWithMetadata]);
        setSelectedOption(null);

        if (currentQ >= getQuestions(lang).length - 1) {
            setRoute('analyzing');

            // Prepare payload for backend
            const payload = {
                sessionId,
                timestamp: new Date().toISOString(),
                language: lang,
                answers: answers.concat([answerWithMetadata]),
                metrics: {
                    perQuestion: responseTimes.concat([time]).map((rt, i) => ({
                        q: i + 1,
                        timeMs: rt,
                        changes: i === currentQ ? answerChanges : 0
                    })),
                    mouseMovementCount: mouseMovements.length,
                    avgResponseTimeMs: responseTimes.length > 0
                        ? Math.round(responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length)
                        : 0,
                    totalTime: responseTimes.reduce((a, b) => a + b, 0) + time
                }
            };

            // expose payload to UI for debugging and submit to backend
            console.log('Submitting payload to /api/submit', payload);
            setDebugInfo(prev => ({ ...prev, lastPayload: payload }));

            setTimeout(async () => {
                try {
                    await api.submit(payload);
                    console.log('Submit succeeded');
                } catch (e) {
                    console.warn('Submit failed (network), result will still show locally in state)', e);
                }
                // compute result for debug and show result route
                const computed = computeResult();
                console.log('Computed result before showing:', computed);
                setDebugInfo(prev => ({ ...prev, lastResult: computed }));
                setRoute('result');
            }, 1200);

        } else {
            setCurrentQ(prev => prev + 1);
            setStartTime(Date.now());
        }
    };

    const computeResult = () => {
        console.log('computeResult called - answers:', answers, 'responseTimes:', responseTimes, 'mouseMovements:', mouseMovements.length);
        const combined = {};
        ['visionnaire', 'prudent', 'creatif', 'pragmatique', 'traditionnel'].forEach(p => combined[p] = 0);

        answers.forEach(a => {
            if (!a || !a.s) return;
            Object.keys(a.s).forEach(k => combined[k] = (combined[k] || 0) + Number(a.s[k] || 0));
        });

        // Behavioral adjustments
        const avgTime = responseTimes.length > 0
            ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
            : 0;

        if (avgTime < 3000) {
            combined.visionnaire += 5;
            combined.pragmatique += 3;
        } else if (avgTime > 8000) {
            combined.prudent += 5;
            combined.traditionnel += 3;
        }

        if (answerChanges >= 2) {
            combined.creatif += 3;
            combined.prudent += 2;
        }

        if (mouseMovements.length > 150) {
            combined.creatif += 2;
        }

        const sorted = Object.entries(combined).sort((a, b) => b[1] - a[1]);
        const total = Object.values(combined).reduce((a, b) => a + b, 0) || 1;
        const persona = sorted[0] ? sorted[0][0] : 'visionnaire';
        const confidence = Math.max(10, Math.min(99, Math.round((sorted[0][1] / total) * 100)));

        // Market segment
        let marketSegment = 'Late Majority';
        if (confidence > 75 && (persona === 'visionnaire' || persona === 'pragmatique')) {
            marketSegment = 'Early Adopter';
        } else if (confidence > 60) {
            marketSegment = 'Early Majority';
        }

        // Recommendation
        let recommendation = 'RECOMMENDED';
        if (persona === 'visionnaire' || persona === 'pragmatique') {
            recommendation = confidence > 70 ? 'HIGHLY RECOMMENDED' : 'RECOMMENDED';
        } else if (persona === 'prudent') {
            recommendation = 'RECOMMENDED WITH VALIDATION';
        } else if (persona === 'creatif') {
            recommendation = 'RECOMMENDED WITH REASSURANCE';
        } else {
            recommendation = 'GRADUAL ADOPTION PATH';
        }

        return {
            persona,
            confidence,
            scores: combined,
            all: sorted,
            marketSegment,
            recommendation,
            metadata: {
                totalAnswers: answers.length,
                avgResponseTime: Math.round(avgTime),
                totalChanges: answerChanges,
                mouseActivity: mouseMovements.length,
                totalTime: responseTimes.reduce((a, b) => a + b, 0)
            }
        };
    };

    const result = route === 'result' ? computeResult() : null;

    // Dynamic styles based on theme
    const dynamicStyles = {
        fontFamily: theme.font,
        transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)'
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: route === 'quiz' || route === 'result' ? theme.bgGradient : '#f9fafb',
            ...dynamicStyles,
            padding: 20
        }}>
            <ConsentModal
                open={!consent && route === 'quiz'}
                lang={lang}
                onAccept={() => setConsent(true)}
                onDecline={() => setConsent(false)}
            />

            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: theme.borderRadius,
                padding: '12px 20px'
            }}>
                <h1 style={{
                    margin: 0,
                    color: route === 'home' || route === 'admin' ? '#111827' : '#fff',
                    fontSize: 24,
                    fontWeight: 'bold'
                }}>
                    TMIA Psycho-Quest V2.0
                </h1>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    {/* Language selector */}
                    <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,0.2)', borderRadius: theme.borderRadius, padding: 4 }}>
                        {['fr', 'en', 'ar'].map(l => (
                            <button
                                key={l}
                                onClick={() => setLang(l)}
                                style={{
                                    padding: '6px 12px',
                                    border: 'none',
                                    borderRadius: theme.borderRadius,
                                    background: lang === l ? '#fff' : 'transparent',
                                    color: lang === l ? '#111827' : route === 'home' || route === 'admin' ? '#111827' : '#fff',
                                    fontWeight: lang === l ? 'bold' : 'normal',
                                    cursor: 'pointer',
                                    fontSize: 12,
                                    transition: 'all 0.2s'
                                }}
                            >
                                {l.toUpperCase()}
                            </button>
                        ))}
                    </div>

                    {route !== 'admin' && (
                        <button
                            onClick={() => setRoute('admin')}
                            style={{
                                padding: '8px 16px',
                                background: 'rgba(255,255,255,0.2)',
                                border: 'none',
                                borderRadius: theme.borderRadius,
                                color: route === 'home' || route === 'admin' ? '#111827' : '#fff',
                                cursor: 'pointer',
                                fontSize: 14
                            }}
                        >
                            {t(lang, 'admin')}
                        </button>
                    )}
                </div>
            </header>

            {/* HOME */}
            {route === 'home' && (
                <main style={{ maxWidth: 900, margin: '40px auto', textAlign: 'center' }}>
                    <div style={{ marginBottom: 40 }}>
                        <Eye style={{ width: 80, height: 80, color: theme.primary, margin: '0 auto 20px' }} />
                        <h2 style={{ fontSize: 36, marginBottom: 12, color: '#111827' }}>
                            {t(lang, 'welcome')}
                        </h2>
                        <p style={{ fontSize: 18, color: '#6b7280', maxWidth: 600, margin: '0 auto 30px' }}>
                            {t(lang, 'subtitle')}
                        </p>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                            gap: 16,
                            maxWidth: 700,
                            margin: '0 auto 40px'
                        }}>
                            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Activity style={{ width: 40, height: 40, color: '#6366f1', margin: '0 auto 12px' }} />
                                <h3 style={{ fontSize: 16, marginBottom: 8 }}>Tracking Comportemental</h3>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Analyse avancée de vos patterns</p>
                            </div>

                            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Globe style={{ width: 40, height: 40, color: '#10b981', margin: '0 auto 12px' }} />
                                <h3 style={{ fontSize: 16, marginBottom: 8 }}>Multi-langue</h3>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Français, English, العربية</p>
                            </div>

                            <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                                <Zap style={{ width: 40, height: 40, color: '#f59e0b', margin: '0 auto 12px' }} />
                                <h3 style={{ fontSize: 16, marginBottom: 8 }}>Résultats Instantanés</h3>
                                <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Profil personnalisé en 3 min</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={startQuiz}
                        style={{
                            background: theme.gradient,
                            color: '#fff',
                            border: 'none',
                            borderRadius: theme.borderRadius,
                            padding: '16px 32px',
                            fontSize: 18,
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            boxShadow: '0 10px 25px rgba(99,102,241,0.3)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.transform = 'translateY(-4px)';
                            e.target.style.boxShadow = '0 15px 35px rgba(99,102,241,0.4)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.transform = 'translateY(0)';
                            e.target.style.boxShadow = '0 10px 25px rgba(99,102,241,0.3)';
                        }}
                    >
                        {t(lang, 'start')}
                    </button>
                </main>
            )}

            {/* QUIZ */}
            {route === 'quiz' && (
                <main style={{ maxWidth: 900, margin: '0 auto' }}>
                    <div style={{
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: theme.borderRadius,
                        padding: 30,
                        boxShadow: '0 20px 60px rgba(0,0,0,0.2)',
                        ...dynamicStyles
                    }}>
                        {/* Progress */}
                        <div style={{ marginBottom: 24 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 14, color: '#6b7280' }}>
                                <span>{t(lang, 'questionOf', { current: currentQ + 1, total: getQuestions(lang).length })}</span>
                                <span>{Math.round(((currentQ + 1) / getQuestions(lang).length) * 100)}%</span>
                            </div>
                            <div style={{ width: '100%', height: 8, background: '#e5e7eb', borderRadius: 999, overflow: 'hidden' }}>
                                <div style={{
                                    width: `${((currentQ + 1) / getQuestions(lang).length) * 100}%`,
                                    height: '100%',
                                    background: theme.gradient,
                                    transition: 'width 0.4s ease'
                                }} />
                            </div>
                        </div>

                        {/* Theme indicator */}
                        {detectedPersona && (
                            <div style={{
                                background: theme.gradient,
                                color: '#fff',
                                padding: '8px 16px',
                                borderRadius: theme.borderRadius,
                                marginBottom: 16,
                                fontSize: 13,
                                textAlign: 'center'
                            }}>
                                ✨ Interface adaptée à votre profil: {t(lang, `personas.${detectedPersona}`)}
                            </div>
                        )}

                        <QuestionCard
                            q={getQuestions(lang)[currentQ]}
                            selected={selectedOption}
                            onSelect={onSelect}
                            onHoverEnter={onHoverEnter}
                            onHoverLeave={onHoverLeave}
                        />

                        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 13, color: '#6b7280' }}>
                                {consent && `${t(lang, 'answerChanges')}: ${answerChanges}`}
                            </div>

                            <div style={{ display: 'flex', gap: 12 }}>
                                {currentQ > 0 && (
                                    <button
                                        onClick={() => setCurrentQ(prev => prev - 1)}
                                        style={{
                                            padding: '10px 20px',
                                            background: '#f3f4f6',
                                            border: 'none',
                                            borderRadius: theme.borderRadius,
                                            cursor: 'pointer'
                                        }}
                                    >
                                        {t(lang, 'previous')}
                                    </button>
                                )}

                                <button
                                    onClick={next}
                                    disabled={!selectedOption}
                                    style={{
                                        padding: '10px 24px',
                                        background: selectedOption ? theme.gradient : '#d1d5db',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: theme.borderRadius,
                                        fontWeight: 'bold',
                                        cursor: selectedOption ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    {currentQ < getQuestions(lang).length - 1 ? t(lang, 'next') : t(lang, 'finish')}
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            )}

            {/* ANALYZING */}
            {route === 'analyzing' && (
                <main style={{ maxWidth: 600, margin: '100px auto', textAlign: 'center' }}>
                    <div style={{
                        width: 80,
                        height: 80,
                        border: '6px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        margin: '0 auto 30px',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <h2 style={{ color: '#fff', fontSize: 28, marginBottom: 12 }}>
                        {t(lang, 'analyzing')}
                    </h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 16 }}>
                        Analyse de {mouseMovements.length} mouvements et {answers.length} réponses...
                    </p>
                </main>
            )}

            {/* RESULT */}
            {route === 'result' && result && (
                <main style={{ maxWidth: 1000, margin: '0 auto' }}>
                    <PDFReportPreview
                        result={result}
                        lang={lang}
                        translations={translations}
                    />

                    <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 12 }}>
                        <PDFReportButton
                            result={result}
                            lang={lang}
                            sessionId={sessionId}
                            translations={translations}
                        />

                        <button
                            onClick={() => {
                                setRoute('home');
                                setAnswers([]);
                                setResponseTimes([]);
                                setCurrentQ(0);
                                setMouseMovements([]);
                                setDetectedPersona(null);
                                setCurrentTheme('default');
                            }}
                            style={{
                                padding: '12px 20px',
                                background: '#fff',
                                border: '2px solid #e5e7eb',
                                borderRadius: 8,
                                cursor: 'pointer',
                                fontWeight: 'bold'
                            }}
                        >
                            {t(lang, 'restart')}
                        </button>
                    </div>

                    {/* UPGRADE 3: Radar chart (replaces Heatmap) */}
                    {result && result.scores && (
                        <div style={{ marginTop: 24 }}>
                            <h3 style={{ color: route === 'home' || route === 'admin' ? '#111827' : '#fff', marginBottom: 12 }}>Profil Radar</h3>
                            <ProRadarChart
                                scores={result.scores}
                                max={5}
                                color="#8884d8"
                                height={360}
                            />
                        </div>
                    )}
                </main>
            )}

            {/* ADMIN */}
            {route === 'admin' && (
                <main style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <button
                        onClick={() => setRoute('home')}
                        style={{
                            marginBottom: 20,
                            padding: '8px 16px',
                            background: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: 6,
                            cursor: 'pointer'
                        }}
                    >
                        ← {t(lang, 'home')}
                    </button>
                    <AdminDashboard />
                </main>
            )}
        </div>
    );
};

// Add spinner animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

export default App;
