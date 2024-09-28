"use client";

import { ReactNode } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { GoogleAnalytics, GoogleTagManager } from "@next/third-parties/google";
import { OpenPanelComponent } from "@openpanel/nextjs";
import { Analytics } from "@vercel/analytics/react";

const AllProviders = ({ children }: { children: ReactNode }) => {
  if (typeof window !== "undefined") {
    posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || "", {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    });
  }

  return (
    <PostHogProvider client={posthog}>
      {children}
      <Analytics />
      <GoogleAnalytics gaId="G-V5MSV08LD2" />
      {/* <GoogleTagManager gtmId="GTM-KCCRCDBX" /> */}
      <OpenPanelComponent
        clientId={process.env.NEXT_OPEN_PANEL_CLIENT_ID || ""}
        trackScreenViews={true}
        trackAttributes={true}
        trackOutgoingLinks={true}
      />
    </PostHogProvider>
  );
};

export default AllProviders;
