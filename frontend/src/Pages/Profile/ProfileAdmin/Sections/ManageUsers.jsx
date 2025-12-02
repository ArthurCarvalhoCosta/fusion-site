import React, { useEffect, useMemo, useState } from "react";
import "./Sections.css";

import IconSearch from "@/assets/icons/search.svg";
import IconFilter from "@/assets/icons/filter.svg";
import IconClose from "@/assets/icons/close.svg";
import IconEdit from "@/assets/icons/edit.svg";
import IconDelete from "@/assets/icons/delete.svg";

const API_BASE = process.env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL_DEV;

// Normalização de usuário
function normalizeUser(u) {
  const get = (...names) => {
    for (const n of names) {
      if (!n) continue;
      if (typeof n === "function") {
        try {
          const v = n(u);
          if (v !== undefined && v !== null && String(v).trim() !== "")
            return String(v);
        } catch {}
      } else if (
        u[n] !== undefined &&
        u[n] !== null &&
        String(u[n]).trim() !== ""
      ) {
        return String(u[n]);
      }
    }
    return "";
  };

  const id = get("_id", "id", (obj) => obj._id && obj._id.toString && obj._id.toString());
  const nome = get("nome", "name", "fullName", "full_name");
  const genero = get("genero");
  const email = get("email", "mail");
  const tipo = get("tipo", "role", "type");
  const cpf = get("cpf", "document", "cpfNumber");
  const modalidade = get("modalidade", "modality");
  const plano = get("plano", "plan");

  return { raw: u, id, nome, genero, email, tipo, cpf, modalidade, plano };
}

// Opções de filtro
const TIPO_OPTIONS = [
  { value: "Admin", label: "Administrador" },
  { value: "Aluno", label: "Aluno" },
  { value: "Personal Trainer", label: "Personal Trainer" },
];

const GENERO_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "Prefiro não dizer", label: "Prefiro não dizer" },
];

const MODALIDADE_OPTIONS = [
  "", "Jiu-Jitsu Adulto", "Jiu-Jitsu Kids", "Funcional", "Boxe",
  "Combo 1 - 2. Mod", "Combo 2 - 3. Mod", "Funcional Fight", "Funcional Step",
  "Funcional Pro", "Funcional Kids"
];

const PLANO_OPTIONS = [
  "", "Mensal - 2x", "Mensal - 3x", "Mensal - 6x",
  "Trimestral - 3x", "Trimestral - 6x", "Semestral - 3x", "Semestral - 6x"
];

