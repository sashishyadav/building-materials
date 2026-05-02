import { useState, useEffect } from "react";

const LogoSVG = ({ size = 40 }) => (
  <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg">
    <defs><linearGradient id="aLogoGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f97316"/><stop offset="100%" stopColor="#d97706"/></linearGradient><linearGradient id="aHelmGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbbf24"/><stop offset="100%" stopColor="#f59e0b"/></linearGradient></defs>
    <circle cx="50" cy="50" r="48" fill="#1f2937"/><circle cx="50" cy="50" r="42" fill="#374151"/>
    {[0,45,90,135,180,225,270,315].map((a,i)=><rect key={i} x="46" y="2" width="8" height="12" rx="2" fill="#1f2937" transform={`rotate(${a} 50 50)`}/>)}
    <circle cx="50" cy="50" r="36" fill="url(#aLogoGrad)"/>
    <ellipse cx="50" cy="38" rx="22" ry="14" fill="url(#aHelmGrad)"/><rect x="28" y="36" width="44" height="6" rx="3" fill="#d97706"/>
    <rect x="22" y="52" width="16" height="10" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5"/><rect x="40" y="52" width="20" height="10" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5"/><rect x="62" y="52" width="16" height="10" rx="1.5" fill="#9ca3af" stroke="#6b7280" strokeWidth="0.5"/>
    <rect x="28" y="64" width="20" height="10" rx="1.5" fill="#6b7280" stroke="#4b5563" strokeWidth="0.5"/><rect x="50" y="64" width="22" height="10" rx="1.5" fill="#6b7280" stroke="#4b5563" strokeWidth="0.5"/>
    <text x="50" y="83" textAnchor="middle" fill="white" fontSize="6.5" fontFamily="Arial,sans-serif" fontWeight="bold">CONSTRUCTION</text>
    <text x="50" y="91" textAnchor="middle" fill="#fbbf24" fontSize="5" fontFamily="Arial,sans-serif" fontWeight="bold">MATERIAL SUPPLIER</text>
  </svg>
);

async function apiFetch(url, token, options = {}) {
  const res = await fetch(url, {
    ...options,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...options.headers },
  });
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem("admin_token");
    window.location.href = "/admin-portal";
    throw new Error("Session expired");
  }
  return res;
}

