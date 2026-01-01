interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joinDate: string;
}

interface ViewUserModalProps {
  user: User;
  onClose: () => void;
  onEdit: () => void;
}

function ViewUserModal({ user, onClose, onEdit }: ViewUserModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">User Details</h2>
            <p className="text-sm text-gray-600 mt-1">Complete user information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-6 mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
              <p className="text-gray-600 mt-1">{user.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                  user.role === 'Editor' ? 'bg-blue-100 text-blue-700' :
                  'bg-gray-100 text-gray-700'
                }`}>
                  {user.role}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {user.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">User ID</p>
              <p className="text-lg font-semibold text-gray-800">#{user.id}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Join Date</p>
              <p className="text-lg font-semibold text-gray-800">{user.joinDate}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Phone Number</p>
              <p className="text-lg font-semibold text-gray-800">+1 (555) 123-4567</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Department</p>
              <p className="text-lg font-semibold text-gray-800">Engineering</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <p className="text-sm text-gray-600 mb-1">Address</p>
              <p className="text-lg font-semibold text-gray-800">123 Main Street, City, State 12345</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3">Recent Activity</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Last Login</span>
                <span className="font-medium text-gray-800">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Total Sessions</span>
                <span className="font-medium text-gray-800">142</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Account Created</span>
                <span className="font-medium text-gray-800">{user.joinDate}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewUserModal;