import { useState, useEffect, useRef } from "react";
import api from "./services/api";

const COLORS = {
  tecDarkGreen: "#004A2F",
  tecGreen: "#007A3D",
  tecLightGreen: "#3AB54A",
  tecBlue: "#003F8A",
  tecMidBlue: "#0066CC",
  tecLightBlue: "#4DA6FF",
  tecWhite: "#FFFFFF",
  tecGray: "#F5F7FA",
  tecDarkGray: "#2D3748",
  // Rainbow arc gradient
  rainbow: "linear-gradient(135deg, #007A3D 0%, #3AB54A 20%, #4DA6FF 50%, #0066CC 75%, #003F8A 100%)",
  rainbowText: "linear-gradient(90deg, #007A3D, #3AB54A, #4DA6FF, #0066CC)",
};

// ============================================================
// TOAST SYSTEM
// ============================================================
function useToasts() {
  const [toasts, setToasts] = useState([]);
  const addToast = (msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return { toasts, addToast };
}

function ToastContainer({ toasts }) {
  return (
    <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: t.type === "success" ? COLORS.tecGreen : t.type === "error" ? "#E53E3E" : COLORS.tecMidBlue,
          color: "#fff", padding: "12px 20px", borderRadius: 10, fontFamily: "'Exo 2', sans-serif",
          fontWeight: 600, fontSize: 14, boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
          animation: "slideIn 0.3s ease", minWidth: 220, display: "flex", alignItems: "center", gap: 10
        }}>
          <span>{t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}</span>
          {t.msg}
        </div>
      ))}
    </div>
  );
}

// ============================================================
// MODAL CONFIRM
// ============================================================
function ConfirmModal({ open, message, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9000, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "#fff", borderRadius: 16, padding: 36, maxWidth: 380, width: "90%", boxShadow: "0 24px 80px rgba(0,66,139,0.25)", fontFamily: "'Exo 2', sans-serif" }}>
        <div style={{ fontSize: 40, textAlign: "center", marginBottom: 12 }}>⚠️</div>
        <p style={{ textAlign: "center", fontSize: 16, color: COLORS.tecDarkGray, marginBottom: 28 }}>{message}</p>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: "10px 0", border: `2px solid ${COLORS.tecGreen}`, background: "transparent", color: COLORS.tecGreen, borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Cancelar</button>
          <button onClick={onConfirm} style={{ flex: 1, padding: "10px 0", background: COLORS.rainbow, border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontWeight: 700, fontSize: 14 }}>Confirmar</button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LOADING SPINNER
// ============================================================
function Spinner({ size = 32 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: 40 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        border: `3px solid ${COLORS.tecGray}`,
        borderTop: `3px solid ${COLORS.tecGreen}`,
        animation: "spin 0.8s linear infinite"
      }} />
    </div>
  );
}

// ============================================================
// EMPTY STATE
// ============================================================
function EmptyState({ icon, title, subtitle, action }) {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px", fontFamily: "'Exo 2', sans-serif" }}>
      <div style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }}>{icon}</div>
      <h3 style={{ color: COLORS.tecDarkGray, fontSize: 20, marginBottom: 8 }}>{title}</h3>
      <p style={{ color: "#888", fontSize: 14, marginBottom: 24 }}>{subtitle}</p>
      {action}
    </div>
  );
}

// ============================================================
// LOGO COMPONENTS (SVG-based from uploaded images)
// ============================================================
function ISCBadge({ size = 48 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="48" fill="#007A3D" />
      <circle cx="50" cy="50" r="36" fill="#3AB54A" />
      <circle cx="50" cy="50" r="26" fill="#004A2F" />
      <text x="50" y="55" textAnchor="middle" fill="#3AB54A" fontSize="22" fontFamily="monospace">{"{…}"}</text>
    </svg>
  );
}

// ============================================================
// SIDEBAR NAV
// ============================================================
const NAV_ITEMS = [
  { id: "dashboard", icon: "🏠", label: "Dashboard" },
  { id: "materias", icon: "📚", label: "Materias" },
  { id: "grupos", icon: "👥", label: "Grupos" },
  { id: "alumnos", icon: "🎓", label: "Alumnos" },
  { id: "equipos", icon: "⚙️", label: "Equipos" },
  { id: "exposiciones", icon: "🎤", label: "Exposiciones" },
  { id: "evaluaciones", icon: "📊", label: "Evaluaciones" },
];

