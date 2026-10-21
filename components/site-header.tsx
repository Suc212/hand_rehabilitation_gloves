import Link from "next/link"
import { Hand, ArrowUpRight } from "lucide-react"
import { PRODUCT_PATH } from "@/lib/routes"

export function SiteHeader() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-4 px-4 py-5 sm:px-6 lg:px-8">
        <Link href="/" prefetch={false} aria-label="Korret Stores home" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Hand aria-hidden="true" className="h-6 w-6" />
          </span>
          <span className="text-lg font-bold tracking-tight">Korret Stores<span className="text-primary">.</span></span>
        </Link>
        <nav aria-label="Main navigation" className="flex items-center gap-5 text-sm font-medium sm:gap-8">
          <Link href="/" prefetch={false} className="transition-colors hover:text-primary">Home</Link>
          <Link href={PRODUCT_PATH} prefetch={false} className="transition-colors hover:text-primary">Our product</Link>
          <Link href={`${PRODUCT_PATH}#order`} prefetch={false} className="inline-flex items-center gap-1.5 text-primary hover:underline">
            Shop now <ArrowUpRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </nav>
      </div>
    </header>
  )
}
