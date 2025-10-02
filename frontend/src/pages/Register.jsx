import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setOk("");
    try {
      await api.post("/api/auth/register/", form);
      setOk("Usuario creado. Ahora inicia sesión.");
      setTimeout(()=> nav("/login"), 800);
    } catch (err) {
      const data = err.response?.data || {};
      setError(
        data?.username?.[0] || data?.password?.[0] || data?.email?.[0] || data?.detail || "Error al registrar."
      );
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: "80px auto" }}>
      <h2>Crear cuenta</h2>
      <form onSubmit={submit}>
        <label>Usuario</label>
        <input value={form.username} onChange={e=>setForm({...form, username:e.target.value})} required />
        <label>Email</label>
        <input type="email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} />
        <label>Contraseña (mín. 6)</label>
        <input type="password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} required />
        {error && <p style={{ color:"red" }}>{error}</p>}
        {ok && <p style={{ color:"green" }}>{ok}</p>}
        <button type="submit">Registrarme</button>
      </form>
      <p style={{ marginTop: 12 }}>
        ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
      </p>
    </div>
  );
}
