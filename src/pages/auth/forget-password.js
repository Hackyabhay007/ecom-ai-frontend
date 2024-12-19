import ForgetPassword from "@/component/auth/ForgetPassword";
import AuthLayout from "@/component/auth/AuthLayout";
export default function ForgotPasswordPage() {
  return (
    <AuthLayout showNavbar={true} showFooter={true}>
      <ForgetPassword/>
    </AuthLayout>
  );}
