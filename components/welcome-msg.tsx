"use client";

import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

export const WelcomeMsg = () => {
    const { user, isLoaded } = useUser();

    if (!isLoaded || !user?.firstName) {
        return (
            <div className="flex justify-center items-center space-y-2 mb-4">
                <Loader2 className="animate-spin h-8 w-8 text-halloween-bone" />
            </div>
        );
    }

    return (
        <div className="space-y-2 mb-4">
            <h2 className="text-2xl lg:text-4xl text-halloween-bone font-medium">
            Welcome Back, {user.firstName} 👋
            </h2>
            <p className="text-sm lg:text-base text-halloween-yellow">
                This is your Financial Overview Report
            </p>
        </div>
    )
}