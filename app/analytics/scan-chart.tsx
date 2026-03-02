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

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

export default function ScanChart({ scans }: { scans: any[] }) {
  // 1. Group by Date AND Slug

  const countsByDate = scans.reduce((acc: any, scan) => {
    const date = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {})

  const totalData = {
    label: 'Total Scans',
    data: countsByDate,
    borderColor: 'rgba(132, 0, 255, 1)',
    backgroundColor: 'rgba(132, 0, 255, 0.1)',
    fill: false, // Too many filled areas get messy
    tension: 0.4,
  }
  
  const groupedData = scans.reduce((acc: any, scan) => {
    const date = new Date(scan.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const slug = scan.Codes?.slug || 'Unknown'; // Assumes your Supabase join includes the slug

    if (!acc[date]) acc[date] = {};
    acc[date][slug] = (acc[date][slug] || 0) + 1;
    return acc;
  }, {});

  const dates = Object.keys(groupedData);
  const slugs = Array.from(new Set(scans.map(s => s.Codes?.slug || 'Unknown')));

  // 2. Map slugs to unique datasets
  const datasets = slugs.map((slug, index) => {
    // Generate a unique color based on index or a preset list
    const colors = ['rgb(37, 99, 235)', 'rgb(220, 38, 38)', 'rgb(5, 150, 105)', 'rgb(217, 119, 6)'];
    const color = colors[index % colors.length];

    return {
      label: slug,
      data: dates.map(date => groupedData[date][slug] || 0), // Fill zeros for dates where slug wasn't scanned
      borderColor: color,
      backgroundColor: color.replace('rgb', 'rgba').replace(')', ', 0.1)'),
      fill: false, // Too many filled areas get messy
      tension: 0.4,
    };
  });

  datasets.push(totalData);

  const data = {
    labels: dates,
    datasets: datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { 
        display: true, 
        position: 'top' as const,
        labels: { usePointStyle: true, boxWidth: 6 } 
      },
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1 }, // Better for low-volume scan counts
        grid: { color: '#f3f4f6' } 
      },
      x: { grid: { display: false } }
    }
  }

  return <Line data={data} options={options} />
}