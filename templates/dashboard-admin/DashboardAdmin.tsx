'use client'

import { useState, useEffect, useRef, useCallback, useReducer } from 'react'

// ─── Design Tokens ────────────────────────────────────────────────────────────
const T = {
  bg:       '#080B12',
  surface:  '#0D1117',
  card:     '#111827',
  cardHov:  '#141D2B',
  border:   'rgba(255,255,255,0.07)',
  borderMd: 'rgba(255,255,255,0.12)',
  text:     '#F0F4FF',
  textMid:  '#9BA8C0',
  textDim:  '#4B5675',
  // Accent per project
  blue:     '#3B82F6',
  blueMid:  '#2563EB',
  blueDim:  'rgba(59,130,246,0.15)',
  green:    '#10B981',
  greenDim: 'rgba(16,185,129,0.15)',
  gold:     '#F59E0B',
  goldDim:  'rgba(245,158,11,0.15)',
  teal:     '#14B8A6',
  tealDim:  'rgba(20,184,166,0.15)',
  red:      '#EF4444',
  redDim:   'rgba(239,68,68,0.15)',
  purple:   '#8B5CF6',
  purpleDim:'rgba(139,92,246,0.15)',
} as const

// ─── Types ────────────────────────────────────────────────────────────────────
type Project  = 'flowdesk' | 'aurea' | 'clinica'
type NavItem  = 'overview' | 'appointments' | 'orders' | 'leads' | 'users' | 'analytics' | 'settings'

interface ProjectConfig {
  id: Project
  name: string
  tagline: string
  color: string
  colorDim: string
  icon: string
  navItems: NavItem[]
}

interface KPI {
  label: string
  value: number
  suffix?: string
  prefix?: string
  delta: number
  deltaLabel: string
  positive: boolean
  icon: string
  color: string
  colorDim: string
}

interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'editor' | 'viewer'
  status: 'active' | 'inactive' | 'pending'
  avatar: string
  lastSeen: string
  createdAt: string
}

interface Appointment {
  id: number
  patient: string
  doctor: string
  specialty: string
  date: string
  time: string
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed'
  phone: string
  plan: string
  protocol: string
}

interface Order {
  id: string
  customer: string
  items: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  date: string
  payment: 'credit' | 'pix' | 'boleto'
  address: string
}

interface Lead {
  id: number
  email: string
  plan: string
  position: number
  status: 'waiting' | 'approved' | 'rejected'
  createdAt: string
  source: string
}

interface ToastState {
  id: number
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
}

interface ActivityItem {
  id: number
  type: 'create' | 'update' | 'delete' | 'login' | 'payment'
  description: string
  user: string
  time: string
  color: string
}

interface Session {
  id: number
  device: string
  location: string
  ip: string
  lastActive: string
  current: boolean
}

// ─── Project Configs ──────────────────────────────────────────────────────────
const PROJECTS: ProjectConfig[] = [
  {
    id: 'clinica', name: 'Clínica Serena', tagline: 'Gestão médica',
    color: T.teal, colorDim: T.tealDim, icon: '🏥',
    navItems: ['overview','appointments','users','analytics','settings'],
  },
  {
    id: 'aurea', name: 'Áurea Store', tagline: 'E-commerce moda',
    color: T.gold, colorDim: T.goldDim, icon: '✦',
    navItems: ['overview','orders','users','analytics','settings'],
  },
  {
    id: 'flowdesk', name: 'FlowDesk', tagline: 'SaaS platform',
    color: T.blue, colorDim: T.blueDim, icon: '⚡',
    navItems: ['overview','leads','users','analytics','settings'],
  },
]

// ─── Mock Data ────────────────────────────────────────────────────────────────
const MOCK_USERS: User[] = [
  { id:1, name:'Ana Lima',      email:'ana@empresa.com',     role:'admin',  status:'active',   avatar:'AL', lastSeen:'Agora',    createdAt:'Jan 2024' },
  { id:2, name:'Carlos Mota',   email:'carlos@empresa.com',  role:'editor', status:'active',   avatar:'CM', lastSeen:'2h atrás', createdAt:'Mar 2024' },
  { id:3, name:'Diego Farias',  email:'diego@empresa.com',   role:'viewer', status:'inactive', avatar:'DF', lastSeen:'3d atrás', createdAt:'Jun 2024' },
  { id:4, name:'Elena Souza',   email:'elena@empresa.com',   role:'editor', status:'active',   avatar:'ES', lastSeen:'1h atrás', createdAt:'Feb 2024' },
  { id:5, name:'Felipe Nunes',  email:'felipe@empresa.com',  role:'viewer', status:'pending',  avatar:'FN', lastSeen:'—',        createdAt:'Nov 2024' },
  { id:6, name:'Gisele Torres', email:'gisele@empresa.com',  role:'viewer', status:'active',   avatar:'GT', lastSeen:'30m atrás',createdAt:'Oct 2024' },
]

const MOCK_APPOINTMENTS: Appointment[] = [
  { id:1, patient:'Fernanda Lima',    doctor:'Dra. Maria Costa',   specialty:'Cardiologia', date:'27/03/2026', time:'08:30', status:'confirmed',  phone:'(85) 99888-1111', plan:'Unimed',          protocol:'SER-MCV9-0142' },
  { id:2, patient:'Roberto Menezes', doctor:'Dr. João Araújo',     specialty:'Neurologia',  date:'27/03/2026', time:'09:00', status:'pending',    phone:'(85) 99777-2222', plan:'Particular',      protocol:'SER-MCV9-0143' },
  { id:3, patient:'Cláudia Santos',  doctor:'Dra. Sofia Lemos',    specialty:'Clínica Geral',date:'27/03/2026',time:'09:30', status:'confirmed',  phone:'(85) 99666-3333', plan:'Hapvida',         protocol:'SER-MCV9-0144' },
  { id:4, patient:'Marcos Oliveira', doctor:'Dr. Lucas Ferreira',  specialty:'Oftalmologia',date:'27/03/2026', time:'10:00', status:'cancelled',  phone:'(85) 99555-4444', plan:'Bradesco Saúde',  protocol:'SER-MCV9-0145' },
  { id:5, patient:'Letícia Rocha',   doctor:'Dra. Ana Rodrigues',  specialty:'Dermatologia',date:'27/03/2026', time:'10:30', status:'completed',  phone:'(85) 99444-5555', plan:'Amil',            protocol:'SER-MCV9-0146' },
  { id:6, patient:'Paulo Braga',     doctor:'Dr. Pedro Almeida',   specialty:'Ortopedia',   date:'27/03/2026', time:'11:00', status:'confirmed',  phone:'(85) 99333-6666', plan:'SulAmérica',      protocol:'SER-MCV9-0147' },
  { id:7, patient:'Isabela Neri',    doctor:'Dra. Maria Costa',   specialty:'Cardiologia', date:'28/03/2026', time:'08:00', status:'pending',    phone:'(85) 99222-7777', plan:'Unimed',          protocol:'SER-MCV9-0148' },
]

const MOCK_ORDERS: Order[] = [
  { id:'AUR-MCV1-0821', customer:'Mariana Costa',   items:2, total:538,  status:'delivered',  date:'26/03/2026', payment:'credit',  address:'Meireles, Fortaleza-CE' },
  { id:'AUR-MCV1-0820', customer:'Renata Alves',    items:1, total:189,  status:'shipped',    date:'25/03/2026', payment:'pix',     address:'Aldeota, Fortaleza-CE'  },
  { id:'AUR-MCV1-0819', customer:'Juliana Martins', items:3, total:767,  status:'processing', date:'25/03/2026', payment:'credit',  address:'Varjota, Fortaleza-CE'  },
  { id:'AUR-MCV1-0818', customer:'Bruno Ferreira',  items:1, total:129,  status:'cancelled',  date:'24/03/2026', payment:'boleto',  address:'Centro, Fortaleza-CE'   },
  { id:'AUR-MCV1-0817', customer:'Priscila Leal',   items:2, total:448,  status:'delivered',  date:'24/03/2026', payment:'pix',     address:'Cocó, Fortaleza-CE'     },
  { id:'AUR-MCV1-0816', customer:'Tâmara Vidal',    items:1, total:279,  status:'pending',    date:'27/03/2026', payment:'credit',  address:'Fátima, Fortaleza-CE'   },
  { id:'AUR-MCV1-0815', customer:'Larissa Duarte',  items:4, total:1156, status:'processing', date:'27/03/2026', payment:'credit',  address:'Papicu, Fortaleza-CE'   },
]

const MOCK_LEADS: Lead[] = [
  { id:1,  email:'startup@ventura.com',      plan:'Pro',        position:3847, status:'waiting',  createdAt:'27/03 14:22', source:'Busca orgânica' },
  { id:2,  email:'cto@techflow.io',          plan:'Enterprise', position:3848, status:'approved', createdAt:'27/03 13:55', source:'LinkedIn' },
  { id:3,  email:'admin@meganexus.com.br',   plan:'Pro',        position:3849, status:'waiting',  createdAt:'27/03 13:40', source:'Busca orgânica' },
  { id:4,  email:'fundador@openstudio.co',   plan:'Starter',    position:3850, status:'waiting',  createdAt:'27/03 12:30', source:'Indicação' },
  { id:5,  email:'ops@cloudbridge.io',       plan:'Enterprise', position:3851, status:'rejected', createdAt:'27/03 11:00', source:'Product Hunt' },
  { id:6,  email:'dev@makerlabs.com.br',     plan:'Pro',        position:3852, status:'waiting',  createdAt:'27/03 10:15', source:'GitHub' },
  { id:7,  email:'contato@agenciafly.com',   plan:'Starter',    position:3853, status:'approved', createdAt:'26/03 18:45', source:'Instagram Ads' },
  { id:8,  email:'growth@pivotventures.co',  plan:'Pro',        position:3854, status:'waiting',  createdAt:'26/03 16:20', source:'Google Ads' },
]

const MOCK_ACTIVITY: ActivityItem[] = [
  { id:1, type:'payment', description:'Pedido AUR-MCV1-0821 pagamento confirmado',   user:'Sistema', time:'2m', color:T.green  },
  { id:2, type:'create',  description:'Nova consulta agendada — Fernanda Lima',      user:'Paciente',time:'8m', color:T.blue   },
  { id:3, type:'update',  description:'Lead cto@techflow.io aprovado para acesso',  user:'Ana Lima', time:'15m',color:T.teal  },
  { id:4, type:'login',   description:'Login detectado — Carlos Mota (São Paulo)',   user:'Sistema', time:'22m',color:T.textDim},
  { id:5, type:'delete',  description:'Consulta #0145 cancelada pelo paciente',      user:'Marcos O.',time:'1h', color:T.red   },
  { id:6, type:'create',  description:'Usuário Gisele Torres adicionada como viewer',user:'Ana Lima', time:'2h', color:T.purple},
  { id:7, type:'payment', description:'Pedido AUR-MCV1-0817 entregue — confirmado', user:'Sistema', time:'3h', color:T.green  },
  { id:8, type:'update',  description:'Produto "Vestido Midi Nocturne" estoque baixo',user:'Sistema',time:'4h', color:T.gold  },
]

const MOCK_SESSIONS: Session[] = [
  { id:1, device:'Chrome 123 — macOS',     location:'Fortaleza, CE',  ip:'187.44.x.x',  lastActive:'Agora',        current:true  },
  { id:2, device:'Safari — iPhone 15',     location:'Fortaleza, CE',  ip:'187.44.x.x',  lastActive:'1h atrás',     current:false },
  { id:3, device:'Firefox 125 — Windows',  location:'São Paulo, SP',  ip:'189.11.x.x',  lastActive:'3d atrás',     current:false },
]

