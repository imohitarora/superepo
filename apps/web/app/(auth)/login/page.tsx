import { Suspense } from "react"
import { AuthForm } from "@/components/auth-form"

export default function LoginPage() {
  return (
    <Suspense>
      <AuthForm path="login" />
    </Suspense>
  )
}
