import "./globals.css";

export const metadata = {
  title: "Customer Module",
  description: "Customer Module",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}