const Badge = ({ text, color }) => {
  const c = { green: "bg-green-100 text-green-800", yellow: "bg-yellow-100 text-yellow-800", red: "bg-red-100 text-red-800", blue: "bg-blue-100 text-blue-800", gray: "bg-gray-100 text-gray-800" };
  return <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${c[color] || c.gray}`}>{text}</span>;
};

// ─── LOGIN ───
const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      localStorage.setItem("admin_token", data.token);
      onLogin(data.token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"><LogoSVG size={64} /></div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-gray-400 text-sm mt-1">Construction Material Local Marketplace</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-1">Sign In</h2>
          <p className="text-gray-400 text-sm mb-6">Enter your admin credentials to continue</p>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Username</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
              </span>
              <input type="text" value={username} onChange={(e) => { setUsername(e.target.value); setError(""); }} placeholder="Enter username" className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" autoFocus autoComplete="username" />
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </span>
              <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} placeholder="Enter password" className="w-full border border-gray-300 rounded-lg pl-10 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition" autoComplete="current-password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" /></svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                )}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-orange-600 text-white font-semibold py-2.5 rounded-lg hover:bg-orange-700 transition text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {loading ? (<><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>Signing in...</>) : "Sign In"}
          </button>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
            <span>Protected by rate limiting and encrypted authentication</span>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs mt-6">
          <a href="/" className="hover:text-white transition">Back to public site</a>
        </p>
      </div>
    </div>
  );
};

// ─── SIDEBAR NAV ───
const navItems = [
  { k: "dashboard", label: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" },
  { k: "onboarding", label: "Onboarding", icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" },
  { k: "gitti", label: "Gitti", icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" },
  { k: "morang", label: "Morang", icon: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" },
  { k: "lorries", label: "Lorries", icon: "M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" },
  { k: "mandis", label: "Mandis", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z" },
  { k: "price-history", label: "Price History", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
];

const SidebarIcon = ({ d }) => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={d} /></svg>
);

// ─── DASHBOARD ───
const DashboardPage = ({ token, onNavigate }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch("/api/admin/dashboard", token)
      .then((r) => r.json())
      .then((d) => { setStats(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [token]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBox message={error} />;

  const cards = [
    { label: "Gitti Listings", value: stats?.gitti || 0, color: "bg-blue-500", bg: "bg-blue-50", page: "gitti" },
    { label: "Morang Listings", value: stats?.morang || 0, color: "bg-amber-500", bg: "bg-amber-50", page: "morang" },
    { label: "Vehicles", value: stats?.vehicles || 0, color: "bg-emerald-500", bg: "bg-emerald-50", page: "lorries" },
    { label: "Mandis", value: stats?.mandis || 0, color: "bg-purple-500", bg: "bg-purple-50", page: "mandis" },
    { label: "Pending Requests", value: stats?.pending || 0, color: "bg-red-500", bg: "bg-red-50", page: "onboarding" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">Overview of your marketplace</p>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} onClick={() => onNavigate(c.page)} className={`${c.bg} rounded-xl p-5 border border-gray-100 cursor-pointer hover:shadow-md hover:scale-[1.02] transition-all`}>
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${c.color}`} />
              <span className="text-xs text-gray-500 font-medium">{c.label}</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{c.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── ONBOARDING ───
const OnboardingPage = ({ token }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(null);

  const fetchRequests = () => {
    setLoading(true);
    apiFetch("/api/admin/onboarding", token)
      .then((r) => r.json())
      .then((d) => { setRequests(d); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchRequests(); }, [token]);

  const handleAction = async (id, action) => {
    setActionLoading(id);
    try {
      const res = await apiFetch(`/api/admin/onboarding/${id}/${action}`, token, { method: "PUT" });
      if (!res.ok) throw new Error("Action failed");
      fetchRequests();
    } catch (e) {
      setError(e.message);
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Onboarding Requests</h1>
          <p className="text-gray-500 text-sm">Review and approve supplier registrations</p>
        </div>
        <button onClick={fetchRequests} className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">Refresh</button>
      </div>
      {requests.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="text-gray-300 text-4xl mb-3">inbox</div>
          <p className="text-gray-400">No onboarding requests yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <div key={r.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-sm transition">
              <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-800 text-lg">{r.owner_name || "N/A"}</span>
                    {r.parivahan_verified && <Badge text="Verified" color="green" />}
                  </div>
                  <p className="text-gray-500 text-sm">{r.product_type} - {r.product_variant} | {r.registration_number}</p>
                </div>
                <Badge text={r.status} color={r.status === "pending" ? "yellow" : r.status === "approved" ? "green" : "red"} />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                <div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Driver Phone</div><div className="font-medium text-gray-700">{r.driver_phone}</div></div>
                <div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Owner Phone</div><div className="font-medium text-gray-700">{r.owner_phone || "-"}</div></div>
                <div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Mandi</div><div className="font-medium text-gray-700">{r.mandi}</div></div>
                <div className="bg-gray-50 rounded-lg p-2.5"><div className="text-gray-400 text-xs">Weight</div><div className="font-medium text-gray-700">{r.gross_weight_tonnes || "-"}T</div></div>
              </div>
              {r.status === "pending" && (
                <div className="flex gap-3">
                  <button onClick={() => handleAction(r.id, "approve")} disabled={actionLoading === r.id} className="text-sm bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50 font-medium">Approve</button>
                  <button onClick={() => handleAction(r.id, "reject")} disabled={actionLoading === r.id} className="text-sm bg-red-50 text-red-600 px-5 py-2 rounded-lg hover:bg-red-100 transition disabled:opacity-50 font-medium border border-red-200">Reject</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── DATA TABLES ───
const DataTablePage = ({ title, subtitle, token, endpoint, columns }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiFetch(endpoint, token)
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  }, [token, endpoint]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-1">{title}</h1>
      <p className="text-gray-500 text-sm mb-6">{subtitle}</p>
      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><p className="text-gray-400">No data available</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  {columns.map((c) => <th key={c.key} className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">{c.label}</th>)}
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <tr key={row.id || i} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    {columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-gray-700">
                        {c.render ? c.render(row[c.key], row) : row[c.key] ?? "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const availBadge = (v) => v === "available" ? <Badge text="Available" color="green" /> : <Badge text="In Transit" color="yellow" />;
const regBadge = (v) => <span className="bg-yellow-50 border border-yellow-200 px-2 py-0.5 rounded font-mono font-bold text-yellow-800 text-xs">{v}</span>;

const GittiPage = ({ token }) => (
  <DataTablePage title="Gitti Listings" subtitle="All crushed stone listings" token={token} endpoint="/api/gitti" columns={[
    { key: "size", label: "Size" },
    { key: "crusher_name", label: "Crusher" },
    { key: "crusher_location", label: "Location" },
    { key: "price_per_cft", label: "Price/CFT", render: (v) => <span className="font-semibold text-orange-600">{v}</span> },
    { key: "registration_number", label: "Vehicle", render: (v) => v ? regBadge(v) : "-" },
    { key: "availability", label: "Status", render: (v) => availBadge(v) },
  ]} />
);

const MorangPage = ({ token }) => (
  <DataTablePage title="Morang Listings" subtitle="All sand listings" token={token} endpoint="/api/morang" columns={[
    { key: "type", label: "Type", render: (v) => v ? v.charAt(0).toUpperCase() + v.slice(1) : "-" },
    { key: "use_case", label: "Use Case" },
    { key: "source_location", label: "Source" },
    { key: "price_per_tonne", label: "Price/T", render: (v) => <span className="font-semibold text-orange-600">{v}</span> },
    { key: "registration_number", label: "Vehicle", render: (v) => v ? regBadge(v) : "-" },
    { key: "availability", label: "Status", render: (v) => availBadge(v) },
  ]} />
);

const LorriesPage = ({ token }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const fetchData = () => {
    setLoading(true);
    apiFetch("/api/vehicles", token)
      .then((r) => r.json())
      .then((d) => { setData(Array.isArray(d) ? d : []); setLoading(false); })
      .catch((e) => { setError(e.message); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, [token]);
  useEffect(() => {
    if (openMenu === null) return;
    const close = () => setOpenMenu(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, [openMenu]);

  const handleRemove = async (id, reg) => {
    setOpenMenu(null);
    if (!window.confirm(`Remove vehicle ${reg} and all its listings?`)) return;
    try {
      const res = await apiFetch(`/api/vehicles/${id}`, token, { method: "DELETE" });
      if (res.ok) fetchData();
      else { const d = await res.json(); alert(d.error || "Failed to remove"); }
    } catch { alert("Network error"); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorBox message={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Lorries</h1>
          <p className="text-gray-500 text-sm">All registered vehicles</p>
        </div>
        <button onClick={fetchData} className="text-sm bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition">Refresh</button>
      </div>
      {data.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center"><p className="text-gray-400">No vehicles found</p></div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Reg No.</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Type</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Driver</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Owner</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Weight</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wider">Status</th>
                  <th className="w-10"></th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">{regBadge(row.registration_number)}</td>
                    <td className="px-4 py-3 text-gray-700">{row.vehicle_type ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{row.driver_name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{row.owner_name ?? "-"}</td>
                    <td className="px-4 py-3 text-gray-700">{row.gross_weight_tonnes}T</td>
                    <td className="px-4 py-3">{availBadge(row.availability)}</td>
                    <td className="px-4 py-3 relative">
                      <button onClick={(e) => { e.stopPropagation(); setOpenMenu(openMenu === row.id ? null : row.id); }} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><circle cx="10" cy="4" r="1.5" /><circle cx="10" cy="10" r="1.5" /><circle cx="10" cy="16" r="1.5" /></svg>
                      </button>
                      {openMenu === row.id && (
                        <div className="absolute right-4 top-12 z-20 bg-white rounded-lg shadow-lg border border-gray-200 py-1 w-40" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleRemove(row.id, row.registration_number)} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            Remove
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const MandisPage = ({ token }) => (
  <DataTablePage title="Mandis" subtitle="All marketplace locations" token={token} endpoint="/api/mandis" columns={[
    { key: "name", label: "Name" },
    { key: "district", label: "District" },
    { key: "slug", label: "Slug" },
    { key: "vehicle_count", label: "Vehicles", render: (v) => v ?? "-" },
  ]} />
);

const PriceHistoryPage = ({ token }) => (
  <DataTablePage title="Price History" subtitle="Audit log of all price changes" token={token} endpoint="/api/admin/price-history" columns={[
    { key: "listing_type", label: "Type" },
    { key: "old_price", label: "Old Price", render: (v) => <span className="text-gray-500">{v}</span> },
    { key: "new_price", label: "New Price", render: (v) => <span className="font-semibold text-orange-600">{v}</span> },
    { key: "changed_by_name", label: "Changed By" },
    { key: "changed_by_phone", label: "Phone" },
    { key: "created_at", label: "Date", render: (v) => v ? new Date(v).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }) : "-" },
  ]} />
);

// ─── SHARED UI ───
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-20">
    <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
  </div>
);

const ErrorBox = ({ message }) => (
  <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
    <div className="text-red-400 text-3xl mb-2">!</div>
    <p className="text-red-700 font-medium">{message}</p>
    <p className="text-red-400 text-sm mt-1">Make sure the backend server is running</p>
  </div>
);

// ─── MAIN PORTAL ───
export default function AdminPortal() {
  const [token, setToken] = useState(() => localStorage.getItem("admin_token"));
  const [page, setPage] = useState("dashboard");
  const [verifying, setVerifying] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!token) { setVerifying(false); return; }
    apiFetch("/api/admin/verify", token)
      .then((r) => { if (!r.ok) { localStorage.removeItem("admin_token"); setToken(null); } setVerifying(false); })
      .catch(() => { localStorage.removeItem("admin_token"); setToken(null); setVerifying(false); });
  }, []);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      </div>
    );
  }

  if (!token) return <AdminLogin onLogin={setToken} />;

  const logout = () => { localStorage.removeItem("admin_token"); setToken(null); };

  const renderPage = () => {
    switch (page) {
      case "onboarding": return <OnboardingPage token={token} />;
      case "gitti": return <GittiPage token={token} />;
      case "morang": return <MorangPage token={token} />;
      case "lorries": return <LorriesPage token={token} />;
      case "mandis": return <MandisPage token={token} />;
      case "price-history": return <PriceHistoryPage token={token} />;
      default: return <DashboardPage token={token} onNavigate={setPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 transform transition-transform lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-800">
          <LogoSVG size={36} />
          <div>
            <div className="text-white font-bold text-sm leading-tight">Admin Portal</div>
            <div className="text-gray-500 text-xs">building-materials.in</div>
          </div>
        </div>
        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <button key={item.k} onClick={() => { setPage(item.k); setSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${page === item.k ? "bg-orange-600 text-white" : "text-gray-400 hover:bg-gray-800 hover:text-white"}`}>
              <SidebarIcon d={item.icon} />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-gray-800">
          <a href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:bg-gray-800 hover:text-white transition mb-1">
            <SidebarIcon d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            Back to Site
          </a>
          <button onClick={logout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition">
            <SidebarIcon d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-3 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="font-semibold text-gray-800 capitalize">{page.replace("-", " ")}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400 hidden sm:block">Logged in as admin</span>
            <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">A</div>
          </div>
        </header>
        <main className="flex-1 p-4 lg:p-6">{renderPage()}</main>
      </div>
    </div>
  );
}
