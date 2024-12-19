import ProfileArea from "@/component/auth/ProfileArea";

export default function ProfilePage() {
    return (
        <AuthLayout showNavbar={true} showFooter={true}>
          <ProfileArea/>
        </AuthLayout>
      );
}
