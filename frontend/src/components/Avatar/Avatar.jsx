import React, { useState } from "react";
import "./Avatar.css";

export default function Avatar({ user, size = 100 }) {
  const nome = user?.nome || user?.name || "";
  const firstLetter = nome ? nome.charAt(0).toUpperCase() : "?";

  // garante que avatarUrl só seja considerado válido se não for vazio
  let initialSrc = user?.avatarUrl || user?.avatar || null;
  if (initialSrc && initialSrc.startsWith("/uploads")) {
    initialSrc = `${import.meta.env.VITE_BACKEND_URL || import.meta.env.VITE_BACKEND_URL_DEV}${initialSrc}`;
  }

  // estado para lidar com erro de imagem
  const [src, setSrc] = useState(initialSrc);

  return (
    <div
      className="avatar-wrapper"
      style={{
        width: size,
        height: size,
        borderRadius: 50,
      }}
    >
      {src ? (
        <img
          src={src}
          className="avatar-img"
          alt="avatar"
          onError={() => setSrc(null)}
        />
      ) : (
        <div className="avatar-fallback">
          {firstLetter}
        </div>
      )}
    </div>
  );
}
