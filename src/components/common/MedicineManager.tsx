import React, { useState } from 'react';
import { useMediRecord } from '../../context/MediRecordContext';
import type { Medicine } from '../../types';
import {
  Plus,
  Pill,
  ArrowLeft,
  PauseCircle,
  Trash2,
  CheckCircle2,
  Save,
  ChevronRight,
  MessageSquare
} from 'lucide-react';

interface MedicineManagerProps {
  userRole: 'roberto' | 'silvana';
}

export const MedicineManager: React.FC<MedicineManagerProps> = ({ userRole }) => {
  const {
    state,
    addMedicine,
    togglePauseMedicine,
    deleteMedicine,
    showToast
  } = useMediRecord();

  const isRoberto = userRole === 'roberto';

  const [selectedMed, setSelectedMed] = useState<Medicine | null>(null);
  const [editingMed, setEditingMed] = useState<Medicine | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState<Medicine | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Medicine | null>(null);

  // Edit state
  const [editDose, setEditDose] = useState('');
  const [editTime1, setEditTime1] = useState('');
  const [editTime2, setEditTime2] = useState('');

  // Add Wizard State (Steps 1 to 4 from I-02 to I-05)
  const [addStep, setAddStep] = useState(1);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDose, setNewMedDose] = useState('1 comprimido de 10 mg');
  const [newMedTime1, setNewMedTime1] = useState('09:00');
  const [newMedTime2, setNewMedTime2] = useState('');

  const handleOpenEdit = (med: Medicine) => {
    setEditingMed(med);
    setEditDose(med.dose);
    setEditTime1(med.times[0] || '');
    setEditTime2(med.times[1] || '');
  };

  const handleSaveEdit = () => {
    if (!editingMed) return;
    const times = [editTime1];
    if (editTime2.trim()) times.push(editTime2);

    deleteMedicine(editingMed.id);
    addMedicine({
      name: editingMed.name,
      dose: editDose,
      concentration: editDose.split('de ')[1] || editingMed.concentration,
      amount: editDose.split(' de')[0] || editingMed.amount,
      times,
      frequency: editingMed.frequency,
      addedBy: editingMed.addedBy,
      status: editingMed.status
    });
    setEditingMed(null);
    showToast('Cambios guardados', 'success', `${editingMed.name} fue actualizada.`);
  };

  const handleStartAdd = () => {
    setAddStep(1);
    setNewMedName('');
    setNewMedDose('1 comprimido de 10 mg');
    setNewMedTime1('09:00');
    setNewMedTime2('');
    setShowAddModal(true);
  };

  const handleFinishAdd = () => {
    if (!newMedName.trim()) return;

    const times = [newMedTime1];
    if (newMedTime2.trim()) times.push(newMedTime2);

    addMedicine({
      name: newMedName.trim(),
      dose: newMedDose,
      concentration: newMedDose.split('de ')[1] || '10 mg',
      amount: newMedDose.split(' de')[0] || '1 comprimido',
      times,
      frequency: 'Todos los días',
      addedBy: isRoberto ? 'Roberto' : 'Silvana',
      status: 'active'
    });

    setShowAddModal(false);
  };

  const handleNotifySilvana = (medName: string) => {
    showToast(
      'Mensaje enviado a Silvana',
      'info',
      `Le avisamos a Silvana para revisar ${medName}.`
    );
  };

  // If viewing details of a medicine for Roberto (Screen H-02)
  if (selectedMed) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <button className="btn-back" onClick={() => setSelectedMed(null)}>
            <ArrowLeft size={16} /> Volver
          </button>
        </div>

        <div>
          <h1 className="screen-title" style={{ fontSize: 26 }}>
            {selectedMed.name}
          </h1>
          <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
            Detalles de tu medicina
          </div>
        </div>

        <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <div style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, color: 'var(--color-primary)', fontWeight: 700 }}>
              Dosis indicada
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)', marginTop: 2 }}>
              {selectedMed.dose}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 600 }}>
              Frecuencia
            </div>
            <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--color-primary-dark)', marginTop: 2 }}>
              {selectedMed.frequency}
            </div>
          </div>

          <div>
            <div style={{ fontSize: 13, color: 'var(--color-muted)', fontWeight: 600 }}>
              Horarios
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              {selectedMed.times.map(t => (
                <span
                  key={t}
                  style={{
                    padding: '4px 12px',
                    borderRadius: 999,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid var(--border-mint)',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--color-primary)'
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-mint)', paddingTop: 10, fontSize: 13, color: 'var(--color-muted)' }}>
            La cargó {selectedMed.addedBy}
          </div>
        </div>

        {isRoberto && (
          <div className="card-white" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.4 }}>
              Si sentís molestias, cambios de dosis o algo no está bien, avisale a Silvana para que revise las indicaciones con tu médico.
            </div>
            <button
              className="btn-soft"
              onClick={() => handleNotifySilvana(selectedMed.name)}
            >
              <MessageSquare size={16} /> Avisarle a Silvana
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 className="screen-title" style={{ fontSize: 'var(--large-title, 26px)', marginBottom: 2 }}>
            {isRoberto ? 'Tus medicinas' : 'Medicinas de Roberto'}
          </h1>
          <div className="screen-subtitle">
            {isRoberto
              ? 'Tus indicaciones médicas registradas y horarios'
              : 'Copia las indicaciones médicas que ya tiene'}
          </div>
        </div>
      </div>

      {/* Medicine list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {state.medicines.map(med => {
          const isPaused = med.status === 'paused';
          return (
            <div
              key={med.id}
              className="card-white"
              style={{
                opacity: isPaused ? 0.75 : 1,
                border: isPaused ? '1px dashed var(--border-mint)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', cursor: 'pointer' }}
                onClick={() => setSelectedMed(med)}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <div style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    backgroundColor: isPaused ? 'var(--border-subtle)' : 'var(--bg-mint)',
                    color: isPaused ? 'var(--color-muted)' : 'var(--color-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Pill size={20} />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                        {med.name}
                      </span>
                      <span style={{
                        fontSize: 11,
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: 999,
                        backgroundColor: isPaused ? '#FEE2E2' : 'var(--bg-mint)',
                        color: isPaused ? '#B91C1C' : 'var(--color-primary)'
                      }}>
                        {isPaused ? 'Pausada' : 'Activa'}
                      </span>
                    </div>

                    <div style={{ fontSize: 14, color: 'var(--color-muted)', marginTop: 2 }}>
                      {med.dose}
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--color-primary)', fontWeight: 600, marginTop: 4 }}>
                      {med.frequency} · {med.times.join(' y ')}
                    </div>
                  </div>
                </div>

                <ChevronRight size={20} color="var(--color-muted-light)" style={{ marginTop: 8 }} />
              </div>

              {/* Action buttons inside card */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: 10,
                marginTop: 2
              }}>
                <button
                  className="btn-soft"
                  onClick={() => handleOpenEdit(med)}
                  style={{ padding: '8px 12px', fontSize: 13 }}
                >
                  Editar
                </button>

                <button
                  className="btn-soft"
                  onClick={() => setShowPauseConfirm(med)}
                  style={{ padding: '8px 12px', fontSize: 13 }}
                >
                  <PauseCircle size={14} /> {isPaused ? 'Reanudar' : 'Pausar'}
                </button>

                <button
                  className="btn-danger-outline"
                  onClick={() => setShowDeleteConfirm(med)}
                  style={{ padding: '8px 12px', fontSize: 13, width: 'auto' }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add medicine button */}
      <button className="btn-primary" onClick={handleStartAdd}>
        <Plus size={20} /> Añadir medicina
      </button>

      {/* Guidance footnote */}
      <div className="card-mint" style={{ fontSize: 13, color: 'var(--color-primary-dark)', lineHeight: 1.4 }}>
        <strong>Importante:</strong> Solo Roberto puede confirmar sus tomas. La app conserva el historial aunque una medicina sea pausada o eliminada.
      </div>

      {/* ADD MEDICINE WIZARD MODAL (Steps 1 to 4 from I-02..I-05) */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="drag-handle" />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Paso {addStep} de 4
              </span>
              <button
                className="btn-back"
                onClick={() => {
                  if (addStep > 1) setAddStep(addStep - 1);
                  else setShowAddModal(false);
                }}
              >
                <ArrowLeft size={14} /> {addStep > 1 ? 'Atrás' : 'Cancelar'}
              </button>
            </div>

            {/* STEP 1: Name */}
            {addStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 className="screen-title" style={{ fontSize: 22 }}>
                  ¿Cómo se llama la medicina?
                </h2>
                <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
                  Copia el nombre tal como aparece en las indicaciones médicas.
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 6 }}>
                    Nombre de la medicina
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Enalapril, Atorvastatina, Omeprazol"
                    value={newMedName}
                    onChange={e => setNewMedName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-mint)',
                      fontSize: 16,
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  className="btn-primary"
                  disabled={!newMedName.trim()}
                  onClick={() => setAddStep(2)}
                  style={{ opacity: newMedName.trim() ? 1 : 0.5 }}
                >
                  Continuar
                </button>
              </div>
            )}

            {/* STEP 2: Dose amount */}
            {addStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 className="screen-title" style={{ fontSize: 22 }}>
                  ¿Qué cantidad {isRoberto ? 'tomás' : 'toma'}?
                </h2>
                <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
                  Por cada toma, según sus indicaciones. Incluí cantidad y concentración.
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 6 }}>
                    Cantidad por toma
                  </label>
                  <input
                    type="text"
                    value={newMedDose}
                    onChange={e => setNewMedDose(e.target.value)}
                    placeholder="Ej. 1 comprimido de 10 mg"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-mint)',
                      fontSize: 16,
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                <button className="btn-primary" onClick={() => setAddStep(3)}>
                  Continuar
                </button>
              </div>
            )}

            {/* STEP 3: Times */}
            {addStep === 3 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 className="screen-title" style={{ fontSize: 22 }}>
                  ¿A qué hora le toca?
                </h2>
                <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
                  Elegí horarios de todos los días. Usa formato de 24 horas.
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                      Primer horario
                    </label>
                    <input
                      type="time"
                      value={newMedTime1}
                      onChange={e => setNewMedTime1(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: '1.5px solid var(--border-mint)',
                        fontSize: 16,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                      Segundo horario (opcional)
                    </label>
                    <input
                      type="time"
                      value={newMedTime2}
                      onChange={e => setNewMedTime2(e.target.value)}
                      placeholder="--:--"
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '14px',
                        border: '1.5px solid var(--border-mint)',
                        fontSize: 16,
                        fontFamily: 'inherit'
                      }}
                    />
                  </div>
                </div>

                <button className="btn-primary" onClick={() => setAddStep(4)}>
                  Continuar
                </button>
              </div>
            )}

            {/* STEP 4: Summary & Confirm */}
            {addStep === 4 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <h2 className="screen-title" style={{ fontSize: 22 }}>
                  Así quedará el recordatorio
                </h2>
                <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
                  Revisa que coincida con las indicaciones antes de guardar.
                </div>

                <div className="card-mint" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-primary-dark)' }}>
                    {newMedName}
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--color-muted)' }}>
                    {newMedDose}
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--color-primary)', fontWeight: 700 }}>
                    Todos los días a las {newMedTime1} {newMedTime2 ? `y ${newMedTime2}` : ''}
                  </div>
                </div>

                <button className="btn-primary" onClick={handleFinishAdd}>
                  <CheckCircle2 size={18} /> Guardar medicina
                </button>
                <button className="btn-outline" onClick={() => setAddStep(1)}>
                  Corregir datos
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAUSE CONFIRMATION MODAL (I-08) */}
      {showPauseConfirm && (
        <div className="modal-overlay" onClick={() => setShowPauseConfirm(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="drag-handle" />
            <h2 className="screen-title" style={{ fontSize: 22 }}>
              ¿Pausar {showPauseConfirm.name}?
            </h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Roberto dejará de recibir sus recordatorios de las {showPauseConfirm.times.join(' y ')}.
              <br /><br />
              <strong>La medicina y el historial se conservan.</strong> Podés reactivarla cuando corresponda.
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <button
                className="btn-primary"
                onClick={() => {
                  togglePauseMedicine(showPauseConfirm.id);
                  setShowPauseConfirm(null);
                  showToast(
                    showPauseConfirm.status === 'active' ? 'Medicina pausada' : 'Medicina reactivada',
                    'info'
                  );
                }}
              >
                {showPauseConfirm.status === 'active' ? 'Sí, pausar medicina' : 'Sí, reactivar medicina'}
              </button>
              <button className="btn-outline" onClick={() => setShowPauseConfirm(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (I-09) */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="drag-handle" />
            <h2 className="screen-title" style={{ fontSize: 22, color: '#8A3930' }}>
              ¿Eliminar {showDeleteConfirm.name}?
            </h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)', lineHeight: 1.45 }}>
              Se quitará de sus medicinas y no habrá más recordatorios a las {showDeleteConfirm.times.join(' y ')}.
              <br /><br />
              <strong>Las tomas anteriores se conservan en el historial.</strong>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
              <button
                className="btn-primary"
                style={{ backgroundColor: '#8A3930' }}
                onClick={() => {
                  deleteMedicine(showDeleteConfirm.id);
                  setShowDeleteConfirm(null);
                }}
              >
                Sí, eliminar medicina
              </button>
              <button className="btn-outline" onClick={() => setShowDeleteConfirm(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL (G-12, I-07) — edición real de dosis y horarios */}
      {editingMed && (
        <div className="modal-overlay" onClick={() => setEditingMed(null)}>
          <div className="bottom-sheet" onClick={e => e.stopPropagation()}>
            <div className="drag-handle" />
            <h2 className="screen-title" style={{ fontSize: 22 }}>
              Editar {editingMed.name}
            </h2>
            <div style={{ fontSize: 14, color: 'var(--color-muted)' }}>
              Ajustá dosis u horarios para Roberto
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                  Dosis por toma
                </label>
                <input
                  type="text"
                  value={editDose}
                  onChange={e => setEditDose(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--border-mint)', fontSize: 15, fontFamily: 'inherit', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                  Primer horario
                </label>
                <input
                  type="time"
                  value={editTime1}
                  onChange={e => setEditTime1(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--border-mint)', fontSize: 15, fontFamily: 'inherit' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--color-primary-dark)', marginBottom: 4 }}>
                  Segundo horario (opcional)
                </label>
                <input
                  type="time"
                  value={editTime2}
                  onChange={e => setEditTime2(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: '12px', border: '1.5px solid var(--border-mint)', fontSize: 15, fontFamily: 'inherit' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 }}>
              <button className="btn-primary" onClick={handleSaveEdit}>
                <Save size={16} /> Guardar cambios
              </button>
              <button className="btn-outline" onClick={() => setEditingMed(null)}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