const CHART_MONTHS    = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
const CHART_CLINICA   = [38,52,44,61,55,70,65,80,72,89,76,94]
const CHART_AUREA     = [42,61,55,78,65,82,70,90,76,95,84,102]
const CHART_FLOWDESK  = [20,28,35,42,38,55,62,74,68,88,95,112]

const FUNNEL_DATA = [
  { label:'Visitantes',     value:12480, pct:100 },
  { label:'Engajados',      value:4210,  pct:33.7 },
  { label:'Leads',          value:1380,  pct:11.1 },
  { label:'Convertidos',    value:312,   pct:2.5  },
]

const CHANNEL_DATA = [
  { label:'Busca orgânica', pct:42, color:T.blue   },
  { label:'Redes sociais',  pct:28, color:T.purple },
  { label:'E-mail',         pct:18, color:T.teal   },
  { label:'Direto',         pct:12, color:T.gold   },
]

const DEVICE_DATA = [
  { label:'Mobile',  pct:58, color:T.blue   },
  { label:'Desktop', pct:34, color:T.blueMid},
  { label:'Tablet',  pct:8,  color:T.blueDim},
]

const TOP_PAGES = [
  { page:'/ (início)',       views:'12.4k', avg:'2m 14s', bounce:'32%' },
  { page:'/produtos',        views:'8.1k',  avg:'3m 42s', bounce:'24%' },
  { page:'/agendamento',     views:'5.6k',  avg:'4m 11s', bounce:'18%' },
  { page:'/especialidades',  views:'3.8k',  avg:'2m 05s', bounce:'38%' },
  { page:'/contato',         views:'2.3k',  avg:'1m 12s', bounce:'45%' },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatBRL(n: number) {
  return new Intl.NumberFormat('pt-BR', { style:'currency', currency:'BRL', minimumFractionDigits:0 }).format(n)
}
function cx(...cls: (string|false|undefined)[]) { return cls.filter(Boolean).join(' ') }

// ─── Hooks ────────────────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 1200, active = false) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!active) return
    let start: number | null = null
    const step = (ts: number) => {
      if (!start) start = ts
      const p = Math.min((ts - start) / duration, 1)
      setV(Math.floor((1 - Math.pow(1 - p, 3)) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return v
}

function useInterval(cb: () => void, ms: number, active = true) {
  useEffect(() => {
    if (!active) return
    const id = setInterval(cb, ms)
    return () => clearInterval(id)
  }, [cb, ms, active])
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function Toast({ toasts, remove }: { toasts: ToastState[]; remove:(id:number)=>void }) {
  const ICONS = { success:'✓', error:'!', info:'ℹ', warning:'⚠' }
  const COLORS = { success:T.green, error:T.red, info:T.blue, warning:T.gold }
  return (
    <div role="status" aria-live="polite" style={{ position:'fixed',bottom:24,right:24,zIndex:9999,display:'flex',flexDirection:'column',gap:8,pointerEvents:'none' }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          display:'flex',alignItems:'center',gap:10,padding:'12px 16px',borderRadius:10,pointerEvents:'all',
          background:T.card,border:`1px solid ${COLORS[t.type]}40`,
          boxShadow:`0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${COLORS[t.type]}20`,
          animation:'nxFlyIn 200ms ease-out',maxWidth:360,
        }}>
          <div style={{ width:22,height:22,borderRadius:6,background:`${COLORS[t.type]}20`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,color:COLORS[t.type],fontWeight:700,flexShrink:0 }}>{ICONS[t.type]}</div>
          <span style={{fontSize:13,color:T.text,fontWeight:500,flex:1}}>{t.message}</span>
          <button onClick={()=>remove(t.id)} style={{background:'none',border:'none',color:T.textDim,cursor:'pointer',fontSize:16,lineHeight:1}} aria-label="Fechar">×</button>
        </div>
      ))}
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label:string; color:string; bg:string }> = {
    confirmed:  { label:'Confirmado', color:T.green,  bg:T.greenDim  },
    pending:    { label:'Pendente',   color:T.gold,   bg:T.goldDim   },
    cancelled:  { label:'Cancelado', color:T.red,    bg:T.redDim    },
    completed:  { label:'Concluído', color:T.blue,   bg:T.blueDim   },
    delivered:  { label:'Entregue',  color:T.green,  bg:T.greenDim  },
    shipped:    { label:'Enviado',   color:T.blue,   bg:T.blueDim   },
    processing: { label:'Processando',color:T.gold,  bg:T.goldDim   },
    waiting:    { label:'Aguardando',color:T.textMid,bg:'rgba(155,168,192,0.12)'},
    approved:   { label:'Aprovado',  color:T.teal,   bg:T.tealDim   },
    rejected:   { label:'Recusado',  color:T.red,    bg:T.redDim    },
    active:     { label:'Ativo',     color:T.green,  bg:T.greenDim  },
    inactive:   { label:'Inativo',   color:T.textDim,bg:'rgba(75,86,117,0.20)' },
    credit:     { label:'Cartão',    color:T.blue,   bg:T.blueDim   },
    pix:        { label:'Pix',       color:T.teal,   bg:T.tealDim   },
    boleto:     { label:'Boleto',    color:T.gold,   bg:T.goldDim   },
    admin:      { label:'Admin',     color:T.red,    bg:T.redDim    },
    editor:     { label:'Editor',    color:T.blue,   bg:T.blueDim   },
    viewer:     { label:'Viewer',    color:T.textMid,bg:'rgba(155,168,192,0.12)'},
  }
  const s = map[status] || { label:status, color:T.textMid, bg:'rgba(155,168,192,0.12)' }
  return (
    <span style={{ display:'inline-flex',alignItems:'center',gap:4,padding:'3px 9px',borderRadius:5,fontSize:11,fontWeight:600,background:s.bg,color:s.color,whiteSpace:'nowrap' }}>
      {s.label}
    </span>
  )
}

function AnimatedBar({ value, max, index, color, visible }: { value:number;max:number;index:number;color:string;visible:boolean }) {
  return (
    <div style={{ flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:6 }}>
      <div style={{ width:'100%',height:140,display:'flex',alignItems:'flex-end' }}>
        <div style={{
          width:'100%',borderRadius:'3px 3px 0 0',
          background: index === 11 ? color : `${color}50`,
          height: visible ? `${(value/max)*100}%` : '0%',
          transition: `height 600ms cubic-bezier(.4,0,.2,1) ${index*40}ms`,
          boxShadow: index === 11 ? `0 0 10px ${color}60` : 'none',
          cursor:'default',
        }} title={`${CHART_MONTHS[index]}: ${value}`} />
      </div>
      <span style={{ fontSize:9,color:T.textDim,textTransform:'uppercase',letterSpacing:'0.04em' }}>{CHART_MONTHS[index]}</span>
    </div>
  )
}

function KpiCard({ kpi, accent, visible }: { kpi:KPI; accent:string; visible:boolean }) {
  const count = useCountUp(kpi.value, 1200, visible)
  const display = kpi.prefix
    ? `${kpi.prefix}${count.toLocaleString('pt-BR')}${kpi.suffix||''}`
    : `${count.toLocaleString('pt-BR')}${kpi.suffix||''}`
  return (
    <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px',transition:'border-color 200ms ease,box-shadow 200ms ease',cursor:'default' }}
      onMouseEnter={e=>{e.currentTarget.style.borderColor=`${accent}30`;e.currentTarget.style.boxShadow=`0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 ${accent}15`}}
      onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.boxShadow='none'}}>
      <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:14 }}>
        <div style={{ width:38,height:38,borderRadius:10,background:kpi.colorDim,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18 }} aria-hidden="true">{kpi.icon}</div>
        <div style={{ display:'flex',alignItems:'center',gap:4,background:kpi.positive?T.greenDim:T.redDim,borderRadius:6,padding:'3px 8px' }}>
          <span style={{ fontSize:10,fontWeight:700,color:kpi.positive?T.green:T.red }}>{kpi.positive?'↑':'↓'}{kpi.delta}%</span>
        </div>
      </div>
      <p style={{ fontFamily:'var(--font-syne,sans-serif)',fontSize:'clamp(1.4rem,2.5vw,1.9rem)',fontWeight:700,color:T.text,lineHeight:1,marginBottom:4,letterSpacing:'-0.02em',animation:visible?'nxCountUp 600ms ease-out':undefined }}>{display}</p>
      <p style={{ fontSize:12,color:T.textMid,fontWeight:500 }}>{kpi.label}</p>
      <p style={{ fontSize:11,color:T.textDim,marginTop:3 }}>{kpi.deltaLabel}</p>
    </div>
  )
}

