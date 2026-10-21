import Link from "next/link"
import { PRODUCT_PATH } from "@/lib/routes"

export function Footer({ productPath = PRODUCT_PATH }: { productPath?: string }) {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">K</span>
            </div>
            <span className="font-semibold text-foreground">Korret Stores</span>
          </div>

          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Korret Stores. All rights reserved.
          </p>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href={productPath} prefetch={false} className="hover:text-foreground transition-colors">Product details</Link>
            <Link href={`${productPath}#delivery`} prefetch={false} className="hover:text-foreground transition-colors">Delivery</Link>
            <Link href={`${productPath}#faq`} prefetch={false} className="hover:text-foreground transition-colors">FAQs</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
