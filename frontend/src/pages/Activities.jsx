import { useEffect, useMemo, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";
import { Link, useNavigate } from "react-router-dom";

const UNIT_BY_CATEGORY = { transporte: "km", energia: "min", alimentacion: "kg" };

const OPTIONS_BY_CATEGORY = {
  transporte: [
    { value: "bus", label: "Bus" },
    { value: "auto_gasolina", label: "Auto (gasolina)" },
    { value: "auto_diesel", label: "Auto (diésel)" },
    { value: "moto", label: "Moto" },
    { value: "metro", label: "Metro" },
  ],
  energia: [
    { value: "ducha_electrica", label: "Ducha eléctrica" },
  ],
  alimentacion: [
    { value: "res", label: "Carne de res" },
    { value: "pollo", label: "Pollo" },
    { value: "cerdo", label: "Cerdo" },
    { value: "pescado", label: "Pescado" },
    { value: "arroz", label: "Arroz" },
    { value: "verduras", label: "Verduras" },
    { value: "lacteos", label: "Lácteos" },
  ],
};

const empty = { category: "transporte", subtype: "bus", quantity: 0, unit: "km" };

export default function Activities(){
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const { logout } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    try{
      const { data } = await api.get("/api/activities/");
      setItems(data);
    }catch{
      logout(); nav("/login");
    }
  };

  useEffect(()=>{ load(); }, []);

  useEffect(()=>{
    const unit = UNIT_BY_CATEGORY[form.category] || form.unit;
    const firstOption = OPTIONS_BY_CATEGORY[form.category]?.[0]?.value || form.subtype;
    setForm(f => ({ ...f, unit, subtype: firstOption }));
  }, [form.category]);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, quantity: Number(form.quantity) };
    if (editingId) await api.put(`/api/activities/${editingId}/`, payload);
    else await api.post("/api/activities/", payload);
    setForm(empty); setEditingId(null); load();
  };

  const edit = (it) => {
    setForm({ category: it.category, subtype: it.subtype, quantity: it.quantity, unit: it.unit });
    setEditingId(it.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const delItem = async (id) => { await api.delete(`/api/activities/${id}/`); load(); };

  const totalCO2 = useMemo(()=> items.reduce((s, it)=> s + (it.co2_kg || 0), 0), [items]);
  const subtypeOptions = OPTIONS_BY_CATEGORY[form.category] || [];

  return (
    <div className="container">
      <div className="nav">
        <div className="brand">🌱 Ecoli-Track</div>
        <div className="nav-actions">
          <Link className="btn btn-ghost" to="/app/profile">Mi perfil</Link>
          <button className="btn btn-ghost" onClick={logout}>Cerrar sesión</button>
        </div>
      </div>

      <div className="card" style={{marginBottom:12}}>
        <h2 className="title" style={{fontSize:22, marginBottom:12}}>Registrar actividad</h2>
        <form className="toolbar" onSubmit={save}>
          <select className="select" value={form.category} onChange={(e)=>setForm({...form, category:e.target.value})}>
            <option value="transporte">Transporte</option>
            <option value="energia">Energía</option>
            <option value="alimentacion">Alimentación</option>
          </select>

          <select className="select" value={form.subtype} onChange={(e)=>setForm({...form, subtype:e.target.value})}>
            {subtypeOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>

          <input className="input" type="number" step="0.01" placeholder="Cantidad" value={form.quantity}
                 onChange={(e)=>setForm({...form, quantity:e.target.value})} required/>

          <input className="input" value={form.unit} readOnly/>

          <button className="btn btn-primary" type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
        </form>
        <div className="footer-note">
          Unidad esperada: <kbd>{UNIT_BY_CATEGORY[form.category]}</kbd>.
          El CO₂ se calcula automáticamente al guardar.
        </div>
      </div>

      <div className="stat">
        <span>CO₂ total hoy:</span>
        <span className="value">{totalCO2.toFixed(3)} kg</span>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Categoría</th>
              <th>Subtipo</th>
              <th>Cantidad</th>
              <th>Unidad</th>
              <th>CO₂ (kg)</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.id}>
                <td>{new Date(it.created_at).toLocaleString()}</td>
                <td><span className="badge">{it.category}</span></td>
                <td>{it.subtype.replaceAll("_"," ")}</td>
                <td>{it.quantity}</td>
                <td>{it.unit}</td>
                <td><strong>{(it.co2_kg ?? 0).toFixed(3)}</strong></td>
                <td>
                  <div style={{display:"flex", gap:8}}>
                    <button className="btn btn-ghost" onClick={()=>edit(it)}>Editar</button>
                    <button className="btn btn-danger" onClick={()=>delItem(it.id)}>Eliminar</button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan="7" style={{color:"var(--muted)"}}>Sin actividades aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
