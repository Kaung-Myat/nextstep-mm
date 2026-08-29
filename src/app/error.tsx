"use client";

import { useEffect } from "react";

import { Container } from "@/components/layout/container";
import { usePreferences } from "@/components/preferences/preferences-provider";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { copy } = usePreferences();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="py-16">
      <Card className="mx-auto max-w-2xl text-center">
        <CardHeader>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[color:var(--color-danger)] sm:text-xs">
            {copy.common.errorEyebrow}
          </p>
          <CardTitle>{copy.common.errorTitle}</CardTitle>
          <CardDescription>{copy.common.errorDescription}</CardDescription>
        </CardHeader>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>{copy.common.tryAgain}</Button>
          <Button href="/" variant="secondary">
            {copy.common.returnHome}
          </Button>
        </div>
      </Card>
    </Container>
  );
}
