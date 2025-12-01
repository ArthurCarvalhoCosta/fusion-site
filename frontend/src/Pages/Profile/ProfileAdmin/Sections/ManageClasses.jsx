import React, { useEffect, useMemo, useState } from "react";
import "./Sections.css";

import IconSearch from "@/assets/icons/search.svg";
import IconFilter from "@/assets/icons/filter.svg";
import IconClose from "@/assets/icons/close.svg";
import IconEdit from "@/assets/icons/edit.svg";
import IconDelete from "@/assets/icons/delete.svg";
import IconView from "@/assets/icons/olho-aberto.svg";

const API_BASE = process.env.BACKEND_URL || "http://localhost:5000";

// Normalização de treino
function normalizeClasses(t) {
  const get = (...names) => {
    for (const n of names) {
      if (!n) continue;
      if (typeof n === "function") {
        try {
          const v = n(t);
          if (v !== undefined && v !== null && String(v).trim() !== "")
            return String(v);
        } catch {}
      } else if (t[n] !== undefined && t[n] !== null && String(t[n]).trim() !== "") {
        return String(t[n]);
      }
    }
    return "";
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d)) return dateStr;
    return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}/${d.getFullYear()}`;
  };

  const id = get("_id", "id", (obj) => obj._id && obj._id.toString ? obj._id.toString() : "");
  const titulo = get("titulo", "title");
  const inicioRaw = get("inicio", "start");
  const fimRaw = get("fim", "end");
  const inicio = formatDate(inicioRaw);
  const fim = formatDate(fimRaw);
  const periodo = inicio && fim ? `${inicio} - ${fim}` : get("periodo", "period");
  const modalidade = get("modalidade", "modality");

  return {
    raw: t,
    id,
    titulo,
    inicio,
    fim,
    periodo,
    modalidade,
    segunda: t.segunda || "",
    terca: t.terca || "",
    quarta: t.quarta || "",
    quinta: t.quinta || "",
    sexta: t.sexta || "",
    sabado: t.sabado || "",
  };
}

// Opções de filtro (modalidade)
const MODALIDADE_OPTIONS = [
  "", "Jiu-Jitsu Adulto", "Jiu-Jitsu Kids", "Funcional", "Boxe",
  "Combo 1 - 2. Mod", "Combo 2 - 3. Mod", "Funcional Fight", "Funcional Step",
  "Funcional Pro", "Funcional Kids"
];

export default function ManageClassesAdmin() {
  const [treinos, setTreinos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterModalidade, setFilterModalidade] = useState(""); // admin não começa com filtro
  const [showFilters, setShowFilters] = useState(false);

  // --- Modal Criar ---
  const [showCreateWorkout, setShowCreateWorkout] = useState(false);
  const [stepCreateWorkout, setStepCreateWorkout] = useState(1);
  const [createWorkoutForm, setCreateWorkoutForm] = useState({
    titulo: "",
    inicio: "",
    fim: "",
    modalidade: "",
    segunda: "",
    terca: "",
    quarta: "",
    quinta: "",
    sexta: "",
    sabado: "",
  });

  const submitCreateWorkout = async (e) => {
    e.preventDefault();
    const { titulo, inicio, fim, modalidade } = createWorkoutForm;
    if (!titulo || !inicio || !fim || !modalidade) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/treinos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createWorkoutForm),
      });
      const data = await res.json();
      if (data.success) {
        fetchTreinos();
        setShowCreateWorkout(false);
        setStepCreateWorkout(1);
        setCreateWorkoutForm({
          titulo: "",
          inicio: "",
          fim: "",
          modalidade: "",
          segunda: "",
          terca: "",
          quarta: "",
          quinta: "",
          sexta: "",
          sabado: "",
        });
      } else {
        alert(data.message || "Erro ao criar treino");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao criar treino");
    }
  };

  // --- Modal Editar ---
  const [showEditWorkout, setShowEditWorkout] = useState(false);
  const [editWorkoutForm, setEditWorkoutForm] = useState({
    id: "",
    titulo: "",
    inicio: "",
    fim: "",
    modalidade: "",
    segunda: "",
    terca: "",
    quarta: "",
    quinta: "",
    sexta: "",
    sabado: "",
  });

  const submitEditWorkout = async (e) => {
    e.preventDefault();
    const { id, titulo, inicio, fim, modalidade } = editWorkoutForm;
    if (!id || !titulo || !inicio || !fim || !modalidade) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/api/treinos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editWorkoutForm),
      });
      const data = await res.json();
      if (data.success) {
        fetchTreinos();
        setShowEditWorkout(false);
        setEditWorkoutForm({
          id: "",
          titulo: "",
          inicio: "",
          fim: "",
          modalidade: "",
          segunda: "",
          terca: "",
          quarta: "",
          quinta: "",
          sexta: "",
          sabado: "",
        });
      } else {
        alert(data.message || "Erro ao editar treino");
      }
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao editar treino");
    }
  };

  // --- Fetch treinos ---
  useEffect(() => {
    fetchTreinos();
  }, []);

  async function fetchTreinos() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/treinos`);
      const data = await res.json();
      let arr = Array.isArray(data.treinos) ? data.treinos : Array.isArray(data) ? data : [];
      setTreinos(arr.map(normalizeClasses));
    } catch (err) {
      console.error(err);
      setTreinos([]);
    } finally {
      setLoading(false);
    }
  }

  // --- Filtro ---
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return treinos.filter((t) => {
      const matchQuery =
        !q ||
        (t.titulo && t.titulo.toLowerCase().includes(q)) ||
        (t.periodo && t.periodo.toLowerCase().includes(q)) ||
        (t.modalidade && t.modalidade.toLowerCase().includes(q));
      const matchModalidade = !filterModalidade || t.modalidade === filterModalidade;
      return matchQuery && matchModalidade;
    });
  }, [treinos, query, filterModalidade]);

  const doDelete = async (id, titulo) => {
    if (!window.confirm(`Remover semana "${titulo}"?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/treinos/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data && data.success) await fetchTreinos();
      else alert(data.message || "Erro ao deletar");
    } catch (err) {
      console.error(err);
      alert("Erro de rede ao deletar");
    }
  };

  const [stepEditWorkout, setStepEditWorkout] = useState(1);

  // --- Modal Ver Treino ---
  const [showViewWorkout, setShowViewWorkout] = useState(false);
  const [viewWorkoutData, setViewWorkoutData] = useState(null);
  const [checkinsByDay, setCheckinsByDay] = useState({});

  const DAY_MAP = {
    "segunda-feira": "segunda",
    "terça-feira": "terca",
    "quarta-feira": "quarta",
    "quinta-feira": "quinta",
    "sexta-feira": "sexta",
    "sábado": "sabado",
    "domingo": "domingo",
  };

  const fetchCheckins = async (treinoId) => {
    if (!treinoId) return;
    try {
      const res = await fetch(`${API_BASE}/api/checkins/${treinoId}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.checkins)) {
        const grouped = {};
        data.checkins.forEach((c) => {
          const diaKey = DAY_MAP[(c.dia || "").toLowerCase()];
          if (!diaKey) return;
          if (!grouped[diaKey]) grouped[diaKey] = [];
          grouped[diaKey].push(c);
        });
        setCheckinsByDay(grouped);
      } else {
        setCheckinsByDay({});
      }
    } catch (err) {
      console.error("Erro ao carregar check-ins:", err);
      setCheckinsByDay({});
    }
  };

  const openViewWorkout = (treino) => {
    setViewWorkoutData(treino);
    setShowViewWorkout(true);
    fetchCheckins(treino.id || treino._id);
  };

  return (
    <div className="users-page-wrapper">
      <h1 className="page-title">
        Gerenciar <span className="accent">Aulas</span>
      </h1>

      <div className="controls-row">
        <div className="search-box">
          <input
            className="search-input"
            placeholder="Pesquisar Treinos..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="search-icon">
            <img src={IconSearch} alt="buscar" />
          </button>
        </div>

        <div className="controls-right">
          <button
            className="filters-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <img src={showFilters ? IconClose : IconFilter} alt="Filtros" />
            <span>{showFilters ? "Fechar Filtros" : "Filtros"}</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filters-panel">
          <div className="filters-group">
            <h3>Modalidade</h3>
            <div className="pills">
              {MODALIDADE_OPTIONS.map((m) => (
                <div
                  key={m}
                  className={`pill ${filterModalidade === m ? "active" : ""}`}
                  onClick={() =>
                    setFilterModalidade(filterModalidade === m ? "" : m)
                  }
                >
                  {m || "Todas"}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Título da Semana</th>
              <th>Período</th>
              <th>Modalidade</th>
              <th style={{ textAlign: "center" }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>Carregando...</td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr key={t.id}>
                  <td className="col-name">{t.titulo}</td>
                  <td>{t.periodo}</td>
                  <td>{t.modalidade}</td>
                  <td className="actions-col" style={{ textAlign: "center" }}>
                    <button
                      className="action"
                      onClick={() => {
                        setEditWorkoutForm({ ...t });
                        setStepEditWorkout(1);
                        setShowEditWorkout(true);
                      }}
                    >
                      <img src={IconEdit} alt="editar" />
                    </button>
                    <button
                      className="action"
                      onClick={() => doDelete(t.id, t.titulo)}
                    >
                      <img src={IconDelete} alt="remover" />
                    </button>
                    <button
                      className="action"
                      onClick={() => openViewWorkout(t)}
                      style={{ filter: "invert(14%) sepia(99%) saturate(7495%) hue-rotate(356deg) brightness(95%) contrast(108%)" }}
                    >
                      <img src={IconView} alt="ver treino" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="bottom-row">
        <button
          className="new-user-btn"
          onClick={() => setShowCreateWorkout(true)}
        >
          + Novo Treino
        </button>
      </div>

      {/* Modal Visualizar Treino */}
      {showViewWorkout && viewWorkoutData && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Detalhes do Treino</h3>

            <div className="view-details">
              {["segunda", "terca", "quarta", "quinta", "sexta", "sabado"].map((dia) => {
                const aula = viewWorkoutData[dia] || "-";

                // Normalização dos dias do backend
                const DAY_MAP = {
                  "segunda-feira": "segunda",
                  "terça-feira": "terca",
                  "quarta-feira": "quarta",
                  "quinta-feira": "quinta",
                  "sexta-feira": "sexta",
                  "sábado": "sabado",
                  "domingo": "domingo",
                };

                // Filtra check-ins para esse dia
                const checkins = Object.entries(checkinsByDay)
                  .filter(([key, _]) => key === dia)
                  .flatMap(([_, arr]) => arr);

                return (
                  <div key={dia} className="day-row">
                    <p>
                      <strong>{dia.charAt(0).toUpperCase() + dia.slice(1)}:</strong> {aula}
                    </p>
                    <span>{checkins.length} check-in{checkins.length !== 1 ? "s" : ""}</span>
                  </div>
                );
              })}
            </div>

            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setShowViewWorkout(false)}>
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Criar Treino */}
      {showCreateWorkout && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Novo Treino</h3>
            <form onSubmit={submitCreateWorkout} className="create-form">
              {stepCreateWorkout === 1 && (
                <>
                  <label>Título da Semana</label>
                  <input
                    required
                    value={createWorkoutForm.titulo}
                    onChange={(e) =>
                      setCreateWorkoutForm({ ...createWorkoutForm, titulo: e.target.value })
                    }
                    placeholder="Informe o título da semana"
                  />

                    <label>Data de Início</label>
                    <div className="date-input-wrapper">
                      <input
                        required
                        type="date"
                        value={createWorkoutForm.inicio || ""}
                        onChange={(e) =>
                          setCreateWorkoutForm({ ...createWorkoutForm, inicio: e.target.value })
                        }
                      />
                      <span className="calendar-icon">📅</span>
                    </div>

                    <label>Data de Fim</label>
                    <div className="date-input-wrapper">
                      <input
                        required
                        type="date"
                        value={createWorkoutForm.fim || ""}
                        onChange={(e) =>
                          setCreateWorkoutForm({ ...createWorkoutForm, fim: e.target.value })
                        }
                      />
                      <span className="calendar-icon">📅</span>
                    </div>

                  <label>Modalidade</label>
                  <div className="custom-select-wrapper">
                    <select
                      required
                      className="custom-select"
                      value={createWorkoutForm.modalidade || ""}
                      onChange={(e) =>
                        setCreateWorkoutForm({ ...createWorkoutForm, modalidade: e.target.value })
                      }
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>
                      {MODALIDADE_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="custom-arrow"></div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowCreateWorkout(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-confirm"
                      onClick={() => {
                        if (
                          createWorkoutForm.titulo &&
                          createWorkoutForm.inicio &&
                          createWorkoutForm.fim &&
                          createWorkoutForm.modalidade
                        ) {
                          setStepCreateWorkout(2);
                        } else {
                          alert("Preencha todos os campos antes de prosseguir");
                        }
                      }}
                    >
                      Próximo
                    </button>
                  </div>
                </>
              )}

              {stepCreateWorkout === 2 && (
                <>
                  {["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"].map((dia) => (
                    <div key={dia}>
                      <label>Aula de {dia}</label>
                      <input
                        required
                        value={createWorkoutForm[dia.toLowerCase()]}
                        onChange={(e) =>
                          setCreateWorkoutForm({
                            ...createWorkoutForm,
                            [dia.toLowerCase()]: e.target.value,
                          })
                        }
                        placeholder={`Descrição da aula de ${dia}`}
                      />
                    </div>
                  ))}
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setStepCreateWorkout(1)}
                    >
                      Anterior
                    </button>
                    <button type="submit" className="btn-confirm">
                      Criar
                    </button>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Treino */}
      {showEditWorkout && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <h3>Editar Treino</h3>
            <form onSubmit={submitEditWorkout} className="create-form">
              {stepEditWorkout === 1 && (
                <>
                  <label>Título da Semana</label>
                  <input
                    required
                    value={editWorkoutForm.titulo}
                    onChange={(e) =>
                      setEditWorkoutForm({ ...editWorkoutForm, titulo: e.target.value })
                    }
                  />

                  <label>Data de Início</label>
                  <div className="date-input-wrapper">
                    <input
                      required
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      value={editWorkoutForm.inicio}
                      onChange={(e) =>
                        setEditWorkoutForm({ ...editWorkoutForm, inicio: e.target.value })
                      }
                    />
                    <span className="calendar-icon">📅</span>
                  </div>

                  <label>Data de Fim</label>
                  <div className="date-input-wrapper">
                    <input
                      required
                      type="text"
                      onFocus={(e) => (e.target.type = "date")}
                      value={editWorkoutForm.fim}
                      onChange={(e) =>
                        setEditWorkoutForm({ ...editWorkoutForm, fim: e.target.value })
                      }
                    />
                    <span className="calendar-icon">📅</span>
                  </div>

                  <label>Modalidade</label>
                  <div className="custom-select-wrapper">
                    <select
                      required
                      className="custom-select"
                      value={editWorkoutForm.modalidade || ""}
                      onChange={(e) =>
                        setEditWorkoutForm({ ...editWorkoutForm, modalidade: e.target.value })
                      }
                    >
                      <option value="" disabled hidden>
                        Selecione
                      </option>
                      {MODALIDADE_OPTIONS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                    <div className="custom-arrow"></div>
                  </div>

                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setShowEditWorkout(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="btn-confirm"
                      onClick={() => {
                        if (
                          editWorkoutForm.titulo &&
                          editWorkoutForm.inicio &&
                          editWorkoutForm.fim &&
                          editWorkoutForm.modalidade
                        ) {
                          setStepEditWorkout(2);
                        } else alert("Preencha todos os campos antes de prosseguir");
                      }}
                    >
                      Próximo
                    </button>
                  </div>
                </>
              )}

              {stepEditWorkout === 2 && (
                <>
                  {["Segunda", "Terca", "Quarta", "Quinta", "Sexta", "Sabado"].map((dia) => (
                    <div key={dia}>
                      <label>Aula de {dia}</label>
                      <input
                        required
                        value={editWorkoutForm[dia.toLowerCase()]}
                        onChange={(e) =>
                          setEditWorkoutForm({
                            ...editWorkoutForm,
                            [dia.toLowerCase()]: e.target.value,
                          })
                        }
                        placeholder={`Descrição da aula de ${dia}`}
                      />
                    </div>
                  ))}
                  <div className="modal-actions">
                    <button
                      type="button"
                      className="btn-cancel"
                      onClick={() => setStepEditWorkout(1)}
                    >
                      Anterior
                    </button>
                    <button type="submit" className="btn-confirm">
                      Salvar
                    </button>
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
