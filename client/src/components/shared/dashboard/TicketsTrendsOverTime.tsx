import { ViewType } from "@/types/dashboard";
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type TicketTrendChartProps = {
  data: { date: string; ticketCount: number }[];
  range: ViewType;
};

export function TicketTrendChart({ data, range }: TicketTrendChartProps) {
  const labels = data?.map(d => d.date);
  const counts = data?.map(d => d.ticketCount);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${range?.charAt(0)?.toUpperCase() + range?.slice(1)} Tickets`,
        data: counts,
        borderColor: "#667eea",
        backgroundColor: "rgba(102,126,234,0.1)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#667eea",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Tickets" }, beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
}