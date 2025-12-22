import React from 'react';
import { ForecastData } from '../types';
import { Button } from '../components/Button';
import { exportToCSV, formatNumber } from '../utils';
import { FileText, Download, BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

interface Props {
  data: ForecastData;
}

const Results: React.FC<Props> = ({ data }) => {
  
  // Aggregate Data Calculation
  const totalSubArea = data.subdivisions.reduce((sum, s) => sum + s.area, 0);
  const totalSubPopCurrent = data.subdivisions.reduce((sum, s) => sum + s.currentPop, 0);
  
  // Prepare Chart Data
  const popChartData = [
    { name: 'Hiện trạng', value: data.convertedPopCurrent || totalSubPopCurrent },
    { name: '10 Năm', value: data.convertedPop10y },
    { name: '20 Năm', value: data.convertedPop20y },
    { name: '50 Năm', value: data.convertedPop50y },
  ];

  const laborChartData = data.historicalLabor.map(d => ({
    year: d.year,
    KV1: d.sector1,
    KV2: d.sector2,
    KV3: d.sector3
  }));

  const handleExportExcel = () => {
    const rows = [
      ['BÁO CÁO DỰ BÁO PHÁT TRIỂN ĐÔ THỊ'],
      ['Tên dự án', data.name],
      ['Địa điểm', data.location],
      ['Ngày tạo', data.createdDate],
      [],
      ['DỰ BÁO DÂN SỐ'],
      ['Giai đoạn', 'Dân số quy đổi'],
      ['Hiện trạng', (data.convertedPopCurrent || 0).toString()],
      ['10 Năm', (data.convertedPop10y || 0).toString()],
      ['20 Năm', (data.convertedPop20y || 0).toString()],
      ['50 Năm', (data.convertedPop50y || 0).toString()],
      [],
      ['DANH SÁCH PHÂN KHU'],
      ['Tên', 'Diện tích (ha)', 'Dân số HT'],
      ...data.subdivisions.map(s => [s.name, s.area.toString(), s.currentPop.toString()])
    ];
    exportToCSV(`Forecast_${data.name}.csv`, rows);
  };

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 print:p-0">
      <div className="flex justify-between items-center border-b pb-4 dark:border-slate-700 no-print">
        <h2 className="text-2xl font-bold">4. Kết quả Dự báo Tổng hợp</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <Download size={16} className="mr-2" /> Xuất Excel (CSV)
          </Button>
          <Button onClick={handlePrintPDF}>
            <FileText size={16} className="mr-2" /> Xuất PDF (Print)
          </Button>
        </div>
      </div>

      {/* Overview Card */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow print:shadow-none print:border">
        <h3 className="text-xl font-bold mb-4 text-center text-primary dark:text-blue-400 uppercase">{data.name}</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
           <div>
             <p className="text-sm text-gray-500">Diện tích đô thị</p>
             <p className="text-lg font-bold">{formatNumber(data.totalArea)} ha</p>
           </div>
           <div>
             <p className="text-sm text-gray-500">Diện tích phân khu lập</p>
             <p className="text-lg font-bold">{formatNumber(totalSubArea)} ha</p>
           </div>
           <div>
             <p className="text-sm text-gray-500">Ngưỡng phát triển (Dn)</p>
             <p className="text-lg font-bold">{data.growthThresholdDn}</p>
           </div>
           <div>
             <p className="text-sm text-gray-500">Dân số 20 năm</p>
             <p className="text-lg font-bold text-blue-600">{formatNumber(data.convertedPop20y)}</p>
           </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow h-80 print:h-64 print:shadow-none">
          <h4 className="font-semibold mb-2 flex items-center"><BarChart2 size={16} className="mr-2" /> Biểu đồ Dự báo Dân số</h4>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={popChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" name="Dân số (người)" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow h-80 print:h-64 print:shadow-none">
          <h4 className="font-semibold mb-2 flex items-center"><BarChart2 size={16} className="mr-2" /> Cơ cấu Lao động (Lịch sử)</h4>
          <ResponsiveContainer width="100%" height="90%">
            <LineChart data={laborChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="KV1" stroke="#ef4444" name="Nông nghiệp" />
              <Line type="monotone" dataKey="KV2" stroke="#f59e0b" name="Công nghiệp" />
              <Line type="monotone" dataKey="KV3" stroke="#10b981" name="Dịch vụ" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tables */}
      <div className="space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow print:shadow-none">
          <h3 className="text-lg font-bold mb-4">Tổng hợp Chỉ tiêu Sử dụng đất & Dân số</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse border border-gray-300 dark:border-slate-600">
               <thead className="bg-gray-100 dark:bg-slate-700 font-bold">
                 <tr>
                   <th className="border p-2">Phân khu</th>
                   <th className="border p-2 text-right">Diện tích (ha)</th>
                   <th className="border p-2 text-right">Dân số HT</th>
                   <th className="border p-2 text-right">Dân số DA</th>
                   <th className="border p-2 text-right">Đất ở HT</th>
                   <th className="border p-2 text-right">Đất ở 20N</th>
                   <th className="border p-2 text-right">Giao thông 20N</th>
                 </tr>
               </thead>
               <tbody>
                 {data.subdivisions.map(sub => (
                   <tr key={sub.id}>
                     <td className="border p-2 font-medium">{sub.name}</td>
                     <td className="border p-2 text-right">{formatNumber(sub.area)}</td>
                     <td className="border p-2 text-right">{formatNumber(sub.currentPop)}</td>
                     <td className="border p-2 text-right">{formatNumber(sub.approvedProjectPop)}</td>
                     <td className="border p-2 text-right">{formatNumber(sub.landUseCurrent.residentialUnit)}</td>
                     <td className="border p-2 text-right">{formatNumber(sub.landUse20y.residentialUnit)}</td>
                     <td className="border p-2 text-right">{formatNumber(sub.landUse20y.traffic)}</td>
                   </tr>
                 ))}
                 <tr className="bg-gray-50 dark:bg-slate-700 font-bold">
                   <td className="border p-2">TỔNG CỘNG</td>
                   <td className="border p-2 text-right">{formatNumber(totalSubArea)}</td>
                   <td className="border p-2 text-right">{formatNumber(totalSubPopCurrent)}</td>
                   <td className="border p-2 text-right">{formatNumber(data.subdivisions.reduce((s, x) => s + x.approvedProjectPop, 0))}</td>
                   <td className="border p-2 text-right">-</td>
                   <td className="border p-2 text-right">-</td>
                   <td className="border p-2 text-right">-</td>
                 </tr>
               </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;