import AdminNav from "@/components/nav/AdminNav";

/**
 * Admin Dashboard Layout
 * @param {*} param0
 * @returns
 * Renders the admin dashboard layout, including the AdminNav component and child components.
 * */

export default function AdminDashboard({ children }) {
  return (
    <>
      <AdminNav />
      {children}
    </>
  );
}
