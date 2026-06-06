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
  GraduationCap,
  BookOpen,
  UserCheck,
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

const ALL_NAV_ITEMS = [
  { name: "Dashboard", href: "/app", icon: LayoutDashboard, adminOnly: false },
  { name: "Organizations", href: "/app/organizations", icon: Building2, adminOnly: true },
  { name: "Users", href: "/app/users", icon: Users, adminOnly: true },
  { name: "Industry Packs", href: "/app/industry-packs", icon: Package, adminOnly: true },
  { name: "Subscriptions", href: "/app/subscriptions", icon: CreditCard, adminOnly: true },
  { name: "Modules", href: "/app/modules", icon: Blocks, adminOnly: true },
];

const EDUCATION_NAV_ITEMS = [
  { name: "Students", href: "/app/education/students", icon: GraduationCap },
  { name: "Teachers", href: "/app/education/teachers", icon: UserCheck },
  { name: "Classes", href: "/app/education/classes", icon: BookOpen },
];

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const isSuperAdmin = user?.role === "super_admin";

  const handleLogout = () => {
    logout();
    setLocation("/login");
  };

  const NavLinks = () => (
    <>
      {ALL_NAV_ITEMS.filter(item => !item.adminOnly || isSuperAdmin).map((item) => {
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
      {!isSuperAdmin && user?.industryPackId === 3 && (
        <>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-4 mb-1 px-3">
            Education
          </div>
          {EDUCATION_NAV_ITEMS.map((item) => {
            const isActive = location === item.href || location.startsWith(item.href + "/");
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
      )}
    </>
  );

  return (
    <div className="min-h-screen w-full">
      {/* Desktop Sidebar - fixed */}
      <aside className="fixed left-0 top-0 z-30 hidden h-screen w-[240px] flex-col border-r bg-sidebar lg:w-[260px] md:flex">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold text-primary">
            <div className="flex h-7 w-7 items-center justify-center rounded bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
            <span>Organization OS</span>
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-2 px-2 lg:px-4">
          <div className="grid items-start gap-1 text-sm font-medium">
            <NavLinks />
          </div>
        </nav>
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
      </aside>

      {/* Main content area */}
      <div className="flex flex-col md:ml-[240px] lg:ml-[260px]">
        {/* Header */}
        <header className="sticky top-0 z-20 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
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
                  <span>Organization OS</span>
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
