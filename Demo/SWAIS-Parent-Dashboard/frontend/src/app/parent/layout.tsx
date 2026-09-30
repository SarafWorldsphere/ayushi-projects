import Sidebar from "@/components/Sidebar";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans">
      <Sidebar />
      <div className="flex-1 md:ml-64 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  );
}
