'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  CheckCircle2, 
  LogOut, 
  User as UserIcon,
  Bell,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect } from 'react';
import { ProfileModal } from '@/components/auth/ProfileModal';
import Link from 'next/link';
import { 
  ChevronLeft, 
  ChevronRight, 
  PanelLeftClose, 
  PanelLeftOpen 
} from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Initial color mode check
    if (document.documentElement.classList.contains('dark')) {
      setIsDarkMode(true);
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'My Tasks', icon: CheckCircle2, href: '/dashboard/tasks' },
  ];

  if (!isMounted) return null;

  const SidebarContent = ({ className, showBranding = true, isCollapsed = false }: { className?: string, showBranding?: boolean, isCollapsed?: boolean }) => (
    <div className={cn("flex h-full flex-col", className)}>
      <div className={cn("flex h-16 items-center border-b px-6 gap-3 transition-all", isCollapsed ? "justify-center px-0" : "")}>
        <div className="h-9 w-9 shrink-0 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-lg shadow-primary/20">T</div>
        {!isCollapsed && <span className="font-bold text-xl tracking-tight transition-all duration-300 opacity-100">Todo</span>}
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href} passHref>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-4 px-3 py-6 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all group",
                isCollapsed ? "justify-center px-0" : ""
              )}
              title={isCollapsed ? item.label : ""}
            >
              <item.icon className="h-5 w-5 shrink-0 group-hover:scale-110 transition-transform" />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </Button>
          </Link>
        ))}
      </nav>
      <div className={cn("p-4 border-t bg-muted/20 transition-all", isCollapsed ? "px-2" : "p-4")}>
         <div 
           className={cn(
             "flex items-center gap-3 px-2 py-3 cursor-pointer hover:bg-primary/5 rounded-lg transition-colors",
             isCollapsed ? "justify-center px-0" : ""
           )} 
           onClick={() => setIsProfileModalOpen(true)}
         >
           <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm shrink-0">
             <AvatarImage src={user?.avatar} />
             <AvatarFallback className="bg-primary/10 text-primary uppercase font-bold">{user?.name?.charAt(0)}</AvatarFallback>
           </Avatar>
           {!isCollapsed && (
             <div className="flex flex-col overflow-hidden transition-all duration-300">
               <span className="text-sm font-semibold leading-none truncate">{user?.name}</span>
               <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
             </div>
           )}
         </div>
         <Button 
           variant="outline" 
           className={cn(
             "w-full mt-4 gap-2 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-colors",
             isCollapsed ? "px-0 justify-center" : ""
           )} 
           onClick={logout}
           title={isCollapsed ? "Sign Out" : ""}
         >
           <LogOut className="h-4 w-4 shrink-0" />
           {!isCollapsed && <span>Sign Out</span>}
         </Button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background text-foreground transition-all duration-300">
        {/* Desktop Sidebar */}
        <aside 
          className={cn(
            "fixed left-0 top-0 hidden h-full border-r bg-card/80 backdrop-blur-xl lg:block transition-all duration-300 z-40 group",
            isSidebarExpanded ? "w-64" : "w-20"
          )}
        >
          <SidebarContent isCollapsed={!isSidebarExpanded} />
          
          {/* Collapse Toggle Button */}
          <Button
            variant="secondary"
            size="icon"
            className="absolute -right-3 top-20 h-6 w-6 rounded-full border shadow-md opacity-0 group-hover:opacity-100 transition-opacity z-50"
            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          >
            {isSidebarExpanded ? <ChevronLeft className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
          </Button>
        </aside>

        {/* Main Content Area */}
        <div 
          className={cn(
            "flex-1 flex flex-col min-h-screen w-full transition-all duration-300",
            isMounted && (isSidebarExpanded ? "lg:pl-64" : "lg:pl-20")
          )}
        >
          <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-md px-6 lg:px-10">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Toggle */}
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="p-0 w-72">
                  <SidebarContent className="border-none" />
                </SheetContent>
              </Sheet>

              <div className="lg:hidden flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">T</div>
                <span className="font-bold tracking-tight text-lg">Todo</span>
              </div>

              {!isSidebarExpanded && (
                 <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                    onClick={() => setIsSidebarExpanded(true)}
                 >
                    <PanelLeftOpen className="h-5 w-5 text-muted-foreground" />
                 </Button>
              )}
              {isSidebarExpanded && (
                 <Button
                    variant="ghost"
                    size="icon"
                    className="hidden lg:flex"
                    onClick={() => setIsSidebarExpanded(false)}
                 >
                    <PanelLeftClose className="h-5 w-5 text-muted-foreground" />
                 </Button>
              )}
            </div>

            <div className="hidden lg:block">
              <h2 className="text-sm font-medium text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border border-primary/5">
                Welcome back, <span className="text-foreground font-semibold">{user?.name}</span> 👋
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full hover:bg-primary/10 transition-colors">
                {isDarkMode ? <Sun className="h-5 w-5 text-amber-500" /> : <Moon className="h-5 w-5 text-slate-500" />}
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full relative hover:bg-primary/10 transition-colors">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-destructive border-2 border-background" />
              </Button>
              <Separator orientation="vertical" className="h-6 mx-1 hidden sm:block" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all">
                    <Avatar className="h-10 w-10 shadow-sm">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-primary/5 text-primary uppercase font-bold">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-primary/10">
                  <DropdownMenuLabel className="font-bold flex items-center gap-2 p-3">
                    <Avatar className="h-8 w-8">
                       <AvatarImage src={user?.avatar} />
                       <AvatarFallback className="text-[10px] bg-primary/10 uppercase">{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm truncate w-40">{user?.name}</span>
                      <span className="text-xs font-normal text-muted-foreground truncate w-40">{user?.email}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="p-3 gap-2 cursor-pointer rounded-lg hover:bg-primary/5" onClick={() => setIsProfileModalOpen(true)}>
                    <UserIcon className="h-4 w-4 text-primary" /> Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive font-semibold p-3 gap-2 cursor-pointer rounded-lg hover:bg-destructive/5" onClick={logout}>
                    <LogOut className="h-4 w-4" /> Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-10 max-w-[1600px] mx-auto w-full transition-all">
            {children}
          </main>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
      />
    </ProtectedRoute>
  );
}
