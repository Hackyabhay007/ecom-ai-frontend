import AuthLayout from "@/component/auth/AuthLayout";
import Login from "@/component/auth/Login";

export default function LoginPage() {
  return (
    <AuthLayout showNavbar={true} showFooter={true}>
      <Login />
    </AuthLayout>
  );
}
