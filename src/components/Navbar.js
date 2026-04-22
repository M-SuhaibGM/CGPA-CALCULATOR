"use client";

import Link from "next/link"
import { useSession, signOut } from "next-auth/react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Calculator, Search, UserPlus, LogOut, PlusCircle } from "lucide-react";

export function Navbar() {
  const { data: session, status } = useSession();

  // STAGE 1: If session is loading or user is not authenticated, return null
  // This hides the navbar entirely on the login/register pages.
  if (status === "loading" || status === "unauthenticated") {
    return null;
  }

  return (
    <nav className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="font-bold text-xl text-blue-600">CGPA Calc</Link>
          
          <div className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link href="/" className="flex items-center gap-1 hover:text-blue-600">
              <PlusCircle className="h-4 w-4" /> Student Entry
            </Link>
            <Link href="/calculator" className="flex items-center gap-1 hover:text-blue-600">
              <Calculator className="h-4 w-4" /> Calculator
            </Link>
            <Link href="/search" className="flex items-center gap-1 hover:text-blue-600">
              <Search className="h-4 w-4" /> Search
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold leading-none">{session?.user?.name}</p>
            <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar>
                  <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
                  <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/auth/login" })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}