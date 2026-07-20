import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "../lib/authContext";
import CandidateOnboardingModal from "../components/CandidateOnboardingModal";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "vietnamese"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "AI Recruitment - Việc Làm & Tuyển Dụng Thông Minh",
  description: "Nền tảng tuyển dụng thông minh sử dụng AI. Tìm kiếm việc làm lương cao, phân tích CV, gợi ý công việc phù hợp.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
          <CandidateOnboardingModal />
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
