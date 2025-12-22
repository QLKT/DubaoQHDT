import { PlanningType, UrbanClass, ForecastData, YearData, LaborData, LandUseIndicators } from './types';

export const INITIAL_YEAR_DATA: YearData[] = Array.from({ length: 5 }, (_, i) => ({
  year: new Date().getFullYear() - 5 + i,
  totalPop: 0,
  urbanPop: 0,
  urbanRate: 0,
  naturalGrowthRate: 0,
  mechanicalGrowthRate: 0
}));

export const INITIAL_LABOR_DATA: LaborData[] = Array.from({ length: 5 }, (_, i) => ({
  year: new Date().getFullYear() - 5 + i,
  sector1: 0,
  sector2: 0,
  sector3: 0
}));

export const EMPTY_LAND_USE: LandUseIndicators = {
  residentialUnit: 0,
  urbanService: 0,
  unitService: 0,
  urbanGreen: 0,
  unitGreen: 0,
  traffic: 0,
  maxDensity: 0,
  maxHeight: 0,
  maxLandUseCoef: 0
};

export const DEFAULT_FORECAST: ForecastData = {
  id: '',
  name: '',
  location: '',
  planningType: PlanningType.GENERAL,
  urbanClass: UrbanClass.TYPE_5,
  createdDate: '',
  growthThresholdDn: 1.0,
  totalArea: 0,
  currentDensity: 0,
  historicalPop: INITIAL_YEAR_DATA,
  historicalLabor: INITIAL_LABOR_DATA,
  naturalGrowthRate5y: 0,
  mechanicalGrowthRate5y: 0,
  
  // New fields v1.2
  visitorsTotal: 0,
  averageStayDays: 1,
  convertedShortTermPop: 0,
  laborProjected10y: { sector1: 0, sector2: 0, sector3: 0 },
  laborProjected20y: { sector1: 0, sector2: 0, sector3: 0 },

  convertedPopCurrent: 0,
  convertedPop10y: 0,
  convertedPop20y: 0,
  convertedPop50y: 0,
  subdivisions: []
};

export const MENU_ITEMS = [
  { id: 1, label: 'Trang chủ', icon: '🏠' },
  { id: 2, label: 'Lịch sử phiên bản', icon: 'clock' },
  { id: 3, label: 'Nhập DL Chung', icon: '📝' },
  { id: 4, label: 'Nhập DL Dân số - Lao động', icon: '👥' },
  { id: 5, label: 'Nhập DL Phân khu', icon: '🏗️' },
  { id: 6, label: 'Kết quả Dự báo', icon: '📊' },
  { id: 7, label: 'Cài đặt', icon: '⚙️' },
];