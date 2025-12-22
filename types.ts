export enum ViewState {
  HOME = 'HOME',
  HISTORY = 'HISTORY',
  GENERAL_INPUT = 'GENERAL_INPUT',
  POP_LABOR_INPUT = 'POP_LABOR_INPUT',
  SUBDIVISION_INPUT = 'SUBDIVISION_INPUT',
  RESULTS = 'RESULTS',
  SETTINGS = 'SETTINGS',
}

export enum PlanningType {
  GENERAL = 'QH Chung',
  ZONING = 'QH Phân khu',
  DETAILED = 'QH Chi tiết',
  OTHER = 'Khác'
}

export enum UrbanClass {
  SPECIAL = 'Loại Đặc biệt',
  TYPE_1 = 'Loại I',
  TYPE_2 = 'Loại II',
  TYPE_3 = 'Loại III',
  TYPE_4 = 'Loại IV',
  TYPE_5 = 'Loại V',
}

export interface YearData {
  year: number;
  totalPop: number;
  urbanPop: number;
  urbanRate: number; // calculated
  naturalGrowthRate: number; // New column per year
  mechanicalGrowthRate: number; // New column per year
}

export interface LaborData {
  year: number;
  sector1: number; // Agriculture
  sector2: number; // Industry
  sector3: number; // Service
}

export interface LaborStructure {
  sector1: number; // %
  sector2: number; // %
  sector3: number; // %
}

export interface LandUseIndicators {
  residentialUnit: number; // Đất đơn vị ở
  urbanService: number; // CC dịch vụ đô thị
  unitService: number; // CC dịch vụ đơn vị ở
  urbanGreen: number; // Cây xanh đô thị
  unitGreen: number; // Cây xanh đơn vị ở
  traffic: number; // Giao thông
  // Extra for non-General planning
  maxDensity?: number;
  maxHeight?: number;
  maxLandUseCoef?: number;
}

export interface Subdivision {
  id: string;
  name: string;
  area: number; // ha
  currentPop: number;
  approvedProjectPop: number;
  naturalGrowthRate: number; // %
  mechanicalGrowthRate: number; // %
  convertedPop: number; // From Menu 4
  
  // Land Use Data for stages
  landUseCurrent: LandUseIndicators;
  landUse10y: LandUseIndicators;
  landUse20y: LandUseIndicators;
  landUse50y: LandUseIndicators;
}

export interface ForecastData {
  id: string;
  name: string;
  location: string;
  planningType: PlanningType;
  urbanClass: UrbanClass;
  createdDate: string;
  
  // Menu 3
  growthThresholdDn: number;
  totalArea: number; // ha
  currentDensity: number; // Calculated
  
  // Menu 4
  historicalPop: YearData[]; // 5 years
  historicalLabor: LaborData[]; // 5 years
  naturalGrowthRate5y: number; // Average last 5 years (Calculated from HistoricalPop)
  mechanicalGrowthRate5y: number; // Average last 5 years (Calculated from HistoricalPop)
  
  // Pop Conversion Logic
  visitorsTotal: number; // Nt
  averageStayDays: number; // m
  convertedShortTermPop: number; // N0 = (2*Nt*m)/365
  
  // Labor Forecast
  laborProjected10y: LaborStructure;
  laborProjected20y: LaborStructure;
  
  convertedPopCurrent: number;
  convertedPop10y: number;
  convertedPop20y: number;
  convertedPop50y: number;

  // Menu 5
  subdivisions: Subdivision[];
}

export interface AppSettings {
  theme: 'light' | 'dark';
  organizationName: string;
  fontScale: number;
  language: 'VN' | 'EN';
}