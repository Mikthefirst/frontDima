import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  AlertTriangle, 
  FileText, 
  TrendingDown,
  PieChart
} from 'lucide-react';
const server = import.meta.env.VITE_SERVER_URL;

const Dashboard: React.FC = () => {

  const [totalAssets, setTotalAssets] = useState<number | null>(null);
  const [lowStock, setLowStock] = useState<number | null>(null);
  const [reportsCount, setReportsCount] = useState<number | null>(null);
  const [roomCount, setRoomCount] = useState<number | null>(null);


  useEffect(() => {
    fetch(`${server}/assets/count`)
      .then((res) => res.json())
      .then((data) => setTotalAssets(data));

    fetch(`${server}/mbp/count`)
      .then((res) => res.json())
      .then((data) => setLowStock(data));

    fetch(`${server}/report/count`)
      .then((res) => res.json())
      .then((data) => setReportsCount(data));

    fetch(`${server}/room/count`)
      .then((res) => res.json())
      .then((data) => setRoomCount(data));
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Дашборд</h1>
      </div>

      {/* Quick Access Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Общие активы
            </h3>
            <BarChart3 className="h-6 w-6 text-[#2A5F7F]" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {totalAssets ?? "..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Среди {roomCount ?? "..."} комнат
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Предупреждения о низком уровне запасов
            </h3>
            <AlertTriangle className="h-6 w-6 text-amber-500" />
          </div>
          <p className="text-3xl font-bold text-amber-500">{lowStock ?? "0"}</p>
          <p className="text-sm text-gray-500 mt-2">
            Элементы ниже порогового значения
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-700">
              Последние репорты
            </h3>
            <FileText className="h-6 w-6 text-[#2A5F7F]" />
          </div>
          <p className="text-3xl font-bold text-gray-800">
            {reportsCount ?? "..."}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Сгенерировано в этом месяце
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Тенденции амортизации активов
            </h3>
            <TrendingDown className="h-6 w-6 text-[#2A5F7F]" />
          </div>
          <div className="h-64 flex items-center justify-center">
            {/* This would be a real chart in a production app */}
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="space-y-2 w-full px-4">
                <div className="h-8 bg-[#2A5F7F] w-3/4 rounded"></div>
                <div className="h-8 bg-[#3d7ea1] w-2/3 rounded"></div>
                <div className="h-8 bg-[#5096bd] w-1/2 rounded"></div>
                <div className="h-8 bg-[#63afd9] w-2/5 rounded"></div>
                <div className="h-8 bg-[#76c8f5] w-1/3 rounded"></div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>2020</span>
                  <span>2021</span>
                  <span>2022</span>
                  <span>2023</span>
                  <span>2024</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-700">
              Распределение МОЛ по категориям
            </h3>
            <PieChart className="h-6 w-6 text-[#2A5F7F]" />
          </div>
          <div className="h-64 flex items-center justify-center">
            {/* This would be a real chart in a production app */}
            <div className="relative w-48 h-48">
              <div
                className="absolute inset-0 rounded-full border-8 border-[#2A5F7F]"
                style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#3d7ea1]"
                style={{
                  clipPath: "polygon(50% 50%, 100% 50%, 100% 100%, 50% 100%)",
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#5096bd]"
                style={{
                  clipPath: "polygon(50% 50%, 50% 0, 100% 0, 100% 50%)",
                }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#63afd9]"
                style={{ clipPath: "polygon(50% 50%, 0 50%, 0 0, 50% 0)" }}
              ></div>
              <div
                className="absolute inset-0 rounded-full border-8 border-[#76c8f5]"
                style={{ clipPath: "polygon(50% 50%, 0 100%, 0 50%, 50% 50%)" }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#2A5F7F] rounded-full mr-2"></div>
              <span className="text-sm">офисные принадлежности (75%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#3d7ea1] rounded-full mr-2"></div>
              <span className="text-sm">Лабораторное оборудование (%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#5096bd] rounded-full mr-2"></div>
              <span className="text-sm">ИТ-оборудование (0%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-[#76c8f5] rounded-full mr-2"></div>
              <span className="text-sm">Другое (5%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          Недавняя активность
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Дата
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Пользователь
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Действия
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Детали
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2024-05-15
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  John Smith
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  добавленый актив
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Laptop #01360776
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  2024-05-14
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Sarah Johnson
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Сгенерированный отчет
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  Q2 Краткое описание активов
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;