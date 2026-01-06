const PERSONAS = ['visionnaire', 'prudent', 'creatif', 'pragmatique', 'traditionnel'];

function _initScores() {
    const s = {};
    PERSONAS.forEach(p => s[p] = 0);
    return s;
}

function scoreFromAnswers(answers = []) {
    const scores = _initScores();
    answers.forEach(a => {
        if (!a || !a.s) return;
        Object.keys(a.s).forEach(k => {
            const key = k.toLowerCase();
            if (scores[key] !== undefined) scores[key] += Number(a.s[k] || 0);
        });
    });
    return scores;
}

function scoreFromBehavior(perQuestion = [], globalMetrics = {}) {
    const scores = _initScores();

    const times = perQuestion.map(p => Number(p.timeMs || 0)).filter(Boolean);
    const avgTime = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const totalTime = times.reduce((a, b) => a + b, 0);

    // Quick decision makers -> visionnaire / pragmatique
    if (avgTime > 0 && avgTime < 3000) {
        scores.visionnaire += 3;
        scores.pragmatique += 1.5;
    }

    // Moderate -> curious / balanced
    if (avgTime >= 3000 && avgTime < 8000) {
        scores.creatif += 1.2;
        scores.prudent += 0.6;
    }

    // Slow, careful -> prudent / traditionnel
    if (avgTime >= 8000) {
        scores.prudent += 3;
        scores.traditionnel += 1.8;
    }

    // High mouse activity often correlates with exploratory / creative behavior
    if ((globalMetrics.mouseMovementCount || 0) > 200) {
        scores.creatif += 2.5;
    } else if ((globalMetrics.mouseMovementCount || 0) > 80) {
        scores.creatif += 1;
    }

    // Answer changes indicate indecision or exploration
    const totalChanges = perQuestion.reduce((s, q) => s + (Number(q.changes || 0) || 0), 0) || 0;
    if (totalChanges >= 3) {
        scores.creatif += 1.5;
        scores.prudent += 1;
    }

    // Long total time but low changes -> deliberate/traditional
    if (totalTime > 30000 && totalChanges <= 1) {
        scores.traditionnel += 2;
        scores.prudent += 1;
    }

    return scores;
}

function normalize(scores) {
    const max = Math.max(...Object.values(scores), 1);
    const out = {};
    Object.keys(scores).forEach(k => out[k] = Number((scores[k] / max).toFixed(4)));
    return out;
}

function marketSegmentFromMetrics(globalMetrics = {}) {
    const mm = globalMetrics.mouseMovementCount || 0;
    const avg = globalMetrics.avgResponseTimeMs || 0;
    if (avg < 3000 && mm > 150) return 'early_adopter';
    if (avg < 6000 && mm > 80) return 'innovator';
    if (avg >= 6000 && avg < 12000) return 'mainstream';
    return 'conservative';
}

function computeFinalScore(payload = {}) {
    const answers = payload.answers || [];
    const perQuestion = (payload.metrics && payload.metrics.perQuestion) || [];
    const globalMetrics = payload.metrics || {};
    const meta = { totalAnswers: answers.length, totalMouseEvents: globalMetrics.mouseMovementCount || 0 };

    const ansScores = scoreFromAnswers(answers);
    const behavScores = scoreFromBehavior(perQuestion, globalMetrics);

    // Dynamic weighting: if behavioral signals are strong, increase their weight
    const behaviorSignal = Math.min(1, (globalMetrics.mouseMovementCount || 0) / 400 + (perQuestion.reduce((s, q) => s + (Number(q.changes || 0) || 0), 0) / 10));
    const wAns = 0.65 * (1 - behaviorSignal) + 0.45 * (1 - Math.max(0, behaviorSignal - 0.5));
    const wBeh = 1 - wAns;

    const merged = {};
    PERSONAS.forEach(p => {
        merged[p] = (Number(ansScores[p] || 0) * wAns) + (Number(behavScores[p] || 0) * wBeh);
    });

    // Apply small penalties/bonuses
    const totalChanges = perQuestion.reduce((s, q) => s + (Number(q.changes || 0) || 0), 0);
    if (totalChanges > 4) merged.creatif += 0.6; // exploration boost
    if ((globalMetrics.avgResponseTimeMs || 0) > 12000) merged.traditionnel += 0.8;

    const normalized = normalize(merged);

    const sorted = Object.entries(normalized).sort((a, b) => b[1] - a[1]);
    const top = sorted[0] || ['visionnaire', 0];
    const persona = top[0];

    const rawScore = top[1];
    const confidence = Math.round(Math.min(98, (rawScore * 100) + (Math.max(0, rawScore - sorted[1]?.[1] || 0) * 20)));

    const marketSegment = marketSegmentFromMetrics(globalMetrics);

    const recommendationMap = {
        visionnaire: 'Focus on new features and rapid delivery',
        prudent: 'Emphasize security and predictable ROI',
        creatif: 'Offer customization and discovery workshops',
        pragmatique: 'Show practical use-cases and integrations',
        traditionnel: 'Provide stability, references and support'
    };

    return {
        persona,
        confidence,
        scores: merged,
        normalized,
        sorted,
        marketSegment,
        recommendation: recommendationMap[persona] || '',
        metadata: Object.assign({}, meta, { avgResponseTimeMs: globalMetrics.avgResponseTimeMs || 0, totalChanges })
    };
}

module.exports = { computeFinalScore };
