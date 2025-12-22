import React, { useState } from 'react';
import { ForecastData } from '../types';
import { Button } from '../components/Button';
import { Eye, Printer } from 'lucide-react';

interface HistoryProps {
  history: ForecastData[];
  onLoad: (data: ForecastData) => void;
}

const History: React.FC<HistoryProps> = ({ history, onLoad }) => {
  const [selectedVersion, setSelectedVersion] = useState<ForecastData | null>(null);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Lịch sử Phiên bản</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* List */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow border dark:border-slate-700 overflow-hidden col-span-1">
          <ul className="divide-y dark:divide-slate-700 max-h-[600px] overflow-y-auto custom-scrollbar">
            {history.length === 0 && <li className="p-4 text-gray-500 text-center">Chưa có dữ liệu.</li>}
            {history.slice().reverse().map((item) => (
              <li key={item.createdDate} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                <button 
                  onClick={() => setSelectedVersion(item)}
                  className="w-full text-left p-4 focus:outline-none"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-primary dark:text-blue-400">{item.name || "Chưa đặt tên"}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(item.createdDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.location}</p>
                  <div className="mt-2 flex gap-1">
                     <span className="text-xs bg-gray-100 dark:bg-slate-600 px-2 py-0.5 rounded">{item.planningType}</span>
                     <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 px-2 py-0.5 rounded">{item.urbanClass}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Details */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow border dark:border-slate-700 p-6">
          {selectedVersion ? (
            <div className="space-y-4">
              <div className="flex justify-between items-start border-b pb-4 dark:border-slate-700">
                <div>
                  <h3 className="text-xl font-bold">{selectedVersion.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">Được tạo lúc: {new Date(selectedVersion.createdDate).toLocaleString()}</p>
                </div>
                <div className="flex space-x-2 no-print">
                   <Button onClick={handlePrint} variant="outline" size="sm" title="In thông tin">
                     <Printer size={16} />
                   </Button>
                   <Button onClick={() => onLoad(selectedVersion)} size="sm">
                     <Eye size={16} className="mr-1" /> Xem chi tiết / Chỉnh sửa
                   </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Địa điểm</label>
                  <p className="font-medium">{selectedVersion.location}</p>
                </div>
                <div>
                   <label className="text-xs text-gray-500 uppercase">Loại quy hoạch</label>
                   <p className="font-medium">{selectedVersion.planningType}</p>
                </div>
                <div>
                   <label className="text-xs text-gray-500 uppercase">Diện tích</label>
                   <p className="font-medium">{selectedVersion.totalArea} ha</p>
                </div>
                <div>
                   <label className="text-xs text-gray-500 uppercase">Số lượng phân khu</label>
                   <p className="font-medium">{selectedVersion.subdivisions.length}</p>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded border border-yellow-100 dark:border-yellow-800">
                <h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">Tóm tắt số liệu mới nhất</h4>
                <div className="text-sm">
                   <p>Dân số hiện trạng (quy đổi): <b>{selectedVersion.convertedPopCurrent.toLocaleString()}</b> người</p>
                   <p>Dân số dự báo 20 năm: <b>{selectedVersion.convertedPop20y.toLocaleString()}</b> người</p>
                </div>
              </div>
              
              <div className="print-only hidden">
                {/* Simplified print view for details */}
                <h4 className="mt-4 font-bold border-b">Chi tiết dữ liệu</h4>
                <p>Chi tiết đầy đủ vui lòng xem trong chế độ chỉnh sửa.</p>
              </div>

            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <Eye size={48} className="mb-2 opacity-50" />
              <p>Chọn một phiên bản để xem chi tiết</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;