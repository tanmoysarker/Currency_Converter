"use client";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function HistoryModal({
  open,
  onClose,
  code,
  labels,
  data,
  from,
}: {
  open: boolean;
  onClose: () => void;
  code: string | null;
  labels: string[];
  data: number[];
  from: string;
}) {
  if (!open || !code) return null;

  const title = `Last 14 days: ${from} → ${code}`;
  const datasetLabel = `${code} per ${from}`;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "linear-gradient(145deg, #1c1c1c, #2a2a2a)",
          color: "#eaeaea",
          padding: "24px 28px",
          borderRadius: "12px",
          maxWidth: "720px",
          width: "90%",
          boxShadow: "0 0 20px rgba(0, 0, 0, 0.6)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h3>
          <button
            onClick={onClose}
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "none",
              color: "#fff",
              width: 36,
              height: 36,
              borderRadius: "50%",
              fontSize: 18,
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.25)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.1)")}
          >
            ✕
          </button>
        </div>

        <Line
          data={{
            labels,
            datasets: [
              {
                label: datasetLabel,
                data,
                borderColor: "#60a5fa",
                backgroundColor: "rgba(96,165,250,0.25)",
                pointRadius: 3,
                tension: 0.25,
              },
            ],
          }}
          options={{
            responsive: true,
            plugins: {
              legend: { display: false },
              tooltip: {
                callbacks: {
                  label: (ctx) => `${datasetLabel}: ${ctx.parsed.y?.toFixed(4) ?? "-"}`,
                },
              },
            },
            scales: {
              x: {
                ticks: { color: "#ccc" },
                grid: { color: "rgba(255,255,255,0.1)" },
              },
              y: {
                ticks: { color: "#ccc" },
                grid: { color: "rgba(255,255,255,0.1)" },
              },
            },
          }}
        />
      </div>
    </div>
  );
}
