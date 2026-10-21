import React from 'react';
import { useMediRecord } from '../context/MediRecordContext';
import { Wifi, Battery, Signal, Pill } from 'lucide-react';
import { BottomNavBar } from './BottomNavBar';
import { ToastList } from './ToastList';
import { RobertoHoyTab } from './roberto/RobertoHoyTab';
import { RobertoMedicinasTab } from './roberto/RobertoMedicinasTab';
import { RobertoHistorialTab } from './roberto/RobertoHistorialTab';
import { RobertoAjustesTab } from './roberto/RobertoAjustesTab';
import { SilvanaResumenTab } from './silvana/SilvanaResumenTab';
import { SilvanaMedicinasTab } from './silvana/SilvanaMedicinasTab';
import { SilvanaHistorialTab } from './silvana/SilvanaHistorialTab';
import { SilvanaAjustesTab } from './silvana/SilvanaAjustesTab';

export const PhoneMockup: React.FC = () => {
  const { state } = useMediRecord();
  const { currentRole, currentTab, fontSize, highContrast } = state;

  const fontClass = `font-${fontSize}`;
  const contrastClass = highContrast ? 'high-contrast' : '';

  return (
    <div className={`phone-mockup-frame ${fontClass} ${contrastClass}`}>
      {/* Native-style mobile status bar */}
      <div className="phone-status-bar">
        <span>14:00</span>
        <div className="status-bar-icons">
          <Signal size={14} />
          <Wifi size={14} />
          <Battery size={16} />
        </div>
      </div>

      {/* MediRecord App Header */}
      <header className="app-brand-header">
        <div className="brand-badge">
          <Pill className="pill-icon" />
          <span>{currentRole === 'roberto' ? 'MediRecord' : 'MediRecord · Familiar'}</span>
        </div>

        <div className="role-tag">
          {currentRole === 'roberto' ? 'Roberto' : 'Silvana'}
        </div>
      </header>

      {/* Floating notifications */}
      <ToastList />

      {/* Main screen content */}
      <main className="screen-scroll-container">
        {currentRole === 'roberto' && (
          <>
            {currentTab === 'hoy' && <RobertoHoyTab />}
            {currentTab === 'medicinas' && <RobertoMedicinasTab />}
            {currentTab === 'historial' && <RobertoHistorialTab />}
            {currentTab === 'ajustes' && <RobertoAjustesTab />}
          </>
        )}

        {currentRole === 'silvana' && (
          <>
            {currentTab === 'hoy' && <SilvanaResumenTab />}
            {currentTab === 'medicinas' && <SilvanaMedicinasTab />}
            {currentTab === 'historial' && <SilvanaHistorialTab />}
            {currentTab === 'ajustes' && <SilvanaAjustesTab />}
          </>
        )}
      </main>

      {/* Bottom navigation */}
      <BottomNavBar />
    </div>
  );
};
