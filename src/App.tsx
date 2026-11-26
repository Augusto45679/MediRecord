import React from 'react';
import { MediRecordProvider, useMediRecord } from './context/MediRecordContext';
import { PhoneMockup } from './components/PhoneMockup';
import { RobertoAccessFlow } from './components/common/RobertoAccessFlow';
import { SilvanaAccessFlow } from './components/common/SilvanaAccessFlow';
import { AuthScreen } from './components/common/AuthScreen';

const MediRecordAppInner: React.FC = () => {
  const { state, isAuthenticated, login, register, setSpecialView } = useMediRecord();
  const { specialView } = state;

  let content: React.ReactNode;
  if (!isAuthenticated) {
    content = (
      <div className="phone-mockup-frame">
        <AuthScreen onLogin={login} onRegister={register} />
      </div>
    );
  } else if (state.loading && !state.user) {
    content = (
      <div className="phone-mockup-frame" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div role="status" style={{ fontSize: 18, fontWeight: 600, color: 'var(--color-primary-dark)' }}>
          Cargando…
        </div>
      </div>
    );
  } else if (specialView === 'onboarding-roberto') {
    content = (
      <div className="phone-mockup-frame">
        <RobertoAccessFlow onComplete={() => setSpecialView('none')} />
      </div>
    );
  } else if (specialView === 'onboarding-silvana') {
    content = (
      <div className="phone-mockup-frame">
        <SilvanaAccessFlow onComplete={() => setSpecialView('none')} />
      </div>
    );
  } else {
    content = <PhoneMockup />;
  }

  return <div className="presentation-layout">{content}</div>;
};

export default function App() {
  return (
    <MediRecordProvider>
      <MediRecordAppInner />
    </MediRecordProvider>
  );
}
