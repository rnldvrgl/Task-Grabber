import { TNavbarRoute, UserRole } from '@/lib/types'
import { useMemo } from 'react'

const useNavbarRoutes = (role?: UserRole): TNavbarRoute[] => {
  const NavbarRoutes: TNavbarRoute[] = useMemo(() => {
    // Routes for unauthenticated users
    const publicRoutes: TNavbarRoute[] = [
      { label: 'Home', path: '/#' },
      { label: 'About', path: '/#about' },
      { label: 'Contact Us', path: '/#contact-us' },
    ]

    // Routes for SKRs
    const seekerRoutes: TNavbarRoute[] = [
      { label: 'Home', path: '/skr/' },
      { label: 'Grab Tasks', path: '/skr/tasks/' },
    ]

    // Routes for PDRs
    const providerRoutes: TNavbarRoute[] = [
      { label: 'Home', path: '/pdr/' },
      { label: 'Tasks', path: '/pdr/tasks/' },
    ]

    // Return different routes based on the role
    if (role === 'SKR') {
      return seekerRoutes
    } else if (role === 'PDR') {
      return providerRoutes
    } else {
      return publicRoutes // For unauthenticated users
    }
  }, [role])

  return NavbarRoutes
}

export default useNavbarRoutes
