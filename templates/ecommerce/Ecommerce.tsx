'use client'

import { useState, useEffect, useRef, useCallback, useReducer } from 'react'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const C = {
  ink:        '#1A1714',   // Preto grafite quente
  inkMid:     '#3D3733',
  inkLight:   '#6B6460',
  gold:       '#B8935A',   // Dourado envelhecido
  goldLight:  '#E8D5B0',
  goldPale:   '#FAF5EC',
  ivory:      '#F9F6F1',   // Marfim
  ivoryDeep:  '#F0EBE3',
  white:      '#FFFFFF',
  border:     '#E2DAD0',
  borderLight:'#EDE8E0',
  error:      '#9B2335',
  errorLt:    '#FDF0F2',
  success:    '#2D6A4F',
  successLt:  '#EBF5F0',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type Category  = 'all' | 'dresses' | 'tops' | 'accessories' | 'shoes'
type SortKey   = 'featured' | 'price-asc' | 'price-desc' | 'newest'
type DrawerView = 'cart' | 'checkout' | 'done'

interface Product {
  id: number
  name: string
  category: Exclude<Category, 'all'>
  price: number
  originalPrice?: number
  badge?: string
  isNew?: boolean
  colors: string[]
  sizes: string[]
  description: string
  material: string
  care: string
  swatchBg: string   // CSS gradient or color for the product swatch
}

interface CartItem {
  productId: number
  color: string
  size: string
  quantity: number
}

interface CheckoutForm {
  email: string
  name: string
  cpf: string
  phone: string
  cep: string
  street: string
  number: string
  complement: string
  neighborhood: string
  city: string
  state: string
  paymentMethod: 'credit' | 'pix' | 'boleto'
  cardNumber: string
  cardName: string
  cardExpiry: string
  cardCvv: string
  installments: string
  marketingConsent: boolean
  termsConsent: boolean
}

interface FormErrors {
  [key: string]: string | undefined
}

interface ToastState {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

// ─── Cart Reducer ─────────────────────────────────────────────────────────────
type CartAction =
  | { type: 'ADD'; item: CartItem }
  | { type: 'REMOVE'; productId: number; color: string; size: string }
  | { type: 'UPDATE_QTY'; productId: number; color: string; size: string; delta: number }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; items: CartItem[] }

function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case 'HYDRATE': return action.items
    case 'ADD': {
      const key = (i: CartItem) => `${i.productId}-${i.color}-${i.size}`
      const existing = state.find(i => key(i) === key(action.item))
      if (existing) return state.map(i => key(i) === key(action.item) ? { ...i, quantity: Math.min(i.quantity + 1, 10) } : i)
      return [...state, { ...action.item, quantity: 1 }]
    }
    case 'REMOVE': return state.filter(i => !(i.productId === action.productId && i.color === action.color && i.size === action.size))
    case 'UPDATE_QTY': return state.map(i => {
      if (!(i.productId === action.productId && i.color === action.color && i.size === action.size)) return i
      const next = i.quantity + action.delta
      if (next <= 0) return null as unknown as CartItem
      return { ...i, quantity: Math.min(next, 10) }
    }).filter(Boolean)
    case 'CLEAR': return []
    default: return state
  }
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const PRODUCTS: Product[] = [
  {
    id: 1, name: 'Vestido Midi Nocturne', category: 'dresses',
    price: 349, originalPrice: 498, badge: 'Sale',
    colors: ['#1A1714','#3D3030','#4A3520'],
    sizes: ['PP','P','M','G','GG'],
    description: 'Vestido midi em crepe italiano com caimento impecável. Decote V profundo com amarração nas costas. Exclusivo para mulheres que não pedem permissão.',
    material: '100% Crepe de seda italiano. Forro em viscose.',
    care: 'Lavar à mão ou lavagem delicada. Não torcer. Secar à sombra.',
    swatchBg: 'linear-gradient(135deg, #1A1714 0%, #3D3030 100%)',
  },
  {
    id: 2, name: 'Blusa Seda Off-White', category: 'tops',
    price: 189, isNew: true,
    colors: ['#F9F6F1','#E8D5B0','#D4C4B4'],
    sizes: ['PP','P','M','G'],
    description: 'Blusa fluida em seda natural com gola drapeada. Cai com leveza e luminosidade que só a seda verdadeira entrega.',
    material: '95% Seda natural, 5% Elastano. Importada.',
    care: 'Limpeza a seco recomendada.',
    swatchBg: 'linear-gradient(135deg, #F5F0E8 0%, #E8DDD0 100%)',
  },
  {
    id: 3, name: 'Colar Dourado Nó', category: 'accessories',
    price: 129, originalPrice: 179, badge: '-28%',
    colors: ['#B8935A','#C0C0C0'],
    sizes: ['Único'],
    description: 'Colar em banho de ouro 18k com pingente em formato de nó artístico. Corrente ajustável 40–45cm. Hipoalergênico.',
    material: 'Latão com banho de ouro 18k. Sem níquel.',
    care: 'Evitar contato com água, perfume e cosméticos.',
    swatchBg: 'linear-gradient(135deg, #B8935A 0%, #D4B07A 100%)',
  },
  {
    id: 4, name: 'Scarpin Nude Bico Fino', category: 'shoes',
    price: 279,
    colors: ['#D4B99A','#1A1714','#8B0000'],
    sizes: ['35','36','37','38','39','40'],
    description: 'Scarpin em couro legítimo com bico fino e salto agulha de 9cm. Palmilha acolchoada em couro natural. Elegância que não cansa.',
    material: 'Cabedal em couro bovino. Solado em borracha antiderrapante.',
    care: 'Limpar com flanela seca. Guardar em saquinho de tecido.',
    swatchBg: 'linear-gradient(135deg, #D4B99A 0%, #C4A882 100%)',
  },
  {
    id: 5, name: 'Vestido Linho Areia', category: 'dresses',
    price: 319, isNew: true,
    colors: ['#E8DDD0','#C4A882','#8B7355'],
    sizes: ['PP','P','M','G','GG'],
    description: 'Vestido midi em linho belga lavado, naturalmente texturizado. Botões de madrepérola. Para o dia que merece mais que o comum.',
    material: '100% Linho belga. Botões de madrepérola natural.',
    care: 'Lavar à mão em água fria. Passar ainda úmido.',
    swatchBg: 'linear-gradient(135deg, #E8DDD0 0%, #D4C4B4 100%)',
  },
  {
    id: 6, name: 'Bolsa Estruturada Caramelo', category: 'accessories',
    price: 489, originalPrice: 649, badge: '-25%',
    colors: ['#C49A6C','#1A1714','#8B4513'],
    sizes: ['Único'],
    description: 'Bolsa structured em couro genuíno curtido vegetalmente. Fecho dourado com logotipo em relevo. Compartimento principal + bolso interno com zíper.',
    material: 'Couro bovino curtido ao vegetal. Ferragens em latão dourado.',
    care: 'Hidratante de couro a cada 3 meses. Armazenar recheada.',
    swatchBg: 'linear-gradient(135deg, #C49A6C 0%, #B8935A 100%)',
  },
  {
    id: 7, name: 'Cropped Seda Floral', category: 'tops',
    price: 149,
    colors: ['#E8C4B8','#C4D4B8','#B8C4D4'],
    sizes: ['PP','P','M','G'],
    description: 'Cropped em seda com estampa floral exclusiva pintada à mão. Cada peça é ligeiramente única. Barra com elástico discreto.',
    material: '100% Seda. Estampa exclusiva pintada à mão.',
    care: 'Limpeza a seco. Não torcer.',
    swatchBg: 'linear-gradient(135deg, #E8C4B8 0%, #D4B8C4 100%)',
  },
  {
    id: 8, name: 'Sandália Tiras Douradas', category: 'shoes',
    price: 229, isNew: true,
    colors: ['#B8935A','#1A1714'],
    sizes: ['35','36','37','38','39','40'],
    description: 'Sandália de salto bloco 6cm com tiras ajustáveis em metálico dourado. Palmilha em couro com amortecimento discreto.',
    material: 'Cabedal em couro metálico. Salto em madeira revestida.',
    care: 'Limpar com pano levemente úmido. Não molhar o salto.',
    swatchBg: 'linear-gradient(135deg, #B8935A 0%, #C4A882 100%)',
  },
]

const COUPONS: Record<string, { discount: number; type: 'percent' | 'fixed'; label: string }> = {
  'AUREA10':    { discount: 10,   type: 'percent', label: '10% de desconto' },
  'PRIMEIRA50': { discount: 50,   type: 'fixed',   label: 'R$ 50 de desconto' },
  'VIPAUREA':   { discount: 20,   type: 'percent', label: '20% de desconto VIP' },
}

const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'all',         label: 'Tudo' },
  { id: 'dresses',     label: 'Vestidos' },
  { id: 'tops',        label: 'Blusas' },
  { id: 'accessories', label: 'Acessórios' },
  { id: 'shoes',       label: 'Calçados' },
]

const SORT_OPTIONS: { id: SortKey; label: string }[] = [
  { id: 'featured',   label: 'Destaque' },
  { id: 'price-asc',  label: 'Menor preço' },
  { id: 'price-desc', label: 'Maior preço' },
  { id: 'newest',     label: 'Novidades' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBRL(n: number) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatCPF(v: string) {
  return v.replace(/\D/g,'').slice(0,11)
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d)/,'$1.$2')
    .replace(/(\d{3})(\d{1,2})$/,'$1-$2')
}