function Sidebar({ active, setActive, collapsed, role }) {
  return (
    <aside style={{
      width: collapsed ? 70 : 240, minHeight: "100vh",
      background: `linear-gradient(180deg, ${COLORS.tecDarkGreen} 0%, ${COLORS.tecBlue} 100%)`,
      display: "flex", flexDirection: "column", transition: "width 0.3s ease",
      boxShadow: "4px 0 24px rgba(0,0,0,0.18)", position: "relative", zIndex: 100
    }}>
      {/* Brand */}
      <div style={{ padding: collapsed ? "20px 12px" : "20px 20px", display: "flex", alignItems: "center", gap: 12, borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
        <ISCBadge size={40} />
        {!collapsed && (
          <div>
            <div style={{ color: "#fff", fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>TecNM Celaya</div>
            <div style={{ color: COLORS.tecLightGreen, fontSize: 10, fontFamily: "'Exo 2', sans-serif" }}>Ing. Sistemas Comp.</div>
          </div>
        )}
      </div>
      {/* Role badge */}
      {!collapsed && (
        <div style={{ margin: "12px 16px", background: "rgba(58,181,74,0.2)", borderRadius: 8, padding: "6px 12px", color: COLORS.tecLightGreen, fontSize: 11, fontFamily: "'Exo 2', sans-serif", fontWeight: 700, textAlign: "center", border: "1px solid rgba(58,181,74,0.3)" }}>
          🔑 ROL: {role.toUpperCase()}
        </div>
      )}
      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 0" }}>
        {NAV_ITEMS.map(item => (
          <button key={item.id} onClick={() => setActive(item.id)} style={{
            display: "flex", alignItems: "center", gap: 14, width: "100%",
            padding: collapsed ? "14px 0" : "13px 20px", justifyContent: collapsed ? "center" : "flex-start",
            background: active === item.id
              ? "linear-gradient(90deg, rgba(58,181,74,0.35), rgba(77,166,255,0.2))"
              : "transparent",
            border: "none", borderLeft: active === item.id ? `3px solid ${COLORS.tecLightGreen}` : "3px solid transparent",
            color: active === item.id ? "#fff" : "rgba(255,255,255,0.65)",
            cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: active === item.id ? 700 : 500,
            fontSize: 14, transition: "all 0.2s", borderRadius: collapsed ? 0 : "0 8px 8px 0"
          }}>
            <span style={{ fontSize: 18 }}>{item.icon}</span>
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>
      {/* Footer */}
      {!collapsed && (
        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)", fontSize: 10, fontFamily: "'Exo 2', sans-serif" }}>
          v1.0 © 2025 TecNM Celaya
        </div>
      )}
    </aside>
  );
}

// ============================================================
// NAVBAR
// ============================================================
function Navbar({ page, collapsed, setCollapsed, user, onLogout }) {
  const label = NAV_ITEMS.find(n => n.id === page)?.label || page;
  return (
    <header style={{
      background: "#fff", borderBottom: `3px solid transparent`,
      backgroundImage: `linear-gradient(#fff,#fff), ${COLORS.rainbow}`,
      backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box",
      display: "flex", alignItems: "center", padding: "0 24px", height: 64,
      boxShadow: "0 2px 12px rgba(0,0,0,0.08)", gap: 16
    }}>
      <button onClick={() => setCollapsed(c => !c)} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: COLORS.tecGreen }}>
        {collapsed ? "▶" : "◀"}
      </button>
      <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 18, background: COLORS.rainbowText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
        {label}
      </div>
      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, color: COLORS.tecDarkGray }}>
          👤 {user.name}
        </div>
        <button onClick={onLogout} style={{ background: COLORS.tecDarkGreen, color: "#fff", border: "none", borderRadius: 8, padding: "7px 16px", cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 600, fontSize: 13 }}>
          Salir
        </button>
      </div>
    </header>
  );
}

// ============================================================
// STAT CARD
// ============================================================
function StatCard({ icon, label, value, gradient }) {
  return (
    <div style={{
      background: gradient || COLORS.rainbow, borderRadius: 16, padding: "24px 28px",
      color: "#fff", boxShadow: "0 8px 32px rgba(0,0,0,0.15)", position: "relative", overflow: "hidden"
    }}>
      <div style={{ fontSize: 36, marginBottom: 8, position: "relative", zIndex: 1 }}>{icon}</div>
      <div style={{ fontSize: 36, fontWeight: 800, fontFamily: "'Exo 2', sans-serif", position: "relative", zIndex: 1 }}>{value}</div>
      <div style={{ fontSize: 13, opacity: 0.85, fontFamily: "'Exo 2', sans-serif", position: "relative", zIndex: 1 }}>{label}</div>
      <div style={{ position: "absolute", right: -20, bottom: -20, fontSize: 100, opacity: 0.08 }}>{icon}</div>
    </div>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function Dashboard() {
  const [loading, setLoading] = useState(true);
  useEffect(() => { setTimeout(() => setLoading(false), 900); }, []);
  if (loading) return <Spinner />;
  return (
    <div>
      {/* Welcome banner */}
      <div style={{
        background: COLORS.rainbow, borderRadius: 20, padding: "28px 36px", marginBottom: 28, color: "#fff",
        display: "flex", alignItems: "center", gap: 24, boxShadow: "0 8px 40px rgba(0,74,47,0.25)"
      }}>
        <ISCBadge size={64} />
        <div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 900, fontSize: 22, marginBottom: 4 }}>
            Bienvenido al Sistema ISC
          </div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, opacity: 0.85 }}>
            Tecnológico Nacional de México en Celaya — Ingeniería en Sistemas Computacionales
          </div>
        </div>
      </div>
      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 20, marginBottom: 32 }}>
        <StatCard icon="📚" label="Materias activas" value="12" gradient={`linear-gradient(135deg, ${COLORS.tecGreen}, ${COLORS.tecLightGreen})`} />
        <StatCard icon="👥" label="Grupos" value="8" gradient={`linear-gradient(135deg, ${COLORS.tecBlue}, ${COLORS.tecMidBlue})`} />
        <StatCard icon="🎓" label="Alumnos" value="247" gradient={`linear-gradient(135deg, ${COLORS.tecMidBlue}, ${COLORS.tecLightBlue})`} />
        <StatCard icon="⚙️" label="Equipos" value="41" gradient={`linear-gradient(135deg, ${COLORS.tecDarkGreen}, ${COLORS.tecGreen})`} />
        <StatCard icon="🎤" label="Exposiciones" value="18" gradient={`linear-gradient(135deg, #3AB54A, #4DA6FF)`} />
        <StatCard icon="📊" label="Evaluaciones" value="156" gradient={COLORS.rainbow} />
      </div>
      {/* Quick activity */}
      <div style={{ background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 2px 16px rgba(0,0,0,0.06)" }}>
        <h3 style={{ fontFamily: "'Exo 2', sans-serif", color: COLORS.tecDarkGray, marginBottom: 16, fontWeight: 800 }}>Actividad Reciente</h3>
        {[
          { icon: "📝", text: "Rúbrica actualizada — Bases de Datos II", time: "hace 5 min", color: COLORS.tecGreen },
          { icon: "🎓", text: "Nuevo alumno registrado — Juan Pérez", time: "hace 23 min", color: COLORS.tecMidBlue },
          { icon: "⚙️", text: "Equipo 'Alpha' creado en ISC-501", time: "hace 1 hr", color: COLORS.tecLightGreen },
          { icon: "📊", text: "Evaluación cerrada — Redes de Computadoras", time: "hace 3 hr", color: COLORS.tecBlue },
        ].map((a, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 0", borderBottom: i < 3 ? "1px solid #f0f0f0" : "none" }}>
            <div style={{ width: 36, height: 36, background: `${a.color}22`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{a.icon}</div>
            <div style={{ flex: 1, fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: COLORS.tecDarkGray }}>{a.text}</div>
            <div style={{ fontSize: 12, color: "#aaa", fontFamily: "'Exo 2', sans-serif" }}>{a.time}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// GENERIC CRUD TABLE
// ============================================================
function CRUDTable({ title, icon, columns, initialData, renderForm, canDelete = true, role }) {
  const [data, setData] = useState(initialData);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toasts, addToast } = useToasts();
  const PAGE_SIZE = 5;

  useEffect(() => { setTimeout(() => setLoading(false), 600); }, []);

  const filtered = data.filter(row => columns.some(c => String(row[c.key] || "").toLowerCase().includes(search.toLowerCase())));
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSave = (record) => {
    setLoading(true);
    setTimeout(() => {
      if (record.id && data.find(d => d.id === record.id)) {
        setData(d => d.map(x => x.id === record.id ? record : x));
        addToast("Registro actualizado correctamente");
      } else {
        setData(d => [...d, { ...record, id: Date.now() }]);
        addToast("Registro creado correctamente");
      }
      setShowForm(false);
      setEditing(null);
      setLoading(false);
    }, 400);
  };

  const handleDelete = (id) => {
    setData(d => d.filter(x => x.id !== id));
    setConfirmDel(null);
    addToast("Registro eliminado", "error");
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <ToastContainer toasts={toasts} />
      <ConfirmModal open={!!confirmDel} message="¿Estás seguro de eliminar este registro?" onConfirm={() => handleDelete(confirmDel)} onCancel={() => setConfirmDel(null)} />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 28 }}>{icon}</span>
          <h2 style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 900, fontSize: 22, color: COLORS.tecDarkGray, margin: 0 }}>{title}</h2>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="🔍 Buscar..." style={{
            padding: "9px 16px", border: `2px solid #e2e8f0`, borderRadius: 10, fontFamily: "'Exo 2', sans-serif", fontSize: 14, outline: "none", width: 200,
            transition: "border 0.2s"
          }} onFocus={e => e.target.style.border = `2px solid ${COLORS.tecGreen}`} onBlur={e => e.target.style.border = "2px solid #e2e8f0"} />
          {(role === "admin" || role === "profesor") && (
            <button onClick={() => { setEditing(null); setShowForm(true); }} style={{
              background: COLORS.rainbow, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px",
              fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8
            }}>
              ➕ Agregar
            </button>
          )}
        </div>
      </div>

      {/* Form modal */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 8000, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 32, width: "90%", maxWidth: 480, boxShadow: "0 32px 80px rgba(0,0,0,0.25)" }}>
            <h3 style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 800, marginBottom: 20, color: COLORS.tecDarkGray }}>
              {editing ? "✏️ Editar" : "➕ Nuevo"} {title.slice(0, -1)}
            </h3>
            {renderForm({ initial: editing, onSave: handleSave, onCancel: () => { setShowForm(false); setEditing(null); } })}
          </div>
        </div>
      )}

      {/* Table */}
      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }}>
        {paged.length === 0 ? (
          <EmptyState icon="📭" title="Sin resultados" subtitle={search ? "Intenta con otra búsqueda" : "No hay registros aún"} action={
            role !== "alumno" && <button onClick={() => setShowForm(true)} style={{ background: COLORS.rainbow, color: "#fff", border: "none", borderRadius: 8, padding: "10px 20px", cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 700 }}>Agregar primero</button>
          } />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: `linear-gradient(90deg, ${COLORS.tecDarkGreen}, ${COLORS.tecBlue})` }}>
                {columns.map(c => (
                  <th key={c.key} style={{ padding: "14px 20px", textAlign: "left", color: "#fff", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 13 }}>{c.label}</th>
                ))}
                <th style={{ padding: "14px 20px", color: "#fff", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 13 }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((row, i) => (
                <tr key={row.id} style={{ background: i % 2 === 0 ? "#fff" : "#F5F7FA", transition: "background 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#EBF5FF"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? "#fff" : "#F5F7FA"}>
                  {columns.map(c => (
                    <td key={c.key} style={{ padding: "13px 20px", fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: COLORS.tecDarkGray, borderBottom: "1px solid #f0f0f0" }}>
                      {c.render ? c.render(row[c.key], row) : row[c.key]}
                    </td>
                  ))}
                  <td style={{ padding: "13px 20px", borderBottom: "1px solid #f0f0f0", whiteSpace: "nowrap" }}>
                    {(role === "admin" || role === "profesor") && (
                      <>
                        <button onClick={() => { setEditing(row); setShowForm(true); }} style={{ background: `${COLORS.tecMidBlue}22`, color: COLORS.tecMidBlue, border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 12, marginRight: 8 }}>✏️ Editar</button>
                        {canDelete && <button onClick={() => setConfirmDel(row.id)} style={{ background: "#FEE2E222", color: "#E53E3E", border: "none", borderRadius: 6, padding: "6px 12px", cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 12 }}>🗑️ Borrar</button>}
                      </>
                    )}
                    {role === "alumno" && <span style={{ color: "#aaa", fontSize: 12, fontFamily: "'Exo 2', sans-serif" }}>Solo lectura</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 20 }}>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "8px 14px", border: "2px solid #e2e8f0", borderRadius: 8, cursor: page === 1 ? "default" : "pointer", background: "transparent", fontFamily: "'Exo 2', sans-serif", opacity: page === 1 ? 0.4 : 1 }}>‹</button>
          {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => setPage(p)} style={{ padding: "8px 14px", border: "none", borderRadius: 8, cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, background: p === page ? COLORS.rainbow : "#f0f0f0", color: p === page ? "#fff" : COLORS.tecDarkGray }}>{p}</button>
          ))}
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ padding: "8px 14px", border: "2px solid #e2e8f0", borderRadius: 8, cursor: page === pages ? "default" : "pointer", background: "transparent", fontFamily: "'Exo 2', sans-serif", opacity: page === pages ? 0.4 : 1 }}>›</button>
        </div>
      )}
    </div>
  );
}

