import { AdminAccessForm } from "@/components/admin-access-form";

export default function AdminSetupPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <AdminAccessForm mode="setup" />
      </div>
    </div>
  );
}
