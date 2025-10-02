import { useEffect, useState } from "react";
import api from "../api";
import { useAuth } from "../auth";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { logout } = useAuth();
  const nav = useNavigate();
  const [me, setMe] = useState(null);
  const [email, setEmail] = useState("");
  const [passwords, setPasswords] = useState({ current_password: "", password: "" });
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const load = async () => {
    try {
      const { data } = await api.get("/api/auth/me/");
      setMe(data);
      setEmail(data.email || "");
    } catch {
      logout();
      nav("/login");
    }
  };

  useEffect(() => { load(); }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setMsg(""); setErr("");
    try {
      const payload = { email };
      if (passwords.password) {
        payload.password = passwords.password;
        payload.current_password = passwords.current_password;
      }
      await api.put("/api/auth/me/", payload);
      setMsg("Perfil actualizado.");
      setPasswords({ current_password: "", password: "" });
      load();
    } catch (err) {
      setErr(err.response?.data?.detail || "No se pudo actualizar.");
    }
  };

  const deleteAccount = async () => {
    const ok = confirm("¿Seguro que deseas borrar tu cuenta? Esta acción es irreversible.");
    if (!ok) return;
    const current_password = prompt("Confirma tu contraseña actual:");
    if (!current_password) return;
    try {
      await api.delete("/api/auth/me/", { data: { current_password } });
      logout();
      nav("/login");
    } catch (err) {
      alert("No se pudo borrar la cuenta. Verifica tu contraseña.");
    }
  };

  if (!me) return <div style={{ maxWidth: 800, margin: "40px auto" }}>Cargando…</div>;

  return (
    <div style={{ maxWidth: 600, margin: "40px auto" }}>
      <h2>Mi perfil</h2>
      <p><b>Usuario:</b> {me.username}</p>
      <p><b>Creado:</b> {new Date(me.date_joined).toLocaleString()}</p>

      <form onSubmit={saveProfile} style={{ display:"grid", gap: 8, maxWidth: 400 }}>
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} />
        <label>Nueva contraseña (opcional)</label>
        <input type="password" value={passwords.password} onChange={e=>setPasswords({...passwords, password:e.target.value})} />
        {passwords.password && (
          <>
            <label>Contraseña actual (obligatoria para cambiar)</label>
            <input type="password" value={passwords.current_password} onChange={e=>setPasswords({...passwords, current_password:e.target.value})} />
          </>
        )}
        <button type="submit">Guardar</button>
      </form>

      {msg && <p style={{ color:"green" }}>{msg}</p>}
      {err && <p style={{ color:"red" }}>{err}</p>}

      <hr style={{ margin: "24px 0" }}/>
      <button onClick={deleteAccount} style={{ color:"white", background:"#c0392b", padding:"8px 12px", border:"none", borderRadius:4 }}>
        Borrar mi cuenta
      </button>
    </div>
  );
}
