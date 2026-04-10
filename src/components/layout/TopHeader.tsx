import { Bell, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';

export function TopHeader() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/80 backdrop-blur-sm px-4">
      <SidebarTrigger className="text-muted-foreground hover:text-foreground lg:hidden">
        <Menu className="h-5 w-5" />
      </SidebarTrigger>

      <div className="flex-1" />

      <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
        <Bell className="h-4 w-4" />
        <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary" />
      </Button>

      <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-border">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
          {user?.nome?.charAt(0).toUpperCase()}
        </div>
        <div className="text-sm">
          <p className="font-medium text-foreground leading-none">{user?.nome}</p>
          <p className="text-[11px] text-muted-foreground capitalize">{user?.role}</p>
        </div>
      </div>
    </header>
  );
}
