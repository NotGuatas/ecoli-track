import { useState } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";

export default function Register(){
  const nav = useNavigate();
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [msg, setMsg] = useState({ type:"", text:"" });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({type:"", text:""});
    try{
      await api.post("/api/auth/register/", form);
      setMsg({type:"ok", text:"Usuario creado. Ahora inicia sesión."});
      setTimeout(()=> nav("/login"), 900);
    }catch(err){
      const data = err.response?.data || {};
      const text = data?.username?.[0] || data?.password?.[0] || data?.email?.[0] || data?.detail || "Error al registrar.";
      setMsg({type:"error", text});
    }
  };

  return (
    <div className="center">
      <div className="card auth-card">
        <h2 className="title">Crear cuenta</h2>
        <p className="subtitle">Es gratis y rápido</p>

        {msg.text && (
          <div className={`alert ${msg.type==="error" ? "alert-error":"alert-ok"}`}>
            {msg.text}
          </div>
        )}

        <form className="form" onSubmit={submit}>
          <div>
            <label className="label">Usuario</label>
            <input className="input" value={form.username} onChange={(e)=>setForm({...form, username:e.target.value})} required/>
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" value={form.email} onChange={(e)=>setForm({...form, email:e.target.value})}/>
          </div>
          <div>
            <label className="label">Contraseña (mín. 6)</label>
            <input className="input" type="password" value={form.password} onChange={(e)=>setForm({...form, password:e.target.value})} required/>
          </div>
          <button className="btn btn-primary" type="submit">Registrarme</button>
        </form>

        <p className="footer-note" style={{marginTop:12}}>
          ¿Ya tienes cuenta? <Link className="link" to="/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
