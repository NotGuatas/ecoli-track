import { useState } from "react";
import { useAuth } from "../auth";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState({ type: "", text: "" });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg({type:"", text:""});
    try {
      await login(form.username, form.password);
      nav("/app/activities");
    } catch (err) {
      const detail = err.response?.data?.detail || "Credenciales inválidas";
      setMsg({type:"error", text: detail});
      console.error("LOGIN ERROR:", err.response?.status, err.response?.data);
    }
  };

  return (
    <div className="center">
      <div className="card auth-card">
        <h1 className="title">Ecoli-Track</h1>
        <p className="subtitle">Inicia sesión para continuar</p>

        {msg.text && (
          <div className={`alert ${msg.type==="error" ? "alert-error":"alert-ok"}`}>
            {msg.text}
          </div>
        )}

        <form className="form" onSubmit={onSubmit}>
          <div>
            <label className="label">Usuario</label>
            <input
              className="input"
              autoFocus
              value={form.username}
              onChange={(e)=>setForm({...form, username:e.target.value})}
              required
            />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input
              className="input"
              type="password"
              value={form.password}
              onChange={(e)=>setForm({...form, password:e.target.value})}
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">Ingresar</button>
        </form>

        <p className="footer-note" style={{marginTop:12}}>
          ¿No tienes cuenta? <Link className="link" to="/register">Crea una aquí</Link>
        </p>
      </div>
    </div>
  );
}
