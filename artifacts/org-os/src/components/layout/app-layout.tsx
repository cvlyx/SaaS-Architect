import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/lib/auth-provider";
import {
  LayoutDashboard,
  Building2,
  Users,
  Package,
  CreditCard,
  Blocks,
  LogOut,
  Menu,
  Moon,
  Sun,
  Search,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/lib/theme-provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard },
  { name: "Organizations", href: "/app/organizations", icon: Building2 },
  { name: "Users", href: "/app/users", icon: Users },
  { name: "Industry Packs", href: "/app/industry-packs", icon: Package },
  { name: "Subscriptions", href: "/app/subscriptions", icon: CreditCard },
  { name: "Modules", href: "/app/modules", icon: Blocks },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const NavLinks = () => (
    <>
      {NAV_ITEMS.map((item) => {
        const isActive = location === item.href || (location.startsWith(item.href + "/") && item.href !== "/app");
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={() => setIsMobileNavOpen(false)}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all ${
              isActive
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            }`}
          >
            <item.icon className="h-4 w-4" />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
      {/* Desktop Sidebar */}
      <div className="hidden border-r bg-sidebar md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
              <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
                <LayoutDashboard className="h-4 w-4" />
              </div>
              <span className="">Organization OS</span>
            </Link>
          </div>
          <div className="flex-1 overflow-auto py-2">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4 gap-1">
              <NavLinks />
            </nav>
          </div>
          <div className="mt-auto p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || "User"} />
                <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col overflow-hidden">
                <span className="text-sm font-medium truncate">{user?.fullName || "Admin User"}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email || "admin@org-os.com"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col">
        {/* Header */}
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
                  <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
                    <LayoutDashboard className="h-4 w-4" />
                  </div>
                  <span className="">Organization OS</span>
                </Link>
              </div>
              <nav className="grid gap-2 text-lg font-medium p-4">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>

          <div className="w-full flex-1">
            <form>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search organizations, users..."
                  className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                />
              </div>
            </form>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || ""} alt={user?.fullName || "User"} />
                  <AvatarFallback>{user?.fullName?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Support</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Main Content */}
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20">
          {children}
        </main>
      </div>
    </div>
  );
}
