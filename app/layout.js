export const metadata = {
  title: 'Horror Story Video',
  description: 'An interactive horror story experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
