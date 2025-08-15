import React from 'react'

interface ScoreBadgeProps {
    score: number;
}

const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score }) => {
    // Determine badge color and label based on score
    let badgeColor = '';
    let textColor = '';
    let label = '';

    if (score > 70) {
        badgeColor = 'bg-badge-green';
        textColor = 'text-green-600';
        label = 'Strong';
    } else if (score > 49) {
        badgeColor = 'bg-yellow-100';
        textColor = 'text-yellow-600';
        label = 'Good Start';
    } else {
        badgeColor = 'bg-red-100';
        textColor = 'text-red-600';
        label = 'Needs Work';
    }

    return (
        <div className={`inline-flex px-3 py-1 rounded-full ${badgeColor}`}>
            <p className={`text-sm font-medium ${textColor}`}>{label}</p>
        </div>
    )
}

export default ScoreBadge
