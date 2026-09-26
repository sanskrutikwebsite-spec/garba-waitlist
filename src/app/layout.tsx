import type { Metadata } from "next";
import localFont from "next/font/local";
import Script from "next/script";
import Footer from "@/components/Footer";
import "./globals.css";

const berlinSans = localFont({
  src: [
    {
      path: './fonts/BRLNSR.ttf',
      weight: '400',
      style: 'normal',
    }
  ],
  variable: "--font-berlin-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.sanskrutikgarba.in"),
  title: "Navratri Garba - Sanskrutik Sheri Garba",
  description: "Secure your passes for the most awaited Navratri Garba event. Experience the rhythm, the colors, and the unmatched energy!",
  openGraph: {
    type: "website",
    url: "https://www.sanskrutikgarba.in",
    title: "Navratri Garba - Sanskrutik Sheri Garba",
    description: "Secure your passes for the most awaited Navratri Garba event. Experience the rhythm, the colors, and the unmatched energy!",
    siteName: "Sanskrutik Sheri Garba",
  },
  facebook: {
    appId: "1563231012272827",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className={`min-h-full flex flex-col ${berlinSans.className}`}>
        <div className="flex-1">
          {children}
        </div>
        <Footer />

        {/* Meta Pixel - inline init */}
        <Script
          id="meta-pixel-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1563231012272827');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1563231012272827&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
