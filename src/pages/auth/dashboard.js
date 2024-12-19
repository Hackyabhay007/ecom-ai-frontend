import AuthLayout from "@/component/auth/AuthLayout";
import Dashboard from "@/component/auth/Dashboard";

export default function DashboardPage() {
  return (
    <AuthLayout showNavbar={true} showFooter={true}>
      <Dashboard />
    </AuthLayout>
  );
}
