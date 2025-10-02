import { useEffect, useState, useMemo } from "react";
import api from "../api";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

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

export default function Activities() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState(null);
  const { logout } = useAuth();
  const nav = useNavigate();

  const load = async () => {
    try {
      const { data } = await api.get("/api/activities/");
      setItems(data);
    } catch {
      logout();
      nav("/login");
    }
  };

  useEffect(() => { load(); }, []);

  // fijar unidad al cambiar de categoría
  useEffect(() => {
    const unit = UNIT_BY_CATEGORY[form.category] || form.unit;
    const firstOption = OPTIONS_BY_CATEGORY[form.category]?.[0]?.value || form.subtype;
    setForm((f) => ({ ...f, unit, subtype: firstOption }));
  }, [form.category]);

  const save = async (e) => {
    e.preventDefault();
    const payload = { ...form, quantity: Number(form.quantity) };
    if (editingId) {
      await api.put(`/api/activities/${editingId}/`, payload);
    } else {
      await api.post("/api/activities/", payload);
    }
    setForm(empty);
    setEditingId(null);
    load();
  };

  const edit = (it) => {
    setForm({
      category: it.category,
      subtype: it.subtype,
      quantity: it.quantity,
      unit: it.unit,
    });
    setEditingId(it.id);
  };

  const delItem = async (id) => {
    await api.delete(`/api/activities/${id}/`);
    load();
  };

  const totalCO2 = useMemo(
    () => items.reduce((sum, it) => sum + (it.co2_kg || 0), 0),
    [items]
  );

  const subtypeOptions = OPTIONS_BY_CATEGORY[form.category] || [];

  return (
    <div style={{ maxWidth: 1000, margin: "40px auto" }}>
      <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Ecoli-Track — Actividades </h2>
        <button onClick={logout}>Cerrar sesión</button>
      </header>

      <form onSubmit={save} style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr auto", gap: 8, margin: "16px 0" }}>
        <select
          value={form.category}
          onChange={(e)=>setForm({...form, category:e.target.value})}
        >
          <option value="transporte">Transporte</option>
          <option value="energia">Energía</option>
          <option value="alimentacion">Alimentación</option>
        </select>

        <select
          value={form.subtype}
          onChange={(e)=>setForm({...form, subtype:e.target.value})}
        >
          {subtypeOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          type="number"
          step="0.01"
          placeholder="cantidad"
          value={form.quantity}
          onChange={(e)=>setForm({...form, quantity:e.target.value})}
          required
        />

        <input value={form.unit} readOnly />

        <button type="submit">{editingId ? "Actualizar" : "Agregar"}</button>
      </form>

      <div style={{ margin: "8px 0", fontWeight: "bold" }}>
        CO₂ total hoy: {totalCO2.toFixed(3)} kg
      </div>

      <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
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
            <tr key={it.id} style={{ borderBottom: "1px solid #eee" }}>
              <td>{new Date(it.created_at).toLocaleString()}</td>
              <td>{it.category}</td>
              <td>{it.subtype}</td>
              <td>{it.quantity}</td>
              <td>{it.unit}</td>
              <td>{(it.co2_kg ?? 0).toFixed(3)}</td>
              <td>
                <button onClick={()=>edit(it)}>Editar</button>
                <button onClick={()=>delItem(it.id)} style={{ marginLeft: 8 }}>Eliminar</button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan="7">Sin actividades aún.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
