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
