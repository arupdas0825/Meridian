import './globals.css';

export const metadata = {
  title: 'Meridian — Plan Smart. Save More. Explore Europe.',
  description: 'Meridian unifies task management, personal finance, and European travel planning into one platform.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
