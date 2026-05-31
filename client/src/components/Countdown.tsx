import { useState, useEffect } from 'react'

const EVENT_DATE = new Date('2026-06-18T15:00:00')

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function getTimeLeft(): TimeLeft {
  const diff = EVENT_DATE.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

function Unit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl flex items-center justify-center text-2xl sm:text-3xl font-bold text-white font-display"
        style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
      >
        {String(value).padStart(2, '0')}
      </div>
      <span className="text-xs mt-2 text-blue-200 uppercase tracking-wider">{label}</span>
    </div>
  )
}

export default function Countdown() {
  const [time, setTime] = useState(getTimeLeft)

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="flex items-center gap-3 sm:gap-4">
      <Unit value={time.days} label="Jours" />
      <span className="text-white text-2xl font-bold mb-5 opacity-60">:</span>
      <Unit value={time.hours} label="Heures" />
      <span className="text-white text-2xl font-bold mb-5 opacity-60">:</span>
      <Unit value={time.minutes} label="Min" />
      <span className="text-white text-2xl font-bold mb-5 opacity-60">:</span>
      <Unit value={time.seconds} label="Sec" />
    </div>
  )
}