// ============================================================
// FORM FIELD HELPER
// ============================================================
function Field({ label, value, onChange, type = "text", required, options, error }) {
  const baseStyle = {
    width: "100%", padding: "10px 14px", border: `2px solid ${error ? "#E53E3E" : "#e2e8f0"}`,
    borderRadius: 8, fontFamily: "'Exo 2', sans-serif", fontSize: 14, outline: "none", boxSizing: "border-box",
    transition: "border 0.2s", marginTop: 4
  };
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 13, fontWeight: 700, color: COLORS.tecDarkGray }}>
        {label} {required && <span style={{ color: "#E53E3E" }}>*</span>}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={baseStyle}>
          <option value="">-- Seleccionar --</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} style={baseStyle}
          onFocus={e => e.target.style.border = `2px solid ${COLORS.tecGreen}`}
          onBlur={e => e.target.style.border = `2px solid ${error ? "#E53E3E" : "#e2e8f0"}`}
        />
      )}
      {error && <div style={{ color: "#E53E3E", fontSize: 11, marginTop: 4, fontFamily: "'Exo 2', sans-serif" }}>{error}</div>}
    </div>
  );
}

function FormButtons({ onSave, onCancel }) {
  return (
    <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
      <button onClick={onCancel} style={{ flex: 1, padding: "11px 0", border: `2px solid ${COLORS.tecGreen}`, background: "transparent", color: COLORS.tecGreen, borderRadius: 8, cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 700 }}>Cancelar</button>
      <button onClick={onSave} style={{ flex: 1, padding: "11px 0", background: COLORS.rainbow, border: "none", color: "#fff", borderRadius: 8, cursor: "pointer", fontFamily: "'Exo 2', sans-serif", fontWeight: 700 }}>Guardar</button>
    </div>
  );
}

