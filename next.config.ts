import path from "node:path";
import type { NextConfig } from "next";

function hostFromUrl(value: string | undefined) {
  const trimmed = value?.trim();

  if (!trimmed) {
    return null;
  }

  try {
    return new URL(trimmed).host;
  } catch {
    return trimmed.replace(/^https?:\/\//, "").replace(/\/.*$/, "") || null;
  }
}

const serverActionAllowedOrigins = Array.from(
  new Set(
    [
      "*.app.github.dev",
      "*.githubpreview.dev",
      hostFromUrl(process.env.AUTH_URL),
      hostFromUrl(process.env.NEXT_PUBLIC_APP_URL),
      ...(process.env.SERVER_ACTION_ALLOWED_ORIGINS ?? "")
        .split(",")
        .map((origin) => hostFromUrl(origin)),
    ].filter((origin): origin is string => Boolean(origin)),
  ),
);

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdfkit"],
  experimental: {
    serverActions: {
      allowedOrigins: serverActionAllowedOrigins,
    },
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
