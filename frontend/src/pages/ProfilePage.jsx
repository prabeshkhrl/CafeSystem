import useAuthStore from "../store/useAuthStore";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";

export default function ProfilePage() {
  const user = useAuthStore((s) => s.user);

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">My Profile</h1>
        <p className="text-gray-500">Manage your account information.</p>
      </div>

      <ProfileHeader user={user} />

      <div className="grid lg:grid-cols-2 gap-6">
        <ProfileInfoForm user={user} />
        <ChangePasswordForm />
      </div>
    </div>
  );
}