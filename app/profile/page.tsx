"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/sidebar";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  plan: string;
  receipt_limit: number;
  receipt_used: number;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
const [fullName, setFullName] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    setProfile(data);
    setFullName(data?.full_name || "");
    setLoading(false);
  }
  async function saveProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
    })
    .eq("id", user.id);

  if (error) {
    alert(error.message);
    return;
  }

  setProfile((prev) =>
    prev
      ? {
          ...prev,
          full_name: fullName,
        }
      : prev
  );

  setEditing(false);

  alert("Profile updated successfully!");
}
async function uploadAvatar(file: File) {
  if (!profile) return;

  setUploading(true);

  const fileExt = file.name.split(".").pop();
  const fileName = `${profile.id}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    alert(uploadError.message);
    setUploading(false);
    return;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("avatars")
    .getPublicUrl(fileName);

  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: publicUrl,
    })
    .eq("id", profile.id);

  if (error) {
    alert(error.message);
    setUploading(false);
    return;
  }

  setProfile((prev) =>
    prev
      ? {
          ...prev,
          avatar_url: publicUrl,
        }
      : prev
  );

  setUploading(false);

  alert("Profile picture updated!");
}
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex bg-slate-100 min-h-screen">

      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      <main className="flex-1 p-8">

        <div className="max-w-4xl mx-auto">

          <div className="bg-white rounded-3xl shadow-xl p-10">

            <div className="flex flex-col items-center">

              <div className="flex flex-col items-center">

  {profile?.avatar_url ? (
    <img
      src={profile.avatar_url}
      alt="Avatar"
      className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
    />
  ) : (
    <div className="w-32 h-32 rounded-full bg-blue-600 text-white flex items-center justify-center text-5xl font-bold">
      {profile?.full_name
        ? profile.full_name.charAt(0).toUpperCase()
        : "U"}
    </div>
  )}

  <label className="mt-4 cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
    {uploading ? "Uploading..." : "Upload Photo"}

    <input
      type="file"
      accept="image/*"
      hidden
      onChange={(e) => {
        if (e.target.files?.[0]) {
          uploadAvatar(e.target.files[0]);
        }
      }}
    />
  </label>

</div>

              {editing ? (
  <input
    value={fullName}
    onChange={(e) => setFullName(e.target.value)}
    className="mt-6 w-full max-w-md rounded-xl border border-gray-300 p-3 text-center text-2xl font-bold"
  />
) : (
  <h1 className="text-4xl font-bold mt-6">
    {profile?.full_name || "Unnamed User"}
  </h1>
)}

              <p className="text-gray-500 mt-2">
                {profile?.email}
              </p>

              <div className="mt-5">

                {profile?.plan === "premium" ? (
                  <span className="bg-green-100 text-green-700 px-5 py-2 rounded-full font-semibold">
                    ⭐ Premium User
                  </span>
                ) : (
                  <span className="bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-semibold">
                    Free Plan
                  </span>
                )}

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-12">

              <div className="bg-slate-100 rounded-2xl p-6">

                <h2 className="text-gray-500">
                  Receipt Limit
                </h2>

                <p className="text-3xl font-bold mt-3">
                  {profile?.plan === "premium"
                    ? "Unlimited"
                    : profile?.receipt_limit}
                </p>

              </div>

              <div className="bg-slate-100 rounded-2xl p-6">

                <h2 className="text-gray-500">
                  Receipts Used
                </h2>

                <p className="text-3xl font-bold mt-3">
                  {profile?.receipt_used}
                </p>

              </div>

              <div className="bg-slate-100 rounded-2xl p-6">

                <h2 className="text-gray-500">
                  Member Since
                </h2>

                <p className="text-xl font-semibold mt-3">
                  {new Date(
                    profile?.created_at || ""
                  ).toLocaleDateString()}
                </p>

              </div>

              <div className="bg-slate-100 rounded-2xl p-6">

                <h2 className="text-gray-500">
                  Account Status
                </h2>

                <p className="text-xl font-semibold mt-3 text-green-600">
                  Active
                </p>

              </div>

            </div>

            <div className="mt-10 flex justify-center">

              {editing ? (
  <button
    onClick={saveProfile}
    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl"
  >
    Save Changes
  </button>
) : (
  <button
    onClick={() => setEditing(true)}
    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl"
  >
    Edit Profile
  </button>
)}

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}