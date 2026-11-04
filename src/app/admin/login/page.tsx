import { AdminAccessForm } from "@/components/admin-access-form";

export default function AdminLoginPage() {
  return (
    <div className="editorial-page">
      <div className="editorial-page-inner">
        <AdminAccessForm mode="login" />
      </div>
    </div>
  );
}
