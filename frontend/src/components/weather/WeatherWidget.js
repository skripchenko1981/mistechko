import { useEffect, useState } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, Wind, Droplets, Thermometer } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { currentWeather, weatherForecast } from '../../data/mockData';

const WEATHER_API_URL = 'https://api.open-meteo.com/v1/forecast';

const WEATHER_LOCATIONS = [
  {
    id: 'tomakivska',
    name: 'Томаківська громада',
    shortName: 'Томаківка',
    latitude: 47.813333,
    longitude: 34.749167,
  },
  {
    id: 'myrivska',
    name: 'Мирівська громада',
    shortName: 'Мирове',
    latitude: 47.77079,
    longitude: 34.73345,
  },
];

const WEATHER_CODES = {
  0: { condition: 'Ясно', icon: 'sun' },
  1: { condition: 'Переважно ясно', icon: 'sun' },
  2: { condition: 'Мінлива хмарність', icon: 'cloud' },
  3: { condition: 'Похмуро', icon: 'cloud' },
  45: { condition: 'Туман', icon: 'cloud' },
  48: { condition: 'Туман з памороззю', icon: 'cloud' },
  51: { condition: 'Мряка', icon: 'cloud-rain' },
  53: { condition: 'Мряка', icon: 'cloud-rain' },
  55: { condition: 'Сильна мряка', icon: 'cloud-rain' },
  61: { condition: 'Невеликий дощ', icon: 'cloud-rain' },
  63: { condition: 'Дощ', icon: 'cloud-rain' },
  65: { condition: 'Сильний дощ', icon: 'cloud-rain' },
  71: { condition: 'Невеликий сніг', icon: 'snowflake' },
  73: { condition: 'Сніг', icon: 'snowflake' },
  75: { condition: 'Сильний сніг', icon: 'snowflake' },
  77: { condition: 'Снігові зерна', icon: 'snowflake' },
  80: { condition: 'Невеликий зливовий дощ', icon: 'cloud-rain' },
  81: { condition: 'Зливовий дощ', icon: 'cloud-rain' },
  82: { condition: 'Сильна злива', icon: 'cloud-rain' },
  85: { condition: 'Сніговий заряд', icon: 'snowflake' },
  86: { condition: 'Сильний сніговий заряд', icon: 'snowflake' },
  95: { condition: 'Гроза', icon: 'cloud-rain' },
  96: { condition: 'Гроза з градом', icon: 'cloud-rain' },
  99: { condition: 'Гроза з сильним градом', icon: 'cloud-rain' },
};

const getWeatherDescription = (code) => WEATHER_CODES[code] || { condition: 'Змінна погода', icon: 'cloud' };

const getWeatherIcon = (icon, size = 'w-8 h-8', current = false) => {
  const colors = current
    ? { sun: 'text-yellow-300', cloud: 'text-white/80', rain: 'text-blue-200', snow: 'text-blue-100' }
    : { sun: 'text-yellow-500', cloud: 'text-gray-400', rain: 'text-blue-500', snow: 'text-blue-300' };
  const className = size + ' ' + (
    icon === 'sun' ? colors.sun
      : icon === 'cloud-rain' ? colors.rain
        : icon === 'snowflake' ? colors.snow
          : colors.cloud
  );

  switch (icon) {
    case 'sun':
      return <Sun className={className} />;
    case 'cloud-rain':
      return <CloudRain className={className} />;
    case 'snowflake':
      return <Snowflake className={className} />;
    default:
      return <Cloud className={className} />;
  }
};

const formatTime = (value) => value ? value.slice(11, 16) : '—';
const formatDay = (date) => new Intl.DateTimeFormat('uk-UA', { weekday: 'short' }).format(new Date(date + 'T12:00:00'));
const toNumber = (value) => Math.round(Number(value));

const createFallbackWeather = (location) => ({
  ...location,
  isFallback: true,
  current: {
    location: location.shortName,
    temperature: currentWeather.temperature,
    feelsLike: currentWeather.feels_like,
    condition: currentWeather.condition,
    icon: currentWeather.icon,
    windSpeed: currentWeather.wind_speed,
    humidity: currentWeather.humidity,
    pressure: currentWeather.pressure,
    sunrise: currentWeather.sunrise,
    sunset: currentWeather.sunset,
  },
  forecast: weatherForecast,
});

