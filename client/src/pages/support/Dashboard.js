import React, { useState } from 'react';
import { useQuery } from 'react-query';
import {
  TicketIcon,
  ClockIcon,
  CheckCircleIcon,
  FaceSmileIcon,
  UsersIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import {
  LineChart,
  Line,
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
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import api from '../../services/api';

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function SupportDashboard() {
  const [dateRange, setDateRange] = useState('week');
  const [teamFilter, setTeamFilter] = useState('all');

  // Fetch support data
  const { data: supportData, isLoading } = useQuery('support-dashboard', async () => {
    const [
      ticketsRes,
      responseTimeRes,
      resolutionTimeRes,
      satisfactionRes,
      issuesRes,
      teamRes
    ] = await Promise.all([
      api.get('/support/tickets', { params: { period: dateRange, team: teamFilter } }),
      api.get('/support/response-time', { params: { period: dateRange } }),
      api.get('/support/resolution-time', { params: { period: dateRange } }),
      api.get('/support/customer-satisfaction', { params: { period: dateRange } }),
      api.get('/support/common-issues', { params: { period: dateRange } }),
      api.get('/support/team-performance', { params: { period: dateRange } })
    ]);
    
    return {
      tickets: ticketsRes.data,
      responseTime: responseTimeRes.data,
      resolutionTime: resolutionTimeRes.data,
      satisfaction: satisfactionRes.data,
      issues: issuesRes.data,
      team: teamRes.data
    };
  });

  // Custom label renderer for pie chart
  const renderCustomizedLabel = ({ name, percent }) => {
    return name + ' (' + (percent * 100).toFixed(0) + '%)';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Calculate key metrics
  const totalTickets = supportData?.tickets?.total || 0;
  const openTickets = supportData?.tickets?.open || 0;
  const resolvedTickets = supportData?.tickets?.resolved || 0;
  const avgResponseTime = supportData?.responseTime?.average || 0;
  const avgResolutionTime = supportData?.resolutionTime?.average || 0;
  const csat = supportData?.satisfaction?.score || 0;
  const teamEfficiency = supportData?.team?.efficiency || 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Customer Support Dashboard</h1>
            <p className="mt-2 text-sm text-gray-600">
              Real-time support metrics and team performance
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
            </select>
            <select
              value={teamFilter}
              onChange={(e) => setTeamFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="all">All Teams</option>
              <option value="tier1">Tier 1 Support</option>
              <option value="tier2">Tier 2 Support</option>
              <option value="tier3">Tier 3 Support</option>
            </select>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-100 rounded-lg p-3">
                  <TicketIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Tickets</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {totalTickets.toLocaleString()}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-indigo-50 px-5 py-2">
              <div className="text-sm text-indigo-600">
                {openTickets} open · {resolvedTickets} resolved
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-100 rounded-lg p-3">
                  <ClockIcon className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Response Time</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {avgResponseTime}h
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-green-50 px-5 py-2">
              <div className="text-sm text-green-600">
                Target: &lt; 2h
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-yellow-100 rounded-lg p-3">
                  <CheckCircleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Avg Resolution Time</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {avgResolutionTime}h
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 px-5 py-2">
              <div className="text-sm text-yellow-600">
                Target: &lt; 24h
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-100 rounded-lg p-3">
                  <FaceSmileIcon className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">CSAT Score</dt>
                    <dd className="text-2xl font-semibold text-gray-900">
                      {csat}%
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 px-5 py-2">
              <div className="text-sm text-purple-600">
                Target: &gt; 95%
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Ticket Volume Trend */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Ticket Volume Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={supportData?.tickets?.trend || []}>
                  <defs>
                    <linearGradient id="ticketGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="tickets" stroke="#4f46e5" fill="url(#ticketGradient)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Response vs Resolution Time */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Response vs Resolution Time</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={supportData?.tickets?.performance || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="responseTime" stroke="#f59e0b" strokeWidth={2} />
                  <Line type="monotone" dataKey="resolutionTime" stroke="#10b981" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Customer Satisfaction & Common Issues */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* CSAT Trend */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Satisfaction Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={supportData?.satisfaction?.trend || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="csat" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Common Issues */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Common Issues</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={supportData?.issues?.common || []}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                    nameKey="issue"
                  >
                    {supportData?.issues?.common?.map((entry, index) => {
                      // Use string concatenation for the key
                      const cellKey = 'cell-' + index;
                      return (
                        <Cell key={cellKey} fill={COLORS[index % COLORS.length]} />
                      );
                    })}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Team Performance */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Team Performance</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Team Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Assigned
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Resolved
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Response Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Resolution Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CSAT
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {supportData?.team?.members?.map((member) => (
                  <tr key={member.name} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {member.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.assigned}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.resolved}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.avgResponseTime}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.avgResolutionTime}h
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {member.csat}%
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full mr-2">
                          <div
                            className="h-2 bg-indigo-600 rounded-full"
                            style={{ width: member.performance + '%' }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{member.performance}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {[
            { name: 'Response Time SLA', value: 92, target: 95, color: 'green' },
            { name: 'Resolution Time SLA', value: 88, target: 90, color: 'yellow' },
            { name: 'Customer Satisfaction', value: 94, target: 95, color: 'purple' }
          ].map((sla) => (
            <div key={sla.name} className="bg-white shadow rounded-lg p-6">
              <h4 className="text-sm font-medium text-gray-500 mb-2">{sla.name}</h4>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900">{sla.value}%</span>
                <span className="text-sm text-gray-500">Target: {sla.target}%</span>
              </div>
              <div className="relative pt-1">
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: sla.value + '%' }}
                    className={(sla.value >= sla.target ? 'bg-green-600' : 'bg-yellow-500') + ' shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center'}
                  />
                </div>
              </div>
              <div className="mt-4 text-sm">
                <span className={sla.value >= sla.target ? 'text-green-600' : 'text-yellow-600'}>
                  {sla.value >= sla.target ? '✓ Meeting target' : '⚠ Below target'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
