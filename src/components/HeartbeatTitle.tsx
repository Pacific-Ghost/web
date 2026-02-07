import { generateEKGPath, PULSE_SPEED } from '../utils/ekg'

export function HeartbeatTitle({ text }: { text: string }) {
  const ekgPath = generateEKGPath(0, 1000, 100, 3, 60)

  return (
    <div className="heartbeat-title">
      <h1 className="monitor-text">{text}</h1>
      <div className="monitor-line-container">
        <svg viewBox="0 0 1000 200" preserveAspectRatio="xMidYMid meet">
          <path d={ekgPath} className="monitor-flatline" />
          <path
            d={ekgPath}
            className="monitor-pulse-line"
            style={{
              strokeDasharray: '150 2500',
              animation: `monitorPulse ${PULSE_SPEED}s linear infinite`,
            }}
          />
          <circle r="4" className="monitor-dot">
            <animateMotion
              dur={`${PULSE_SPEED}s`}
              repeatCount="indefinite"
              path={ekgPath}
            />
          </circle>
        </svg>
      </div>
    </div>
  )
}
