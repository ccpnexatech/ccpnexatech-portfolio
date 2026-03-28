'use client'

import { useState } from 'react'

/* ── Dados ─────────────────────────────────────────────────────────────────── */
type Category = 'Todos' | 'Vestidos' | 'Blusas' | 'Acessórios' | 'Calçados'

interface Product {
  id:       number
  name:     string
  price:    number
  oldPrice?: number
  category: Exclude<Category, 'Todos'>
  badge?:   string
  color:    string
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Vestido Midi Elegance',  price: 349, oldPrice: 499, category: 'Vestidos',    badge: 'Sale',   color: '#C4A882' },
  { id: 2, name: 'Blusa Seda Premium',     price: 189,               category: 'Blusas',                       color: '#B8C4D4' },
  { id: 3, name: 'Colar Dourado Fino',     price: 129, oldPrice: 179, category: 'Acessórios',  badge: '-28%',   color: '#D4B26A' },
  { id: 4, name: 'Scarpin Classic Nude',   price: 279,               category: 'Calçados',                     color: '#D4B99A' },
  { id: 5, name: 'Vestido Linho Branco',   price: 319,               category: 'Vestidos',     badge: 'Novo',   color: '#E8E4DC' },
  { id: 6, name: 'Blusa Cropped Floral',   price: 149,               category: 'Blusas',                       color: '#D4C4B4' },
  { id: 7, name: 'Bolsa Couro Caramelo',   price: 489, oldPrice: 649, category: 'Acessórios',  badge: '-25%',   color: '#C49A6C' },
  { id: 8, name: 'Sandália Tiras Dourado', price: 229,               category: 'Calçados',     badge: 'Novo',   color: '#C4A86A' },
]

const CATEGORIES: Category[] = ['Todos', 'Vestidos', 'Blusas', 'Acessórios', 'Calçados']

