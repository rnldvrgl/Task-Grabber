import { User } from '@supabase/supabase-js'
import { Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { useAuthStore } from '@/store/AuthStore'
import { useEffect, useState } from 'react'
import { getUserByUsername } from '@/actions/user'

const VERIFICATIONS = [
  {
    name: "Email",
    icon: Mail,
    check: (user: User | null) =>
      !!user && !!user.email && !!user.email_confirmed_at,
    get: (user: User | null) => user?.email || 'Unverified',
  },
]

export function VerificationList() {
  const { user } = useAuthStore()

  return (
    <Card className="shadow-lg rounded-md">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold">Account Verifications</h3>
        <p className="text-sm text-muted-foreground">
          Verify your account for additional security
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-4">
          {VERIFICATIONS.map((verification) => (
            <li
              key={verification.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-x-3">
                <verification.icon
                  className={`w-6 h-6 ${verification.check(user)
                    ? 'text-green-500'
                    : 'text-gray-400'
                    }`}
                />
                <span className="text-base font-medium">
                  {verification.name}
                </span>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${verification.check(user)
                        ? 'border-green-500'
                        : 'border-gray-400'
                        }`}
                    >
                      {verification.check(user) ? 'Verified' : 'Unverified'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{verification.get(user)}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

interface SeekerVerificationListProps {
  username: string
}
export function SeekerVerificationList({ username }: SeekerVerificationListProps) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    getUserByUsername(username).then(data => setUser(data))
  }, [username])

  return (
    <Card className="shadow-lg rounded-md">
      <CardHeader className="pb-4">
        <h3 className="text-lg font-semibold">Contacts</h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-4">
          {VERIFICATIONS.map((verification) => (
            <li
              key={verification.name}
              className="flex items-center justify-between gap-x-12"
            >
              <div className="flex items-center gap-x-3">
                <verification.icon
                  className={`w-6 h-6 ${verification.check(user)
                    ? 'text-green-500'
                    : 'text-gray-400'
                    }`}
                />
                <span className="text-base font-medium">
                  {verification.name}
                </span>
              </div>
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`${verification.check(user)
                        ? 'border-green-500'
                        : 'border-gray-400'
                        }`}
                    >
                      {verification.check(user) ? 'Verified' : 'Unverified'}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>{verification.get(user)}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
