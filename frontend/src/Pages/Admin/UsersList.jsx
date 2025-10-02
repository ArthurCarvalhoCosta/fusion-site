import React, { useEffect, useMemo, useState } from "react";
import "./UsersList.css";

import IconSearch from "@/assets/icons/search.svg";
import IconFilter from "@/assets/icons/filter.svg";
import IconEdit from "@/assets/icons/edit.svg";
import IconDelete from "@/assets/icons/delete.svg";

const API_BASE = "http://localhost:5000";

function normalizeUser(u) {
  const get = (...names) => {
    for (const n of names) {
      if (!n) continue;
      if (typeof n === "function") {
        try {
          const v = n(u);
          if (v !== undefined && v !== null && String(v).trim() !== "") return String(v);
        } catch {}
      } else if (u[n] !== undefined && u[n] !== null && String(u[n]).trim() !== "") {
        return String(u[n]);
      }
    }
    return "";
  };

  const id = get("_id", "id", (obj) => obj._id && obj._id.toString && obj._id.toString());
  const nome = get("nome", "name", "fullName", "full_name");
  const email = get("email", "mail");
  const tipo = get("tipo", "role", "type");
  const cpf = get("cpf", "document", "cpfNumber");
  const modalidade = get("modalidade", "modality");
  const plano = get("plano", "plan");
  const status = get("status", (obj) => (obj.active === false ? "Inativo" : obj.active === true ? "Ativo" : ""));

  return {
    raw: u,
    id,
    nome,
    email,
    tipo,
    cpf,
    modalidade,
    plano,
    status,
  };
}

const TIPO_OPTIONS = [
  { value: "Admin", label: "Administrador" },
  { value: "Aluno", label: "Aluno" },
  { value: "Personal Trainer", label: "Personal Trainer" },
];

