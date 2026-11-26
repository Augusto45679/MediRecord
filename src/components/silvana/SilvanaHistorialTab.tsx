import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { DoseHistoryList } from '../common/DoseHistoryList';

export const SilvanaHistorialTab: React.FC = () => {
  const { state } = useMediRecord();
  const name = state.link.status === 'accepted' ? state.link.otherDisplayName ?? '' : '';
  if (!name) {
    return (
      <div className="card-white" style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: 15 }}>
        Cuando alguien acepte tu invitación vas a ver su historial acá.
      </div>
    );
  }
  return (
    <DoseHistoryList
      title={`Historial de ${name}`}
      subtitle="Seguimiento de adherencia y confirmaciones"
      whoTookIt={name}
      showWeekSummary
    />
  );
};
