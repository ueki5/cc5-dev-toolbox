'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { getClaimDescription } from '@/lib/jwt'

type Props = {
  title: 'Header' | 'Payload' | 'Signature'
  data: Record<string, unknown> | string
}

function ValueDisplay({ value }: { value: unknown }): React.ReactNode {
  if (value === null) return <span className="text-muted-foreground">null</span>
  if (typeof value === 'boolean') {
    return <span className="text-blue-500">{String(value)}</span>
  }
  if (typeof value === 'number') {
    return <span className="text-amber-500">{String(value)}</span>
  }
  if (typeof value === 'string') {
    return <span className="text-green-600 dark:text-green-400">&quot;{value}&quot;</span>
  }
  return <span>{JSON.stringify(value)}</span>
}

export function JwtCard({ title, data }: Props) {
  const titleColors = {
    Header: 'text-violet-500',
    Payload: 'text-blue-500',
    Signature: 'text-rose-500',
  }

  return (
    <Card className="flex-1 min-w-0">
      <CardHeader className="border-b pb-4">
        <CardTitle className={titleColors[title]}>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        {typeof data === 'string' ? (
          <p className="font-mono text-xs break-all text-muted-foreground">
            {data}
          </p>
        ) : (
          <TooltipProvider>
            <dl className="space-y-2">
              {Object.entries(data).map(([key, value]) => {
                const description = getClaimDescription(key)
                const keyElement = (
                  <dt className="text-sm font-medium text-foreground cursor-default">
                    {key}
                  </dt>
                )

                return (
                  <div key={key} className="flex flex-col gap-0.5">
                    {description ? (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="w-fit underline decoration-dotted underline-offset-2">
                            {keyElement}
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{description}</p>
                        </TooltipContent>
                      </Tooltip>
                    ) : (
                      keyElement
                    )}
                    <dd className="font-mono text-xs pl-2">
                      <ValueDisplay value={value} />
                    </dd>
                  </div>
                )
              })}
            </dl>
          </TooltipProvider>
        )}
      </CardContent>
    </Card>
  )
}
