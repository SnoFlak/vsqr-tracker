'use client'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

export default function ScanChart({ scans }: { scans: any[] }) {
  // Simple logic to group scans by date
  const countsByDate = scans.reduce((acc: any, scan) => {
    const date = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const data = {
    labels: Object.keys(countsByDate),
    datasets: [
      {
        fill: true,
        label: 'Total Scans',
        data: Object.values(countsByDate),
        borderColor: 'rgb(37, 99, 235)', // Your blue-600
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4, // Makes the line curvy
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' } },
      x: { grid: { display: false } }
    }
  }

  return <Line data={data} options={options} />
}