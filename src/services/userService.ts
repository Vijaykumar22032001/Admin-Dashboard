import { api } from './api';
import type { User, PaginatedResponse, FilterParams } from '../types';

interface JSONPlaceholderUser {
  id: number;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: {
      lat: string;
      lng: string;
    };
  };
  phone: string;
  website: string;
  company: {
    name: string;
    catchPhrase: string;
    bs: string;
  };
}

const STORAGE_KEY_USERS = 'admin_panel_users_changes';
const STORAGE_KEY_DELETED = 'admin_panel_users_deleted';

interface StoredChanges {
  added: User[];
  updated: { [key: number]: Partial<User> };
}

class UserService {
  private getStoredChanges(): StoredChanges {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    return data ? JSON.parse(data) : { added: [], updated: {} };
  }

  private saveStoredChanges(changes: StoredChanges): void {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(changes));
  }

  private getDeletedIds(): number[] {
    const data = localStorage.getItem(STORAGE_KEY_DELETED);
    return data ? JSON.parse(data) : [];
  }

  private saveDeletedIds(ids: number[]): void {
    localStorage.setItem(STORAGE_KEY_DELETED, JSON.stringify(ids));
  }

  private mapJSONPlaceholderUser(user: JSONPlaceholderUser, index: number): User {
    const roles = ['Admin', 'User', 'Editor'];
    const statuses = ['Active', 'Inactive'];

    const changes = this.getStoredChanges();
    const baseUser: User = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: roles[index % 3],
      status: statuses[index % 5 === 0 ? 1 : 0],
      joinDate: new Date(2024, index % 12, (index * 3) % 28 + 1).toISOString().split('T')[0]
    };

    return changes.updated[user.id]
      ? { ...baseUser, ...changes.updated[user.id] }
      : baseUser;
  }

  async getUsers(params?: FilterParams): Promise<PaginatedResponse<User>> {
    const response = await api.get<JSONPlaceholderUser[]>('/users');
    const changes = this.getStoredChanges();
    const deletedIds = this.getDeletedIds();

    let users = response
      .filter(user => !deletedIds.includes(user.id))
      .map((user, index) => this.mapJSONPlaceholderUser(user, index));

    users = [...users, ...changes.added];

    // Sort by ID descending (newest first)
    users.sort((a, b) => b.id - a.id);

    if (params?.search) {
      const searchLower = params.search.toLowerCase();
      users = users.filter(user =>
        user.name.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }

    if (params?.role && params.role !== 'all') {
      users = users.filter(user => user.role === params.role);
    }

    if (params?.status && params.status !== 'all') {
      users = users.filter(user => user.status === params.status);
    }

    const total = users.length;
    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = users.slice(startIndex, endIndex);

    return {
      data: paginatedUsers,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
  }

  async getUserById(id: number): Promise<User> {
    const changes = this.getStoredChanges();

    const addedUser = changes.added.find(u => u.id === id);
    if (addedUser) {
      return addedUser;
    }

    const response = await api.get<JSONPlaceholderUser>(`/users/${id}`);
    return this.mapJSONPlaceholderUser(response, id - 1);
  }

  async createUser(userData: Omit<User, 'id'>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const changes = this.getStoredChanges();
    const allUsers = [...(await api.get<JSONPlaceholderUser[]>('/users')), ...changes.added.map(u => ({ id: u.id } as JSONPlaceholderUser))];
    const maxId = Math.max(...allUsers.map(u => u.id));

    const newUser: User = {
      id: maxId + 1,
      ...userData
    };

    changes.added.push(newUser);
    this.saveStoredChanges(changes);

    return newUser;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const changes = this.getStoredChanges();

    const addedUserIndex = changes.added.findIndex(u => u.id === id);
    if (addedUserIndex !== -1) {
      changes.added[addedUserIndex] = { ...changes.added[addedUserIndex], ...userData };
      this.saveStoredChanges(changes);
      return changes.added[addedUserIndex];
    }

    changes.updated[id] = {
      ...changes.updated[id],
      ...userData
    };
    this.saveStoredChanges(changes);

    const currentUser = await this.getUserById(id);
    return { ...currentUser, ...userData };
  }

  async deleteUser(id: number): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const changes = this.getStoredChanges();
    const deletedIds = this.getDeletedIds();

    const addedUserIndex = changes.added.findIndex(u => u.id === id);
    if (addedUserIndex !== -1) {
      changes.added.splice(addedUserIndex, 1);
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

export const userService = new UserService();
