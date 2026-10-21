import React from 'react';
import { useMediRecord } from '../context/MediRecordContext';
import type { MainTab } from '../types';
import { Calendar, Pill, Clock, Settings, UserCheck } from 'lucide-react';

export const BottomNavBar: React.FC = () => {
  const { state, setTab } = useMediRecord();
  const { currentRole, currentTab } = state;

  const tabs: { id: MainTab; label: string; icon: React.ComponentType<{ size?: number }> }[] = [
    {
      id: 'hoy',
      label: currentRole === 'roberto' ? 'Hoy' : 'Resumen',
      icon: currentRole === 'roberto' ? Calendar : UserCheck
    },
    {
      id: 'medicinas',
      label: 'Medicinas',
      icon: Pill
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: Clock
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
      icon: Settings
    }
  ];

  return (
    <nav className="bottom-nav-bar" aria-label="Navegación principal">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;

        return (
          <button
            key={tab.id}
            className={`nav-tab-item ${isActive ? 'active' : ''}`}
            onClick={() => setTab(tab.id)}
            aria-selected={isActive}
            role="tab"
          >
            <div className="tab-icon-wrap">
              <Icon size={22} />
            </div>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
