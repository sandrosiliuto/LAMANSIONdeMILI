import { useState, useEffect, useRef, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Volume2, 
  VolumeX, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles, 
  Compass, 
  MailOpen, 
  Heart, 
  Music, 
  UtensilsCrossed, 
  CheckCircle,
  Copy,
  ChevronRight,
  Gift
} from "lucide-react";

// Types for Guest RSVP
interface RSVPData {
  name: string;
  attending: boolean;
  companion: boolean;
  diet: string;
  message: string;
  date: string;
}

export default function App() {
  // State variables
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [showRSVP, setShowRSVP] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showGift, setShowGift] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);
  const [guests, setGuests] = useState<RSVPData[]>(() => {
    // Standard guests pre-populated to make the list look rich initially!
    const defaultGuests: RSVPData[] = [
      { name: "Sofía Martínez", attending: true, companion: true, diet: "Ninguna", message: "¡Un sueño cumplido! Deseando brindar contigo Mili! 🥂", date: "16/06/2026" },
      { name: "Carlos González", attending: true, companion: false, diet: "Ninguna", message: "¡Por los sueños y el buen rollo! ¡Allí estaré!", date: "16/06/2026" },
      { name: "Marta & Javier", attending: true, companion: true, diet: "Sin Gluten", message: "¡Qué gran fiesta se viene! 🎉 Una reina en su palacio.", date: "16/06/2026" }
    ];
    try {
      const stored = localStorage.getItem("mili_mansion_rsvps");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Error reading localStorage", e);
    }
    return defaultGuests;
  });

  // RSVP Form fields State
  const [formName, setFormName] = useState("");
  const [formAttending, setFormAttending] = useState<boolean>(true);
  const [formCompanion, setFormCompanion] = useState<boolean>(false);
  const [formDiet, setFormDiet] = useState("Ninguna");
  const [formMessage, setFormMessage] = useState("");
  const [rsvpSubmitted, setRsvpSubmitted] = useState(false);
  const [registeredName, setRegisteredName] = useState("");

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Time Countdown state
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate Countdown
  useEffect(() => {
    const targetDate = new Date("2026-07-11T21:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Golden Sparkles Background Effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Array<{
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;
      maxOpacity: number;
      fadeSpeed: number;
      color: string;
    }> = [];

    const handleResize = () => {
      canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };

    handleResize();
    const resizeObserver = new ResizeObserver(() => handleResize());
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Colors: elegant champagne gold variations
    const goldTones = [
      "rgba(243, 231, 196, 0.6)",
      "rgba(216, 174, 87, 0.5)",
      "rgba(203, 157, 60, 0.6)",
      "rgba(246, 233, 203, 0.7)",
      "rgba(255, 255, 255, 0.8)"
    ];

    const generateParticle = () => {
      const size = Math.random() * 2.5 + 0.5;
      const originalOpacity = Math.random() * 0.4 + 0.2;
      return {
        x: Math.random() * canvas.width,
        y: canvas.height + 10,
        size: size,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -(Math.random() * 0.6 + 0.2),
        opacity: 0, // start transparent and fade in
        maxOpacity: originalOpacity,
        fadeSpeed: Math.random() * 0.01 + 0.005,
        color: goldTones[Math.floor(Math.random() * goldTones.length)]
      };
    };

    // Populate initial particles
    const initialCount = Math.floor((canvas.width * canvas.height) / 18000);
    for (let i = 0; i < initialCount; i++) {
      const p = generateParticle();
      p.y = Math.random() * canvas.height; // scatter across client height
      p.opacity = p.maxOpacity * Math.random();
      particles.push(p);
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw and update particles
      particles.forEach((p, index) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = p.size * 3;
        ctx.shadowColor = "rgba(216, 174, 87, 0.5)";
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;

        // Fade in or out gracefully
        if (p.y < 0) {
          // Reset particle to bottom
          particles[index] = generateParticle();
        } else {
          if (p.opacity < p.maxOpacity) {
            p.opacity += p.fadeSpeed;
          }
        }
      });

      // Maintain ideal speed-dependent count
      const targetCount = Math.min(120, Math.floor((canvas.width * canvas.height) / 12000));
      if (particles.length < targetCount && Math.random() < 0.1) {
        particles.push(generateParticle());
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, [isOpen]);

  // Audio Play Trigger
  const handleOpenInvitation = () => {
    setIsOpen(true);
    // Standard audio permission bypass
    const timer = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
          })
          .catch((error) => {
            console.log("Audio autoplay failed or blocked, waiting for manual trigger:", error);
            // It is standard browser behavior, user can click play manually.
          });
      }
    }, 400);
    return () => clearTimeout(timer);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch(() => {
          setAudioError(true);
        });
    }
  };

  // RSVP Form submission handler
  const handleRSVPSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newRsvp: RSVPData = {
      name: formName,
      attending: formAttending,
      companion: formCompanion,
      diet: formDiet,
      message: formMessage || (formAttending ? "¡Allí estaré para celebrar por todo lo alto! 🎉" : "¡Felicidades Mili! Lo lamento mucho."),
      date: new Date().toLocaleDateString("es-ES")
    };

    const updatedGuests = [newRsvp, ...guests];
    setGuests(updatedGuests);
    
    try {
      localStorage.setItem("mili_mansion_rsvps", JSON.stringify(updatedGuests));
    } catch (e) {
      console.error("Localstorage saving failed", e);
    }

    setRegisteredName(formName);
    setRsvpSubmitted(true);
    
    // Smooth reset
    setFormName("");
    setFormDiet("Ninguna");
    setFormMessage("");
  };

  const copyBankDetails = () => {
    navigator.clipboard.writeText("ES12 3456 7890 1234 5678 9012");
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#1a0508] text-gold-100 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-x-hidden font-sans select-none relative">
      
      {/* Background Starry Particles when Opened */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
      />

      {/* Embedded Audio File (fiesta.mp3) */}
      <audio
        ref={audioRef}
        src="fiesta.mp3"
        loop
        onError={() => setAudioError(true)}
      />

      {/* --- ENVELOPE INTRO SCREEN (Unopened State) --- */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1, y: -20, transition: { duration: 0.6, ease: "easeInOut" } }}
            className="w-full max-w-xl aspect-[4/3] bg-gradient-to-br from-[#faf6eb] via-[#faf1db] to-[#f1deb3] rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.8)] border border-gold-300 p-8 flex flex-col justify-between items-center z-50 text-stone-900 overflow-hidden relative"
            id="envelope-wrapper"
          >
            {/* Elegant luxury pattern outlines on Envelope cover */}
            <div className="absolute top-2 left-2 right-2 bottom-2 border border-gold-400 opacity-60 pointer-events-none rounded-xl" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold-500/30 pointer-events-none rounded-lg" />
            
            {/* Corner Ornaments */}
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 gold-border-gradient" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 gold-border-gradient" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 gold-border-gradient" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 gold-border-gradient" />

            {/* Simulated Envelope Flap Shadow */}
            <div className="absolute -top-1/2 left-0 right-0 h-full bg-gradient-to-b from-[#e3cfab]/30 to-transparent transform rotate-12 scale-150 origin-top pointer-events-none" />

            <div className="flex flex-col items-center mt-6 z-20">
              {/* Crown Ornament */}
              <motion.div 
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="text-gold-500 mb-2 pointer-events-none"
              >
                <svg className="w-12 h-12 fill-gold-500 filter drop-shadow" viewBox="0 0 24 24">
                  <path d="M12,2L16,7L22,4L20,18H4L2,4L8,7L12,2M4,20H20V22H4V20Z" />
                </svg>
              </motion.div>
              
              <h2 className="font-display font-medium text-xl tracking-[0.2em] text-stone-850 text-center uppercase">
                Invitación Exclusiva
              </h2>
              <div className="w-16 h-[1px] bg-gold-400 my-3" />
              <p className="font-serif italic text-lg text-gold-700 font-semibold tracking-wide text-center">
                Mili te invita a un momento inolvidable...
              </p>
            </div>

            {/* Gorgeous Interactive Luxury Seal */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleOpenInvitation}
              className="group flex flex-col items-center justify-center cursor-pointer my-4 z-20 relative focus:outline-none"
              id="open-seal-btn"
            >
              {/* Spinning background halo */}
              <div className="absolute w-24 h-24 rounded-full border border-dashed border-gold-500/50 animate-spin" style={{ animationDuration: '24s' }} />
              
              <div className="w-20 h-20 bg-gradient-to-br from-[#1a0508] via-[#4a111a] to-[#2c0910] rounded-full border-2 border-gold-400 flex items-center justify-center gold-box-shadow relative overflow-hidden">
                {/* Wax seal effect highlight */}
                <div className="absolute inset-1 rounded-full border border-gold-200/20" />
                <MailOpen className="w-9 h-9 text-gold-200 group-hover:text-white transition-colors animate-float" />
              </div>
              <span className="mt-3 font-display text-xs font-semibold uppercase tracking-[0.25em] text-gold-600 group-hover:text-gold-500 transition-all">
                Abrir Invitación
              </span>
            </motion.button>

            <div className="text-center mb-4 z-20">
              <p className="font-sans text-[11px] uppercase tracking-[0.15em] text-stone-500">
                Inauguración Oficial • Mili
              </p>
              <p className="font-mono text-[10px] text-stone-400 mt-1">
                SAVE THE DATE: 11 / 07 / 2026
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- MASTER INVITATION CARD (Opened State) --- */}
      <AnimatePresence>
        {isOpen && (
          <motion.main
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 60, damping: 15, delay: 0.3 }}
            className="w-full max-w-2xl bg-[#faf6eb] text-stone-800 rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden relative z-20 border-4 border-gold-200"
            id="invitation-card"
          >
            {/* Elegant Luxury Background Pattern with subtle gradients */}
            <div className="absolute inset-0 luxury-marble-bg opacity-100 pointer-events-none" />

            {/* Glistening outer frame with classic gold corners */}
            <div className="absolute top-3 left-3 right-3 bottom-3 border-2 border-gold-400/50 pointer-events-none rounded-2xl" />
            <div className="absolute top-4 left-4 right-4 bottom-4 border border-gold-500/20 pointer-events-none rounded-xl" />

            {/* Beautiful intricate baroque corners */}
            <span className="absolute top-4 left-4 text-gold-500 font-display text-lg pointer-events-none">⚜</span>
            <span className="absolute top-4 right-4 text-gold-500 font-display text-lg pointer-events-none">⚜</span>
            <span className="absolute bottom-4 left-4 text-gold-500 font-display text-lg pointer-events-none">⚜</span>
            <span className="absolute bottom-4 right-4 text-gold-500 font-display text-lg pointer-events-none">⚜</span>

            {/* Glowing spot highlight at the top */}
            <div className="absolute -top-20 left-1/4 right-1/4 h-40 bg-radial from-gold-200/40 via-transparent to-transparent pointer-events-none" />

            {/* --- FLOATING CONTROLS PANEL (Top of Card) --- */}
            <div className="relative py-2 px-6 flex justify-between items-center bg-[#1a0508]/5 border-b border-stone-200 z-30">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-sans text-[10px] font-semibold tracking-wider text-stone-600 uppercase">
                  Acceso Especial Permitido
                </span>
              </div>

              {/* Music Playback Button */}
              <button
                onClick={toggleMusic}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1a0508] hover:bg-[#4a111a] text-gold-100 font-sans text-[10px] font-medium tracking-wider border border-gold-400 shadow-sm transition-all cursor-pointer focus:outline-none"
                title={isPlaying ? "Silenciar música" : "Escuchar música"}
                id="music-toggle-btn"
              >
                {isPlaying ? (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-gold-300 animate-bounce" />
                    <span>MÚSICA: SONANDO</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-gold-400" />
                    <span>MÚSICA: SILENCIO</span>
                  </>
                )}
              </button>
            </div>

            {/* --- CARD CONTENT WRAPPER --- */}
            <div className="px-5 sm:px-12 py-10 flex flex-col items-center text-center relative z-25">
              
              {/* --- 1. HEADER SECTION --- */}
              <header className="mb-6 flex flex-col items-center">
                
                {/* Crown Icon */}
                <div className="text-gold-500 mb-3 animate-float">
                  <svg className="w-14 h-12 fill-gold-500 drop-shadow-md" viewBox="0 0 24 24">
                    <path d="M12,2L16,7L22,4L20,18H4L2,4L8,7L12,2M4,20H20V22H4V20Z" />
                  </svg>
                </div>

                {/* INAUGURACIÓN OFICIAL */}
                <h1 className="font-display text-stone-900 text-2xl sm:text-4xl font-extrabold tracking-[0.2em] leading-tight mb-2 uppercase drop-shadow-xs">
                  Inauguración
                </h1>
                
                {/* ♦ OFICIAL ♦ */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-gold-600 text-[10px]">✦</span>
                  <span className="font-display text-gold-600 text-xs sm:text-sm font-semibold tracking-[0.35em] uppercase">
                    OFICIAL
                  </span>
                  <span className="text-gold-600 text-[10px]">✦</span>
                </div>

                <p className="font-serif italic text-stone-500 text-lg mb-4">
                  DE LA
                </p>

                {/* MANSIÓN de Mili */}
                <div className="relative inline-block mb-3">
                  <h2 className="font-display text-3xl sm:text-5xl font-black tracking-widest text-[#1a0508] uppercase">
                    Mansión
                  </h2>
                  <h3 className="font-script text-5xl sm:text-7xl font-bold text-gold-500 drop-shadow-sm rotate-[-4deg] mt-[-5px] ml-16">
                    de Mili
                  </h3>
                  {/* Miniature Heart decoration under name */}
                  <div className="text-gold-500 text-[18px] mt-2">❤</div>
                </div>
              </header>

              {/* --- 2. THE CHOSEN QUOTE (Sub-headline frame) --- */}
              <section className="w-full max-w-sm my-6 relative" id="quote-frame">
                {/* SVG Decorative Luxury Frame */}
                <div className="absolute inset-x-0 -top-5 bottom-0 border border-gold-400 opacity-85 rounded-xl px-4 py-8 pointer-events-none flex flex-col justify-between items-center">
                  {/* Top center mini crown */}
                  <div className="bg-[#faf6eb] px-3 -mt-10 text-gold-500">
                    <span className="text-[16px]">👑</span>
                  </div>
                  {/* Bottom center heart */}
                  <div className="bg-[#faf6eb] px-3 -mb-11 text-gold-500">
                    <span className="text-[14px]">❤</span>
                  </div>
                </div>

                <div className="px-6 py-4 flex flex-col justify-center gap-2 relative z-10">
                  <p className="font-display text-stone-800 text-base sm:text-lg font-bold tracking-[0.25em] uppercase">
                    Un Sueño.
                  </p>
                  <p className="font-display text-stone-800 text-base sm:text-lg font-bold tracking-[0.25em] uppercase">
                    un Hogar.
                  </p>
                  <p className="font-display text-stone-850 text-base sm:text-lg font-bold tracking-[0.25em] uppercase">
                    una Reina.
                  </p>
                </div>
              </section>

              {/* --- 3. INVITATION BADGE & COMPASS SEAL (Asymmetrical floating right seal) --- */}
              <div className="w-full flex justify-end pr-5 md:pr-10 -my-6 mb-6 z-30">
                <motion.div 
                  whileHover={{ rotate: 4, scale: 1.05 }}
                  className="w-28 h-28 bg-gradient-to-br from-stone-900 via-stone-950 to-stone-900 rounded-full border-4 border-gold-300 shadow-xl flex flex-col items-center justify-center relative rotate-[-6deg] text-gold-100 overflow-hidden"
                  id="select-badge"
                >
                  {/* Glowing core */}
                  <div className="absolute inset-0.5 rounded-full border border-gold-400/30" />
                  <div className="absolute top-1 text-gold-500 text-[8px] tracking-widest">★★★★★</div>
                  
                  <span className="font-serif italic text-[11px] text-gold-300 tracking-wider mt-1">
                    Invitación
                  </span>
                  
                  <span className="font-script text-2xl text-gold-200 mt-[-2px] tracking-wide">
                    Selecta
                  </span>
                  
                  <Heart className="w-3.5 h-3.5 fill-gold-500 text-gold-500 mt-1 animate-pulse" />
                  
                  {/* Gold Ribbons under Badge */}
                  <div className="absolute -bottom-1 w-full bg-gold-400 text-stone-950 font-sans text-[7px] font-bold text-center py-0.5 tracking-[0.1em] scale-x-110 uppercase">
                    EXCLUSIVO
                  </div>
                </motion.div>
              </div>

              {/* --- 4. COUNTDOWN TIMER GRID --- */}
              <section className="w-full max-w-lg mb-8 bg-[#1a0508]/5 p-4 rounded-2xl border border-gold-300/40" id="countdown">
                <p className="font-display text-[10px] font-bold tracking-[0.25em] text-stone-500 uppercase mb-3">
                  Cuenta Atrás para el Gran Brindis
                </p>
                <div className="grid grid-cols-4 gap-3">
                  <div className="bg-white/70 border border-gold-300/20 rounded-xl py-2 shadow-xs">
                    <p className="font-display text-2xl font-black text-gold-600">{timeLeft.days}</p>
                    <p className="font-sans text-[9px] text-stone-400 font-bold uppercase tracking-wider">Días</p>
                  </div>
                  <div className="bg-white/70 border border-gold-300/20 rounded-xl py-2 shadow-xs">
                    <p className="font-display text-2xl font-black text-gold-600">{timeLeft.hours}</p>
                    <p className="font-sans text-[9px] text-stone-400 font-bold uppercase tracking-wider">Horas</p>
                  </div>
                  <div className="bg-white/70 border border-gold-300/20 rounded-xl py-2 shadow-xs">
                    <p className="font-display text-2xl font-black text-gold-600">{timeLeft.minutes}</p>
                    <p className="font-sans text-[9px] text-stone-400 font-bold uppercase tracking-wider">Mins</p>
                  </div>
                  <div className="bg-white/70 border border-gold-300/20 rounded-xl py-2 shadow-xs">
                    <p className="font-display text-2xl font-black text-gold-600">{timeLeft.seconds}</p>
                    <p className="font-sans text-[9px] text-stone-400 font-bold uppercase tracking-wider">Segs</p>
                  </div>
                </div>
              </section>

              {/* --- 5. THE DATE PLATINUM RIBBON & EVENT --- */}
              <section className="mb-10 w-full max-w-lg flex flex-col items-center">
                {/* Save the Date Gold Header */}
                <div className="bg-stone-900 border border-gold-300 text-gold-200 px-6 py-1.5 rounded-full text-[11px] font-sans font-bold tracking-[0.3em] uppercase shadow-md mb-4 transform -rotate-1">
                  SAVE THE DATE
                </div>

                {/* 11 / 07 / 2026 */}
                <div className="text-3xl sm:text-5xl font-display font-black tracking-[0.15em] text-[#1a0508] drop-shadow-xs my-2">
                  11 <span className="text-gold-500 font-normal">/</span> 07 <span className="text-gold-500 font-normal">/</span> 2026
                </div>

                {/* GRAN FIESTA DE INAUGURACIÓN */}
                <p className="font-serif italic text-gold-700 text-xl font-bold tracking-wider uppercase mt-1 mb-8">
                  Gran Fiesta de Inauguración
                </p>
              </section>

              {/* --- 6. ACTIVITIES / HIGHLIGHTS FOUR BOXES --- */}
              <section className="w-full max-w-xl mb-10 grid grid-cols-2 md:grid-cols-4 gap-4" id="highlights">
                
                {/* Brindis */}
                <div className="flex flex-col items-center p-4 bg-[#1a0508]/3 border border-stone-200 hover:border-gold-400 hover:bg-[#faf1db]/30 rounded-2xl transition-all shadow-6xl duration-300">
                  <div className="w-11 h-11 rounded-full bg-white border border-gold-300 flex items-center justify-center text-gold-600 mb-3 shadow-sm">
                    {/* SVG champagne flutes */}
                    <svg className="w-6 h-6 stroke-gold-600" fill="none" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11 21a2 2 0 1 1-4 0M17 21a2 2 0 1 1-4 0M19 12l.149-1.492a3 3 0 0 0-2.479-3.262l-1.637-.273a3 3 0 0 0-3.328 1.96L10.5 12M5 12l-.149-1.492a3 3 0 0 1 2.479-3.262l1.637-.273a3 3 0 0 1 3.328 1.96l1.206 3.067M5 12v3a5 5 0 0 0 10 0v-3" />
                    </svg>
                  </div>
                  <h4 className="font-display text-xs font-black tracking-wider text-stone-900 mb-1">
                    BRINDIS
                  </h4>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-stone-500 font-semibold leading-relaxed">
                    POR LOS SUEÑOS CUMPLIDOS
                  </p>
                </div>

                {/* Música */}
                <div className="flex flex-col items-center p-4 bg-[#1a0508]/3 border border-stone-200 hover:border-gold-400 hover:bg-[#faf1db]/30 rounded-2xl transition-all shadow-6xl duration-300">
                  <div className="w-11 h-11 rounded-full bg-white border border-gold-300 flex items-center justify-center text-gold-600 mb-3 shadow-sm">
                    <Music className="w-5 h-5" />
                  </div>
                  <h4 className="font-display text-xs font-black tracking-wider text-stone-900 mb-1">
                    MÚSICA
                  </h4>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-stone-500 font-semibold leading-relaxed">
                    Y BUEN ROLLO ASEGURADO
                  </p>
                </div>

                {/* Comida */}
                <div className="flex flex-col items-center p-4 bg-[#1a0508]/3 border border-stone-200 hover:border-gold-400 hover:bg-[#faf1db]/30 rounded-2xl transition-all shadow-6xl duration-300">
                  <div className="w-11 h-11 rounded-full bg-white border border-gold-300 flex items-center justify-center text-gold-600 mb-3 shadow-sm">
                    {/* Cloche/Platter cover */}
                    <svg className="w-5 h-5 fill-none stroke-gold-600" viewBox="0 0 24 24" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 19h18M6 19a6 6 0 0 1 12 0" />
                      <circle cx="12" cy="11" r="1" />
                      <path d="M12 10V8" />
                    </svg>
                  </div>
                  <h4 className="font-display text-xs font-black tracking-wider text-stone-900 mb-1">
                    COMIDA, COPAS
                  </h4>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-stone-500 font-semibold leading-relaxed">
                    Y MUCHAS SORPRESAS
                  </p>
                </div>

                {/* Amigos */}
                <div className="flex flex-col items-center p-4 bg-[#1a0508]/3 border border-stone-200 hover:border-gold-400 hover:bg-[#faf1db]/30 rounded-2xl transition-all shadow-6xl duration-300">
                  <div className="w-11 h-11 rounded-full bg-white border border-gold-300 flex items-center justify-center text-gold-600 mb-3 shadow-sm">
                    <Heart className="w-5 h-5 text-gold-600 fill-gold-600/10" />
                  </div>
                  <h4 className="font-display text-xs font-black tracking-wider text-stone-900 mb-1">
                    AMIGOS, RISAS
                  </h4>
                  <p className="font-sans text-[9px] uppercase tracking-wider text-stone-500 font-semibold leading-relaxed">
                    Y RECUERDOS INOLVIDABLES
                  </p>
                </div>

              </section>

              {/* --- 7. DIRECTION PLATINUM ADDRESS PLAQUE --- */}
              <section className="w-full max-w-lg mb-8" id="address-section">
                <button 
                  onClick={() => setShowMap(!showMap)}
                  className="w-full group bg-white hover:bg-gold-50 border-2 border-dashed border-gold-400/90 py-3.5 px-6 rounded-2xl shadow-6xl flex justify-between items-center transition-all cursor-pointer focus:outline-none"
                >
                  <div className="flex items-center gap-3.5 text-left">
                    <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center text-gold-600 group-hover:scale-110 transition-transform">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-sans text-[9px] font-bold tracking-widest text-[#1a0508]/60 uppercase">
                        DIRECCIÓN ANFITRIONA
                      </p>
                      <p className="font-display text-sm sm:text-base font-extrabold text-[#1a0508] tracking-wide uppercase">
                        La Mansión de Mili ❤
                      </p>
                    </div>
                  </div>
                  <div className="text-gold-500 group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </button>

                {/* Map Simulation Panel with beautiful visual instructions */}
                <AnimatePresence>
                  {showMap && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 text-left overflow-hidden w-full bg-[#1a0508] rounded-2xl text-gold-100 border border-gold-400 p-5 shadow-inner"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-display text-xs font-extrabold tracking-widest text-gold-300 uppercase">
                          📍 CÓMO LLEGAR & DETALLES
                        </h4>
                        <span className="font-sans text-[9px] text-stone-400">
                          Confirmación requerida
                        </span>
                      </div>
                      
                      {/* Virtual map canvas placeholder */}
                      <div className="w-full h-36 rounded-xl bg-stone-900 border border-gold-500/30 overflow-hidden relative mb-4">
                        {/* Styled dark-gold map visualization using inline graphics */}
                        <div className="absolute inset-0 opacity-40 mix-blend-color-dodge pointer-events-none" style={{
                          backgroundImage: `radial-gradient(ellipse at 50% 50%, #4a111a 30%, transparent 80%), 
                                            linear-gradient(20deg, transparent 40%, #c68a32 41%, #c68a32 43%, transparent 44%),
                                            linear-gradient(110deg, transparent 65%, #c68a32 66%, #c68a32 68%, transparent 69%)`
                        }} />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                          <motion.div 
                            animate={{ y: [0, -8, 0] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                            className="bg-gold-500 text-stone-950 p-1.5 rounded-full border border-gold-100 shadow-md relative group-hover:scale-110"
                          >
                            <MapPin className="w-5 h-5 text-[#1a0508] fill-stone-950" />
                          </motion.div>
                          <span className="mt-1.5 px-3 py-1 rounded bg-stone-900/95 text-[9px] border border-gold-400 font-display font-bold text-gold-200 whitespace-nowrap uppercase tracking-widest">
                            LA MANSION DE MILI
                          </span>
                        </div>
                        {/* Decorative compass rose */}
                        <div className="absolute bottom-2 right-2 text-gold-500 text-[18px] opacity-45">🧭</div>
                        <div className="absolute top-2 left-2 text-gold-400/60 font-mono text-[8px]">GPS: 40.4168° N, 3.7038° W</div>
                      </div>

                      <p className="font-sans text-xs text-stone-300 leading-relaxed mb-1">
                        La ubicación definitiva ha sido enviada también en tu entrada digital interactiva. La mansión dispone de parking de cortesía para los invitados selectos.
                      </p>
                      <p className="font-serif italic text-xs text-gold-300">
                        * Ubicación exacta autorizada solo para asistentes registrados con código selecto.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </section>

              {/* --- 8. CENTRAL CALL-TO-ACTIONS --- */}
              <section className="w-full max-w-lg mb-12 flex flex-col sm:flex-row gap-4 justify-center" id="action-buttons">
                {/* RSVP Golden CTA */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    setShowRSVP(true);
                    setRsvpSubmitted(false);
                  }}
                  className="flex-1 cursor-pointer bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 text-gold-200 hover:text-white uppercase font-display font-extrabold text-xs tracking-[0.2em] py-4 px-6 rounded-full border border-gold-300 shadow-lg gold-box-shadow flex items-center justify-center gap-2 relative overflow-hidden transition-all duration-300 focus:outline-none"
                  id="rsvp-trigger-btn"
                >
                  <span className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent animate-shimmer" />
                  <Sparkles className="w-4 h-4 text-gold-300 animate-pulse" />
                  Confirmar Asistencia
                </motion.button>

                {/* Gift List Option */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setShowGift(true)}
                  className="cursor-pointer bg-[#ba4051]/10 hover:bg-[#ba4051]/20 text-[#6a1a25] uppercase font-display font-extrabold text-xs tracking-[0.15em] py-4 px-6 rounded-full border border-[#6a1a25]/30 flex items-center justify-center gap-2 transition-all focus:outline-none"
                  id="gift-trigger-btn"
                >
                  <Gift className="w-4 h-4 text-[#ba4051]" />
                  Lista de Bodas / Regalo
                </motion.button>
              </section>

              {/* --- 9. THE GUESTBOOK BOARD (Mili's Friends Wall) --- */}
              <section className="w-full max-w-xl text-left bg-white/75 p-6 rounded-3xl border border-gold-300/30 shadow-6xl relative overflow-hidden" id="visitor-board">
                {/* Small gold corner motifs inside guestbook */}
                <div className="absolute top-2 left-2 text-[10px] text-gold-400 opacity-60">✦</div>
                <div className="absolute top-2 right-2 text-[10px] text-gold-400 opacity-60">✦</div>
                
                <div className="flex items-center gap-2 mb-4 justify-between border-b border-stone-200 pb-3">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold-500" />
                    <h4 className="font-display text-[11px] font-black tracking-widest text-[#1a0508] uppercase">
                      Panel de Felicitaciones
                    </h4>
                  </div>
                  <span className="bg-[#1a0508] text-gold-200 font-mono text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider">
                    {guests.length} Confirmados
                  </span>
                </div>

                <div className="space-y-4 max-h-56 overflow-y-auto pr-1">
                  {guests.map((g, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="p-3 bg-[#faf6eb] rounded-xl border-l-4 border-gold-400 shadow-3xs"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-display text-[11px] font-extrabold text-[#1a0508] flex items-center gap-1.5">
                          {g.name} 
                          {g.attending ? (
                            <span className="bg-emerald-100 text-emerald-800 text-[8px] px-1.5 py-0.2 rounded font-sans font-bold uppercase">Asistirá</span>
                          ) : (
                            <span className="bg-rose-100 text-rose-800 text-[8px] px-1.5 py-0.2 rounded font-sans font-bold uppercase">No podrá</span>
                          )}
                        </span>
                        <span className="font-mono text-[9px] text-stone-400">{g.date}</span>
                      </div>
                      <p className="font-serif italic text-stone-600 text-xs mt-1 leading-normal">
                        "{g.message}"
                      </p>
                    </motion.div>
                  ))}
                </div>
              </section>

              {/* Fallback Audio file status banner */}
              {audioError && (
                <div className="mt-8 px-4 py-2 bg-amber-50 rounded-xl border border-amber-300 text-stone-600 text-[10.5px] leading-relaxed max-w-sm font-sans flex items-start gap-1.5 text-left">
                  <span className="text-amber-500 font-bold">📢 Fallback:</span>
                  <span>
                    No se encontró "fiesta.mp3" para reproducir automáticamente. Puedes arrastrar el archivo de audio real al directorio del proyecto en cualquier momento, ¡el reproductor lujoso ya está configurado y sonará en bucle!
                  </span>
                </div>
              )}

              {/* Bottom footer credit lines (In keeping with literal, humbles elements - No tech telemetry slop) */}
              <footer className="mt-14 text-center">
                <div className="w-16 h-[1px] bg-gold-400 mx-auto mb-4" />
                <p className="font-serif italic text-gold-600 font-bold text-sm tracking-wide">
                  ¡Te esperamos con la mayor de las alegrías!
                </p>
                <p className="font-display text-[8.5px] uppercase tracking-[0.2em] text-stone-400 mt-2">
                  La Mansión de Mili • Evento Selecto 2026
                </p>
              </footer>

            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* --- GIFT MODAL OVERLAY --- */}
      <AnimatePresence>
        {showGift && (
          <div className="fixed inset-0 bg-[#1a0508]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#faf6eb] text-[#1a0508] w-full max-w-md rounded-3xl p-6 relative border-2 border-gold-300 shadow-2xl"
              id="gift-modal"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setShowGift(false)}
                  className="w-8 h-8 rounded-full bg-stone-900 border border-gold-400 text-gold-200 flex items-center justify-center font-bold font-sans text-xs hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  ✕
                </button>
              </div>

              <div className="text-center mb-5 mt-2">
                <Gift className="w-10 h-10 text-gold-500 mx-auto mb-2 animate-float" />
                <h3 className="font-display text-lg font-black tracking-widest uppercase">
                  Lista de Bodas & Detalles
                </h3>
                <div className="w-12 h-[1px] bg-gold-400 mx-auto my-2" />
                <p className="font-serif italic text-xs text-stone-500 px-5">
                  "Tu presencia es nuestro mejor regalo. Pero si deseas contribuir a nuestro nuevo hogar, te dejamos los detalles correspondientes."
                </p>
              </div>

              <div className="bg-white/80 border border-gold-300 rounded-2xl p-4 mb-4">
                <p className="font-sans text-[9px] font-bold tracking-widest text-[#1a0508]/60 uppercase mb-1">
                  NÚMERO DE CUENTA BANCARIA
                </p>
                <div className="flex items-center justify-between gap-2 p-2.5 bg-gold-50 border border-gold-200 rounded-xl font-mono text-xs text-stone-850">
                  <span className="font-semibold select-all">ES12 3456 7890 1234 5678 9012</span>
                  <button
                    onClick={copyBankDetails}
                    className="p-1.5 rounded-lg bg-stone-900 text-gold-100 hover:text-white transition-all cursor-pointer"
                    title="Copiar cuenta"
                  >
                    {copiedAccount ? "¡Coap!" : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {copiedAccount && (
                  <p className="text-[10px] text-emerald-600 font-sans font-bold mt-1 text-center animate-pulse">
                    ✓ ¡Número de cuenta copiado al portapapeles!
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-stone-150">
                  <p className="font-sans text-[9px] font-bold tracking-widest text-[#1a0508]/60 uppercase mb-1">
                    BIZUM DIRECTO PARA DESEOS
                  </p>
                  <p className="font-sans text-xs font-semibold text-stone-850">
                    Mili Directo: <span className="font-mono font-bold text-gold-600">+34 600 000 000</span> (Buen Rollo)
                  </p>
                </div>
              </div>

              <div className="text-center mt-4">
                <button
                  onClick={() => setShowGift(false)}
                  className="w-full bg-[#1a0508] text-gold-100 py-3 rounded-xl uppercase font-display text-xs tracking-wider border border-gold-400 hover:bg-[#4a111a] transition-all cursor-pointer focus:outline-none"
                >
                  Entendido, Muchas Gracias ❤️
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRMAR ASISTENCIA OVERLAY (RSVP Form Modal) --- */}
      <AnimatePresence>
        {showRSVP && (
          <div className="fixed inset-0 bg-[#1a0508]/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="bg-[#faf6eb] text-[#1a0508] w-full max-w-md rounded-3xl p-6 relative border-2 border-gold-300 shadow-2xl overflow-hidden"
              id="rsvp-modal"
            >
              {/* Close Button top-right */}
              <div className="absolute top-4 midnight-close-btn-r text-right absolute right-4">
                <button
                  onClick={() => setShowRSVP(false)}
                  className="w-8 h-8 rounded-full bg-stone-900 border border-gold-400 text-gold-200 flex items-center justify-center font-bold font-sans text-xs hover:text-white transition-all cursor-pointer focus:outline-none"
                >
                  ✕
                </button>
              </div>

              {!rsvpSubmitted ? (
                // Form View
                <form onSubmit={handleRSVPSubmit} className="space-y-4">
                  <div className="text-center mb-5 mt-2">
                    <CheckCircle className="w-10 h-10 text-gold-500 mx-auto mb-2 animate-bounce" />
                    <h3 className="font-display text-lg font-black tracking-widest uppercase">
                      Confirmar Asistencia
                    </h3>
                    <div className="w-12 h-[1px] bg-gold-400 mx-auto my-2" />
                    <p className="font-serif italic text-xs text-stone-500">
                      "Por favor, facilítanos tus datos para preparar una noche irrepetible."
                    </p>
                  </div>

                  {/* Name field */}
                  <div>
                    <label className="block font-display text-[9px] font-bold tracking-widest text-[#1a0508]/70 uppercase mb-1">
                      Nombre y Apellidos
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ej. Sofía de Borbón"
                      className="w-full bg-white border border-stone-200 outline-gold-400 font-sans text-sm rounded-xl px-4 py-3 text-stone-850"
                    />
                  </div>

                  {/* Attending toggle */}
                  <div>
                    <span className="block font-display text-[9px] font-bold tracking-widest text-[#1a0508]/70 uppercase mb-1.5">
                      ¿Asistirás al festejo?
                    </span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormAttending(true)}
                        className={`py-2.5 rounded-xl font-display text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer focus:outline-none ${
                          formAttending 
                          ? 'bg-[#1a0508] text-gold-200 border-gold-400 shadow-sm' 
                          : 'bg-white text-stone-500 border-stone-200 hover:bg-gold-50/50'
                        }`}
                      >
                        ¡Por Supuesto! 🥂
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormAttending(false)}
                        className={`py-2.5 rounded-xl font-display text-xs font-bold tracking-wider uppercase border transition-all cursor-pointer focus:outline-none ${
                          !formAttending 
                          ? 'bg-rose-950 text-rose-200 border-rose-500' 
                          : 'bg-white text-stone-500 border-stone-200 hover:bg-rose-50/50'
                        }`}
                      >
                        No Podré 💔
                      </button>
                    </div>
                  </div>

                  {/* Companion (+1) toggle (Only if attending) */}
                  {formAttending && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                    >
                      <label className="block font-display text-[9px] font-bold tracking-widest text-[#1a0508]/70 uppercase mb-1.5">
                        ¿Vienes con Acompañante? (+1)
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormCompanion(true)}
                          className={`py-2 rounded-xl border font-sans text-xs font-semibold focus:outline-none cursor-pointer ${
                            formCompanion 
                            ? 'bg-[#faf1db] text-gold-700 border-gold-400' 
                            : 'bg-white text-stone-500 border-stone-200'
                          }`}
                        >
                          Sí, Acompañado (+1)
                        </button>
                        <button
                          type="button"
                          onClick={() => setFormCompanion(false)}
                          className={`py-2 rounded-xl border font-sans text-xs font-semibold focus:outline-none cursor-pointer ${
                            !formCompanion 
                            ? 'bg-[#faf1db] text-gold-700 border-gold-400' 
                            : 'bg-white text-stone-500 border-stone-200'
                          }`}
                        >
                          Voy solo / sola
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* Diet restrictions */}
                  {formAttending && (
                    <div>
                      <label className="block font-display text-[9px] font-bold tracking-widest text-[#1a0508]/70 uppercase mb-1">
                        Alergias o Restricciones
                      </label>
                      <select
                        value={formDiet}
                        onChange={(e) => setFormDiet(e.target.value)}
                        className="w-full bg-white border border-stone-200 font-sans text-xs rounded-xl px-4 py-2.5 text-stone-850 focus:outline-none focus:border-gold-400"
                      >
                        <option value="Ninguna">Ninguna dietética especial</option>
                        <option value="Sin Gluten">Sin Gluten / Celíaco</option>
                        <option value="Vegano">Vegano / Vegetariano</option>
                        <option value="Sin Lactosa">Sin Lactosa</option>
                        <option value="Marisco">Alergias (Marisco, Nueces, etc.)</option>
                      </select>
                    </div>
                  )}

                  {/* Compliment / message */}
                  <div>
                    <label className="block font-display text-[9px] font-bold tracking-widest text-[#1a0508]/70 uppercase mb-1">
                      Un Deseo o Mensaje para Mili
                    </label>
                    <textarea
                      value={formMessage}
                      onChange={(e) => setFormMessage(e.target.value)}
                      placeholder="Ej. ¡Qué gran paso Mili! Te deseamos lo absoluto mejor..."
                      rows={2}
                      className="w-full bg-white border border-stone-200 outline-gold-400 font-sans text-xs rounded-xl px-4 py-2.5 text-stone-850"
                    />
                  </div>

                  {/* Submission Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-stone-900 to-stone-950 text-gold-200 py-3.5 rounded-xl uppercase font-display text-xs font-bold tracking-widest border border-gold-400 hover:text-white transition-all cursor-pointer focus:outline-none flex items-center justify-center gap-2"
                    >
                      <span>Firmar & Registrar Asistencia</span>
                    </button>
                  </div>
                </form>
              ) : (
                // Thank You & Digital Invitation Ticket view! (Absolute craftsmanship)
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-4 text-center space-y-5"
                >
                  <div className="text-emerald-500 text-5xl animate-bounce">✨🏆✨</div>
                  <h3 className="font-display text-lg font-black tracking-widest uppercase">
                    ¡Registro Confirmado!
                  </h3>
                  <div className="w-12 h-[1px] bg-gold-400 mx-auto" />
                  <p className="font-serif italic text-xs text-stone-500 px-4">
                    "Gracias <b>{registeredName}</b>, tus credenciales han sido agregadas y validadas con honores."
                  </p>

                  {/* Royal Digital Ticket Pass mockup */}
                  <div className="border-2 border-double border-gold-400 bg-stone-950 text-gold-200 p-5 rounded-2xl relative shadow-lg text-left overflow-hidden">
                    {/* Glowing gold border decor */}
                    <div className="absolute top-1 left-1 right-1 bottom-1 border border-gold-500/30 opacity-60 pointer-events-none rounded-xl" />
                    
                    {/* Intricate security background line watermark */}
                    <div className="absolute inset-0 opacity-10 pointer-events-none bg-radial from-gold-300 via-transparent to-transparent font-mono text-[6px]" style={{
                      backgroundImage: `repeating-linear-gradient(45deg, #eedaa2 0px, #eedaa2 1px, transparent 0px, transparent 50%)`
                    }} />

                    <div className="flex justify-between items-center mb-3">
                      <span className="font-display text-[9px] font-black tracking-[0.25em] text-gold-300">
                        PASE DE INVITADO SELECTO
                      </span>
                      <span className="text-gold-500">👑</span>
                    </div>

                    <div className="space-y-2 relative z-10 font-sans">
                      <div>
                        <p className="text-[8px] font-bold uppercase tracking-wider text-stone-400">NOMINADO A</p>
                        <p className="font-display text-sm font-extrabold text-white tracking-wide uppercase">{registeredName}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-wider text-stone-400">UBICACIÓN</p>
                          <p className="text-[10px] text-gold-100 uppercase font-semibold">LA MANSION DE MILI</p>
                        </div>
                        <div>
                          <p className="text-[8px] font-bold uppercase tracking-wider text-stone-400">FECHA</p>
                          <p className="text-[10px] text-gold-100 font-mono">11 / 07 / 2026</p>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gold-500/20 flex justify-between items-end">
                        <div>
                          <p className="text-[8px] text-stone-400 uppercase tracking-widest">TICKET ID</p>
                          <p className="font-mono text-[9px] text-gold-300 uppercase">ML-{Math.floor(Math.random() * 89999 + 10000)}</p>
                        </div>
                        
                        {/* QR Code graphic representation */}
                        <div className="w-12 h-12 bg-white p-1 rounded-sm border border-gold-300 flex items-center justify-center">
                          <svg className="w-full h-full text-stone-900" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3,3H9V9H3V3M5,5V7H7V5H5M15,3H21V9H15V3M17,5V7H19V5H17M3,15H9V21H3V15M5,17V19H7V17H5M15,15H17V17H15V15M17,17H19V19H17V17M19,15H21V17H19V15M15,19H17V21H15V19M19,19H21V21H19V19M10,3H12V5H10V3M10,7H12V9H10V7M12,10H14V12H12V10M10,12H12V14H10V12M3,11H5V13H3V11M7,11H9V13H7V11M11,15H13V17H11V15M11,19H13V21H11V19M14,14H16V16H14V14M12,20H14V22H12V20M20,10H22V12H20V10M17,11H19V13H17V11" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="font-sans text-[11px] text-stone-500 leading-relaxed max-w-xs mx-auto">
                    Tu invitación interactiva ha sido guardada. Puedes realizar una captura de pantalla de tu Pase para agilizar tu ingreso del día de la fiesta.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => setShowRSVP(false)}
                      className="w-full bg-[#1a0508] text-gold-100 py-3 rounded-xl uppercase font-display text-xs tracking-wider border border-gold-400 hover:bg-[#4a111a] transition-all cursor-pointer focus:outline-none"
                    >
                      Cerrar y Volver a la Invitación
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
