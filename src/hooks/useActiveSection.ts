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

        // Only switch when a section is majority-visible to prevent
        // rapid flipping during mid-scroll
        for (const [element, ratio] of ratios) {
          if (ratio > 0.5) {
            const index = refs.findIndex((ref) => ref.current === element)
            if (index !== -1) {
              setActiveId(ids[index])
            }
            break
          }
        }
      },
      { threshold: [0, 0.5, 1] },
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
