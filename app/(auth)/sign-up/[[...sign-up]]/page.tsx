import Image  from 'next/image'
import { Loader2 } from 'lucide-react'
import { SignUp, ClerkLoaded, ClerkLoading } from '@clerk/nextjs'

export default function Page() {
    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
            <div className="h-full lg:flex flex-col items-center justify-center px-4">
                <div className="text-center space-y-4 pt-16">
                    <h1 className="font-bold text-3xl text-[#2E2A47]">
                        Welcome Back!
                    </h1>
                    <p className="text-base text-[#738CA0]">
                        Log in or Create account to get back to your personal dashboard.
                    </p>
                </div>
                <ClerkLoaded>
                    <div className="flex items-center justify-center mt-8">
                        <SignUp path="/sign-up" />
                    </div>
                </ClerkLoaded>
                <ClerkLoading>
                    <Loader2 className="animate-spin text-muted-foreground">
                        
                    </Loader2>
                </ClerkLoading>
            </div>
            <div className="h-full bg-halloween-midnight hidden lg:flex items-center justify-center">
                <Image src="/logo.png" height={100} width={100} alt="Logo" />

            </div>
        </div>
        
           
    )
}