// Formatação CPF
const formatCPF = (value) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d)/, "$1.$2");
  value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  return value;
};

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterTipo, setFilterTipo] = useState("");
  const [filterModalidade, setFilterModalidade] = useState("");
  const [filterPlano, setFilterPlano] = useState("");

  const [showFilters, setShowFilters] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [stepCreate, setStepCreate] = useState(1);
  const [createForm, setCreateForm] = useState({
    nome: "", genero: "", email: "", senha: "", tipo: "", cpf: "", modalidade: "", plano: "",
  });

  const [showEdit, setShowEdit] = useState(false);
  const [stepEdit, setStepEdit] = useState(1);
  const [editForm, setEditForm] = useState({
    id: "", nome: "", genero: "", email: "", tipo: "", cpf: "", modalidade: "", plano: "",
  });

  // ======= RESET FORM =======
  const resetCreateForm = () => {
    setCreateForm({ nome: "", genero: "", email: "", senha: "", tipo: "", cpf: "", modalidade: "", plano: "" });
    setStepCreate(1);
  };
  const resetEditForm = () => {
    setEditForm({ id: "", nome: "", genero: "", email: "", tipo: "", cpf: "", modalidade: "", plano: "" });
    setStepEdit(1);
  };

  useEffect(() => { fetchUsers(); }, []);
  async function fetchUsers() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/users`);
      const data = await res.json();
      let arr = Array.isArray(data.users) ? data.users : (Array.isArray(data) ? data : []);
      setUsers(arr.map(normalizeUser));
    } catch (err) {
      console.error(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return users.filter(u => {
      const matchQuery =
        !q ||
        (u.nome && u.nome.toLowerCase().includes(q)) ||
        (u.email && u.email.toLowerCase().includes(q)) ||
        (u.tipo && u.tipo.toLowerCase().includes(q)) ||
        (u.cpf && u.cpf.toLowerCase().includes(q)) ||
        (u.modalidade && u.modalidade.toLowerCase().includes(q)) ||
        (u.plano && u.plano.toLowerCase().includes(q));
      const matchTipo = !filterTipo || u.tipo === filterTipo;
      const matchModalidade = !filterModalidade || u.modalidade === filterModalidade;
      const matchPlano = !filterPlano || u.plano === filterPlano;
      return matchQuery && matchTipo && matchModalidade && matchPlano;
    });
  }, [users, query, filterTipo, filterModalidade, filterPlano]);

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let pass = "";
    for (let i = 0; i < 8; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    return pass;
  };

  const handleCPFChangeCreate = (e) => setCreateForm({ ...createForm, cpf: formatCPF(e.target.value) });
  const handleCPFChangeEdit = (e) => setEditForm({ ...editForm, cpf: formatCPF(e.target.value) });

  const submitCreate = async (e) => {
    e.preventDefault();
    try {
      const allowed = ["Admin", "Aluno", "Personal Trainer"];
      if (!allowed.includes(createForm.tipo)) return alert("Tipo inválido.");
      const senha = createForm.senha || generatePassword();
      const body = {
        nome: createForm.nome,
        genero: createForm.genero,
        email: createForm.email,
        senha,
        tipo: createForm.tipo,
        cpf: createForm.cpf.replace(/\D/g, ""),
        modalidade: createForm.modalidade,
        plano: createForm.plano,
      };
      const res = await fetch(`${API_BASE}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data && data.success) {
        setShowCreate(false);
        resetCreateForm();
        await fetchUsers();
      } else alert(data.message || "Erro ao criar usuário");
    } catch (err) { console.error(err); }
  };

  const openEdit = (u) => {
    setEditForm({
      id: u.id, nome: u.nome || "", genero: u.genero || "", email: u.email || "",
      tipo: u.tipo || "", cpf: formatCPF(u.cpf || ""), modalidade: u.modalidade || "", plano: u.plano || "",
    });
    setStepEdit(1);
    setShowEdit(true);
  };

  const submitEdit = async (e) => {
    e.preventDefault();
    try {
      const id = editForm.id;
      const allowed = ["Admin", "Aluno", "Personal Trainer"];
      if (!allowed.includes(editForm.tipo)) return alert("Tipo inválido.");
      const payload = {
        nome: editForm.nome, genero: editForm.genero, tipo: editForm.tipo,
        cpf: editForm.cpf.replace(/\D/g, ""), modalidade: editForm.modalidade,
        plano: editForm.plano, email: editForm.email
      };
      const res = await fetch(`${API_BASE}/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data && data.success) {
        setShowEdit(false);
        resetEditForm();
        await fetchUsers();
      } else alert(data.message || "Erro ao atualizar");
    } catch (err) { console.error(err); alert("Erro de rede ao atualizar"); }
  };

  const doDelete = async (id, nome) => {
    if (!window.confirm(`Remover ${nome}?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && data.success) await fetchUsers();
      else alert(data.message || "Erro ao deletar");
    } catch (err) { console.error(err); alert("Erro de rede ao deletar"); }
  };

  return (
    <div className="users-page-wrapper">
      <h1 className="page-title">Gerenciar <span className="accent">Usuários</span></h1>

      <div className="controls-row">
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Pesquisar Usuários..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-icon"><img src={IconSearch} alt="buscar" /></button>
        </div>
        <div className="controls-right">
          <button className="filters-btn" onClick={() => setShowFilters(!showFilters)}>
            <img src={showFilters ? IconClose : IconFilter} alt="Filtros" />
            <span>{showFilters ? "Fechar Filtros" : "Filtros"}</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-group">
            <h3>Tipo</h3>
            <div className="pills">
              {TIPO_OPTIONS.map(t => (
                <div
                  key={t.value}
                  className={`pill ${filterTipo === t.value ? "active" : ""}`}
                  onClick={() => setFilterTipo(filterTipo === t.value ? "" : t.value)}
                >{t.label}</div>
              ))}
            </div>
          </div>
          <div className="filters-group">
            <h3>Modalidade</h3>
            <div className="pills">
              {MODALIDADE_OPTIONS.map(m => (
                <div
                  key={m}
                  className={`pill ${filterModalidade === m ? "active" : ""}`}
                  onClick={() => setFilterModalidade(filterModalidade === m ? "" : m)}
                >{m || "Todas"}</div>
              ))}
            </div>
          </div>
          <div className="filters-group">
            <h3>Plano</h3>
            <div className="pills">
              {PLANO_OPTIONS.map(p => (
                <div
                  key={p}
                  className={`pill ${filterPlano === p ? "active" : ""}`}
                  onClick={() => setFilterPlano(filterPlano === p ? "" : p)}
                >{p || "Todos"}</div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Nome</th><th>Gênero</th><th>Email</th><th>CPF</th>
              <th>Tipo</th><th>Modalidade</th><th>Plano</th><th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? <tr><td colSpan={8}>Carregando...</td></tr> :
              filtered.map(u => (
                <tr key={u.id}>
                  <td>{u.nome}</td><td>{u.genero}</td><td>{u.email}</td>
                  <td>{formatCPF(u.cpf)}</td><td>{u.tipo}</td>
                  <td>{u.modalidade}</td><td>{u.plano}</td>
                  <td className="actions-col">
                    <button className="action" onClick={() => openEdit(u)}><img src={IconEdit} alt="editar" /></button>
                    <button className="action" onClick={() => doDelete(u.id, u.nome)}><img src={IconDelete} alt="remover" /></button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      <div className="bottom-row">
        <button className="new-user-btn" onClick={() => { setShowCreate(true); setStepCreate(1); }}>+ Novo Usuário</button>
      </div>

      {/* ---------------------- MODAL CRIAR ---------------------- */}
      {showCreate && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Novo Usuário</h3>
            <form onSubmit={submitCreate} className="create-form">
              {stepCreate === 1 && (
                <>
                  <label>Nome</label>
                  <input
                    required
                    value={createForm.nome}
                    onChange={(e) => setCreateForm({ ...createForm, nome: e.target.value })}
                    placeholder="Informe o nome completo"
                  />

                  <label>Gênero</label>
                  <div className="custom-select-wrapper">
                    <select
                      className="custom-select"
                      value={createForm.genero}
                      onChange={(e) => setCreateForm({ ...createForm, genero: e.target.value })}
                    >
                      <option value="" disabled hidden>Selecione</option>
                      {GENERO_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                    <span className="custom-arrow" aria-hidden="true"></span>
                  </div>

                  <label>Email</label>
                  <input
                    required
                    type="email"
                    value={createForm.email}
                    onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })}
                    placeholder="E-mail para contato"
                  />

                  <label>CPF</label>
                  <input
                    type="text"
                    value={createForm.cpf}
                    onChange={handleCPFChangeCreate}
                    maxLength={14}
                    placeholder="Digite o CPF"
                  />

                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setShowCreate(false)}>Cancelar</button>
                    <button
                      type="button"
                      className="btn-confirm"
                      onClick={() => {
                        if (createForm.nome && createForm.genero && createForm.email && createForm.cpf) setStepCreate(2);
                        else alert("Preencha todos os campos antes de prosseguir");
                      }}
                    >
                      Próximo
                    </button>
                  </div>
                </>
              )}

              {stepCreate === 2 && (
                <>
                  <label>Tipo</label>
                  <div className="custom-select-wrapper">
                    <select
                      className="custom-select"
                      value={createForm.tipo}
                      onChange={(e) => setCreateForm({ ...createForm, tipo: e.target.value })}
                    >
                      <option value="" disabled hidden>Selecione</option>
                      {TIPO_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                    <span className="custom-arrow" aria-hidden="true"></span>
                  </div>

                  {createForm.tipo === "Aluno" && (
                    <>
                      <label>Modalidade</label>
                      <div className="custom-select-wrapper">
                        <select
                          className="custom-select"
                          value={createForm.modalidade}
                          onChange={(e) => setCreateForm({ ...createForm, modalidade: e.target.value })}
                        >
                          <option value="" disabled hidden>Selecione</option>
                          {MODALIDADE_OPTIONS.filter(m => m).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      <label>Plano</label>
                      <div className="custom-select-wrapper">
                        <select
                          className="custom-select"
                          value={createForm.plano}
                          onChange={(e) => setCreateForm({ ...createForm, plano: e.target.value })}
                        >
                          <option value="" disabled hidden>Selecione</option>
                          {PLANO_OPTIONS.filter(p => p).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {createForm.tipo === "Personal Trainer" && (
                    <>
                      <label>Modalidade</label>
                      <div className="custom-select-wrapper">
                        <select
                          className="custom-select"
                          value={createForm.modalidade}
                          onChange={(e) => setCreateForm({ ...createForm, modalidade: e.target.value })}
                        >
                          <option value="" disabled hidden>Selecione</option>
                          {MODALIDADE_OPTIONS.filter(m => m).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setStepCreate(1)}>Anterior</button>
                    <button
                      type="submit"
                      className="btn-confirm"
                      disabled={
                        !createForm.tipo ||
                        (createForm.tipo === "Aluno" && (!createForm.modalidade || !createForm.plano)) ||
                        (createForm.tipo === "Personal Trainer" && !createForm.modalidade)
                      }
                    >
                      Criar
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* ---------------------- MODAL EDITAR ---------------------- */}
      {showEdit && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Editar Usuário</h3>
            <form onSubmit={submitEdit} className="create-form">
              {stepEdit === 1 && (
                <>
                  <label>Nome</label>
                  <input required value={editForm.nome} onChange={(e) => setEditForm({ ...editForm, nome: e.target.value })} />

                  <label>Gênero</label>
                  <div className="custom-select-wrapper">
                    <select className="custom-select" value={editForm.genero} onChange={(e) => setEditForm({ ...editForm, genero: e.target.value })}>
                      <option value="" disabled hidden>Selecione</option>
                      {GENERO_OPTIONS.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                  </div>

                  <label>Email</label>
                  <input required type="email" value={editForm.email} onChange={(e) => setEditForm({ ...editForm, email: e.target.value })} />

                  <label>CPF</label>
                  <input type="text" value={editForm.cpf} onChange={handleCPFChangeEdit} maxLength={14} placeholder="000.000.000-00" />

                  <div className="modal-actions">
                    <button type="button" className="btn-confirm" onClick={() => { if(editForm.nome && editForm.genero && editForm.email && editForm.cpf) setStepEdit(2); else alert("Preencha todos os campos antes de prosseguir"); }}>Próximo</button>
                    <button type="button" className="btn-cancel" onClick={() => setShowEdit(false)}>Cancelar</button>
                  </div>
                </>
              )}

              {stepEdit === 2 && (
                <>
                  <label>Tipo</label>
                  <div className="custom-select-wrapper">
                    <select className="custom-select" value={editForm.tipo} onChange={(e) => setEditForm({ ...editForm, tipo: e.target.value })}>
                      <option value="" disabled hidden>Selecione</option>
                      {TIPO_OPTIONS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  {editForm.tipo === "Aluno" && (
                    <>
                      <label>Modalidade</label>
                      <div className="custom-select-wrapper">
                        <select className="custom-select" value={editForm.modalidade} onChange={(e) => setEditForm({ ...editForm, modalidade: e.target.value })}>
                          <option value="" disabled hidden>Selecione</option>
                          {MODALIDADE_OPTIONS.filter(m => m).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>

                      <label>Plano</label>
                      <div className="custom-select-wrapper">
                        <select className="custom-select" value={editForm.plano} onChange={(e) => setEditForm({ ...editForm, plano: e.target.value })}>
                          <option value="" disabled hidden>Selecione</option>
                          {PLANO_OPTIONS.filter(p => p).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  {editForm.tipo === "Personal Trainer" && (
                    <>
                      <label>Modalidade</label>
                      <div className="custom-select-wrapper">
                        <select className="custom-select" value={editForm.modalidade} onChange={(e) => setEditForm({ ...editForm, modalidade: e.target.value })}>
                          <option value="" disabled hidden>Selecione</option>
                          {MODALIDADE_OPTIONS.filter(m => m).map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                    </>
                  )}

                  <div className="modal-actions">
                    <button type="button" className="btn-cancel" onClick={() => setStepEdit(1)}>Anterior</button>
                    <button type="submit" className="btn-confirm" disabled={!editForm.tipo || (editForm.tipo === "Aluno" && (!editForm.modalidade || !editForm.plano)) || (editForm.tipo === "Personal Trainer" && !editForm.modalidade)}>Salvar</button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
