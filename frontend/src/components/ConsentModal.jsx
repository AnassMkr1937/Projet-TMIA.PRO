import React from 'react';

const ConsentModal = ({ open, lang, onAccept, onDecline }) => {
    if (!open) return null;
    return (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', padding: 20, borderRadius: 8, maxWidth: 600 }}>
                <h3>Consentement</h3>
                <p>Acceptez-vous le tracking comportemental pour améliorer les résultats ?</p>
                <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={onDecline}>Refuser</button>
                    <button onClick={onAccept}>Accepter</button>
                </div>
            </div>
        </div>
    );
};

export default ConsentModal;