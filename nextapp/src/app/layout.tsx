import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

// Initialize Inter font
const inter = Inter({ subsets: ['latin'] })

// Metadata for the application
export const metadata: Metadata = {
  title: 'Object Detection App',
  description: 'Image object detection using TensorFlow and Flickr',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <main className="min-h-screen bg-gray-50">
          <div className="container mx-auto px-4 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}