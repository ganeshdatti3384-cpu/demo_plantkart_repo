
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Car, Briefcase, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/accommodation', icon: Home, label: 'Home' },
  { href: '/vehicles', icon: Car, label: 'Vehicles' },
  { href: '/consultancy', icon: Briefcase, label: 'Consultancy' },
  { href: '/profile', icon: User, label: 'Profile' },
];

export function BottomNavBar() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur-sm md:hidden">
      <nav className="grid h-16 grid-cols-4 items-center justify-center text-xs">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-primary',
                isActive && 'text-primary'
              )}
            >
              <div className={cn(
                "flex h-8 w-12 items-center justify-center rounded-full transition-colors",
                isActive && 'bg-primary'
              )}>
                <item.icon className={cn(
                  "h-6 w-6",
                  isActive && 'text-white'
                )} />
              </div>
              <span className="text-xs">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
