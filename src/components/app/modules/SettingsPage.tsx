"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Lock,
  Globe,
  Moon,
  Eye,
  Users,
  LogOut,
  AlertCircle,
  Check,
  ChevronRight,
} from "lucide-react";
import { PageHeader, PageBody } from "@/components/app/PageChrome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/common/ui";

interface RoleSettingsPageProps {
  role: string;
}

export function RoleSettingsPage({ role }: RoleSettingsPageProps) {
  const router = useRouter();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    language: "en",
    darkMode: false,
    twoFactorAuth: false,
    dataSharing: false,
  });

  const [saved, setSaved] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
    setSaved(false);
  };

  const handleLanguageChange = (value: string) => {
    setSettings((prev) => ({ ...prev, language: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // Mock save - in real app would call API
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your account preferences and security settings."
      />

      <PageBody>
        {saved && (
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-4 py-3 dark:border-green-900 dark:bg-green-950">
            <Check className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Settings saved successfully
            </span>
          </div>
        )}

        <div className="grid gap-6">
          {/* Notifications Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive updates via email
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("emailNotifications")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.emailNotifications ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.emailNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">SMS Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Receive urgent alerts via SMS
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("smsNotifications")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.smsNotifications ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.smsNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Real-time in-app notifications
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("pushNotifications")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.pushNotifications ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.pushNotifications ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Preferences Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Language</label>
                <select
                  value={settings.language}
                  onChange={(e) => handleLanguageChange(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="en">English</option>
                  <option value="rw">Kinyarwanda</option>
                  <option value="fr">Français</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    Dark Mode
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Enable dark theme
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("darkMode")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.darkMode ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.darkMode ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg border border-border p-3">
                <div>
                  <p className="font-medium">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("twoFactorAuth")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.twoFactorAuth ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.twoFactorAuth ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              <button className="w-full flex items-center justify-between rounded-lg border border-border p-3 hover:bg-surface transition-colors">
                <div className="text-left">
                  <p className="font-medium">Change Password</p>
                  <p className="text-sm text-muted-foreground">
                    Update your password regularly
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>

              <button className="w-full flex items-center justify-between rounded-lg border border-border p-3 hover:bg-surface transition-colors">
                <div className="text-left">
                  <p className="font-medium">Login History</p>
                  <p className="text-sm text-muted-foreground">
                    View recent account activity
                  </p>
                </div>
                <ChevronRight className="h-5 w-5" />
              </button>
            </CardContent>
          </Card>

          {/* Privacy Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Privacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Data Sharing</p>
                  <p className="text-sm text-muted-foreground">
                    Allow anonymous analytics and improvement
                  </p>
                </div>
                <button
                  onClick={() => handleToggle("dataSharing")}
                  className={`relative h-6 w-11 rounded-full transition-colors ${
                    settings.dataSharing ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`absolute h-5 w-5 rounded-full bg-white transition-transform ${
                      settings.dataSharing ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-red-200 dark:border-red-900">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <AlertCircle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 hover:bg-red-100 transition-colors dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900"
              >
                <div className="text-left">
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Logout
                  </p>
                  <p className="text-sm text-red-500 dark:text-red-300">
                    End your current session
                  </p>
                </div>
                <LogOut className="h-5 w-5 text-red-600 dark:text-red-400" />
              </button>

              <button className="w-full flex items-center justify-between rounded-lg border border-red-200 bg-red-50 p-3 hover:bg-red-100 transition-colors dark:border-red-900 dark:bg-red-950 dark:hover:bg-red-900">
                <div className="text-left">
                  <p className="font-medium text-red-600 dark:text-red-400">
                    Delete Account
                  </p>
                  <p className="text-sm text-red-500 dark:text-red-300">
                    Permanently delete your account and data
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-red-600 dark:text-red-400" />
              </button>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-primary-foreground hover:bg-primary-hover"
            >
              Save Changes
            </button>
            <button
              onClick={() => window.history.back()}
              className="flex-1 rounded-lg border border-border bg-background px-4 py-2 font-medium hover:bg-surface"
            >
              Cancel
            </button>
          </div>
        </div>
      </PageBody>
    </>
  );
}
