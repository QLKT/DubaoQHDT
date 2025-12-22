import React, { useEffect } from 'react';
import { ForecastData, YearData, LaborData } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { ArrowRight, Save, Calculator, ArrowDown } from 'lucide-react';
import { calculateUrbanRate, calculateCompoundGrowth, formatNumber } from '../utils';

interface Props {
  data: ForecastData;
  onChange: (data: ForecastData) => void;
  onNext: () => void;
}

const PopLaborInput: React.FC<Props> = ({ data, onChange, onNext }) => {
  
  // --- 1. Handlers for Historical Tables ---
  const handlePopChange = (index: number, field: keyof YearData, val: number) => {
    const newHist = [...data.historicalPop];
    newHist[index] = { ...newHist[index], [field]: val };
    
    // Auto calc urban rate
    if (field === 'urbanPop' || field === 'totalPop') {
      const urban = field === 'urbanPop' ? val : newHist[index].urbanPop;
      const total = field === 'totalPop' ? val : newHist[index].totalPop;
      newHist[index].urbanRate = calculateUrbanRate(urban, total);
    }
    
    // Calculate new averages
    let sumNat = 0, sumMech = 0, count = 0;
    newHist.forEach(item => {
        sumNat += item.naturalGrowthRate || 0;
        sumMech += item.mechanicalGrowthRate || 0;
        count++;
    });

    const avgNat = count > 0 ? parseFloat((sumNat / count).toFixed(2)) : 0;
    const avgMech = count > 0 ? parseFloat((sumMech / count).toFixed(2)) : 0;

    onChange({ 
      ...data, 
      historicalPop: newHist,
      naturalGrowthRate5y: avgNat,
      mechanicalGrowthRate5y: avgMech
    });
  };

  const handleLaborChange = (index: number, field: keyof LaborData, val: number) => {
    const newLabor = [...data.historicalLabor];
    newLabor[index] = { ...newLabor[index], [field]: val };
    onChange({ ...data, historicalLabor: newLabor });
  };

  // --- 2. Logic for Population Conversion Formula ---
  // Formula: N0 = (2 * Nt * m) / 365
  const calculateShortTermConversion = (Nt: number, m: number) => {
    if (!Nt || !m) return 0;
    return (2 * Nt * m) / 365;
  };

  const handleVisitorChange = (field: 'visitorsTotal' | 'averageStayDays', value: number) => {
    const newData = { ...data, [field]: value };
    const n0 = calculateShortTermConversion(
      field === 'visitorsTotal' ? value : data.visitorsTotal,
      field === 'averageStayDays' ? value : data.averageStayDays
    );
    onChange({ ...newData, convertedShortTermPop: Math.round(n0) });
  };

  // --- 3. Forecast Trigger ---
  const runBaseForecast = () => {
    // Current Base = Last Historical Total + Converted Short-term (N0)
    const lastHistoricalPop = data.historicalPop[data.historicalPop.length - 1].totalPop;
    const n0 = data.convertedShortTermPop;
    const currentBasePop = lastHistoricalPop + n0;

    const totalRate = data.naturalGrowthRate5y + data.mechanicalGrowthRate5y;
    
    const p10 = calculateCompoundGrowth(currentBasePop, totalRate, 10);
    const p20 = calculateCompoundGrowth(currentBasePop, totalRate, 20);
    const p50 = calculateCompoundGrowth(currentBasePop, totalRate, 50);

    onChange({
      ...data,
      convertedPopCurrent: Math.round(currentBasePop),
      convertedPop10y: Math.round(p10),
      convertedPop20y: Math.round(p20),
      convertedPop50y: Math.round(p50)
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-700">
        <h2 className="text-2xl font-bold">2. Nhập dữ liệu Dân số - Lao động</h2>
      </div>

      {/* --- SECTION 1: POPULATION HISTORY --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2 text-primary dark:text-blue-400">
          A. Hiện trạng Dân số & Tỷ lệ tăng trưởng (5 năm)
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-700">
              <tr>
                <th className="px-4 py-3 min-w-[80px]">Năm</th>
                <th className="px-4 py-3 min-w-[140px]">Dân số toàn đô thị (người)</th>
                <th className="px-4 py-3 min-w-[140px]">Dân số đô thị (người)</th>
                <th className="px-4 py-3">Đô thị hóa (%)</th>
                <th className="px-4 py-3 bg-blue-50 dark:bg-blue-900/20">Tăng tự nhiên (%)</th>
                <th className="px-4 py-3 bg-green-50 dark:bg-green-900/20">Tăng cơ học (%)</th>
              </tr>
            </thead>
            <tbody>
              {data.historicalPop.map((row, idx) => (
                <tr key={idx} className="border-b dark:border-slate-700">
                  <td className="p-2"><Input type="number" value={row.year} onChange={e => handlePopChange(idx, 'year', parseInt(e.target.value))} /></td>
                  <td className="p-2"><Input type="number" value={row.totalPop || ''} onChange={e => handlePopChange(idx, 'totalPop', parseFloat(e.target.value))} /></td>
                  <td className="p-2"><Input type="number" value={row.urbanPop || ''} onChange={e => handlePopChange(idx, 'urbanPop', parseFloat(e.target.value))} /></td>
                  <td className="p-2 font-medium text-center">{formatNumber(row.urbanRate)}%</td>
                  <td className="p-2 bg-blue-50/50 dark:bg-blue-900/10"><Input type="number" step="0.01" value={row.naturalGrowthRate || ''} onChange={e => handlePopChange(idx, 'naturalGrowthRate', parseFloat(e.target.value))} /></td>
                  <td className="p-2 bg-green-50/50 dark:bg-green-900/10"><Input type="number" step="0.01" value={row.mechanicalGrowthRate || ''} onChange={e => handlePopChange(idx, 'mechanicalGrowthRate', parseFloat(e.target.value))} /></td>
                </tr>
              ))}
              <tr className="bg-gray-100 dark:bg-slate-700 font-bold">
                <td colSpan={4} className="p-3 text-right uppercase text-xs">Trung bình 5 năm:</td>
                <td className="p-3 text-center text-blue-700 dark:text-blue-300">{formatNumber(data.naturalGrowthRate5y)}%</td>
                <td className="p-3 text-center text-green-700 dark:text-green-300">{formatNumber(data.mechanicalGrowthRate5y)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* --- SECTION 2: CONVERTED POPULATION CALCULATION --- */}
      <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
        <h3 className="text-lg font-semibold mb-4 text-indigo-800 dark:text-indigo-300 flex items-center">
          <Calculator className="mr-2" size={20} /> B. Tính Dân số Quy đổi (Khách vãng lai/ngắn hạn)
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 italic">
          * Dân số tạm trú từ 6 tháng trở lên tính như thường trú (đã có ở bảng A). Dưới 6 tháng quy đổi theo công thức: 
          <span className="font-bold font-mono ml-2">N0 = (2 * Nt * m) / 365</span>
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
          <Input 
            label="Tổng lượt khách (Nt) - người" 
            type="number" 
            value={data.visitorsTotal || ''}
            onChange={e => handleVisitorChange('visitorsTotal', parseFloat(e.target.value))}
            placeholder="VD: 50000"
          />
          <Input 
            label="Số ngày lưu trú TB (m) - ngày" 
            type="number" step="0.1"
            value={data.averageStayDays || ''}
            onChange={e => handleVisitorChange('averageStayDays', parseFloat(e.target.value))}
            placeholder="VD: 2.5"
          />
          <div className="bg-white dark:bg-slate-800 p-3 rounded border border-indigo-200 dark:border-slate-600">
            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Kết quả quy đổi (N0)</label>
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatNumber(data.convertedShortTermPop, 0)} <span className="text-sm font-normal text-gray-500">người</span>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 3: LABOR HISTORY & PROJECTION --- */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-primary dark:text-blue-400">
          C. Hiện trạng & Dự báo Cơ cấu Lao động
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* History */}
          <div>
            <h4 className="text-sm font-bold text-gray-600 mb-2 uppercase">Lịch sử (Số lượng)</h4>
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-gray-100 dark:bg-slate-700">
                <tr>
                  <th className="px-2 py-2">Năm</th>
                  <th className="px-2 py-2">KV1</th>
                  <th className="px-2 py-2">KV2</th>
                  <th className="px-2 py-2">KV3</th>
                </tr>
              </thead>
              <tbody>
                {data.historicalLabor.map((row, idx) => (
                  <tr key={idx} className="border-b dark:border-slate-700">
                    <td className="p-2 font-medium">{row.year}</td>
                    <td className="p-2"><Input type="number" className="w-20" value={row.sector1 || ''} onChange={e => handleLaborChange(idx, 'sector1', parseFloat(e.target.value))} /></td>
                    <td className="p-2"><Input type="number" className="w-20" value={row.sector2 || ''} onChange={e => handleLaborChange(idx, 'sector2', parseFloat(e.target.value))} /></td>
                    <td className="p-2"><Input type="number" className="w-20" value={row.sector3 || ''} onChange={e => handleLaborChange(idx, 'sector3', parseFloat(e.target.value))} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Projection Input */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded border border-orange-100 dark:border-orange-800">
            <h4 className="text-sm font-bold text-orange-800 dark:text-orange-300 mb-2 uppercase">Dự kiến Tỷ lệ (%) các giai đoạn</h4>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Giai đoạn 10 năm</label>
                <div className="flex gap-2">
                  <Input placeholder="KV1 %" type="number" value={data.laborProjected10y?.sector1 || ''} onChange={e => onChange({...data, laborProjected10y: {...data.laborProjected10y, sector1: parseFloat(e.target.value)}})} />
                  <Input placeholder="KV2 %" type="number" value={data.laborProjected10y?.sector2 || ''} onChange={e => onChange({...data, laborProjected10y: {...data.laborProjected10y, sector2: parseFloat(e.target.value)}})} />
                  <Input placeholder="KV3 %" type="number" value={data.laborProjected10y?.sector3 || ''} onChange={e => onChange({...data, laborProjected10y: {...data.laborProjected10y, sector3: parseFloat(e.target.value)}})} />
                </div>
              </div>
              <div className="border-t border-orange-200 dark:border-orange-800 pt-4">
                <label className="text-sm font-semibold block mb-2">Giai đoạn 20 năm</label>
                <div className="flex gap-2">
                  <Input placeholder="KV1 %" type="number" value={data.laborProjected20y?.sector1 || ''} onChange={e => onChange({...data, laborProjected20y: {...data.laborProjected20y, sector1: parseFloat(e.target.value)}})} />
                  <Input placeholder="KV2 %" type="number" value={data.laborProjected20y?.sector2 || ''} onChange={e => onChange({...data, laborProjected20y: {...data.laborProjected20y, sector2: parseFloat(e.target.value)}})} />
                  <Input placeholder="KV3 %" type="number" value={data.laborProjected20y?.sector3 || ''} onChange={e => onChange({...data, laborProjected20y: {...data.laborProjected20y, sector3: parseFloat(e.target.value)}})} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* --- SECTION 4: FINAL FORECAST EXECUTION --- */}
      <div className="flex flex-col items-center justify-center py-4">
         <ArrowDown size={32} className="text-gray-400 mb-2 animate-bounce" />
         <Button size="lg" onClick={runBaseForecast} className="shadow-lg">
           <Calculator size={20} className="mr-2" /> Cập nhật / Tính toán Kết quả Dự báo
         </Button>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
        <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-4">Kết quả Dự báo Dân số (Đã bao gồm N0 và Tăng trưởng)</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Hiện trạng quy đổi</label>
            <Input readOnly type="number" className="bg-gray-100" value={data.convertedPopCurrent || ''} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Giai đoạn 10 năm</label>
            <Input readOnly type="number" className="bg-gray-100 font-bold text-blue-700" value={data.convertedPop10y || ''} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Giai đoạn 20 năm</label>
            <Input readOnly type="number" className="bg-gray-100 font-bold text-blue-700" value={data.convertedPop20y || ''} />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase">Giai đoạn 50 năm</label>
            <Input readOnly type="number" className="bg-gray-100" value={data.convertedPop50y || ''} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button variant="outline" onClick={() => {}}>
          <Save size={18} className="mr-2" /> Lưu tạm
        </Button>
        <Button onClick={onNext}>
          Tiếp tục <ArrowRight size={18} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default PopLaborInput;