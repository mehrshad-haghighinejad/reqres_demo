import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { createUser, getUser, updateUser } from "../api/reqres";

export default function UserForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const location = useLocation();
  const passedUser = location.state?.user;

  const [loading, setLoading] = useState(isEdit && !passedUser);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  // Prefill when editing
  useEffect(() => {
    if (!isEdit) return;
    if (passedUser) {
      setFirstName(passedUser.first_name || "");
      setLastName(passedUser.last_name || "");
      setEmail(passedUser.email || "");
      return;
    }
    setLoading(true);
    getUser(id)
      .then(({ data }) => {
        const u = data.data;
        setFirstName(u.first_name);
        setLastName(u.last_name);
        setEmail(u.email);
      })
      .finally(() => setLoading(false));
  }, [id, isEdit, passedUser]);

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = { first_name: firstName, last_name: lastName, email };
    try {
      if (isEdit) {
        const { data } = await updateUser(id, payload);
        navigate(`/users/${id}`, {
          replace: true,
          state: { flash: `Updated at ${data.updatedAt || "now"}` },
        });
      } else {
        const { data } = await createUser(payload);
        navigate("/users", {
          replace: true,
          state: { newUser: data },
        });
      }
    } catch (e) {
      alert("Save failed");
    }
  };

  if (loading) return <p className="text-gray-500">Loading...</p>;

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm w-full">
      <h2 className="text-xl font-semibold mb-4">
        {isEdit ? "Edit User" : "Add User"}
      </h2>
      <form onSubmit={onSubmit} className="grid gap-4">
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">
            First Name
          </span>
          <input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">
            Last Name
          </span>
          <input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-sm font-medium text-gray-700 mb-1">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </label>
        <div className="flex gap-3 mt-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isEdit ? "Save Changes" : "Create User"}
          </button>
          <Link to={isEdit ? `/users/${id}` : "/users"}>
            <button
              type="button"
              className="border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            >
              Cancel
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
