"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from "chart.js";
import { Bar, Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface StatsClientProps {
  totalPosts: number;
  totalTags: number;
  monthlyStats: { [key: string]: number };
  yearlyStats: { [key: string]: number };
  tagStats: { tag: string; count: number }[];
  categoryStats: { [key: string]: number };
}

export default function StatsClient({
  totalPosts,
  totalTags,
  monthlyStats,
  yearlyStats,
  tagStats,
  categoryStats,
}: StatsClientProps) {
  // 月度趋势图
  const monthlyData = {
    labels: Object.keys(monthlyStats).sort(),
    datasets: [
      {
        label: "文章数量",
        data: Object.keys(monthlyStats)
          .sort()
          .map((key) => monthlyStats[key]),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  // 年度统计图
  const yearlyData = {
    labels: Object.keys(yearlyStats).sort(),
    datasets: [
      {
        label: "文章数量",
        data: Object.keys(yearlyStats)
          .sort()
          .map((key) => yearlyStats[key]),
        backgroundColor: "rgba(16, 185, 129, 0.5)",
        borderColor: "rgb(16, 185, 129)",
        borderWidth: 1,
      },
    ],
  };

  // 标签分布图
  const tagData = {
    labels: tagStats.slice(0, 10).map((t) => t.tag),
    datasets: [
      {
        label: "文章数量",
        data: tagStats.slice(0, 10).map((t) => t.count),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(20, 184, 166, 0.7)",
          "rgba(249, 115, 22, 0.7)",
          "rgba(99, 102, 241, 0.7)",
          "rgba(34, 197, 94, 0.7)",
          "rgba(234, 179, 8, 0.7)",
        ],
      },
    ],
  };

  // 分类分布图
  const categoryData = {
    labels: Object.keys(categoryStats),
    datasets: [
      {
        label: "文章数量",
        data: Object.values(categoryStats),
        backgroundColor: [
          "rgba(59, 130, 246, 0.7)",
          "rgba(16, 185, 129, 0.7)",
          "rgba(245, 158, 11, 0.7)",
          "rgba(139, 92, 246, 0.7)",
          "rgba(236, 72, 153, 0.7)",
          "rgba(20, 184, 166, 0.7)",
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          写作统计
        </h1>

        {/* 概览卡片 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">总文章数</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalPosts}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">标签数量</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalTags}</div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <div className="text-gray-500 dark:text-gray-400 text-sm mb-1">分类数量</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {Object.keys(categoryStats).length}
            </div>
          </div>
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 月度趋势 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              月度发文趋势
            </h2>
            <Line data={monthlyData} options={chartOptions} />
          </div>

          {/* 年度统计 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              年度发文统计
            </h2>
            <Bar data={yearlyData} options={chartOptions} />
          </div>

          {/* 标签分布 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              热门标签 TOP 10
            </h2>
            <Doughnut data={tagData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>

          {/* 分类分布 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              分类分布
            </h2>
            <Doughnut data={categoryData} options={{ responsive: true, maintainAspectRatio: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}
