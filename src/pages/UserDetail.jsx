import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { deleteUser, getUser } from "../api/reqres";

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState(location.state?.flash || "");

  useEffect(() => {
    setLoading(true);
    getUser(id)
      .then(({ data }) => setUser(data.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      navigate("/users", { replace: true, state: { flash: "User deleted." } });
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <p className="text-gray-600">Loading...</p>;
  if (!user) return <p className="text-red-500">User not found.</p>;

  return (
    <div className="space-y-4">
      {flash && (
        <div className="bg-green-50 border border-green-300 text-green-800 px-4 py-2 rounded-md">
          {flash}
        </div>
      )}

      <div className="grid grid-cols-[128px_1fr] gap-6 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
        <img
          src={user.avatar}
          alt={`${user.first_name} ${user.last_name}`}
          className="w-32 h-32 rounded-xl object-cover"
        />
        <div>
          <h2 className="text-xl font-semibold">
            {user.first_name} {user.last_name}
          </h2>
          <div className="text-gray-600">{user.email}</div>

          <div className="flex gap-3 mt-4">
            <Link to={`/users/${user.id}/edit`} state={{ user }}>
              <button className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700">
                Edit
              </button>
            </Link>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </button>
            <Link to="/users">
              <button className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 hover:bg-gray-300">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
