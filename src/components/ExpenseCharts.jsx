import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const ExpenseCharts = ({ expense = [] }) => {
  if (!expense || expense.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No expense data available to display charts.
      </div>
    );
  }

  // Your existing data processing functions
  const processData = () => {
    const uniqueDates = new Set(expense.map(e => new Date(e.date).toLocaleDateString())).size;
    const groupByMonth = uniqueDates > 30;
    const grouped = expense.reduce((acc, ex) => {
      let key;
      if (groupByMonth) {
        const d = new Date(ex.date);
        key = `${d.getFullYear()}-${d.getMonth() + 1}`;
      } else {
        key = new Date(ex.date).toLocaleDateString();
      }
      if (!acc[key]) acc[key] = { income: 0, expense: 0, date: key };
      acc[key][ex.type] += Number(ex.amount);
      return acc;
    }, {});
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const processPieData = () => {
    const totalIncome = expense
      .filter(e => e.type === 'income')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    const totalExpense = expense
      .filter(e => e.type === 'expense')
      .reduce((sum, e) => sum + Number(e.amount), 0);
    return [
      { name: 'Income', value: totalIncome },
      { name: 'Expense', value: totalExpense },
    ];
  };

  const chartData = processData();
  const pieData = processPieData();

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 max-w-6xl mx-auto">
      {/* Bar Chart - Income vs Expenses */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Income vs Expenses</h3>
          <p className="text-sm text-gray-500">Monthly financial overview</p>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickMargin={10}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                tickFormatter={(value) => `$${value.toLocaleString()}`}
              />
              <Tooltip 
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`]}
              />
              <Legend 
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ paddingTop: '20px' }}
              />
              <Bar 
                dataKey="income" 
                fill="#10b981" 
                radius={[4, 4, 0, 0]}
                name="Income"
              />
              <Bar 
                dataKey="expense" 
                fill="#ef4444" 
                radius={[4, 4, 0, 0]}
                name="Expense"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart - Distribution */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex-1">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Income/Expense Ratio</h3>
          <p className="text-sm text-gray-500">Overall financial distribution</p>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                dataKey="value"
                label={false}
              >
                <Cell key="income" fill="#10b981" />
                <Cell key="expense" fill="#ef4444" />
              </Pie>
              <Tooltip 
                contentStyle={{
                  background: '#ffffff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`]}
              />
              <Legend 
                iconType="circle"
                iconSize={10}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ExpenseCharts;