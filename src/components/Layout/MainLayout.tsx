import { Sidebar } from './Sidebar';
import { DetailPanel } from './DetailPanel';
import { DespairSpace } from '../Scene3D/DespairSpace';
import { PointDetailModal } from '../Modals/PointDetailModal';
import { PathDetailModal } from '../Modals/PathDetailModal';
import { ConnectionEditor } from '../UI/ConnectionEditor';
import { useStore } from '../../store/useStore';
import { useT } from '../../store/useLanguageStore';

export const MainLayout: React.FC = () => {
  const t = useT();
  const showPointDetail = useStore((state) => state.showPointDetail);
  const showPathDetail = useStore((state) => state.showPathDetail);
  const editingConnectionId = useStore((state) => state.editingConnectionId);

  return (
    <div className="w-full h-screen flex bg-slate-950">
      {/* Левая панель — список персонажей */}
      <Sidebar />

      {/* Центр — 3D сцена */}
      <div className="flex-1 relative overflow-hidden z-0">
        <DespairSpace />

        {/* Подсказки по управлению */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-500 space-y-1">
          <div>{t.shortcuts.leftClick}</div>
          <div>{t.shortcuts.rightClick}</div>
          <div>{t.shortcuts.scroll}</div>
          <div>{t.shortcuts.clickPoint}</div>
          <div>{t.shortcuts.doubleClick}</div>
          <div>{t.shortcuts.shiftClick}</div>
          <div>{t.shortcuts.clickConnection}</div>
        </div>
      </div>

      {/* Правая панель — детали */}
      <DetailPanel />

      {/* Модалки */}
      {showPointDetail && <PointDetailModal />}
      {showPathDetail && <PathDetailModal />}
      {editingConnectionId && <ConnectionEditor />}
    </div>
  );
};

export default MainLayout;
