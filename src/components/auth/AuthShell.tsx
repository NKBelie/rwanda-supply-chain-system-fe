"use client";
import Link from "next/link";
import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { HeroImageOverlay } from "./HeroImageOverlay";

export function AuthShell({
  title, description, children, footer, back = "/",
}: { title: string; description?: string; children: ReactNode; footer?: ReactNode; back?: string }) {
  return (
    <div className="grid min-h-dvh grid-cols-1 lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between relative p-10 text-primary-foreground">
        <Image
          src="/images/auth-bg.jpg"
          alt="Rwanda Supply Chain Network"
          fill
          className="object-cover"
          priority
        />
        <HeroImageOverlay />
        <div className="relative z-10 flex flex-col justify-between h-full">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-md bg-primary-foreground text-primary font-bold">R</div>
            <span className="text-lg font-semibold">RSCN</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight">Rwanda&apos;s national supply chain network.</h2>
            <p className="mt-3 max-w-md text-primary-foreground/80">
              One secure platform connecting farmers, cooperatives, manufacturers, warehouses, transporters,
              retailers, banks and government.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {[["12K+","Businesses"],["48","Districts"],["99.9%","Uptime"]].map(([n,l]) => (
                <div key={l} className="rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 p-4">
                  <div className="text-2xl font-bold">{n}</div>
                  <div className="text-xs text-primary-foreground/80">{l}</div>
                </div>
              ))}
            </div>
            <p className="mt-6 text-xs text-primary-foreground/70">&copy; {new Date().getFullYear()} Rwanda Supply Chain Network</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col p-6 md:p-10">
        <div className="flex items-center justify-between">
          <Link href={back} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="lg:hidden flex items-center gap-2">
            <div className="grid h-7 w-7 place-items-center rounded-md bg-primary text-primary-foreground text-xs font-bold">R</div>
            <span className="text-sm font-semibold">RSCN</span>
          </div>
        </div>
        <div className="mx-auto mt-10 w-full max-w-md flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
          <div className="mt-8">{children}</div>
        </div>
        {footer && <div className="mx-auto w-full max-w-md pt-6 text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
    </label>
  );
}

export const inputCls = "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring";
export const primaryBtn = "inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary-hover disabled:opacity-60";
export const secondaryBtn = "inline-flex h-11 w-full items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-semibold hover:bg-surface";