import { EPTheme } from '../data/eps'

interface StoryProgressProps {
  eps: EPTheme[]
  currentEP: number
  currentItemProgress: number
}

export function StoryProgress({
  eps,
  currentEP,
  currentItemProgress,
}: StoryProgressProps) {
  return (
    <div className="story-progress">
      {eps.map((ep, index) => (
        <div key={ep.id} className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width:
                index < currentEP
                  ? '100%'
                  : index === currentEP
                  ? `${currentItemProgress}%`
                  : '0%',
            }}
          />
        </div>
      ))}
    </div>
  )
}
