import { useEffect, useMemo, useState } from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { deleteUser, getUsers } from "../api/reqres";

const normalizeNewUser = (u) => {
  if (!u) return null;
  return {
    id: Number(u.id) || Math.random(),
    first_name: u.first_name || "",
    last_name: u.last_name || "",
    email: u.email || "—",
    avatar: "",
    _local: true,
  };
};

export default function Users() {
  const [search, setSearch] = useSearchParams();
  const pageFromUrl = Number(search.get("page")) || 1;

  const [page, setPage] = useState(pageFromUrl);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [flash, setFlash] = useState("");

  const location = useLocation();
  const navigate = useNavigate();

  // handle navigation messages (newly created user)
  useEffect(() => {
    if (location.state?.newUser) {
      const n = normalizeNewUser(location.state.newUser);
      if (n) setUsers((prev) => [n, ...prev]);
      setFlash("User created successfully.");
      navigate(".", { replace: true, state: {} });
    }
  }, [location.state, navigate]);

  useEffect(() => {
    setLoading(true);
    getUsers(page)
      .then(({ data }) => {
        setUsers(data.data || []);
        setTotalPages(data.total_pages || 1);
      })
      .catch(() => {
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, [page]);

  // keep ?page in URL synced
  useEffect(() => {
    setSearch((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", String(page));
      return next;
    });
  }, [page, setSearch]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      setFlash("User deleted.");
    } catch {
      alert("Delete failed.");
    }
  };

  const canPrev = page > 1;
  const canNext = page < totalPages;

  const list = useMemo(() => users, [users]);

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
        <Link to="/users/new">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">
            + Add User
          </button>
        </Link>
      </div>

      {flash && (
        <div className="bg-green-50 border border-green-300 text-green-700 px-4 py-2 rounded-lg mb-4">
          {flash}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : list.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        <div className="grid gap-3">
          {list.map((u) => (
            <div
              key={u.id}
              className="grid grid-cols-[64px_1fr_auto] items-center gap-3 p-3 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              <img
                src={u.avatar}
                alt={`${u.first_name} ${u.last_name}`}
                width={64}
                height={64}
                className="rounded-md object-cover"
              />
              <div>
                <div className="font-semibold text-gray-800">
                  {u.first_name} {u.last_name}
                </div>
                <div className="text-sm text-gray-500">{u.email}</div>
              </div>
              <div className="flex gap-2">
                <Link to={`/users/${u.id}`}>
                  <button className="px-3 py-1 text-sm bg-gray-200 rounded-md hover:bg-gray-300 transition">
                    View
                  </button>
                </Link>
                <Link to={`/users/${u.id}/edit`} state={{ user: u }}>
                  <button className="px-3 py-1 text-sm bg-yellow-400 text-white rounded-md hover:bg-yellow-500 transition">
                    Edit
                  </button>
                </Link>
                <button
                  onClick={() => handleDelete(u.id)}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        <button
          disabled={!canPrev}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          className={`px-4 py-2 rounded-md transition ${
            canPrev
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          ← Prev
        </button>
        <span className="text-gray-700">
          Page {page} / {totalPages}
        </span>
        <button
          disabled={!canNext}
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          className={`px-4 py-2 rounded-md transition ${
            canNext
              ? "bg-gray-200 hover:bg-gray-300"
              : "bg-gray-100 text-gray-400 cursor-not-allowed"
          }`}
        >
          Next →
        </button>
      </div>
    </div>
  );
}
