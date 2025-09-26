import { useRef } from "react";
import "./Modal.css";

export default function PinInput({ length = 6, value = "", onChange, onComplete }) {
  const inputsRef = useRef([]);

  const handleChange = (e, idx) => {
    const v = e.target.value.replace(/\D/g, "");
    if (!v) {
      // allow clearing with backspace
      const newVal = value.split("");
      newVal[idx] = "";
      onChange(newVal.join("").slice(0, length));
      return;
    }
    const char = v[0];
    const arr = value.split("");
    arr[idx] = char;
    const newValue = arr.join("").slice(0, length).padEnd(length, "");
    onChange(newValue);

    // foco
    if (idx < length - 1) inputsRef.current[idx + 1]?.focus();

    // chama onComplete se cheio
    const filled = newValue.replace(/\s/g, "");
    if (filled.length === length && typeof onComplete === "function") {
      onComplete(filled);
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      const arr = value.split("");
      arr[idx] = "";
      onChange(arr.join("").slice(0, length));
      if (idx > 0) inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const padded = paste.padEnd(length, "");
    onChange(padded);
    if (paste.length === length && typeof onComplete === "function") onComplete(paste);
  };

  return (
    <div className="pin-input-container" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => (inputsRef.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ""}
          onChange={e => handleChange(e, i)}
          onKeyDown={e => handleKeyDown(e, i)}
          aria-label={`código ${i + 1}`}
        />
      ))}
    </div>
  );
}
