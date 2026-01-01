import { api } from './api';
import type { Order, PaginatedResponse, FilterParams } from '../types';

interface JSONPlaceholderPost {
  userId: number;
  id: number;
  title: string;
  body: string;
}

interface OrderFilterParams extends FilterParams {
  customerSearch?: string;
  dateFrom?: string;
  dateTo?: string;
}

const STORAGE_KEY_ORDERS = 'admin_panel_orders_changes';
const STORAGE_KEY_DELETED = 'admin_panel_orders_deleted';

interface StoredChanges {
  added: Order[];
  updated: { [key: number]: Partial<Order> };
}

class OrderService {
  private getStoredChanges(): StoredChanges {
    const data = localStorage.getItem(STORAGE_KEY_ORDERS);
    return data ? JSON.parse(data) : { added: [], updated: {} };
  }

  private saveStoredChanges(changes: StoredChanges): void {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(changes));
  }

  private getDeletedIds(): number[] {
    const data = localStorage.getItem(STORAGE_KEY_DELETED);
    return data ? JSON.parse(data) : [];
  }

  private saveDeletedIds(ids: number[]): void {
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(ids));
  }

  private mapJSONPlaceholderPost(post: JSONPlaceholderPost, index: number): Order {
    const statuses: Order['status'][] = ['Pending', 'Processing', 'Completed', 'Cancelled'];
    const customerNames = [
      'John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'Tom Brown',
      'Emily Davis', 'David Wilson', 'Lisa Anderson', 'Robert Taylor', 'Maria Garcia'
    ];

    const statusIndex = index % 4;
    const customerIndex = post.userId - 1;

    const changes = this.getStoredChanges();
    const baseOrder: Order = {
      id: post.id,
      orderNumber: `ORD-${String(post.id).padStart(5, '0')}`,
      customer: customerNames[customerIndex] || `Customer ${post.userId}`,
      customerEmail: `customer${post.userId}@example.com`,
      amount: parseFloat((Math.random() * 500 + 50).toFixed(2)),
      status: statuses[statusIndex],
      orderDate: new Date(2024, (index % 12), (index % 28) + 1).toISOString().split('T')[0],
      items: post.title
    };

    return changes.updated[post.id]
      ? { ...baseOrder, ...changes.updated[post.id] }
      : baseOrder;
  }

  async getOrders(params?: OrderFilterParams): Promise<PaginatedResponse<Order>> {
    const response = await api.get<JSONPlaceholderPost[]>('/posts');
    const changes = this.getStoredChanges();
    const deletedIds = this.getDeletedIds();

    let orders = response
      .filter(post => !deletedIds.includes(post.id))
      .map((post, index) => this.mapJSONPlaceholderPost(post, index));

    orders = [...orders, ...changes.added];

    // Sort by ID descending (newest first)
    orders.sort((a, b) => b.id - a.id);

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      orders = orders.filter(order =>
        order.orderNumber.toLowerCase().includes(searchLower) ||
        order.customer.toLowerCase().includes(searchLower) ||
        order.customerEmail.toLowerCase().includes(searchLower)
      );
    }

    if (params?.status && params.status !== 'all') {
      orders = orders.filter(order => order.status === params.status);
    }

    const total = orders.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedOrders = orders.slice(startIndex, endIndex);

    return {
      data: paginatedOrders,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getOrderById(id: number): Promise<Order> {
    const changes = this.getStoredChanges();

    const addedOrder = changes.added.find(o => o.id === id);
    if (addedOrder) {
      return addedOrder;
    }

    const response = await api.get<JSONPlaceholderPost>(`/posts/${id}`);
    return this.mapJSONPlaceholderPost(response, id - 1);
  }

  async createOrder(orderData: Omit<Order, 'id'>): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const changes = this.getStoredChanges();
    const allOrders = [...(await api.get<JSONPlaceholderPost[]>('/posts')), ...changes.added.map(o => ({ id: o.id } as JSONPlaceholderPost))];
    const maxId = Math.max(...allOrders.map(o => o.id));

    const newOrder: Order = {
      id: maxId + 1,
      ...orderData,
      orderNumber: orderData.orderNumber || `ORD-${String(maxId + 1).padStart(5, '0')}`
    };

    changes.added.push(newOrder);
    this.saveStoredChanges(changes);

    return newOrder;
  }

  async updateOrder(id: number, orderData: Partial<Order>): Promise<Order> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const changes = this.getStoredChanges();

    const addedOrderIndex = changes.added.findIndex(o => o.id === id);
    if (addedOrderIndex !== -1) {
      changes.added[addedOrderIndex] = { ...changes.added[addedOrderIndex], ...orderData };
      this.saveStoredChanges(changes);
      return changes.added[addedOrderIndex];
    }

    changes.updated[id] = {
      ...changes.updated[id],
      ...orderData
    };
    this.saveStoredChanges(changes);

    const currentOrder = await this.getOrderById(id);
    return { ...currentOrder, ...orderData };
  }

  async deleteOrder(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const changes = this.getStoredChanges();
    const deletedIds = this.getDeletedIds();

    const addedOrderIndex = changes.added.findIndex(o => o.id === id);
    if (addedOrderIndex !== -1) {
      changes.added.splice(addedOrderIndex, 1);
      this.saveStoredChanges(changes);
      return;
    }

    if (!deletedIds.includes(id)) {
      deletedIds.push(id);
      this.saveDeletedIds(deletedIds);
    }

    if (changes.updated[id]) {
      delete changes.updated[id];
      this.saveStoredChanges(changes);
    }
  }
}

export const orderService = new OrderService();