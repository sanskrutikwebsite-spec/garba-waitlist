import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Sanskrutik Sheri Garba - Navratri 2026";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  // Load the logo from public/ at build time
  const logoData = await readFile(
    join(process.cwd(), "public", "logo-sg.png")
  ).then((buf) => buf.toString("base64"));
  const logoSrc = `data:image/png;base64,${logoData}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1a0a00 0%, #3d1400 50%, #1a0a00 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "rgba(255, 120, 0, 0.15)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -100,
            right: -100,
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "rgba(255, 60, 0, 0.1)",
            display: "flex",
          }}
        />
        {/* Top gold line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: 6,
            background: "linear-gradient(90deg, #c8860a, #f5c842, #c8860a)",
            display: "flex",
          }}
        />
        {/* Bottom gold line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: 6,
            background: "linear-gradient(90deg, #c8860a, #f5c842, #c8860a)",
            display: "flex",
          }}
        />

        {/* Logo */}
        <img
          src={logoSrc}
          alt=""
          width={160}
          height={160}
          style={{ objectFit: "contain", marginBottom: 24 }}
        />

        {/* Event name */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "#f5c842",
            letterSpacing: "0.04em",
            textAlign: "center",
            lineHeight: 1.1,
            display: "flex",
          }}
        >
          Sanskrutik Sheri Garba
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 30,
            color: "#ffb97a",
            marginTop: 16,
            letterSpacing: "0.08em",
            textAlign: "center",
            display: "flex",
          }}
        >
          Navratri 2026 · Book Your Pass Now
        </div>

        {/* Website URL */}
        <div
          style={{
            position: "absolute",
            bottom: 28,
            fontSize: 22,
            color: "rgba(255,185,100,0.7)",
            letterSpacing: "0.06em",
            display: "flex",
          }}
        >
          www.sanskrutikgarba.in
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
