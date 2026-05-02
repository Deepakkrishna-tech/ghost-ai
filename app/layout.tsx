import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/ui/themes";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghost AI",
  description: "Real-time collaborative system design workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider
          appearance={{
            theme: dark,
            variables: {
              colorBackground: "var(--bg-surface)",
              colorForeground: "var(--text-primary)",
              colorMuted: "var(--bg-subtle)",
              colorMutedForeground: "var(--text-muted)",
              colorInput: "var(--bg-elevated)",
              colorInputForeground: "var(--text-primary)",
              colorPrimary: "var(--accent-primary)",
              colorPrimaryForeground: "var(--bg-base)",
              colorDanger: "var(--state-error)",
              colorSuccess: "var(--state-success)",
              colorWarning: "var(--state-warning)",
              colorBorder: "var(--border-default)",
              colorRing: "var(--accent-primary)",
              fontFamily: "var(--font-geist-sans)",
              fontFamilyButtons: "var(--font-geist-sans)",
            },
          }}
          afterSignOutUrl="/sign-in"
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL ?? "/sign-in"}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL ?? "/sign-up"}
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
