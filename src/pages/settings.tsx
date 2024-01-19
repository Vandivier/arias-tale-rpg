import { useState } from "react";
import { useSession } from "next-auth/react";
import { CustomPage } from "~/components/CustomPage";

export default function SettingsPage() {
  const { data: sessionData } = useSession();
  const [backupEmail, setBackupEmail] = useState("");
  const [notificationPreference, setNotificationPreference] = useState("");
  const [loading, setLoading] = useState(false);
  const isDiscordConnected = false;
  const isGoogleConnected = false;

  //   // Fetch user settings
  //   const settings = api.get.userSettings.useQuery({
  //     userId: sessionData?.user?.id,
  //   });

  // Handle settings update
  const updateSettings = async () => {
    setLoading(true);
    try {
      //   await api.post.updateUserSettings.mutateAsync({
      //     userId: sessionData?.user?.id,
      //     backupEmail: backupEmail,
      //   });
      alert("Settings updated successfully!");
    } catch (error) {
      console.error("Error updating settings:", error);
      alert("Failed to update settings.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomPage mainHeading="User Settings">
      <div className="text-white">
        <h2 className="mb-4 text-2xl">Edit Your Settings</h2>

        <div className="mb-4">
          <label
            htmlFor="backupEmail"
            className="mb-2 block text-sm font-medium text-white"
          >
            Primary Email
          </label>
          <input
            type="email"
            id="backupEmail"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter primary email"
            value={backupEmail}
            onChange={(e) => setBackupEmail(e.target.value)}
            // defaultValue={settings.data?.primary}
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="backupEmail"
            className="mb-2 block text-sm font-medium text-white"
          >
            Backup Email
          </label>
          <input
            type="email"
            id="backupEmail"
            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter backup email"
            value={backupEmail}
            onChange={(e) => setBackupEmail(e.target.value)}
          />
        </div>

        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          // onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {isDiscordConnected ? "Discord is Linked" : "Connect to Discord"}
        </button>

        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          // onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {isGoogleConnected ? "Google is Linked" : "Connect to Google"}
        </button>

        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-white">
            I'm interested in joining a live gaming stream.
          </span>
        </div>
        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-white">
            I'm interested in contributing to the open source project.
          </span>
        </div>
        <div className="mb-4">
          <span className="mb-2 block text-sm font-medium text-white">
            I'm interested in reviewing or editing book narrative content.
          </span>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-white">
            Email Notification Preferences
          </label>
          <div className="flex flex-col gap-2">
            {[
              "No notifications",
              "Max 1 per day",
              "Max 1 per week",
              "Max 5 per day",
            ].map((option) => (
              <label key={option}>
                <input
                  type="radio"
                  name="notificationPreference"
                  value={option}
                  checked={notificationPreference === option}
                  onChange={(e) => setNotificationPreference(e.target.value)}
                  className="mr-2"
                />
                {option}
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={updateSettings}
          disabled={loading}
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20 disabled:bg-gray-400"
        >
          Update Settings
        </button>
      </div>
    </CustomPage>
  );
}
