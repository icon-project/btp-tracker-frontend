'use client'

import Err from "@/app/components/err";

export default function Error({error, reset,}: {
    error: Error & { digest?: string },
    reset: () => void
}) {
    return Err();
}