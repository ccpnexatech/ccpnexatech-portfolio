import { NextRequest, NextResponse } from 'next/server'
import { COMPANY } from '@/lib/constants'

/* ── Tipos ─────────────────────────────────────────────────────────────────── */
interface ContactPayload {
  name:    string
  email:   string
  company: string
  service: string
  level:   string
  budget:  string
  message: string
}

/* ── Rate limiting simples (in-memory, reseta no cold start) ───────────────── */
const RATE_LIMIT_MAP = new Map<string, { count: number; reset: number }>()
const RATE_LIMIT_MAX = 3     // máx. 3 envios
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // por hora

function isRateLimited(ip: string): boolean {
  const now  = Date.now()
  const data = RATE_LIMIT_MAP.get(ip)

  if (!data || now > data.reset) {
    RATE_LIMIT_MAP.set(ip, { count: 1, reset: now + RATE_LIMIT_WINDOW })
    return false
  }
  if (data.count >= RATE_LIMIT_MAX) return true
  data.count++
  return false
}

/* ── Handler ───────────────────────────────────────────────────────────────── */
export async function POST(req: NextRequest) {
  /* Rate limit por IP */
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Muitas solicitações. Tente novamente mais tarde.' },
      { status: 429 },
    )
  }

  /* Parse do body */
  let payload: ContactPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Payload inválido' }, { status: 400 })
  }

  /* Validação básica server-side */
  const { name, email, service, message } = payload
  if (!name?.trim() || !email?.trim() || !service?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'Campos obrigatórios faltando' }, { status: 422 })
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'E-mail inválido' }, { status: 422 })
  }

  /* Envio via Resend */
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const CONTACT_EMAIL  = process.env.CONTACT_EMAIL ?? COMPANY.email

  if (!RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY não configurada')
    return NextResponse.json({ error: 'Configuração de e-mail ausente' }, { status: 500 })
  }

  const emailBody = buildEmailHtml(payload)

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization:  `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from:    `${COMPANY.name} <onboarding@resend.dev>`,
        to:      [CONTACT_EMAIL],
        replyTo: email,
        subject: `[Orçamento] ${service} — ${name}`,
        html:    emailBody,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[contact] Resend error:', err)
      return NextResponse.json({ error: 'Falha ao enviar e-mail' }, { status: 502 })
    }

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('[contact] Fetch error:', err)
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 })
  }
}

/* ── Template do e-mail ────────────────────────────────────────────────────── */
function buildEmailHtml(p: ContactPayload): string {
  const row = (label: string, value: string) =>
    value
      ? `<tr>
           <td style="padding:8px 16px;font-size:13px;color:#6B7A9B;width:160px;vertical-align:top">${label}</td>
           <td style="padding:8px 16px;font-size:13px;color:#1A2340;font-weight:500">${value}</td>
         </tr>`
      : ''

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F5F7FA;font-family:'Inter',sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #E2E8F0">

    <div style="background:#0F1F3D;padding:24px 28px">
      <p style="margin:0;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#3385FF;font-weight:500;margin-bottom:4px">
        Nova solicitação de orçamento
      </p>
      <h1 style="margin:0;font-size:20px;font-weight:700;color:#E8EDF5">
        ${p.service}
      </h1>
    </div>

    <table style="width:100%;border-collapse:collapse;margin:8px 0">
      ${row('Nome',          p.name)}
      ${row('E-mail',        p.email)}
      ${row('Empresa',       p.company)}
      ${row('Tipo',          p.service)}
      ${row('Nível',         p.level)}
      ${row('Investimento',  p.budget)}
    </table>

    <div style="padding:16px 28px;border-top:1px solid #E2E8F0">
      <p style="margin:0 0 8px;font-size:12px;font-weight:500;color:#6B7A9B;text-transform:uppercase;letter-spacing:.08em">
        Mensagem
      </p>
      <p style="margin:0;font-size:14px;color:#1A2340;line-height:1.65;white-space:pre-wrap">${p.message}</p>
    </div>

    <div style="padding:16px 28px;background:#F5F7FA;border-top:1px solid #E2E8F0">
      <p style="margin:0;font-size:12px;color:#6B7A9B">
        Responda diretamente a este e-mail para entrar em contato com <strong>${p.name}</strong>.
        Enviado via formulário de contato — ${COMPANY.name} · ${COMPANY.cnpj}
      </p>
    </div>
  </div>
</body>
</html>`
}