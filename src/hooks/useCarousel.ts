import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

export type CarouselItemId = string
export type Direction = 'left' | 'right'

export type UseCarouselReturn = {
  currentItemProgress: number
  autoPlay: boolean
  toggleAutoPlay: () => void
  next: () => void
  prev: () => void
  direction: Direction
}

const DEFAULT_SLIDE_DURATION = 10000
const PROGRESS_INTERVAL = 100

export function useCarousel(
  items: Set<CarouselItemId>,
  currentId: CarouselItemId,
  onNavigate: (id: CarouselItemId) => void,
  slideDuration: number = DEFAULT_SLIDE_DURATION,
): UseCarouselReturn {
  const itemsArray = useMemo(() => Array.from(items), [items])

  const directionRef = useRef<Direction>('right')
  const prevIdRef = useRef(currentId)
  const onNavigateRef = useRef(onNavigate)
  onNavigateRef.current = onNavigate

  const [autoPlay, setAutoPlay] = useState(false)
  const [currentItemProgress, setCurrentItemProgress] = useState(0)

  const currentIndex = itemsArray.indexOf(currentId)

  if (currentId !== prevIdRef.current) {
    prevIdRef.current = currentId
  }

  const getNextId = useCallback(() => {
    const nextIndex = (currentIndex + 1) % itemsArray.length
    return itemsArray[nextIndex]
  }, [currentIndex, itemsArray])

  const getPrevId = useCallback(() => {
    const prevIndex = (currentIndex - 1 + itemsArray.length) % itemsArray.length
    return itemsArray[prevIndex]
  }, [currentIndex, itemsArray])

  const next = useCallback(() => {
    directionRef.current = 'right'
    setCurrentItemProgress(100)
    onNavigateRef.current(getNextId())
  }, [getNextId])

  const prev = useCallback(() => {
    directionRef.current = 'left'
    setCurrentItemProgress(100)
    onNavigateRef.current(getPrevId())
  }, [getPrevId])

  const toggleAutoPlay = useCallback(() => {
    setAutoPlay((prev) => !prev)
  }, [])

  // Auto-advance timer and progress
  useEffect(() => {
    if (!autoPlay) return

    setCurrentItemProgress(0)
    const startTime = Date.now()

    const intervalId: ReturnType<typeof setInterval> = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min((elapsed / slideDuration) * 100, 100)
      setCurrentItemProgress(progress)
    }, PROGRESS_INTERVAL)

    const timeoutId: ReturnType<typeof setTimeout> = setTimeout(() => {
      const nextIndex = (currentIndex + 1) % itemsArray.length
      onNavigateRef.current(itemsArray[nextIndex])
    }, slideDuration)

    return () => {
      clearInterval(intervalId)
      clearTimeout(timeoutId)
    }
  }, [autoPlay, currentId, currentIndex, itemsArray, slideDuration])

  return {
    currentItemProgress,
    autoPlay,
    toggleAutoPlay,
    next,
    prev,
    direction: directionRef.current,
  }
}