// ============================================================
// PAGE: MATERIAS
// ============================================================
function MateriasForm({ initial, onSave, onCancel }) {
  const [nombre, setNombre] = useState(initial?.nombre || "");
  const [clave, setClave] = useState(initial?.clave || "");
  const [creditos, setCreditos] = useState(initial?.creditos || "");
  const [semestre, setSemestre] = useState(initial?.semestre || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "El nombre es requerido";
    if (!clave.trim()) e.clave = "La clave es requerida";
    if (!creditos) e.creditos = "Los créditos son requeridos";
    if (!semestre) e.semestre = "El semestre es requerido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => { if (validate()) onSave({ ...initial, nombre, clave, creditos: Number(creditos), semestre: Number(semestre) }); };

  return (
    <div>
      <Field label="Nombre de materia" value={nombre} onChange={setNombre} required error={errors.nombre} />
      <Field label="Clave" value={clave} onChange={setClave} required error={errors.clave} />
      <Field label="Créditos" value={creditos} onChange={setCreditos} type="number" required error={errors.creditos} />
      <Field label="Semestre" value={semestre} onChange={setSemestre} type="number" required error={errors.semestre} />
      <FormButtons onSave={handleSave} onCancel={onCancel} />
    </div>
  );
}

// ============================================================
// PAGE: ALUMNOS
// ============================================================
function AlumnosForm({ initial, onSave, onCancel }) {
  const [nombre, setNombre] = useState(initial?.nombre || "");
  const [matricula, setMatricula] = useState(initial?.matricula || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [semestre, setSemestre] = useState(initial?.semestre || "");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!nombre.trim()) e.nombre = "Nombre requerido";
    if (!matricula.trim()) e.matricula = "Matrícula requerida";
    if (!email.includes("@")) e.email = "Email inválido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <div>
      <Field label="Nombre completo" value={nombre} onChange={setNombre} required error={errors.nombre} />
      <Field label="Matrícula" value={matricula} onChange={setMatricula} required error={errors.matricula} />
      <Field label="Email institucional" value={email} onChange={setEmail} type="email" required error={errors.email} />
      <Field label="Semestre" value={semestre} onChange={setSemestre} options={["1","2","3","4","5","6","7","8","9"]} />
      <FormButtons onSave={() => { if (validate()) onSave({ ...initial, nombre, matricula, email, semestre }); }} onCancel={onCancel} />
    </div>
  );
}

