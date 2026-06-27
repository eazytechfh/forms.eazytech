import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'EazyTech - Briefing IA'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #f3f0ff 0%, #e9d5ff 50%, #f5d0fe 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        <img
          src="https://briefing-ia.eazy.tec.br/s-c3-admbolo-20gradiente.png"
          width={180}
          height={180}
          style={{ borderRadius: 32 }}
        />
        <div style={{ fontSize: 64, fontWeight: 700, color: '#1e1b4b' }}>
          Briefing IA
        </div>
        <div style={{ fontSize: 28, color: '#6d28d9' }}>
          eazy.tec.br
        </div>
      </div>
    ),
    { ...size },
  )
}
