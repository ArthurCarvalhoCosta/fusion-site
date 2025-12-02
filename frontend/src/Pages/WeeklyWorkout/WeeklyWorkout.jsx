import React, { useState, useEffect } from "react";
import { Header } from "@/components/Header/Header.jsx";
import { Footer } from "@/components/Footer/Footer.jsx";
import trainingBanner from "@/assets/img/bannerTraining.png";
import "./WeeklyWorkout.css";

const API_BASE = import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL_DEV;

// Limites por plano
const PLAN_LIMITS = {
  "Mensal - 2x": 2,
  "Mensal - 3x": 3,
  "Mensal - 6x": 6,
  "Trimestral - 3x": 3,
  "Trimestral - 6x": 6,
  "Semestral - 3x": 3,
  "Semestral - 6x": 6
};

export default function WeeklyWorkout() {
  const [showCheckin, setShowCheckin] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [checkinsSaved, setCheckinsSaved] = useState([]);
  const [visible, setVisible] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  const userType = (storedUser.tipo || "").toLowerCase();
  const userModality = (storedUser.modalidade || "").toLowerCase();
  const userPlan = storedUser.plano || "";
  const planLimit = PLAN_LIMITS[userPlan] || 3;

  const DAYS = [
    { label: "Segunda-Feira", key: "segunda" },
    { label: "Terça-Feira", key: "terca" },
    { label: "Quarta-Feira", key: "quarta" },
    { label: "Quinta-Feira", key: "quinta" },
    { label: "Sexta-Feira", key: "sexta" },
    { label: "Sábado", key: "sabado" }
  ];

  useEffect(() => {
    async function fetchWeeks() {
      try {
        const res = await fetch(`${API_BASE}/api/treinos`);
        const data = await res.json();
        const all = Array.isArray(data.treinos) ? data.treinos : Array.isArray(data) ? data : [];
        const sorted = [...all].sort((a, b) => new Date(a.inicio) - new Date(b.inicio));

        let filtered = [];
        if (userType === "admin") filtered = sorted;
        else filtered = sorted.filter(w => String(w.modalidade || "").toLowerCase() === userModality);

        setWeeks(filtered);
        const idx = findCurrentWeekIndex(filtered);
        setCurrentIndex(idx >= 0 ? idx : 0);
      } catch (err) {
        console.error("Erro ao carregar treinos:", err);
        setWeeks([]);
      }
    }
    fetchWeeks();
  }, [userType, userModality]);

  useEffect(() => {
    const week = weeks[currentIndex];
    if (!week) {
      setCheckinsSaved([]);
      return;
    }

    async function fetchCheckins() {
      try {
        const res = await fetch(`${API_BASE}/api/checkins/${week._id || week.id}`);
        const data = await res.json();
        if (data.success && Array.isArray(data.checkins)) {
          setCheckinsSaved(data.checkins.map(c => ({ dia: c.dia })));
        } else {
          setCheckinsSaved([]);
        }
      } catch {
        setCheckinsSaved([]);
      }
      setSelectedDays([]);
      setVisible(false);
      const t = setTimeout(() => setVisible(true), 60);
      return () => clearTimeout(t);
    }

    fetchCheckins();
  }, [currentIndex, weeks]);

  function findCurrentWeekIndex(list) {
    if (!list || !list.length) return -1;
    const today = new Date();
    const exact = list.findIndex(w => {
      try {
        const s = new Date(w.inicio);
        const e = new Date(w.fim);
        return s <= today && today <= e;
      } catch { return false; }
    });
    if (exact >= 0) return exact;
    const nextIdx = list.findIndex(w => new Date(w.inicio) >= today);
    return nextIdx >= 0 ? nextIdx : list.length - 1;
  }

  const openCheckin = () => setShowCheckin(true);
  const closeCheckin = () => { setShowCheckin(false); setSelectedDays([]); };

  const toggleDay = (dayLabel) => {
    const totalCheckins = checkinsSaved.length + selectedDays.length;
    if (selectedDays.includes(dayLabel)) setSelectedDays(selectedDays.filter(d => d !== dayLabel));
    else if (totalCheckins < planLimit) setSelectedDays([...selectedDays, dayLabel]);
    else alert(`Você já atingiu o limite de ${planLimit} check-ins para essa semana.`);
  };

  const confirmCheckin = async () => {
    const week = weeks[currentIndex];
    if (!week) return;
    if (!selectedDays.length) return;

    try {
      for (const dia of selectedDays) {
        await fetch(`${API_BASE}/api/checkins`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            treinoId: week._id || week.id,
            userId: storedUser.id,
            userName: storedUser.nome,
            dia
          })
        });
      }

      const res = await fetch(`${API_BASE}/api/checkins/${week._id || week.id}`);
      const data = await res.json();
      if (data.success && Array.isArray(data.checkins)) {
        setCheckinsSaved(data.checkins.map(c => ({ dia: c.dia })));
      }

      setSelectedDays([]);
      closeCheckin();
    } catch (err) {
      console.error("Erro ao registrar check-in:", err);
      alert("Erro ao registrar check-in. Tente novamente.");
    }
  };

  const prevWeek = () => { if (currentIndex > 0) setCurrentIndex(currentIndex - 1); };
  const nextWeek = () => { if (currentIndex < weeks.length - 1) setCurrentIndex(currentIndex + 1); };
  const formatDate = (date) => {
    if (!date) return "";
    try { return new Date(date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }); }
    catch { return String(date); }
  };
  const currentWeek = weeks[currentIndex];
  const checkinCount = checkinsSaved.length;

  return (
    <div className="weekly-container">
      <Header />
      <main className="main-content">
        {/* HERO */}
        <section className="discipline-section" style={{ backgroundImage: `url(${trainingBanner})` }}>
          <div className="discipline-content">
            <h1>Disciplina é o caminho da vitória</h1>
            <p>Veja seus treinos atualizados semanalmente, organize sua rotina de treinos e registre seus check-ins para manter o foco nos seus resultados.</p>
            <ul>
              <li>Organização semanal de treinos</li>
              <li>Controle dos seus check-ins</li>
              <li>Acompanhamento do seu progresso</li>
            </ul>
          </div>
        </section>

        {/* CHECK-INS */}
        <section className="check-ins">
          <h2>Meus Check-ins da Semana</h2>
          <p>Você pode treinar até <b>{planLimit}x por semana</b> de acordo com o seu plano. Faça o check-in com antecedência para garantir sua vaga e organizar sua rotina de treinos.</p>

          <div className="checkins-row">
            <div className="checkins-counter">
              <strong>{checkinCount}</strong> de {planLimit} check-ins feitos
            </div>
            <button className="check-in-btn" onClick={openCheckin}>Fazer Check-in</button>
          </div>
        </section>

        <div className="section-title">
          <span className="background-number">01</span>
          <h2>
            Acompanhe seu <br />
            <span className="highlight">Treino Semanal</span>
          </h2>
        </div>

        {/* TREINO DA SEMANA */}
        <section className="workout-schedule">
          {weeks.length === 0 ? (
            <p className="no-weeks-msg">
              Nenhuma semana cadastrada {userType === "admin" ? "" : `para a modalidade ${storedUser.modalidade || "—"}`}.
            </p>
          ) : (
            currentWeek && (
              <>
                <div className="week-nav">
                  <button className={`week-arrow ${currentIndex === 0 ? "disabled" : ""}`} onClick={prevWeek} disabled={currentIndex === 0}>‹</button>
                  <div className="week-title">
                    <h3>{currentWeek.titulo} ({formatDate(currentWeek.inicio)} - {formatDate(currentWeek.fim)})</h3>
                  </div>
                  <button className={`week-arrow ${currentIndex === weeks.length - 1 ? "disabled" : ""}`} onClick={nextWeek} disabled={currentIndex === weeks.length - 1}>›</button>
                </div>

                <div className="week-body" style={{ opacity: visible ? 1 : 0, transition: "opacity 180ms ease-in-out" }}>
                  <div className="table-header">
                    <div className="table-col-header">Dia</div>
                    <div className="table-col-header">Exercício</div>
                  </div>

                  {DAYS.map(({ label, key }) => (
                    <div className="table-row" key={key}>
                      <div className="table-col">{label}</div>
                      <div className="table-col">{currentWeek[key] || "—"}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </section>
      </main>
      <Footer />

      {/* POPUP CHECK-IN */}
      {showCheckin && (
        <div className="checkin-popup-overlay" onClick={closeCheckin}>
          <div className="checkin-popup" onClick={(e) => e.stopPropagation()}>
            <h3>Escolha seus dias</h3>
            <div className="days-selection">
              {DAYS.map(({ label }) => {
                const alreadyChecked = checkinsSaved.some(c => c.dia === label);
                const disabled = !selectedDays.includes(label) && (selectedDays.length + checkinsSaved.length >= planLimit);
                return (
                  <button
                    key={label}
                    className={`day-btn ${selectedDays.includes(label) ? "selected" : ""} ${alreadyChecked ? "already" : ""}`}
                    onClick={() => toggleDay(label)}
                    disabled={disabled || alreadyChecked}
                    title={alreadyChecked ? "Já marcado" : ""}
                  >
                    {label}
                  </button>
                );
              })}
            </div>

            <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 8 }}>
              <button className="btn-cancel" onClick={closeCheckin}>Cancelar</button>
              <button className="confirm-btn" onClick={confirmCheckin} disabled={selectedDays.length === 0}>Confirmar Check-in</button>
            </div>
            <p style={{ fontSize: 12, color: "#ccc", marginTop: 12 }}>
              Você pode marcar até <b>{planLimit}</b> dias por semana.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
