import { Navigate } from "react-router-dom";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

const RoleProtectedRoute = ({
  allowedRoles,
  children,
}: Props) => {
  const role = localStorage.getItem("userRole");

  if (!role) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;