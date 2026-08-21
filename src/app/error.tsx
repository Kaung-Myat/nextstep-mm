"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader><p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-red-700 sm:text-xs">Something went wrong</p><CardTitle>This page could not be loaded.</CardTitle><CardDescription>The database or server may be temporarily unavailable. You can retry without losing your current browser session.</CardDescription></CardHeader>
        <div className="mt-6 flex flex-wrap justify-center gap-3"><Button onClick={reset}>Try again</Button><Button href="/" variant="secondary">Return home</Button></div>
      </Card>
    </Container>
  );
}
