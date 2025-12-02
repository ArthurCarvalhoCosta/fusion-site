import React, { useState } from "react";
import ProfileLayout from "@/components/ProfileLayout/ProfileLayout";
import CurrentUser from "@/components/CurrentUser/CurrentUser";

import AdminInfo from "./Sections/Info";
import AdminSettings from "./Sections/Settings";
import ManageUsers from "./Sections/ManageUsers";
import ManageClasses from "./Sections/ManageClasses";

export default function ProfileAdmin() {
  const [active, setActive] = useState("info");

  async function handleLogout() {
    try {
      await fetch(`${process.env.VITE_BACKEND_URL || process.env.VITE_BACKEND_URL_DEV}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.warn("Erro ao deslogar:", err);
    }

    localStorage.removeItem("user");
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");

    window.location.href = "/";
  }

  const sections = [
    { id: "info", label: "Informações" },
    { id: "settings", label: "Configurações" },
    { id: "users", label: "Gerenciar Usuários" },
    { id: "classes", label: "Gerenciar Aulas" },
  ];

  return (
    <CurrentUser>
      {({ user, loading }) => {
        if (loading) return <div>Carregando...</div>;

        return (
          <ProfileLayout
            active={active}
            setActive={setActive}
            sections={sections}
            onLogout={handleLogout}
          >
            {active === "info" && <AdminInfo user={user} />}
            {active === "settings" && <AdminSettings user={user} />}
            {active === "users" && <ManageUsers user={user} />}
            {active === "classes" && <ManageClasses user={user} />}
          </ProfileLayout>
        );
      }}
    </CurrentUser>
  );
}
