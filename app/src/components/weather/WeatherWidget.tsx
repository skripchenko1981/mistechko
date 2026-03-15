import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Cloud, 
  Sun, 
  CloudRain, 
  Snowflake, 
  Wind, 
  Droplets, 
  Gauge, 
  Sunrise, 
  Sunset,
  Thermometer,
  MapPin
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { currentWeather, weatherForecast } from '@/data/mockData';

const getWeatherIcon = (icon: string, className = "w-6 h-6") => {
  switch (icon) {
    case 'sun': return <Sun className={`${className} text-yellow-500`} />;
    case 'cloud-rain': return <CloudRain className={`${className} text-blue-500`} />;
    case 'snowflake': return <Snowflake className={`${className} text-blue-300`} />;
    default: return <Cloud className={`${className} text-gray-400`} />;
  }
};

export function WeatherWidget() {
  const [selectedLocation, setSelectedLocation] = useState<'zelene' | 'sonyachny'>('zelene');

  const locationNames = {
    zelene: 'с. Зелене',
    sonyachny: 'мікрорайон Сонячний'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
    >
      <Card className="overflow-hidden bg-gradient-to-br from-[#1e3a5f] to-[#2a4a73] text-white">
        <CardContent className="p-6">
          <Tabs defaultValue="current" className="w-full">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-[#e67e22]" />
                <select 
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value as 'zelene' | 'sonyachny')}
                  className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-[#e67e22]"
                >
                  <option value="zelene">{locationNames.zelene}</option>
                  <option value="sonyachny">{locationNames.sonyachny}</option>
                </select>
              </div>
              <TabsList className="bg-white/10">
                <TabsTrigger value="current" className="data-[state=active]:bg-[#e67e22]">
                  Зараз
                </TabsTrigger>
                <TabsTrigger value="forecast" className="data-[state=active]:bg-[#e67e22]">
                  Прогноз
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="current" className="mt-0">
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Main weather info */}
                <div className="flex items-center gap-4">
                  {getWeatherIcon(currentWeather.icon, "w-20 h-20")}
                  <div>
                    <div className="text-5xl font-bold">
                      {currentWeather.temperature}°
                    </div>
                    <div className="text-white/70">
                      Відчувається як {currentWeather.feelsLike}°
                    </div>
                    <div className="text-lg font-medium mt-1">
                      {currentWeather.condition}
                    </div>
                  </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-grow">
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                    <Droplets className="w-5 h-5 text-blue-300" />
                    <div>
                      <p className="text-xs text-white/60">Вологість</p>
                      <p className="font-semibold">{currentWeather.humidity}%</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                    <Wind className="w-5 h-5 text-gray-300" />
                    <div>
                      <p className="text-xs text-white/60">Вітер</p>
                      <p className="font-semibold">{currentWeather.windSpeed} км/год</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                    <Gauge className="w-5 h-5 text-green-300" />
                    <div>
                      <p className="text-xs text-white/60">Тиск</p>
                      <p className="font-semibold">{currentWeather.pressure} гПа</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                    <Thermometer className="w-5 h-5 text-orange-300" />
                    <div>
                      <p className="text-xs text-white/60">УФ-індекс</p>
                      <p className="font-semibold">{currentWeather.uvIndex}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                    <Sunrise className="w-5 h-5 text-yellow-300" />
                    <div>
                      <p className="text-xs text-white/60">Схід</p>
                      <p className="font-semibold">{currentWeather.sunrise}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3 flex items-center gap-3">
                    <Sunset className="w-5 h-5 text-orange-400" />
                    <div>
                      <p className="text-xs text-white/60">Захід</p>
                      <p className="font-semibold">{currentWeather.sunset}</p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="forecast" className="mt-0">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
                {weatherForecast.map((day, index) => (
                  <div 
                    key={index}
                    className="bg-white/10 rounded-lg p-3 text-center hover:bg-white/20 transition-colors"
                  >
                    <p className="text-sm font-medium text-[#e67e22]">{day.dayOfWeek}</p>
                    <p className="text-xs text-white/60 mb-2">
                      {new Date(day.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'numeric' })}
                    </p>
                    <div className="flex justify-center my-2">
                      {getWeatherIcon(day.icon, "w-8 h-8")}
                    </div>
                    <p className="text-lg font-bold">{day.high}°</p>
                    <p className="text-sm text-white/60">{day.low}°</p>
                    <p className="text-xs text-blue-300 mt-1">{day.precipitation}%</p>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}
