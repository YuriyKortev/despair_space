import { Sidebar } from './Sidebar';
import { DetailPanel } from './DetailPanel';
import { DespairSpace } from '../Scene3D/DespairSpace';
import { PointDetailModal } from '../Modals/PointDetailModal';
import { PathDetailModal } from '../Modals/PathDetailModal';
import { ConnectionEditor } from '../UI/ConnectionEditor';
import { useStore } from '../../store/useStore';

export const MainLayout: React.FC = () => {
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
          <div>Левая кнопка — вращение</div>
          <div>Правая кнопка — перемещение</div>
          <div>Колёсико — масштаб</div>
          <div>Клик на точке — выбор</div>
          <div>Двойной клик — детали</div>
          <div>Shift+клик точки — соединить</div>
          <div>Клик на связи — редактировать</div>
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
