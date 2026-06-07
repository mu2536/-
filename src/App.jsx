import { useState, useEffect } from 'react';
import { ShirtIcon, PantsIcon } from './ClothingIcons';

const WEATHER_API_KEY = 'fee1ac0faac27c7c5fb63f0aece64e84';
const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_API_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// ── 날씨 SVG 아이콘 ──────────────────────────────────────────
function WeatherIcon({ code, size = 96 }) {
  const s = size;
  // 맑음
  if (code === 800) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="22" fill="#FFD700"/>
      {[0,45,90,135,180,225,270,315].map((deg,i)=>(
        <line key={i} x1="50" y1="50"
          x2={50+38*Math.cos(deg*Math.PI/180)}
          y2={50+38*Math.sin(deg*Math.PI/180)}
          stroke="#FFD700" strokeWidth="4" strokeLinecap="round"
          transform={`rotate(0,50,50)`}
          style={{transformOrigin:'50px 50px'}}
        />
      ))}
      <circle cx="50" cy="50" r="22" fill="#FFD700"/>
      <circle cx="50" cy="50" r="17" fill="#FFF176" opacity="0.5"/>
    </svg>
  );
  // 구름 조금 (801~802)
  if (code >= 801 && code <= 802) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <circle cx="38" cy="42" r="16" fill="#FFD700" opacity="0.9"/>
      {[315,0,45].map((deg,i)=>(
        <line key={i} x1="38" y1="42"
          x2={38+26*Math.cos(deg*Math.PI/180)}
          y2={42+26*Math.sin(deg*Math.PI/180)}
          stroke="#FFD700" strokeWidth="3.5" strokeLinecap="round"/>
      ))}
      <ellipse cx="55" cy="62" rx="24" ry="14" fill="white" opacity="0.9"/>
      <ellipse cx="38" cy="66" rx="18" ry="12" fill="white" opacity="0.9"/>
      <ellipse cx="70" cy="67" rx="15" ry="11" fill="white" opacity="0.85"/>
    </svg>
  );
  // 흐림 (803~804)
  if (code >= 803 && code <= 804) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="45" rx="28" ry="17" fill="#CFD8DC"/>
      <ellipse cx="34" cy="52" rx="20" ry="14" fill="#B0BEC5"/>
      <ellipse cx="65" cy="53" rx="22" ry="14" fill="#B0BEC5"/>
      <ellipse cx="50" cy="60" rx="30" ry="15" fill="#ECEFF1"/>
    </svg>
  );
  // 비 (500~531, 300~321)
  if ((code >= 300 && code <= 321) || (code >= 500 && code <= 531)) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="40" rx="28" ry="17" fill="#90A4AE"/>
      <ellipse cx="34" cy="47" rx="20" ry="14" fill="#78909C"/>
      <ellipse cx="65" cy="48" rx="22" ry="14" fill="#78909C"/>
      <ellipse cx="50" cy="55" rx="30" ry="15" fill="#B0BEC5"/>
      {[[35,72],[45,78],[55,72],[65,78],[50,85]].map(([x,y],i)=>(
        <line key={i} x1={x} y1={y-8} x2={x-3} y2={y+2}
          stroke="#64B5F6" strokeWidth="2.5" strokeLinecap="round"/>
      ))}
    </svg>
  );
  // 천둥번개 (200~232)
  if (code >= 200 && code <= 232) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="38" rx="28" ry="17" fill="#546E7A"/>
      <ellipse cx="34" cy="45" rx="20" ry="14" fill="#455A64"/>
      <ellipse cx="65" cy="46" rx="22" ry="14" fill="#455A64"/>
      <ellipse cx="50" cy="53" rx="30" ry="15" fill="#607D8B"/>
      <polygon points="55,60 47,75 53,75 45,92 62,72 55,72" fill="#FFD700"/>
    </svg>
  );
  // 눈 (600~622)
  if (code >= 600 && code <= 622) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      <ellipse cx="50" cy="40" rx="28" ry="17" fill="#B0BEC5"/>
      <ellipse cx="34" cy="47" rx="20" ry="14" fill="#90A4AE"/>
      <ellipse cx="65" cy="48" rx="22" ry="14" fill="#90A4AE"/>
      <ellipse cx="50" cy="55" rx="30" ry="15" fill="#CFD8DC"/>
      {[[35,73],[48,80],[61,73],[54,87]].map(([x,y],i)=>(
        <text key={i} x={x} y={y} fontSize="10" fill="white" textAnchor="middle">❄</text>
      ))}
    </svg>
  );
  // 안개/먼지 (700~781)
  if (code >= 700 && code <= 781) return (
    <svg width={s} height={s} viewBox="0 0 100 100" fill="none">
      {[30,42,54,66,78].map((y,i)=>(
        <rect key={i} x={i%2===0?15:22} y={y} width={i%2===0?65:55} height="6" rx="3" fill="white" opacity="0.4"/>
      ))}
    </svg>
  );
  // 기본(맑음)
  return <WeatherIcon code={800} size={size}/>;
}



