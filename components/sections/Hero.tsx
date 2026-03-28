// Hero.tsx — stub inicial
// Implementação completa: próxima etapa
export default function Hero() {
  return (
    <section
      id="hero"
      style={{
        background: '#0F1F3D',
        // Desconta os 64 px do pt-16 do <main> para o hero ocupar
        // exatamente a viewport restante sem scroll desnecessário
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff', fontFamily: 'sans-serif' }}>
        <p style={{ color: '#0066FF', fontSize: 13, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>
          CCP NEXATECH · CNPJ 59.691.989/0001-70
        </p>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
          Tecnologia que transforma<br />
          <span style={{ color: '#0066FF' }}>negócios.</span>
        </h1>
        <p style={{ color: '#6B7A9B', fontSize: 17, maxWidth: 520, margin: '0 auto 40px' }}>
          Sites, landing pages e sistemas web de alto impacto para empresários que querem crescer.
        </p>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#contato" style={{ background: '#0066FF', color: '#fff', padding: '12px 28px', borderRadius: 6, fontWeight: 500, fontSize: 14 }}>
            Solicitar orçamento
          </a>
          <a href="#portfolio" style={{ border: '1.5px solid #0066FF', color: '#0066FF', padding: '12px 28px', borderRadius: 6, fontWeight: 500, fontSize: 14 }}>
            Ver portfólio
          </a>
        </div>
      </div>
    </section>
  )
}