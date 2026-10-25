import type React from "react"
import type { Metadata } from "next"
import localFont from "next/font/local"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { FreeDeliveryBanner } from "@/components/landing/free-delivery-banner"
import { MetaEventQueue } from "@/components/analytics/meta-event-queue"
import "./globals.css"

// One variable Latin file covers the 400–700 weights used by the storefront.
// Uncovered symbols (including ₵) use the system fallback instead of fetching
// the 85 KB Latin Extended subset just for one currency character.
const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "400 700",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
  preload: true,
  adjustFontFallback: "Arial",
  fallback: ["Arial", "sans-serif"],
})

export const metadata: Metadata = {
  title: "Korret Stores | Support for Everyday Independence",
  description:
    "Practical support for home rehabilitation and everyday independence, with free delivery across Ghana.",
    //generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <Script id="microsoft-clarity" strategy="lazyOnload">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "xsp6hw6kjb");
          `}
        </Script>
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            (function(){
            var started=false;
            function startPixel(){
            if(started)return;started=true;
            document.removeEventListener('visibilitychange',onVisibilityChange);
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;t.onload=function(){window.dispatchEvent(new Event('meta-pixel-ready'))};
            s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '4632254820337295');
            fbq('track', 'PageView');
            }
            function onVisibilityChange(){if(document.visibilityState==='hidden')startPixel()}
            function afterRendering(){
              if(document.visibilityState==='hidden'){startPixel();return}
              requestAnimationFrame(function(){requestAnimationFrame(startPixel)});
            }
            document.addEventListener('visibilitychange',onVisibilityChange);
            var hero=document.querySelector('[data-hero-image]');
            if(document.visibilityState!=='hidden'&&hero&&typeof hero.decode==='function'){
              hero.decode().catch(function(){}).then(afterRendering);
            }else{afterRendering()}
            })();
          `}
        </Script>
      </head>
      <body className={`${inter.variable} flex min-h-screen flex-col font-sans antialiased`}>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-background focus:p-4 focus:text-primary focus:shadow-lg">Skip to content</a>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=4632254820337295&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <FreeDeliveryBanner />
        <MetaEventQueue />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
