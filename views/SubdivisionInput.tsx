import React, { useState } from 'react';
import { ForecastData, Subdivision, PlanningType, LandUseIndicators } from '../types';
import { EMPTY_LAND_USE } from '../constants';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { generateId, formatNumber, calculateCompoundGrowth } from '../utils';
import { Plus, Trash2, ChevronDown, ChevronUp, Play, ArrowRight } from 'lucide-react';

interface Props {
  data: ForecastData;
  onChange: (data: ForecastData) => void;
  onRunForecast: () => void;
  onNext: () => void;
}

const SubdivisionInput: React.FC<Props> = ({ data, onChange, onRunForecast, onNext }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const addSubdivision = () => {
    const newSub: Subdivision = {
      id: generateId(),
      name: `Phân khu ${data.subdivisions.length + 1}`,
      area: 0,
      currentPop: 0,
      approvedProjectPop: 0,
      naturalGrowthRate: data.naturalGrowthRate5y, // inherit from global
      mechanicalGrowthRate: data.mechanicalGrowthRate5y, // inherit from global
      convertedPop: 0,
      landUseCurrent: { ...EMPTY_LAND_USE },
      landUse10y: { ...EMPTY_LAND_USE },
      landUse20y: { ...EMPTY_LAND_USE },
      landUse50y: { ...EMPTY_LAND_USE },
    };
    onChange({ ...data, subdivisions: [...data.subdivisions, newSub] });
    setExpandedId(newSub.id);
  };

  const removeSubdivision = (id: string) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa phân khu này?")) {
      onChange({ ...data, subdivisions: data.subdivisions.filter(s => s.id !== id) });
    }
  };

  const updateSubdivision = (id: string, field: keyof Subdivision, val: any) => {
    const updated = data.subdivisions.map(s => s.id === id ? { ...s, [field]: val } : s);
    onChange({ ...data, subdivisions: updated });
  };

  const updateLandUse = (subId: string, stage: 'landUseCurrent' | 'landUse10y' | 'landUse20y', field: keyof LandUseIndicators, val: number) => {
    const updated = data.subdivisions.map(s => {
      if (s.id === subId) {
        return {
          ...s,
          [stage]: { ...s[stage], [field]: val }
        };
      }
      return s;
    });
    onChange({ ...data, subdivisions: updated });
  };

  const runCalculations = () => {
    // Recalculate each subdivision forecasts
    const calculatedSubs = data.subdivisions.map(sub => {
      const totalRate = sub.naturalGrowthRate + sub.mechanicalGrowthRate;
      // Logic: Forecast = Current * growth + Project Pop (simplified)
      // Usually project pop is added incrementally or at specific points, here we assume it adds to the base for future capacity.
      
      // We are just storing "Converted Pop" in the state slots for results.
      // But Subdivisions only store input params, let's assume we want to auto-fill LandUse or Pop based on density if needed.
      // For now, let's ensure the data structure is clean. The "Run Forecast" primarily aggregates in the Results view,
      // but here we can update local derived values.
      
      return sub;
    });
    
    onChange({ ...data, subdivisions: calculatedSubs });
    onRunForecast();
  };

  const isExtraIndicatorsNeeded = data.planningType !== PlanningType.GENERAL;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-700">
        <h2 className="text-2xl font-bold">3. Nhập dữ liệu Phân khu & Sử dụng đất</h2>
        <div className="flex gap-2">
            <Button onClick={addSubdivision} variant="success" size="sm">
            <Plus size={16} className="mr-1" /> Thêm Phân khu
            </Button>
            <Button onClick={runCalculations} variant="primary" size="sm">
            <Play size={16} className="mr-1" /> Chạy Dự báo (Save)
            </Button>
        </div>
      </div>

      <div className="space-y-4">
        {data.subdivisions.length === 0 && (
          <div className="text-center p-10 bg-gray-100 dark:bg-slate-800 rounded border border-dashed border-gray-300">
            Chưa có phân khu nào. Nhấn "Thêm Phân khu" để bắt đầu.
          </div>
        )}

        {data.subdivisions.map((sub) => (
          <div key={sub.id} className="bg-white dark:bg-slate-800 border rounded-lg shadow-sm overflow-hidden dark:border-slate-700">
            <div 
              className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
              onClick={() => setExpandedId(expandedId === sub.id ? null : sub.id)}
            >
              <div className="flex items-center gap-4">
                {expandedId === sub.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                <span className="font-bold">{sub.name}</span>
                <span className="text-sm text-gray-500">Diện tích: {sub.area} ha | Dân số: {formatNumber(sub.currentPop)}</span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); removeSubdivision(sub.id); }}
                className="text-red-500 hover:text-red-700 p-1"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {expandedId === sub.id && (
              <div className="p-6 border-t dark:border-slate-700 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input label="Tên phân khu" value={sub.name} onChange={e => updateSubdivision(sub.id, 'name', e.target.value)} />
                  <Input label="Diện tích (ha)" type="number" value={sub.area || ''} onChange={e => updateSubdivision(sub.id, 'area', parseFloat(e.target.value))} />
                  <Input label="Dân số hiện trạng" type="number" value={sub.currentPop || ''} onChange={e => updateSubdivision(sub.id, 'currentPop', parseFloat(e.target.value))} />
                  <Input label="Dân số dự án đã duyệt" type="number" value={sub.approvedProjectPop || ''} onChange={e => updateSubdivision(sub.id, 'approvedProjectPop', parseFloat(e.target.value))} />
                  <Input label="Tỷ lệ tăng tự nhiên (%)" type="number" step="0.1" value={sub.naturalGrowthRate} onChange={e => updateSubdivision(sub.id, 'naturalGrowthRate', parseFloat(e.target.value))} />
                  <Input label="Tỷ lệ tăng cơ học (%)" type="number" step="0.1" value={sub.mechanicalGrowthRate} onChange={e => updateSubdivision(sub.id, 'mechanicalGrowthRate', parseFloat(e.target.value))} />
                </div>

                {/* Land Use Indicators Table */}
                <div className="overflow-x-auto">
                  <h4 className="font-semibold mb-2 text-sm text-gray-500 uppercase">Chỉ tiêu sử dụng đất (m2/người hoặc ha)</h4>
                  <table className="w-full text-sm border-collapse border border-gray-200 dark:border-slate-600">
                    <thead className="bg-gray-100 dark:bg-slate-700">
                      <tr>
                        <th className="border p-2 text-left">Chỉ tiêu</th>
                        <th className="border p-2 w-32">Hiện trạng</th>
                        <th className="border p-2 w-32">10 Năm</th>
                        <th className="border p-2 w-32">20 Năm</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Standard 6 Indicators */}
                      {[
                        { key: 'residentialUnit', label: 'Đất đơn vị ở' },
                        { key: 'urbanService', label: 'CC Dịch vụ đô thị' },
                        { key: 'unitService', label: 'CC Dịch vụ đơn vị ở' },
                        { key: 'urbanGreen', label: 'Cây xanh đô thị' },
                        { key: 'unitGreen', label: 'Cây xanh đơn vị ở' },
                        { key: 'traffic', label: 'Giao thông' },
                      ].map((item) => (
                        <tr key={item.key}>
                          <td className="border p-2 font-medium">{item.label}</td>
                          <td className="border p-2"><Input className="h-8 text-xs" type="number" value={(sub.landUseCurrent as any)[item.key] || ''} onChange={e => updateLandUse(sub.id, 'landUseCurrent', item.key as any, parseFloat(e.target.value))} /></td>
                          <td className="border p-2"><Input className="h-8 text-xs" type="number" value={(sub.landUse10y as any)[item.key] || ''} onChange={e => updateLandUse(sub.id, 'landUse10y', item.key as any, parseFloat(e.target.value))} /></td>
                          <td className="border p-2"><Input className="h-8 text-xs" type="number" value={(sub.landUse20y as any)[item.key] || ''} onChange={e => updateLandUse(sub.id, 'landUse20y', item.key as any, parseFloat(e.target.value))} /></td>
                        </tr>
                      ))}

                      {/* Extra 3 indicators if not General Planning */}
                      {isExtraIndicatorsNeeded && (
                        <>
                           <tr><td colSpan={4} className="bg-gray-50 dark:bg-slate-800 p-1"></td></tr>
                           <tr className="bg-yellow-50 dark:bg-yellow-900/10"><td colSpan={4} className="p-2 font-bold text-xs text-yellow-700">Chỉ tiêu quy hoạch kiến trúc (Khác QH Chung)</td></tr>
                           {[
                             { key: 'maxDensity', label: 'Mật độ XD tối đa (%)' },
                             { key: 'maxHeight', label: 'Tầng cao tối đa' },
                             { key: 'maxLandUseCoef', label: 'Hệ số SD đất tối đa' },
                           ].map((item) => (
                             <tr key={item.key}>
                              <td className="border p-2 font-medium">{item.label}</td>
                              <td className="border p-2"><Input className="h-8 text-xs" type="number" value={(sub.landUseCurrent as any)[item.key] || ''} onChange={e => updateLandUse(sub.id, 'landUseCurrent', item.key as any, parseFloat(e.target.value))} /></td>
                              <td className="border p-2"><Input className="h-8 text-xs" type="number" value={(sub.landUse10y as any)[item.key] || ''} onChange={e => updateLandUse(sub.id, 'landUse10y', item.key as any, parseFloat(e.target.value))} /></td>
                              <td className="border p-2"><Input className="h-8 text-xs" type="number" value={(sub.landUse20y as any)[item.key] || ''} onChange={e => updateLandUse(sub.id, 'landUse20y', item.key as any, parseFloat(e.target.value))} /></td>
                            </tr>
                           ))}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

              </div>
            )}
          </div>
        ))}
      </div>
       <div className="flex justify-end gap-3 pt-4">
        <Button onClick={onNext}>
          Tiếp tục <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default SubdivisionInput;