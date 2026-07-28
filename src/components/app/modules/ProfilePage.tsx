"use client";

import { PageHeader, PageBody } from "@/components/app/PageChrome";
import type { Role } from "@/lib/auth/roles";

interface RoleProfilePageProps {
  role: Role;
}

export function RoleProfilePage({ role }: RoleProfilePageProps) {
  return (
    <>
      <PageHeader 
        title="Profile" 
        subtitle="Manage your profile information and settings"
      />
      <PageBody>
        <div className="rounded-lg border border-border bg-card p-6">
          <p className="text-muted-foreground">
            Profile page for {role} role is under construction.
          </p>
        </div>
      </PageBody>
    </>
  );
}