// ── 체감온도 → 코디 결정 ──────────────────────────────────
function getOutfit(feelsLike) {
  if (feelsLike > 23) return {
    type: 'hot',
    title: '더운 날씨 추천 코디',
    subtitle: `체감 ${feelsLike}° — 시원하게!`,
    gradient: 'from-orange-300 to-red-400',
    badge: '🌡️ 더움',
    badgeBg: 'bg-orange-400/30 border-orange-300/50',
    top: { label: '반팔 티셔츠', desc: '가볍고 시원한 반팔', icon: <ShirtIcon type="short"/> },
    bottom: { label: '반바지', desc: '통기성 좋은 반바지', icon: <PantsIcon type="short"/> },
  };
  if (feelsLike <= 20) return {
    type: 'cold',
    title: '추운 날씨 추천 코디',
    subtitle: `체감 ${feelsLike}° — 따뜻하게!`,
    gradient: 'from-blue-300 to-cyan-400',
    badge: '❄️ 추움',
    badgeBg: 'bg-blue-400/30 border-blue-300/50',
    top: { label: '긴팔 티셔츠', desc: '따뜻한 긴팔 상의', icon: <ShirtIcon type="long"/> },
    bottom: { label: '긴바지', desc: '보온성 좋은 긴바지', icon: <PantsIcon type="long"/> },
  };
  return {
    type: 'mild',
    title: '선선한 날씨 추천 코디',
    subtitle: `체감 ${feelsLike}° — 가볍게 걸치세요!`,
    gradient: 'from-green-300 to-teal-400',
    badge: '🌤️ 선선함',
    badgeBg: 'bg-green-400/30 border-green-300/50',
    top: { label: '가디건', desc: '얇은 가디건이나 긴팔', icon: <ShirtIcon type="cardigan"/> },
    bottom: { label: '슬랙스', desc: '편안한 슬랙스', icon: <PantsIcon type="slacks"/> },
  };
}

// ── WeatherDashboard ─────────────────────────────────────
function WeatherDashboard({ weatherData }) {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!weatherData) return (
    <header style={{ minHeight: 180 }} className="flex flex-col items-center justify-center space-y-3 p-6">
      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"/>
      <p className="text-white/60 animate-pulse text-sm">날씨 데이터 불러오는 중...</p>
    </header>
  );

  return (
    <header className="p-6 flex flex-col items-center fade-in">
      <div className="flex justify-between w-full text-white/40 text-xs mb-3">
        <span>{weatherData.location}</span>
        <span>{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div className="flex items-center space-x-5">
        <div className="floating drop-shadow-lg">
          <WeatherIcon code={weatherData.code} size={88}/>
        </div>
        <div className="text-7xl font-bold tracking-tight">{weatherData.temp}°</div>
      </div>
      <p className="text-sm text-white/60 mt-2">
        {weatherData.condition} · 체감 {weatherData.feelsLike}° · 습도 {weatherData.humidity}%
      </p>
    </header>
  );
}

// ── OutfitRecommendation ──────────────────────────────────
// ── WeeklyForecast ───────────────────────────────────────
const DAY_KO = ['일','월','화','수','목','금','토'];

