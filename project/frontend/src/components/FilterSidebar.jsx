import { useState } from "react";
import { SlidersHorizontal, ChevronDown, X } from "lucide-react";

export const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "popular",    label: "Most Popular" },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
];

// ── Collapsible section ──────────────────────────────────────────────────────
const Section = ({ title, children }) => {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-gray-100 pb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between py-1 font-black text-sm uppercase tracking-wider"
      >
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
};

// ── Price range slider ───────────────────────────────────────────────────────
const PriceRange = ({ min, max, value, onChange }) => {
  const [lo, hi] = value;
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-bold text-gray-500">
        <span>${lo}</span>
        <span>${hi}</span>
      </div>
      {/* dual-thumb via two overlapping range inputs */}
      <div className="relative h-1 bg-gray-200 rounded-full">
        <div
          className="absolute h-1 bg-black rounded-full"
          style={{ left: `${((lo - min) / (max - min)) * 100}%`, right: `${100 - ((hi - min) / (max - min)) * 100}%` }}
        />
        <input
          type="range" min={min} max={max} value={lo}
          onChange={(e) => { const v = Math.min(Number(e.target.value), hi - 1); onChange([v, hi]); }}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
          style={{ zIndex: lo > max - 10 ? 5 : 3 }}
        />
        <input
          type="range" min={min} max={max} value={hi}
          onChange={(e) => { const v = Math.max(Number(e.target.value), lo + 1); onChange([lo, v]); }}
          className="absolute w-full h-1 opacity-0 cursor-pointer"
          style={{ zIndex: 4 }}
        />
      </div>
    </div>
  );
};

// ── Star rating filter ───────────────────────────────────────────────────────
const RatingFilter = ({ value, onChange }) => (
  <div className="space-y-2">
    {[4, 3, 2, 1].map((r) => (
      <button
        key={r}
        onClick={() => onChange(value === r ? null : r)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold transition-colors
          ${value === r ? "bg-black text-white" : "hover:bg-gray-100"}`}
      >
        <span className="flex text-amber-400">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-3 h-3" fill={i < r ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          ))}
        </span>
        <span>{r}+ stars</span>
      </button>
    ))}
  </div>
);

// ── Main FilterSidebar ───────────────────────────────────────────────────────
const FilterSidebar = ({ categories, filters, onChange, onReset }) => {
  const { category, priceRange, minRating, sort } = filters;
  const hasActive = category !== "all" || priceRange[0] > 0 || priceRange[1] < 1000 || minRating || sort !== "newest";

  return (
    <aside className="w-full space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-black text-base uppercase tracking-wider">
          <SlidersHorizontal size={18} />
          Filters
        </div>
        {hasActive && (
          <button onClick={onReset} className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-colors">
            <X size={12} /> Reset
          </button>
        )}
      </div>

      {/* Sort */}
      <Section title="Sort By">
        <div className="space-y-1">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onChange({ sort: opt.value })}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold transition-colors
                ${sort === opt.value ? "bg-black text-white" : "hover:bg-gray-100"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </Section>

      {/* Category */}
      <Section title="Category">
        <div className="space-y-1">
          {["all", ...categories].map((cat) => (
            <button
              key={cat}
              onClick={() => onChange({ category: cat })}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm font-bold capitalize transition-colors
                ${category === cat ? "bg-black text-white" : "hover:bg-gray-100"}`}
            >
              {cat === "all" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </Section>

      {/* Price */}
      <Section title="Price Range">
        <PriceRange min={0} max={1000} value={priceRange} onChange={(v) => onChange({ priceRange: v })} />
      </Section>

      {/* Rating */}
      <Section title="Min Rating">
        <RatingFilter value={minRating} onChange={(v) => onChange({ minRating: v })} />
      </Section>
    </aside>
  );
};

export default FilterSidebar;
