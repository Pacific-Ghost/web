import { useState, useEffect, type RefObject } from 'react'

export function useActiveSection(
  ids: string[],
  refs: RefObject<HTMLElement | null>[],
): string {
  const [activeId, setActiveId] = useState(ids[0])

  useEffect(() => {
    const ratios = new Map<Element, number>()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target, entry.intersectionRatio)
        }

        let maxRatio = 0
        let maxElement: Element | null = null
        for (const [element, ratio] of ratios) {
          if (ratio > maxRatio) {
            maxRatio = ratio
            maxElement = element
          }
        }

        if (maxElement) {
          const index = refs.findIndex((ref) => ref.current === maxElement)
          if (index !== -1) {
            setActiveId(ids[index])
          }
        }
      },
      { threshold: [0, 0.25, 0.5, 0.75, 1] },
    )

    for (const ref of refs) {
      if (ref.current) {
        observer.observe(ref.current)
      }
    }

    return () => observer.disconnect()
  }, [ids, refs])

  return activeId
}
