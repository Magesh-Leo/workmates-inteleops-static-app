import { Redirect } from "wouter";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

export default function ProtectedRoute({ component: Component }: ProtectedRouteProps) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Redirect to="/" />;
  }

  return <Component />;
}
