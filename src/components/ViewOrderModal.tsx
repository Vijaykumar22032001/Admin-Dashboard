import type { Order } from '../types';

interface ViewOrderModalProps {
  order: Order;
  onClose: () => void;
  onEdit: () => void;
}

function ViewOrderModal({ order, onClose, onEdit }: ViewOrderModalProps) {
  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-700';
      case 'Processing':
        return 'bg-blue-100 text-blue-700';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'Cancelled':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Order Details</h2>
            <p className="text-sm text-gray-600 mt-1">Complete order information</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        <div className="p-6">
          <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">{order.orderNumber}</h3>
                <p className="text-gray-600 mt-1">Order ID: #{order.id}</p>
              </div>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="text-3xl font-bold text-blue-600">
              ₹{order.amount.toFixed(2)}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Customer Name</p>
              <p className="text-lg font-semibold text-gray-800">{order.customer}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Customer Email</p>
              <p className="text-lg font-semibold text-gray-800">{order.customerEmail}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-800">{order.orderDate}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-lg font-semibold text-gray-800">{order.orderNumber}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
              <p className="text-sm text-gray-600 mb-2">Items</p>
              <p className="text-gray-800">{order.items || 'No items specified'}</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-gray-800 mb-3">Order Summary</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Order ID</span>
                <span className="font-medium text-gray-800">#{order.id}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Status</span>
                <span className="font-medium text-gray-800">{order.status}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Date Placed</span>
                <span className="font-medium text-gray-800">{order.orderDate}</span>
              </div>
              <div className="border-t border-blue-300 pt-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Total Amount</span>
                  <span className="text-xl font-bold text-blue-600">₹{order.amount.toFixed(2)}</span>
                </div>
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
              Edit Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewOrderModal;
