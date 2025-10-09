'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Package,
  UserCircle,
  Wand,
  LifeBuoy,
  LogOut,
  PenSquare,
  TrendingUp,
} from 'lucide-react';

const navItems = [
  { href: '/dashboard-artisan', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard-artisan/products', label: 'Products', icon: Package },
  { href: '/dashboard-artisan/growth', label: 'Growth', icon: TrendingUp },
  { href: '/dashboard-artisan/profile', label: 'Manage Profile', icon: UserCircle },
  { href: '/dashboard-artisan/ai-tools/product-generator', label: 'AI Product Generator', icon: PenSquare },
  { href: '/dashboard-artisan/ai-tools/story-assistant', label: 'AI Story Assistant', icon: Wand },
];

const bottomNavItems = [
    { href: '/support', label: 'Support', icon: LifeBuoy },
]

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  return (
    <>
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton
            asChild
            isActive={item.href === '/dashboard-artisan' ? pathname === item.href : pathname.startsWith(item.href)}
            tooltip={item.label}
          >
            <Link href={item.href}>
              <item.icon />
              <span>{item.label}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
    <SidebarMenu className="mt-auto">
        {bottomNavItems.map((item) => (
            <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
                asChild
                tooltip={item.label}
            >
                <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
                </Link>
            </SidebarMenuButton>
            </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                <LogOut />
                <span>Logout</span>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
    </>
  );
}
