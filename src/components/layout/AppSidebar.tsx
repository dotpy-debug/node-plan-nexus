import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { 
  CheckSquare, 
  Workflow, 
  Calendar, 
  BarChart3, 
  Settings,
  Plus,
  User,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const items = [
  {
    title: 'Dashboard',
    url: '/',
    icon: Home,
  },
  {
    title: 'Tasks',
    url: '/tasks',
    icon: CheckSquare,
  },
  {
    title: 'Flows',
    url: '/flows',
    icon: Workflow,
  },
  {
    title: 'Calendar',
    url: '/calendar',
    icon: Calendar,
  },
  {
    title: 'Reports',
    url: '/reports', 
    icon: BarChart3,
  },
  {
    title: 'Settings',
    url: '/settings',
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => {
    if (path === '/') {
      return currentPath === '/';
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar className="border-r border-terminal-border bg-terminal-bg">
      <SidebarHeader className="p-4 border-b border-terminal-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Workflow className="h-4 w-4 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-primary font-mono">
              pythoughts
            </h1>
            <p className="text-xs text-muted-foreground font-mono">v1.0.0</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-terminal-bg">
        <SidebarGroup>
          <SidebarGroupLabel className="text-terminal-text font-mono text-xs uppercase tracking-wider">Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    className={`font-mono text-sm transition-colors ${isActive(item.url) ? 'bg-primary/20 text-primary' : 'text-terminal-text hover:bg-muted/50 hover:text-primary'}`}
                  >
                    <NavLink to={item.url} className="flex items-center gap-2">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title.toLowerCase()}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-terminal-text font-mono text-xs uppercase tracking-wider">Quick Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="px-2 space-y-2">
              <Button size="sm" className="w-full justify-start bg-primary hover:bg-primary/90 font-mono text-xs">
                <Plus className="h-4 w-4 mr-2" />
                new task
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start border-terminal-border text-terminal-text hover:bg-muted/50 hover:text-primary font-mono text-xs">
                <Plus className="h-4 w-4 mr-2" />
                new flow
              </Button>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-terminal-border bg-terminal-bg">
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border border-terminal-border">
            <AvatarImage src="/placeholder-avatar.png" />
            <AvatarFallback className="bg-primary text-primary-foreground">
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium font-mono text-terminal-text truncate">user@pythoughts</p>
            <p className="text-xs text-muted-foreground font-mono truncate">online</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}