// ============================================================
// PAGE: EVALUACIONES (Rúbrica dinámica)
// ============================================================
const RUBRICA_DEFAULT = [
  { criterio: "Presentación", peso: 20, niveles: ["Deficiente", "Regular", "Bueno", "Excelente"], puntaje: null },
  { criterio: "Contenido técnico", peso: 35, niveles: ["Deficiente", "Regular", "Bueno", "Excelente"], puntaje: null },
  { criterio: "Dominio del tema", peso: 30, niveles: ["Deficiente", "Regular", "Bueno", "Excelente"], puntaje: null },
  { criterio: "Trabajo en equipo", peso: 15, niveles: ["Deficiente", "Regular", "Bueno", "Excelente"], puntaje: null },
];

function EvaluacionesPage({ role }) {
  const [rubrica, setRubrica] = useState(RUBRICA_DEFAULT);
  const [submitted, setSubmitted] = useState(false);
  const [equipoSel, setEquipoSel] = useState("Equipo Alpha");
  const { toasts, addToast } = useToasts();

  const total = rubrica.reduce((acc, r) => {
    if (r.puntaje === null) return acc;
    return acc + (r.puntaje / 3) * r.peso;
  }, 0);

  const handleSubmit = () => {
    const inc = rubrica.filter(r => r.puntaje === null);
    if (inc.length > 0) { addToast(`Faltan ${inc.length} criterios por evaluar`, "error"); return; }
    setSubmitted(true);
    addToast("Evaluación guardada exitosamente");
  };

  return (
    <div>
      <ToastContainer toasts={toasts} />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
        <h2 style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 900, fontSize: 22, color: COLORS.tecDarkGray, margin: 0 }}>📊 Evaluación con Rúbrica</h2>
        <select value={equipoSel} onChange={e => setEquipoSel(e.target.value)} style={{ padding: "8px 14px", border: `2px solid ${COLORS.tecGreen}`, borderRadius: 8, fontFamily: "'Exo 2', sans-serif", fontSize: 14, color: COLORS.tecDarkGray }}>
          {["Equipo Alpha","Equipo Beta","Equipo Gamma","Equipo Delta"].map(e => <option key={e}>{e}</option>)}
        </select>
      </div>

      <div style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 16px rgba(0,0,0,0.07)", marginBottom: 20 }}>
        <div style={{ background: COLORS.rainbow, padding: "16px 24px", color: "#fff", fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 15 }}>
          Evaluando: {equipoSel}
        </div>
        <div style={{ padding: 24 }}>
          {rubrica.map((r, i) => (
            <div key={i} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: i < rubrica.length - 1 ? "1px solid #f0f0f0" : "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, color: COLORS.tecDarkGray }}>{r.criterio}</div>
                <div style={{ background: `${COLORS.tecGreen}22`, color: COLORS.tecGreen, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontFamily: "'Exo 2', sans-serif", fontWeight: 700 }}>Peso: {r.peso}%</div>
              </div>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                {r.niveles.map((nivel, j) => (
                  <button key={j} disabled={submitted || role === "alumno"}
                    onClick={() => setRubrica(rb => rb.map((x, xi) => xi === i ? { ...x, puntaje: j } : x))}
                    style={{
                      flex: 1, minWidth: 90, padding: "10px 6px", border: "2px solid",
                      borderColor: r.puntaje === j ? COLORS.tecGreen : "#e2e8f0",
                      background: r.puntaje === j ? `linear-gradient(135deg, ${COLORS.tecGreen}, ${COLORS.tecLightGreen})` : "#fff",
                      color: r.puntaje === j ? "#fff" : COLORS.tecDarkGray,
                      borderRadius: 10, cursor: (submitted || role === "alumno") ? "default" : "pointer",
                      fontFamily: "'Exo 2', sans-serif", fontWeight: 600, fontSize: 12, transition: "all 0.2s"
                    }}>
                    {nivel}
                    <div style={{ fontSize: 10, opacity: 0.8, marginTop: 2 }}>{["0%","33%","66%","100%"][j]}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Score display */}
      <div style={{ background: COLORS.rainbow, borderRadius: 16, padding: "20px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff" }}>
        <div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 14, opacity: 0.85 }}>Calificación total estimada</div>
          <div style={{ fontFamily: "'Exo 2', sans-serif", fontSize: 42, fontWeight: 900 }}>{total.toFixed(1)}<span style={{ fontSize: 20 }}>/100</span></div>
        </div>
        {!submitted && (role === "admin" || role === "profesor") && (
          <button onClick={handleSubmit} style={{ background: "#fff", color: COLORS.tecGreen, border: "none", borderRadius: 12, padding: "14px 28px", fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)" }}>
            Guardar Evaluación ✅
          </button>
        )}
        {submitted && <div style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 700, fontSize: 18 }}>✅ Evaluación guardada</div>}
      </div>
    </div>
  );
}

