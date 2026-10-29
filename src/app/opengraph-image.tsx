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
            <div
              style={{
                width: "52px",
                height: "52px",
                borderRadius: "14px",
                backgroundColor: "#4f46e5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "28px",
              }}
            >
              🎯
            </div>
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
