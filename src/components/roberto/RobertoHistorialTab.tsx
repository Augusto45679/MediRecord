import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { DoseHistoryList } from '../common/DoseHistoryList';

export const RobertoHistorialTab: React.FC = () => {
  const { state } = useMediRecord();
  return (
    <DoseHistoryList
      title="Tus registros"
      subtitle="Historial diario de tomas y confirmaciones"
      whoTookIt={state.user?.displayName ?? 'vos'}
      showWeekSummary
    />
  );
};
