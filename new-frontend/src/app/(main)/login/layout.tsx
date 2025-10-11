export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`antialiased bg-background overflow-hidden min-h-screen h-full flex flex-col`}
      >
        <div className="flex-1 relative h-full overflow-hidden">{children}</div>
      </body>
    </html>
  );
}