/* ── Componente ────────────────────────────────────────────────────────────── */
export default function Ecommerce() {
  const [activeCategory, setActiveCategory] = useState<Category>('Todos')
  const [cart, setCart] = useState<number[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = PRODUCTS.filter((p) => {
    const matchCat  = activeCategory === 'Todos' || p.category === activeCategory
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const cartItems = cart.map((id) => PRODUCTS.find((p) => p.id === id)!)
  const total = cartItems.reduce((sum, p) => sum + (p?.price ?? 0), 0)

  const addToCart = (id: number) => {
    setCart((prev) => [...prev, id])
  }

  return (
    <div className="bg-[#FAF8F5] min-h-screen font-inter" style={{ color: '#2A1F1A' }}>

      {/* ── Topbar ───────────────────────────────────────────────────────── */}
      <div className="bg-[#2A1F1A] text-white text-center text-[12px] py-2 px-4">
        ✨ Frete grátis acima de R$ 299 · Troca gratuita em 30 dias
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <nav className="bg-white border-b border-[#E8E0D8] sticky top-0 z-30">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <span className="font-syne font-[700] text-[1.2rem] tracking-[0.06em] text-[#2A1F1A]">
            ÁUREA
          </span>

          {/* Search */}
          <div className="hidden md:flex flex-1 max-w-[400px] relative">
            <input
              type="search"
              placeholder="Buscar produtos..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#FAF8F5] border border-[#E8E0D8] text-[13px] px-4 py-2 rounded-full focus:outline-none focus:border-[#C4A882] transition-colors pl-10"
            />
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A8A7A]" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2"
              aria-label={`Carrinho com ${cart.length} itens`}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2A1F1A" strokeWidth="1.8" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C4A882] text-white text-[10px] font-[700] rounded-full flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero banner ──────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #2A1F1A 0%, #4A3528 100%)', minHeight: 360 }}
      >
        <div className="max-w-[1200px] mx-auto px-6 py-20 relative z-10">
          <span className="inline-block text-[#C4A882] text-[12px] font-[500] tracking-[0.16em] uppercase mb-4">
            Nova coleção 2025
          </span>
          <h1 className="font-syne text-[clamp(2.2rem,5vw,3.8rem)] font-[700] text-white leading-[1.1] mb-5 max-w-[500px]">
            Elegância que não pede licença.
          </h1>
          <p className="text-[rgba(255,255,255,0.65)] text-[16px] max-w-[400px] mb-8 leading-relaxed">
            Peças atemporais para mulheres que sabem o que querem.
            Qualidade premium, estilo inconfundível.
          </p>
          <button
            onClick={() => setActiveCategory('Todos')}
            className="inline-flex items-center gap-2 bg-[#C4A882] text-[#2A1F1A] text-[14px] font-[600] px-7 py-3.5 rounded-full hover:bg-[#D4B892] transition-colors"
          >
            Ver coleção →
          </button>
        </div>

        {/* Decoração */}
        <div
          aria-hidden="true"
          className="absolute right-0 top-0 w-[400px] h-full opacity-20"
          style={{ background: 'radial-gradient(circle at 80% 50%, #C4A882 0%, transparent 70%)' }}
        />
      </section>

      {/* ── Categorias + produtos ─────────────────────────────────────────── */}
      <section className="max-w-[1200px] mx-auto px-6 py-16">

        {/* Filtros */}
        <div className="flex flex-wrap gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="text-[13px] font-[500] px-5 py-2 rounded-full border transition-all"
              style={{
                background:   activeCategory === cat ? '#2A1F1A' : 'transparent',
                color:        activeCategory === cat ? '#FAF8F5' : '#2A1F1A',
                borderColor:  activeCategory === cat ? '#2A1F1A' : '#D4C8BC',
              }}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto text-[13px] self-center" style={{ color: '#9A8A7A' }}>
            {filtered.length} produto{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} onAdd={addToCart} inCart={cart.includes(product.id)} />
          ))}
          {filtered.length === 0 && (
            <p className="col-span-full text-center py-16 text-[#9A8A7A] text-[15px]">
              Nenhum produto encontrado para "{search}".
            </p>
          )}
        </div>
      </section>

      {/* ── Diferenciais ─────────────────────────────────────────────────── */}
      <section className="bg-white py-14 px-6">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🚚', title: 'Frete grátis',   desc: 'Em compras acima de R$ 299' },
            { icon: '🔄', title: 'Troca fácil',    desc: 'Até 30 dias após o recebimento' },
            { icon: '🔒', title: 'Pagamento seguro', desc: 'SSL e antifraude ativo' },
            { icon: '💳', title: 'Parcelamento',   desc: 'Em até 10x sem juros' },
          ].map((d) => (
            <div key={d.title} className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">{d.icon}</span>
              <div>
                <p className="text-[14px] font-[600] mb-0.5" style={{ color: '#2A1F1A' }}>{d.title}</p>
                <p className="text-[12px]" style={{ color: '#9A8A7A' }}>{d.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-[#2A1F1A] text-[rgba(255,255,255,0.60)] py-10 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row justify-between gap-4">
          <div>
            <p className="font-syne font-[700] text-white text-[16px] tracking-[0.06em] mb-1">ÁUREA</p>
            <p className="text-[12px]">Moda feminina com elegância e propósito.</p>
          </div>
          <p className="text-[12px] self-end">
            Template por{' '}
            <a href="/" className="text-[#C4A882] hover:underline">CCP NEXATECH</a>
          </p>
        </div>
      </footer>

      {/* ── Drawer Carrinho ──────────────────────────────────────────────── */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-[rgba(0,0,0,0.40)]"
            onClick={() => setCartOpen(false)}
          />
          {/* Drawer */}
          <div className="w-[360px] max-w-[90vw] bg-white h-full flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E0D8]">
              <h2 className="font-syne font-[700] text-[16px]" style={{ color: '#2A1F1A' }}>
                Carrinho ({cart.length})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-1"
                aria-label="Fechar carrinho"
                style={{ color: '#9A8A7A' }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-4">
              {cartItems.length === 0 ? (
                <p className="text-center py-12 text-[14px]" style={{ color: '#9A8A7A' }}>
                  Seu carrinho está vazio.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {cartItems.map((item, idx) => item && (
                    <div key={idx} className="flex items-center gap-4">
                      <div
                        className="w-14 h-14 rounded-[8px] flex-shrink-0"
                        style={{ background: item.color }}
                      />
                      <div className="flex-1">
                        <p className="text-[13px] font-[500]" style={{ color: '#2A1F1A' }}>{item.name}</p>
                        <p className="text-[14px] font-[700]" style={{ color: '#C4A882' }}>
                          R$ {item.price.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <button
                        onClick={() => setCart((prev) => { const i = prev.findIndex((id) => id === item.id); return [...prev.slice(0, i), ...prev.slice(i + 1)] })}
                        className="text-[#9A8A7A] hover:text-[#2A1F1A] transition-colors text-[18px] leading-none"
                        aria-label="Remover"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-5 border-t border-[#E8E0D8]">
              <div className="flex justify-between text-[14px] mb-4">
                <span style={{ color: '#9A8A7A' }}>Total</span>
                <span className="font-[700]" style={{ color: '#2A1F1A' }}>
                  R$ {total.toFixed(2).replace('.', ',')}
                </span>
              </div>
              <button
                className="w-full text-white text-[14px] font-[600] py-3.5 rounded-full"
                style={{ background: '#2A1F1A' }}
              >
                Finalizar compra →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── ProductCard ───────────────────────────────────────────────────────────── */
function ProductCard({
  product,
  onAdd,
  inCart,
}: {
  product: Product
  onAdd:   (id: number) => void
  inCart:  boolean
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Imagem / placeholder colorido */}
      <div
        className="relative rounded-[12px] overflow-hidden mb-3 aspect-[3/4]"
        style={{ background: product.color }}
      >
        {product.badge && (
          <span className="absolute top-2.5 left-2.5 bg-[#2A1F1A] text-white text-[10px] font-[700] px-2 py-[3px] rounded-full">
            {product.badge}
          </span>
        )}
        {/* Overlay com botão */}
        <div
          className="absolute inset-0 flex items-end justify-center pb-4 transition-all"
          style={{ opacity: hovered ? 1 : 0, background: 'rgba(42,31,26,0.15)' }}
        >
          <button
            onClick={() => !inCart && onAdd(product.id)}
            className="text-white text-[12px] font-[600] px-5 py-2 rounded-full transition-colors"
            style={{ background: inCart ? '#888' : '#2A1F1A' }}
          >
            {inCart ? 'Adicionado ✓' : 'Adicionar ao carrinho'}
          </button>
        </div>
      </div>

      {/* Info */}
      <p className="text-[14px] font-[500] mb-1" style={{ color: '#2A1F1A' }}>{product.name}</p>
      <div className="flex items-center gap-2">
        <span className="text-[15px] font-[700]" style={{ color: '#C4A882' }}>
          R$ {product.price.toFixed(2).replace('.', ',')}
        </span>
        {product.oldPrice && (
          <span className="text-[12px] line-through" style={{ color: '#9A8A7A' }}>
            R$ {product.oldPrice.toFixed(2).replace('.', ',')}
          </span>
        )}
      </div>
    </div>
  )
}