function formatCard(v: string) {
  return v.replace(/\D/g,'').slice(0,16).replace(/(\d{4})/g,'$1 ').trim()
}

function formatExpiry(v: string) {
  return v.replace(/\D/g,'').slice(0,4).replace(/(\d{2})(\d)/,'$1/$2')
}

function formatCEP(v: string) {
  return v.replace(/\D/g,'').slice(0,8).replace(/(\d{5})(\d)/,'$1-$2')
}

function formatPhone(v: string) {
  const d = v.replace(/\D/g,'').slice(0,11)
  if (d.length <= 10) return d.replace(/(\d{2})(\d{4})(\d{0,4})/,'($1) $2-$3').trim()
  return d.replace(/(\d{2})(\d{5})(\d{0,4})/,'($1) $2-$3').trim()
}

function generateOrderNumber() {
  return `AUR-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random()*9999).toString().padStart(4,'0')}`
}

const STORAGE_KEY = 'aurea_cart_v1'

function loadCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(i => typeof i.productId === 'number' && typeof i.quantity === 'number')
  } catch { return [] }
}

function saveCart(items: CartItem[]) {
  try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) } catch {}
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useIntersection(ref: React.RefObject<Element>, threshold = 0.12) {
  const [v, setV] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect() } }, { threshold })
    obs.observe(el); return () => obs.disconnect()
  }, [threshold])
  return v
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toast({ toasts, remove }: { toasts: ToastState[]; remove: (id: number) => void }) {
  return (
    <div role="status" aria-live="polite" style={{ position:'fixed', bottom:24, right:24, zIndex:9999, display:'flex', flexDirection:'column', gap:8, pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:10, pointerEvents:'all',
          background: t.type==='success' ? C.ink : t.type==='error' ? C.error : C.ink,
          border:'1px solid rgba(255,255,255,0.12)', boxShadow:'0 8px 32px rgba(0,0,0,0.3)',
          animation:'auFlyIn 220ms ease-out', maxWidth:340,
        }}>
          <span style={{fontSize:14}}>{t.type==='success'?'✓':t.type==='error'?'!':'ℹ'}</span>
          <span style={{fontSize:13,color:'#fff',fontWeight:500,flex:1}}>{t.message}</span>
          <button onClick={()=>remove(t.id)} style={{background:'none',border:'none',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:18,lineHeight:1}} aria-label="Fechar">×</button>
        </div>
      ))}
    </div>
  )
}

