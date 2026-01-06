import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Preview component: simple structured preview of the report
export const PDFReportPreview = ({ result = {}, lang = 'fr', translations = {} }) => {
    const t = (translations && translations[lang]) ? translations[lang] : (translations && translations.fr) || {};

    const personaLabel = (t.personas && t.personas[result.persona]) || result.persona || '';
    const strengths = (t.personaStrengths && t.personaStrengths[result.persona]) || [];
    const weaknesses = (t.personaWeaknesses && t.personaWeaknesses[result.persona]) || [];
    const tmiaFit = (t.personaTmiaFit && t.personaTmiaFit[result.persona]) || '';
    const metrics = result.metadata || {};

    return (
        <div style={{ background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 6px 18px rgba(15,23,42,0.08)', fontFamily: 'Inter, Arial, sans-serif', color: '#0f172a' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', borderRadius: 10, background: 'linear-gradient(90deg,#0ea5e9, #7c3aed)', color: '#fff' }}>
                <div>
                    <div style={{ fontSize: 12, opacity: 0.95 }}>TMIA PSYCHO-QUEST</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>Persona Report Card V2.0</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 12, opacity: 0.9 }}>{t.reportDateLabel || 'Report'}</div>
                    <div style={{ fontSize: 14 }}>{new Date().toLocaleDateString()}</div>
                </div>
            </div>

            {/* Persona row */}
            <div style={{ display: 'flex', gap: 18, marginTop: 18, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                    <h2 style={{ margin: 0, fontSize: 22 }}>{personaLabel}</h2>
                    <div style={{ marginTop: 8, display: 'flex', gap: 12, alignItems: 'center' }}>
                        <div style={{ background: '#0f172a', color: '#fff', padding: '6px 10px', borderRadius: 18, fontWeight: 600 }}>{t.personaLabel || 'Persona'}</div>
                        <div style={{ background: 'rgba(15,23,42,0.06)', padding: '6px 10px', borderRadius: 10 }}> {result.marketSegment || ''} </div>
                    </div>
                </div>

                {/* Confidence badge */}
                <div style={{ minWidth: 120, textAlign: 'right' }}>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{t.confidenceLabel || 'Confidence'}</div>
                    <div style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ width: 64, height: 36, borderRadius: 8, background: 'linear-gradient(90deg,#34d399,#60a5fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#032' }}>
                            <strong style={{ color: '#022' }}>{result.confidence || 0}%</strong>
                        </div>
                        <div style={{ fontSize: 12, color: '#0f172a', opacity: 0.9 }}>{t.confidenceExplanation || 'Confidence score'}</div>
                    </div>
                </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{ display: 'flex', gap: 18, marginTop: 18 }}>
                <div style={{ flex: 1, background: 'rgba(14,165,233,0.03)', padding: 14, borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>✓ {t.strengths || 'Strengths'}</div>
                    </div>
                    <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                        {strengths.length ? strengths.map((s, i) => <li key={i} style={{ marginBottom: 6 }}>{s}</li>) : <li style={{ opacity: 0.7 }}>{t.noData || 'No data'}</li>}
                    </ul>
                </div>

                <div style={{ flex: 1, background: 'rgba(124,58,237,0.03)', padding: 14, borderRadius: 10 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ fontSize: 14, fontWeight: 700 }}>⚠ {t.weaknesses || 'Weaknesses'}</div>
                    </div>
                    <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                        {weaknesses.length ? weaknesses.map((w, i) => <li key={i} style={{ marginBottom: 6 }}>{w}</li>) : <li style={{ opacity: 0.7 }}>{t.noData || 'No data'}</li>}
                    </ul>
                </div>
            </div>

            {/* TMIA Fit and Metrics */}
            <div style={{ display: 'flex', gap: 18, marginTop: 18, alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>🎯 {t.tmiaFit || 'TMIA Fit'}</div>
                    <p style={{ margin: 0, color: '#334155' }}>{tmiaFit}</p>
                </div>

                <div style={{ width: 260, background: 'rgba(2,6,23,0.03)', padding: 12, borderRadius: 10 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>{t.metricsTitle || 'Behavioral Metrics'}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                        <div style={{ fontSize: 12, color: '#475569' }}>{t.totalAnswers || 'Total Answers'}</div>
                        <div style={{ fontWeight: 700, textAlign: 'right' }}>{metrics.totalAnswers || 0}</div>

                        <div style={{ fontSize: 12, color: '#475569' }}>{t.avgResponseTime || 'Avg. Response'}</div>
                        <div style={{ fontWeight: 700, textAlign: 'right' }}>{metrics.avgResponseTime ? `${Math.round(metrics.avgResponseTime)} ms` : (metrics.avgResponseTimeMs ? `${Math.round(metrics.avgResponseTimeMs)} ms` : '—')}</div>

                        <div style={{ fontSize: 12, color: '#475569' }}>{t.totalChanges || 'Answer Changes'}</div>
                        <div style={{ fontWeight: 700, textAlign: 'right' }}>{metrics.totalChanges || 0}</div>

                        <div style={{ fontSize: 12, color: '#475569' }}>{t.mouseActivity || 'Mouse Activity'}</div>
                        <div style={{ fontWeight: 700, textAlign: 'right' }}>{metrics.mouseActivity || metrics.mouseMovementCount || 0}</div>

                        <div style={{ fontSize: 12, color: '#475569' }}>{t.totalTime || 'Total Time'}</div>
                        <div style={{ fontWeight: 700, textAlign: 'right' }}>{metrics.totalTime ? `${Math.round(metrics.totalTime / 1000)} s` : '—'}</div>
                    </div>
                </div>
            </div>

        </div>
    );
};

const PDFReportButton = ({ result = {}, lang = 'fr', translations = {} }) => {
    const wrapperRef = useRef(null);

    // Generate a multi-page PDF using jsPDF and html2canvas snapshots
    const generate = async () => {
        const doc = new jsPDF({ unit: 'pt', format: 'a4' });
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();

        // Create a simple HTML snapshot for the report header
        const headerHtml = document.createElement('div');
        headerHtml.style.width = '800px';
        headerHtml.style.padding = '20px';
        headerHtml.style.fontFamily = 'Arial, sans-serif';
        headerHtml.innerHTML = `
            <h1>TMIA Psycho-Quest Report</h1>
            <h2>Persona: ${result.persona} (${result.confidence}%)</h2>
            <p><strong>Market segment:</strong> ${result.marketSegment}</p>
            <p><strong>Recommendation:</strong> ${result.recommendation}</p>
        `;

        document.body.appendChild(headerHtml);
        try {
            const canvas = await html2canvas(headerHtml, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');
            const imgW = pageW - 40;
            const imgH = (canvas.height * imgW) / canvas.width;
            doc.addImage(imgData, 'PNG', 20, 20, imgW, imgH);

            // Add a second page with metadata and scores
            doc.addPage();
            const meta = JSON.stringify(result.metadata || {}, null, 2);
            doc.setFontSize(11);
            doc.text('Behavioral Metrics & Metadata', 20, 40);
            const split = doc.splitTextToSize(meta, pageW - 40);
            doc.text(split, 20, 60);

            // Scores table
            doc.addPage();
            doc.text('Persona Scores', 20, 40);
            const scores = result.scores || {};
            let y = 60;
            Object.keys(scores).forEach(k => {
                doc.text(`${k}: ${Math.round(scores[k])}`, 20, y);
                y += 18;
            });

            doc.save(`tmia-report-${result.persona || 'report'}.pdf`);
        } finally {
            headerHtml.remove();
        }
    };

    return (
        <button onClick={generate} style={{ padding: '12px 20px', background: '#0f172a', color: '#fff', borderRadius: 8 }}>Télécharger PDF</button>
    );
};

export default PDFReportButton;