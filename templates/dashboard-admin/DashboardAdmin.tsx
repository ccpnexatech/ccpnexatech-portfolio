'use client'

import { useState } from 'react'

/* ── Tipos ─────────────────────────────────────────────────────────────────── */
type Section = 'overview' | 'users' | 'orders' | 'analytics' | 'settings'

interface User {
  id:     number
  name:   string
  email:  string
  role:   'Admin' | 'Editor' | 'Viewer'
  status: 'Ativo' | 'Inativo'
  avatar: string
}

/* ── Dados mock ────────────────────────────────────────────────────────────── */
const USERS: User[] = [
  { id: 1, name: 'Ana Lima',      email: 'ana@empresa.com',    role: 'Admin',  status: 'Ativo',   avatar: 'AL' },
  { id: 2, name: 'Carlos Mota',   email: 'carlos@empresa.com', role: 'Editor', status: 'Ativo',   avatar: 'CM' },
  { id: 3, name: 'Diego Farias',  email: 'diego@empresa.com',  role: 'Viewer', status: 'Inativo', avatar: 'DF' },
  { id: 4, name: 'Elena Souza',   email: 'elena@empresa.com',  role: 'Editor', status: 'Ativo',   avatar: 'ES' },
  { id: 5, name: 'Felipe Nunes',  email: 'felipe@empresa.com', role: 'Viewer', status: 'Ativo',   avatar: 'FN' },
]

const KPIS = [
  { label: 'Receita Total',   value: 'R$ 48.290',  delta: '+12%',  positive: true,  icon: '💰' },
  { label: 'Novos Usuários',  value: '1.284',       delta: '+8%',   positive: true,  icon: '👤' },
  { label: 'Pedidos Hoje',    value: '94',          delta: '-3%',   positive: false, icon: '📦' },
  { label: 'Taxa Conversão',  value: '4,7%',        delta: '+0.5%', positive: true,  icon: '📈' },
]

const CHART_DATA = [42, 61, 55, 78, 65, 82, 70, 90, 76, 95, 84, 102]
const MONTHS     = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']

const RECENT_ORDERS = [
  { id: '#8821', customer: 'Mariana Costa',    value: 'R$ 349,00', status: 'Pago',      color: '#22c55e' },
  { id: '#8820', customer: 'Renato Alves',     value: 'R$ 189,00', status: 'Pendente',  color: '#F0A500' },
  { id: '#8819', customer: 'Juliana Martins',  value: 'R$ 789,00', status: 'Pago',      color: '#22c55e' },
  { id: '#8818', customer: 'Bruno Ferreira',   value: 'R$ 129,00', status: 'Cancelado', color: '#ef4444' },
  { id: '#8817', customer: 'Priscila Leal',    value: 'R$ 449,00', status: 'Pago',      color: '#22c55e' },
]

const NAV_ITEMS: { id: Section; label: string; icon: string }[] = [
  { id: 'overview',  label: 'Visão Geral',  icon: '🏠' },
  { id: 'users',     label: 'Usuários',     icon: '👥' },
  { id: 'orders',    label: 'Pedidos',      icon: '📦' },
  { id: 'analytics', label: 'Analytics',   icon: '📊' },
  { id: 'settings',  label: 'Configurações',icon: '⚙️' },
]

