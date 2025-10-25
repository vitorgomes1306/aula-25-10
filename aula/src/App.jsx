// App.jsx

import React, { useState, useMemo, useRef, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ProductList from "./components/ProductList"
import { products as allProducts } from "./data/products";

export default function App() {
  // UI state
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [highlightId, setHighlightId] = useState(null);

  // refs
  const searchInputRef = useRef(null); // referência ao input (poderíamos usar forwarding; mantemos local)
  const debounceRef = useRef(null); // guarda timeout id para debounce
  const lastQueryRef = useRef(""); // guarda a última query aplicada (mutável sem re-render)
  const renderCountRef = useRef(0); // contador de renders
  renderCountRef.current += 1;

  // Simula carregar produtos -> poderia ser fetch em useEffect
  const products = allProducts;

  // Debounced change handler usando useRef para timer
  function handleQueryChange(value) {
    // atualizamos estado de input imediatamente para UX reativo
    setQuery(value);

    // limpa debounce anterior
    if (debounceRef.current) clearTimeout(debounceRef.current);

    // cria novo debounce: só aplicaremos "lastQueryRef" após 300ms
    debounceRef.current = setTimeout(() => {
      lastQueryRef.current = value.trim().toLowerCase();
      // opcional: acionar highlight no primeiro item que bate com query
      if (value.trim().length > 0) {
        // busca id do primeiro item que bate (usando o filtro "manual" rápido)
        const found = products.find((p) =>
          p.name.toLowerCase().includes(value.trim().toLowerCase())
        );
        setHighlightId(found ? found.id : null);
      } else {
        setHighlightId(null);
      }
    }, 300);
  }

  function clearSearch() {
    setQuery("");
    lastQueryRef.current = "";
    setHighlightId(null);
  }

  // useMemo: filtro/ordenacao pesada — só re-executa se dependências mudarem
  // Dependências: produtos originais, lastQueryRef.current (não é dependência reativa) — 
  // então usamos "query" trimmed as dependency to trigger recalculation.
  const filtered = useMemo(() => {
    // Observação: usamos queryTrim para dependência clara
    const queryTrim = lastQueryRef.current || "";

    // Simular custo custoso (por ex: muitos cálculos, fetch, etc.)
    // Não colocamos "heavy" cost artificial, mas mostro que isso pode ser caro.
    let list = products;

    if (categoryFilter !== "Todos") {
      list = list.filter((p) => p.category === categoryFilter);
    }

    if (lowStockOnly) {
      list = list.filter((p) => p.stock <= 10); // items com estoque baixo
    }

    if (queryTrim.length > 0) {
      const q = queryTrim;
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
    }

    // Ordena por soldLastMonth desc para mostrar mais vendidos primeiro
    list = list.slice().sort((a, b) => b.soldLastMonth - a.soldLastMonth);

    return list;
    // NOTA: Dependências: products, categoryFilter, lowStockOnly, query.
  }, [products, categoryFilter, lowStockOnly, query]);

  // useMemo para cálculos agregados (valor total em estoque)
  const aggregates = useMemo(() => {
    // custo: soma de price * stock para centenas de itens
    const totalValue = filtered.reduce((sum, p) => sum + p.price * p.stock, 0);
    const totalItems = filtered.length;
    const lowStockCount = filtered.filter((p) => p.stock <= 10).length;
    // top 5 vendidos
    const top5 = filtered.slice(0, 5).map((p) => ({ id: p.id, name: p.name, sold: p.soldLastMonth }));
    return { totalValue, totalItems, lowStockCount, top5 };
  }, [filtered]);

  // foco automático no input ao montar
  useEffect(() => {
    // tentamos focar no input via DOM query (SearchBar tem seu próprio ref; aqui apenas demonstração)
    const el = document.querySelector(".search-input");
    if (el) el.focus();
  }, []);

  return (
    <div className="app">
      <header>
        <h1>☕ Coffee Inventory Dashboard</h1>
        <p className="subtitle">Busca inteligente com useMemo e manipulação DOM com useRef</p>
      </header>

      <section className="controls">
        <SearchBar value={query} onChange={handleQueryChange} onClear={clearSearch} placeholder="Procure por nome ou SKU..." />

        <div className="filters">
          <label>
            Categoria:
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option>Todos</option>
              <option>Grãos</option>
              <option>Máquinas</option>
              <option>Xícaras</option>
              <option>Insumos</option>
              <option>Bebidas</option>
            </select>
          </label>

          <label>
            <input type="checkbox" checked={lowStockOnly} onChange={(e) => setLowStockOnly(e.target.checked)} />
            Somente estoque baixo (≤ 10)
          </label>

          <button onClick={() => { setCategoryFilter("Todos"); setLowStockOnly(false); }}>Reset filtros</button>
        </div>
      </section>

      <section className="metrics">
        <div className="metric">
          <div className="label">Itens exibidos</div>
          <div className="value">{aggregates.totalItems}</div>
        </div>
        <div className="metric">
          <div className="label">Valor total em estoque</div>
          <div className="value">R$ {aggregates.totalValue.toFixed(2)}</div>
        </div>
        <div className="metric">
          <div className="label">Itens com baixo estoque</div>
          <div className="value">{aggregates.lowStockCount}</div>
        </div>
        <div className="metric">
          <div className="label">Contagem de renders (não provoca re-render)</div>
          <div className="value">{renderCountRef.current}</div>
        </div>
      </section>

      <section className="top5">
        <h3>Top vendidos (visual)</h3>
        <ol>
          {aggregates.top5.map((t) => <li key={t.id}>{t.name} — {t.sold} vendidos</li>)}
        </ol>
      </section>

      <main>
        <ProductList items={filtered} highlightId={highlightId} />
      </main>

      <footer>
        <small>Demo — useRef & useMemo — Experimente digitar e mudar filtros</small>
      </footer>
    </div>
  )
}