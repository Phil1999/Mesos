"use client"

import { useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { useMedia, useMountedState } from "react-use"

import { Menu } from "lucide-react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"

import { Button } from "@/components/ui/button"
import { NavButton } from "@/components/nav-button"
import { 
    Sheet,
    SheetContent,
    SheetTrigger,
    SheetTitle,
    SheetHeader,
    SheetDescription
} from "@/components/ui/sheet"


const routes = [
    {
        href: "/",
        label: "Dashboard",
    },
    {
        href: "/transactions",
        label: "Transactions",
    },
    {
        href: "/accounts",
        label: "Accounts",
    },
    {
        href: "/categories",
        label: "Categories",
    },
    {
        href: "/settings",
        label: "Settings",
    },
]

export const Navigation = () => {
    const isMounted = useMountedState()
    const [isOpen, setIsOpen] = useState(false);

    const router = useRouter()
    const pathname = usePathname()
    // Important to set defaultState see: https://github.com/streamich/react-use/blob/master/docs/useMedia.md
    const isMobile = useMedia("(max-width: 1024px)", false)

    const onClick = (href: string) => {
        router.push(href)
        setIsOpen(false)
    }

    // Ensure we are mounted before rendering this component to prevent hydration issues
    if (!isMounted) return null

    if (isMobile) {
        return (
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger>
                    <Button
                        // SheetTrigger renders a button by default, so to prevent
                        // Hydration issues we must use asChild here.
                        asChild
                        variant="outline"
                        size="sm"
                        className="font-normal bg-white/10 hover:bg-white/20 
                        hover:text-white border-none focus-visible:ring-offset-0
                        focus-visible:ring-transparent outline-none text-white
                        focus:bg-white/30 transition"
                    >
                    
                        <Menu className="h-10 w-10" />
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="px-2">
                    <SheetHeader>
                        <VisuallyHidden.Root>
                            <SheetTitle>Menu</SheetTitle>
                        </VisuallyHidden.Root>
                        <VisuallyHidden.Root>
                            <SheetDescription>Navigation Menu</SheetDescription>
                        </VisuallyHidden.Root>
                        
                    </SheetHeader>
                    <nav className="flex flex-col gap-y-2 pt-6">
                        {routes.map((route) =>(
                            <Button
                                key={route.href}
                                variant={route.href === pathname ? "secondary" : "ghost"}
                                onClick={() => onClick(route.href)}
                                className="w-full justify-start"
                            >
                                {route.label}
                            </Button>

                        ))}
                    </nav>

                </SheetContent>
            </Sheet>
        )
    }

    return (
        <nav className="hidden lg:flex items-center gap-x-2 overflow-x-auto">
            {routes.map((route) => (
                <NavButton
                    key={route.href}
                    href={route.href}
                    label={route.label}
                    isActive={pathname === route.href}
                />
            ))}
        </nav>
    )
}