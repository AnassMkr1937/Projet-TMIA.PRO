import React, { useMemo } from 'react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, Legend } from 'recharts';

const DEFAULT_LABELS = {
    visionnaire: 'Visionnaire',
    prudent: 'Prudent',
    creatif: 'Créatif',
    pragmatique: 'Pragmatique',
    traditionnel: 'Traditionnel'
};

function humanizeKey(key) {
    if (!key) return '';
    return DEFAULT_LABELS[key] || (key.charAt(0).toUpperCase() + key.slice(1));
}

export default function ProRadarChart({ scores = {}, max = 5, color = '#8884d8', height = 320 }) {
    const data = useMemo(() => {
        // Convert scores object to Recharts-friendly array
        return Object.keys(scores).map(k => ({ subject: humanizeKey(k), A: Number(scores[k] || 0), fullMark: max }));
    }, [scores, max]);

    return (
        <div style={{ width: '100%', height }}>
            <ResponsiveContainer>
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
                    <PolarGrid radialLines={true} />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#334155', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, max]} tickCount={max + 1} />

                    <Radar name="Score" dataKey="A" stroke={color} fill={color} fillOpacity={0.34} />

                    <Tooltip
                        wrapperStyle={{ fontSize: 13 }}
                        formatter={(value) => [`${value}`, 'Score']}
                        itemStyle={{ color }}
                    />

                    <Legend verticalAlign="top" height={36} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
}
