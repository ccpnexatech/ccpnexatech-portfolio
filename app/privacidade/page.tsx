import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/lib/constants'

/* ── Metadata ──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: `Saiba como a ${COMPANY.name} coleta, usa e protege seus dados pessoais conforme a LGPD.`,
  robots: { index: false, follow: false },
}

/* ── Data de vigência ──────────────────────────────────────────────────────── */
const EFFECTIVE_DATE = '1º de janeiro de 2025'

/* ── Componente ────────────────────────────────────────────────────────────── */
export default function PrivacidadePage() {
  return (
    <div className="bg-surface min-h-screen">

      {/* Header da página */}
      <div className="bg-navy border-b border-[rgba(255,255,255,0.06)]">
        <div className="container-nx py-12 md:py-16">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-caption text-text-muted hover:text-[#E8EDF5] transition-colors duration-nx-fast mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
              aria-hidden="true">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            Voltar ao início
          </Link>
          <p className="text-caption text-accent font-[500] tracking-[0.12em] uppercase mb-3">
            Legal
          </p>
          <h1 className="font-syne text-display font-[700] text-[#E8EDF5] mb-3">
            Política de Privacidade
          </h1>
          <p className="text-body text-text-muted">
            Vigência a partir de {EFFECTIVE_DATE} · LGPD — Lei nº 13.709/2018
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-nx py-16">
        <div className="max-w-[720px]">

          <Prose>
            <p>
              A <strong>{COMPANY.name}</strong> (CNPJ {COMPANY.cnpj}), com sede em{' '}
              {COMPANY.city}, {COMPANY.state}, Brasil, é responsável pelo tratamento
              dos dados pessoais coletados neste site. Esta política descreve quais dados
              coletamos, como os usamos, com quem os compartilhamos e quais são os seus
              direitos como titular, em conformidade com a Lei Geral de Proteção de Dados
              (LGPD — Lei nº 13.709/2018).
            </p>
          </Prose>

          <Section number="1" title="Dados que coletamos">
            <Prose>
              <p>Coletamos apenas os dados estritamente necessários para as finalidades descritas nesta política:</p>
              <ul>
                <li><strong>Dados de contato:</strong> nome, endereço de e-mail e nome da empresa, fornecidos voluntariamente ao entrar em contato conosco.</li>
                <li><strong>Dados do projeto:</strong> tipo de serviço desejado, nível de projeto e faixa de investimento, informados no formulário de orçamento.</li>
                <li><strong>Dados de navegação:</strong> endereço IP, tipo de navegador, páginas visitadas e tempo de permanência, coletados automaticamente via analytics quando habilitado.</li>
              </ul>
              <p>Não coletamos dados sensíveis conforme definidos no Art. 5º, II da LGPD.</p>
            </Prose>
          </Section>

          <Section number="2" title="Como usamos seus dados">
            <Prose>
              <p>Seus dados são utilizados exclusivamente para:</p>
              <ul>
                <li>Responder solicitações de orçamento e mensagens de contato;</li>
                <li>Elaborar propostas comerciais personalizadas;</li>
                <li>Executar o contrato de prestação de serviços quando firmado;</li>
                <li>Emitir notas fiscais e cumprir obrigações fiscais;</li>
                <li>Melhorar a experiência de navegação no site (analytics agregado e anonimizado).</li>
              </ul>
              <p>
                A base legal para o tratamento é o <strong>legítimo interesse</strong> para
                comunicações de contato (Art. 7º, IX), a <strong>execução de contrato</strong>{" "}
                para projetos em andamento (Art. 7º, V) e o <strong>cumprimento de obrigação
                legal</strong> para fins fiscais (Art. 7º, II).
              </p>
            </Prose>
          </Section>

          <Section number="3" title="Compartilhamento de dados">
            <Prose>
              <p>
                Não vendemos, alugamos nem compartilhamos seus dados pessoais com terceiros
                para fins comerciais. Os dados podem ser compartilhados apenas com:
              </p>
              <ul>
                <li><strong>Resend:</strong> serviço de envio de e-mails transacionais, para entrega das mensagens de contato. Os dados são processados conforme a política de privacidade da Resend Inc.</li>
                <li><strong>Vercel:</strong> plataforma de hospedagem do site, que pode registrar logs de acesso por razões de segurança e performance.</li>
                <li><strong>Autoridades competentes:</strong> quando exigido por lei ou ordem judicial.</li>
              </ul>
            </Prose>
          </Section>

          <Section number="4" title="Retenção dos dados">
            <Prose>
              <p>Mantemos seus dados pelo tempo necessário para cada finalidade:</p>
              <ul>
                <li><strong>Solicitações de orçamento não convertidas:</strong> até 6 meses após o último contato.</li>
                <li><strong>Projetos executados:</strong> pelo prazo legal de 5 anos para fins contábeis e fiscais.</li>
                <li><strong>Dados de navegação:</strong> conforme configuração da ferramenta de analytics (geralmente até 14 meses).</li>
              </ul>
              <p>Após o prazo, os dados são deletados ou anonimizados de forma definitiva.</p>
            </Prose>
          </Section>

          <Section number="5" title="Seus direitos como titular">
            <Prose>
              <p>
                Nos termos da LGPD (Art. 18), você tem direito a, a qualquer momento:
              </p>
              <ul>
                <li>Confirmar se tratamos seus dados pessoais;</li>
                <li>Acessar os dados que temos sobre você;</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados;</li>
                <li>Solicitar a anonimização, bloqueio ou eliminação dos seus dados;</li>
                <li>Revogar o consentimento, quando aplicável;</li>
                <li>Solicitar a portabilidade dos dados a outro fornecedor;</li>
                <li>Opor-se a tratamento realizado com fundamento em legítimo interesse.</li>
              </ul>
              <p>
                Para exercer qualquer um desses direitos, envie um e-mail para{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-accent hover:underline">
                  {COMPANY.email}
                </a>{' '}
                com o assunto <em>"Direitos LGPD"</em>. Responderemos em até 15 dias úteis.
              </p>
            </Prose>
          </Section>

          <Section number="6" title="Cookies e analytics">
            <Prose>
              <p>
                Este site pode utilizar cookies técnicos essenciais para o funcionamento
                correto das páginas. Se utilizarmos ferramentas de analytics (como Google
                Analytics), os dados de navegação são coletados de forma agregada e
                anonimizada, sem identificação individual.
              </p>
              <p>
                Você pode desabilitar cookies no seu navegador a qualquer momento, porém
                algumas funcionalidades do site podem ser afetadas.
              </p>
            </Prose>
          </Section>

          <Section number="7" title="Segurança dos dados">
            <Prose>
              <p>
                Adotamos medidas técnicas e organizacionais adequadas para proteger seus
                dados contra acesso não autorizado, alteração, divulgação ou destruição,
                incluindo:
              </p>
              <ul>
                <li>Transmissão via HTTPS com TLS;</li>
                <li>Acesso restrito aos dados apenas por pessoal autorizado;</li>
                <li>Variáveis de ambiente para credenciais sensíveis, nunca expostas no código-fonte;</li>
                <li>Headers de segurança configurados (CSP, X-Frame-Options, etc.).</li>
              </ul>
            </Prose>
          </Section>

          <Section number="8" title="Alterações nesta política">
            <Prose>
              <p>
                Podemos atualizar esta política periodicamente. Quando houver alterações
                relevantes, atualizaremos a data de vigência no topo desta página. O uso
                continuado do site após a publicação das alterações constitui aceitação
                da política revisada.
              </p>
            </Prose>
          </Section>

          <Section number="9" title="Contato e Encarregado (DPO)">
            <Prose>
              <p>
                Para dúvidas, solicitações ou reclamações relacionadas ao tratamento de
                dados pessoais, entre em contato com nosso Encarregado de Dados:
              </p>
              <ul>
                <li><strong>Empresa:</strong> {COMPANY.name} LTDA</li>
                <li><strong>CNPJ:</strong> {COMPANY.cnpj}</li>
                <li>
                  <strong>E-mail:</strong>{' '}
                  <a href={`mailto:${COMPANY.email}`} className="text-accent hover:underline">
                    {COMPANY.email}
                  </a>
                </li>
                <li><strong>Sede:</strong> {COMPANY.city}, {COMPANY.state}, Brasil</li>
              </ul>
              <p>
                Caso não obtenha resposta satisfatória, você pode apresentar reclamação à
                Autoridade Nacional de Proteção de Dados (ANPD) pelo site{' '}
                <a
                  href="https://www.gov.br/anpd"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  gov.br/anpd
                </a>
                .
              </p>
            </Prose>
          </Section>

          {/* Rodapé da página */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-caption text-text-muted">
              Última atualização: {EFFECTIVE_DATE} · {COMPANY.name} LTDA ·{' '}
              <span className="font-mono">{COMPANY.cnpj}</span>
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-caption text-accent hover:text-accent-mid transition-colors duration-nx-fast mt-3"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7"/>
              </svg>
              Voltar ao site
            </Link>
          </div>

        </div>
      </div>
    </div>
  )
}

/* ── Sub-componentes ───────────────────────────────────────────────────────── */

function Section({
  number,
  title,
  children,
}: {
  number:   string
  title:    string
  children: React.ReactNode
}) {
  return (
    <section className="mt-10" aria-labelledby={`section-${number}`}>
      <h2
        id={`section-${number}`}
        className="font-syne text-h2 font-[600] text-text-dark mb-4 flex items-baseline gap-2.5"
      >
        <span className="text-accent text-h3 font-[700]">{number}.</span>
        {title}
      </h2>
      {children}
    </section>
  )
}

function Prose({ children }: { children: React.ReactNode }) {
  return (
    <div className="prose-nx text-body text-text-muted leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mt-3 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:text-body [&_li]:text-text-muted [&_li]:list-disc [&_strong]:text-text-dark [&_strong]:font-[500] [&_a]:text-accent [&_a]:hover:underline [&_em]:italic">
      {children}
    </div>
  )
}