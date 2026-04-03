import { useState, useEffect, useRef } from "react";

const TRUCK_IMG = "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 260"><defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fde68a"/><stop offset="100%" stop-color="#f3f4f6"/></linearGradient></defs><rect width="400" height="260" fill="url(#sky)" rx="12"/><rect x="40" y="65" width="320" height="140" rx="10" fill="#fff" stroke="#e5e7eb" stroke-width="2"/><rect x="55" y="75" width="290" height="65" rx="6" fill="#dbeafe"/><rect x="70" y="82" width="260" height="50" rx="3" fill="#93c5fd" opacity="0.4"/><rect x="130" y="92" width="140" height="30" rx="3" fill="#bfdbfe" opacity="0.5"/><rect x="55" y="148" width="130" height="22" rx="11" fill="#fbbf24"/><rect x="215" y="148" width="130" height="22" rx="11" fill="#fbbf24"/><circle cx="110" cy="205" r="24" fill="#1f2937"/><circle cx="110" cy="205" r="14" fill="#4b5563"/><circle cx="110" cy="205" r="6" fill="#9ca3af"/><circle cx="290" cy="205" r="24" fill="#1f2937"/><circle cx="290" cy="205" r="14" fill="#4b5563"/><circle cx="290" cy="205" r="6" fill="#9ca3af"/><rect x="40" y="78" width="22" height="55" rx="5" fill="#3b82f6"/><rect x="338" y="78" width="22" height="55" rx="5" fill="#3b82f6"/><text x="200" y="40" text-anchor="middle" fill="#374151" font-size="15" font-family="sans-serif" font-weight="bold">TATA SIGNA</text><text x="200" y="57" text-anchor="middle" fill="#6b7280" font-size="10" font-family="sans-serif">Construction Material Supplier</text><rect x="140" y="178" width="120" height="20" rx="4" fill="#fbbf24" stroke="#d97706" stroke-width="1"/><text x="200" y="192" text-anchor="middle" fill="#1f2937" font-size="9" font-family="monospace" font-weight="bold">IND</text></svg>`);

