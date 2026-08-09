import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

function AdminLogin() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  async function handleLogin(e) {

    e.preventDefault();

    setError("");
    setLoading(true);


    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });


    if (error) {

      setError("Invalid email or password.");

      setLoading(false);

      return;
    }


    const user = data.user;


    const { data: profile, error: profileError } =
      await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();


    if (
      profileError ||
      profile?.role !== "admin"
    ) {

      await supabase.auth.signOut();

      setError(
        "You don't have permission to access the admin area."
      );

      setLoading(false);

      return;
    }


    navigate("/admin");

    setLoading(false);
  }


  return (

    <main className="admin-login-page">

      <div className="admin-login-card">

        <div className="admin-logo">
          💍
        </div>


        <h1>
          Bridal Home
        </h1>


        <p className="admin-subtitle">
          Business Owner Login
        </p>


        <form onSubmit={handleLogin}>


          <label>
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            placeholder="Enter your email"
            required
          />


          <label>
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            placeholder="Enter your password"
            required
          />


          {error && (

            <p className="admin-error">
              {error}
            </p>

          )}


          <button
            type="submit"
            disabled={loading}
          >

            {loading
              ? "Signing in..."
              : "Sign In"}

          </button>


        </form>

      </div>

    </main>
  );
}

export default AdminLogin;