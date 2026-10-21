import { redirect } from "next/navigation"
import { PRODUCT_PATH } from "@/lib/routes"

export default function Home() {
  redirect(PRODUCT_PATH)
}
