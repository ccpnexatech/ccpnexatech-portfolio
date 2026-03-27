import type { Metadata } from 'next'
import Link from 'next/link'
import { COMPANY } from '@/lib/constants'

/* ── Metadata ──────────────────────────────────────────────────────────────── */
export const metadata: Metadata = {
  title: 'Termos de Uso',
  description: `Termos e condições de uso do site e dos serviços da ${COMPANY.name}.`,
  robots: { index: false, follow: false },
}

/* ── Data de vigência ──────────────────────────────────────────────────────── */
const EFFECTIVE_DATE = '1º de janeiro de 2025'

/* ── Componente ────────────────────────────────────────────────────────────── */
export default function TermosPage() {
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
            Termos de Uso
          </h1>
          <p className="text-body text-text-muted">
            Vigência a partir de {EFFECTIVE_DATE} · {COMPANY.name} LTDA · CNPJ{' '}
            <span className="font-mono">{COMPANY.cnpj}</span>
          </p>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="container-nx py-16">
        <div className="max-w-[720px]">

          <Prose>
            <p>
              Ao acessar e utilizar o site <strong>{COMPANY.url}</strong>, você concorda
              com os presentes Termos de Uso. Leia-os com atenção antes de utilizar
              qualquer recurso disponível. Caso não concorde com alguma disposição, por
              favor, não utilize o site.
            </p>
            <p>
              Estes termos regem exclusivamente o uso do site institucional e o
              relacionamento pré-contratual (solicitações de orçamento). Os contratos de
              prestação de serviços são regidos por instrumentos contratuais específicos,
              assinados separadamente entre as partes.
            </p>
          </Prose>

          <Section number="1" title="Sobre a empresa">
            <Prose>
              <p>
                O site é operado por <strong>{COMPANY.name} LTDA</strong>, pessoa jurídica
                de direito privado, inscrita no CNPJ sob o nº{' '}
                <span className="font-mono">{COMPANY.cnpj}</span>, com sede em{' '}
                {COMPANY.city}, {COMPANY.state}, Brasil, doravante denominada simplesmente
                <strong> {COMPANY.name}</strong>.
              </p>
              <p>
                Para entrar em contato:{' '}
                <a href={`mailto:${COMPANY.email}`} className="text-accent hover:underline">
                  {COMPANY.email}
                </a>
              </p>
            </Prose>
          </Section>

          <Section number="2" title="Uso permitido do site">
            <Prose>
              <p>
                O site destina-se exclusivamente à apresentação dos serviços da{' '}
                {COMPANY.name} e ao recebimento de solicitações de orçamento. Você pode
                utilizar o site para:
              </p>
              <ul>
                <li>Conhecer os serviços, portfólio e processo de trabalho da empresa;</li>
                <li>Solicitar orçamentos e entrar em contato comercial;</li>
                <li>Acessar informações institucionais como CNPJ, endereço e e-mail.</li>
              </ul>
              <p>É expressamente proibido:</p>
              <ul>
                <li>Reproduzir, copiar ou redistribuir o conteúdo do site sem autorização prévia e por escrito;</li>
                <li>Utilizar o site para fins ilegais, fraudulentos ou que violem direitos de terceiros;</li>
                <li>Tentar acessar áreas restritas, realizar engenharia reversa ou interferir no funcionamento do site;</li>
                <li>Enviar comunicações não solicitadas (spam) por meio dos canais de contato;</li>
                <li>Utilizar ferramentas automatizadas de scraping sem autorização.</li>
              </ul>
            </Prose>
          </Section>

          <Section number="3" title="Solicitações de orçamento">
            <Prose>
              <p>
                O envio de uma solicitação de orçamento por qualquer canal disponível no
                site (e-mail, formulário ou link de contato) não implica a celebração de
                qualquer contrato ou obrigação entre as partes.
              </p>
              <p>
                A {COMPANY.name} se compromete a responder as solicitações em até{' '}
                <strong>24 horas úteis</strong>. A proposta enviada terá validade de{' '}
                <strong>15 dias corridos</strong> a partir da data de envio, salvo indicação
                contrária expressa na própria proposta.
              </p>
              <p>
                A contratação efetiva dos serviços depende da assinatura de contrato
                específico e do pagamento do sinal acordado.
              </p>
            </Prose>
          </Section>

          <Section number="4" title="Propriedade intelectual">
            <Prose>
              <p>
                Todo o conteúdo disponível neste site — incluindo, sem limitação, textos,
                logotipos, identidade visual, design system, ícones, código-fonte,
                estrutura de páginas e materiais gráficos — é de propriedade exclusiva da{' '}
                {COMPANY.name} ou de terceiros que autorizaram seu uso, e está protegido
                pelas leis brasileiras de direitos autorais (Lei nº 9.610/1998).
              </p>
              <p>
                É vedada a reprodução total ou parcial de qualquer elemento do site sem
                autorização prévia e por escrito da {COMPANY.name}. Referências e citações
                para fins jornalísticos ou acadêmicos devem indicar a fonte.
              </p>
              <p>
                Os projetos desenvolvidos para clientes têm a propriedade intelectual
                definida no contrato de prestação de serviços firmado entre as partes.
                Na ausência de cláusula específica, o código-fonte entregue é de
                propriedade do cliente após a quitação integral do contrato.
              </p>
            </Prose>
          </Section>

          <Section number="5" title="Isenção de responsabilidade">
            <Prose>
              <p>
                O site é fornecido "no estado em que se encontra", sem garantias de
                qualquer natureza, expressas ou implícitas. A {COMPANY.name} não se
                responsabiliza por:
              </p>
              <ul>
                <li>Interrupções temporárias de acesso decorrentes de manutenção, falhas técnicas ou força maior;</li>
                <li>Decisões tomadas com base nas informações disponíveis no site;</li>
                <li>Danos indiretos, incidentais ou consequenciais decorrentes do uso ou da impossibilidade de uso do site;</li>
                <li>Conteúdo de sites de terceiros acessados por links externos disponíveis neste site.</li>
              </ul>
              <p>
                A {COMPANY.name} envidará seus melhores esforços para manter o site
                disponível e as informações atualizadas, mas não garante a ausência de
                erros ou a completude das informações.
              </p>
            </Prose>
          </Section>

          <Section number="6" title="Links externos">
            <Prose>
              <p>
                O site pode conter links para sites de terceiros (redes sociais,
                plataformas parceiras, ferramentas etc.). Esses links são fornecidos
                apenas para conveniência do usuário. A {COMPANY.name} não tem controle
                sobre o conteúdo, a política de privacidade ou as práticas de sites
                externos, e não se responsabiliza por eles.
              </p>
              <p>
                O acesso a sites de terceiros é feito por conta e risco do usuário.
              </p>
            </Prose>
          </Section>

          <Section number="7" title="Privacidade e proteção de dados">
            <Prose>
              <p>
                O tratamento de dados pessoais coletados neste site é regido pela nossa{' '}
                <Link href="/privacidade" className="text-accent hover:underline">
                  Política de Privacidade
                </Link>
                , elaborada em conformidade com a Lei Geral de Proteção de Dados (LGPD —
                Lei nº 13.709/2018). Ao utilizar o site, você também concorda com os
                termos da Política de Privacidade.
              </p>
            </Prose>
          </Section>

          <Section number="8" title="Modificações nos termos">
            <Prose>
              <p>
                A {COMPANY.name} reserva-se o direito de modificar estes Termos de Uso a
                qualquer momento, a seu exclusivo critério. As alterações entram em vigor
                imediatamente após a publicação da versão atualizada nesta página, com a
                data de vigência revisada.
              </p>
              <p>
                O uso continuado do site após a publicação das modificações implica a
                aceitação dos novos termos. Recomendamos que você consulte esta página
                periodicamente.
              </p>
            </Prose>
          </Section>

          <Section number="9" title="Lei aplicável e foro">
            <Prose>
              <p>
                Estes Termos de Uso são regidos pelas leis da República Federativa do
                Brasil. As partes elegem o foro da Comarca de{' '}
                <strong>{COMPANY.city}, {COMPANY.state}</strong>, como competente para
                dirimir quaisquer controvérsias decorrentes deste instrumento, com
                renúncia expressa a qualquer outro foro, por mais privilegiado que seja.
              </p>
            </Prose>
          </Section>

          <Section number="10" title="Contato">
            <Prose>
              <p>
                Para dúvidas, sugestões ou comunicações relacionadas a estes Termos de
                Uso, entre em contato:
              </p>
              <ul>
                <li><strong>Empresa:</strong> {COMPANY.name} LTDA</li>
                <li><strong>CNPJ:</strong> {COMPANY.cnpj}</li>
                <li>
                  <strong>E-mail:</strong>{' '}
                  <a
                    href={`mailto:${COMPANY.email}`}
                    className="text-accent hover:underline"
                  >
                    {COMPANY.email}
                  </a>
                </li>
                <li>
                  <strong>Sede:</strong> {COMPANY.city}, {COMPANY.state}, Brasil
                </li>
              </ul>
            </Prose>
          </Section>

          {/* Rodapé */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-caption text-text-muted">
              Última atualização: {EFFECTIVE_DATE} · {COMPANY.name} LTDA ·{' '}
              <span className="font-mono">{COMPANY.cnpj}</span>
            </p>
            <div className="flex flex-wrap gap-5 mt-3">
              <Link
                href="/privacidade"
                className="text-caption text-accent hover:text-accent-mid transition-colors duration-nx-fast"
              >
                Política de Privacidade
              </Link>
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-caption text-accent hover:text-accent-mid transition-colors duration-nx-fast"
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
    <div className="text-body text-text-muted leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0 [&_ul]:mt-3 [&_ul]:mb-4 [&_ul]:pl-5 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_li]:text-body [&_li]:text-text-muted [&_li]:list-disc [&_strong]:text-text-dark [&_strong]:font-[500] [&_a]:text-accent [&_a]:hover:underline [&_em]:italic">
      {children}
    </div>
  )
}