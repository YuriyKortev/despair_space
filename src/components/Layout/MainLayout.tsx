import { Sidebar } from './Sidebar';
import { DetailPanel } from './DetailPanel';
import { DespairSpace } from '../Scene3D/DespairSpace';
import { PointDetailModal } from '../Modals/PointDetailModal';
import { PathDetailModal } from '../Modals/PathDetailModal';
import { useStore } from '../../store/useStore';

export const MainLayout: React.FC = () => {
  const showPointDetail = useStore((state) => state.showPointDetail);
  const showPathDetail = useStore((state) => state.showPathDetail);

  return (
    <div className="w-full h-screen flex bg-slate-950">
      {/* Левая панель — список персонажей */}
      <Sidebar />

      {/* Центр — 3D сцена */}
      <div className="flex-1 relative overflow-hidden">
        <DespairSpace />

        {/* Подсказки по управлению */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-500 space-y-1">
          <div>Левая кнопка — вращение</div>
          <div>Правая кнопка — перемещение</div>
          <div>Колёсико — масштаб</div>
          <div>Клик на точке — выбор</div>
          <div>Двойной клик — детали</div>
          <div>Shift+клик точки — соединить</div>
          <div>Shift+клик связи — удалить</div>
        </div>
      </div>

      {/* Правая панель — детали */}
      <DetailPanel />

      {/* Модалки */}
      {showPointDetail && <PointDetailModal />}
      {showPathDetail && <PathDetailModal />}
    </div>
  );
};

export default MainLayout;
