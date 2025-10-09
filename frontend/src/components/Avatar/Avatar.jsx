// src/components/Avatar/Avatar.jsx
import React, { useState } from "react";
import "./Avatar.css";

/**
 * Avatar
 * - user: objeto de usuário (pode conter avatarUrl, nome, etc)
 * - size: número (px)
 * - className: classes extras
 */
export default function Avatar({ user = {}, size = 44, className = "", alt = "Avatar" }) {
  const [imgError, setImgError] = useState(false);

  // normaliza dados
  const nome = (user?.nome || user?.name || "").toString();
  const inicial = nome ? nome.charAt(0).toUpperCase() : "U";

  // avatarUrl pode ser uma URL absoluta, relative (/uploads/...), ou vazio
  let avatarUrl = user?.avatarUrl ?? user?.avatar ?? "";
  if (typeof avatarUrl !== "string") avatarUrl = "";

  // se for caminho relativo do backend (/uploads/xx) converte para absoluto
  if (avatarUrl && avatarUrl.startsWith("/uploads")) {
    // ajustar se seu backend usa outra base
    avatarUrl = `${window.location.protocol}//${window.location.hostname}${window.location.port ? ":"+window.location.port : ""}${avatarUrl}`;
  }

  const showLetter = !avatarUrl || imgError;

  const sizeStyle = {
    width: size,
    height: size,
    lineHeight: `${size}px`,
    fontSize: Math.max(12, Math.floor(size * 0.45)),
  };

  return (
    <div
      className={`avatar-component ${className} ${showLetter ? "avatar-letter" : "avatar-img-wrap"}`}
      style={sizeStyle}
      aria-hidden={false}
      title={nome || alt}
    >
      {showLetter ? (
        <div className="avatar-letter-inner">{inicial}</div>
      ) : (
        <img
          src={avatarUrl}
          alt={alt}
          className="avatar-img"
          onError={() => setImgError(true)}
          draggable={false}
        />
      )}
    </div>
  );
}
