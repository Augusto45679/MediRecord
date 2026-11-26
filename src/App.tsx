import React from 'react';
import { MediRecordProvider, useMediRecord } from './context/MediRecordContext';
import { PhoneMockup } from './components/PhoneMockup';
import { RobertoAccessFlow } from './components/common/RobertoAccessFlow';
import { SilvanaAccessFlow } from './components/common/SilvanaAccessFlow';
import { AuthScreen } from './components/common/AuthScreen';

const MediRecordAppInner: React.FC = () => {
  const { state, isAuthenticated, login, register, logout, refresh, setSpecialView } = useMediRecord();
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
  } else if (!state.user) {
    content = (
      <div
        className="phone-mockup-frame"
        style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 14, padding: 24 }}
      >
        <div role="alert" style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)', textAlign: 'center' }}>
          No pudimos cargar tus datos
        </div>
        <div style={{ fontSize: 15, color: 'var(--color-muted)', textAlign: 'center' }}>
          Revisá tu conexión. Si el servidor se estaba iniciando, en unos segundos debería andar.
        </div>
        <button className="btn-primary" onClick={() => refresh()}>Reintentar</button>
        <button className="btn-soft" onClick={logout}>Cerrar sesión</button>
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
