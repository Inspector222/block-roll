import { BlockRollProvider } from '@blockroll/react-sdk';

export const metadata = {
  title: 'BlockRoll React SDK Demo',
  description: 'Demo application for BlockRoll React SDK',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BlockRollProvider
          apiKey={process.env.NEXT_PUBLIC_BLOCKROLL_API_KEY || 'demo_api_key'}
          baseURL={process.env.NEXT_PUBLIC_BLOCKROLL_API_URL}
          realtime={true}
        >
          {children}
        </BlockRollProvider>
      </body>
    </html>
  );
}

