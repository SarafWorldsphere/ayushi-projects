import "./globals.css";

export const metadata = {
  title: "DEM Dashboard",
  description: "Student dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
