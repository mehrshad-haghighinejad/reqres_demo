import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <nav className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
      <Link
        to="/users"
        className="text-lg font-bold text-gray-800 hover:text-blue-600 transition"
      >
        ReqRes Admin
      </Link>
      <div className="flex gap-3">
        <button
          onClick={handleLogout}
          className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white shadow hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
