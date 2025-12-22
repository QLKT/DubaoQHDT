import React, { useState, useEffect } from 'react';
import { ViewState, ForecastData, AppSettings, PlanningType, UrbanClass } from './types';
import { DEFAULT_FORECAST, MENU_ITEMS } from './constants';
import { Button } from './components/Button';
import { formatNumber } from './utils';

// Views
import Home from './views/Home';
import History from './views/History';
import GeneralInput from './views/GeneralInput';
import PopLaborInput from './views/PopLaborInput';
import SubdivisionInput from './views/SubdivisionInput';
import Results from './views/Results';
import Settings from './views/Settings';

// Icons
import { Menu, Home as HomeIcon, Clock, Database, Users, Map, BarChart2, Settings as SettingsIcon } from 'lucide-react';

const App: React.FC = () => {
  // Global State
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.HOME);
  const [forecast, setForecast] = useState<ForecastData>(DEFAULT_FORECAST);
  const [isForecastActive, setIsForecastActive] = useState<boolean>(false);
  const [history, setHistory] = useState<ForecastData[]>([]);
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'light',
    organizationName: 'Viện Quy hoạch Đô thị',
    fontScale: 1,
    language: 'VN'
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Load History & Settings on Mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('urban_forecast_history');
    if (savedHistory) setHistory(JSON.parse(savedHistory));
    
    const savedSettings = localStorage.getItem('urban_forecast_settings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      setSettings(parsed);
      if (parsed.theme === 'dark') document.documentElement.classList.add('dark');
    }
  }, []);

  // Save History Helper
  const saveSnapshot = (data: ForecastData) => {
    const newHistory = [...history, { ...data, createdDate: new Date().toISOString() }];
    setHistory(newHistory);
    localStorage.setItem('urban_forecast_history', JSON.stringify(newHistory));
  };

  const createForecast = () => {
    const newId = Date.now().toString();
    const newForecast = { 
      ...DEFAULT_FORECAST, 
      id: newId, 
      createdDate: new Date().toISOString() 
    };
    setForecast(newForecast);
    setIsForecastActive(true);
    setCurrentView(ViewState.GENERAL_INPUT);
  };

  // Render Navigation
  const renderSidebarItem = (view: ViewState, label: string, icon: React.ReactNode, disabled = false) => (
    <button
      onClick={() => {
        if (!disabled) {
          setCurrentView(view);
          setIsMobileMenuOpen(false);
        }
      }}
      disabled={disabled}
      className={`flex items-center w-full px-4 py-3 text-left transition-colors ${
        currentView === view
          ? 'bg-blue-100 text-blue-800 border-r-4 border-blue-600 dark:bg-slate-700 dark:text-blue-300'
          : 'text-gray-600 hover:bg-gray-100 dark:text-slate-400 dark:hover:bg-slate-800'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className={`flex h-screen overflow-hidden text-[${settings.fontScale}rem]`}>
      
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 shadow-md z-10 dark:bg-slate-900 dark:border-slate-800 no-print">
        <div className="p-4 border-b dark:border-slate-800">
          <h1 className="text-xl font-bold text-primary dark:text-blue-400">UrbanForecaster</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">{settings.organizationName}</p>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {renderSidebarItem(ViewState.HOME, 'Trang chủ', <HomeIcon size={20} />)}
          {renderSidebarItem(ViewState.HISTORY, 'Lịch sử phiên bản', <Clock size={20} />)}
          
          <div className="my-2 border-t border-gray-100 dark:border-slate-800" />
          
          {renderSidebarItem(ViewState.GENERAL_INPUT, '1. DL Chung & Tăng trưởng', <Database size={20} />, !isForecastActive)}
          {renderSidebarItem(ViewState.POP_LABOR_INPUT, '2. Dân số - Lao động', <Users size={20} />, !isForecastActive)}
          {renderSidebarItem(ViewState.SUBDIVISION_INPUT, '3. Phân khu & SD Đất', <Map size={20} />, !isForecastActive)}
          {renderSidebarItem(ViewState.RESULTS, '4. Kết quả Dự báo', <BarChart2 size={20} />, !isForecastActive)}
          
          <div className="my-2 border-t border-gray-100 dark:border-slate-800" />
          
          {renderSidebarItem(ViewState.SETTINGS, 'Cài đặt', <SettingsIcon size={20} />)}
        </nav>
        <div className="p-4 bg-gray-50 text-xs text-gray-400 dark:bg-slate-950 text-center">
          v1.0.0 © 2025
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50 dark:bg-slate-950">
        
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b shadow-sm dark:bg-slate-900 dark:border-slate-800 no-print">
          <span className="font-bold text-lg dark:text-white">UrbanForecaster</span>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
            <Menu className="dark:text-white" />
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="absolute right-0 top-0 bottom-0 w-64 bg-white dark:bg-slate-900 shadow-xl overflow-y-auto" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b">Menu</div>
              {renderSidebarItem(ViewState.HOME, 'Trang chủ', <HomeIcon size={20} />)}
              {renderSidebarItem(ViewState.HISTORY, 'Lịch sử', <Clock size={20} />)}
              {isForecastActive && (
                <>
                  {renderSidebarItem(ViewState.GENERAL_INPUT, 'DL Chung', <Database size={20} />)}
                  {renderSidebarItem(ViewState.POP_LABOR_INPUT, 'Dân số', <Users size={20} />)}
                  {renderSidebarItem(ViewState.SUBDIVISION_INPUT, 'Phân khu', <Map size={20} />)}
                  {renderSidebarItem(ViewState.RESULTS, 'Kết quả', <BarChart2 size={20} />)}
                </>
              )}
              {renderSidebarItem(ViewState.SETTINGS, 'Cài đặt', <SettingsIcon size={20} />)}
            </div>
          </div>
        )}

        {/* View Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
          {currentView === ViewState.HOME && (
            <Home 
              history={history} 
              onCreate={createForecast} 
              orgName={settings.organizationName}
            />
          )}
          
          {currentView === ViewState.HISTORY && (
            <History 
              history={history} 
              onLoad={(data) => {
                setForecast(data);
                setIsForecastActive(true);
                setCurrentView(ViewState.GENERAL_INPUT);
              }}
            />
          )}

          {currentView === ViewState.GENERAL_INPUT && (
            <GeneralInput 
              data={forecast} 
              onChange={setForecast}
              onNext={() => {
                saveSnapshot(forecast);
                setCurrentView(ViewState.POP_LABOR_INPUT);
              }}
              onClear={() => setForecast({ ...DEFAULT_FORECAST, id: forecast.id, createdDate: forecast.createdDate })}
            />
          )}

          {currentView === ViewState.POP_LABOR_INPUT && (
            <PopLaborInput 
              data={forecast} 
              onChange={setForecast}
              onNext={() => {
                 saveSnapshot(forecast);
                 setCurrentView(ViewState.SUBDIVISION_INPUT);
              }}
            />
          )}

          {currentView === ViewState.SUBDIVISION_INPUT && (
            <SubdivisionInput 
              data={forecast} 
              onChange={setForecast}
              onRunForecast={() => {
                // Logic is handled inside component updates, usually we verify here
                saveSnapshot(forecast);
                setCurrentView(ViewState.RESULTS);
              }}
              onNext={() => {
                saveSnapshot(forecast);
                setCurrentView(ViewState.RESULTS);
              }}
            />
          )}

          {currentView === ViewState.RESULTS && (
            <Results data={forecast} />
          )}

          {currentView === ViewState.SETTINGS && (
            <Settings 
              settings={settings} 
              onSave={(newSettings) => {
                setSettings(newSettings);
                localStorage.setItem('urban_forecast_settings', JSON.stringify(newSettings));
                if (newSettings.theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              }} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;