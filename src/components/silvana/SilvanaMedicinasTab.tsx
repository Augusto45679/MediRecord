import React from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import { MedicineManager } from '../common/MedicineManager';

export const SilvanaMedicinasTab: React.FC = () => {
  const { state } = useMediRecord();
  if (state.link.status !== 'accepted') {
    return (
      <div className="card-white" style={{ textAlign: 'center', color: 'var(--color-muted)', fontSize: 15 }}>
        Cuando alguien acepte tu invitación vas a poder ver y cargar sus medicinas.
      </div>
    );
  }
  return <MedicineManager userRole="silvana" />;
};
