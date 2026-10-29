import { ImageResponse } from "next/og";

export const alt = "LaunchPad AI PRO — Проходите фильтры роботов ATS на 95%+";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#080c16",
          padding: "56px 64px",
          position: "relative",
        }}
      >
        {/* Glow ambient circle 1 */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            right: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(99,102,241,0) 70%)",
            display: "flex",
          }}
        />
        {/* Glow ambient circle 2 */}
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(56,189,248,0.2) 0%, rgba(56,189,248,0) 70%)",
            display: "flex",
          }}
        />

        {/* Top Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="data:image/png;base64,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"
              width={52}
              height={52}
              style={{
                borderRadius: "14px",
                width: "52px",
                height: "52px",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.5px" }}>
                  LaunchPad
                </span>
                <span style={{ fontSize: "28px", fontWeight: 800, color: "#818cf8", letterSpacing: "-0.5px" }}>
                  AI PRO
                </span>
              </div>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>
                Next-Gen Career Intelligence Platform
              </span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "999px",
              backgroundColor: "rgba(16, 185, 129, 0.12)",
              border: "1px solid rgba(16, 185, 129, 0.35)",
              color: "#34d399",
              fontSize: "14px",
              fontWeight: 700,
            }}
          >
            ⚡ 94%+ ATS MATCH RATE
          </div>
        </div>

        {/* Main Title & Subtitle */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "24px" }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              fontSize: "52px",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#f8fafc",
              letterSpacing: "-1px",
              maxWidth: "1050px",
            }}
          >
            <span>Проходите фильтры роботов ATS и получайте </span>
            <span style={{ color: "#38bdf8", marginLeft: "12px", marginRight: "12px" }}>
              в 3 раза больше
            </span>
            <span>офферов</span>
          </div>

          <div style={{ display: "flex", fontSize: "20px", color: "#94a3b8", lineHeight: 1.5, maxWidth: "980px" }}>
            Детерминированный аудит резюме по формуле 55/15/15/15, генератор писем без нейрозвёздочек и Канбан-трекер с центром напоминаний.
          </div>
        </div>

        {/* Badges / Metrics Row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: "24px",
            borderTop: "1px solid rgba(148, 163, 184, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                display: "flex",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#c7d2fe",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              55% Hard Skills
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#a7f3d0",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              15% XYZ Метрики
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: "rgba(56, 189, 248, 0.15)",
                border: "1px solid rgba(56, 189, 248, 0.3)",
                color: "#bae6fd",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              15% Soft Skills
            </div>
            <div
              style={{
                display: "flex",
                padding: "8px 14px",
                borderRadius: "10px",
                backgroundColor: "rgba(245, 158, 11, 0.15)",
                border: "1px solid rgba(245, 158, 11, 0.3)",
                color: "#fde68a",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              15% ATS Layout
            </div>
          </div>

          <div style={{ display: "flex", fontSize: "15px", color: "#64748b", fontWeight: 600 }}>
            launchpad-app-ashy.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
