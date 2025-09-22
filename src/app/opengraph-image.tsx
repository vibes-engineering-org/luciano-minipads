import { ImageResponse } from "next/og";
import {
  PROJECT_TITLE,
  PROJECT_DESCRIPTION,
  PROJECT_AVATAR_URL,
} from "~/lib/constants";

export const alt = PROJECT_TITLE;
export const contentType = "image/png";
export const size = {
  width: 1200,
  height: 630,
};

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0a0a0a",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Clean gradient background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)",
          }}
        />

        {/* Grid pattern overlay for tech aesthetic */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.3,
          }}
        />

        {/* Main content - centered in 630x630 safe zone */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "80px",
            position: "relative",
            zIndex: 10,
          }}
        >
          {/* Creator avatar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "40px",
            }}
          >
            <div
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "4px solid rgba(255, 255, 255, 0.9)",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)",
              }}
            >
              <img
                src={PROJECT_AVATAR_URL}
                alt="Creator avatar"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
          </div>

          {/* Main headline - 42px+ for mobile readability */}
          <h1
            style={{
              fontSize: "80px",
              fontWeight: "900",
              color: "#ffffff",
              textAlign: "center",
              marginBottom: "32px",
              lineHeight: 0.9,
              letterSpacing: "-4px",
              textShadow: "0 8px 24px rgba(0, 0, 0, 0.5)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_TITLE}
          </h1>

          {/* Description - 24px+ for mobile readability */}
          <p
            style={{
              fontSize: "32px",
              fontWeight: "600",
              color: "rgba(255, 255, 255, 0.95)",
              textAlign: "center",
              marginBottom: "48px",
              lineHeight: 1.2,
              textShadow: "0 4px 16px rgba(0, 0, 0, 0.4)",
              maxWidth: "600px",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            {PROJECT_DESCRIPTION}
          </p>

          {/* Simple platform badge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "16px 32px",
              backgroundColor: "rgba(255, 255, 255, 0.15)",
              borderRadius: "50px",
              border: "2px solid rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(10px)",
            }}
          >
            <span
              style={{
                fontSize: "24px",
                fontWeight: "700",
                color: "#ffffff",
                fontFamily: "system-ui, -apple-system, sans-serif",
              }}
            >
              Farcaster Mini App
            </span>
          </div>
        </div>

        {/* Subtle bottom shadow for depth */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "120px",
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.3) 0%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
    },
  );
}
