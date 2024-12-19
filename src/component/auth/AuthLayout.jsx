import BreadcrumbAuth from "@/component/auth/BreadcrumbAuth";
import Navbar from "../header/Navbar";
import Footer from "../footer/Footer";
const AuthLayout = ({ children, showNavbar = false, showFooter = false }) => {
  return (
    <div className="auth-layout">
      {showNavbar && <Navbar />}
      <BreadcrumbAuth />
      {children}
      {showFooter && <Footer />}
    </div>
  );
};

export default AuthLayout;