function RangePriceFilter({ min, max, value, onChange }: { min: number; max: number; value: [number,number]; onChange: (v: [number,number]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pct = (v: number) => ((v - min) / (max - min)) * 100

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
        <span style={{fontSize:12,color:C.inkLight}}>{formatBRL(value[0])}</span>
        <span style={{fontSize:12,color:C.inkLight}}>{formatBRL(value[1])}</span>
      </div>
      <div ref={trackRef} style={{ position:'relative', height:4, borderRadius:2, background:C.border, marginBottom:8 }}>
        <div style={{
          position:'absolute', height:'100%', borderRadius:2, background:C.gold,
          left: `${pct(value[0])}%`, width: `${pct(value[1]) - pct(value[0])}%`,
        }} />
        {/* Min thumb */}
        <input type="range" min={min} max={max} step={50} value={value[0]}
          onChange={e => { const v = +e.target.value; if (v < value[1]) onChange([v, value[1]]) }}
          aria-label="Preço mínimo"
          style={{ position:'absolute', width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:1 }} />
        {/* Max thumb */}
        <input type="range" min={min} max={max} step={50} value={value[1]}
          onChange={e => { const v = +e.target.value; if (v > value[0]) onChange([value[0], v]) }}
          aria-label="Preço máximo"
          style={{ position:'absolute', width:'100%', height:'100%', opacity:0, cursor:'pointer', zIndex:2 }} />
        {/* Thumbs visual */}
        {[value[0], value[1]].map((v, i) => (
          <div key={i} style={{
            position:'absolute', top:'50%', left:`${pct(v)}%`, transform:'translate(-50%,-50%)',
            width:16, height:16, borderRadius:'50%', background:'#fff', border:`2px solid ${C.gold}`,
            boxShadow:'0 2px 6px rgba(0,0,0,0.15)', pointerEvents:'none',
          }} />
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Ecommerce() {
  // Cart
  const [cartItems, dispatch] = useReducer(cartReducer, [])
  const [cartHydrated, setCartHydrated] = useState(false)

  // UI
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [drawerView, setDrawerView]     = useState<DrawerView>('cart')
  const [scrolled, setScrolled]         = useState(false)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen]     = useState(false)

  // Catalog filters
  const [category, setCategory]         = useState<Category>('all')
  const [sortBy, setSortBy]             = useState<SortKey>('featured')
  const [priceRange, setPriceRange]     = useState<[number,number]>([0, 700])
  const [searchQuery, setSearchQuery]   = useState('')

  // Product quick-view
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedColor, setSelectedColor]     = useState<string>('')
  const [selectedSize, setSelectedSize]       = useState<string>('')
  const [qvTab, setQvTab]                     = useState<'desc'|'material'|'care'>('desc')

  // Cart extras
  const [couponInput, setCouponInput]   = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<typeof COUPONS[string] | null>(null)
  const [couponError, setCouponError]   = useState('')

  // Fly-to-cart animation
  const [flyActive, setFlyActive]       = useState(false)
  const [flyOrigin, setFlyOrigin]       = useState({ x: 0, y: 0 })
  const cartIconRef                     = useRef<HTMLButtonElement>(null)

  // Checkout
  const emptyForm: CheckoutForm = {
    email:'', name:'', cpf:'', phone:'', cep:'', street:'', number:'', complement:'', neighborhood:'', city:'', state:'',
    paymentMethod:'credit', cardNumber:'', cardName:'', cardExpiry:'', cardCvv:'', installments:'1x',
    marketingConsent: false, termsConsent: false,
  }
  const [checkout, setCheckout]         = useState<CheckoutForm>(emptyForm)
  const [checkoutTouched, setCheckoutTouched] = useState<Partial<Record<keyof CheckoutForm, boolean>>>({})
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false)
  const [orderNumber, setOrderNumber]   = useState('')
  const [cepLoading, setCepLoading]     = useState(false)

  // Toasts
  const [toasts, setToasts]             = useState<ToastState[]>([])
  const [toastCtr, setToastCtr]         = useState(0)

  // Intersection
  const heroRef       = useRef<HTMLDivElement>(null)
  const catalogRef    = useRef<HTMLDivElement>(null)
  const heroVis       = useIntersection(heroRef as React.RefObject<Element>, 0.05)
  const catalogVis    = useIntersection(catalogRef as React.RefObject<Element>, 0.05)

  // ── Hydrate cart from localStorage (safe, no flash) ──────────────────────
  useEffect(() => {
    const saved = loadCart()
    if (saved.length > 0) dispatch({ type: 'HYDRATE', items: saved })
    setCartHydrated(true)
  }, [])

  // ── Persist cart ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!cartHydrated) return
    saveCart(cartItems)
  }, [cartItems, cartHydrated])

  // ── Scroll ────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => {
    document.body.style.overflow = (drawerOpen || mobileFilterOpen || mobileMenuOpen || !!selectedProduct) ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen, mobileFilterOpen, mobileMenuOpen, selectedProduct])

  // ── Toast ─────────────────────────────────────────────────────────────────
  const addToast = useCallback((type: ToastState['type'], msg: string) => {
    const id = toastCtr + 1; setToastCtr(id)
    setToasts(p => [...p, { id, type, message: msg }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000)
  }, [toastCtr])
  const removeToast = useCallback((id: number) => setToasts(p => p.filter(t => t.id !== id)), [])

  // ── Cart computed ─────────────────────────────────────────────────────────
  const cartCount   = cartItems.reduce((s, i) => s + i.quantity, 0)
  const cartSubtotal = cartItems.reduce((s, i) => {
    const p = PRODUCTS.find(p => p.id === i.productId)
    return s + (p?.price ?? 0) * i.quantity
  }, 0)
  const freeShipping  = cartSubtotal >= 299
  const shippingCost  = freeShipping ? 0 : cartSubtotal > 0 ? 18.90 : 0
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? cartSubtotal * (appliedCoupon.discount / 100)
      : Math.min(appliedCoupon.discount, cartSubtotal)
    : 0
  const cartTotal = cartSubtotal - couponDiscount + shippingCost

  // ── Filtered & sorted products ────────────────────────────────────────────
  const filtered = PRODUCTS
    .filter(p => category === 'all' || p.category === category)
    .filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])
    .filter(p => !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'price-asc')  return a.price - b.price
      if (sortBy === 'price-desc') return b.price - a.price
      if (sortBy === 'newest')     return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)
      return 0
    })

  // ── Fly-to-cart ───────────────────────────────────────────────────────────
  function flyToCart(originEl: HTMLElement) {
    const rect       = originEl.getBoundingClientRect()
    const cartRect   = cartIconRef.current?.getBoundingClientRect()
    if (!cartRect) return
    setFlyOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setFlyActive(true)
    setTimeout(() => setFlyActive(false), 700)
  }

  // ── Add to cart ───────────────────────────────────────────────────────────
  function handleAddToCart(product: Product, color: string, size: string, originEl?: HTMLElement) {
    if (!color || !size) { addToast('error', 'Selecione cor e tamanho antes de adicionar.'); return }
    dispatch({ type: 'ADD', item: { productId: product.id, color, size, quantity: 1 } })
    if (originEl) flyToCart(originEl)
    addToast('success', `${product.name} adicionado à sacola!`)
    setSelectedProduct(null)
  }

  // ── Quick add (from card without modal) ───────────────────────────────────
  function handleQuickAdd(product: Product, originEl: HTMLElement) {
    if (product.colors.length === 1 && product.sizes.length === 1) {
      handleAddToCart(product, product.colors[0], product.sizes[0], originEl)
    } else {
      setSelectedProduct(product)
      setSelectedColor(product.colors[0])
      setSelectedSize(product.sizes.length === 1 ? product.sizes[0] : '')
      setQvTab('desc')
    }
  }

  // ── Coupon ────────────────────────────────────────────────────────────────
  function applyCoupon() {
    const code = couponInput.trim().toUpperCase()
    if (!code) { setCouponError('Digite um cupom.'); return }
    const found = COUPONS[code]
    if (!found) { setCouponError('Cupom inválido ou expirado.'); setAppliedCoupon(null); return }
    setAppliedCoupon(found)
    setCouponError('')
    addToast('success', `Cupom aplicado: ${found.label}`)
  }

  // ── CEP lookup (mock) ─────────────────────────────────────────────────────
  async function lookupCEP(cep: string) {
    const digits = cep.replace(/\D/g,'')
    if (digits.length !== 8) return
    setCepLoading(true)
    await new Promise(r => setTimeout(r, 800))
    // Mock address for any valid CEP
    setCheckout(p => ({ ...p, street: 'Rua das Flores', neighborhood: 'Meireles', city: 'Fortaleza', state: 'CE' }))
    setCepLoading(false)
    addToast('info', 'Endereço preenchido automaticamente. Confirme os dados.')
  }

  // ── Checkout validation ───────────────────────────────────────────────────
  function validateCheckout(f: CheckoutForm): FormErrors {
    const e: FormErrors = {}
    if (!f.email || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(f.email)) e.email = 'E-mail inválido'
    if (!f.name || f.name.trim().length < 3) e.name = 'Nome completo obrigatório'
    if (!f.cpf || f.cpf.replace(/\D/g,'').length < 11) e.cpf = 'CPF inválido'
    if (!f.phone || f.phone.replace(/\D/g,'').length < 10) e.phone = 'Telefone inválido'
    if (!f.cep || f.cep.replace(/\D/g,'').length < 8) e.cep = 'CEP inválido'
    if (!f.street) e.street = 'Obrigatório'
    if (!f.number) e.number = 'Obrigatório'
    if (!f.city)   e.city   = 'Obrigatório'
    if (!f.state)  e.state  = 'Obrigatório'
    if (f.paymentMethod === 'credit') {
      if (!f.cardNumber || f.cardNumber.replace(/\D/g,'').length < 16) e.cardNumber = 'Número inválido'
      if (!f.cardName)   e.cardName   = 'Nome obrigatório'
      if (!f.cardExpiry || f.cardExpiry.length < 5) e.cardExpiry = 'Validade inválida'
      if (!f.cardCvv || f.cardCvv.length < 3)       e.cardCvv    = 'CVV inválido'
    }
    if (!f.termsConsent) e.termsConsent = 'Você precisa aceitar os Termos de Uso para continuar'
    return e
  }

  const checkoutErrors   = validateCheckout(checkout)
  const checkoutFormOk   = Object.keys(checkoutErrors).length === 0
  const getChkErr = (field: keyof CheckoutForm) => checkoutTouched[field] ? checkoutErrors[field] : undefined

  async function handleCheckoutSubmit(e: React.FormEvent) {
    e.preventDefault()
    const allTouched: Partial<Record<keyof CheckoutForm,boolean>> = {}
    Object.keys(checkout).forEach(k => { allTouched[k as keyof CheckoutForm] = true })
    setCheckoutTouched(allTouched)
    if (!checkoutFormOk) { addToast('error', 'Corrija os campos destacados antes de finalizar.'); return }
    setCheckoutSubmitting(true)
    await new Promise(r => setTimeout(r, 1600))
    const num = generateOrderNumber()
    setOrderNumber(num)
    setDrawerView('done')
    dispatch({ type: 'CLEAR' })
    setAppliedCoupon(null)
    setCouponInput('')
    setCheckoutSubmitting(false)
  }

  // ─── Input style helper ───────────────────────────────────────────────────
  const inputStyle = (field: keyof CheckoutForm): React.CSSProperties => ({
    width: '100%', background: C.ivory, border: `1.5px solid ${getChkErr(field) ? C.error : C.border}`,
    borderRadius: 8, padding: '11px 13px', fontSize: 13, color: C.ink, outline: 'none',
    fontFamily: 'inherit', transition: 'border-color 150ms ease, box-shadow 150ms ease',
  })

  const labelStyle: React.CSSProperties = { display: 'block', fontSize: 11, fontWeight: 700, color: C.inkLight, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 5 }

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div style={{ background: C.ivory, color: C.ink, fontFamily: 'var(--font-inter, sans-serif)', minHeight: '100vh' }}>

      {/* ── Global CSS ─────────────────────────────────────────────────────── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap');
        @keyframes auFlyIn    { from { opacity:0; transform:translateX(20px) } to { opacity:1; transform:translateX(0) } }
        @keyframes auFadeUp   { from { opacity:0; transform:translateY(18px) } to { opacity:1; transform:translateY(0) } }
        @keyframes auFlyCart  { 0% { opacity:1; transform:scale(1) } 80% { opacity:.8; transform:scale(.7) } 100% { opacity:0; transform:scale(.3) } }
        @keyframes auPulse    { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
        @keyframes auSpin     { to { transform:rotate(360deg) } }
        @keyframes auSlideIn  { from { transform:translateX(100%) } to { transform:translateX(0) } }
        @keyframes auShimmer  { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
        * { box-sizing:border-box; margin:0; padding:0 }
        html { scroll-behavior:smooth }
        ::selection { background:rgba(184,147,90,0.25) }
        .au-product-card { transition: transform 250ms ease, box-shadow 250ms ease }
        .au-product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(26,23,20,0.12) }
        .au-product-card:hover .au-card-actions { opacity:1 !important; transform:translateY(0) !important }
        .au-card-actions { transition: opacity 220ms ease, transform 220ms ease }
        .au-nav-link { color:${C.inkLight}; text-decoration:none; font-size:13px; font-weight:500; letter-spacing:.04em; transition:color 150ms ease; text-transform:uppercase }
        .au-nav-link:hover { color:${C.ink} }
        .au-filter-btn:hover { background:${C.goldPale} !important; border-color:${C.gold} !important; color:${C.gold} !important }
        .au-sort-option:hover { background:${C.goldPale} !important }
        .au-qty-btn:hover { background:${C.ink} !important; color:#fff !important }
        :focus-visible { outline:2px solid ${C.gold} !important; outline-offset:3px !important; border-radius:4px !important }
        @media(max-width:768px) { .au-hide-m { display:none !important } }
        @media(min-width:769px) { .au-show-m { display:none !important } }
        .au-checkout-input:focus { border-color:${C.gold} !important; box-shadow:0 0 0 3px rgba(184,147,90,0.15) !important }
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />

      {/* Fly-to-cart particle */}
      {flyActive && (
        <div aria-hidden="true" style={{
          position: 'fixed', zIndex: 9998, pointerEvents: 'none',
          left: flyOrigin.x, top: flyOrigin.y, transform: 'translate(-50%,-50%)',
          width: 20, height: 20, borderRadius: '50%', background: C.gold,
          animation: 'auFlyCart 700ms ease-out forwards',
        }} />
      )}

      {/* ── Topbar ───────────────────────────────────────────────────────── */}
      <div style={{ background: C.ink, padding: '9px 24px', textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.70)', letterSpacing: '0.10em', textTransform: 'uppercase', fontWeight: 500 }}>
          ✦ Frete grátis nas compras acima de R$ 299 &nbsp;·&nbsp; Troca gratuita em 30 dias &nbsp;·&nbsp; Parcelamento em 10× sem juros
        </p>
      </div>

      {/* ── Navbar ───────────────────────────────────────────────────────── */}
      <header role="banner" style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: scrolled ? 'rgba(249,246,241,0.97)' : C.ivory,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${scrolled ? C.border : 'transparent'}`,
        transition: 'border-color 300ms ease, background 300ms ease',
      }}>
        <nav style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px', height: 70, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}
          aria-label="Navegação principal">

          {/* Logo */}
          <a href="#" style={{ textDecoration: 'none', flexShrink: 0 }} aria-label="Áurea — início">
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: C.ink, letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1 }}>Áurea</p>
            <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.gold, fontWeight: 700, marginTop: 1 }}>Moda feminina</p>
          </a>

          {/* Center nav */}
          <ul className="au-hide-m" style={{ display: 'flex', gap: 32, listStyle: 'none', alignItems: 'center' }}>
            {CATEGORIES.slice(1).map(c => (
              <li key={c.id}>
                <button className="au-nav-link"
                  onClick={() => { setCategory(c.id); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                  {c.label}
                </button>
              </li>
            ))}
          </ul>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Search */}
            <div className="au-hide-m" style={{ position: 'relative' }}>
              <input
                type="search" placeholder="Buscar…" value={searchQuery}
                onChange={e => setSearchQuery(e.target.value.slice(0, 100))}
                aria-label="Buscar produtos"
                style={{ background: C.ivoryDeep, border: `1px solid ${C.border}`, borderRadius: 6, padding: '7px 12px 7px 32px', fontSize: 12, color: C.ink, outline: 'none', width: 160, transition: 'width 250ms ease' }}
                onFocus={e => e.currentTarget.style.width = '220px'}
                onBlur={e => e.currentTarget.style.width = '160px'}
              />
              <span style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: C.inkLight, pointerEvents: 'none', fontSize: 13 }} aria-hidden="true">🔍</span>
            </div>

            {/* Cart button */}
            <button ref={cartIconRef}
              onClick={() => { setDrawerOpen(true); setDrawerView('cart') }}
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: C.ink }}
              aria-label={`Sacola com ${cartCount} ${cartCount === 1 ? 'item' : 'itens'}`}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              {cartHydrated && cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: 2, right: 2, width: 18, height: 18, borderRadius: '50%',
                  background: C.gold, color: '#fff', fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  animation: 'auPulse 300ms ease-out',
                }} aria-hidden="true">{cartCount > 9 ? '9+' : cartCount}</span>
              )}
            </button>

            {/* Mobile menu */}
            <button className="au-show-m" onClick={() => setMobileMenuOpen(v => !v)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: C.ink }}
              aria-label={mobileMenuOpen ? 'Fechar menu' : 'Abrir menu'}>
              {mobileMenuOpen
                ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>
                : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
              }
            </button>
          </div>
        </nav>

        {mobileMenuOpen && (
          <div role="dialog" aria-modal="true" aria-label="Menu"
            style={{ background: C.ivory, borderTop: `1px solid ${C.border}`, padding: '16px 24px 28px' }}>
            <input type="search" placeholder="Buscar produtos…" value={searchQuery}
              onChange={e => setSearchQuery(e.target.value.slice(0,100))}
              style={{ width: '100%', background: C.ivoryDeep, border: `1px solid ${C.border}`, borderRadius: 8, padding: '10px 14px', fontSize: 14, outline: 'none', marginBottom: 16 }} />
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
              {CATEGORIES.slice(1).map(c => (
                <li key={c.id}>
                  <button className="au-nav-link"
                    onClick={() => { setCategory(c.id); setMobileMenuOpen(false); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'block', padding: '12px 16px', fontSize: 14, borderRadius: 8, width: '100%', textAlign: 'left' }}>
                    {c.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </header>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} aria-label="Destaque da coleção"
        style={{ background: C.ink, minHeight: 560, display: 'grid', gridTemplateColumns: '1fr 1fr', overflow: 'hidden', position: 'relative' }}>
        <style>{`@media(max-width:768px){ .au-hero-grid { grid-template-columns:1fr !important } }`}</style>

        {/* Text side */}
        <div className="au-hero-grid" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(40px,8vw,96px)' }}>
          <div style={{ animation: heroVis ? 'auFadeUp 700ms ease-out both' : 'none' }}>
            <p style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.gold, fontWeight: 700, marginBottom: 20 }}>
              Coleção Verão 2025
            </p>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 'clamp(2.8rem, 6vw, 5rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              color: '#F9F6F1',
              marginBottom: 24,
              letterSpacing: '-0.01em',
            }}>
              Elegância que<br />
              <em style={{ fontStyle: 'italic', color: C.goldLight }}>não pede</em><br />
              licença.
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(249,246,241,0.60)', lineHeight: 1.75, marginBottom: 36, maxWidth: 400 }}>
              Peças atemporais para mulheres que sabem quem são.
              Qualidade de ateliê, entrega para todo o Brasil.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <button
                onClick={() => { setCategory('all'); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{ background: C.gold, color: '#fff', border: 'none', borderRadius: 8, padding: '13px 28px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 150ms ease, transform 150ms ease' }}
                onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
                Ver coleção
              </button>
              <button
                onClick={() => { setCategory('dresses'); document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' }) }}
                style={{ background: 'transparent', color: 'rgba(249,246,241,0.75)', border: '1px solid rgba(249,246,241,0.25)', borderRadius: 8, padding: '13px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'border-color 150ms ease, color 150ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#F9F6F1'; e.currentTarget.style.borderColor = 'rgba(249,246,241,0.6)' }}
                onMouseLeave={e => { e.currentTarget.style.color = 'rgba(249,246,241,0.75)'; e.currentTarget.style.borderColor = 'rgba(249,246,241,0.25)' }}>
                Vestidos →
              </button>
            </div>
          </div>
        </div>

        {/* Visual side — product swatch grid */}
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: 440 }}>
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              radial-gradient(ellipse 80% 80% at 70% 40%, rgba(184,147,90,0.12) 0%, transparent 60%),
              linear-gradient(135deg, #2A2420 0%, #1A1714 100%)
            `,
          }} />
          {/* Decorative swatch cards */}
          {PRODUCTS.slice(0,3).map((p, i) => (
            <div key={p.id} style={{
              position: 'absolute',
              left: `${10 + i * 28}%`, top: `${8 + i * 20}%`,
              width: `${40 - i * 5}%`, height: `${50 - i * 5}%`,
              borderRadius: 16,
              background: p.swatchBg,
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: heroVis ? `auFadeUp ${500 + i*120}ms ease-out both` : 'none',
              cursor: 'pointer',
              transition: 'transform 250ms ease',
            }}
              onClick={() => { setSelectedProduct(p); setSelectedColor(p.colors[0]); setSelectedSize(''); setQvTab('desc') }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03) rotate(-1deg)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1) rotate(0deg)'}
            >
              <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12 }}>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.80)', fontWeight: 600, marginBottom: 2 }}>{p.name}</p>
                <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: '#fff', fontWeight: 500 }}>{formatBRL(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Catalog ──────────────────────────────────────────────────────── */}
      <section id="catalog" ref={catalogRef} aria-labelledby="catalog-h2" style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 40 }}>
          <div>
            <h2 id="catalog-h2" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 500, color: C.ink, letterSpacing: '-0.01em' }}>
              {category === 'all' ? 'Toda a coleção' : CATEGORIES.find(c => c.id === category)?.label}
            </h2>
            <p style={{ fontSize: 13, color: C.inkLight, marginTop: 4 }}>{filtered.length} peças</p>
          </div>
          {/* Sort */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <span style={{ fontSize: 12, color: C.inkLight, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Ordenar:</span>
            <select value={sortBy} onChange={e => setSortBy(e.target.value as SortKey)}
              aria-label="Ordenar produtos"
              style={{ background: C.ivoryDeep, border: `1px solid ${C.border}`, borderRadius: 7, padding: '7px 12px', fontSize: 12, color: C.ink, outline: 'none', cursor: 'pointer', appearance: 'none', paddingRight: 28 }}>
              {SORT_OPTIONS.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: 40 }} className="au-catalog-grid">
          <style>{`@media(max-width:900px){ .au-catalog-grid{ grid-template-columns:1fr !important } }`}</style>

          {/* ── Sidebar filters ──────────────────────────────────────────── */}
          <aside aria-label="Filtros de produto" className="au-hide-m">
            <div style={{ position: 'sticky', top: 86, display: 'flex', flexDirection: 'column', gap: 32 }}>

              {/* Category */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkLight, marginBottom: 14 }}>Categoria</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {CATEGORIES.map(c => (
                    <li key={c.id}>
                      <button
                        className="au-filter-btn"
                        onClick={() => setCategory(c.id)}
                        aria-pressed={category === c.id}
                        style={{
                          width: '100%', textAlign: 'left', background: category === c.id ? C.goldPale : 'transparent',
                          border: `1px solid ${category === c.id ? C.gold : 'transparent'}`,
                          borderRadius: 7, padding: '8px 12px', fontSize: 13, fontWeight: category === c.id ? 600 : 400,
                          color: category === c.id ? C.gold : C.inkMid, cursor: 'pointer',
                          transition: 'all 150ms ease',
                        }}>
                        {c.label}
                        <span style={{ float: 'right', fontSize: 11, color: C.inkLight }}>
                          {c.id === 'all' ? PRODUCTS.length : PRODUCTS.filter(p => p.category === c.id).length}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price range */}
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.inkLight, marginBottom: 14 }}>Preço</p>
                <RangePriceFilter min={0} max={700} value={priceRange} onChange={setPriceRange} />
                <button onClick={() => setPriceRange([0, 700])}
                  style={{ fontSize: 11, color: C.gold, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8, padding: 0 }}>
                  Limpar filtro
                </button>
              </div>

              {/* Divider */}
              <div style={{ borderTop: `1px solid ${C.border}`, paddingTop: 20 }}>
                <p style={{ fontSize: 11, color: C.inkLight, lineHeight: 1.6 }}>
                  Todos os preços em BRL. Parcelamento em até 10× sem juros.
                </p>
              </div>
            </div>
          </aside>

          {/* Mobile filter bar */}
          <div className="au-show-m" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)}
                style={{ padding: '7px 14px', borderRadius: 9999, fontSize: 12, fontWeight: category === c.id ? 700 : 400,
                  background: category === c.id ? C.gold : C.ivoryDeep,
                  color: category === c.id ? '#fff' : C.inkMid,
                  border: 'none', cursor: 'pointer', transition: 'all 150ms ease' }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* ── Product grid ─────────────────────────────────────────────── */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <p style={{ fontSize: 16, color: C.inkLight }}>Nenhuma peça encontrada com esses filtros.</p>
                <button onClick={() => { setCategory('all'); setPriceRange([0, 700]); setSearchQuery('') }}
                  style={{ marginTop: 16, background: C.gold, color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontSize: 13, cursor: 'pointer' }}>
                  Limpar filtros
                </button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 20 }} className="au-products-grid">
                <style>{`
                  @media(max-width:900px){ .au-products-grid{ grid-template-columns:repeat(2,1fr) !important } }
                  @media(max-width:480px){ .au-products-grid{ grid-template-columns:1fr !important } }
                `}</style>
                {filtered.map((product, i) => (
                  <article key={product.id}
                    className="au-product-card"
                    style={{
                      background: C.white, borderRadius: 14, overflow: 'hidden',
                      border: `1px solid ${C.borderLight}`,
                      animation: catalogVis ? `auFadeUp 450ms ${i * 60}ms ease-out both` : 'none',
                    }}>

                    {/* Swatch area */}
                    <div style={{ position: 'relative', aspectRatio: '3/4', background: product.swatchBg, cursor: 'pointer', overflow: 'hidden' }}
                      onClick={() => { setSelectedProduct(product); setSelectedColor(product.colors[0]); setSelectedSize(''); setQvTab('desc') }}>

                      {/* Badges */}
                      <div style={{ position: 'absolute', top: 12, left: 12, display: 'flex', flexDirection: 'column', gap: 4 }} aria-live="polite">
                        {product.badge && (
                          <span style={{ background: C.ink, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>
                            {product.badge}
                          </span>
                        )}
                        {product.isNew && (
                          <span style={{ background: C.gold, color: '#fff', fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4, letterSpacing: '0.06em' }}>
                            NOVO
                          </span>
                        )}
                      </div>

                      {/* Color swatches */}
                      <div style={{ position: 'absolute', bottom: 12, left: 12, display: 'flex', gap: 5 }} aria-label="Cores disponíveis">
                        {product.colors.map(color => (
                          <div key={color} title={color}
                            style={{ width: 14, height: 14, borderRadius: '50%', background: color, border: '1.5px solid rgba(255,255,255,0.7)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }}
                            aria-label={color} />
                        ))}
                      </div>

                      {/* Quick-add overlay */}
                      <div className="au-card-actions"
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', opacity: 0, transform: 'translateY(8px)' }}>
                        <button
                          onClick={e => { e.stopPropagation(); handleQuickAdd(product, e.currentTarget) }}
                          style={{
                            width: '100%', background: C.ink, color: '#fff', border: 'none', borderRadius: 8,
                            padding: '11px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                            cursor: 'pointer', backdropFilter: 'blur(8px)',
                          }}>
                          Adicionar à sacola
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div style={{ padding: '16px 16px 20px' }}>
                      <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 500, color: C.ink, marginBottom: 4, cursor: 'pointer' }}
                        onClick={() => { setSelectedProduct(product); setSelectedColor(product.colors[0]); setSelectedSize(''); setQvTab('desc') }}>
                        {product.name}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 18, fontWeight: 600, color: C.ink }}>{formatBRL(product.price)}</span>
                        {product.originalPrice && (
                          <span style={{ fontSize: 13, color: C.inkLight, textDecoration: 'line-through' }}>{formatBRL(product.originalPrice)}</span>
                        )}
                      </div>
                      <p style={{ fontSize: 11, color: C.inkLight, marginTop: 3 }}>em até 10× de {formatBRL(product.price / 10)}</p>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────────────────── */}
      <section aria-label="Diferenciais" style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: '32px 32px', background: C.white }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }} className="au-trust-grid">
          <style>{`@media(max-width:640px){ .au-trust-grid{ grid-template-columns:repeat(2,1fr) !important } }`}</style>
          {[
            { icon: '🚚', title: 'Frete grátis', sub: 'Acima de R$ 299' },
            { icon: '🔄', title: 'Troca fácil', sub: '30 dias sem custo' },
            { icon: '💳', title: 'Parcelamento', sub: 'Até 10× sem juros' },
            { icon: '🔒', title: 'Compra segura', sub: 'SSL + antifraude' },
          ].map(d => (
            <div key={d.title} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontSize: 24, flexShrink: 0 }} aria-hidden="true">{d.icon}</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>{d.title}</p>
                <p style={{ fontSize: 11, color: C.inkLight }}>{d.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer role="contentinfo" style={{ background: C.ink, padding: '56px 32px 32px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 40 }} className="au-footer-grid">
            <style>{`@media(max-width:900px){ .au-footer-grid{ grid-template-columns:1fr 1fr !important } } @media(max-width:580px){ .au-footer-grid{ grid-template-columns:1fr !important } }`}</style>
            <div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.8rem', fontWeight: 600, color: '#F9F6F1', letterSpacing: '0.12em', textTransform: 'uppercase', lineHeight: 1, marginBottom: 4 }}>Áurea</p>
              <p style={{ fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: C.gold, fontWeight: 700, marginBottom: 16 }}>Moda feminina</p>
              <p style={{ fontSize: 13, color: 'rgba(249,246,241,0.50)', lineHeight: 1.75, maxWidth: 280 }}>
                Moda que resiste ao tempo. Peças curadoriadas para mulheres que compram menos e melhor.
              </p>
            </div>
            {[
              { title: 'Categorias', links: ['Vestidos','Blusas','Acessórios','Calçados','Sale'] },
              { title: 'Atendimento', links: ['Central de ajuda','Rastrear pedido','Trocas e devoluções','Guia de tamanhos','WhatsApp'] },
              { title: 'Empresa', links: ['Sobre nós','Sustentabilidade','Blog de estilo','Afiliadas','Política de Privacidade'] },
            ].map(col => (
              <nav key={col.title} aria-label={col.title}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(249,246,241,0.70)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 14 }}>{col.title}</p>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" style={{ fontSize: 13, color: 'rgba(249,246,241,0.45)', textDecoration: 'none', transition: 'color 150ms ease' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#F9F6F1'}
                        onMouseLeave={e => e.currentTarget.style.color = 'rgba(249,246,241,0.45)'}>{l}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <p style={{ fontSize: 11, color: 'rgba(249,246,241,0.35)' }}>
              © {new Date().getFullYear()} Áurea Store Ltda. CNPJ 00.000.000/0001-00. Template por{' '}
              <a href="/" style={{ color: 'rgba(249,246,241,0.55)', textDecoration: 'underline' }}>CCP NEXATECH</a>.
            </p>
            <p style={{ fontSize: 11, color: 'rgba(249,246,241,0.35)' }}>
              🔒 Dados protegidos conforme LGPD · Pagamentos processados com criptografia SSL/TLS
            </p>
          </div>
        </div>
      </footer>

      {/* ── Product Quick View Modal ──────────────────────────────────────── */}
      {selectedProduct && (
        <div role="dialog" aria-modal="true" aria-labelledby="qv-title"
          style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div onClick={() => setSelectedProduct(null)}
            style={{ position: 'absolute', inset: 0, background: 'rgba(26,23,20,0.75)', backdropFilter: 'blur(4px)' }} aria-hidden="true" />
          <div style={{
            position: 'relative', background: C.white, borderRadius: 20, overflow: 'hidden',
            maxWidth: 860, width: '100%', maxHeight: '90vh', display: 'grid', gridTemplateColumns: '1fr 1fr',
            animation: 'auFadeUp 300ms ease-out', boxShadow: '0 40px 80px rgba(0,0,0,0.4)',
          }} className="qv-grid">
            <style>{`@media(max-width:640px){ .qv-grid{ grid-template-columns:1fr !important } }`}</style>

            {/* Swatch */}
            <div style={{ aspectRatio: '1', background: selectedProduct.swatchBg, minHeight: 300 }} />

            {/* Info */}
            <div style={{ padding: 32, overflow: 'auto' }}>
              <button onClick={() => setSelectedProduct(null)}
                style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.08)', border: 'none', borderRadius: '50%', width: 32, height: 32, cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                aria-label="Fechar">×</button>

              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.gold, marginBottom: 8 }}>
                {CATEGORIES.find(c => c.id === selectedProduct.category)?.label}
              </p>
              <h2 id="qv-title" style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 24, fontWeight: 500, color: C.ink, marginBottom: 12 }}>
                {selectedProduct.name}
              </h2>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 20 }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: C.ink }}>{formatBRL(selectedProduct.price)}</span>
                {selectedProduct.originalPrice && <span style={{ fontSize: 14, color: C.inkLight, textDecoration: 'line-through' }}>{formatBRL(selectedProduct.originalPrice)}</span>}
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: 0, borderBottom: `1px solid ${C.border}`, marginBottom: 16 }}>
                {(['desc','material','care'] as const).map(tab => (
                  <button key={tab}
                    onClick={() => setQvTab(tab)}
                    style={{ padding: '8px 14px', background: 'none', border: 'none', fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', color: qvTab === tab ? C.ink : C.inkLight, borderBottom: `2px solid ${qvTab === tab ? C.ink : 'transparent'}`, marginBottom: -1, transition: 'all 150ms ease' }}>
                    {tab === 'desc' ? 'Descrição' : tab === 'material' ? 'Material' : 'Cuidados'}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.75, marginBottom: 20 }}>
                {qvTab === 'desc' ? selectedProduct.description : qvTab === 'material' ? selectedProduct.material : selectedProduct.care}
              </p>

              {/* Color */}
              <div style={{ marginBottom: 18 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.inkLight, marginBottom: 10 }}>
                  Cor selecionada
                </p>
                <div style={{ display: 'flex', gap: 8 }} role="radiogroup" aria-label="Cor">
                  {selectedProduct.colors.map(c => (
                    <button key={c} onClick={() => setSelectedColor(c)}
                      aria-pressed={selectedColor === c}
                      style={{ width: 28, height: 28, borderRadius: '50%', background: c, border: `2.5px solid ${selectedColor === c ? C.ink : 'transparent'}`, boxShadow: `0 0 0 1px ${C.border}`, cursor: 'pointer', transition: 'border-color 150ms ease', outline: 'none' }}
                      aria-label={c} />
                  ))}
                </div>
              </div>

              {/* Size */}
              <div style={{ marginBottom: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.inkLight, marginBottom: 10 }}>
                  Tamanho
                </p>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }} role="radiogroup" aria-label="Tamanho">
                  {selectedProduct.sizes.map(sz => (
                    <button key={sz} onClick={() => setSelectedSize(sz)}
                      aria-pressed={selectedSize === sz}
                      style={{
                        padding: '8px 14px', borderRadius: 7, fontSize: 12, fontWeight: 600,
                        background: selectedSize === sz ? C.ink : C.ivoryDeep,
                        color: selectedSize === sz ? '#fff' : C.inkMid,
                        border: `1.5px solid ${selectedSize === sz ? C.ink : C.border}`,
                        cursor: 'pointer', transition: 'all 150ms ease',
                      }}>
                      {sz}
                    </button>
                  ))}
                </div>
                {!selectedSize && <p style={{ fontSize: 11, color: C.error, marginTop: 6 }}>Selecione um tamanho</p>}
              </div>

              <button
                onClick={e => handleAddToCart(selectedProduct, selectedColor, selectedSize, e.currentTarget)}
                style={{
                  width: '100%', background: C.ink, color: '#fff', border: 'none', borderRadius: 10,
                  padding: '14px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase',
                  cursor: 'pointer', transition: 'background 150ms ease',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.gold}
                onMouseLeave={e => e.currentTarget.style.background = C.ink}>
                Adicionar à sacola
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Cart / Checkout Drawer ────────────────────────────────────────── */}
      {drawerOpen && (
        <div>
          <div onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(26,23,20,0.60)', backdropFilter: 'blur(3px)', zIndex: 300 }} aria-hidden="true" />
          <aside role="dialog" aria-modal="true"
            aria-label={drawerView === 'cart' ? 'Sacola de compras' : drawerView === 'checkout' ? 'Finalizar pedido' : 'Pedido confirmado'}
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0, width: '100%', maxWidth: 480,
              background: C.white, zIndex: 301, display: 'flex', flexDirection: 'column',
              animation: 'auSlideIn 300ms ease-out',
              boxShadow: '-16px 0 48px rgba(0,0,0,0.15)',
            }}>

            {/* Drawer header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 500, color: C.ink }}>
                  {drawerView === 'cart' ? 'Sua Sacola' : drawerView === 'checkout' ? 'Finalizar Pedido' : 'Pedido Confirmado'}
                </h2>
                {drawerView === 'cart' && cartItems.length > 0 && (
                  <p style={{ fontSize: 12, color: C.inkLight }}>{cartCount} {cartCount === 1 ? 'peça' : 'peças'}</p>
                )}
              </div>
              <button onClick={() => setDrawerOpen(false)}
                style={{ background: C.ivoryDeep, border: 'none', borderRadius: '50%', width: 34, height: 34, cursor: 'pointer', fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.ink }}
                aria-label="Fechar sacola">×</button>
            </div>

            {/* ── CART VIEW ── */}
            {drawerView === 'cart' && (
              <>
                <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
                  {cartItems.length === 0 ? (
                    <div style={{ textAlign: 'center', paddingTop: 64 }}>
                      <p style={{ fontSize: 40, marginBottom: 16 }} aria-hidden="true">🛍️</p>
                      <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: C.inkLight, marginBottom: 8 }}>Sua sacola está vazia</p>
                      <p style={{ fontSize: 13, color: C.inkLight, marginBottom: 24 }}>Explore nossa coleção e encontre peças que vão durar.</p>
                      <button onClick={() => setDrawerOpen(false)}
                        style={{ background: C.ink, color: '#fff', border: 'none', borderRadius: 8, padding: '12px 24px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>
                        Ver coleção →
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      {cartItems.map(item => {
                        const product = PRODUCTS.find(p => p.id === item.productId)
                        if (!product) return null
                        return (
                          <div key={`${item.productId}-${item.color}-${item.size}`}
                            style={{ display: 'flex', gap: 14, padding: '16px 0', borderBottom: `1px solid ${C.borderLight}` }}>
                            <div style={{ width: 72, height: 90, borderRadius: 10, background: product.swatchBg, flexShrink: 0 }} aria-hidden="true" />
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 15, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{product.name}</p>
                              <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                <span style={{ fontSize: 11, color: C.inkLight }}>Cor:
                                  <span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: '50%', background: item.color, marginLeft: 4, verticalAlign: 'middle', border: `1px solid ${C.border}` }} />
                                </span>
                                <span style={{ fontSize: 11, color: C.inkLight }}>Tam: {item.size}</span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                {/* Qty controls */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: `1px solid ${C.border}`, borderRadius: 7, overflow: 'hidden' }}>
                                  <button className="au-qty-btn"
                                    onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.productId, color: item.color, size: item.size, delta: -1 })}
                                    style={{ width: 28, height: 28, background: C.ivoryDeep, border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}
                                    aria-label="Diminuir quantidade">−</button>
                                  <span style={{ padding: '0 10px', fontSize: 13, fontWeight: 600, color: C.ink, minWidth: 28, textAlign: 'center' }} aria-label={`Quantidade: ${item.quantity}`}>{item.quantity}</span>
                                  <button className="au-qty-btn"
                                    onClick={() => dispatch({ type: 'UPDATE_QTY', productId: item.productId, color: item.color, size: item.size, delta: 1 })}
                                    style={{ width: 28, height: 28, background: C.ivoryDeep, border: 'none', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease' }}
                                    aria-label="Aumentar quantidade">+</button>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                  <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16, fontWeight: 600, color: C.ink }}>{formatBRL(product.price * item.quantity)}</p>
                                  <button onClick={() => dispatch({ type: 'REMOVE', productId: item.productId, color: item.color, size: item.size })}
                                    style={{ background: 'none', border: 'none', fontSize: 11, color: C.inkLight, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
                                    aria-label={`Remover ${product.name}`}>Remover</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {cartItems.length > 0 && (
                  <div style={{ padding: '20px 24px', borderTop: `1px solid ${C.border}`, flexShrink: 0, background: C.white }}>
                    {/* Coupon */}
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <input type="text" placeholder="Cupom de desconto"
                          value={couponInput}
                          onChange={e => { setCouponInput(e.target.value.toUpperCase().slice(0,20)); setCouponError('') }}
                          onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                          aria-label="Código de cupom" aria-describedby={couponError ? 'coupon-err' : undefined}
                          style={{ flex: 1, background: C.ivory, border: `1px solid ${couponError ? C.error : C.border}`, borderRadius: 7, padding: '9px 12px', fontSize: 13, color: C.ink, outline: 'none', fontFamily: 'monospace', letterSpacing: '0.06em' }} />
                        <button onClick={applyCoupon}
                          style={{ background: C.ink, color: '#fff', border: 'none', borderRadius: 7, padding: '9px 16px', fontSize: 12, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                          Aplicar
                        </button>
                      </div>
                      {couponError && <p id="coupon-err" role="alert" style={{ fontSize: 11, color: C.error, marginTop: 4 }}>{couponError}</p>}
                      {appliedCoupon && <p style={{ fontSize: 11, color: C.success, marginTop: 4 }}>✓ {appliedCoupon.label} aplicado</p>}
                      <p style={{ fontSize: 10, color: C.inkLight, marginTop: 4 }}>Tente: AUREA10 · PRIMEIRA50 · VIPAUREA</p>
                    </div>

                    {/* Totals */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16, paddingBottom: 16, borderBottom: `1px solid ${C.borderLight}` }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.inkLight }}>
                        <span>Subtotal</span><span>{formatBRL(cartSubtotal)}</span>
                      </div>
                      {couponDiscount > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: C.success }}>
                          <span>Desconto</span><span>−{formatBRL(couponDiscount)}</span>
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: freeShipping ? C.success : C.inkLight }}>
                        <span>Frete</span>
                        <span>{freeShipping ? 'Grátis 🎉' : formatBRL(shippingCost)}</span>
                      </div>
                      {!freeShipping && (
                        <div style={{ background: C.goldPale, border: `1px solid ${C.goldLight}`, borderRadius: 6, padding: '6px 10px' }}>
                          <p style={{ fontSize: 11, color: C.gold, fontWeight: 600 }}>
                            Adicione {formatBRL(299 - cartSubtotal)} para ganhar frete grátis
                          </p>
                          <div style={{ height: 4, background: C.goldLight, borderRadius: 2, marginTop: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', background: C.gold, width: `${Math.min((cartSubtotal / 299) * 100, 100)}%`, borderRadius: 2, transition: 'width 300ms ease' }} />
                          </div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: C.ink }}>Total</span>
                      <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600, color: C.ink }}>{formatBRL(cartTotal)}</span>
                    </div>
                    <button onClick={() => setDrawerView('checkout')}
                      style={{ width: '100%', background: C.ink, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', transition: 'background 150ms ease' }}
                      onMouseEnter={e => e.currentTarget.style.background = C.gold}
                      onMouseLeave={e => e.currentTarget.style.background = C.ink}>
                      Finalizar pedido →
                    </button>
                    <p style={{ fontSize: 10, color: C.inkLight, textAlign: 'center', marginTop: 10 }}>
                      🔒 Pagamento seguro com SSL · LGPD compliance
                    </p>
                  </div>
                )}
              </>
            )}

            {/* ── CHECKOUT VIEW ── */}
            {drawerView === 'checkout' && (
              <form onSubmit={handleCheckoutSubmit} noValidate style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 22 }}>
                  <button type="button" onClick={() => setDrawerView('cart')}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.inkLight, fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, padding: 0, alignSelf: 'flex-start' }}>
                    ← Voltar à sacola
                  </button>

                  {/* Contact */}
                  <fieldset style={{ border: 'none', padding: 0 }}>
                    <legend style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: C.ink, marginBottom: 14 }}>Contato</legend>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {[
                        { id:'email',  label:'E-mail', type:'email', auto:'email', format: (v:string) => v.slice(0,254), placeholder:'voce@email.com' },
                        { id:'name',   label:'Nome completo', type:'text', auto:'name', format: (v:string) => v.slice(0,100), placeholder:'Como no documento' },
                        { id:'cpf',    label:'CPF', type:'text', auto:'off', format: formatCPF, placeholder:'000.000.000-00' },
                        { id:'phone',  label:'Telefone / WhatsApp', type:'tel', auto:'tel', format: formatPhone, placeholder:'(85) 99999-9999' },
                      ].map(f => (
                        <div key={f.id}>
                          <label htmlFor={`chk-${f.id}`} style={labelStyle}>{f.label}</label>
                          <input id={`chk-${f.id}`} type={f.type} autoComplete={f.auto}
                            value={checkout[f.id as keyof CheckoutForm] as string}
                            onChange={e => setCheckout(p => ({ ...p, [f.id]: f.format(e.target.value) }))}
                            onBlur={() => setCheckoutTouched(p => ({ ...p, [f.id]: true }))}
                            placeholder={f.placeholder}
                            className="au-checkout-input" style={inputStyle(f.id as keyof CheckoutForm)}
                            aria-invalid={!!getChkErr(f.id as keyof CheckoutForm)}
                            aria-describedby={getChkErr(f.id as keyof CheckoutForm) ? `chk-${f.id}-err` : undefined} />
                          {getChkErr(f.id as keyof CheckoutForm) && (
                            <p id={`chk-${f.id}-err`} role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr(f.id as keyof CheckoutForm)}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </fieldset>

                  {/* Address */}
                  <fieldset style={{ border: 'none', padding: 0 }}>
                    <legend style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: C.ink, marginBottom: 14 }}>Endereço de entrega</legend>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {/* CEP */}
                      <div>
                        <label htmlFor="chk-cep" style={labelStyle}>CEP</label>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <input id="chk-cep" type="text" autoComplete="postal-code" inputMode="numeric"
                            value={checkout.cep}
                            onChange={e => { const v = formatCEP(e.target.value); setCheckout(p => ({ ...p, cep: v })); if (v.replace(/\D/g,'').length === 8) lookupCEP(v) }}
                            onBlur={() => setCheckoutTouched(p => ({ ...p, cep: true }))}
                            placeholder="00000-000" maxLength={9}
                            className="au-checkout-input" style={{ ...inputStyle('cep'), flex: 1 }}
                            aria-invalid={!!getChkErr('cep')} />
                          {cepLoading && <div style={{ width: 20, height: 20, borderRadius: '50%', border: `2px solid ${C.border}`, borderTopColor: C.gold, animation: 'auSpin 600ms linear infinite', flexShrink: 0, alignSelf: 'center' }} aria-hidden="true" />}
                        </div>
                        {getChkErr('cep') && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr('cep')}</p>}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10 }}>
                        {[['street','Rua / Avenida','text','street-address','Rua das Flores',true],['number','Número','text','address-line2','123',false]].map(([id,lbl,t,auto,ph]) => (
                          <div key={id as string}>
                            <label htmlFor={`chk-${id}`} style={labelStyle}>{lbl as string}</label>
                            <input id={`chk-${id}`} type={t as string} autoComplete={auto as string}
                              value={checkout[id as keyof CheckoutForm] as string}
                              onChange={e => setCheckout(p => ({ ...p, [id as string]: e.target.value.slice(0,100) }))}
                              onBlur={() => setCheckoutTouched(p => ({ ...p, [id as string]: true }))}
                              placeholder={ph as string}
                              className="au-checkout-input" style={inputStyle(id as keyof CheckoutForm)} />
                            {getChkErr(id as keyof CheckoutForm) && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr(id as keyof CheckoutForm)}</p>}
                          </div>
                        ))}
                      </div>

                      {[
                        { id:'complement', label:'Complemento', placeholder:'Apto, bloco…', req:false },
                        { id:'neighborhood', label:'Bairro', placeholder:'Meireles', req:false },
                      ].map(f => (
                        <div key={f.id}>
                          <label htmlFor={`chk-${f.id}`} style={labelStyle}>{f.label}</label>
                          <input id={`chk-${f.id}`} type="text"
                            value={checkout[f.id as keyof CheckoutForm] as string}
                            onChange={e => setCheckout(p => ({ ...p, [f.id]: e.target.value.slice(0,100) }))}
                            placeholder={f.placeholder}
                            className="au-checkout-input" style={inputStyle(f.id as keyof CheckoutForm)} />
                        </div>
                      ))}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: 10 }}>
                        {[['city','Cidade','Fortaleza'],['state','Estado','CE']].map(([id,lbl,ph]) => (
                          <div key={id}>
                            <label htmlFor={`chk-${id}`} style={labelStyle}>{lbl}</label>
                            <input id={`chk-${id}`} type="text"
                              value={checkout[id as keyof CheckoutForm] as string}
                              onChange={e => setCheckout(p => ({ ...p, [id]: e.target.value.slice(0,60) }))}
                              onBlur={() => setCheckoutTouched(p => ({ ...p, [id]: true }))}
                              placeholder={ph}
                              className="au-checkout-input" style={inputStyle(id as keyof CheckoutForm)} />
                            {getChkErr(id as keyof CheckoutForm) && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr(id as keyof CheckoutForm)}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </fieldset>

                  {/* Payment */}
                  <fieldset style={{ border: 'none', padding: 0 }}>
                    <legend style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 17, fontWeight: 500, color: C.ink, marginBottom: 14 }}>Pagamento</legend>

                    {/* Payment method selector */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 16 }}>
                      {[
                        { id: 'credit', label: 'Cartão de crédito', icon: '💳' },
                        { id: 'pix',    label: 'Pix',               icon: '⚡' },
                        { id: 'boleto', label: 'Boleto',            icon: '📄' },
                      ].map(m => (
                        <button key={m.id} type="button"
                          onClick={() => setCheckout(p => ({ ...p, paymentMethod: m.id as CheckoutForm['paymentMethod'] }))}
                          aria-pressed={checkout.paymentMethod === m.id}
                          style={{
                            padding: '10px 8px', borderRadius: 8, border: `1.5px solid ${checkout.paymentMethod === m.id ? C.ink : C.border}`,
                            background: checkout.paymentMethod === m.id ? C.ivoryDeep : C.white,
                            cursor: 'pointer', textAlign: 'center', transition: 'all 150ms ease',
                          }}>
                          <span style={{ fontSize: 18, display: 'block', marginBottom: 3 }} aria-hidden="true">{m.icon}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, color: C.inkMid, letterSpacing: '0.04em' }}>{m.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Credit card fields */}
                    {checkout.paymentMethod === 'credit' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, animation: 'auFadeUp 250ms ease-out' }}>
                        <div>
                          <label htmlFor="chk-cardNumber" style={labelStyle}>Número do cartão</label>
                          <input id="chk-cardNumber" type="text" inputMode="numeric" autoComplete="cc-number"
                            value={checkout.cardNumber}
                            onChange={e => setCheckout(p => ({ ...p, cardNumber: formatCard(e.target.value) }))}
                            onBlur={() => setCheckoutTouched(p => ({ ...p, cardNumber: true }))}
                            placeholder="0000 0000 0000 0000" maxLength={19}
                            className="au-checkout-input" style={{ ...inputStyle('cardNumber'), fontFamily: 'monospace', letterSpacing: '0.08em' }} />
                          {getChkErr('cardNumber') && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr('cardNumber')}</p>}
                        </div>
                        <div>
                          <label htmlFor="chk-cardName" style={labelStyle}>Nome no cartão</label>
                          <input id="chk-cardName" type="text" autoComplete="cc-name"
                            value={checkout.cardName}
                            onChange={e => setCheckout(p => ({ ...p, cardName: e.target.value.toUpperCase().slice(0,50) }))}
                            onBlur={() => setCheckoutTouched(p => ({ ...p, cardName: true }))}
                            placeholder="NOME SOBRENOME"
                            className="au-checkout-input" style={{ ...inputStyle('cardName'), letterSpacing: '0.06em', fontFamily: 'monospace' }} />
                          {getChkErr('cardName') && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr('cardName')}</p>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          <div>
                            <label htmlFor="chk-cardExpiry" style={labelStyle}>Validade</label>
                            <input id="chk-cardExpiry" type="text" autoComplete="cc-exp" inputMode="numeric"
                              value={checkout.cardExpiry}
                              onChange={e => setCheckout(p => ({ ...p, cardExpiry: formatExpiry(e.target.value) }))}
                              onBlur={() => setCheckoutTouched(p => ({ ...p, cardExpiry: true }))}
                              placeholder="MM/AA" maxLength={5}
                              className="au-checkout-input" style={{ ...inputStyle('cardExpiry'), fontFamily: 'monospace', letterSpacing: '0.08em' }} />
                            {getChkErr('cardExpiry') && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr('cardExpiry')}</p>}
                          </div>
                          <div>
                            <label htmlFor="chk-cardCvv" style={labelStyle}>CVV</label>
                            <input id="chk-cardCvv" type="text" autoComplete="cc-csc" inputMode="numeric"
                              value={checkout.cardCvv}
                              onChange={e => setCheckout(p => ({ ...p, cardCvv: e.target.value.replace(/\D/g,'').slice(0,4) }))}
                              onBlur={() => setCheckoutTouched(p => ({ ...p, cardCvv: true }))}
                              placeholder="123" maxLength={4}
                              className="au-checkout-input" style={{ ...inputStyle('cardCvv'), fontFamily: 'monospace', letterSpacing: '0.12em' }} />
                            {getChkErr('cardCvv') && <p role="alert" style={{ fontSize: 11, color: C.error, marginTop: 3 }}>{getChkErr('cardCvv')}</p>}
                          </div>
                        </div>
                        <div>
                          <label htmlFor="chk-installments" style={labelStyle}>Parcelamento</label>
                          <select id="chk-installments" value={checkout.installments}
                            onChange={e => setCheckout(p => ({ ...p, installments: e.target.value }))}
                            className="au-checkout-input"
                            style={{ ...inputStyle('installments'), appearance: 'none', cursor: 'pointer' }}>
                            {[1,2,3,4,5,6,7,8,9,10].map(n => (
                              <option key={n} value={`${n}x`}>
                                {n}× de {formatBRL(cartTotal / n)}{n <= 3 ? ' sem juros' : ''}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}

                    {checkout.paymentMethod === 'pix' && (
                      <div style={{ background: C.goldPale, border: `1px solid ${C.goldLight}`, borderRadius: 10, padding: '16px 20px', textAlign: 'center', animation: 'auFadeUp 250ms ease-out' }}>
                        <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.6 }}>
                          Após confirmar, você receberá o <strong>QR Code Pix</strong> por e-mail com validade de 30 minutos.
                          Pagamento confirmado em segundos, sem taxas adicionais.
                        </p>
                      </div>
                    )}

                    {checkout.paymentMethod === 'boleto' && (
                      <div style={{ background: C.ivory, border: `1px solid ${C.border}`, borderRadius: 10, padding: '16px 20px', animation: 'auFadeUp 250ms ease-out' }}>
                        <p style={{ fontSize: 13, color: C.inkMid, lineHeight: 1.6 }}>
                          Boleto gerado após a confirmação. Válido por <strong>3 dias úteis</strong>.
                          O pedido será processado após a compensação do pagamento (1–2 dias úteis).
                        </p>
                      </div>
                    )}
                  </fieldset>

                  {/* Consents */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {/* Marketing consent (opt-in, not required) */}
                    <label style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                      <div onClick={() => setCheckout(p => ({ ...p, marketingConsent: !p.marketingConsent }))}
                        role="checkbox" aria-checked={checkout.marketingConsent} tabIndex={0}
                        onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') setCheckout(p => ({ ...p, marketingConsent: !p.marketingConsent })) }}
                        style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, background: checkout.marketingConsent ? C.gold : C.white, border: `1.5px solid ${checkout.marketingConsent ? C.gold : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease', cursor: 'pointer' }}>
                        {checkout.marketingConsent && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6 }}>
                        Quero receber novidades, lançamentos e ofertas exclusivas por e-mail. Posso cancelar a qualquer momento.
                      </span>
                    </label>

                    {/* Terms consent (required) */}
                    <label style={{ display: 'flex', gap: 10, cursor: 'pointer' }}>
                      <div onClick={() => { setCheckout(p => ({ ...p, termsConsent: !p.termsConsent })); setCheckoutTouched(p => ({ ...p, termsConsent: true })) }}
                        role="checkbox" aria-checked={checkout.termsConsent}
                        aria-required="true" aria-invalid={!!getChkErr('termsConsent')}
                        tabIndex={0} onKeyDown={e => { if (e.key === ' ' || e.key === 'Enter') { setCheckout(p => ({ ...p, termsConsent: !p.termsConsent })); setCheckoutTouched(p => ({ ...p, termsConsent: true })) } }}
                        style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1, background: checkout.termsConsent ? C.ink : C.white, border: `1.5px solid ${getChkErr('termsConsent') ? C.error : checkout.termsConsent ? C.ink : C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 150ms ease', cursor: 'pointer' }}>
                        {checkout.termsConsent && <span style={{ color: '#fff', fontSize: 11 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.6 }}>
                        Li e aceito os <a href="#" style={{ color: C.ink, fontWeight: 600 }}>Termos de Uso</a> e a{' '}
                        <a href="#" style={{ color: C.ink, fontWeight: 600 }}>Política de Privacidade</a>.
                        Meus dados são protegidos conforme a LGPD. <span style={{ color: C.error }}>*</span>
                      </span>
                    </label>
                    {getChkErr('termsConsent') && <p role="alert" style={{ fontSize: 11, color: C.error, marginLeft: 28 }}>{getChkErr('termsConsent')}</p>}
                  </div>
                </div>

                {/* Checkout footer */}
                <div style={{ padding: '16px 24px', borderTop: `1px solid ${C.border}`, background: C.white, flexShrink: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 16 }}>Total a pagar</span>
                    <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, fontWeight: 600 }}>{formatBRL(cartTotal)}</span>
                  </div>
                  <button type="submit" disabled={checkoutSubmitting}
                    aria-busy={checkoutSubmitting}
                    style={{ width: '100%', background: C.ink, color: '#fff', border: 'none', borderRadius: 10, padding: '14px', fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: checkoutSubmitting ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    {checkoutSubmitting ? (
                      <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'auSpin 600ms linear infinite' }} aria-hidden="true" /> Processando pedido…</>
                    ) : 'Confirmar pedido →'}
                  </button>
                  <p style={{ fontSize: 10, color: C.inkLight, textAlign: 'center', marginTop: 8 }}>🔒 Transação protegida com SSL/TLS · PCI DSS compliance</p>
                </div>
              </form>
            )}

            {/* ── DONE VIEW ── */}
            {drawerView === 'done' && (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '32px 32px', textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: C.goldPale, border: `2px solid ${C.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, marginBottom: 20 }} aria-hidden="true">✓</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 500, color: C.ink, marginBottom: 8 }}>Pedido confirmado!</h2>
                <p style={{ fontSize: 14, color: C.inkLight, marginBottom: 20, lineHeight: 1.6 }}>
                  Obrigada pela sua compra. Um e-mail de confirmação foi enviado.
                </p>
                <div style={{ background: C.ivory, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 24px', marginBottom: 24, width: '100%' }}>
                  <p style={{ fontSize: 11, color: C.inkLight, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Número do pedido</p>
                  <p style={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: C.gold, letterSpacing: '0.08em' }}>{orderNumber}</p>
                </div>
                <div style={{ background: C.ivory, border: `1px solid ${C.border}`, borderRadius: 12, padding: '16px 20px', marginBottom: 24, width: '100%', textAlign: 'left' }}>
                  <p style={{ fontSize: 12, fontWeight: 600, color: C.ink, marginBottom: 8 }}>Próximos passos:</p>
                  <ul style={{ fontSize: 12, color: C.inkLight, lineHeight: 1.8, paddingLeft: 16 }}>
                    <li>Você receberá um e-mail de confirmação em instantes</li>
                    <li>O prazo de envio é de 2–5 dias úteis após a aprovação do pagamento</li>
                    <li>Você receberá o código de rastreamento por e-mail e SMS</li>
                    <li>Dúvidas? Acesse nossa Central de Ajuda ou envie mensagem no WhatsApp</li>
                  </ul>
                </div>
                <button onClick={() => { setDrawerOpen(false); setDrawerView('cart') }}
                  style={{ background: C.ink, color: '#fff', border: 'none', borderRadius: 10, padding: '12px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Continuar comprando
                </button>
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  )
}