const formatCPF = (value) => {
  let val = value.replace(/\D/g, "");
  val = val.slice(0, 11);
  val = val.replace(/(\d{3})(\d)/, "$1.$2");
  val = val.replace(/(\d{3})(\d)/, "$1.$2");
  val = val.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return val;
};

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [rawUsers, setRawUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [showCreate, setShowCreate] = useState(false);
  const [createForm, setCreateForm] = useState({
    nome: "",
    tipo: "Aluno",
    cpf: "",
    modalidade: "",
    plano: "",
    email: "",
    senha: "",
  });

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ id: "", nome: "", tipo: "Aluno", cpf: "", modalidade: "", plano: "", email: "" });

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      let arr = [];
      if (data && Array.isArray(data.users)) arr = data.users;
      else if (Array.isArray(data)) arr = data;
      else if (data && data.users && Array.isArray(data.users)) arr = data.users;
      setRawUsers(arr);
      const normalized = arr.map(normalizeUser);
      setUsers(normalized);
    } catch (err) {
      console.error(err);
      setRawUsers([]);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      return (
        (u.nome && u.nome.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.cpf && u.cpf.toLowerCase().includes(q)) ||
        (u.tipo && u.tipo.toLowerCase().includes(q)) ||
        (u.modalidade && u.modalidade.toLowerCase().includes(q)) ||
        (u.plano && u.plano.toLowerCase().includes(q))
      );
    });
  }, [users, query]);

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      // valida tipo do lado cliente (segurança UX)
      const allowed = ["Admin","Aluno","Personal Trainer"];
      if (!allowed.includes(createForm.tipo)) {
        return alert("Tipo inválido. Selecione um dos valores válidos.");
      }

      const body = {
        nome: createForm.nome,
        email: createForm.email,
        senha: createForm.senha || "", // se você quer permitir auto-generate no backend, ajuste lá
        tipo: createForm.tipo,
        cpf: createForm.cpf,
        modalidade: createForm.modalidade,
        plano: createForm.plano
      };

      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data && data.success) {
        setShowCreate(false);
        setCreateForm({ nome: "", tipo: "Aluno", cpf: "", modalidade: "", plano: "", email: "", senha: "" });
        await fetchUsers();
        if (data.plainPassword) alert(`Senha gerada: ${data.plainPassword}`);
      } else {
        alert(data.message || "Erro ao criar usuário");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao criar usuário");
    }
  };

  const openEdit = (u) => {
    setEditForm({
      id: u.id,
      nome: u.nome || "",
      tipo: u.tipo || "Aluno",
      cpf: u.cpf || "",
      modalidade: u.modalidade || "",
      plano: u.plano || "",
      email: u.email || "",
    });
    setShowEdit(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const id = editForm.id;
      const allowed = ["Admin","Aluno","Personal Trainer"];
      if (!allowed.includes(editForm.tipo)) {
        return alert("Tipo inválido.");
      }

      const payload = {
        nome: editForm.nome,
        tipo: editForm.tipo,
        cpf: editForm.cpf,
        modalidade: editForm.modalidade,
        plano: editForm.plano,
        email: editForm.email,
      };
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.success) {
        setShowEdit(false);
        await fetchUsers();
      } else {
        alert(data.message || "Erro ao atualizar");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao atualizar");
    }
  };

  const doDelete = async (id, nome) => {
    if (!window.confirm(`Remover ${nome}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && data.success) fetchUsers();
      else alert(data.message || "Erro ao remover");
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao remover");
    }
  };

  const exportCSV = () => {
    const header = ["Nome", "Tipo", "CPF", "Modalidade", "Plano", "Status", "Email"];
    const rows = filtered.map((u) => [
      u.nome || "-",
      u.tipo || "-",
      u.cpf || "-",
      u.modalidade || "-",
      u.plano || "-",
      u.status || "-",
      u.email || "-",
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `usuarios_export_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="users-page-wrapper">
      <h1 className="page-title">Gerenciar <span className="accent">Alunos</span></h1>

      <div className="controls-row">
        <div className="search-box">
          <input className="search-input" placeholder="Pesquisar Usuarios" value={query} onChange={(e) => setQuery(e.target.value)} />
          <button className="search-icon"><img src={IconSearch} alt="Pesquisar" /></button>
        </div>

        <div className="controls-right">
          <button className="filters-btn"><img src={IconFilter} alt="Filtros" /> <span>Filtros Rápidos</span></button>
        </div>
      </div>

      <div className="table-container">
        <table className="users-table" role="table">
          <thead>
            <tr>
              <th>Nome</th><th>Tipo</th><th>CPF</th><th>Modalidade</th><th>Plano</th><th>Status</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (<tr><td colSpan={7} className="center">Carregando...</td></tr>) :
              filtered.length === 0 ? (<tr><td colSpan={7} className="center">Nenhum usuário encontrado</td></tr>) :
              filtered.map((u) => (
                <tr key={u.id || Math.random()}>
                  <td className="col-name">{u.nome || "-"}</td>
                  <td>{u.tipo || "-"}</td>
                  <td>{u.cpf || "-"}</td>
                  <td>{u.modalidade || "-"}</td>
                  <td>{u.plano || "-"}</td>
                  <td><span className={`status-badge ${u.status && u.status.toLowerCase().includes("inativ") ? "inactive" : "active"}`}>{u.status || "-"}</span></td>
                  <td className="actions-col">
                    <button className="action" title="Editar" onClick={() => openEdit(u)}><img src={IconEdit} alt="Editar" /></button>
                    <button className="action remove" title="Remover" onClick={() => doDelete(u.id, u.nome)}><img src={IconDelete} alt="Remover" /></button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="bottom-row">
        <div>
          <button className="new-user-btn" onClick={() => setShowCreate(true)}>+ Novo Usuario</button>
          <div style={{ marginTop: 10 }}>
            <button className="export-link" onClick={exportCSV}>Exportar Alunos (.csv)</button>
          </div>
        </div>
      </div>

      {/* Modal Create */}
      {showCreate && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Novo Usuário</h3>
            <form onSubmit={submitCreate} className="create-form">
              <label>Nome</label>
              <input required value={createForm.nome} onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })} />

              <label>Tipo</label>
              <div className="custom-select-wrapper">
                <select
                  className="custom-select"
                  value={createForm.tipo}
                  onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
                >
                  {TIPO_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="custom-arrow"></span>
              </div>

              <label>CPF</label>
              <input
                type="text"
                placeholder="CPF"
                value={createForm.cpf}
                onChange={(e) => setCreateForm({ ...createForm, cpf: formatCPF(e.target.value) })}
              />

              <label>Modalidade</label>
              <input value={createForm.modalidade} onChange={(e) => setCreateForm({ ...createForm, modalidade: e.target.value })} />

              <label>Plano</label>
              <input value={createForm.plano} onChange={(e) => setCreateForm({ ...createForm, plano: e.target.value })} />

              <label>Email</label>
              <input type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} />

              <label>Senha (opcional)</label>
              <input type="password" value={createForm.senha} onChange={(e) => setCreateForm({ ...createForm, senha: e.target.value })} />

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Criar</button>
                <button type="button" className="btn-cancel" onClick={() => setShowCreate(false)}>Cancelar</button>
              </div>
              <p className="muted">Se a senha ficar vazia, o backend pode gerar automaticamente (verifique sua API).</p>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit */}
      {showEdit && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Editar Usuário</h3>
            <form onSubmit={submitEdit} className="create-form">
              <label>Nome</label>
              <input required value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} />

              <label>Tipo</label>
              <div className="custom-select-wrapper">
                <select
                  className="custom-select"
                  value={createForm.tipo}
                  onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
                >
                  {TIPO_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <span className="custom-arrow"></span>
              </div>

              <label>CPF</label>
              <input
                type="text"
                placeholder="CPF"
                value={editForm.cpf}
                onChange={(e) => setEditForm({ ...editForm, cpf: formatCPF(e.target.value) })}
              />

              <label>Modalidade</label>
              <input value={editForm.modalidade} onChange={(e) => setEditForm({ ...editForm, modalidade: e.target.value })} />

              <label>Plano</label>
              <input value={editForm.plano} onChange={(e) => setEditForm({ ...editForm, plano: e.target.value })} />

              <label>Email</label>
              <input type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />

              <div className="modal-actions">
                <button type="submit" className="btn-primary">Salvar</button>
                <button type="button" className="btn-cancel" onClick={() => setShowEdit(false)}>Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
