import Register from "@/component/auth/Register";
import AuthLayout from "@/component/auth/AuthLayout";
export default function RegisterPage() {
  return (
    <AuthLayout showNavbar={true} showFooter={true}>
      <Register/>
    </AuthLayout>
  );
}
