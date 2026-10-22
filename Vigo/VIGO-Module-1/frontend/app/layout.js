import "./globals.css";

export const metadata = {
  title: "Customer Module",
  description: "Customer Module",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="flex flex-col min-h-screen bg-[#fafafa]">
        
        {/* Main Application Content */}
        <main className="flex-grow">
          {children}
        </main>

        {/* Global Footer - Staging URL (Task 3) */}
        <footer className="w-full bg-white border-t border-gray-200 py-3 text-center shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
          <p className="text-xs text-gray-500 font-medium tracking-wide uppercase">
            VIGOFEAST Customer Portal <span className="mx-2">|</span> 
            <a 
              href="https://customer.vigofeast.swais.in" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[#0f766e] hover:text-[#0d5f58] hover:underline font-bold normal-case tracking-normal ml-1"
            >
              customer.vigofeast.swais.in
            </a>
          </p>
        </footer>

      </body>
    </html>
  );
}