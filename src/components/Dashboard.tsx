function Dashboard() {
  const stats = [
    {
      id: 1,
      title: 'Total Users',
      count: '1,234',
      icon: '👥',
      bgColor: 'bg-blue-500',
      change: '+12%',
      changeType: 'increase',
    },
    {
      id: 2,
      title: 'Active Sessions',
      count: '856',
      icon: '🟢',
      bgColor: 'bg-green-500',
      change: '+8%',
      changeType: 'increase',
    },
    {
      id: 3,
      title: 'Total Revenue',
      count: '₹45,678',
      icon: '💰',
      bgColor: 'bg-purple-500',
      change: '+23%',
      changeType: 'increase',
    },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'Logged in', time: '5 minutes ago' },
    { id: 2, user: 'Jane Smith', action: 'Updated profile', time: '10 minutes ago' },
    { id: 3, user: 'Mike Johnson', action: 'Created new post', time: '15 minutes ago' },
    { id: 4, user: 'Sarah Williams', action: 'Deleted comment', time: '20 minutes ago' },
    { id: 5, user: 'Tom Brown', action: 'Changed password', time: '25 minutes ago' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`${stat.bgColor} w-14 h-14 rounded-lg flex items-center justify-center text-2xl shadow-md`}>
                {stat.icon}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                stat.changeType === 'increase' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
              }`}>
                {stat.change}
              </div>
            </div>
            <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold text-gray-800">{stat.count}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{activity.user}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">New Users (Today)</p>
                <p className="text-2xl font-bold text-blue-600">42</p>
              </div>
              <div className="text-3xl">📈</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl font-bold text-green-600">128</p>
              </div>
              <div className="text-3xl">⚡</div>
            </div>
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Total Posts</p>
                <p className="text-2xl font-bold text-purple-600">2,845</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;