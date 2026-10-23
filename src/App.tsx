import React from 'react';
import { MediRecordProvider, useMediRecord } from './context/MediRecordContext';
import { PhoneMockup } from './components/PhoneMockup';
import { DemoControlBar } from './components/DemoControlBar';
import { RoleSelectionView } from './components/common/RoleSelectionView';
import { RobertoAccessFlow } from './components/common/RobertoAccessFlow';
import { SilvanaAccessFlow } from './components/common/SilvanaAccessFlow';
import { LoginInitialScreen } from './components/common/LoginInitialScreen';
import { LoginGoogleConfirmScreen } from './components/common/LoginGoogleConfirmScreen';

const MediRecordAppInner: React.FC = () => {
  const { state, setRole, setSpecialView } = useMediRecord();
  const { specialView } = state;

  return (
    <div className="presentation-layout">
      {/* Phone container */}
      {specialView === 'login-1' ? (
        <div className="phone-mockup-frame">
          <LoginInitialScreen
            currentRole={state.currentRole}
            onGoogleLogin={(role) => {
              const target = role || state.currentRole;
              setRole(target);
              setSpecialView(target === 'silvana' ? 'login-2-silvana' : 'login-2-roberto');
            }}
            onEmailLogin={(email, role) => {
              const target = role || (email.toLowerCase().includes('silvana') ? 'silvana' : 'roberto');
              setRole(target);
              setSpecialView('none');
            }}
            onNavigateToRoleSelection={() => setSpecialView('welcome')}
          />
        </div>
      ) : specialView === 'login-2-roberto' ? (
        <div className="phone-mockup-frame">
          <LoginGoogleConfirmScreen
            role="roberto"
            onConfirmAccount={() => {
              setRole('roberto');
              setSpecialView('welcome');
            }}
            onChooseOtherAccount={() => setSpecialView('login-1')}
            onSwitchRole={(newRole) => {
              setRole(newRole);
              setSpecialView(newRole === 'silvana' ? 'login-2-silvana' : 'login-2-roberto');
            }}
          />
        </div>
      ) : specialView === 'login-2-silvana' ? (
        <div className="phone-mockup-frame">
          <LoginGoogleConfirmScreen
            role="silvana"
            onConfirmAccount={() => {
              setRole('silvana');
              setSpecialView('welcome');
            }}
            onChooseOtherAccount={() => setSpecialView('login-1')}
            onSwitchRole={(newRole) => {
              setRole(newRole);
              setSpecialView(newRole === 'silvana' ? 'login-2-silvana' : 'login-2-roberto');
            }}
          />
        </div>
      ) : specialView === 'welcome' ? (
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
