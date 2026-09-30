import { Inter } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
// NEW: Import the loader component
import GlobalTranslationLoader from "../components/GlobalTranslationLoader"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Headmaster Dashboard",
  description: "SWAIS Headmaster Management Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          {/* NEW: Place the loader inside the provider */}
          <GlobalTranslationLoader />
          
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}
