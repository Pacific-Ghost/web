export class EKGService {
  static readonly PULSE_SPEED = 3 // seconds per cycle

  static generatePath(
    startX: number,
    endX: number,
    centerY: number,
    numBeats: number,
    amplitude: number,
  ): string {
    const segmentWidth = (endX - startX) / numBeats
    let d = `M ${startX} ${centerY}`

    for (let i = 0; i < numBeats; i++) {
      const x = startX + i * segmentWidth
      const flatLen = segmentWidth * 0.35
      const spikeStart = x + flatLen
      const spikeWidth = segmentWidth * 0.3

      d += ` L ${spikeStart} ${centerY}`
      d += ` Q ${spikeStart + spikeWidth * 0.1} ${centerY - amplitude * 0.15} ${spikeStart + spikeWidth * 0.2} ${centerY}`
      d += ` L ${spikeStart + spikeWidth * 0.3} ${centerY + amplitude * 0.15}`
      d += ` L ${spikeStart + spikeWidth * 0.4} ${centerY - amplitude}`
      d += ` L ${spikeStart + spikeWidth * 0.5} ${centerY + amplitude * 0.4}`
      d += ` L ${spikeStart + spikeWidth * 0.6} ${centerY}`
      d += ` Q ${spikeStart + spikeWidth * 0.8} ${centerY - amplitude * 0.2} ${spikeStart + spikeWidth} ${centerY}`
      d += ` L ${x + segmentWidth} ${centerY}`
    }

    return d
  }
}