function WeeklyForecast({ forecast }) {
  if (!forecast || forecast.length === 0) return (
    <div className="bg-white/5 rounded-2xl px-4 py-3 border border-white/10">
      <p className="text-xs text-white/40 text-center">예보 데이터 불러오는 중...</p>
    </div>
  );

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <div className="px-4 pt-3 pb-1 flex items-center justify-between">
        <span className="text-xs font-semibold text-white/70 tracking-wide">📅 주간 예보</span>
      </div>
      <div className="flex overflow-x-auto scrollbar-hide px-3 pb-3 gap-2">
        {forecast.map((day, i) => {
          const isToday = i === 0;
          return (
            <div key={i} className={`flex-shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-2xl border transition-all ${
              isToday
                ? 'bg-white/20 border-white/30'
                : 'bg-white/5 border-white/10 hover:bg-white/10'
            }`}>
              <span className="text-xs font-bold text-white/80">{isToday ? '오늘' : DAY_KO[day.dow]}</span>
              <WeatherIcon code={day.code} size={32}/>
              <span className="text-xs font-bold text-white">{day.max}°</span>
              <span className="text-xs text-white/40">{day.min}°</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OutfitRecommendation({ weatherData, forecast }) {
  if (!weatherData) return null;
  const outfit = getOutfit(weatherData.feelsLike);

  return (
    <section className="flex-1 w-full flex flex-col px-5 pb-6 space-y-4 overflow-y-auto scrollbar-hide">
      <div className="flex flex-col items-center space-y-1">
        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${outfit.badgeBg}`}>{outfit.badge}</span>
        <h2 className={`text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r ${outfit.gradient}`}>
          {outfit.title}
        </h2>
        <p className="text-xs text-white/40">{outfit.subtitle}</p>
      </div>

      <div className="flex space-x-4 w-full">
        {[
          { label: 'Top', item: outfit.top },
          { label: 'Bottom', item: outfit.bottom },
        ].map(({ label, item }) => (
          <div key={label}
            className="flex-1 bg-white/5 rounded-3xl p-3 border border-white/10 flex flex-col items-center hover:bg-white/10 transition-all duration-300 hover:scale-[1.02]">
            <span className="text-xs text-white/40 uppercase tracking-widest mb-1">{label}</span>
            <div className="w-full aspect-square bg-white/5 rounded-2xl flex items-center justify-center overflow-hidden">
              {item.icon}
            </div>
            <span className="text-sm font-semibold text-white/90 mt-2">{item.label}</span>
            <span className="text-xs text-white/40 text-center">{item.desc}</span>
          </div>
        ))}
      </div>

      <WeeklyForecast forecast={forecast}/>
    </section>
  );
}

// ── App ───────────────────────────────────────────────────
// 5일 예보 데이터를 일별로 집계
function parseForecast(list) {
  const map = {};
  list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const key = date.toDateString();
    if (!map[key]) {
      map[key] = { dow: date.getDay(), max: -999, min: 999, code: item.weather[0].id, temps: [] };
    }
    map[key].temps.push(item.main.temp);
    map[key].max = Math.max(map[key].max, Math.round(item.main.temp_max));
    map[key].min = Math.min(map[key].min, Math.round(item.main.temp_min));
  });
  return Object.values(map).slice(0, 7);
}

export default function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [forecast, setForecast] = useState([]);

  useEffect(() => {
    const parse = (data) => setWeatherData({
      location: data.name,
      temp: Math.round(data.main.temp),
      condition: data.weather[0].description,
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      code: data.weather[0].id,        // ← 날씨 코드 추가
    });

    const fetch_ = async (url) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.cod === 200) parse(data);
        else throw new Error(data.message);
      } catch {
        setWeatherData({ location: '서울 (Mock)', temp: 22, condition: '맑음', feelsLike: 21, humidity: 55, code: 800 });
      }
    };

    const fetchForecast = async (lat, lon) => {
      try {
        const url = lat != null
          ? `${FORECAST_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`
          : `${FORECAST_API_URL}?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`;
        const res = await fetch(url);
        const data = await res.json();
        if (data.list) setForecast(parseForecast(data.list));
      } catch { /* 예보 실패 시 무시 */ }
    };

    if (WEATHER_API_KEY) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords: { latitude: lat, longitude: lon } }) => {
            fetch_(`${WEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
            fetchForecast(lat, lon);
          },
          () => {
            fetch_(`${WEATHER_API_URL}?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
            fetchForecast(null, null);
          }
        );
      } else {
        fetch_(`${WEATHER_API_URL}?q=Seoul&appid=${WEATHER_API_KEY}&units=metric&lang=kr`);
        fetchForecast(null, null);
      }
    } else {
      setTimeout(() => setWeatherData({ location: '서울', temp: 22, condition: '맑음', feelsLike: 21, humidity: 55, code: 800 }), 800);
    }
  }, []);

  return (
    <div style={{
      background: 'linear-gradient(135deg,#1e1b4b 0%,#4c1d95 100%)',
      minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Pretendard', sans-serif", color: 'white',
    }}>
      <div style={{
        width: '100%', maxWidth: 420, height: '100dvh', maxHeight: 860,
        background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)', borderRadius: 'clamp(0px,5vw,48px)',
        border: '1px solid rgba(255,255,255,0.15)', boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
        display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <WeatherDashboard weatherData={weatherData}/>
        <OutfitRecommendation weatherData={weatherData} forecast={forecast}/>
      </div>
    </div>
  );
}
