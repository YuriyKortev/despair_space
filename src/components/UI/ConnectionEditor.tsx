import { useState, useEffect } from 'react';
import { useStore, useSelectedCharacter } from '../../store/useStore';
import { useT } from '../../store/useLanguageStore';
import type { TransitionType, Connection } from '../../types';

export const ConnectionEditor: React.FC = () => {
  const t = useT();
  const character = useSelectedCharacter();
  const editingConnectionId = useStore((state) => state.editingConnectionId);
  const closeConnectionEditor = useStore((state) => state.closeConnectionEditor);
  const updateConnection = useStore((state) => state.updateConnection);
  const deleteConnection = useStore((state) => state.deleteConnection);

  const connection = character?.connections.find((c) => c.id === editingConnectionId);
  const fromPoint = character?.points.find((p) => p.id === connection?.fromPointId);
  const toPoint = character?.points.find((p) => p.id === connection?.toPointId);

  const [transitionType, setTransitionType] = useState<TransitionType>('evolution');
  const [trigger, setTrigger] = useState('');
  const [alternatives, setAlternatives] = useState('');

  useEffect(() => {
    if (connection) {
      setTransitionType(connection.transitionType);
      setTrigger(connection.crisis?.trigger || '');
      setAlternatives(connection.crisis?.alternatives?.join('\n') || '');
    }
  }, [connection]);

  if (!character || !connection || !fromPoint || !toPoint) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updates: Partial<Omit<Connection, 'id' | 'fromPointId' | 'toPointId'>> = {
      transitionType,
    };

    if (transitionType === 'crisis') {
      const altList = alternatives
        .split('\n')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);
      updates.crisis = {
        trigger: trigger.trim() || t.connections.unknownTrigger,
        alternatives: altList.length > 0 ? altList : undefined,
      };
    } else {
      updates.crisis = undefined;
    }

    updateConnection(character.id, connection.id, updates);
    closeConnectionEditor();
  };

  const handleDelete = () => {
    if (confirm(t.connections.confirmDelete)) {
      deleteConnection(character.id, connection.id);
      closeConnectionEditor();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
      onClick={closeConnectionEditor}
    >
      <div
        className="bg-slate-900 rounded-xl max-w-md w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                {t.connections.editConnection}
              </h2>
              <div className="text-sm text-slate-400 mt-1">
                {fromPoint.label} → {toPoint.label}
              </div>
            </div>
            <button
              onClick={closeConnectionEditor}
              className="p-1 hover:bg-slate-700 rounded"
            >
              <svg
                className="w-5 h-5 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Transition type */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              {t.connections.transitionType}
            </label>
            <div className="flex gap-2">
              {(['evolution', 'crisis', 'branch'] as TransitionType[]).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setTransitionType(type)}
                  className={`
                    flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${transitionType === type
                      ? type === 'crisis'
                        ? 'bg-red-600 text-white'
                        : type === 'branch'
                        ? 'bg-orange-600 text-white'
                        : 'bg-slate-600 text-white'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}
                  `}
                >
                  {t.transitionTypes[type]}
                </button>
              ))}
            </div>
          </div>

          {/* Crisis fields */}
          {transitionType === 'crisis' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {t.connections.crisisTrigger}
                </label>
                <input
                  type="text"
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  placeholder={t.connections.crisisTriggerPlaceholder}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  {t.connections.alternatives}
                </label>
                <textarea
                  value={alternatives}
                  onChange={(e) => setAlternatives(e.target.value)}
                  placeholder={t.connections.alternativesPlaceholder}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                />
              </div>
            </>
          )}

          {/* Type hints */}
          <div className="text-xs text-slate-500 p-3 bg-slate-800/50 rounded-lg">
            {transitionType === 'evolution' && (
              <span>{t.connections.evolutionHint}</span>
            )}
            {transitionType === 'crisis' && (
              <span>{t.connections.crisisHint}</span>
            )}
            {transitionType === 'branch' && (
              <span>{t.connections.branchHint}</span>
            )}
          </div>

          {/* Buttons */}
          <div className="space-y-2 pt-2">
            <button
              type="submit"
              className="w-full py-2 px-4 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
            >
              {t.actions.save}
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="w-full py-2 px-4 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
            >
              {t.connections.deleteConnection}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConnectionEditor;