const loadLocationWeather = async (location) => {
  const params = new URLSearchParams({
    latitude: location.latitude,
    longitude: location.longitude,
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,surface_pressure',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset',
    timezone: 'Europe/Kyiv',
    forecast_days: '7',
  });
  const response = await fetch(WEATHER_API_URL + '?' + params.toString());
  if (!response.ok) throw new Error('Weather request failed');
  const data = await response.json();
  const currentDescription = getWeatherDescription(data.current.weather_code);

  return {
    ...location,
    isFallback: false,
    current: {
      location: location.shortName,
      temperature: toNumber(data.current.temperature_2m),
      feelsLike: toNumber(data.current.apparent_temperature),
      condition: currentDescription.condition,
      icon: currentDescription.icon,
      windSpeed: toNumber(data.current.wind_speed_10m),
      humidity: toNumber(data.current.relative_humidity_2m),
      pressure: toNumber(data.current.surface_pressure),
      sunrise: formatTime(data.daily.sunrise[0]),
      sunset: formatTime(data.daily.sunset[0]),
    },
    forecast: data.daily.time.map((date, index) => {
      const description = getWeatherDescription(data.daily.weather_code[index]);
      return {
        date,
        day_of_week: formatDay(date),
        high: toNumber(data.daily.temperature_2m_max[index]),
        low: toNumber(data.daily.temperature_2m_min[index]),
        icon: description.icon,
        precipitation: data.daily.precipitation_probability_max[index] || 0,
      };
    }),
  };
};

function WeatherLocationCard({ weather }) {
  const { current, forecast } = weather;

  return (
    <Card className="bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-white/70">Зараз у</p>
            <h3 className="text-xl font-bold">{weather.name}</h3>
          </div>
          {getWeatherIcon(current.icon, 'w-16 h-16', true)}
        </div>
        <div className="mb-4">
          <span className="text-5xl font-bold">{current.temperature}°</span>
          <span className="text-white/70 ml-2">відчувається як {current.feelsLike}°</span>
        </div>
        <p className="text-lg mb-6">{current.condition}</p>
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-white/70" />
            <div><p className="text-xs text-white/70">Вітер</p><p className="font-medium">{current.windSpeed} км/год</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-white/70" />
            <div><p className="text-xs text-white/70">Вологість</p><p className="font-medium">{current.humidity}%</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-white/70" />
            <div><p className="text-xs text-white/70">Тиск</p><p className="font-medium">{current.pressure} гПа</p></div>
          </div>
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-white/70" />
            <div><p className="text-xs text-white/70">Схід/Захід</p><p className="font-medium text-sm">{current.sunrise} / {current.sunset}</p></div>
          </div>
        </div>
        <div className="mt-6 border-t border-white/20 pt-4">
          <h4 className="mb-3 font-semibold">Прогноз на 7 днів</h4>
          <div className="overflow-x-auto">
            <div className="grid min-w-[560px] grid-cols-7 gap-2">
              {forecast.map((day) => (
                <div key={day.date} className="rounded-lg bg-white/10 p-2 text-center hover:bg-white/20 transition-colors">
                  <p className="text-xs font-medium text-white/80 mb-2">{day.day_of_week}</p>
                  <div className="flex justify-center mb-2">{getWeatherIcon(day.icon, 'w-6 h-6', true)}</div>
                  <p className="font-bold">{day.high}°</p>
                  <p className="text-xs text-white/70">{day.low}°</p>
                  {day.precipitation > 30 && <p className="text-[10px] text-blue-200 mt-1">{day.precipitation}%</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function WeatherWidget() {
  const [weather, setWeather] = useState(() => WEATHER_LOCATIONS.map(createFallbackWeather));
  const [isLoading, setIsLoading] = useState(true);
  const [hasFallback, setHasFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(WEATHER_LOCATIONS.map(async (location) => {
      try {
        return await loadLocationWeather(location);
      } catch (error) {
        return createFallbackWeather(location);
      }
    })).then((result) => {
      if (!cancelled) {
        setWeather(result);
        setHasFallback(result.some((item) => item.isFallback));
        setIsLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, []);

  return (
    <div data-testid="weather-section">
      {isLoading && <div className="mb-4 text-sm text-gray-500">Завантажуємо актуальну погоду...</div>}
      {hasFallback && !isLoading && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Дані одного з прогнозів тимчасово недоступні. Показано резервні дані.
        </div>
      )}
      <div className="grid gap-6 xl:grid-cols-2">
        {weather.map((item) => <WeatherLocationCard key={item.id} weather={item} />)}
      </div>
      <p className="mt-4 text-right text-xs text-gray-400">
        Дані прогнозу: <a href="https://open-meteo.com/" target="_blank" rel="noreferrer" className="hover:underline">Open-Meteo</a>
      </p>
    </div>
  );
}
