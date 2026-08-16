import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../components/ModalLogin";
import ModalRegister from "../components/ModalRegister";
import ModalForgotPassword from "../components/ModalForgotPassword";

export default function Login() {
  const [authMode, setAuthMode] = useState("login");
  const navigate = useNavigate();
  const goHome = () => navigate("/");

  if (authMode === "register") {
    return <ModalRegister isOpen={true} onSwitchToLogin={() => setAuthMode("login")} onSuccess={goHome} />;
  }

  if (authMode === "forgot") {
    return <ModalForgotPassword isOpen={true} onSwitchToLogin={() => setAuthMode("login")} />;
  }

  return (
    <ModalLogin
      isOpen={true}
      onSwitchToRegister={() => setAuthMode("register")}
      onSwitchToForgot={() => setAuthMode("forgot")}
      onSuccess={goHome}
    />
  );
}
