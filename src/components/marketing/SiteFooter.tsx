import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-rscn grid gap-8 py-12 md:grid-cols-5">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-bold">R</div>
            <span className="font-semibold">RSCN</span>
          </div>
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            Rwanda Supply Chain Network — connecting every product, every business, every movement across the nation.
          </p>
          <form className="mt-4 flex max-w-sm gap-2">
            <input type="email" placeholder="Newsletter email" className="h-10 flex-1 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring" />
            <button type="button" className="h-10 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Subscribe</button>
          </form>
        </div>
        <FooterCol title="Platform" links={[["Solutions","/solutions"],["Industries","/industries"],["Pricing","/pricing"],["Partners","/partners"]]} />
        <FooterCol title="Company" links={[["About","/about"],["Resources","/resources"],["Contact","/contact"],["Book Demo","/book-demo"]]} />
        <FooterCol title="Account" links={[["Login","/auth/login"],["Register","/auth/register"],["Forgot Password","/auth/forgot-password"],["Dashboard","/auth/login"]]} />
      </div>
      <div className="border-t border-border">
        <div className="container-rscn flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground md:flex-row">
          <span>&copy {new Date().getFullYear()} Rwanda Supply Chain Network. All rights reserved.</span>
          <span>Kigali, Rwanda</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold">{title}</h4>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {links.map(([label, href]) => (
          <li key={`${label}-${href}`}><Link href={href} className="hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}
