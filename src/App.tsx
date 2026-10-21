import React from 'react';
import { MediRecordProvider, useMediRecord } from './context/MediRecordContext';
import { PhoneMockup } from './components/PhoneMockup';
import { DemoControlBar } from './components/DemoControlBar';
import { RoleSelectionView } from './components/common/RoleSelectionView';
import { RobertoAccessFlow } from './components/common/RobertoAccessFlow';
import { SilvanaAccessFlow } from './components/common/SilvanaAccessFlow';

const MediRecordAppInner: React.FC = () => {
  const { state, setRole, setSpecialView } = useMediRecord();
  const { specialView } = state;

  return (
    <div className="presentation-layout">
      {/* Phone container */}
      {specialView === 'welcome' ? (
        <div className="phone-mockup-frame">
          <RoleSelectionView
            onSelectRole={(role) => {
              setRole(role);
              setSpecialView('none');
            }}
          />
        </div>
      ) : specialView === 'onboarding-roberto' ? (
        <div className="phone-mockup-frame">
          <RobertoAccessFlow
            onComplete={() => {
              setRole('roberto');
              setSpecialView('none');
            }}
          />
        </div>
      ) : specialView === 'onboarding-silvana' ? (
        <div className="phone-mockup-frame">
          <SilvanaAccessFlow
            onComplete={() => {
              setRole('silvana');
              setSpecialView('none');
            }}
          />
        </div>
      ) : (
        <PhoneMockup />
      )}

      {/* Floating Presentation & E2E Testing Controls */}
      <DemoControlBar />
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
