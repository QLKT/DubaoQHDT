import React from 'react';
import { ForecastData, PlanningType, UrbanClass } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Save, ArrowRight, RotateCcw } from 'lucide-react';
import { formatNumber } from '../utils';

interface GeneralInputProps {
  data: ForecastData;
  onChange: (data: ForecastData) => void;
  onNext: () => void;
  onClear: () => void;
}

const GeneralInput: React.FC<GeneralInputProps> = ({ data, onChange, onNext, onClear }) => {

  const handleChange = (field: keyof ForecastData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Calculate density automatically when area or pop changes (using current total pop from history if avail)
  const currentTotalPop = data.historicalPop[data.historicalPop.length - 1]?.totalPop || 0;
  const density = data.totalArea > 0 ? currentTotalPop / data.totalArea : 0;

  // Update calculated density in state
  React.useEffect(() => {
    if (density !== data.currentDensity) {
      handleChange('currentDensity', density);
    }
  }, [data.totalArea, currentTotalPop]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-700">
        <h2 className="text-2xl font-bold">1. Nhập dữ liệu chung - Chỉ số tăng trưởng</h2>
        <Button variant="outline" size="sm" onClick={onClear} className="text-red-600 hover:text-red-700">
          <RotateCcw size={16} className="mr-1" /> Clear Dữ liệu
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        
        <Input 
          label="Tên dự báo / Đồ án" 
          value={data.name} 
          onChange={e => handleChange('name', e.target.value)} 
          placeholder="VD: QH Chung TP. Bắc Ninh đến 2045"
        />
        
        <Input 
          label="Địa điểm / Tỉnh thành" 
          value={data.location} 
          onChange={e => handleChange('location', e.target.value)} 
          placeholder="VD: Bắc Ninh"
        />

        <div>
          <label className="block text-sm font-medium mb-1">Loại quy hoạch</label>
          <select 
            className="w-full rounded-md border border-gray-300 p-2 dark:bg-slate-800 dark:border-slate-600"
            value={data.planningType}
            onChange={e => handleChange('planningType', e.target.value)}
          >
            {Object.values(PlanningType).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <p className="text-xs text-gray-500 mt-1">*Theo Thông tư 16/2025/TT-BXD</p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phân loại đô thị</label>
          <select 
            className="w-full rounded-md border border-gray-300 p-2 dark:bg-slate-800 dark:border-slate-600"
            value={data.urbanClass}
            onChange={e => handleChange('urbanClass', e.target.value)}
          >
            {Object.values(UrbanClass).map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        <Input 
          label="Diện tích đô thị (ha)" 
          type="number"
          value={data.totalArea || ''} 
          onChange={e => handleChange('totalArea', parseFloat(e.target.value))} 
        />

        <div>
           <label className="block text-sm font-medium mb-1">Mật độ dân số hiện trạng (người/ha)</label>
           <div className="p-2 bg-gray-100 dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 text-gray-700 dark:text-gray-200">
             {formatNumber(density)}
           </div>
           <p className="text-xs text-gray-500 mt-1">*Tự động tính = Dân số năm gần nhất / Diện tích</p>
        </div>

        <div className="md:col-span-2 border-t pt-4 mt-2 dark:border-slate-700">
          <h3 className="font-semibold mb-4 text-blue-700 dark:text-blue-400">Tham số Mô hình Tăng trưởng</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Input 
               label="Ngưỡng phát triển (Dn)" 
               type="number" step="0.1"
               value={data.growthThresholdDn} 
               onChange={e => handleChange('growthThresholdDn', parseFloat(e.target.value))} 
               placeholder="1.0"
             />
             <div className="text-sm text-gray-500">
               <p>Hệ số điều chỉnh mô hình tăng trưởng dựa trên điều kiện thực tế.</p>
             </div>
          </div>
        </div>

      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => {/* Just Save Logic handled by state but explicit save can be here */}}>
          <Save size={18} className="mr-2" /> Lưu
        </Button>
        <Button onClick={onNext}>
          Tiếp tục <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default GeneralInput;