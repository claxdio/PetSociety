import React, { useState } from "react";

export default function SearchInput({ placeholder = "Buscar..." }) {
  const [value, setValue] = useState("");

  return (
    <input
      type="search"
      value={value}
      onChange={e => setValue(e.target.value)}
      placeholder={placeholder}
      className="search-input"
    />
  );
}
