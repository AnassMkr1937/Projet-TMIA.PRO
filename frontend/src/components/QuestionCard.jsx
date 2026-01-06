import React from 'react';

const QuestionCard = ({ q = { text: 'Question?', options: [] }, selected, onSelect, onHoverEnter, onHoverLeave }) => {
    return (
        <div>
            <h3>{q.text}</h3>
            <div style={{ display: 'grid', gap: 8 }}>
                {(q.options || [{ l: 'A', t: 'Option A' }, { l: 'B', t: 'Option B' }]).map(opt => (
                    <button
                        key={opt.l}
                        onMouseEnter={() => onHoverEnter && onHoverEnter(opt.l)}
                        onMouseLeave={() => onHoverLeave && onHoverLeave(opt.l)}
                        onClick={() => onSelect && onSelect(opt)}
                        style={{ padding: 12, borderRadius: 8, border: selected && selected.l === opt.l ? '2px solid #6366f1' : '1px solid #e5e7eb', background: '#fff' }}
                    >
                        {opt.t || opt.l}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuestionCard;