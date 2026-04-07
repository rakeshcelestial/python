// types.ts — TypeScript interfaces for the Weather Dashboard

// ── Core Data Types ───────────────────────────────────────────

export interface GeoResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code?: string;
  admin1?: string;
  admin2?: string;
  timezone?: string;
  population?: number;
}

export interface WMOCodeEntry {
  label: string;
  icon: string;
}

export interface WeatherData {
  city: string;
  country: string;
  lat: number;
  lon: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  condition: string;
  icon: string;
  isDay: boolean;
  fetchedAt?: number; // timestamp for cache invalidation
}

// ── App State ─────────────────────────────────────────────────

export type Theme = 'light' | 'dark';
export type TempUnit = 'C' | 'F';
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface AppState {
  currentWeather: WeatherData | null;
  favorites: WeatherData[];
  loading: boolean;
  error: string | null;
  theme: Theme;
  tempUnit: TempUnit;
}

// ── Observer Pattern ──────────────────────────────────────────

export type StateKey = keyof AppState;
export type Subscriber<K extends StateKey> = (value: AppState[K], fullState: AppState) => void;
export type Unsubscribe = () => void;

export interface StateStore {
  getState(): AppState;
  setState(patch: Partial<AppState>): void;
  subscribe<K extends StateKey>(key: K, callback: Subscriber<K>): Unsubscribe;
}

// ── API Response Types ────────────────────────────────────────

export interface OpenMeteoCurrentWeather {
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  weather_code: number;
  wind_speed_10m: number;
  is_day: 0 | 1;
  time: string;
  interval: number;
}

export interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units: Record<string, string>;
  current: OpenMeteoCurrentWeather;
}

export interface GeocodingResponse {
  results?: GeoResult[];
  generationtime_ms: number;
}

// ── Storage Types ─────────────────────────────────────────────

export interface StorageService {
  loadFavorites(): WeatherData[];
  saveFavorites(favorites: WeatherData[]): void;
  addFavorite(data: WeatherData): WeatherData[];
  removeFavorite(city: string, country: string): WeatherData[];
  isFavorite(city: string, country: string): boolean;
  loadTheme(): Theme;
  saveTheme(theme: Theme): void;
  setLastCityCookie(city: string): void;
  getLastCityCookie(): string | null;
}

// ── UI Types ──────────────────────────────────────────────────

export interface UIService {
  showToast(message: string, type?: ToastType, duration?: number): void;
  showSpinner(): void;
  hideSpinner(): void;
  buildWeatherCard(data: WeatherData, isFav?: boolean): HTMLElement;
  renderCurrentWeather(data: WeatherData): void;
  clearCurrentWeather(): void;
  renderFavorites(favorites: WeatherData[]): void;
  showError(message: string, onRetry?: () => void): void;
  showSuggestions(results: GeoResult[], onSelect: (geo: GeoResult) => void): void;
  clearSuggestions(): void;
  applyTheme(theme: Theme): void;
  showSearchError(message: string): void;
  clearSearchError(): void;
}

// ── Validation Types ──────────────────────────────────────────

export interface ValidationResult {
  valid: boolean;
  message: string;
}

// ── Event Handling ────────────────────────────────────────────

export type SearchEventHandler = (query: string) => Promise<void>;
export type FavoriteToggleHandler = (city: string, country: string) => void;
export type ThemeToggleHandler = () => void;

// ── Utility Types ─────────────────────────────────────────────

export type DebouncedFunction<T extends (...args: unknown[]) => unknown> = 
  (...args: Parameters<T>) => void;

export interface ElementAttrs {
  className?: string;
  textContent?: string;
  [attr: string]: string | undefined;
}
