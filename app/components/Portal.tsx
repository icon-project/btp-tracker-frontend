'use client'
import React, { ReactElement, useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function Portal({ children }: { children: ReactElement }) {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, [mounted]);

    if (typeof window === "undefined") return <></>;

    return mounted ? createPortal(children, document.getElementById("modal-root") as HTMLElement) : <></>;
}