const LogoSVG = ({ size = 40 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="logoGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#d97706"/></linearGradient><linearGradient id="helmGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
    <circle cx="50" cy="50" r="48" fill="#1f2937"/><circle cx="50" cy="50" r="42" fill="#374151"/>
    {[0,45,90,135,180,225,270,315].map((a,i)=><rect key={i} x="46" y="2" width="8" height="12" rx="2" fill="#1f2937" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="36" fill="url(#logoGrad)"/>
    <ellipse cx="50" cy="38" rx="22" ry="14" fill="url(#helmGrad)"/><rect x="28" y="36" width="44" height="6" rx="3" fill="#d97706"/>
    <rect x="22" y="52" width="16" height="10" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5"/><rect x="40" y="52" width="20" height="10" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5"/><rect x="62" y="52" width="16" height="10" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5"/>
    <rect x="28" y="64" width="20" height="10" rx="1.5" fill="#6b7280" stroke="#4b5563" strokeWidth="0.5"/><rect x="50" y="64" width="22" height="10" rx="1.5" fill="#6b7280" stroke="#4b5563" strokeWidth="0.5"/>
    <line x1="18" y1="75" x2="30" y2="55" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round"/><polygon points="16,78 20,72 14,72" fill="#9ca3af"/>
    <line x1="72" y1="48" x2="82" y2="28" stroke="#4b5563" strokeWidth="1.5"/><line x1="76" y1="48" x2="86" y2="28" stroke="#4b5563" strokeWidth="1.5"/><line x1="80" y1="48" x2="90" y2="28" stroke="#4b5563" strokeWidth="1.5"/>
    <text x="50" y="83" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="Arial,sans-serif" fontWeight="bold">CONSTRUCTION</text>
    <text x="50" y="91" textAnchor="middle" fill="#fbbf24" fontSize="5" fontFamily="Arial,sans-serif" fontWeight="bold">MATERIAL SUPPLIER</text>
  </svg>
);

const MANDIS = [
  { id: 1, name: "Akbarpur", district: "Ambedkar Nagar", slug: "akbarpur" },
  { id: 2, name: "Tanda", district: "Ambedkar Nagar", slug: "tanda" },
  { id: 3, name: "Iltifatganj", district: "Ambedkar Nagar", slug: "iltifatganj" },
  { id: 4, name: "Baskhari", district: "Ambedkar Nagar", slug: "baskhari" },
  { id: 5, name: "Gosaiganj", district: "Ambedkar Nagar", slug: "gosaiganj" },
];

const GITTI_SIZES = ["6mm (Jeera)", "12mm (Half-Inch)", "18mm", "20mm"];

const initGitti = () => [
  { id: 1, size: "6mm (Jeera)", crusher_name: "Pragati Crusher", crusher_location: "Kabrai", price_per_cft: 45, district: "Ambedkar Nagar", lorry_registration: "BR28GB8126", gross_weight_tonnes: 42, driver_phone: "8687882832", owner_phone: "8687882832", availability: "available" },
  { id: 2, size: "12mm (Half-Inch)", crusher_name: "Murli Crusher", crusher_location: "Jhansi", price_per_cft: 48, district: "Ambedkar Nagar", lorry_registration: "UP45AT9694", gross_weight_tonnes: 40, driver_phone: "9876543212", owner_phone: "9876543213", availability: "available" },
  { id: 3, size: "18mm", crusher_name: "Maa Durga Crusher", crusher_location: "Kabrai", price_per_cft: 52, district: "Ambedkar Nagar", lorry_registration: "UP45AT7064", gross_weight_tonnes: 40, driver_phone: "9569045102", owner_phone: "9876543215", availability: "in_transit" },
  { id: 4, size: "20mm", crusher_name: "Pragati Crusher", crusher_location: "Jhansi", price_per_cft: 55, district: "Ambedkar Nagar", lorry_registration: "BR28GB8126", gross_weight_tonnes: 42, driver_phone: "8687882832", owner_phone: "8687882832", availability: "available" },
];

const initMorang = () => [
  { id: 1, type: "mota", use_case: "Foundation filling", source_location: "Dehri, Bihar", price_per_tonne: 1100, district: "Ambedkar Nagar", lorry_registration: "BR28GB8126", gross_weight_tonnes: 42, driver_phone: "8687882832", owner_phone: "8687882832", availability: "available" },
  { id: 2, type: "medium", use_case: "Plastering", source_location: "Patna, Bihar", price_per_tonne: 1250, district: "Ambedkar Nagar", lorry_registration: "UP45AT9694", gross_weight_tonnes: 40, driver_phone: "9876543212", owner_phone: "9876543213", availability: "available" },
  { id: 3, type: "fine", use_case: "Brick laying", source_location: "Banda, UP", price_per_tonne: 1400, district: "Ambedkar Nagar", lorry_registration: "UP45AT7064", gross_weight_tonnes: 40, driver_phone: "9569045102", owner_phone: "9876543215", availability: "in_transit" },
];

const initLorries = () => [
  { id: 1, registration_number: "BR28GB8126", gross_weight_tonnes: 42, driver_name: "Rajan", driver_phone: "8687882832", owner_name: "Rajan", owner_phone: "8687882832", mandi: "Akbarpur", availability: "available", vehicle_type: "Tata Signa", supplier_phone: "8687882832" },
  { id: 2, registration_number: "UP45AT9694", gross_weight_tonnes: 40, driver_name: "Mukesh", driver_phone: "9876543212", owner_name: "Ram Kumar", owner_phone: "9876543213", mandi: "Tanda", availability: "available", vehicle_type: "Tata Signa", supplier_phone: "9876543212" },
  { id: 3, registration_number: "UP45AT7064", gross_weight_tonnes: 40, driver_name: "Abhishek", driver_phone: "9569045102", owner_name: "Raj Bhadur", owner_phone: "9876543215", mandi: "Iltifatganj", availability: "in_transit", vehicle_type: "Tata Signa", supplier_phone: "9569045102" },
];

const PARIVAHAN_DB = {
  "BR28GB8126": { owner: "Rajan", vehicle_type: "Tata Signa 4923.S", fuel: "Diesel", reg_date: "2022-03-15", rto: "BR28 - Sasaram", status: "Active", fitness_upto: "2027-03-14" },
  "UP45AT9694": { owner: "Ram Kumar", vehicle_type: "Tata Signa 4923.S", fuel: "Diesel", reg_date: "2021-08-22", rto: "UP45 - Faizabad", status: "Active", fitness_upto: "2026-08-21" },
  "UP45AT7064": { owner: "Raj Bhadur", vehicle_type: "Tata Signa 4923.S", fuel: "Diesel", reg_date: "2023-01-10", rto: "UP45 - Faizabad", status: "Active", fitness_upto: "2028-01-09" },
  "UP42TC0135": { owner: "Prayag Udyog Pvt Ltd", vehicle_type: "Tata Signa 4825.TK", fuel: "Diesel", reg_date: "2024-02-20", rto: "UP42 - Ambedkar Nagar", status: "Active", fitness_upto: "2029-02-19" },
};

const Badge = ({ text, color }) => {
  const c = { green: "bg-green-100 text-green-800", yellow: "bg-yellow-100 text-yellow-800", red: "bg-red-100 text-red-800", blue: "bg-blue-100 text-blue-800", gray: "bg-gray-100 text-gray-800" };
  return <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c[color] || c.gray}`}>{text}</span>;
};
const availBadge = (a) => a === "available" ? <Badge text="Available" color="green" /> : <Badge text="In Transit" color="yellow" />;

const Counter = ({ target, duration = 2000 }) => {
  const [val, setVal] = useState(0); const ref = useRef(null); const [started, setStarted] = useState(false);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  useEffect(() => { if (!started) return; let s = 0; const step = Math.ceil(target / (duration / 16)); const id = setInterval(() => { s += step; if (s >= target) { setVal(target); clearInterval(id); } else setVal(s); }, 16); return () => clearInterval(id); }, [started, target, duration]);
  return <span ref={ref}>{val}</span>;
};

const Typewriter = ({ texts, speed = 80, pause = 2000 }) => {
  const [idx, setIdx] = useState(0); const [ci, setCi] = useState(0); const [del, setDel] = useState(false);
  useEffect(() => { const t = texts[idx]; if (!del && ci === t.length) { const tm = setTimeout(() => setDel(true), pause); return () => clearTimeout(tm); } if (del && ci === 0) { setDel(false); setIdx((idx + 1) % texts.length); return; } const tm = setTimeout(() => setCi(c => del ? c - 1 : c + 1), del ? speed / 2 : speed); return () => clearTimeout(tm); }, [ci, del, idx, texts, speed, pause]);
  return <span>{texts[idx].slice(0, ci)}<span className="animate-pulse">|</span></span>;
};

const Particles = () => {
  const ps = Array.from({ length: 15 }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, s: 3 + Math.random() * 5, d: 4 + Math.random() * 6, dl: Math.random() * 4, o: 0.15 + Math.random() * 0.2 }));
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{ps.map(p => <div key={p.id} className="absolute rounded-full bg-white" style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s, opacity: p.o, animation: `fl ${p.d}s ease-in-out ${p.dl}s infinite alternate` }} />)}<style>{`@keyframes fl{0%{transform:translateY(0) scale(1)}100%{transform:translateY(-25px) scale(1.15)}}`}</style></div>;
};

const AnimCard = ({ children, delay = 0 }) => {
  const [v, setV] = useState(false); const ref = useRef(null);
  useEffect(() => { const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.1 }); if (ref.current) obs.observe(ref.current); return () => obs.disconnect(); }, []);
  return <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? "translateY(0)" : "translateY(25px)", transition: `all 0.5s ease ${delay}s` }}>{children}</div>;
};

const VehicleImage = ({ reg, tonnes }) => (
  <div className="relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200" style={{ minHeight: 170 }}>
    <img src={TRUCK_IMG} alt={`Tata Signa - ${reg}`} className="w-full h-44 object-cover" />
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-3">
      <div className="flex items-center justify-between">
        <div><div className="text-white font-bold text-sm">Tata Signa • {tonnes}T</div><div className="text-gray-300 text-xs">Construction Material Supplier</div></div>
        <div className="bg-yellow-400 text-gray-900 font-bold px-3 py-1 rounded-lg text-xs tracking-wider font-mono">{reg}</div>
      </div>
    </div>
  </div>
);

// ─── OTP LOGIN (180 sec, visible OTP) ───
const LoginModal = ({ type, onClose, onLogin }) => {
  const [phone, setPhone] = useState(""); const [otp, setOtp] = useState(""); const [step, setStep] = useState("phone"); const [genOtp, setGenOtp] = useState(""); const [error, setError] = useState(""); const [timer, setTimer] = useState(0);
  useEffect(() => { if (timer > 0) { const t = setTimeout(() => setTimer(timer - 1), 1000); return () => clearTimeout(t); } }, [timer]);
  const fmtTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
  const sendOtp = () => { if (phone.length !== 10) { setError("Enter valid 10-digit number"); return; } const code = String(Math.floor(1000 + Math.random() * 9000)); setGenOtp(code); setStep("otp"); setError(""); setTimer(180); };
  const verifyOtp = () => { if (otp === genOtp) { onLogin({ phone, type }); onClose(); } else setError("Invalid OTP. Please check and try again."); };
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3"><LogoSVG size={36} /><h3 className="text-lg font-bold text-gray-800">{type === "supplier" ? "Supplier Login" : "Customer Login"}</h3></div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
        </div>
        {step === "phone" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden mb-1"><span className="bg-gray-50 px-3 py-2.5 text-sm text-gray-500 border-r">+91</span><input type="tel" value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setError(""); }} placeholder="Enter 10-digit number" className="flex-1 px-3 py-2.5 text-sm outline-none" autoFocus /></div>
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <button onClick={sendOtp} disabled={phone.length !== 10} className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-700 transition text-sm mt-3 disabled:opacity-40 disabled:cursor-not-allowed">Send OTP</button>
            <p className="text-gray-400 text-xs text-center mt-3">We'll send a 4-digit verification code</p>
          </div>
        ) : (
          <div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p className="text-blue-800 text-sm font-medium">OTP sent to +91 {phone}</p>
              <p className="text-blue-600 text-xs mt-1">Your OTP is: <span className="font-mono font-bold text-lg text-blue-800 tracking-widest">{genOtp}</span></p>
              <p className="text-blue-400 text-xs mt-1">(In production, this will be sent via SMS)</p>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Enter OTP</label>
            <input type="text" value={otp} onChange={e => { setOtp(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }} placeholder="Enter 4-digit OTP" className="w-full border border-gray-300 rounded-lg px-3 py-3 text-sm text-center tracking-widest font-mono text-xl mb-2" maxLength={4} autoFocus />
            {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
            <button onClick={verifyOtp} disabled={otp.length !== 4} className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-700 transition text-sm disabled:opacity-40 disabled:cursor-not-allowed">Verify & Login</button>
            <div className="text-center mt-3">{timer > 0 ? <span className="text-gray-400 text-xs">Resend in <span className="font-mono font-medium text-gray-600">{fmtTime(timer)}</span></span> : <button onClick={sendOtp} className="text-orange-600 text-xs font-medium hover:underline">Resend OTP</button>}</div>
            <button onClick={() => { setStep("phone"); setOtp(""); setError(""); setGenOtp(""); }} className="w-full text-gray-400 text-xs mt-2 hover:text-gray-600">← Change phone number</button>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── SUPPLIER DASHBOARD ───
const SupplierDashboard = ({ user, gitti, morang, lorries, setGitti, setMorang, setLorries, logout }) => {
  const myL = lorries.filter(l => l.supplier_phone === user.phone || l.driver_phone === user.phone || l.owner_phone === user.phone);
  const myG = gitti.filter(g => myL.some(l => l.registration_number === g.lorry_registration));
  const myM = morang.filter(m => myL.some(l => l.registration_number === m.lorry_registration));
  const [eItem, setEItem] = useState(null); const [eType, setEType] = useState(""); const [ePrice, setEPrice] = useState(""); const [eTonnes, setETonnes] = useState("");
  const [rateChanges, setRateChanges] = useState({});
  const getRateChangesLast24h = (key) => { const now = Date.now(); return (rateChanges[key] || []).filter(t => now - t < 86400000); };
  const save = () => {
    if (eType !== "lorry") {
      const key = `${eType}-${eItem.id}`;
      const recent = getRateChangesLast24h(key);
      if (recent.length >= 3) { alert("Rate can only be changed 3 times in 24 hours for this listing."); return; }
      setRateChanges(p => ({ ...p, [key]: [...(p[key] || []).filter(t => Date.now() - t < 86400000), Date.now()] }));
    }
    if (eType === "gitti") setGitti(p => p.map(g => g.id === eItem.id ? { ...g, price_per_cft: Number(ePrice), gross_weight_tonnes: Number(eTonnes) } : g));
    else if (eType === "morang") setMorang(p => p.map(m => m.id === eItem.id ? { ...m, price_per_tonne: Number(ePrice), gross_weight_tonnes: Number(eTonnes) } : m));
    else setLorries(p => p.map(l => l.id === eItem.id ? { ...l, gross_weight_tonnes: Number(eTonnes) } : l));
    setEItem(null);
  };
  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3"><div><h2 className="text-2xl font-bold text-gray-800">Supplier Dashboard</h2><p className="text-gray-500 text-sm">+91 {user.phone}</p></div><button onClick={logout} className="text-sm bg-red-50 text-red-600 px-4 py-2 rounded-lg hover:bg-red-100">Logout</button></div>
      {eItem && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEItem(null)}><div className="bg-white rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}><h3 className="text-lg font-bold text-gray-800 mb-4">Edit {eType.charAt(0).toUpperCase() + eType.slice(1)}</h3>{eType !== "lorry" && <div className="mb-3"><label className="block text-sm font-medium text-gray-700 mb-1">{eType === "gitti" ? "Price (₹/CFT)" : "Price (₹/Tonne)"}</label><input type="number" value={ePrice} onChange={e => setEPrice(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div>}<div className="mb-4"><label className="block text-sm font-medium text-gray-700 mb-1">Tonnes</label><input type="number" value={eTonnes} onChange={e => setETonnes(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" /></div><div className="flex gap-3"><button onClick={save} className="flex-1 bg-green-600 text-white py-2 rounded-lg text-sm font-medium">Save</button><button onClick={() => setEItem(null)} className="flex-1 border border-gray-300 py-2 rounded-lg text-sm text-gray-600">Cancel</button></div></div></div>}
      <h3 className="font-semibold text-gray-800 mb-3">My Vehicles ({myL.length})</h3>
      <div className="grid gap-3 mb-6">{myL.map(l => <div key={l.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center flex-wrap gap-2"><div className="flex items-center gap-3"><div className="text-2xl">🚛</div><div><div className="font-mono font-bold text-gray-800">{l.registration_number}</div><div className="text-gray-400 text-xs">{l.vehicle_type} • {l.gross_weight_tonnes}T • {l.mandi}</div></div></div><div className="flex items-center gap-2">{availBadge(l.availability)}<button onClick={() => { setEItem(l); setEType("lorry"); setETonnes(String(l.gross_weight_tonnes)); }} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">Edit</button></div></div>)}{myL.length === 0 && <div className="text-gray-400 text-sm bg-gray-50 rounded-xl p-6 text-center">No vehicles linked to your phone</div>}</div>
      <h3 className="font-semibold text-gray-800 mb-3">My Gitti ({myG.length})</h3>
      <div className="grid gap-3 mb-6">{myG.map(g => <div key={g.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center flex-wrap gap-2"><div><div className="font-medium text-gray-800">Gitti {g.size}</div><div className="text-gray-400 text-xs">{g.crusher_name} • {g.lorry_registration} • {g.gross_weight_tonnes}T</div></div><div className="flex items-center gap-3"><div className="text-orange-600 font-bold">₹{g.price_per_cft}/CFT</div><button onClick={() => { setEItem(g); setEType("gitti"); setEPrice(String(g.price_per_cft)); setETonnes(String(g.gross_weight_tonnes)); }} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">Edit</button></div></div>)}</div>
      <h3 className="font-semibold text-gray-800 mb-3">My Morang ({myM.length})</h3>
      <div className="grid gap-3">{myM.map(m => <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center flex-wrap gap-2"><div><div className="font-medium text-gray-800">Morang — {m.type.charAt(0).toUpperCase() + m.type.slice(1)}</div><div className="text-gray-400 text-xs">{m.source_location} • {m.lorry_registration} • {m.gross_weight_tonnes}T</div></div><div className="flex items-center gap-3"><div className="text-orange-600 font-bold">₹{m.price_per_tonne}/T</div><button onClick={() => { setEItem(m); setEType("morang"); setEPrice(String(m.price_per_tonne)); setETonnes(String(m.gross_weight_tonnes)); }} className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-100">Edit</button></div></div>)}</div>
    </div>
  );
};

// ─── PUBLIC PAGES ───
const HomePage = ({ setPage, setLoginModal }) => {
  const [searchQ, setSearchQ] = useState(""); const [hCat, setHCat] = useState(null);
  const cats = [
    { k: "gitti", icon: "⛏️", title: "Gitti (Crushed Stone)", desc: "6mm Jeera, 12mm Half-Inch, 18mm & 20mm", count: 4, color: "from-blue-500 to-indigo-600" },
    { k: "morang", icon: "🏖️", title: "Morang (Sand)", desc: "Mota, medium & fine from Bihar & UP", count: 3, color: "from-amber-500 to-orange-600" },
    { k: "lorry", icon: "🚛", title: "Lorry Services", desc: "40-42T Tata Signa lorries", count: 3, color: "from-emerald-500 to-teal-600" },
    { k: "mandis", icon: "🏪", title: "Mandis", desc: "5 mandis in Ambedkar Nagar", count: 5, color: "from-purple-500 to-pink-600" },
  ];
  return (
    <div>
      <div className="relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 text-white rounded-2xl p-8 mb-8 overflow-hidden" style={{ minHeight: 300 }}>
        <Particles />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4"><LogoSVG size={48} /><div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-1.5 text-sm font-medium">🏗️ Ambedkar Nagar's #1 Material Platform</div></div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 leading-tight">Construction Material<br />Local Marketplace</h1>
          <div className="text-xl text-orange-100 mb-2 h-8"><Typewriter texts={["Find Gitti at Best Prices", "Quality Morang from Bihar & UP", "40-42T Tata Signa Lorries", "Direct Contact — No Middlemen"]} /></div>
          <p className="text-orange-200 text-sm mb-5 max-w-lg">Compare prices, check availability, connect with suppliers instantly.</p>
          <div className="flex max-w-xl"><div className="flex-1 relative"><input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search materials, crushers, mandis..." className="w-full rounded-l-xl px-5 py-3 text-gray-800 text-sm outline-none" /></div><button onClick={() => { const q = searchQ.toLowerCase(); if (q.includes("gitti")) setPage("gitti"); else if (q.includes("morang") || q.includes("sand")) setPage("morang"); else if (q.includes("lorry")) setPage("lorry"); else setPage("gitti"); }} className="bg-gray-900 text-white px-6 py-3 rounded-r-xl text-sm font-semibold hover:bg-gray-800 transition">Search</button></div>
        </div>
        <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}`}</style>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <div onClick={() => setLoginModal("supplier")} className="bg-white border-2 border-orange-200 rounded-xl p-5 cursor-pointer hover:border-orange-400 hover:shadow-md transition group"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-orange-200 transition">🏭</div><div><div className="font-bold text-gray-800">Supplier Login</div><div className="text-gray-400 text-xs">Manage listings, update prices & tonnage</div></div></div></div>
        <div onClick={() => setLoginModal("customer")} className="bg-white border-2 border-blue-200 rounded-xl p-5 cursor-pointer hover:border-blue-400 hover:shadow-md transition group"><div className="flex items-center gap-4"><div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl group-hover:bg-blue-200 transition">🏠</div><div><div className="font-bold text-gray-800">Customer Login</div><div className="text-gray-400 text-xs">Track orders, get price alerts</div></div></div></div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8"><div className="flex items-center gap-8 text-sm flex-wrap"><span className="text-gray-400 font-medium">LIVE</span><span className="text-gray-700"><span className="font-bold text-orange-600"><Counter target={10} /></span> Listings</span><span className="text-gray-700"><span className="font-bold text-green-600"><Counter target={7} /></span> Available</span><span className="text-gray-700"><span className="font-bold text-blue-600"><Counter target={5} /></span> Mandis</span></div></div>
      <h2 className="text-2xl font-bold text-gray-800 mb-5">Browse Categories</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">{cats.map((c, i) => <AnimCard key={c.k} delay={i * 0.1}><div onClick={() => setPage(c.k)} onMouseEnter={() => setHCat(c.k)} onMouseLeave={() => setHCat(null)} className="cursor-pointer rounded-xl overflow-hidden transition-all duration-300" style={{ transform: hCat === c.k ? "translateY(-4px)" : "", boxShadow: hCat === c.k ? "0 16px 32px rgba(0,0,0,0.1)" : "0 1px 3px rgba(0,0,0,0.06)" }}><div className={`bg-gradient-to-br ${c.color} p-5 text-white`}><div className="text-3xl mb-2">{c.icon}</div><div className="font-bold text-lg">{c.title}</div><div className="text-white/80 text-xs mt-1">{c.desc}</div></div><div className="bg-white p-4 flex justify-between items-center"><div className="text-xl font-bold text-gray-800">{c.count}</div><div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 text-sm">→</div></div></div></AnimCard>)}</div>
      <AnimCard><h2 className="text-2xl font-bold text-gray-800 mb-5">Mandis in Ambedkar Nagar</h2><div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">{MANDIS.map(m => <div key={m.id} onClick={() => setPage("mandis")} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg hover:border-orange-300 transition cursor-pointer group"><div className="w-9 h-9 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 font-bold mb-2">{m.name.charAt(0)}</div><div className="font-semibold text-gray-800 text-sm">{m.name}</div><div className="text-gray-400 text-xs">{m.district}</div></div>)}</div></AnimCard>
      <AnimCard><div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-8 text-center text-white"><h2 className="text-2xl font-bold mb-2">Are You a Supplier?</h2><p className="text-orange-100 mb-5 text-sm">Register and list your materials on the marketplace</p><button onClick={() => setPage("onboarding")} className="bg-white text-orange-600 font-bold px-8 py-3 rounded-xl hover:bg-orange-50 transition text-sm">Register as Supplier →</button></div></AnimCard>
    </div>
  );
};