/* ── Componente principal ──────────────────────────────────────────────────── */
export default function DashboardAdmin() {
  const [section, setSection]   = useState<Section>('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userFilter, setUserFilter]   = useState('')
  const [editingUser, setEditingUser] = useState<number | null>(null)
  const [notif, setNotif] = useState(true)

  return (
    <div className="bg-[#0A0F1E] text-white min-h-screen flex font-inter">

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <>
        {/* Overlay mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/60 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <aside
          className={`fixed md:static inset-y-0 left-0 w-[220px] bg-[#060C18] border-r border-[rgba(255,255,255,0.06)] flex flex-col z-50 transition-transform md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Logo */}
          <div className="px-5 py-5 border-b border-[rgba(255,255,255,0.06)]">
            <span className="font-syne font-[700] text-[1rem]">
              Nex<span className="text-[#0066FF]">Panel</span>
            </span>
            <p className="text-[11px] text-[#6B7A9B] mt-0.5">Admin Dashboard</p>
          </div>

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setSection(item.id); setSidebarOpen(false) }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[8px] text-[13px] font-[500] text-left w-full transition-colors ${
                  section === item.id
                    ? 'bg-[rgba(0,102,255,0.15)] text-[#3385FF]'
                    : 'text-[#6B7A9B] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#E8EDF5]'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>

          {/* User */}
          <div className="px-4 py-4 border-t border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[rgba(0,102,255,0.20)] flex items-center justify-center text-[11px] font-[700] text-[#3385FF]">
                AL
              </div>
              <div>
                <p className="text-[12px] font-[500]">Ana Lima</p>
                <p className="text-[10px] text-[#6B7A9B]">Administrador</p>
              </div>
            </div>
          </div>
        </aside>
      </>

      {/* ── Main ─────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Header */}
        <header className="bg-[#060C18] border-b border-[rgba(255,255,255,0.06)] px-5 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-1.5 rounded-[6px] hover:bg-[rgba(255,255,255,0.05)]"
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menu"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M3 12h18M3 6h18M3 18h18"/>
              </svg>
            </button>
            <h1 className="font-syne font-[600] text-[15px]">
              {NAV_ITEMS.find((n) => n.id === section)?.label}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              className="relative p-1.5 rounded-[6px] hover:bg-[rgba(255,255,255,0.05)]"
              onClick={() => setNotif(false)}
              aria-label="Notificações"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {notif && (
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#ef4444] rounded-full" aria-hidden="true" />
              )}
            </button>
            <span className="text-[12px] text-[#6B7A9B] hidden sm:block">27 Mar 2026</span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-auto p-5">

          {/* ── OVERVIEW ─────────────────────────────────────────────────── */}
          {section === 'overview' && (
            <div className="flex flex-col gap-5">
              {/* KPIs */}
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
                {KPIS.map((kpi) => (
                  <div
                    key={kpi.label}
                    className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-[12px] text-[#6B7A9B]">{kpi.label}</p>
                      <span className="text-xl">{kpi.icon}</span>
                    </div>
                    <p className="font-syne text-[1.5rem] font-[700] mb-1">{kpi.value}</p>
                    <span
                      className="text-[12px] font-[500]"
                      style={{ color: kpi.positive ? '#22c55e' : '#ef4444' }}
                    >
                      {kpi.delta} vs. mês anterior
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                {/* Gráfico de receita */}
                <div className="lg:col-span-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="text-[14px] font-[600]">Receita Mensal</h2>
                    <span className="text-[12px] text-[#6B7A9B]">2025</span>
                  </div>
                  {/* Gráfico de barras */}
                  <div className="flex items-end gap-2 h-[180px]">
                    {CHART_DATA.map((v, i) => {
                      const max = Math.max(...CHART_DATA)
                      const h   = (v / max) * 100
                      return (
                        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                          <div
                            className="w-full rounded-t-[4px] transition-all"
                            style={{
                              height:     `${h}%`,
                              background: i === 11 ? '#0066FF' : 'rgba(0,102,255,0.30)',
                            }}
                            title={`${MONTHS[i]}: R$ ${v}k`}
                          />
                          <span className="text-[9px] text-[#6B7A9B]">{MONTHS[i]}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Pedidos recentes */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5">
                  <h2 className="text-[14px] font-[600] mb-4">Pedidos Recentes</h2>
                  <div className="flex flex-col gap-3">
                    {RECENT_ORDERS.map((order) => (
                      <div key={order.id} className="flex items-center justify-between">
                        <div>
                          <p className="text-[12px] font-[500]">{order.customer}</p>
                          <p className="text-[11px] text-[#6B7A9B]">{order.id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[12px] font-[600]">{order.value}</p>
                          <span className="text-[10px] font-[500]" style={{ color: order.color }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="mt-4 text-[12px] text-[#0066FF] hover:underline"
                    onClick={() => setSection('orders')}
                  >
                    Ver todos →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── USERS ────────────────────────────────────────────────────── */}
          {section === 'users' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <input
                  type="search"
                  placeholder="Buscar usuário..."
                  value={userFilter}
                  onChange={(e) => setUserFilter(e.target.value)}
                  className="bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.10)] text-[13px] px-4 py-2 rounded-[8px] focus:outline-none focus:border-[#0066FF] transition-colors w-full max-w-[260px] placeholder-[#6B7A9B]"
                />
                <button className="bg-[#0066FF] text-white text-[13px] font-[500] px-4 py-2 rounded-[8px] hover:bg-[#0052CC] transition-colors">
                  + Novo usuário
                </button>
              </div>

              <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-3 px-5 py-3 border-b border-[rgba(255,255,255,0.06)]">
                  {['Usuário', 'E-mail', 'Role', 'Status', 'Ações'].map((h) => (
                    <span key={h} className="text-[11px] font-[500] text-[#6B7A9B] uppercase tracking-[0.08em]">{h}</span>
                  ))}
                </div>

                {USERS
                  .filter((u) =>
                    u.name.toLowerCase().includes(userFilter.toLowerCase()) ||
                    u.email.toLowerCase().includes(userFilter.toLowerCase())
                  )
                  .map((user) => (
                    <div
                      key={user.id}
                      className="grid grid-cols-[2fr_2fr_1fr_1fr_1fr] gap-3 px-5 py-3.5 border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)] items-center"
                    >
                      {/* Usuário */}
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-[rgba(0,102,255,0.20)] flex items-center justify-center text-[10px] font-[700] text-[#3385FF] flex-shrink-0">
                          {user.avatar}
                        </div>
                        <span className="text-[13px] font-[500] truncate">{user.name}</span>
                      </div>
                      {/* E-mail */}
                      <span className="text-[12px] text-[#6B7A9B] truncate">{user.email}</span>
                      {/* Role */}
                      <span
                        className="text-[11px] font-[500] px-2 py-[2px] rounded-full w-fit"
                        style={{
                          background: user.role === 'Admin' ? 'rgba(0,102,255,0.15)' : user.role === 'Editor' ? 'rgba(240,165,0,0.12)' : 'rgba(255,255,255,0.06)',
                          color:      user.role === 'Admin' ? '#3385FF'              : user.role === 'Editor' ? '#F0A500'              : '#6B7A9B',
                        }}
                      >
                        {user.role}
                      </span>
                      {/* Status */}
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: user.status === 'Ativo' ? '#22c55e' : '#6B7A9B' }}
                        />
                        <span className="text-[12px]" style={{ color: user.status === 'Ativo' ? '#22c55e' : '#6B7A9B' }}>
                          {user.status}
                        </span>
                      </div>
                      {/* Ações */}
                      <button
                        onClick={() => setEditingUser(editingUser === user.id ? null : user.id)}
                        className="text-[12px] text-[#6B7A9B] hover:text-[#E8EDF5] transition-colors"
                      >
                        {editingUser === user.id ? 'Fechar' : 'Editar'}
                      </button>
                    </div>
                  ))
                }
              </div>
            </div>
          )}

          {/* ── ORDERS ───────────────────────────────────────────────────── */}
          {section === 'orders' && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-3 gap-4 mb-2">
                {[
                  { label: 'Aguardando',  count: 12, color: '#F0A500' },
                  { label: 'Em trânsito', count: 7,  color: '#00C2E0' },
                  { label: 'Entregues',   count: 94, color: '#22c55e' },
                ].map((s) => (
                  <div key={s.label} className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5 text-center">
                    <p className="font-syne text-[2rem] font-[700]" style={{ color: s.color }}>{s.count}</p>
                    <p className="text-[12px] text-[#6B7A9B]">{s.label}</p>
                  </div>
                ))}
              </div>

              <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] overflow-hidden">
                <div className="px-5 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center justify-between">
                  <h2 className="text-[14px] font-[600]">Todos os Pedidos</h2>
                  <span className="text-[12px] text-[#6B7A9B]">{RECENT_ORDERS.length} resultados</span>
                </div>
                {RECENT_ORDERS.map((order) => (
                  <div key={order.id} className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.02)]">
                    <div className="flex items-center gap-4">
                      <span className="text-[12px] font-mono text-[#6B7A9B]">{order.id}</span>
                      <span className="text-[13px] font-[500]">{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-6">
                      <span className="text-[13px] font-[600]">{order.value}</span>
                      <span className="text-[11px] font-[500] px-2.5 py-1 rounded-full"
                        style={{
                          background: `${order.color}15`,
                          color: order.color,
                        }}
                      >
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── ANALYTICS ────────────────────────────────────────────────── */}
          {section === 'analytics' && (
            <div className="flex flex-col gap-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Canais de aquisição */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5">
                  <h2 className="text-[14px] font-[600] mb-5">Canais de Aquisição</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Orgânico / SEO', pct: 42, color: '#0066FF' },
                      { label: 'Redes Sociais',   pct: 28, color: '#00C2E0' },
                      { label: 'E-mail',           pct: 18, color: '#F0A500' },
                      { label: 'Direto',           pct: 12, color: '#22c55e' },
                    ].map((ch) => (
                      <div key={ch.label}>
                        <div className="flex justify-between text-[12px] mb-1.5">
                          <span>{ch.label}</span>
                          <span className="text-[#6B7A9B]">{ch.pct}%</span>
                        </div>
                        <div className="h-2 bg-[rgba(255,255,255,0.06)] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{ width: `${ch.pct}%`, background: ch.color }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dispositivos */}
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5">
                  <h2 className="text-[14px] font-[600] mb-5">Dispositivos</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: 'Mobile',  pct: 58, color: '#0066FF' },
                      { label: 'Desktop', pct: 34, color: '#3385FF' },
                      { label: 'Tablet',  pct: 8,  color: '#E6F0FF' },
                    ].map((d) => (
                      <div key={d.label} className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: d.color }} />
                        <span className="text-[13px] flex-1">{d.label}</span>
                        <span className="text-[13px] font-[600]">{d.pct}%</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-[#6B7A9B] mt-6">
                    Dados dos últimos 30 dias
                  </p>
                </div>
              </div>

              {/* Páginas mais visitadas */}
              <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] p-5">
                <h2 className="text-[14px] font-[600] mb-4">Top Páginas</h2>
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 px-2 mb-3">
                  {['Página', 'Visualizações', 'Tempo médio', 'Bounce'].map((h) => (
                    <span key={h} className="text-[11px] text-[#6B7A9B] uppercase tracking-[0.06em]">{h}</span>
                  ))}
                </div>
                {[
                  { page: '/inicio',       views: '12.4k', time: '2m 14s', bounce: '32%' },
                  { page: '/produtos',     views: '8.1k',  time: '3m 42s', bounce: '24%' },
                  { page: '/sobre',        views: '3.2k',  time: '1m 56s', bounce: '45%' },
                  { page: '/contato',      views: '2.8k',  time: '1m 12s', bounce: '38%' },
                ].map((row) => (
                  <div key={row.page} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 px-2 py-3 border-t border-[rgba(255,255,255,0.04)]">
                    <span className="text-[13px] font-mono">{row.page}</span>
                    <span className="text-[13px]">{row.views}</span>
                    <span className="text-[13px] text-[#6B7A9B]">{row.time}</span>
                    <span className="text-[13px] text-[#6B7A9B]">{row.bounce}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── SETTINGS ─────────────────────────────────────────────────── */}
          {section === 'settings' && (
            <div className="max-w-[600px] flex flex-col gap-5">
              {[
                {
                  title: 'Conta',
                  fields: [
                    { label: 'Nome da empresa', value: 'Nexatech Ltda' },
                    { label: 'E-mail de suporte', value: 'suporte@nexatech.com' },
                    { label: 'Fuso horário', value: 'America/Fortaleza (UTC-3)' },
                  ],
                },
                {
                  title: 'Notificações',
                  fields: [
                    { label: 'Novos pedidos por e-mail', value: 'Ativo' },
                    { label: 'Alertas de estoque baixo',  value: 'Ativo' },
                    { label: 'Relatório semanal',         value: 'Inativo' },
                  ],
                },
              ].map((group) => (
                <div
                  key={group.title}
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.07)] rounded-[12px] overflow-hidden"
                >
                  <div className="px-5 py-4 border-b border-[rgba(255,255,255,0.06)]">
                    <h2 className="text-[14px] font-[600]">{group.title}</h2>
                  </div>
                  {group.fields.map((field) => (
                    <div key={field.label} className="flex items-center justify-between px-5 py-4 border-b border-[rgba(255,255,255,0.04)] last:border-b-0">
                      <span className="text-[13px] text-[#6B7A9B]">{field.label}</span>
                      <span className="text-[13px] font-[500]">{field.value}</span>
                    </div>
                  ))}
                </div>
              ))}

              <button className="bg-[#0066FF] text-white text-[13px] font-[500] px-6 py-3 rounded-[8px] w-fit hover:bg-[#0052CC] transition-colors">
                Salvar alterações
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  )
}