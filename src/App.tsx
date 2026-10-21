import React, { useState } from 'react';
import { MediRecordProvider, useMediRecord } from './context/MediRecordContext';
import { PhoneMockup } from './components/PhoneMockup';
import { DemoControlBar } from './components/DemoControlBar';
import { RoleSelectionView } from './components/common/RoleSelectionView';
import type { UserRole } from './types';
import { Users } from 'lucide-react';

const MediRecordAppInner: React.FC = () => {
  const { setRole } = useMediRecord();
  // By default, start with the full phone app, or show role picker if chosen
  const [inRoleSelection, setInRoleSelection] = useState(false);

  const handleRoleSelected = (role: UserRole) => {
    setRole(role);
    setInRoleSelection(false);
  };

  return (
    <div className="presentation-layout">
      {/* Phone container */}
      {inRoleSelection ? (
        <div className="phone-mockup-frame">
          <RoleSelectionView onSelectRole={handleRoleSelected} />
        </div>
      ) : (
        <PhoneMockup />
      )}

      {/* Floating Presentation Controls */}
      <DemoControlBar />

      {/* Role Picker Toggle button (Desktop bottom corner or subtle link) */}
      <div style={{ marginTop: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
        <button
          onClick={() => setInRoleSelection(!inRoleSelection)}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#A3C5BA',
            fontSize: 13,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            textDecoration: 'underline'
          }}
        >
          <Users size={14} />
          {inRoleSelection ? 'Volver a la aplicación' : 'Ver pantalla de bienvenida y selección de rol'}
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <MediRecordProvider>
      <MediRecordAppInner />
    </MediRecordProvider>
  );
}
