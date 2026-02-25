'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Code2, Binary, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const tools = [
  { href: '/json',   label: 'JSON整形', icon: Code2    },
  { href: '/base64', label: 'Base64',   icon: Binary   },
  { href: '/jwt',    label: 'JWT',      icon: KeyRound },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex flex-col w-14 md:w-52 border-r bg-muted/40 shrink-0 py-4 gap-1 px-2">
      <div className="mb-4 px-2 hidden md:block">
        <span className="text-sm font-semibold text-muted-foreground tracking-wide">Dev Toolbox</span>
      </div>
      {tools.map(({ href, label, icon: Icon }) => {
        const isActive = pathname.startsWith(href)
        return (
          <Button
            key={href}
            variant="ghost"
            asChild
            className={cn(
              'justify-start gap-3 w-full',
              isActive && 'bg-accent text-accent-foreground'
            )}
          >
            <Link href={href}>
              <Icon className="h-4 w-4 shrink-0" />
              <span className="hidden md:block">{label}</span>
            </Link>
          </Button>
        )
      })}
    </aside>
  )
}
