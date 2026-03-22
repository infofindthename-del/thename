export const metadata = {
  title: 'the[name] — Network · Production Agency',
  description: 'Network selezionato di creativi e production agency indipendente. Milano.',
};
export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