// ============================================================
// LOGIN PAGE
// ============================================================
function LoginPage({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
  const e = {};

  if (!email.trim()) {
    e.email = "Ingresa un usuario";
  }

  if (password.length < 4) {
    e.password = "Mínimo 4 caracteres";
  }

  setErrors(e);

  return Object.keys(e).length === 0;
};

  const handleLogin = async () => {
  if (!validate()) return;

  try {
    setLoading(true);

    const response = await api.post("/auth/login", {
      username: email,
      password,
    });

    const data = response.data;

    console.log(data);

    localStorage.setItem("token", data.token);

    onLogin({
      name: data.user.username,
      role: data.user.rol.toLowerCase(),
    });

  } catch (error) {
    console.log(error);

    alert("Credenciales incorrectas");
  } finally {
    setLoading(false);
  }
};

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(135deg, ${COLORS.tecDarkGreen} 0%, ${COLORS.tecBlue} 60%, ${COLORS.tecMidBlue} 100%)`, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, position: "relative", overflow: "hidden" }}>
      {/* Background decoration */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(58,181,74,0.12)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(77,166,255,0.12)", pointerEvents: "none" }} />

      <div style={{ background: "#fff", borderRadius: 24, padding: "48px 44px", width: "100%", maxWidth: 420, boxShadow: "0 32px 100px rgba(0,0,0,0.3)", position: "relative" }}>
        {/* Logo area */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <ISCBadge size={72} />
          <h1 style={{ fontFamily: "'Exo 2', sans-serif", fontWeight: 900, fontSize: 22, background: COLORS.rainbowText, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", marginTop: 12, marginBottom: 4 }}>
            Sistema ISC
          </h1>
          <p style={{ color: "#888", fontFamily: "'Exo 2', sans-serif", fontSize: 13, margin: 0 }}>Tecnológico Nacional de México en Celaya</p>
        </div>

        <Field label="Usuario" value={email} onChange={setEmail} type="email" required error={errors.email} />
        <Field label="Contraseña" value={password} onChange={setPassword} type="password" required error={errors.password} />
        <Field label="Rol de acceso" value={role} onChange={setRole} options={["admin", "profesor", "alumno"]} />

        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "14px 0", background: COLORS.rainbow, border: "none", color: "#fff",
          borderRadius: 12, fontFamily: "'Exo 2', sans-serif", fontWeight: 800, fontSize: 16, cursor: loading ? "wait" : "pointer",
          boxShadow: "0 8px 24px rgba(0,122,61,0.3)", marginTop: 8, transition: "opacity 0.2s", opacity: loading ? 0.7 : 1
        }}>
          {loading ? "⏳ Iniciando sesión..." : "Iniciar Sesión →"}
        </button>
      </div>
    </div>
  );
}

// ============================================================
// DATA SEEDS
// ============================================================
const SEED_MATERIAS = [
  { id: 1, nombre: "Bases de Datos", clave: "BDA-1001", creditos: 5, semestre: 4 },
  { id: 2, nombre: "Redes de Computadoras", clave: "RDC-1002", creditos: 4, semestre: 5 },
  { id: 3, nombre: "Ingeniería de Software", clave: "IDS-1003", creditos: 5, semestre: 6 },
  { id: 4, nombre: "Sistemas Operativos", clave: "SOP-1004", creditos: 4, semestre: 5 },
  { id: 5, nombre: "Inteligencia Artificial", clave: "IAR-1005", creditos: 5, semestre: 7 },
  { id: 6, nombre: "Compiladores", clave: "COM-1006", creditos: 4, semestre: 6 },
  { id: 7, nombre: "Cálculo Integral", clave: "CAL-2001", creditos: 5, semestre: 2 },
];

const SEED_GRUPOS = [
  { id: 1, clave: "ISC-501", materia: "Bases de Datos", profesor: "Dr. García", turno: "Matutino", alumnos: 32 },
  { id: 2, clave: "ISC-502", materia: "Redes de Computadoras", profesor: "Ing. López", turno: "Vespertino", alumnos: 28 },
  { id: 3, clave: "ISC-601", materia: "Ingeniería de Software", profesor: "Mtra. Ramírez", turno: "Matutino", alumnos: 35 },
  { id: 4, clave: "ISC-701", materia: "Inteligencia Artificial", profesor: "Dr. Martínez", turno: "Vespertino", alumnos: 25 },
  { id: 5, clave: "ISC-602", materia: "Compiladores", profesor: "Ing. Sánchez", turno: "Matutino", alumnos: 30 },
];

const SEED_ALUMNOS = [
  { id: 1, nombre: "Ana Martínez García", matricula: "21100120", email: "ana.martinez@itcelaya.edu.mx", semestre: "5" },
  { id: 2, nombre: "Carlos López Herrera", matricula: "21100121", email: "carlos.lopez@itcelaya.edu.mx", semestre: "5" },
  { id: 3, nombre: "María Rodríguez Vega", matricula: "21100122", email: "maria.rodriguez@itcelaya.edu.mx", semestre: "5" },
  { id: 4, nombre: "José Hernández Ruiz", matricula: "21100123", email: "jose.hernandez@itcelaya.edu.mx", semestre: "7" },
  { id: 5, nombre: "Sofía González Cruz", matricula: "21100124", email: "sofia.gonzalez@itcelaya.edu.mx", semestre: "3" },
  { id: 6, nombre: "Luis Torres Morales", matricula: "21100125", email: "luis.torres@itcelaya.edu.mx", semestre: "7" },
];

const SEED_EQUIPOS = [
  { id: 1, nombre: "Equipo Alpha", grupo: "ISC-501", integrantes: 4, proyecto: "Sistema de Inventario" },
  { id: 2, nombre: "Equipo Beta", grupo: "ISC-501", integrantes: 4, proyecto: "App de Gestión Escolar" },
  { id: 3, nombre: "Equipo Gamma", grupo: "ISC-601", integrantes: 5, proyecto: "Plataforma E-commerce" },
  { id: 4, nombre: "Equipo Delta", grupo: "ISC-701", integrantes: 3, proyecto: "Reconocimiento de Voz" },
];

const SEED_EXPO = [
  { id: 1, equipo: "Equipo Alpha", tema: "Sistema de Inventario", fecha: "2025-06-10", sala: "Aula 3A", estado: "Programada" },
  { id: 2, equipo: "Equipo Beta", tema: "App de Gestión Escolar", fecha: "2025-06-11", sala: "Lab. Cómputo 1", estado: "Programada" },
  { id: 3, equipo: "Equipo Gamma", tema: "Plataforma E-commerce", fecha: "2025-06-05", sala: "Aula 2B", estado: "Realizada" },
];

// ============================================================
// STATUS BADGE
// ============================================================
function Badge({ text, color }) {
  return <span style={{ background: `${color}22`, color, padding: "3px 10px", borderRadius: 20, fontSize: 12, fontFamily: "'Exo 2', sans-serif", fontWeight: 700 }}>{text}</span>;
}

// ============================================================
// SIMPLE FORM FACTORIES
// ============================================================
function makeSimpleForm(fields) {
  return function SimpleForm({ initial, onSave, onCancel }) {
    const [values, setValues] = useState(fields.reduce((acc, f) => ({ ...acc, [f.key]: initial?.[f.key] || "" }), {}));
    const [errors, setErrors] = useState({});
    const validate = () => {
      const e = {};
      fields.filter(f => f.required).forEach(f => { if (!String(values[f.key]).trim()) e[f.key] = `${f.label} es requerido`; });
      setErrors(e);
      return Object.keys(e).length === 0;
    };
    return (
      <div>
        {fields.map(f => <Field key={f.key} label={f.label} value={values[f.key]} onChange={v => setValues(x => ({ ...x, [f.key]: v }))} required={f.required} options={f.options} type={f.type} error={errors[f.key]} />)}
        <FormButtons onSave={() => { if (validate()) onSave({ ...initial, ...values }); }} onCancel={onCancel} />
      </div>
    );
  };
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <LoginPage onLogin={setUser} />;

  const GruposForm = makeSimpleForm([
    { key: "clave", label: "Clave del grupo", required: true },
    { key: "materia", label: "Materia", required: true, options: SEED_MATERIAS.map(m => m.nombre) },
    { key: "profesor", label: "Profesor", required: true },
    { key: "turno", label: "Turno", options: ["Matutino", "Vespertino", "Nocturno"] },
    { key: "alumnos", label: "No. alumnos", type: "number" },
  ]);

  const EquiposForm = makeSimpleForm([
    { key: "nombre", label: "Nombre del equipo", required: true },
    { key: "grupo", label: "Grupo", required: true, options: SEED_GRUPOS.map(g => g.clave) },
    { key: "integrantes", label: "No. integrantes", type: "number" },
    { key: "proyecto", label: "Nombre del proyecto" },
  ]);

  const ExpoForm = makeSimpleForm([
    { key: "equipo", label: "Equipo", required: true, options: SEED_EQUIPOS.map(e => e.nombre) },
    { key: "tema", label: "Tema", required: true },
    { key: "fecha", label: "Fecha", type: "date" },
    { key: "sala", label: "Sala / Aula" },
    { key: "estado", label: "Estado", options: ["Programada", "Realizada", "Cancelada"] },
  ]);

  const renderPage = () => {
    switch (page) {
      case "dashboard": return <Dashboard />;
      case "materias": return (
        <CRUDTable title="Materias" icon="📚" role={user.role}
          columns={[
            { key: "clave", label: "Clave" },
            { key: "nombre", label: "Nombre" },
            { key: "creditos", label: "Créditos" },
            { key: "semestre", label: "Semestre", render: v => <Badge text={`Sem. ${v}`} color={COLORS.tecMidBlue} /> },
          ]}
          initialData={SEED_MATERIAS}
          renderForm={({ initial, onSave, onCancel }) => <MateriasForm initial={initial} onSave={onSave} onCancel={onCancel} />}
        />
      );
      case "grupos": return (
        <CRUDTable title="Grupos" icon="👥" role={user.role}
          columns={[
            { key: "clave", label: "Clave" },
            { key: "materia", label: "Materia" },
            { key: "profesor", label: "Profesor" },
            { key: "turno", label: "Turno", render: v => <Badge text={v} color={COLORS.tecGreen} /> },
            { key: "alumnos", label: "Alumnos" },
          ]}
          initialData={SEED_GRUPOS}
          renderForm={({ initial, onSave, onCancel }) => <GruposForm initial={initial} onSave={onSave} onCancel={onCancel} />}
        />
      );
      case "alumnos": return (
        <CRUDTable title="Alumnos" icon="🎓" role={user.role}
          columns={[
            { key: "matricula", label: "Matrícula" },
            { key: "nombre", label: "Nombre" },
            { key: "email", label: "Email" },
            { key: "semestre", label: "Semestre", render: v => <Badge text={`Sem. ${v}`} color={COLORS.tecBlue} /> },
          ]}
          initialData={SEED_ALUMNOS}
          renderForm={({ initial, onSave, onCancel }) => <AlumnosForm initial={initial} onSave={onSave} onCancel={onCancel} />}
        />
      );
      case "equipos": return (
        <CRUDTable title="Equipos" icon="⚙️" role={user.role}
          columns={[
            { key: "nombre", label: "Equipo" },
            { key: "grupo", label: "Grupo" },
            { key: "integrantes", label: "Integrantes" },
            { key: "proyecto", label: "Proyecto" },
          ]}
          initialData={SEED_EQUIPOS}
          renderForm={({ initial, onSave, onCancel }) => <EquiposForm initial={initial} onSave={onSave} onCancel={onCancel} />}
        />
      );
      case "exposiciones": return (
        <CRUDTable title="Exposiciones" icon="🎤" role={user.role}
          columns={[
            { key: "equipo", label: "Equipo" },
            { key: "tema", label: "Tema" },
            { key: "fecha", label: "Fecha" },
            { key: "sala", label: "Sala" },
            { key: "estado", label: "Estado", render: v => <Badge text={v} color={v === "Realizada" ? COLORS.tecGreen : v === "Cancelada" ? "#E53E3E" : COLORS.tecMidBlue} /> },
          ]}
          initialData={SEED_EXPO}
          renderForm={({ initial, onSave, onCancel }) => <ExpoForm initial={initial} onSave={onSave} onCancel={onCancel} />}
        />
      );
      case "evaluaciones": return <EvaluacionesPage role={user.role} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: COLORS.tecGray, fontFamily: "'Exo 2', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;500;600;700;800;900&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { transform: translateX(40px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f0f0f0; }
        ::-webkit-scrollbar-thumb { background: ${COLORS.tecGreen}; border-radius: 3px; }
        body { margin: 0; }
      `}</style>

      <Sidebar active={page} setActive={setPage} collapsed={collapsed} role={user.role} />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Navbar page={page} collapsed={collapsed} setCollapsed={setCollapsed} user={user} onLogout={() => setUser(null)} />
        <main style={{ flex: 1, padding: 28, overflow: "auto" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

