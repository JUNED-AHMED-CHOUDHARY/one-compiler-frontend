export type FinishedStatus = 'completed' | 'failed'
export type JobState =
  | FinishedStatus
  | 'active'
  | 'delayed'
  | 'prioritized'
  | 'waiting'
  | 'waiting-children'
