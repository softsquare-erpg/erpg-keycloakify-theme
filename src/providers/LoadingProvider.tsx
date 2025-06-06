import { createContext, useCallback, useContext, useState } from "react";
import { LoadingContextType } from "../types/LoadingContext.type";

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function LoadingProvider({ children }: { children: React.ReactNode }) {
    const [loadingStack, setLoadingStack] = useState<boolean[]>([]);
    const isLoading = loadingStack.length > 0;

    const show = useCallback(() => setLoadingStack(stack => [...stack, true]), []);
    const hide = useCallback(
        () => setLoadingStack(stack => (stack.length > 1 ? stack.slice(0, -1) : [])),
        []
    );
    const forceHide = useCallback(() => setLoadingStack([]), []);

    return (
        <LoadingContext.Provider value={{ isLoading, show, hide, forceHide }}>
            {children}
        </LoadingContext.Provider>
    );
}

export function useLoading() {
    const ctx = useContext(LoadingContext);
    if (!ctx) throw new Error("useLoading must be used within LoadingProvider");
    return ctx;
}
