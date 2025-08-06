import React from "react";

function SearchInput({ placeholder = "Buscar...", value, onChange }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="search-input"
    />
  );
}

export default SearchInput;
