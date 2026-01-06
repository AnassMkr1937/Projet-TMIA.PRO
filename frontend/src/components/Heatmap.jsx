import React, { useRef, useEffect, useMemo } from 'react';

// Heatmap using Canvas. Aggregates mouse movements into a grid and paints
// a heatmap with alpha proportional to intensity. No external deps.
const Heatmap = ({ mouseMovements = [], width = 800, height = 400, xCells = 80, yCells = 40 }) => {
    const canvasRef = useRef(null);

    const grid = useMemo(() => {
        const g = Array.from({ length: yCells }, () => Array.from({ length: xCells }, () => 0));
        mouseMovements.forEach(m => {
            // Normalize coordinates to the canvas area
            const x = Math.max(0, Math.min(xCells - 1, Math.floor((m.x % width) / width * xCells)));
            const y = Math.max(0, Math.min(yCells - 1, Math.floor((m.y % height) / height * yCells)));
            if (g[y] && g[y][x] !== undefined) g[y][x] += 1;
        });
        return g;
    }, [mouseMovements, xCells, yCells, width, height]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, width, height);

        // Build a color ramp or use red with varying alpha
        const flat = grid.flat();
        const max = Math.max(...flat, 1);

        const cellW = width / xCells;
        const cellH = height / yCells;

        for (let y = 0; y < yCells; y++) {
            for (let x = 0; x < xCells; x++) {
                const v = grid[y][x];
                if (v <= 0) continue;
                const intensity = v / max; // 0..1

                // color interpolation: low -> rgba(255,200,0,alpha)  high -> rgba(255,0,0,alpha)
                const r = Math.round(255);
                const g = Math.round(200 - 200 * intensity);
                const b = Math.round(40 - 40 * intensity);
                const alpha = Math.min(0.9, 0.15 + intensity * 0.85);

                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.fillRect(Math.floor(x * cellW), Math.floor(y * cellH), Math.ceil(cellW), Math.ceil(cellH));
            }
        }
    }, [grid, width, height, xCells, yCells]);

    const total = useMemo(() => grid.flat().reduce((s, v) => s + v, 0), [grid]);
    const hotspots = useMemo(() => {
        const list = [];
        for (let y = 0; y < yCells; y++) for (let x = 0; x < xCells; x++) if (grid[y][x] > 0) list.push({ x, y, v: grid[y][x] });
        return list.sort((a, b) => b.v - a.v).slice(0, 5);
    }, [grid, xCells, yCells]);

    return (
        <div style={{ marginTop: 20 }}>
            <h4 style={{ color: '#111' }}>Heatmap</h4>
            <div style={{ width, height, background: '#fff', padding: 8, borderRadius: 8, boxShadow: '0 4px 10px rgba(0,0,0,0.06)' }}>
                <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block', borderRadius: 6 }} />
            </div>
            <div style={{ marginTop: 8, fontSize: 13, color: '#374151' }}>
                <strong>{total}</strong> mouvements capturés — Hotspots: {hotspots.map(h => `(${h.x},${h.y}:${h.v})`).join(' ')}
            </div>
        </div>
    );
};

export default Heatmap;