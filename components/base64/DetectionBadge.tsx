import { Badge } from '@/components/ui/badge'

type Props = {
  mode: 'encoded' | 'plain'
}

export function DetectionBadge({ mode }: Props) {
  if (mode === 'encoded') {
    return <Badge variant="default">Encoded</Badge>
  }
  return <Badge variant="secondary">Plain Text</Badge>
}
