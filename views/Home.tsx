import React from 'react';
import { ForecastData, PlanningType, UrbanClass } from '../types';
import { Button } from '../components/Button';
import { PlusCircle, MapPin, FileText, Activity } from 'lucide-react';

interface HomeProps {
  history: ForecastData[];
  onCreate: () => void;
  orgName: string;
}

const Home: React.FC<HomeProps> = ({ history, onCreate, orgName }) => {
  // Simple stats
  const totalForecasts = history.length;
  const generalPlans = history.filter(f => f.planningType === PlanningType.GENERAL).length;
  const zoningPlans = history.filter(f => f.planningType === PlanningType.ZONING).length;

  // Mock map locations for visual
  const locations = history.map(h => h.location).filter(l => l);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-slate-700">
        <h2 className="text-2xl font-bold mb-2">Xin chào, {orgName}</h2>
        <p className="text-gray-500 dark:text-gray-400">Hệ thống dự báo phát triển đô thị v1.0</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Kịch bản dự báo</p>
              <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">{totalForecasts}</p>
            </div>
            <Activity className="text-blue-500" />
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-100 dark:border-green-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-600 dark:text-green-400 font-medium">QH Chung</p>
              <p className="text-2xl font-bold text-green-800 dark:text-green-200">{generalPlans}</p>
            </div>
            <FileText className="text-green-500" />
          </div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">QH Phân khu</p>
              <p className="text-2xl font-bold text-purple-800 dark:text-purple-200">{zoningPlans}</p>
            </div>
            <MapPin className="text-purple-500" />
          </div>
        </div>
        <div className="flex items-center justify-center">
          <Button onClick={onCreate} size="lg" className="w-full h-full shadow-lg">
            <PlusCircle className="mr-2" /> Tạo Dự Báo Mới
          </Button>
        </div>
      </div>

      {/* Map Placeholder */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
        <div className="p-4 border-b dark:border-slate-700">
          <h3 className="font-semibold flex items-center">
            <MapPin className="mr-2 w-4 h-4" /> Bản đồ vị trí lập quy hoạch
          </h3>
        </div>
        <div className="h-64 bg-slate-200 dark:bg-slate-700 flex items-center justify-center relative">
          <p className="text-slate-500 font-medium z-10 bg-white/80 dark:bg-black/50 px-4 py-2 rounded">
             Bản đồ Google Map (Chế độ Demo - Không cần API Key)
          </p>
          {/* Simulated Map Pins */}
          {locations.map((loc, idx) => (
             <div key={idx} className="absolute text-xs bg-red-500 text-white px-2 py-1 rounded-full shadow" 
                  style={{ top: `${20 + (idx * 15) % 60}%`, left: `${20 + (idx * 25) % 60}%` }}>
               {loc}
             </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;