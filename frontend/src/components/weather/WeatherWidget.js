import { Sun, Cloud, CloudRain, Snowflake, Wind, Droplets, Thermometer } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { currentWeather, weatherForecast } from '../../data/mockData';

const getWeatherIcon = (icon, size = 'w-8 h-8') => {
  switch (icon) {
    case 'sun':
      return <Sun className={`${size} text-yellow-500`} />;
    case 'cloud-rain':
      return <CloudRain className={`${size} text-blue-500`} />;
    case 'snowflake':
      return <Snowflake className={`${size} text-blue-300`} />;
    default:
      return <Cloud className={`${size} text-gray-400`} />;
  }
};

export function WeatherWidget() {
  return (
    <div className="grid lg:grid-cols-3 gap-6" data-testid="weather-section">
      {/* Current Weather */}
      <Card className="lg:col-span-1 bg-gradient-to-br from-[#1e3a5f] to-[#2c5282] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-white/70">Зараз у</p>
              <h3 className="text-xl font-bold">{currentWeather.location}</h3>
            </div>
            {getWeatherIcon(currentWeather.icon, 'w-16 h-16')}
          </div>
          
          <div className="mb-4">
            <span className="text-5xl font-bold">{currentWeather.temperature}°</span>
            <span className="text-white/70 ml-2">відчувається як {currentWeather.feels_like}°</span>
          </div>
          
          <p className="text-lg mb-6">{currentWeather.condition}</p>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-white/70" />
              <div>
                <p className="text-xs text-white/70">Вітер</p>
                <p className="font-medium">{currentWeather.wind_speed} км/год</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-white/70" />
              <div>
                <p className="text-xs text-white/70">Вологість</p>
                <p className="font-medium">{currentWeather.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-white/70" />
              <div>
                <p className="text-xs text-white/70">Тиск</p>
                <p className="font-medium">{currentWeather.pressure} гПа</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Sun className="w-4 h-4 text-white/70" />
              <div>
                <p className="text-xs text-white/70">Схід/Захід</p>
                <p className="font-medium text-sm">{currentWeather.sunrise} / {currentWeather.sunset}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Forecast */}
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-bold text-[#1e3a5f] mb-4">Прогноз на тиждень</h3>
          <div className="grid grid-cols-7 gap-2">
            {weatherForecast.map((day) => (
              <div 
                key={day.date}
                className="text-center p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <p className="text-sm font-medium text-gray-600 mb-2">{day.day_of_week}</p>
                <div className="flex justify-center mb-2">
                  {getWeatherIcon(day.icon, 'w-8 h-8')}
                </div>
                <p className="text-lg font-bold text-[#1e3a5f]">{day.high}°</p>
                <p className="text-sm text-gray-500">{day.low}°</p>
                {day.precipitation > 30 && (
                  <p className="text-xs text-blue-500 mt-1">{day.precipitation}%</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
