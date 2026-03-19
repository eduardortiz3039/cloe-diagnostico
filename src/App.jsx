import { useState, useEffect, useRef } from 'react'

// ── Fade-in hook ──────────────────────────────────────────────
function useFadeIn() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return [ref, visible]
}

function FadeIn({ children, delay = 0, style = {} }) {
  const [ref, visible] = useFadeIn()
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

// ── Bar component ─────────────────────────────────────────────
function Bar({ label, pct, color, max = 23.6 }) {
  const [ref, visible] = useFadeIn()
  const width = (pct / max) * 100
  return (
    <div ref={ref} style={{ display: 'grid', gridTemplateColumns: '160px 1fr 48px', alignItems: 'center', gap: 14, marginBottom: 14 }}>
      <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--muted2)', textAlign: 'right' }}>{label}</span>
      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 1, height: 6, overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          background: color,
          borderRadius: 1,
          width: visible ? `${width}%` : '0%',
          transition: 'width 1s ease 0.2s',
        }} />
      </div>
      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)' }}>{pct}%</span>
    </div>
  )
}

// ── Strategy accordion ────────────────────────────────────────
const strategies = [
  {
    n: '01', name: 'GHOST BUYER DETECTION',
    sub: 'Separar compradores reales de especuladores',
    tag: 'Costo: cero', tagColor: 'var(--green-light)', tagText: '#6ab88a',
    body: [
      'Después del incidente del cupón, un porcentaje de los 76,800 carritos abandonados no corresponde a compradores frustrados sino a usuarios que están esperando activamente otro error de precio. Mezclar ambos segmentos genera decisiones equivocadas — si intentas recuperarlos con descuentos, solo refuerzas el comportamiento especulativo.',
      'Ghost Buyer Detection segmenta los carritos por antigüedad y patrón de comportamiento. Carritos con más de 72 horas + historial de múltiples abandonos sin compra = perfil especulador. Carritos recientes de usuarios nuevos o con historial de compra = perfil comprador real.',
      'Al comprador real se le manda un recordatorio con urgencia genuina. Al especulador simplemente no se le alimenta con descuentos. Costo: cero — solo requiere filtros en la herramienta de analítica existente.',
    ]
  },
  {
    n: '02', name: 'SILENT JOURNEY MAPPING',
    sub: 'Encontrar el punto exacto donde el usuario abandona en móvil',
    tag: 'Costo: cero — Microsoft Clarity es gratis', tagColor: 'var(--green-light)', tagText: '#6ab88a',
    body: [
      'Los datos confirman problemas de navegación y mobile en el checkout, pero ningún número interno dice exactamente en qué paso específico se va el usuario — si es al ver el costo de envío, al intentar llenar el formulario, o porque el botón de pagar es difícil de presionar desde móvil.',
      'Silent Journey Mapping es la instalación de Microsoft Clarity (gratuito) que graba sesiones reales de usuarios navegando el sitio. En menos de dos semanas se tienen grabaciones de personas en celular intentando hacer checkout — se ve exactamente dónde se detienen, dónde hacen zoom y dónde simplemente cierran.',
      'Esta estrategia debe ejecutarse antes de cualquier inversión en rediseño. No tiene sentido gastar en arreglar el checkout sin saber primero qué parte está rota.',
    ]
  },
  {
    n: '03', name: 'HEARTBEAT LOGISTICS',
    sub: 'Eliminar el silencio post-compra que destruye la recompra',
    tag: 'Costo bajo — plataforma básica de mensajería', tagColor: 'var(--yellow-light)', tagText: '#c8a838',
    body: [
      'El 35.8% de las quejas de paquetería son por falta de notificaciones. El cliente no odia que el pedido tarde — odia no saber nada. La ansiedad post-compra es uno de los factores más documentados de pérdida de clientes recurrentes en ecommerce de moda.',
      'Heartbeat Logistics es la implementación de tres mensajes automáticos vía WhatsApp: el primero al confirmar el pedido, el segundo cuando sale del almacén, y el tercero cuando está en camino. Tres mensajes. Sin intervención humana.',
      'Lojas Renner (moda, Brasil) implementó una estrategia equivalente y obtuvo tasas de lectura 70% más altas que otros canales, con un aumento medible en clientes que regresaron a comprar.',
    ]
  },
  {
    n: '04', name: 'SECOND CHANCE FLOW',
    sub: 'Recuperar ventas perdidas en la primera hora del abandono',
    tag: 'Costo bajo — automatización de mensajería', tagColor: 'var(--yellow-light)', tagText: '#c8a838',
    body: [
      'La ventana de mayor intención de compra después de un abandono es la primera hora. Hoy Cloe.com no tiene ningún flujo automatizado que actúe en esa ventana — 76,800 usuarios se van y nadie los contacta.',
      'Second Chance Flow: primer mensaje a los 45 minutos (recordatorio sin descuento), segundo a las 24 horas (beneficio concreto si el margen lo permite), tercero a las 72 horas (urgencia genuina — disponibilidad limitada si aplica).',
      'Las marcas de moda que implementan esta estrategia recuperan entre 20-30% de carritos abandonados, con mejores casos llegando al 40%. Skullcandy recuperó 25-40% de ventas perdidas con este esquema. Aplicado al volumen de Cloe, el escenario conservador del 20% representa más de 15,000 ventas adicionales.',
    ]
  },
  {
    n: '05', name: 'TRUST RESET',
    sub: 'Reconstruir la confianza dañada por el incidente del cupón',
    tag: 'Urgente — el comportamiento especulativo crece con el tiempo', tagColor: 'var(--red-light)', tagText: '#d47060',
    body: [
      'El error de precio no fue el problema — llamarlo "flash promo" creó en parte de la audiencia la creencia de que Cloe hace promociones sorpresa de madrugada. Esa creencia no desaparece sola.',
      'Trust Reset es una comunicación proactiva a usuarios con carritos activos de más de 48 horas que establezca con claridad cómo funcionan realmente las promos de Cloe.com — cuándo se anuncian, por qué canal, con cuánta anticipación.',
      'El estándar internacional de Amazon ante errores de precio: cancelar el pedido, notificar al cliente, aclarar que no se hizo cargo alguno. Nunca llamarlo promo. Eso es exactamente lo que debe guiar la comunicación correctiva ahora.',
    ]
  },
  {
    n: '06', name: 'BRIDGE PROTOCOL',
    sub: 'Conectar Customer Experience con Ecommerce de forma permanente',
    tag: 'Cambio estructural — sin costo adicional', tagColor: 'rgba(200,168,130,0.1)', tagText: 'var(--accent)',
    body: [
      'El NPS de noviembre 2025 ya tenía el diagnóstico completo: quejas de paquetería, confusión en promociones, experiencia online deficiente. Esa información nunca llegó al equipo de ecommerce, y los problemas que el NPS describía en noviembre se convirtieron en los mismos que explican el 64% de abandono hoy.',
      'Bridge Protocol es una reunión quincenal donde ambos equipos cruzan tres métricas en conjunto: NPS online, tasa de abandono de carrito y top 3 de quejas de paquetería. Sin nueva tecnología, sin presupuesto.',
      'Solo requiere que dos equipos que hoy trabajan en silos compartan los mismos números al mismo tiempo. Eso solo ya hubiera permitido detectar el problema del cupón antes de que escalara.',
    ]
  },
]

