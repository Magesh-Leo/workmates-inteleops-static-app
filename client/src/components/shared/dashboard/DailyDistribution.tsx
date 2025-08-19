import { ViewType } from "@/types/dashboard";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

type TicketDistributionChartProps = {
  data: { date: string; ticketCount: number }[];
  range: ViewType;
};

export function TicketDistributionChart({ data, range }: TicketDistributionChartProps) {
  const labels = data?.map(d => d.date);
  const counts = data?.map(d => d.ticketCount);

  const chartData = {
    labels,
    datasets: [
      {
        label: `${range?.charAt(0)?.toUpperCase() + range?.slice(1)} Distribution`,
        data: counts,
        backgroundColor: "rgba(102,126,234,0.6)",
        borderColor: "#667eea",
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { title: { display: true, text: "Date" } },
      y: { title: { display: true, text: "Tickets" }, beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
}