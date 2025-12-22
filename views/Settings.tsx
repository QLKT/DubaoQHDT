import React from 'react';
import { AppSettings } from '../types';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Moon, Sun } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSave: (s: AppSettings) => void;
}

const Settings: React.FC<Props> = ({ settings, onSave }) => {
  const handleChange = (field: keyof AppSettings, value: any) => {
    onSave({ ...settings, [field]: value });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
      <h2 className="text-2xl font-bold border-b pb-4 dark:border-slate-700">Cài đặt Ứng dụng</h2>

      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow space-y-6">
        
        <div className="flex items-center justify-between">
          <span className="font-medium">Chế độ giao diện (Sáng/Tối)</span>
          <div className="flex bg-gray-100 dark:bg-slate-700 rounded-lg p-1">
            <button
              onClick={() => handleChange('theme', 'light')}
              className={`p-2 rounded-md flex items-center ${settings.theme === 'light' ? 'bg-white shadow text-yellow-600' : 'text-gray-500'}`}
            >
              <Sun size={20} className="mr-2" /> Sáng
            </button>
            <button
              onClick={() => handleChange('theme', 'dark')}
              className={`p-2 rounded-md flex items-center ${settings.theme === 'dark' ? 'bg-slate-600 shadow text-blue-300' : 'text-gray-500'}`}
            >
              <Moon size={20} className="mr-2" /> Tối
            </button>
          </div>
        </div>

        <Input 
          label="Tên đơn vị sử dụng (Hiển thị trên báo cáo)" 
          value={settings.organizationName}
          onChange={e => handleChange('organizationName', e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Cỡ chữ hiển thị</label>
          <input 
            type="range" min="0.8" max="1.2" step="0.05"
            className="w-full"
            value={settings.fontScale}
            onChange={e => handleChange('fontScale', parseFloat(e.target.value))}
          />
          <div className="flex justify-between text-xs text-gray-500">
            <span>Nhỏ</span>
            <span>Mặc định</span>
            <span>Lớn</span>
          </div>
        </div>

        <div>
           <label className="block text-sm font-medium mb-1">Ngôn ngữ</label>
           <select 
             className="w-full rounded border p-2 dark:bg-slate-700 dark:border-slate-600"
             value={settings.language}
             onChange={e => handleChange('language', e.target.value)}
           >
             <option value="VN">Tiếng Việt</option>
             <option value="EN" disabled>English (Coming Soon)</option>
           </select>
        </div>

      </div>

      <div className="text-center text-gray-500 text-sm">
        <p>UrbanForecaster Pro v1.0.0</p>
        <p>© 2025 Bản quyền thuộc về Đơn vị phát triển.</p>
      </div>
    </div>
  );
};

export default Settings;