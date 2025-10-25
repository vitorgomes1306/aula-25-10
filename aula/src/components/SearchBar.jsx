import React, { useRef, useEffect } from "react"

export default function SearchBar({ value, onChange, onClear, placeholder = "Buscar..." }) {
    const inputRef = useRef(null)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])

    const handleClear = () => {
        if (onClear) {
            onClear()
        }
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    return (
        <div className="search-bar">
            <input
                className="search-input"
                ref={inputRef}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="search-buttons">
                <button onClick={() => inputRef.current?.focus()}>Focar</button>
                <button onClick={handleClear}>Limpar</button>
            </div>
        </div>
    )
}