import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "TailMyResume Pro | Global Job Discovery & AI Resume Platform",
  description:
    "Intelligent recruitment, global job discovery, and ATS resume tailoring platform for Data Analysts, Data Scientists, AI/ML Engineers, and Software Engineers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <head>
        {/* Anti-flash script for instantaneous theme rendering */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('tmr_theme');
                const sysDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (saved === 'dark' || ((!saved || saved === 'system') && sysDark)) {
                  document.documentElement.classList.add('dark');
                  document.documentElement.style.colorScheme = 'dark';
                } else {
                  document.documentElement.classList.remove('dark');
                  document.documentElement.style.colorScheme = 'light';
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