function Strategy({ s }) {
  const [open, setOpen] = useState(s.n === '01')
  return (
    <div style={{
      border: `1px solid ${open ? 'var(--border2)' : 'var(--border)'}`,
      marginBottom: 2,
      transition: 'border-color 0.3s',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          background: open ? 'var(--surface2)' : 'var(--surface)',
          border: 'none',
          padding: '24px 28px',
          cursor: 'pointer',
          display: 'grid',
          gridTemplateColumns: '60px 1fr 28px',
          gap: 16,
          alignItems: 'center',
          textAlign: 'left',
          transition: 'background 0.2s',
        }}
      >
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)', letterSpacing: '0.1em' }}>
          {s.n} / 06
        </span>
        <div>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 500, color: 'var(--accent)', letterSpacing: '0.05em' }}>
            {s.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{s.sub}</div>
        </div>
        <span style={{
          fontSize: 20, color: 'var(--muted)',
          transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          transition: 'transform 0.3s',
          lineHeight: 1,
        }}>+</span>
      </button>

      {open && (
        <div style={{ padding: '0 28px 28px 104px', background: 'var(--surface)' }}>
          <span style={{
            display: 'inline-block',
            fontFamily: "'DM Mono', monospace",
            fontSize: 10,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            padding: '4px 10px',
            borderRadius: 2,
            background: s.tagColor,
            color: s.tagText,
            marginBottom: 16,
          }}>{s.tag}</span>
          {s.body.map((p, i) => (
            <p key={i} style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.8, marginBottom: 12 }}>{p}</p>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [activeNav, setActiveNav] = useState('inicio')

  const sections = ['inicio', 'causas', 'estrategias', 'marcas', 'fuentes']

  useEffect(() => {
    const handleScroll = () => {
      for (const id of sections) {
        const el = document.getElementById(id)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (rect.top <= 120) setActiveNav(id)
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const kpis = [
    { val: '80', label: 'NPS Online', color: 'var(--red)' },
    { val: '64%', label: 'Abandono carrito', color: 'var(--yellow)' },
    { val: '7%', label: 'Tasa respuesta NPS', color: 'var(--accent)' },
    { val: '50%', label: 'Tráfico desde móvil', color: 'var(--green)' },
  ]

  const bars = [
    { label: 'Variedad de productos', pct: 23.6, color: '#c8a882' },
    { label: 'Paquetería', pct: 20.4, color: '#c25a3a' },
    { label: 'Promociones', pct: 14.1, color: '#c8a020' },
    { label: 'Página / UX', pct: 7.3, color: '#4a6a8a' },
    { label: 'Calidad producto', pct: 6.5, color: '#5a7a6a' },
    { label: 'Atención al cliente', pct: 4.0, color: '#6a8a7a' },
    { label: 'Empaque', pct: 3.0, color: '#7a8a80' },
  ]

  const sources = [
    {
      group: 'Error de precios — Amazon',
      links: [
        { label: 'sellercentral.amazon.com — When You Make A Pricing Error', url: 'https://sellercentral.amazon.com/forums/t/when-you-make-a-pricing-error/388763' },
        { label: 'sellerlogic.com — Amazon Price Glitch & Seller Safeguards', url: 'https://www.sellerlogic.com/en/blog/amazon-price-glitch/' },
        { label: 'sellerapp.com — Amazon Price Glitch Guide', url: 'https://www.sellerapp.com/blog/amazon-price-glitch/' },
      ]
    },
    {
      group: 'Abandono de carrito en móvil y benchmarks',
      links: [
        { label: 'growcode.com — 10 Elements of Mobile Checkout That Need Improvement', url: 'https://www.growcode.com/blog/mobile-checkout-improvement/' },
        { label: 'getshogun.com — Ecommerce Conversion Rate Optimization', url: 'https://getshogun.com/guides/ecommerce-conversion-rate-optimization' },
        { label: 'mailmend.io — 44 Cart Abandonment Recovery Statistics 2026', url: 'https://mailmend.io/blogs/cart-abandonment-recovery-statistics' },
      ]
    },
    {
      group: 'Recuperación de carrito por WhatsApp',
      links: [
        { label: 'wapikit.com — WhatsApp Cart Abandonment Fashion Templates', url: 'https://www.wapikit.com/blog/whatsapp-cart-recovery-fashion-templates' },
        { label: 'business.whatsapp.com — Cart Recovery (caso Lojas Renner)', url: 'https://business.whatsapp.com/blog/shopping-cart-recovery-seasonal-sales' },
        { label: 'omnichat.ai — Cart Abandonment Recovery (caso FILA)', url: 'https://www.omnichat.ai/cart-abandonment-recovery/' },
        { label: 'infobip.com — Cart Abandonment: 11 Proven Strategies', url: 'https://www.infobip.com/blog/cart-abandonment-guide' },
      ]
    },
    {
      group: 'Casos de conversión y optimización',
      links: [
        { label: 'noahdigital.ca — CRO Case Studies (caso Walmart Canadá)', url: 'https://noahdigital.ca/blog/conversion-rate-optimization-case-studies-ecommerce/' },
        { label: 'vwo.com — Top 10 Conversion Rate Optimization Case Studies', url: 'https://vwo.com/conversion-rate-optimization/conversion-rate-optimization-case-studies/' },
      ]
    },
  ]

  // ── Styles ──
  const S = {
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      padding: '16px 40px',
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      background: 'rgba(10,10,10,0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    },
    navBrand: {
      fontFamily: "'DM Mono', monospace", fontSize: 11,
      color: 'var(--accent)', letterSpacing: '0.15em', textTransform: 'uppercase',
    },
    navLinks: { display: 'flex', gap: 24, listStyle: 'none' },
    page: { maxWidth: 900, margin: '0 auto', padding: '120px 32px 80px' },
    sectionTag: {
      fontFamily: "'DM Mono', monospace", fontSize: 10,
      textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--muted)',
      marginBottom: 14, display: 'flex', alignItems: 'center', gap: 12,
    },
    h2: {
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 'clamp(30px, 4vw, 46px)', fontWeight: 600,
      lineHeight: 1.1, letterSpacing: '-0.01em', marginBottom: 24, color: 'var(--text)',
    },
    p: { color: 'var(--muted2)', marginBottom: 16, fontWeight: 300 },
  }

  return (
    <>
      {/* NAV */}
      <nav style={S.nav}>
        <span style={S.navBrand}>Cloe.com — Diagnóstico</span>
        <ul style={S.navLinks}>
          {sections.map(id => (
            <li key={id}>
              <button
                onClick={() => scrollTo(id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontSize: 12, letterSpacing: '0.05em',
                  color: activeNav === id ? 'var(--accent)' : 'var(--muted2)',
                  transition: 'color 0.2s', textTransform: 'capitalize',
                }}
              >{id}</button>
            </li>
          ))}
        </ul>
      </nav>

      <div style={S.page}>

        {/* HERO */}
        <section id="inicio" style={{ paddingBottom: 72, borderBottom: '1px solid var(--border)', marginBottom: 72 }}>
          <FadeIn>
            <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 32, height: 1, background: 'var(--accent)', display: 'inline-block' }} />
              Canal Online B2C · Noviembre 2025
            </div>
            <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(52px, 8vw, 92px)', fontWeight: 600, lineHeight: 0.95, letterSpacing: '-0.02em', marginBottom: 28 }}>
              ¿Qué está<br />pasando en<br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Cloe.com?</em>
            </h1>
            <p style={{ ...S.p, fontSize: 17, maxWidth: 540, marginBottom: 44 }}>
              Diagnóstico ejecutivo basado en datos de NPS, clasificación B2C de quejas y análisis del comportamiento de carrito. Un canal con producto fuerte y confianza debilitada.
            </p>

            {/* KPIs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'var(--border)', border: '1px solid var(--border)', borderRadius: 2, overflow: 'hidden' }}>
              {kpis.map((k, i) => (
                <div key={i} style={{ background: 'var(--surface)', padding: '24px 16px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 40, fontWeight: 700, color: k.color, lineHeight: 1, marginBottom: 8 }}>{k.val}</div>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)' }}>{k.label}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </section>

        {/* QUÉ PASA */}
        <section style={{ marginBottom: 72 }}>
          <FadeIn>
            <div style={S.sectionTag}>
              <span>Contexto</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <h2 style={S.h2}>¿Qué está <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>pasando?</em></h2>
            <p style={S.p}>Cloe.com tiene el NPS más bajo de sus tres canales con un puntaje de 80, comparado con 92 de Boutique y 91 de Outlet. Al mismo tiempo tiene la tasa de respuesta más alta con un 7%, lo que significa que los clientes online están lo suficientemente inconformes como para tomarse el tiempo de quejarse.</p>
            <p style={S.p}>El abandono de carrito está en <strong style={{ color: 'var(--text)' }}>64% sobre 120,000 usuarios</strong> que agregan productos — aproximadamente <strong style={{ color: 'var(--text)' }}>76,800 personas</strong> con intención de compra que no llegan al checkout. Recuperar solo el 10% con ticket promedio de $500 MXN representa <strong style={{ color: 'var(--accent2)' }}>$3,840,000 MXN</strong> recuperables.</p>
          </FadeIn>
        </section>

        {/* CAUSAS */}
        <section id="causas" style={{ marginBottom: 72 }}>
          <FadeIn>
            <div style={S.sectionTag}>
              <span>Diagnóstico</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <h2 style={S.h2}>Las <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>3 causas</em> reales</h2>
          </FadeIn>

          {[
            {
              n: '01', title: 'Fricción técnica en móvil',
              body: 'El 50% del tráfico entra desde celular. La clasificación B2C confirma que Navegación representa el 44.8% de problemas en la categoría Página, y Mobile aparece como queja específica con 10.3%. Los benchmarks globales documentan que el abandono en móvil llega al 78% — Cloe está exactamente dentro de ese patrón.'
            },
            {
              n: '02', title: 'Desconfianza acumulada en el canal online',
              body: 'Paquetería es la segunda categoría con más quejas (20.4% del total B2C). De esas quejas, el 56.8% es por tiempos de entrega y el 35.8% por falta de notificaciones. El cliente compra y queda en silencio total — no sabe dónde está su pedido ni cuándo llega. Eso destruye la recompra.'
            },
            {
              n: '03', title: 'Comportamiento especulativo instalado por el incidente del cupón',
              body: 'Un error de configuración puso productos a precio cero durante 10-20 minutos. Se generaron 50 pedidos. Al comunicarlo como "flash promo", se le enseñó a una audiencia organizada que si dejan el carrito de madrugada, pueden conseguir productos gratis. Hay además una queja activa ante PROFECO.'
            },
          ].map((c, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                padding: '24px 28px', marginBottom: 2,
                display: 'grid', gridTemplateColumns: '44px 1fr', gap: 18, alignItems: 'start',
              }}>
                <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 34, fontWeight: 700, color: 'var(--border2)', lineHeight: 1 }}>{c.n}</span>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 15, color: 'var(--text)', marginBottom: 8 }}>{c.title}</div>
                  <p style={{ ...S.p, fontSize: 13.5, marginBottom: 0 }}>{c.body}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </section>

        {/* DATA BARS */}
        <section style={{ marginBottom: 72 }}>
          <FadeIn>
            <div style={S.sectionTag}>
              <span>Datos B2C</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <h2 style={S.h2}>¿De qué se <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>quejan?</em></h2>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 28, marginBottom: 20 }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)', marginBottom: 24 }}>
                Clasificación detallada de quejas B2C — Cloe.com
              </div>
              {bars.map((b, i) => <Bar key={i} {...b} />)}
            </div>
          </FadeIn>

          {/* INCIDENT */}
          <FadeIn delay={0.1}>
            <div style={{
              background: 'rgba(194,90,58,0.05)', border: '1px solid rgba(194,90,58,0.2)',
              padding: 32, marginBottom: 20, position: 'relative', overflow: 'hidden',
            }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--red)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--red)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
                Evento crítico — semana pasada
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 26, fontWeight: 600, color: '#d47060', marginBottom: 14 }}>
                El incidente del cupón en $0
              </div>
              <p style={{ ...S.p, fontSize: 14, marginBottom: 20 }}>
                Un error de configuración puso productos a precio cero un lunes por la noche. Duró entre 10 y 20 minutos. El área administrativa lo comunicó como una{' '}
                <strong style={{ color: '#d47060' }}>"flash promo"</strong>{' '}
                — esa fue la decisión más costosa, no el bug. Ahora una audiencia organizada sabe que puede pasar y está esperando que vuelva a ocurrir. Hay una queja ante PROFECO que necesita revisión legal urgente.
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {[['50', 'pedidos en 10 minutos'], ['1', 'queja PROFECO activa'], ['$0', 'precio mostrado']].map(([n, l]) => (
                  <div key={l} style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(194,90,58,0.15)', padding: 16, textAlign: 'center' }}>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 30, fontWeight: 700, color: 'var(--red)', lineHeight: 1 }}>{n}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>

          {/* OPPORTUNITY */}
          <FadeIn delay={0.2}>
            <div style={{
              background: 'var(--surface2)', border: '1px solid var(--border2)',
              padding: '36px 40px', display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center',
            }}>
              <div>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--muted)', marginBottom: 8 }}>
                  Oportunidad de recuperación — estimado conservador
                </div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 52, fontWeight: 700, color: 'var(--accent2)', lineHeight: 1 }}>
                  $3,840,000
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 8 }}>
                  MXN · recuperando 10% de 76,800 abandonos a ticket promedio de $500
                </div>
              </div>
              <p style={{ ...S.p, fontSize: 13, textAlign: 'right', maxWidth: 200, marginBottom: 0 }}>
                Incluso con el 5%, el impacto supera $1.9M MXN sin cambiar precios ni producto.
              </p>
            </div>
          </FadeIn>
        </section>

        {/* ESTRATEGIAS */}
        <section id="estrategias" style={{ marginBottom: 72 }}>
          <FadeIn>
            <div style={S.sectionTag}>
              <span>Plan de acción</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <h2 style={S.h2}>Las 6 <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>estrategias</em></h2>
          </FadeIn>
          {strategies.map((s, i) => (
            <FadeIn key={s.n} delay={i * 0.05}>
              <Strategy s={s} />
            </FadeIn>
          ))}
        </section>

        {/* MARCAS */}
        <section id="marcas" style={{ marginBottom: 72 }}>
          <FadeIn>
            <div style={S.sectionTag}>
              <span>Referentes internacionales</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <h2 style={S.h2}>Lo que han hecho <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>otras marcas</em></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginBottom: 28 }}>
              {[
                { name: 'Amazon', body: 'Ante errores de precio cancela el pedido, notifica al cliente y aclara que no se hizo ningún cargo — nunca lo llaman promo. Eso evita que los usuarios aprendan a esperar errores de precio como estrategia comercial.' },
                { name: 'Lojas Renner', body: 'Retailer de moda en Brasil. Implementó recuperación de carritos vía WhatsApp y obtuvo tasas de lectura 70% más altas que otros canales, con aumento significativo en clientes que regresaron a finalizar su compra.' },
                { name: 'Walmart Canadá', body: 'Invirtió en hacer su experiencia móvil más rápida y responsiva. Resultado: incremento del 20% en conversiones generales y un aumento del 98% en órdenes desde móvil.' },
              ].map((b) => (
                <div key={b.name} style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: 22 }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--accent)', marginBottom: 10 }}>{b.name}</div>
                  <p style={{ ...S.p, fontSize: 13, marginBottom: 0 }}>{b.body}</p>
                </div>
              ))}
            </div>
            <p style={S.p}>El patrón que repiten todas estas marcas es el mismo: el problema nunca es uno solo — siempre es confianza + fricción técnica + comunicación, y la solución requiere atacar los tres al mismo tiempo.</p>
          </FadeIn>
        </section>

        {/* FUENTES */}
        <section id="fuentes" style={{ marginBottom: 72 }}>
          <FadeIn>
            <div style={S.sectionTag}>
              <span>Bibliografía</span>
              <span style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <h2 style={S.h2}>Fuentes <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>consultadas</em></h2>
            <div style={{ display: 'grid', gap: 28 }}>
              {sources.map((sg) => (
                <div key={sg.group}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--accent)', marginBottom: 10 }}>{sg.group}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {sg.links.map((l) => (
                      <a key={l.url} href={l.url} target="_blank" rel="noopener noreferrer" style={{
                        fontFamily: "'DM Mono', monospace", fontSize: 12,
                        color: 'var(--muted2)', textDecoration: 'none',
                        padding: '8px 12px', background: 'var(--surface)',
                        border: '1px solid var(--border)', borderRadius: 2,
                        wordBreak: 'break-all',
                        transition: 'color 0.2s, border-color 0.2s, background 0.2s',
                      }}
                        onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.background = 'var(--surface2)' }}
                        onMouseLeave={e => { e.currentTarget.style.color = 'var(--muted2)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--surface)' }}
                      >
                        {l.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: 'var(--surface2)', border: '1px solid var(--border)', borderLeft: '3px solid var(--accent)', padding: '14px 18px', fontSize: 13, color: 'var(--muted2)', marginTop: 24 }}>
              <strong style={{ color: 'var(--accent)' }}>Nota sobre fuentes internas:</strong> Los datos de NPS (noviembre 2025), clasificación B2C, volumen de carritos, el incidente del cupón y la queja ante PROFECO son datos internos de Cloe proporcionados directamente en el análisis.
            </div>
          </FadeIn>
        </section>

        {/* CONCLUSIÓN */}
        <FadeIn>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: 56, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48 }}>
            {[
              { title: 'El problema de fondo', body: 'Cloe.com tiene un problema de confianza acumulada en el canal online, no un problema de producto. El NPS de 80 ya lo decía en noviembre. El cliente online ha tenido malas experiencias con entregas, empaques y promociones confusas — y el incidente del cupón llegó a una audiencia que ya estaba en guardia.' },
              { title: 'La buena noticia', body: 'La marca es altamente valorada. El problema no es el producto, es el canal online y la experiencia post-compra. Eso es perfectamente solucionable. El dinero no está en conseguir nuevos clientes — está en no perder a los 76,800 que ya llegaron hasta el carrito.' },
            ].map((c) => (
              <div key={c.title}>
                <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600, marginBottom: 12, color: 'var(--text)' }}>{c.title}</h3>
                <p style={{ ...S.p, fontSize: 14 }}>{c.body}</p>
              </div>
            ))}
          </div>
        </FadeIn>
      </div>

      {/* FOOTER */}
      <footer style={{
        marginTop: 40, padding: '28px 40px',
        borderTop: '1px solid var(--border)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        fontFamily: "'DM Mono', monospace", fontSize: 11, color: 'var(--muted)',
        position: 'relative', zIndex: 1,
      }}>
        <span>Cloe.com — Diagnóstico Ejecutivo</span>
        <span>NPS Nov 2025 · Clasificación B2C · Análisis de carrito</span>
      </footer>
    </>
  )
}