function ConfirmModal({ title, message, onConfirm, onCancel, accent }: { title:string; message:string; onConfirm:()=>void; onCancel:()=>void; accent:string }) {
  return (
    <div style={{ position:'fixed',inset:0,zIndex:500,display:'flex',alignItems:'center',justifyContent:'center',padding:24 }}>
      <div onClick={onCancel} style={{ position:'absolute',inset:0,background:'rgba(0,0,0,0.7)',backdropFilter:'blur(4px)' }} />
      <div style={{ position:'relative',background:T.card,border:`1px solid ${T.borderMd}`,borderRadius:16,padding:'28px 32px',maxWidth:420,width:'100%',boxShadow:'0 32px 80px rgba(0,0,0,0.5)',animation:'nxFadeUp 250ms ease-out' }}>
        <h3 style={{ fontSize:16,fontWeight:700,color:T.text,marginBottom:8 }}>{title}</h3>
        <p style={{ fontSize:13,color:T.textMid,lineHeight:1.6,marginBottom:24 }}>{message}</p>
        <div style={{ display:'flex',gap:10,justifyContent:'flex-end' }}>
          <button onClick={onCancel} style={{ padding:'9px 20px',borderRadius:8,border:`1px solid ${T.border}`,background:'transparent',color:T.textMid,fontSize:13,fontWeight:500,cursor:'pointer' }}>Cancelar</button>
          <button onClick={onConfirm} style={{ padding:'9px 20px',borderRadius:8,border:'none',background:accent,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer' }}>Confirmar</button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function DashboardAdmin() {
  const [activeProject, setActiveProject] = useState<Project>('clinica')
  const [activeNav, setActiveNav]         = useState<NavItem>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Toasts
  const [toasts, setToasts]   = useState<ToastState[]>([])
  const [toastCtr, setToastCtr] = useState(0)
  const addToast = useCallback((type: ToastState['type'], msg: string) => {
    const id = toastCtr+1; setToastCtr(id)
    setToasts(p=>[...p,{id,type,message:msg}])
    setTimeout(()=>setToasts(p=>p.filter(t=>t.id!==id)),4500)
  }, [toastCtr])
  const removeToast = useCallback((id:number)=>setToasts(p=>p.filter(t=>t.id!==id)),[])

  // Confirm modal
  const [confirm, setConfirm] = useState<{title:string;message:string;onConfirm:()=>void}|null>(null)
  function ask(title:string, message:string, fn: ()=>void) { setConfirm({title,message,onConfirm:fn}) }

  // Project config
  const project = PROJECTS.find(p=>p.id===activeProject)!
  const accent  = project.color
  const accentDim = project.colorDim

  // Chart data per project
  const chartData = activeProject==='clinica' ? CHART_CLINICA : activeProject==='aurea' ? CHART_AUREA : CHART_FLOWDESK

  // KPIs per project
  const kpisByProject: Record<Project, KPI[]> = {
    clinica: [
      { label:'Consultas este mês',  value:284,    delta:12, deltaLabel:'vs. mês anterior', positive:true,  icon:'🩺', color:T.teal,   colorDim:T.tealDim },
      { label:'Receita (R$)',        value:48290,  prefix:'R$ ', suffix:'', delta:8, deltaLabel:'vs. mês anterior', positive:true, icon:'💰', color:T.green, colorDim:T.greenDim },
      { label:'Pacientes novos',     value:67,     delta:15, deltaLabel:'vs. mês anterior', positive:true,  icon:'👤', color:T.blue,   colorDim:T.blueDim  },
      { label:'Taxa de comparecimento',value:94,   suffix:'%', delta:2, deltaLabel:'vs. mês anterior', positive:true, icon:'✓', color:T.purple, colorDim:T.purpleDim },
    ],
    aurea: [
      { label:'Pedidos este mês',    value:312,    delta:18, deltaLabel:'vs. mês anterior', positive:true,  icon:'📦', color:T.gold,   colorDim:T.goldDim  },
      { label:'Receita (R$)',        value:89420,  prefix:'R$ ', suffix:'', delta:22, deltaLabel:'vs. mês anterior', positive:true, icon:'💰', color:T.green, colorDim:T.greenDim },
      { label:'Ticket médio (R$)',   value:287,    prefix:'R$ ', suffix:'', delta:4, deltaLabel:'vs. mês anterior', positive:true, icon:'🏷️', color:T.blue, colorDim:T.blueDim },
      { label:'Taxa de conversão',   value:4,      suffix:'%', delta:3, deltaLabel:'vs. mês anterior', positive:false, icon:'📈', color:T.red, colorDim:T.redDim },
    ],
    flowdesk: [
      { label:'Leads na fila',       value:3854,   delta:28, deltaLabel:'vs. mês anterior', positive:true,  icon:'⚡', color:T.blue,   colorDim:T.blueDim  },
      { label:'Taxa de aprovação',   value:38,     suffix:'%', delta:5, deltaLabel:'vs. mês anterior', positive:true, icon:'✓', color:T.green, colorDim:T.greenDim },
      { label:'MRR esperado',        value:42800,  prefix:'R$ ', suffix:'', delta:31, deltaLabel:'vs. mês anterior', positive:true, icon:'💰', color:T.purple, colorDim:T.purpleDim },
      { label:'Churn estimado',      value:2,      suffix:'%', delta:1, deltaLabel:'vs. mês anterior', positive:false, icon:'↙', color:T.red, colorDim:T.redDim },
    ],
  }
  const kpis = kpisByProject[activeProject]

  // KPI visibility (intersection)
  const kpiRef  = useRef<HTMLDivElement>(null)
  const [kpiVis, setKpiVis] = useState(false)
  const chartRef = useRef<HTMLDivElement>(null)
  const [chartVis, setChartVis] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e])=>{ if(e.isIntersecting) setKpiVis(true) },{threshold:0.1})
    if(kpiRef.current) obs.observe(kpiRef.current)
    return ()=>obs.disconnect()
  },[])
  useEffect(()=>{
    setKpiVis(false)
    const t = setTimeout(()=>setKpiVis(true),200)
    return ()=>clearTimeout(t)
  },[activeProject, activeNav])
  useEffect(()=>{
    setChartVis(false)
    const t = setTimeout(()=>setChartVis(true),300)
    return ()=>clearTimeout(t)
  },[activeProject, activeNav])

  // Live activity feed ticker
  const [activityFeed, setActivityFeed] = useState(MOCK_ACTIVITY)
  const tickerItems = [
    'Novo pedido recebido — R$ 349',
    'Consulta confirmada — Dr. João 09:00',
    'Lead aprovado — cto@techflow.io',
    'Pagamento Pix confirmado',
    'Estoque baixo — Vestido Midi',
    'Nova sessão detectada — Chrome/macOS',
  ]
  const [tickerIndex, setTickerIndex] = useState(0)
  const [tickerVisible, setTickerVisible] = useState(true)
  useInterval(()=>{
    setTickerVisible(false)
    setTimeout(()=>{ setTickerIndex(i=>(i+1)%tickerItems.length); setTickerVisible(true) },300)
  },4000)

  // Users CRUD
  const [users, setUsers] = useState<User[]>(MOCK_USERS)
  const [userSearch, setUserSearch] = useState('')
  const [editingUser, setEditingUser] = useState<number|null>(null)
  const [editDraft, setEditDraft] = useState<Partial<User>>({})
  const [showNewUser, setShowNewUser] = useState(false)
  const [newUser, setNewUser] = useState({ name:'', email:'', role:'viewer' as User['role'] })
  const [newUserErrors, setNewUserErrors] = useState<{name?:string;email?:string}>({})

  function startEdit(user: User) { setEditingUser(user.id); setEditDraft({ role:user.role, status:user.status }) }
  function saveEdit(userId: number) {
    setUsers(p=>p.map(u=>u.id===userId?{...u,...editDraft}:u))
    setEditingUser(null)
    addToast('success','Usuário atualizado com sucesso.')
  }
  function cancelEdit() { setEditingUser(null); setEditDraft({}) }
  function deactivateUser(userId: number) {
    ask('Desativar usuário','Esta ação removerá o acesso do usuário ao painel. Você poderá reativar a qualquer momento.',()=>{
      setUsers(p=>p.map(u=>u.id===userId?{...u,status:'inactive'}:u))
      setConfirm(null)
      addToast('info','Usuário desativado.')
    })
  }
  function createUser() {
    const errors: typeof newUserErrors = {}
    if(!newUser.name.trim()||newUser.name.trim().length<3) errors.name='Nome obrigatório (mín. 3 caracteres)'
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(newUser.email)) errors.email='E-mail inválido'
    if(users.find(u=>u.email===newUser.email)) errors.email='E-mail já cadastrado'
    setNewUserErrors(errors)
    if(Object.keys(errors).length>0) return
    const u: User = {
      id: Math.max(...users.map(u=>u.id))+1,
      name: newUser.name.trim(),
      email: newUser.email.trim().toLowerCase(),
      role: newUser.role,
      status:'pending',
      avatar: newUser.name.trim().split(' ').map(w=>w[0]).join('').toUpperCase().slice(0,2),
      lastSeen:'—',
      createdAt: new Date().toLocaleDateString('pt-BR',{month:'short',year:'numeric'}),
    }
    setUsers(p=>[...p,u])
    setShowNewUser(false)
    setNewUser({name:'',email:'',role:'viewer'})
    setNewUserErrors({})
    addToast('success',`Convite enviado para ${u.email}.`)
  }

  // Appointments CRUD
  const [appointments, setAppointments] = useState<Appointment[]>(MOCK_APPOINTMENTS)
  const [aptFilter, setAptFilter] = useState<'all'|Appointment['status']>('all')
  const [aptSearch, setAptSearch] = useState('')

  function updateAppointmentStatus(id:number, status: Appointment['status']) {
    setAppointments(p=>p.map(a=>a.id===id?{...a,status}:a))
    const labels = { confirmed:'Consulta confirmada', cancelled:'Consulta cancelada', completed:'Consulta concluída', pending:'Consulta marcada como pendente' }
    addToast(status==='cancelled'?'warning':'success', labels[status])
  }
  function deleteAppointment(id:number) {
    ask('Excluir agendamento','Esta ação é irreversível. O registro do agendamento será permanentemente removido.',()=>{
      setAppointments(p=>p.filter(a=>a.id!==id))
      setConfirm(null)
      addToast('info','Agendamento removido.')
    })
  }

  // Orders
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS)
  const [orderFilter, setOrderFilter] = useState<'all'|Order['status']>('all')
  const [expandedOrder, setExpandedOrder] = useState<string|null>(null)

  function updateOrderStatus(id:string, status: Order['status']) {
    setOrders(p=>p.map(o=>o.id===id?{...o,status}:o))
    addToast('success',`Pedido ${id} atualizado para: ${status}`)
  }

  // Leads
  const [leads, setLeads] = useState<Lead[]>(MOCK_LEADS)
  const [leadFilter, setLeadFilter] = useState<'all'|Lead['status']>('all')

  function updateLeadStatus(id:number, status: Lead['status']) {
    setLeads(p=>p.map(l=>l.id===id?{...l,status}:l))
    const msg = status==='approved' ? 'Lead aprovado — acesso liberado.' : 'Lead recusado.'
    addToast(status==='approved'?'success':'warning', msg)
  }
  function exportLeads() {
    const rows = leads.map(l=>`${l.email},${l.plan},${l.position},${l.status},${l.createdAt}`)
    const csv  = ['email,plano,posição,status,data',...rows].join('\n')
    const blob = new Blob([csv],{type:'text/csv'})
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a'); a.href=url; a.download='leads_flowdesk.csv'; a.click()
    URL.revokeObjectURL(url)
    addToast('success','Lista de leads exportada como CSV.')
  }

  // Settings state
  const [settingsTab, setSettingsTab] = useState<'profile'|'security'|'integrations'|'notifications'|'lgpd'>('profile')
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)
  const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS)
  const [notifications, setNotifications] = useState({
    emailOrders:true, emailBookings:true, emailLeads:false,
    pushOrders:false,  pushBookings:true,  pushLeads:true,
    weeklyReport:true, lowStock:true,
  })
  const [profileForm, setProfileForm] = useState({
    companyName: activeProject==='clinica'?'Clínica Serena':activeProject==='aurea'?'Áurea Store':'FlowDesk',
    email:'admin@empresa.com', phone:'(85) 3210-9999', cnpj:'12.345.678/0001-99',
    website:'https://empresa.com', address:'Rua das Flores, 1450 — Meireles, Fortaleza-CE',
  })
  const [profileSaving, setProfileSaving] = useState(false)
  async function saveProfile() {
    setProfileSaving(true); await new Promise(r=>setTimeout(r,900))
    setProfileSaving(false); addToast('success','Configurações salvas com sucesso.')
  }
  function revokeSession(id:number) {
    ask('Encerrar sessão','Isso desconectará o dispositivo imediatamente. O usuário precisará fazer login novamente.',()=>{
      setSessions(p=>p.filter(s=>s.id!==id))
      setConfirm(null); addToast('info','Sessão encerrada.')
    })
  }

  // Nav labels
  const NAV_META: Record<NavItem,{label:string;icon:string}> = {
    overview:     { label:'Visão geral',   icon:'⊞' },
    appointments: { label:'Agendamentos',  icon:'📅' },
    orders:       { label:'Pedidos',       icon:'📦' },
    leads:        { label:'Leads',         icon:'⚡' },
    users:        { label:'Usuários',      icon:'👥' },
    analytics:    { label:'Analytics',     icon:'📊' },
    settings:     { label:'Configurações', icon:'⚙' },
  }

  useEffect(()=>{
    setActiveNav('overview')
    setProfileForm(f=>({...f,companyName:activeProject==='clinica'?'Clínica Serena':activeProject==='aurea'?'Áurea Store':'FlowDesk'}))
  },[activeProject])

  const sidebarW = sidebarCollapsed ? 64 : 232

  // ─── Render ──────────────────────────────────────────────────────────────
  return (
    <div style={{ display:'flex',height:'100%',minHeight:'100vh',background:T.bg,color:T.text,fontFamily:'var(--font-inter,sans-serif)',overflow:'hidden',position:'relative' }}>

      <style>{`
        @keyframes nxFlyIn   { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }
        @keyframes nxFadeUp  { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nxCountUp { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
        @keyframes nxSpin    { to{transform:rotate(360deg)} }
        @keyframes nxPulse   { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes nxTickIn  { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes nxTickOut { from{opacity:1;transform:translateY(0)} to{opacity:0;transform:translateY(-6px)} }
        * { box-sizing:border-box; margin:0; padding:0 }
        :focus-visible { outline:2px solid ${accent}; outline-offset:2px; border-radius:4px }
        ::selection { background:${accent}30 }
        .nx-nav-item:hover { background:rgba(255,255,255,0.05) !important }
        .nx-nav-item.active { background:${accentDim} !important; color:${accent} !important }
        .nx-row:hover { background:rgba(255,255,255,0.025) !important }
        .nx-btn-ghost:hover { background:rgba(255,255,255,0.07) !important }
        .nx-card-hover:hover { border-color:${accent}25 !important; box-shadow:0 8px 32px rgba(0,0,0,0.3) !important }
        .nx-toggle { transition:background 200ms ease }
        .nx-input { background:${T.surface};border:1.5px solid ${T.border};border-radius:8px;padding:9px 12px;font-size:13px;color:${T.text};outline:none;font-family:inherit;width:100%;transition:border-color 150ms ease }
        .nx-input:focus { border-color:${accent} !important }
        .nx-select { appearance:none;cursor:pointer }
        .nx-tab { padding:8px 16px;border-radius:8px;border:none;background:transparent;cursor:pointer;font-size:13px;font-weight:500;transition:all 150ms ease }
        .nx-tab:hover { background:rgba(255,255,255,0.05) }
        .nx-tab.active { background:${accentDim};color:${accent} }
        @media(max-width:768px){
          .nx-hide-m { display:none !important }
          .nx-table-sm td:nth-child(n+4) { display:none }
          .nx-table-sm th:nth-child(n+4) { display:none }
        }
        @media(min-width:769px){ .nx-show-m { display:none !important } }
        ::-webkit-scrollbar { width:4px; height:4px }
        ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:${T.border}; border-radius:2px }
      `}</style>

      <Toast toasts={toasts} remove={removeToast} />
      {confirm && <ConfirmModal title={confirm.title} message={confirm.message} onConfirm={confirm.onConfirm} onCancel={()=>setConfirm(null)} accent={accent} />}

      {/* Mobile overlay */}
      {mobileSidebarOpen && <div onClick={()=>setMobileSidebarOpen(false)} style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',zIndex:99 }} />}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarW, flexShrink:0, background:T.surface,
        borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column',
        transition:'width 250ms cubic-bezier(.4,0,.2,1)',
        position:'relative', zIndex:100,
        // Mobile: absolute
      }} className="nx-hide-m" aria-label="Navegação do painel">

        {/* Logo row */}
        <div style={{ padding:'18px 16px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:10, overflow:'hidden', flexShrink:0 }}>
          <div style={{ width:32,height:32,borderRadius:9,background:accentDim,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }} aria-hidden="true">
            {project.icon}
          </div>
          {!sidebarCollapsed && (
            <div style={{ overflow:'hidden' }}>
              <p style={{ fontSize:13,fontWeight:700,color:T.text,whiteSpace:'nowrap',letterSpacing:'-0.01em' }}>{project.name}</p>
              <p style={{ fontSize:10,color:T.textDim,whiteSpace:'nowrap',letterSpacing:'0.06em',textTransform:'uppercase' }}>{project.tagline}</p>
            </div>
          )}
          <button onClick={()=>setSidebarCollapsed(v=>!v)}
            style={{ marginLeft:'auto',background:'none',border:'none',cursor:'pointer',padding:4,color:T.textDim,flexShrink:0,borderRadius:5,transition:'color 150ms ease' }}
            aria-label={sidebarCollapsed?'Expandir menu':'Recolher menu'}
            onMouseEnter={e=>(e.currentTarget.style.color=T.text)} onMouseLeave={e=>(e.currentTarget.style.color=T.textDim)}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              {sidebarCollapsed ? <path d="M6 4l4 4-4 4"/> : <path d="M10 4L6 8l4 4"/>}
            </svg>
          </button>
        </div>

        {/* Project switcher */}
        <div style={{ padding:'12px 10px', borderBottom:`1px solid ${T.border}`, flexShrink:0 }}>
          {!sidebarCollapsed && <p style={{ fontSize:10,color:T.textDim,letterSpacing:'0.10em',textTransform:'uppercase',marginBottom:6,paddingLeft:6 }}>Projeto ativo</p>}
          {PROJECTS.map(p=>(
            <button key={p.id} onClick={()=>setActiveProject(p.id)}
              title={sidebarCollapsed ? p.name : undefined}
              style={{
                width:'100%',display:'flex',alignItems:'center',gap:10,padding:'7px 8px',borderRadius:9,
                border:'none',background:activeProject===p.id ? `${p.colorDim}` : 'transparent',
                cursor:'pointer',transition:'background 150ms ease',marginBottom:2,overflow:'hidden',
              }}
              onMouseEnter={e=>{ if(activeProject!==p.id) e.currentTarget.style.background='rgba(255,255,255,0.04)' }}
              onMouseLeave={e=>{ if(activeProject!==p.id) e.currentTarget.style.background='transparent' }}>
              <span style={{ fontSize:15,flexShrink:0 }}>{p.icon}</span>
              {!sidebarCollapsed && (
                <span style={{ fontSize:12,fontWeight:activeProject===p.id?700:400,color:activeProject===p.id?p.color:T.textMid,whiteSpace:'nowrap' }}>
                  {p.name}
                </span>
              )}
              {!sidebarCollapsed && activeProject===p.id && (
                <div style={{ marginLeft:'auto',width:6,height:6,borderRadius:'50%',background:p.color,flexShrink:0,animation:'nxPulse 2s ease-in-out infinite' }} />
              )}
            </button>
          ))}
        </div>

        {/* Nav */}
        <nav style={{ flex:1,padding:'10px 10px',overflow:'auto' }} aria-label="Seções do painel">
          {project.navItems.map(item=>{
            const m = NAV_META[item]
            return (
              <button key={item}
                className={`nx-nav-item${activeNav===item?' active':''}`}
                onClick={()=>setActiveNav(item)}
                title={sidebarCollapsed ? m.label : undefined}
                style={{
                  width:'100%',display:'flex',alignItems:'center',gap:10,
                  padding:'9px 10px',borderRadius:9,border:'none',
                  background:'transparent',cursor:'pointer',
                  color:activeNav===item?accent:T.textMid,
                  marginBottom:2,transition:'all 150ms ease',overflow:'hidden',
                }}
                aria-current={activeNav===item?'page':undefined}>
                <span style={{ fontSize:15,flexShrink:0,width:18,textAlign:'center' }} aria-hidden="true">{m.icon}</span>
                {!sidebarCollapsed && <span style={{ fontSize:13,fontWeight:activeNav===item?600:400,whiteSpace:'nowrap' }}>{m.label}</span>}
              </button>
            )
          })}
        </nav>

        {/* User row */}
        <div style={{ padding:'12px 10px',borderTop:`1px solid ${T.border}`,flexShrink:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:10,padding:'6px 8px' }}>
            <div style={{ width:30,height:30,borderRadius:'50%',background:accentDim,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:accent,flexShrink:0 }} aria-label="Ana Lima, Administrador">AL</div>
            {!sidebarCollapsed && (
              <div style={{ overflow:'hidden' }}>
                <p style={{ fontSize:12,fontWeight:600,color:T.text,whiteSpace:'nowrap' }}>Ana Lima</p>
                <p style={{ fontSize:10,color:T.textDim,whiteSpace:'nowrap' }}>Administrador</p>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div style={{ flex:1,display:'flex',flexDirection:'column',overflow:'hidden',minWidth:0 }}>

        {/* Header */}
        <header style={{ height:56,borderBottom:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:16,padding:'0 24px',flexShrink:0,background:T.surface }}>
          {/* Mobile menu */}
          <button className="nx-show-m" onClick={()=>setMobileSidebarOpen(v=>!v)}
            style={{ background:'none',border:'none',cursor:'pointer',color:T.textMid,padding:4 }} aria-label="Abrir menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>

          <div style={{ flex:1,overflow:'hidden' }}>
            <h1 style={{ fontSize:15,fontWeight:700,color:T.text,lineHeight:1 }}>{NAV_META[activeNav].label}</h1>
            <p style={{ fontSize:11,color:T.textDim,marginTop:1 }}>{project.name} · {new Date().toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</p>
          </div>

          {/* Live ticker */}
          <div className="nx-hide-m" style={{ display:'flex',alignItems:'center',gap:8,background:T.card,border:`1px solid ${T.border}`,borderRadius:8,padding:'6px 12px',maxWidth:280,overflow:'hidden' }}>
            <div style={{ width:6,height:6,borderRadius:'50%',background:accent,flexShrink:0,animation:'nxPulse 2s ease-in-out infinite' }} aria-hidden="true"/>
            <span style={{
              fontSize:11,color:T.textMid,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',
              animation: tickerVisible ? 'nxTickIn 300ms ease-out' : 'nxTickOut 300ms ease-in',
            }} aria-live="polite">{tickerItems[tickerIndex]}</span>
          </div>

          <button onClick={()=>setActiveNav('settings')}
            style={{ background:'none',border:'none',cursor:'pointer',padding:6,color:T.textMid,borderRadius:7,transition:'color 150ms ease' }}
            onMouseEnter={e=>(e.currentTarget.style.color=T.text)} onMouseLeave={e=>(e.currentTarget.style.color=T.textMid)}
            aria-label="Configurações">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
            </svg>
          </button>
        </header>

        {/* Page content */}
        <main style={{ flex:1,overflow:'auto',padding:24 }} id="main-content" tabIndex={-1}>

          {/* ══ OVERVIEW ══════════════════════════════════════════════════ */}
          {activeNav === 'overview' && (
            <div style={{ display:'flex',flexDirection:'column',gap:20,animation:'nxFadeUp 350ms ease-out' }}>

              {/* KPI cards */}
              <div ref={kpiRef} style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14 }} className="nx-kpi-grid">
                <style>{`@media(max-width:900px){.nx-kpi-grid{grid-template-columns:repeat(2,1fr) !important}} @media(max-width:480px){.nx-kpi-grid{grid-template-columns:1fr !important}}`}</style>
                {kpis.map(kpi=><KpiCard key={kpi.label} kpi={kpi} accent={accent} visible={kpiVis}/>)}
              </div>

              {/* Chart + Activity */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 340px',gap:16 }} className="nx-chart-grid">
                <style>{`@media(max-width:1024px){.nx-chart-grid{grid-template-columns:1fr !important}}`}</style>

                {/* Revenue chart */}
                <div ref={chartRef} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px' }}>
                  <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:20 }}>
                    <div>
                      <h2 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:3 }}>
                        {activeProject==='clinica' ? 'Consultas mensais' : activeProject==='aurea' ? 'Receita mensal (R$k)' : 'Leads capturados'}
                      </h2>
                      <p style={{ fontSize:12,color:T.textDim }}>Últimos 12 meses</p>
                    </div>
                    <div style={{ display:'flex',alignItems:'center',gap:6,background:T.greenDim,borderRadius:6,padding:'4px 10px' }}>
                      <span style={{ fontSize:11,fontWeight:700,color:T.green }}>↑ +{activeProject==='clinica'?'24':activeProject==='aurea'?'31':'44'}% ano</span>
                    </div>
                  </div>
                  <div style={{ display:'flex',alignItems:'flex-end',gap:4,height:140 }}>
                    {chartData.map((v,i)=>(
                      <AnimatedBar key={i} value={v} max={Math.max(...chartData)} index={i} color={accent} visible={chartVis}/>
                    ))}
                  </div>
                </div>

                {/* Live activity */}
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px',overflow:'hidden' }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:16 }}>
                    <h2 style={{ fontSize:14,fontWeight:700,color:T.text }}>Atividade recente</h2>
                    <div style={{ display:'flex',alignItems:'center',gap:6 }}>
                      <div style={{ width:6,height:6,borderRadius:'50%',background:T.green,animation:'nxPulse 2s infinite' }} aria-hidden="true"/>
                      <span style={{ fontSize:10,color:T.green,fontWeight:600 }}>Ao vivo</span>
                    </div>
                  </div>
                  <div style={{ display:'flex',flexDirection:'column',gap:0 }} aria-label="Feed de atividade">
                    {activityFeed.slice(0,6).map((item,i)=>(
                      <div key={item.id} style={{ display:'flex',gap:10,padding:'10px 0',borderBottom:i<5?`1px solid ${T.border}`:'none',animation:`nxFadeUp 300ms ${i*50}ms ease-out both` }}>
                        <div style={{ width:28,height:28,borderRadius:8,background:`${item.color}15`,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:11,color:item.color,fontWeight:700 }}>
                          {item.type==='payment'?'$':item.type==='create'?'+':item.type==='update'?'↻':item.type==='login'?'→':'×'}
                        </div>
                        <div style={{ flex:1,minWidth:0 }}>
                          <p style={{ fontSize:12,color:T.textMid,lineHeight:1.4,marginBottom:2 }}>{item.description}</p>
                          <p style={{ fontSize:10,color:T.textDim }}>{item.user} · {item.time} atrás</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom row: funnel + quick stats */}
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }} className="nx-bottom-grid">
                <style>{`@media(max-width:800px){.nx-bottom-grid{grid-template-columns:1fr !important}}`}</style>

                {/* Conversion funnel */}
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px' }}>
                  <h2 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:16 }}>Funil de conversão</h2>
                  <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
                    {FUNNEL_DATA.map((f,i)=>(
                      <div key={f.label}>
                        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                          <span style={{ fontSize:12,color:T.textMid }}>{f.label}</span>
                          <span style={{ fontSize:12,fontWeight:600,color:T.text }}>{f.value.toLocaleString('pt-BR')} <span style={{ color:T.textDim,fontWeight:400 }}>({f.pct}%)</span></span>
                        </div>
                        <div style={{ height:6,borderRadius:3,background:T.border,overflow:'hidden' }}>
                          <div style={{ height:'100%',borderRadius:3,background:accent,width:chartVis?`${f.pct}%`:'0%',transition:`width 600ms cubic-bezier(.4,0,.2,1) ${i*100}ms`,opacity:1-i*0.15 }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Channel breakdown */}
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px' }}>
                  <h2 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:16 }}>Canais de aquisição</h2>
                  <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                    {CHANNEL_DATA.map((c,i)=>(
                      <div key={c.label}>
                        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                            <div style={{ width:8,height:8,borderRadius:2,background:c.color,flexShrink:0 }}/>
                            <span style={{ fontSize:12,color:T.textMid }}>{c.label}</span>
                          </div>
                          <span style={{ fontSize:12,fontWeight:600,color:T.text }}>{c.pct}%</span>
                        </div>
                        <div style={{ height:4,borderRadius:2,background:T.border,overflow:'hidden' }}>
                          <div style={{ height:'100%',borderRadius:2,background:c.color,width:chartVis?`${c.pct}%`:'0%',transition:`width 500ms cubic-bezier(.4,0,.2,1) ${i*80}ms` }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══ APPOINTMENTS ══════════════════════════════════════════════ */}
          {activeNav === 'appointments' && (
            <div style={{ display:'flex',flexDirection:'column',gap:16,animation:'nxFadeUp 350ms ease-out' }}>
              <div style={{ display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',justifyContent:'space-between' }}>
                <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                  {(['all','confirmed','pending','cancelled','completed'] as const).map(f=>(
                    <button key={f} onClick={()=>setAptFilter(f)}
                      className={`nx-tab${aptFilter===f?' active':''}`}
                      style={{ fontSize:12,color:aptFilter===f?accent:T.textMid }}>
                      {f==='all'?'Todos':f==='confirmed'?'Confirmados':f==='pending'?'Pendentes':f==='cancelled'?'Cancelados':'Concluídos'}
                      <span style={{ marginLeft:6,fontSize:10,background:aptFilter===f?`${accent}20`:T.border,color:aptFilter===f?accent:T.textDim,padding:'1px 6px',borderRadius:4 }}>
                        {f==='all'?appointments.length:appointments.filter(a=>a.status===f).length}
                      </span>
                    </button>
                  ))}
                </div>
                <input type="search" placeholder="Buscar paciente…" value={aptSearch}
                  onChange={e=>setAptSearch(e.target.value.slice(0,80))}
                  className="nx-input" style={{ maxWidth:220,padding:'7px 12px',fontSize:12 }}
                  aria-label="Buscar agendamento" />
              </div>

              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse' }} aria-label="Tabela de agendamentos" className="nx-table-sm">
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                        {['Protocolo','Paciente','Médico','Especialidade','Data','Hora','Plano','Status','Ações'].map(h=>(
                          <th key={h} style={{ padding:'12px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {appointments
                        .filter(a=>aptFilter==='all'||a.status===aptFilter)
                        .filter(a=>!aptSearch||a.patient.toLowerCase().includes(aptSearch.toLowerCase())||a.doctor.toLowerCase().includes(aptSearch.toLowerCase()))
                        .map(apt=>(
                          <tr key={apt.id} className="nx-row" style={{ borderBottom:`1px solid ${T.border}`,transition:'background 150ms ease' }}>
                            <td style={{ padding:'12px 14px',fontFamily:'monospace',fontSize:11,color:T.textDim }}>{apt.protocol}</td>
                            <td style={{ padding:'12px 14px',fontSize:13,fontWeight:600,color:T.text,whiteSpace:'nowrap' }}>{apt.patient}</td>
                            <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid,whiteSpace:'nowrap' }}>{apt.doctor}</td>
                            <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid }}>{apt.specialty}</td>
                            <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid,whiteSpace:'nowrap' }}>{apt.date}</td>
                            <td style={{ padding:'12px 14px',fontSize:12,fontWeight:600,color:T.text }}>{apt.time}</td>
                            <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid }}>{apt.plan}</td>
                            <td style={{ padding:'12px 14px' }}><StatusBadge status={apt.status}/></td>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ display:'flex',gap:4 }}>
                                {apt.status==='pending' && (
                                  <button onClick={()=>updateAppointmentStatus(apt.id,'confirmed')}
                                    title="Confirmar"
                                    style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.green}30`,background:T.greenDim,color:T.green,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' }}>
                                    ✓ Confirmar
                                  </button>
                                )}
                                {apt.status==='confirmed' && (
                                  <button onClick={()=>updateAppointmentStatus(apt.id,'completed')}
                                    title="Concluir"
                                    style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.blue}30`,background:T.blueDim,color:T.blue,fontSize:11,fontWeight:600,cursor:'pointer' }}>
                                    ✓ Concluir
                                  </button>
                                )}
                                {apt.status!=='cancelled'&&apt.status!=='completed' && (
                                  <button onClick={()=>ask('Cancelar consulta',`Cancelar a consulta de ${apt.patient} com ${apt.doctor}?`,()=>{updateAppointmentStatus(apt.id,'cancelled');setConfirm(null)})}
                                    style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.red}20`,background:T.redDim,color:T.red,fontSize:11,cursor:'pointer' }}>
                                    ✕
                                  </button>
                                )}
                                <button onClick={()=>ask('Excluir agendamento',`Excluir permanentemente o registro de ${apt.patient}?`,()=>{deleteAppointment(apt.id);setConfirm(null)})}
                                  style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.border}`,background:'transparent',color:T.textDim,fontSize:11,cursor:'pointer' }}>
                                  🗑
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {appointments.filter(a=>aptFilter==='all'||a.status===aptFilter).length===0 && (
                  <div style={{ textAlign:'center',padding:'40px 0',color:T.textDim,fontSize:14 }}>Nenhum agendamento encontrado.</div>
                )}
              </div>
            </div>
          )}

          {/* ══ ORDERS ════════════════════════════════════════════════════ */}
          {activeNav === 'orders' && (
            <div style={{ display:'flex',flexDirection:'column',gap:16,animation:'nxFadeUp 350ms ease-out' }}>
              <div style={{ display:'flex',flexWrap:'wrap',gap:6 }}>
                {(['all','pending','processing','shipped','delivered','cancelled'] as const).map(f=>(
                  <button key={f} onClick={()=>setOrderFilter(f)}
                    className={`nx-tab${orderFilter===f?' active':''}`}
                    style={{ fontSize:12,color:orderFilter===f?accent:T.textMid }}>
                    {f==='all'?'Todos':f==='pending'?'Pendentes':f==='processing'?'Processando':f==='shipped'?'Enviados':f==='delivered'?'Entregues':'Cancelados'}
                    <span style={{ marginLeft:6,fontSize:10,background:orderFilter===f?`${accent}20`:T.border,color:orderFilter===f?accent:T.textDim,padding:'1px 6px',borderRadius:4 }}>
                      {f==='all'?orders.length:orders.filter(o=>o.status===f).length}
                    </span>
                  </button>
                ))}
              </div>

              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden' }}>
                <div style={{ overflowX:'auto' }}>
                  <table style={{ width:'100%',borderCollapse:'collapse' }} aria-label="Tabela de pedidos">
                    <thead>
                      <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                        {['Pedido','Cliente','Itens','Total','Pagamento','Status','Data','Ações'].map(h=>(
                          <th key={h} style={{ padding:'12px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders
                        .filter(o=>orderFilter==='all'||o.status===orderFilter)
                        .map(order=>(
                        <>
                          <tr key={order.id} className="nx-row" style={{ borderBottom:`1px solid ${T.border}`,transition:'background 150ms ease',cursor:'pointer' }}
                            onClick={()=>setExpandedOrder(expandedOrder===order.id?null:order.id)}>
                            <td style={{ padding:'12px 14px',fontFamily:'monospace',fontSize:11,color:T.textDim }}>{order.id}</td>
                            <td style={{ padding:'12px 14px',fontSize:13,fontWeight:600,color:T.text,whiteSpace:'nowrap' }}>{order.customer}</td>
                            <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid,textAlign:'center' }}>{order.items}</td>
                            <td style={{ padding:'12px 14px',fontSize:13,fontWeight:700,color:T.text }}>{formatBRL(order.total)}</td>
                            <td style={{ padding:'12px 14px' }}><StatusBadge status={order.payment}/></td>
                            <td style={{ padding:'12px 14px' }}><StatusBadge status={order.status}/></td>
                            <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid,whiteSpace:'nowrap' }}>{order.date}</td>
                            <td style={{ padding:'12px 14px' }}>
                              <div style={{ display:'flex',gap:4 }}>
                                {(['processing','shipped','delivered'] as Order['status'][]).map(s=>{
                                  if(order.status===s||order.status==='cancelled'||order.status==='delivered') return null
                                  const labels: Record<string,string> = {processing:'Processar',shipped:'Enviar',delivered:'Entregar'}
                                  return (
                                    <button key={s} onClick={e=>{e.stopPropagation();updateOrderStatus(order.id,s)}}
                                      style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${accent}30`,background:accentDim,color:accent,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' }}>
                                      {labels[s]}
                                    </button>
                                  )
                                })}
                                {order.status!=='cancelled'&&order.status!=='delivered'&&(
                                  <button onClick={e=>{e.stopPropagation();ask('Cancelar pedido',`Cancelar o pedido ${order.id}?`,()=>{updateOrderStatus(order.id,'cancelled');setConfirm(null)})}}
                                    style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.red}20`,background:T.redDim,color:T.red,fontSize:11,cursor:'pointer' }}>✕</button>
                                )}
                              </div>
                            </td>
                          </tr>
                          {expandedOrder===order.id && (
                            <tr style={{ background:`${accent}05` }}>
                              <td colSpan={8} style={{ padding:'12px 14px 16px' }}>
                                <div style={{ display:'flex',gap:20,flexWrap:'wrap' }}>
                                  <div>
                                    <p style={{ fontSize:10,color:T.textDim,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:3 }}>Endereço</p>
                                    <p style={{ fontSize:12,color:T.textMid }}>{order.address}</p>
                                  </div>
                                  <div>
                                    <p style={{ fontSize:10,color:T.textDim,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:3 }}>Itens</p>
                                    <p style={{ fontSize:12,color:T.textMid }}>{order.items} produto{order.items>1?'s':''}</p>
                                  </div>
                                  <div>
                                    <p style={{ fontSize:10,color:T.textDim,letterSpacing:'0.08em',textTransform:'uppercase',marginBottom:3 }}>Forma de pagamento</p>
                                    <p style={{ fontSize:12,color:T.textMid }}>{order.payment==='credit'?'Cartão de crédito':order.payment==='pix'?'Pix':'Boleto bancário'}</p>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ══ LEADS ═════════════════════════════════════════════════════ */}
          {activeNav === 'leads' && (
            <div style={{ display:'flex',flexDirection:'column',gap:16,animation:'nxFadeUp 350ms ease-out' }}>
              <div style={{ display:'flex',flexWrap:'wrap',gap:10,alignItems:'center',justifyContent:'space-between' }}>
                <div style={{ display:'flex',gap:6,flexWrap:'wrap' }}>
                  {(['all','waiting','approved','rejected'] as const).map(f=>(
                    <button key={f} onClick={()=>setLeadFilter(f)}
                      className={`nx-tab${leadFilter===f?' active':''}`}
                      style={{ fontSize:12,color:leadFilter===f?accent:T.textMid }}>
                      {f==='all'?'Todos':f==='waiting'?'Aguardando':f==='approved'?'Aprovados':'Recusados'}
                      <span style={{ marginLeft:6,fontSize:10,background:leadFilter===f?`${accent}20`:T.border,color:leadFilter===f?accent:T.textDim,padding:'1px 6px',borderRadius:4 }}>
                        {f==='all'?leads.length:leads.filter(l=>l.status===f).length}
                      </span>
                    </button>
                  ))}
                </div>
                <button onClick={exportLeads}
                  style={{ display:'flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,border:`1px solid ${T.border}`,background:'transparent',color:T.textMid,fontSize:12,fontWeight:500,cursor:'pointer',transition:'all 150ms ease' }}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${accent}40`;e.currentTarget.style.color=accent}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMid}}>
                  ↓ Exportar CSV
                </button>
              </div>

              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden' }}>
                <table style={{ width:'100%',borderCollapse:'collapse' }} aria-label="Lista de leads">
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                      {['#','E-mail','Plano','Posição','Fonte','Data','Status','Ações'].map(h=>(
                        <th key={h} style={{ padding:'12px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {leads.filter(l=>leadFilter==='all'||l.status===leadFilter).map(lead=>(
                      <tr key={lead.id} className="nx-row" style={{ borderBottom:`1px solid ${T.border}`,transition:'background 150ms ease' }}>
                        <td style={{ padding:'12px 14px',fontSize:12,color:T.textDim,fontFamily:'monospace' }}>{lead.id}</td>
                        <td style={{ padding:'12px 14px',fontSize:13,fontWeight:600,color:T.text }}>{lead.email}</td>
                        <td style={{ padding:'12px 14px' }}><StatusBadge status={lead.plan==='Enterprise'?'admin':lead.plan==='Pro'?'editor':'viewer'}/></td>
                        <td style={{ padding:'12px 14px',fontSize:13,fontWeight:700,color:accent,fontFamily:'monospace' }}>#{lead.position.toLocaleString('pt-BR')}</td>
                        <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid }}>{lead.source}</td>
                        <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid,whiteSpace:'nowrap' }}>{lead.createdAt}</td>
                        <td style={{ padding:'12px 14px' }}><StatusBadge status={lead.status}/></td>
                        <td style={{ padding:'12px 14px' }}>
                          {lead.status==='waiting' && (
                            <div style={{ display:'flex',gap:4 }}>
                              <button onClick={()=>updateLeadStatus(lead.id,'approved')}
                                style={{ padding:'4px 10px',borderRadius:6,border:`1px solid ${T.teal}30`,background:T.tealDim,color:T.teal,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' }}>
                                ✓ Aprovar
                              </button>
                              <button onClick={()=>updateLeadStatus(lead.id,'rejected')}
                                style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.red}20`,background:T.redDim,color:T.red,fontSize:11,cursor:'pointer' }}>
                                ✕
                              </button>
                            </div>
                          )}
                          {lead.status!=='waiting' && (
                            <button onClick={()=>updateLeadStatus(lead.id,'waiting')}
                              style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.border}`,background:'transparent',color:T.textDim,fontSize:11,cursor:'pointer' }}>
                              ↺ Reverter
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ USERS ═════════════════════════════════════════════════════ */}
          {activeNav === 'users' && (
            <div style={{ display:'flex',flexDirection:'column',gap:16,animation:'nxFadeUp 350ms ease-out' }}>
              <div style={{ display:'flex',gap:10,alignItems:'center',justifyContent:'space-between',flexWrap:'wrap' }}>
                <input type="search" placeholder="Buscar usuário…" value={userSearch}
                  onChange={e=>setUserSearch(e.target.value.slice(0,80))}
                  className="nx-input" style={{ maxWidth:260,padding:'8px 12px',fontSize:13 }} aria-label="Buscar usuário" />
                <button onClick={()=>setShowNewUser(v=>!v)}
                  style={{ display:'flex',alignItems:'center',gap:6,padding:'9px 16px',borderRadius:8,border:'none',background:accent,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',transition:'background 150ms ease' }}
                  onMouseEnter={e=>(e.currentTarget.style.background=T.blueMid)} onMouseLeave={e=>(e.currentTarget.style.background=accent)}>
                  + Novo usuário
                </button>
              </div>

              {/* New user form */}
              {showNewUser && (
                <div style={{ background:T.card,border:`1px solid ${accent}30`,borderRadius:14,padding:'20px 24px',animation:'nxFadeUp 250ms ease-out' }}>
                  <h3 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:16 }}>Convidar novo usuário</h3>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr auto',gap:10,alignItems:'end' }} className="nx-form-row">
                    <style>{`@media(max-width:640px){.nx-form-row{grid-template-columns:1fr !important}}`}</style>
                    <div>
                      <label htmlFor="nu-name" style={{ display:'block',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:5 }}>Nome completo</label>
                      <input id="nu-name" type="text" value={newUser.name} onChange={e=>setNewUser(p=>({...p,name:e.target.value.slice(0,80)}))}
                        className="nx-input" placeholder="João Silva"
                        aria-invalid={!!newUserErrors.name} aria-describedby={newUserErrors.name?'nu-name-err':undefined} />
                      {newUserErrors.name && <p id="nu-name-err" role="alert" style={{fontSize:11,color:T.red,marginTop:3}}>{newUserErrors.name}</p>}
                    </div>
                    <div>
                      <label htmlFor="nu-email" style={{ display:'block',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:5 }}>E-mail</label>
                      <input id="nu-email" type="email" value={newUser.email} onChange={e=>setNewUser(p=>({...p,email:e.target.value.slice(0,254)}))}
                        className="nx-input" placeholder="usuario@empresa.com"
                        aria-invalid={!!newUserErrors.email} aria-describedby={newUserErrors.email?'nu-email-err':undefined} />
                      {newUserErrors.email && <p id="nu-email-err" role="alert" style={{fontSize:11,color:T.red,marginTop:3}}>{newUserErrors.email}</p>}
                    </div>
                    <div style={{ display:'flex',gap:8 }}>
                      <div>
                        <label htmlFor="nu-role" style={{ display:'block',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:5 }}>Papel</label>
                        <select id="nu-role" value={newUser.role} onChange={e=>setNewUser(p=>({...p,role:e.target.value as User['role']}))}
                          className="nx-input nx-select" style={{ width:110 }}>
                          <option value="viewer">Viewer</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <div style={{ alignSelf:'flex-end',display:'flex',gap:6 }}>
                        <button onClick={createUser}
                          style={{ padding:'9px 16px',borderRadius:8,border:'none',background:accent,color:'#fff',fontSize:13,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' }}>
                          Enviar convite
                        </button>
                        <button onClick={()=>{setShowNewUser(false);setNewUser({name:'',email:'',role:'viewer'});setNewUserErrors({})}}
                          style={{ padding:'9px 12px',borderRadius:8,border:`1px solid ${T.border}`,background:'transparent',color:T.textMid,fontSize:13,cursor:'pointer' }}>
                          ✕
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,overflow:'hidden' }}>
                <table style={{ width:'100%',borderCollapse:'collapse' }} aria-label="Tabela de usuários">
                  <thead>
                    <tr style={{ borderBottom:`1px solid ${T.border}` }}>
                      {['Usuário','E-mail','Papel','Status','Último acesso','Desde','Ações'].map(h=>(
                        <th key={h} style={{ padding:'12px 14px',textAlign:'left',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',whiteSpace:'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users
                      .filter(u=>!userSearch||u.name.toLowerCase().includes(userSearch.toLowerCase())||u.email.toLowerCase().includes(userSearch.toLowerCase()))
                      .map(user=>(
                        <tr key={user.id} className="nx-row" style={{ borderBottom:`1px solid ${T.border}`,transition:'background 150ms ease' }}>
                          <td style={{ padding:'12px 14px' }}>
                            <div style={{ display:'flex',alignItems:'center',gap:10 }}>
                              <div style={{ width:32,height:32,borderRadius:'50%',background:accentDim,display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:700,color:accent,flexShrink:0 }} aria-hidden="true">{user.avatar}</div>
                              <span style={{ fontSize:13,fontWeight:600,color:T.text,whiteSpace:'nowrap' }}>{user.name}</span>
                            </div>
                          </td>
                          <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid }}>{user.email}</td>
                          <td style={{ padding:'12px 14px' }}>
                            {editingUser===user.id ? (
                              <select value={editDraft.role||user.role} onChange={e=>setEditDraft(p=>({...p,role:e.target.value as User['role']}))}
                                className="nx-input nx-select" style={{ width:100,padding:'5px 8px',fontSize:12 }} aria-label="Papel do usuário">
                                <option value="viewer">Viewer</option>
                                <option value="editor">Editor</option>
                                <option value="admin">Admin</option>
                              </select>
                            ) : <StatusBadge status={user.role}/>}
                          </td>
                          <td style={{ padding:'12px 14px' }}>
                            {editingUser===user.id ? (
                              <select value={editDraft.status||user.status} onChange={e=>setEditDraft(p=>({...p,status:e.target.value as User['status']}))}
                                className="nx-input nx-select" style={{ width:110,padding:'5px 8px',fontSize:12 }} aria-label="Status do usuário">
                                <option value="active">Ativo</option>
                                <option value="inactive">Inativo</option>
                                <option value="pending">Pendente</option>
                              </select>
                            ) : <StatusBadge status={user.status}/>}
                          </td>
                          <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid,whiteSpace:'nowrap' }}>{user.lastSeen}</td>
                          <td style={{ padding:'12px 14px',fontSize:12,color:T.textMid }}>{user.createdAt}</td>
                          <td style={{ padding:'12px 14px' }}>
                            {editingUser===user.id ? (
                              <div style={{ display:'flex',gap:4 }}>
                                <button onClick={()=>saveEdit(user.id)}
                                  style={{ padding:'4px 10px',borderRadius:6,border:'none',background:accent,color:'#fff',fontSize:11,fontWeight:600,cursor:'pointer' }}>Salvar</button>
                                <button onClick={cancelEdit}
                                  style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.border}`,background:'transparent',color:T.textMid,fontSize:11,cursor:'pointer' }}>✕</button>
                              </div>
                            ) : (
                              <div style={{ display:'flex',gap:4 }}>
                                <button onClick={()=>startEdit(user)}
                                  style={{ padding:'4px 10px',borderRadius:6,border:`1px solid ${T.border}`,background:'transparent',color:T.textMid,fontSize:11,cursor:'pointer',transition:'all 150ms ease' }}
                                  onMouseEnter={e=>{e.currentTarget.style.borderColor=`${accent}40`;e.currentTarget.style.color=accent}}
                                  onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.textMid}}>
                                  ✏ Editar
                                </button>
                                {user.status!=='inactive' && (
                                  <button onClick={()=>deactivateUser(user.id)}
                                    style={{ padding:'4px 8px',borderRadius:6,border:`1px solid ${T.red}20`,background:T.redDim,color:T.red,fontSize:11,cursor:'pointer' }}>
                                    🚫
                                  </button>
                                )}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ══ ANALYTICS ═════════════════════════════════════════════════ */}
          {activeNav === 'analytics' && (
            <div style={{ display:'flex',flexDirection:'column',gap:16,animation:'nxFadeUp 350ms ease-out' }}>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14 }} className="nx-kpi-grid">
                {[
                  { label:'Visitantes únicos', value:'12.480',  delta:'+18%', pos:true  },
                  { label:'Tempo médio/sessão',value:'3m 42s',  delta:'+6%',  pos:true  },
                  { label:'Bounce rate',        value:'34.2%',  delta:'-3%',  pos:true  },
                ].map(s=>(
                  <div key={s.label} style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'18px 20px' }}>
                    <div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8 }}>
                      <p style={{ fontSize:12,color:T.textMid,fontWeight:500 }}>{s.label}</p>
                      <span style={{ fontSize:11,fontWeight:700,color:s.pos?T.green:T.red,background:s.pos?T.greenDim:T.redDim,padding:'2px 7px',borderRadius:5 }}>{s.delta}</span>
                    </div>
                    <p style={{ fontFamily:'var(--font-syne,sans-serif)',fontSize:24,fontWeight:700,color:T.text,letterSpacing:'-0.02em' }}>{s.value}</p>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }} className="nx-bottom-grid">
                {/* Devices */}
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px' }}>
                  <h2 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:16 }}>Dispositivos</h2>
                  <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                    {DEVICE_DATA.map(d=>(
                      <div key={d.label}>
                        <div style={{ display:'flex',justifyContent:'space-between',marginBottom:5 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:7 }}>
                            <div style={{ width:8,height:8,borderRadius:2,background:d.color }}/>
                            <span style={{ fontSize:12,color:T.textMid }}>{d.label}</span>
                          </div>
                          <span style={{ fontSize:12,fontWeight:700,color:T.text }}>{d.pct}%</span>
                        </div>
                        <div style={{ height:5,borderRadius:3,background:T.border,overflow:'hidden' }}>
                          <div style={{ height:'100%',borderRadius:3,background:d.color,width:chartVis?`${d.pct}%`:'0%',transition:'width 600ms ease' }}/>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top pages */}
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px' }}>
                  <h2 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:14 }}>Top páginas</h2>
                  <table style={{ width:'100%',borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        {['Página','Views','Tempo','Bounce'].map(h=>(
                          <th key={h} style={{ padding:'4px 0 10px',textAlign:'left',fontSize:10,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',paddingRight:12 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {TOP_PAGES.map((p,i)=>(
                        <tr key={p.page} style={{ borderTop:`1px solid ${T.border}` }}>
                          <td style={{ padding:'9px 0',fontSize:12,color:T.textMid,fontFamily:'monospace',paddingRight:12 }}>{p.page}</td>
                          <td style={{ padding:'9px 0',fontSize:12,fontWeight:600,color:T.text,paddingRight:12 }}>{p.views}</td>
                          <td style={{ padding:'9px 0',fontSize:12,color:T.textMid,paddingRight:12 }}>{p.avg}</td>
                          <td style={{ padding:'9px 0',fontSize:12,color:T.textMid }}>{p.bounce}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Funnel */}
              <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 22px' }}>
                <h2 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:16 }}>Funil de conversão — últimos 30 dias</h2>
                <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
                  {FUNNEL_DATA.map((f,i)=>(
                    <div key={f.label} style={{ display:'flex',alignItems:'center',gap:14 }}>
                      <span style={{ fontSize:12,color:T.textMid,width:120,flexShrink:0 }}>{f.label}</span>
                      <div style={{ flex:1,height:28,borderRadius:6,background:T.border,overflow:'hidden' }}>
                        <div style={{
                          height:'100%',borderRadius:6,
                          background:`linear-gradient(90deg, ${accent}cc, ${accent}80)`,
                          width:chartVis?`${f.pct}%`:'0%',
                          transition:`width 700ms cubic-bezier(.4,0,.2,1) ${i*100}ms`,
                          display:'flex',alignItems:'center',paddingLeft:10,
                        }}>
                          {f.pct > 10 && <span style={{ fontSize:12,fontWeight:700,color:'#fff',whiteSpace:'nowrap' }}>{f.value.toLocaleString('pt-BR')}</span>}
                        </div>
                      </div>
                      <span style={{ fontSize:12,fontWeight:700,color:T.text,width:44,textAlign:'right',flexShrink:0 }}>{f.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ══ SETTINGS ══════════════════════════════════════════════════ */}
          {activeNav === 'settings' && (
            <div style={{ display:'flex',flexDirection:'column',gap:16,animation:'nxFadeUp 350ms ease-out' }}>
              {/* Settings tabs */}
              <div style={{ display:'flex',gap:4,background:T.card,border:`1px solid ${T.border}`,borderRadius:12,padding:4,flexWrap:'wrap' }}>
                {([
                  { id:'profile',       label:'Perfil',        icon:'🏢' },
                  { id:'security',      label:'Segurança',     icon:'🔒' },
                  { id:'integrations',  label:'Integrações',   icon:'🔗' },
                  { id:'notifications', label:'Notificações',  icon:'🔔' },
                  { id:'lgpd',          label:'LGPD / Dados',  icon:'🛡' },
                ] as const).map(tab=>(
                  <button key={tab.id} onClick={()=>setSettingsTab(tab.id)}
                    className={`nx-tab${settingsTab===tab.id?' active':''}`}
                    style={{ fontSize:12,color:settingsTab===tab.id?accent:T.textMid,display:'flex',alignItems:'center',gap:5 }}>
                    <span aria-hidden="true">{tab.icon}</span>{tab.label}
                  </button>
                ))}
              </div>

              {/* Profile */}
              {settingsTab==='profile' && (
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'24px 28px',animation:'nxFadeUp 250ms ease-out' }}>
                  <h2 style={{ fontSize:15,fontWeight:700,color:T.text,marginBottom:20 }}>Informações da empresa</h2>
                  <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:16 }} className="nx-form-row">
                    {([
                      { id:'companyName', label:'Nome da empresa',   placeholder:'Clínica Serena' },
                      { id:'email',       label:'E-mail de contato', placeholder:'contato@empresa.com' },
                      { id:'phone',       label:'Telefone',          placeholder:'(85) 3210-9999' },
                      { id:'cnpj',        label:'CNPJ',              placeholder:'00.000.000/0001-00' },
                      { id:'website',     label:'Website',           placeholder:'https://empresa.com' },
                      { id:'address',     label:'Endereço',          placeholder:'Rua, Número — Bairro' },
                    ] as const).map(f=>(
                      <div key={f.id}>
                        <label htmlFor={`pf-${f.id}`} style={{ display:'block',fontSize:11,fontWeight:600,color:T.textDim,letterSpacing:'0.06em',textTransform:'uppercase',marginBottom:5 }}>{f.label}</label>
                        <input id={`pf-${f.id}`} type="text"
                          value={profileForm[f.id]}
                          onChange={e=>setProfileForm(p=>({...p,[f.id]:e.target.value.slice(0,200)}))}
                          className="nx-input" placeholder={f.placeholder} />
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:20,display:'flex',justifyContent:'flex-end',gap:10 }}>
                    <button onClick={saveProfile} disabled={profileSaving}
                      style={{ padding:'10px 24px',borderRadius:9,border:'none',background:accent,color:'#fff',fontSize:13,fontWeight:600,cursor:profileSaving?'wait':'pointer',display:'flex',alignItems:'center',gap:8 }}>
                      {profileSaving && <span style={{ width:14,height:14,border:'2px solid rgba(255,255,255,0.3)',borderTopColor:'#fff',borderRadius:'50%',animation:'nxSpin 600ms linear infinite' }} aria-hidden="true"/>}
                      {profileSaving?'Salvando…':'Salvar alterações'}
                    </button>
                  </div>
                </div>
              )}

              {/* Security */}
              {settingsTab==='security' && (
                <div style={{ display:'flex',flexDirection:'column',gap:14,animation:'nxFadeUp 250ms ease-out' }}>
                  {/* 2FA */}
                  <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 24px' }}>
                    <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16 }}>
                      <div>
                        <h3 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:4 }}>Autenticação de dois fatores (2FA)</h3>
                        <p style={{ fontSize:13,color:T.textMid,lineHeight:1.6,maxWidth:440 }}>
                          Adiciona uma camada extra de proteção à sua conta. Recomendado para contas admin.
                          {twoFAEnabled && <span style={{ color:T.green,fontWeight:600 }}> Ativo — sua conta está protegida.</span>}
                        </p>
                      </div>
                      <button
                        onClick={()=>{ setTwoFAEnabled(v=>!v); addToast(twoFAEnabled?'info':'success', twoFAEnabled?'2FA desativado. Sua conta está menos protegida.':'2FA ativado com sucesso!') }}
                        role="switch" aria-checked={twoFAEnabled}
                        style={{
                          width:48,height:26,borderRadius:13,border:'none',cursor:'pointer',flexShrink:0,
                          background:twoFAEnabled?T.green:T.textDim,
                          transition:'background 200ms ease',
                          position:'relative',
                        }}>
                        <div style={{
                          position:'absolute',top:3,left:twoFAEnabled?24:3,
                          width:20,height:20,borderRadius:'50%',background:'#fff',
                          transition:'left 200ms ease',boxShadow:'0 1px 3px rgba(0,0,0,0.3)',
                        }}/>
                      </button>
                    </div>
                  </div>

                  {/* Active sessions */}
                  <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 24px' }}>
                    <h3 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:16 }}>Sessões ativas</h3>
                    <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
                      {sessions.map((s,i)=>(
                        <div key={s.id} style={{ display:'flex',alignItems:'center',gap:14,padding:'14px 0',borderTop:i>0?`1px solid ${T.border}`:'none' }}>
                          <div style={{ width:36,height:36,borderRadius:9,background:s.current?accentDim:T.surface,display:'flex',alignItems:'center',justifyContent:'center',fontSize:16,flexShrink:0 }} aria-hidden="true">
                            {s.device.includes('iPhone')||s.device.includes('Android')?'📱':'💻'}
                          </div>
                          <div style={{ flex:1,minWidth:0 }}>
                            <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:2 }}>
                              <p style={{ fontSize:13,fontWeight:600,color:T.text,truncate:true }}>{s.device}</p>
                              {s.current && <span style={{ fontSize:10,fontWeight:700,background:accentDim,color:accent,padding:'2px 6px',borderRadius:4 }}>Sessão atual</span>}
                            </div>
                            <p style={{ fontSize:11,color:T.textDim }}>{s.location} · {s.ip} · {s.lastActive}</p>
                          </div>
                          {!s.current && (
                            <button onClick={()=>revokeSession(s.id)}
                              style={{ padding:'5px 12px',borderRadius:7,border:`1px solid ${T.red}30`,background:T.redDim,color:T.red,fontSize:11,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap' }}>
                              Encerrar
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Audit log preview */}
                  <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'20px 24px' }}>
                    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:14 }}>
                      <h3 style={{ fontSize:14,fontWeight:700,color:T.text }}>Log de auditoria</h3>
                      <span style={{ fontSize:11,color:T.textDim }}>Últimos 30 dias</span>
                    </div>
                    <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
                      {MOCK_ACTIVITY.slice(0,5).map((item,i)=>(
                        <div key={item.id} style={{ display:'flex',gap:10,padding:'9px 0',borderTop:i>0?`1px solid ${T.border}`:'none' }}>
                          <div style={{ width:6,height:6,borderRadius:'50%',background:item.color,marginTop:5,flexShrink:0 }}/>
                          <div style={{ flex:1 }}>
                            <p style={{ fontSize:12,color:T.textMid }}>{item.description}</p>
                            <p style={{ fontSize:10,color:T.textDim,marginTop:1 }}>{item.user} · {item.time} atrás · IP 187.44.x.x</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Integrations */}
              {settingsTab==='integrations' && (
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'24px 28px',animation:'nxFadeUp 250ms ease-out' }}>
                  <h2 style={{ fontSize:15,fontWeight:700,color:T.text,marginBottom:6 }}>Integrações disponíveis</h2>
                  <p style={{ fontSize:13,color:T.textMid,marginBottom:20 }}>Conecte ferramentas externas para automatizar seu fluxo de trabalho.</p>
                  <div style={{ display:'flex',flexDirection:'column',gap:0 }}>
                    {[
                      { name:'Resend',       desc:'E-mails transacionais e confirmações',    icon:'✉',  connected:true  },
                      { name:'Stripe',       desc:'Processamento de pagamentos',             icon:'💳', connected:true  },
                      { name:'Google Analytics',desc:'Análise de tráfego e conversões',     icon:'📊', connected:false },
                      { name:'WhatsApp API', desc:'Notificações e confirmações via WhatsApp',icon:'💬', connected:false },
                      { name:'Cal.com',      desc:'Agendamento e calendário integrado',      icon:'📅', connected:false },
                      { name:'Slack',        desc:'Alertas internos para a equipe',          icon:'#',  connected:false },
                    ].map((int,i)=>(
                      <div key={int.name} style={{ display:'flex',alignItems:'center',gap:14,padding:'16px 0',borderTop:i>0?`1px solid ${T.border}`:'none' }}>
                        <div style={{ width:40,height:40,borderRadius:10,background:T.surface,display:'flex',alignItems:'center',justifyContent:'center',fontSize:18,flexShrink:0 }} aria-hidden="true">{int.icon}</div>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:8 }}>
                            <p style={{ fontSize:13,fontWeight:600,color:T.text }}>{int.name}</p>
                            {int.connected && <span style={{ fontSize:10,fontWeight:700,background:T.greenDim,color:T.green,padding:'2px 6px',borderRadius:4 }}>Conectado</span>}
                          </div>
                          <p style={{ fontSize:12,color:T.textMid }}>{int.desc}</p>
                        </div>
                        <button
                          onClick={()=>addToast(int.connected?'info':'success', int.connected?`${int.name} desconectado.`:`${int.name} conectado com sucesso!`)}
                          style={{ padding:'7px 14px',borderRadius:8,border:`1px solid ${int.connected?T.red+'30':accent+'40'}`,background:int.connected?T.redDim:accentDim,color:int.connected?T.red:accent,fontSize:12,fontWeight:600,cursor:'pointer',whiteSpace:'nowrap',transition:'all 150ms ease' }}>
                          {int.connected?'Desconectar':'Conectar'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications */}
              {settingsTab==='notifications' && (
                <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'24px 28px',animation:'nxFadeUp 250ms ease-out' }}>
                  <h2 style={{ fontSize:15,fontWeight:700,color:T.text,marginBottom:20 }}>Preferências de notificação</h2>
                  {[
                    { group:'E-mail', items:[
                      { id:'emailOrders',  label:'Novos pedidos e atualizações de status' },
                      { id:'emailBookings',label:'Agendamentos confirmados e cancelados' },
                      { id:'emailLeads',   label:'Novos leads na fila de espera' },
                    ]},
                    { group:'Push / In-app', items:[
                      { id:'pushOrders',   label:'Novos pedidos em tempo real' },
                      { id:'pushBookings', label:'Confirmações de consultas' },
                      { id:'pushLeads',    label:'Lead aprovado ou recusado' },
                    ]},
                    { group:'Relatórios automáticos', items:[
                      { id:'weeklyReport', label:'Relatório semanal de desempenho por e-mail' },
                      { id:'lowStock',     label:'Alerta de produto com estoque baixo' },
                    ]},
                  ].map(group=>(
                    <div key={group.group} style={{ marginBottom:24 }}>
                      <p style={{ fontSize:11,fontWeight:700,color:T.textDim,letterSpacing:'0.10em',textTransform:'uppercase',marginBottom:12 }}>{group.group}</p>
                      {group.items.map((item,i)=>(
                        <div key={item.id} style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'12px 0',borderTop:i>0?`1px solid ${T.border}`:'none' }}>
                          <p style={{ fontSize:13,color:T.textMid }}>{item.label}</p>
                          <button
                            onClick={()=>{ setNotifications(p=>({...p,[item.id]:!p[item.id as keyof typeof notifications]})); addToast('info', `Preferência atualizada.`) }}
                            role="switch" aria-checked={notifications[item.id as keyof typeof notifications]}
                            style={{ width:42,height:23,borderRadius:12,border:'none',cursor:'pointer',flexShrink:0,
                              background:notifications[item.id as keyof typeof notifications]?accent:T.textDim,
                              transition:'background 200ms ease',position:'relative' }}>
                            <div style={{ position:'absolute',top:2.5,
                              left:notifications[item.id as keyof typeof notifications]?20:2.5,
                              width:18,height:18,borderRadius:'50%',background:'#fff',
                              transition:'left 200ms ease',boxShadow:'0 1px 3px rgba(0,0,0,0.3)' }}/>
                          </button>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}

              {/* LGPD */}
              {settingsTab==='lgpd' && (
                <div style={{ display:'flex',flexDirection:'column',gap:14,animation:'nxFadeUp 250ms ease-out' }}>
                  <div style={{ background:T.card,border:`1px solid ${T.border}`,borderRadius:14,padding:'24px 28px' }}>
                    <h2 style={{ fontSize:15,fontWeight:700,color:T.text,marginBottom:6 }}>Proteção e tratamento de dados</h2>
                    <p style={{ fontSize:13,color:T.textMid,marginBottom:20,lineHeight:1.6 }}>
                      Gerencie como os dados pessoais dos seus usuários são tratados. Em conformidade com a Lei nº 13.709/2018 (LGPD).
                    </p>
                    {[
                      { title:'Retenção de dados',     desc:'Dados de pacientes/clientes retidos por 5 anos (obrigação fiscal). Solicitações de exclusão tratadas conforme Art. 18.',  status:'Configurado',  color:T.green  },
                      { title:'Backups e criptografia', desc:'Backups diários com criptografia AES-256. Armazenados em servidores no Brasil (AWS sa-east-1).',                           status:'Ativo',        color:T.green  },
                      { title:'Encarregado (DPO)',      desc:'Responsável pelo tratamento de dados: dpo@empresa.com. Resposta em até 15 dias úteis para solicitações.',               status:'Designado',    color:T.green  },
                      { title:'Relatório de impacto (RIPD)',desc:'Avaliação de risco para tratamento de dados sensíveis. Última revisão: Jan/2026.',                                  status:'Atualizado',   color:T.teal   },
                      { title:'Cookies e rastreamento', desc:'Política de cookies disponível. Opt-in para cookies de marketing. Google Analytics com anonimização de IP.',             status:'Configurado',  color:T.green  },
                    ].map(item=>(
                      <div key={item.title} style={{ display:'flex',alignItems:'flex-start',gap:14,padding:'14px 0',borderTop:`1px solid ${T.border}` }}>
                        <div style={{ width:8,height:8,borderRadius:'50%',background:item.color,marginTop:5,flexShrink:0 }}/>
                        <div style={{ flex:1 }}>
                          <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:3 }}>
                            <p style={{ fontSize:13,fontWeight:600,color:T.text }}>{item.title}</p>
                            <span style={{ fontSize:10,fontWeight:700,background:`${item.color}15`,color:item.color,padding:'2px 7px',borderRadius:4 }}>{item.status}</span>
                          </div>
                          <p style={{ fontSize:12,color:T.textMid,lineHeight:1.6 }}>{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div style={{ background:T.card,border:`1px solid ${accent}20`,borderRadius:14,padding:'20px 24px' }}>
                    <h3 style={{ fontSize:14,fontWeight:700,color:T.text,marginBottom:12 }}>Solicitações de titulares (Art. 18 LGPD)</h3>
                    <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12 }} className="nx-bottom-grid">
                      {[
                        { label:'Solicitações abertas', value:'2',  color:T.gold   },
                        { label:'Respondidas este mês', value:'7',  color:T.green  },
                        { label:'Prazo médio resposta', value:'4d', color:T.blue   },
                      ].map(s=>(
                        <div key={s.label} style={{ background:T.surface,borderRadius:10,padding:'14px 16px',textAlign:'center' }}>
                          <p style={{ fontFamily:'var(--font-syne,sans-serif)',fontSize:22,fontWeight:700,color:s.color,lineHeight:1,marginBottom:4 }}>{s.value}</p>
                          <p style={{ fontSize:11,color:T.textDim }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={()=>addToast('info','Relatório LGPD exportado.')}
                      style={{ marginTop:16,padding:'9px 18px',borderRadius:8,border:`1px solid ${T.border}`,background:'transparent',color:T.textMid,fontSize:12,fontWeight:500,cursor:'pointer',transition:'all 150ms ease' }}
                      onMouseEnter={e=>{e.currentTarget.style.color=accent;e.currentTarget.style.borderColor=`${accent}40`}}
                      onMouseLeave={e=>{e.currentTarget.style.color=T.textMid;e.currentTarget.style.borderColor=T.border}}>
                      ↓ Exportar relatório LGPD
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}