import UserNav from "@/components/nav/UserNav";

/**
 * User Dashboard Layout
 * @param {*} param0
 * @returns
 * Renders the user dashboard layout, including the UserNav component and child components.
 * */

export default function UserDashboard({ children }) {
  return (
    <>
      <UserNav />
      {children}
    </>
  );
}
