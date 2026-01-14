

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Briefcase,
  Car,
  FileText,
  Home,
  LayoutDashboard,
  Plane,
  User,
  Bell,
  Users2,
  ListTodo,
  Ticket,
  Calendar,
  Building,
  BookMarked,
  Landmark,
} from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { type UserProfile } from '@/types';
import { BottomNavBar } from '@/components/BottomNavBar';

const allMenuItems = [
  // User Routes
  { href: '/accommodation', label: 'Accommodation', icon: Home, roles: ['user'] },
  { href: '/accommodation-management', label: 'My Properties', icon: Home, roles: ['user'] },
  { href: '/vehicles', label: 'Vehicles', icon: Car, roles: ['user'] },
  { href: '/airport-pickup', label: 'Airport Pickup', icon: Plane, roles: ['user'] },
  { href: '/consultancy', label: 'Consultancy', icon: Briefcase, roles: ['user'], alwaysShow: true },
  { href: '/resume-builder', label: 'Resume Builder', icon: FileText, roles: ['user'] },
  { href: '/jobs', label: 'Jobs', icon: Building, roles: ['user'] },
  { href: '/discounts', label: 'Discounts', icon: Ticket, roles: ['user'] },
  { href: '/events', label: 'Events', icon: Calendar, roles: ['user'] },
  { href: '/loan-application', label: 'Apply for Loan', icon: Landmark, roles: ['user'] },
  { href: '/profile', label: 'My Profile', icon: User, roles: ['user'], alwaysShow: true },
  
  // Admin Routes
  { href: '/dashboard', label: 'Admin Dashboard', icon: LayoutDashboard, roles: ['admin'] },
  { href: '/user-management', label: 'User Management', icon: Users2, roles: ['admin'] },
  { href: '/vendor-management', label: 'Vendor Management', icon: Car, roles: ['admin'] },
  { href: '/consultant-management', label: 'Consultant Mgt', icon: Briefcase, roles: ['admin'] },
  { href: '/pickup-management', label: 'Pickup Requests', icon: ListTodo, roles: ['admin'] },
  { href: '/job-management', label: 'Job Management', icon: Building, roles: ['admin'] },
  { href: '/discount-management', label: 'Discount Mgt', icon: Ticket, roles: ['admin'] },
  { href: '/event-management', label: 'Event Management', icon: Calendar, roles: ['admin'] },
  { href: '/loan-provider-management', label: 'Loan Providers', icon: Landmark, roles: ['admin'] },
  { href: '/loan-application-management', label: 'Loan Applications', icon: FileText, roles: ['admin'] },

  // Vendor & Consultant Routes
  { href: '/vendor-dashboard', label: 'My Vehicles', icon: Car, roles: ['vendor'] },
  { href: '/vendor-bookings', label: 'My Bookings', icon: BookMarked, roles: ['vendor'] },
  { href: '/vendor-profile', label: 'My Profile', icon: User, roles: ['vendor'] },
  { href: '/consultant-dashboard', label: 'My Bookings', icon: Briefcase, roles: ['consultant'] },
];


export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [hasVisa, setHasVisa] = useState<boolean>(true); // Default to true

  useEffect(() => {
    if (session?.user?.role) {
      setUserRole(session.user.role as string);
    } else if (status === 'unauthenticated') {
      // If not authenticated, default to user role for public access
      setUserRole('user');
    }
  }, [session, status]);

  const getMenuItems = () => {
    if (!userRole) return [];
    
    // Filter items based on the user's role
    let roleItems = allMenuItems.filter(item => item.roles.includes(userRole.toLowerCase()));
    
    // If the user has no visa, further filter the items
    if (userRole === 'user' && !hasVisa) {
        return roleItems.filter(item => item.alwaysShow);
    }
    
    return roleItems;
  };
  
  const menuItems = getMenuItems();

  // Show loading state while session is loading
  if (status === 'loading') {
    return (
        <div className="flex h-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className="justify-start"
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <div className="flex items-center gap-3 p-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src="https://picsum.photos/seed/avatar/100/100" alt="@user" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="flex flex-col truncate">
                <span className="font-semibold text-sidebar-foreground truncate capitalize">
                  {userRole}
                </span>
                <Link href="/" className="text-xs text-sidebar-foreground/70 hover:text-primary">
                  Sign Out
                </Link>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-20 lg:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="w-full flex-1">
                {/* Future breadcrumbs or search can go here */}
            </div>
             <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
                <span className="sr-only">Notifications</span>
            </Button>
             <Link href="/profile">
                <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Profile</span>
                </Button>
            </Link>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 pb-24 md:pb-8">{children}</main>
        {userRole === 'user' && <BottomNavBar />}
      </SidebarInset>
    </SidebarProvider>
  );
}
