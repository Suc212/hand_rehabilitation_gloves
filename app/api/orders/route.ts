import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { z } from "zod"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"

export const runtime = "nodejs"
export const maxDuration = 10

const resendApiKey = process.env.RESEND_API_KEY
if (!resendApiKey) {
  console.error("RESEND_API_KEY is not set in environment variables.")
}

const resend = new Resend(resendApiKey)

const orderSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  phone: z.string().min(1, "Phone number is required"),
  whatsapp: z.string().min(1, "WhatsApp number is required"),
  email: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  totalPrice: z.string().min(1, "Total price is required"),
  discount: z.string().optional(),
})

const withTimeout = async <T,>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> => {
  let timeout: ReturnType<typeof setTimeout> | undefined

  try {
    return await Promise.race([
      promise,
      new Promise<never>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(`${label} timed out after ${timeoutMs}ms`)), timeoutMs)
      }),
    ])
  } finally {
    if (timeout) {
      clearTimeout(timeout)
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderData = orderSchema.parse(body)
    const adminEmail = process.env.ADMIN_EMAIL || "allthegoodthings14@gmail.com"

    let orderId = `local-${Date.now()}`
    let emailSent = false
    let firestoreSaved = false
    const quantity = Number.parseInt(orderData.quantity)
    const totalPrice = Number.parseInt(orderData.totalPrice)
    const unitLabel = quantity === 1 ? "unit" : "units"

    const emailHtml = `
      <h2>New Order Notification</h2>
      <ul>
        <li><strong>Name:</strong> ${orderData.firstName} ${orderData.lastName}</li>
        <li><strong>Phone:</strong> ${orderData.phone}</li>
        <li><strong>WhatsApp:</strong> ${orderData.whatsapp}</li>
        <li><strong>Email:</strong> ${orderData.email || "Not provided"}</li>
        <li><strong>Address:</strong> ${orderData.address}</li>
        <li><strong>Order:</strong> ${quantity} ${unitLabel} for GH₵${totalPrice.toLocaleString()}</li>
        <li><strong>Order Time:</strong> ${new Date().toLocaleString()}</li>
      </ul>
    `

    try {
      const { error } = await withTimeout(
        resend.emails.send({
          from: "onboarding@resend.dev",
          to: [adminEmail],
          subject: "New SweepBot Pro Order Received",
          html: emailHtml,
        }),
        5000,
        "Order email",
      )

      if (error) {
        throw error
      }

      emailSent = true
    } catch (emailError) {
      console.error("Admin email sending error:", emailError)
    }

    try {
      const orderRef = await withTimeout(
        addDoc(collection(db, "orders"), {
          ...orderData,
          quantity: Number.parseInt(orderData.quantity),
          totalPrice: Number.parseInt(orderData.totalPrice),
          discount: Number.parseInt(orderData.discount || "0"),
          emailSent,
          status: "pending",
          createdAt: serverTimestamp(),
        }),
        3000,
        "Firestore order save",
      )

      orderId = orderRef.id
      firestoreSaved = true
    } catch (firestoreError) {
      console.error("Firestore order save error:", firestoreError)
    }

    if (!emailSent && !firestoreSaved) {
      return NextResponse.json(
        { error: "Order could not be submitted. Please contact us on WhatsApp." },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, orderId, emailSent, firestoreSaved })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input", details: error.errors }, { status: 400 })
    }

    console.error("Order API error:", error)
    const message = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "Internal server error", details: message }, { status: 500 })
  }
}
