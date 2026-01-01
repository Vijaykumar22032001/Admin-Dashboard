import { useState } from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import UserManager from './components/UserManager';
import OrderManager from './components/OrderManager';
import AddUserModal from './components/AddUserModal';
import EditUserModal from './components/EditUserModal';
import ViewUserModal from './components/ViewUserModal';
import AddOrderModal from './components/AddOrderModal';
import EditOrderModal from './components/EditOrderModal';
import ViewOrderModal from './components/ViewOrderModal';
import type { User, Order } from './types';

function App() {
  const { isAuthenticated, isLoading, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [showViewUserModal, setShowViewUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userRefreshKey, setUserRefreshKey] = useState(0);

  const [showAddOrderModal, setShowAddOrderModal] = useState(false);
  const [showEditOrderModal, setShowEditOrderModal] = useState(false);
  const [showViewOrderModal, setShowViewOrderModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderRefreshKey, setOrderRefreshKey] = useState(0);

  const handleLogout = async () => {
    await logout();
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleAddUser = () => {
    setShowAddUserModal(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditUserModal(true);
  };

  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewUserModal(true);
  };

  const handleEditUserFromView = () => {
    setShowViewUserModal(false);
    setShowEditUserModal(true);
  };

  const handleAddOrder = () => {
    setShowAddOrderModal(true);
  };

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowEditOrderModal(true);
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowViewOrderModal(true);
  };

  const handleEditOrderFromView = () => {
    setShowViewOrderModal(false);
    setShowEditOrderModal(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="flex-1 overflow-y-auto">
        {currentPage === 'dashboard' && <Dashboard />}
        {currentPage === 'users' && (
          <UserManager
            key={userRefreshKey}
            onAddUser={handleAddUser}
            onEditUser={handleEditUser}
          />
        )}
        {currentPage === 'orders' && (
          <OrderManager
            key={orderRefreshKey}
            onAddOrder={handleAddOrder}
            onEditOrder={handleEditOrder}
          />
        )}
        {currentPage === 'settings' && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Settings</h1>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <p className="text-gray-600">Settings page coming soon...</p>
            </div>
          </div>
        )}
      </main>

      {showAddUserModal && (
        <AddUserModal
          onClose={() => setShowAddUserModal(false)}
          onSuccess={() => setUserRefreshKey(prev => prev + 1)}
        />
      )}
      {showEditUserModal && selectedUser && (
        <EditUserModal
          user={selectedUser}
          onClose={() => setShowEditUserModal(false)}
          onSuccess={() => setUserRefreshKey(prev => prev + 1)}
        />
      )}
      {showViewUserModal && selectedUser && (
        <ViewUserModal
          user={selectedUser}
          onClose={() => setShowViewUserModal(false)}
          onEdit={handleEditUserFromView}
        />
      )}

      {showAddOrderModal && (
        <AddOrderModal
          onClose={() => setShowAddOrderModal(false)}
          onSuccess={() => setOrderRefreshKey(prev => prev + 1)}
        />
      )}
      {showEditOrderModal && selectedOrder && (
        <EditOrderModal
          order={selectedOrder}
          onClose={() => setShowEditOrderModal(false)}
          onSuccess={() => setOrderRefreshKey(prev => prev + 1)}
        />
      )}
      {showViewOrderModal && selectedOrder && (
        <ViewOrderModal
          order={selectedOrder}
          onClose={() => setShowViewOrderModal(false)}
          onEdit={handleEditOrderFromView}
        />
      )}
    </div>
  );
}

export default App;

