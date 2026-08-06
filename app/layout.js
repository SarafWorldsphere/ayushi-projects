import "./globals.css";
import { LanguageProvider } from "../src/context/LanguageContext";

export const metadata = {
  title: "DEM Dashboard",
  description: "Student dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