const GittiPage = ({ gitti }) => {
  const [fS, setFS] = useState("all"); const [fC, setFC] = useState("all");
  const f = gitti.filter(g => (fS === "all" || g.size === fS) && (fC === "all" || g.crusher_name === fC));
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Gitti (Crushed Stone)</h2><p className="text-gray-500 mb-4 text-sm">6mm Jeera, 12mm Half-Inch, 18mm & 20mm</p>
      <div className="flex flex-wrap gap-3 mb-5"><select value={fS} onChange={e => setFS(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="all">All Sizes</option>{GITTI_SIZES.map(s => <option key={s} value={s}>{s}</option>)}</select><select value={fC} onChange={e => setFC(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="all">All Crushers</option>{["Pragati Crusher", "Murli Crusher", "Maa Durga Crusher"].map(s => <option key={s} value={s}>{s}</option>)}</select></div>
      <div className="grid gap-4">{f.map(g => <div key={g.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"><div className="flex justify-between items-start flex-wrap gap-2"><div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-800 text-lg">Gitti {g.size}</span>{availBadge(g.availability)}</div><div className="text-gray-500 text-sm">{g.crusher_name} • {g.crusher_location}</div></div><div className="text-right"><div className="text-2xl font-bold text-orange-600">₹{g.price_per_cft}</div><div className="text-xs text-gray-400">per CFT</div></div></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600"><span className="bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded font-mono font-bold text-yellow-800 text-xs">{g.lorry_registration}</span><span>{g.gross_weight_tonnes}T</span></div><div className="mt-3 flex gap-3"><a href={`tel:${g.driver_phone}`} className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition">📞 Driver</a><a href={`tel:${g.owner_phone}`} className="text-sm border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">📞 Owner</a></div></div>)}</div>
    </div>
  );
};

const MorangPage = ({ morang }) => {
  const [fT, setFT] = useState("all"); const f = morang.filter(m => fT === "all" || m.type === fT);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Morang (Sand)</h2><p className="text-gray-500 mb-4 text-sm">From Dehri, Patna & Banda</p>
      <div className="mb-5"><select value={fT} onChange={e => setFT(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="all">All Types</option>{["mota", "medium", "fine"].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}</select></div>
      <div className="grid gap-4">{f.map(m => <div key={m.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition"><div className="flex justify-between items-start flex-wrap gap-2"><div><div className="flex items-center gap-2 mb-1"><span className="font-bold text-gray-800 text-lg">Morang — {m.type.charAt(0).toUpperCase() + m.type.slice(1)}</span>{availBadge(m.availability)}</div><div className="text-gray-500 text-sm">{m.use_case} • {m.source_location}</div></div><div className="text-right"><div className="text-2xl font-bold text-orange-600">₹{m.price_per_tonne}</div><div className="text-xs text-gray-400">per Tonne</div></div></div><div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gray-600"><span className="bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded font-mono font-bold text-yellow-800 text-xs">{m.lorry_registration}</span><span>{m.gross_weight_tonnes}T</span></div><div className="mt-3 flex gap-3"><a href={`tel:${m.driver_phone}`} className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg hover:bg-green-700 transition">📞 Driver</a><a href={`tel:${m.owner_phone}`} className="text-sm border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg hover:bg-gray-50 transition">📞 Owner</a></div></div>)}</div>
    </div>
  );
};

const LorryPage = ({ lorries }) => {
  const [fM, setFM] = useState("all"); const f = lorries.filter(l => fM === "all" || l.mandi === fM);
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Lorry Services</h2><p className="text-gray-500 mb-4 text-sm">Construction Material Local Marketplace</p>
      <div className="mb-5"><select value={fM} onChange={e => setFM(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="all">All Mandis</option>{MANDIS.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}</select></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">{f.map(l => <div key={l.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition"><VehicleImage reg={l.registration_number} tonnes={l.gross_weight_tonnes} /><div className="p-5"><div className="flex items-center gap-2 mb-3"><span className="bg-yellow-400 text-gray-900 font-bold px-3 py-0.5 rounded-lg text-sm font-mono">{l.registration_number}</span>{availBadge(l.availability)}</div><div className="grid grid-cols-2 gap-2 text-sm"><div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Driver</div><div className="font-medium text-gray-800">{l.driver_name}</div><div className="text-blue-600 text-xs">{l.driver_phone}</div></div><div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Owner</div><div className="font-medium text-gray-800">{l.owner_name}</div><div className="text-blue-600 text-xs">{l.owner_phone}</div></div><div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Mandi</div><div className="font-medium text-gray-800">{l.mandi}</div></div><div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Capacity</div><div className="font-medium text-gray-800">{l.gross_weight_tonnes}T</div></div></div><div className="mt-4 flex gap-3"><a href={`tel:${l.driver_phone}`} className="flex-1 text-center text-sm bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition font-medium">📞 Driver</a><a href={`tel:${l.owner_phone}`} className="flex-1 text-center text-sm border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition font-medium">📞 Owner</a></div></div></div>)}</div>
    </div>
  );
};

const MandisPage = ({ lorries, gitti, morang }) => {
  const [sel, setSel] = useState(null);
  const getV = (n) => lorries.filter(l => l.mandi === n);
  const getLoad = (reg) => ({ gitti: gitti.filter(x => x.lorry_registration === reg), morang: morang.filter(x => x.lorry_registration === reg) });
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Mandis</h2><p className="text-gray-500 mb-5 text-sm">Click a mandi to see vehicles & loads</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">{MANDIS.map(m => { const vc = getV(m.name).length; return <div key={m.id} onClick={() => setSel(sel === m.name ? null : m.name)} className={`bg-white border rounded-xl p-5 cursor-pointer transition hover:shadow-md ${sel === m.name ? "border-orange-400 shadow-md" : "border-gray-200"}`}><div className="flex justify-between items-center"><div><div className="text-lg font-bold text-gray-800">{m.name}</div><div className="text-gray-400 text-xs">{m.district}</div></div><div className="text-right"><div className="text-xl font-bold text-orange-600">{vc}</div><div className="text-xs text-gray-400">vehicles</div></div></div></div>; })}</div>
      {sel && <div className="bg-white border border-gray-200 rounded-xl p-5"><h3 className="font-bold text-gray-800 mb-4">Vehicles at {sel}</h3>{getV(sel).length === 0 ? <p className="text-gray-400 text-sm">No vehicles</p> : <div className="space-y-4">{getV(sel).map(v => { const ld = getLoad(v.registration_number); return <div key={v.id} className="border border-gray-100 rounded-xl p-4"><div className="flex items-center gap-3 mb-3"><span className="bg-yellow-400 text-gray-900 font-bold px-3 py-0.5 rounded-lg text-sm font-mono">{v.registration_number}</span>{availBadge(v.availability)}<span className="text-gray-500 text-xs">{v.vehicle_type} • {v.gross_weight_tonnes}T</span></div><div className="flex flex-wrap gap-x-6 text-sm text-gray-600 mb-3"><span>Driver: {v.driver_name}</span><span>Owner: {v.owner_name}</span></div>{ld.gitti.length > 0 && <div className="mb-2"><div className="text-xs font-medium text-blue-600 mb-1">⛏️ Gitti:</div>{ld.gitti.map(g => <div key={g.id} className="text-xs text-gray-600 bg-blue-50 rounded px-2 py-1 inline-block mr-2 mb-1">{g.size} — ₹{g.price_per_cft}/CFT</div>)}</div>}{ld.morang.length > 0 && <div><div className="text-xs font-medium text-amber-600 mb-1">🏖️ Morang:</div>{ld.morang.map(m => <div key={m.id} className="text-xs text-gray-600 bg-amber-50 rounded px-2 py-1 inline-block mr-2 mb-1">{m.type} — ₹{m.price_per_tonne}/T</div>)}</div>}{ld.gitti.length === 0 && ld.morang.length === 0 && <div className="text-xs text-gray-400">No load</div>}</div>; })}</div>}</div>}
    </div>
  );
};

const OnboardingField = ({ label, fieldKey, type = "text", req, disabled, form, upd }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}{req && <span className="text-red-500">*</span>}</label>
    <input type={type} value={form[fieldKey]} onChange={e => upd(fieldKey, e.target.value)} disabled={disabled} className={`w-full border border-gray-300 rounded-lg px-3 py-2 text-sm ${disabled ? "bg-gray-100" : ""}`} />
  </div>
);

const OnboardingPage = ({ addReq }) => {
  const [form, setForm] = useState({ owner_name: "", driver_name: "", driver_phone: "", owner_phone: "", registration_number: "", gross_weight_tonnes: "", product_type: "gitti", product_variant: "6mm (Jeera)", price: "", source_location: "", mandi: "Akbarpur", availability: "available" });
  const [submitted, setSubmitted] = useState(false); const [verifying, setVerifying] = useState(false); const [verified, setVerified] = useState(null); const [verifyError, setVerifyError] = useState("");
  const upd = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const verifyVehicle = () => { const reg = form.registration_number.replace(/\s/g, "").toUpperCase(); if (reg.length < 8) { setVerifyError("Enter valid registration number"); return; } setVerifying(true); setVerifyError(""); setVerified(null); setTimeout(() => { const d = PARIVAHAN_DB[reg]; if (d) { setVerified(d); upd("owner_name", d.owner); } else { setVerifyError("Vehicle not found in Parivahan database."); } setVerifying(false); }, 1500); };
  const submit = () => { if (!form.owner_name || !form.driver_phone || !form.registration_number) { alert("Fill required fields"); return; } const req = { ...form, registration_number: form.registration_number.replace(/\s/g, "").toUpperCase(), id: Date.now(), status: "pending", submitted_at: new Date().toLocaleDateString(), verified: !!verified, vehicle_type: verified?.vehicle_type || "Tata Signa" }; addReq(req); setSubmitted(true); };
  if (submitted) return <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center"><div className="text-4xl mb-3">✅</div><div className="text-green-700 text-xl font-bold mb-2">Registration Successful!</div><div className="text-green-600 text-sm">Vehicle added. Admin will review shortly.</div><button onClick={() => { setSubmitted(false); setForm({ owner_name: "", driver_name: "", driver_phone: "", owner_phone: "", registration_number: "", gross_weight_tonnes: "", product_type: "gitti", product_variant: "6mm (Jeera)", price: "", source_location: "", mandi: "Akbarpur", availability: "available" }); setVerified(null); }} className="mt-4 text-sm text-green-700 underline">Register another</button></div>;
  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-1">Supplier Registration</h2><p className="text-gray-500 mb-5 text-sm">Register your vehicle & list materials</p>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="mb-6 pb-6 border-b border-gray-100"><h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs">1</span>Verify Vehicle (Parivahan)</h3><div className="flex gap-3 items-end flex-wrap"><div className="flex-1 min-w-48"><label className="block text-sm font-medium text-gray-700 mb-1">Registration Number<span className="text-red-500">*</span></label><input type="text" value={form.registration_number} onChange={e => { upd("registration_number", e.target.value.toUpperCase()); setVerified(null); setVerifyError(""); }} placeholder="e.g. UP45AT9694" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm font-mono uppercase" /></div><button onClick={verifyVehicle} disabled={verifying} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 whitespace-nowrap">{verifying ? "Verifying..." : "🔍 Verify"}</button></div>{verifyError && <div className="mt-2 bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">{verifyError}</div>}{verified && <div className="mt-3 bg-green-50 border border-green-200 rounded-xl p-4"><div className="flex items-center gap-2 mb-2"><span className="text-green-600 text-lg">✅</span><span className="font-semibold text-green-800">Verified!</span></div><div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm"><div><span className="text-gray-500">Owner:</span> <span className="font-medium">{verified.owner}</span></div><div><span className="text-gray-500">Vehicle:</span> <span className="font-medium">{verified.vehicle_type}</span></div><div><span className="text-gray-500">RTO:</span> <span className="font-medium">{verified.rto}</span></div><div><span className="text-gray-500">Status:</span> <Badge text={verified.status} color="green" /></div><div><span className="text-gray-500">Fitness:</span> <span className="font-medium">{verified.fitness_upto}</span></div></div></div>}</div>
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2"><span className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-xs">2</span>Details</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"><OnboardingField label="Owner Name" fieldKey="owner_name" req disabled={!!verified} form={form} upd={upd} /><OnboardingField label="Driver Name" fieldKey="driver_name" form={form} upd={upd} /><OnboardingField label="Driver Phone" fieldKey="driver_phone" type="tel" req form={form} upd={upd} /><OnboardingField label="Owner Phone" fieldKey="owner_phone" type="tel" form={form} upd={upd} /><OnboardingField label="Gross Weight (Tonnes)" fieldKey="gross_weight_tonnes" type="number" form={form} upd={upd} /><div><label className="block text-sm font-medium text-gray-700 mb-1">Product Type</label><select value={form.product_type} onChange={e => upd("product_type", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"><option value="gitti">Gitti</option><option value="morang">Morang</option></select></div><div><label className="block text-sm font-medium text-gray-700 mb-1">Variant</label><select value={form.product_variant} onChange={e => upd("product_variant", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">{form.product_type === "gitti" ? GITTI_SIZES.map(s => <option key={s}>{s}</option>) : ["mota", "medium", "fine"].map(s => <option key={s}>{s}</option>)}</select></div><OnboardingField label="Price" fieldKey="price" type="number" form={form} upd={upd} /><OnboardingField label="Source Location" fieldKey="source_location" form={form} upd={upd} /><div><label className="block text-sm font-medium text-gray-700 mb-1">Mandi</label><select value={form.mandi} onChange={e => upd("mandi", e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white">{MANDIS.map(m => <option key={m.name}>{m.name}</option>)}</select></div></div>
        <button onClick={submit} className="mt-6 bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-lg hover:bg-orange-700 transition">Submit Registration</button>
      </div>
    </div>
  );
};

// ─── ADMIN ───
const AdminDash = ({ reqs, lorries, updateReq, removeLorry }) => (<div><h2 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h2><div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">{[{ n: "Gitti", v: 4, c: "bg-blue-50 text-blue-700" }, { n: "Morang", v: 3, c: "bg-green-50 text-green-700" }, { n: "Lorries", v: lorries.length, c: "bg-purple-50 text-purple-700" }, { n: "Pending", v: reqs.filter(r => r.status === "pending").length, c: "bg-red-50 text-red-700" }].map(s => <div key={s.n} className={`${s.c} rounded-xl p-4`}><div className="text-2xl font-bold">{s.v}</div><div className="text-xs mt-1">{s.n}</div></div>)}</div><div className="bg-white border border-gray-200 rounded-xl p-5 mb-5"><h3 className="font-semibold text-gray-800 mb-3">Fleet ({lorries.length})</h3><div className="grid gap-2">{lorries.map(l => <div key={l.id} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3"><div className="text-xl">🚛</div><div className="flex-1"><div className="font-mono font-bold text-gray-800 text-sm">{l.registration_number}</div><div className="text-gray-400 text-xs">{l.driver_name} • {l.gross_weight_tonnes}T • {l.mandi}</div></div><div className="flex items-center gap-2">{availBadge(l.availability)}<button onClick={() => { if (window.confirm(`Remove ${l.registration_number} from fleet?`)) removeLorry(l.id); }} className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-lg hover:bg-red-100 border border-red-200">Remove</button></div></div>)}</div></div><div className="bg-white border border-gray-200 rounded-xl p-5"><h3 className="font-semibold text-gray-800 mb-3">Requests</h3>{reqs.length === 0 ? <p className="text-gray-400 text-sm">None</p> : <div className="space-y-3">{reqs.map(r => <div key={r.id} className="flex justify-between items-center border-b border-gray-100 pb-3 flex-wrap gap-2"><div><span className="font-medium text-gray-700">{r.owner_name}</span><span className="text-gray-400 text-xs ml-2">{r.registration_number}</span>{r.verified && <span className="ml-1 text-green-500 text-xs">✅</span>}<div className="text-gray-400 text-xs mt-0.5">{r.product_type} • {r.mandi}</div></div><div className="flex items-center gap-2">{r.status === "pending" ? <><button onClick={() => updateReq(r.id, "approved", r)} className="text-xs bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700">Approve</button><button onClick={() => updateReq(r.id, "rejected", r)} className="text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600">Reject</button></> : <Badge text={r.status} color={r.status === "approved" ? "green" : "red"} />}</div></div>)}</div>}</div></div>);

const AdminOnb = ({ reqs, updateReq }) => (<div><h2 className="text-2xl font-bold text-gray-800 mb-4">Onboarding</h2>{reqs.length === 0 ? <div className="text-gray-400 text-center py-10">No requests</div> : <div className="space-y-4">{reqs.map(r => <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5"><div className="flex justify-between items-start flex-wrap gap-2 mb-3"><div><div className="font-bold text-gray-800">{r.owner_name} {r.verified && <span className="text-green-500 text-xs">✅ Verified</span>}</div><div className="text-gray-500 text-sm">{r.product_type} — {r.product_variant} • {r.registration_number}</div></div><Badge text={r.status} color={r.status === "pending" ? "yellow" : r.status === "approved" ? "green" : "red"} /></div><div className="flex flex-wrap gap-x-5 text-sm text-gray-600 mb-3"><span>Phone: {r.driver_phone}</span><span>Mandi: {r.mandi}</span></div>{r.status === "pending" && <div className="flex gap-3"><button onClick={() => updateReq(r.id, "approved", r)} className="text-sm bg-green-600 text-white px-4 py-1.5 rounded-lg">Approve</button><button onClick={() => updateReq(r.id, "rejected", r)} className="text-sm bg-red-600 text-white px-4 py-1.5 rounded-lg">Reject</button></div>}</div>)}</div>}</div>);

const AdminList = ({ title, data, cols }) => (<div><h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2><div className="bg-white border border-gray-200 rounded-xl overflow-x-auto"><table className="w-full text-sm"><thead><tr className="bg-gray-50 border-b border-gray-200">{cols.map(c => <th key={c.k} className="text-left px-4 py-3 font-medium text-gray-600">{c.label}</th>)}</tr></thead><tbody>{data.map((row, i) => <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">{cols.map(c => <td key={c.k} className="px-4 py-3 text-gray-700">{c.k === "availability" ? availBadge(row[c.k]) : (c.k === "registration_number" || c.k === "lorry_registration") ? <span className="bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded font-mono font-bold text-yellow-800 text-xs">{row[c.k]}</span> : row[c.k]}</td>)}</tr>)}</tbody></table></div></div>);

// ─── MAIN ───
export default function App() {
  const [view, setView] = useState("public"); const [page, setPage] = useState("home"); const [adminPage, setAdminPage] = useState("dashboard");
  const [reqs, setReqs] = useState([]); const [mobileMenu, setMobileMenu] = useState(false); const [loginModal, setLoginModal] = useState(null); const [user, setUser] = useState(null);
  const [gitti, setGitti] = useState(initGitti); const [morang, setMorang] = useState(initMorang); const [lorries, setLorries] = useState(initLorries);
  const addReq = (r) => setReqs(p => [r, ...p]);
  const removeLorry = (id) => setLorries(p => p.filter(l => l.id !== id));
  const updateReq = (id, st, reqObj) => {
    if (st === "approved" && reqObj) {
      const lid = Date.now();
      setLorries(p => [...p, { id: lid, registration_number: reqObj.registration_number, gross_weight_tonnes: Number(reqObj.gross_weight_tonnes) || 40, driver_name: reqObj.driver_name || "TBD", driver_phone: reqObj.driver_phone, owner_name: reqObj.owner_name, owner_phone: reqObj.owner_phone || reqObj.driver_phone, mandi: reqObj.mandi, availability: "available", vehicle_type: reqObj.vehicle_type || "Tata Signa", supplier_phone: reqObj.driver_phone }]);
      if (reqObj.product_type === "gitti" && reqObj.price) setGitti(p => [...p, { id: lid + 1, size: reqObj.product_variant, crusher_name: reqObj.owner_name, crusher_location: reqObj.source_location || "", price_per_cft: Number(reqObj.price), district: reqObj.mandi, lorry_registration: reqObj.registration_number, gross_weight_tonnes: Number(reqObj.gross_weight_tonnes) || 40, driver_phone: reqObj.driver_phone, owner_phone: reqObj.owner_phone || reqObj.driver_phone, availability: "available" }]);
      else if (reqObj.product_type === "morang" && reqObj.price) setMorang(p => [...p, { id: lid + 1, type: reqObj.product_variant, use_case: "", source_location: reqObj.source_location || "", price_per_tonne: Number(reqObj.price), district: reqObj.mandi, lorry_registration: reqObj.registration_number, gross_weight_tonnes: Number(reqObj.gross_weight_tonnes) || 40, driver_phone: reqObj.driver_phone, owner_phone: reqObj.owner_phone || reqObj.driver_phone, availability: "available" }]);
    }
    setReqs(p => p.map(r => r.id === id ? { ...r, status: st } : r));
  };
  const handleLogin = (u) => { setUser(u); if (u.type === "supplier") { setView("public"); setPage("supplier-dashboard"); } };
  const logout = () => { setUser(null); setPage("home"); };
  const navItems = view === "public" ? [{ k: "home", l: "Home" }, { k: "gitti", l: "Gitti" }, { k: "morang", l: "Morang" }, { k: "lorry", l: "Lorries" }, { k: "mandis", l: "Mandis" }, { k: "onboarding", l: "Become a Supplier" }, ...(user?.type === "supplier" ? [{ k: "supplier-dashboard", l: "My Dashboard" }] : [])] : [{ k: "dashboard", l: "Dashboard" }, { k: "a-gitti", l: "Gitti" }, { k: "a-morang", l: "Morang" }, { k: "a-lorry", l: "Lorries" }, { k: "a-mandis", l: "Mandis" }, { k: "a-onboarding", l: "Onboarding" }];
  const activePage = view === "public" ? page : adminPage; const setActivePage = view === "public" ? setPage : setAdminPage;
  const render = () => { if (view === "public") { switch (page) { case "gitti": return <GittiPage gitti={gitti} />; case "morang": return <MorangPage morang={morang} />; case "lorry": return <LorryPage lorries={lorries} />; case "mandis": return <MandisPage lorries={lorries} gitti={gitti} morang={morang} />; case "onboarding": return <OnboardingPage addReq={addReq} />; case "supplier-dashboard": return user?.type === "supplier" ? <SupplierDashboard user={user} gitti={gitti} morang={morang} lorries={lorries} setGitti={setGitti} setMorang={setMorang} setLorries={setLorries} logout={logout} /> : <HomePage setPage={setPage} setLoginModal={setLoginModal} />; default: return <HomePage setPage={setPage} setLoginModal={setLoginModal} />; } } else { switch (adminPage) { case "a-gitti": return <AdminList title="Gitti" data={gitti} cols={[{ k: "size", label: "Size" }, { k: "crusher_name", label: "Crusher" }, { k: "price_per_cft", label: "₹/CFT" }, { k: "lorry_registration", label: "Lorry" }, { k: "gross_weight_tonnes", label: "T" }, { k: "availability", label: "Status" }]} />; case "a-morang": return <AdminList title="Morang" data={morang} cols={[{ k: "type", label: "Type" }, { k: "source_location", label: "Source" }, { k: "price_per_tonne", label: "₹/T" }, { k: "lorry_registration", label: "Lorry" }, { k: "availability", label: "Status" }]} />; case "a-lorry": return <AdminList title="Lorries" data={lorries} cols={[{ k: "registration_number", label: "Reg" }, { k: "driver_name", label: "Driver" }, { k: "owner_name", label: "Owner" }, { k: "mandi", label: "Mandi" }, { k: "gross_weight_tonnes", label: "T" }, { k: "availability", label: "Status" }]} />; case "a-mandis": return <AdminList title="Mandis" data={MANDIS} cols={[{ k: "name", label: "Name" }, { k: "district", label: "District" }, { k: "slug", label: "Slug" }]} />; case "a-onboarding": return <AdminOnb reqs={reqs} updateReq={updateReq} />; default: return <AdminDash reqs={reqs} lorries={lorries} updateReq={updateReq} removeLorry={removeLorry} />; } } };
  return (
    <div className="min-h-screen bg-gray-50">
      {loginModal && <LoginModal type={loginModal} onClose={() => setLoginModal(null)} onLogin={handleLogin} />}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setView("public"); setPage("home"); }}><LogoSVG size={36} /><div><div className="font-bold text-gray-800 text-sm leading-tight">Construction Material</div><div className="text-xs text-gray-400">{view === "public" ? "Local Marketplace" : "Admin Panel"}</div></div></div>
          <div className="flex items-center gap-2">{user && <span className="text-xs text-green-600 hidden sm:block font-medium">● +91 {user.phone}</span>}{!user && <button onClick={() => setLoginModal("supplier")} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-green-50 text-green-700 hover:bg-green-100 hidden sm:block">Login</button>}{user && <button onClick={logout} className="text-xs px-3 py-1.5 rounded-lg font-medium bg-red-50 text-red-600 hover:bg-red-100 hidden sm:block">Logout</button>}<button onClick={() => { setView(view === "public" ? "admin" : "public"); setMobileMenu(false); }} className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${view === "admin" ? "bg-orange-600 text-white" : "bg-gray-100 text-gray-600"}`}>{view === "public" ? "Admin" : "Public"}</button><button onClick={() => setMobileMenu(!mobileMenu)} className="sm:hidden p-2 text-gray-600"><svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 5h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2zm0 4h14a1 1 0 010 2H3a1 1 0 010-2z" /></svg></button></div>
        </div>
        <nav className={`${mobileMenu ? "block" : "hidden"} sm:block border-t border-gray-100`}><div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap gap-1">{navItems.map(n => <button key={n.k} onClick={() => { setActivePage(n.k); setMobileMenu(false); }} className={`px-3 py-1.5 rounded-lg text-sm transition ${activePage === n.k ? "bg-orange-50 text-orange-700 font-medium" : "text-gray-600 hover:bg-gray-50"}`}>{n.l}</button>)}</div></nav>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-6">{render()}</main>
      <footer className="border-t border-gray-200 mt-12 py-6 text-center text-gray-400 text-xs"><div className="flex items-center justify-center gap-2 mb-1"><LogoSVG size={20} /><span className="font-medium text-gray-500">Construction Material Local Marketplace</span></div>© 2026 • materialmarket.in • Ambedkar Nagar, UP</footer>
    </div>
  );
}
