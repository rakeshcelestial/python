// -------- ENUM --------
export enum UserRole {
  Admin = "Admin",
  User = "User",
  Guest = "Guest",
}

// -------- INTERFACES --------
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface FilterCriteria {
  name?: string;
  email?: string;
  role?: UserRole;
}

export type SortOrder = "asc" | "desc";
export type SortableField = keyof User;

// -------- UTIL --------
function generateId(): string {
  return `user_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// -------- FUNCTIONS --------

// Create User
export function createUser(
  name: string,
  email: string,
  role: UserRole
): User {
  return {
    id: generateId(),
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  };
}

// Update User
export function updateUser(
  user: User,
  updates: Partial<Omit<User, "id" | "createdAt">>
): User {
  return { ...user, ...updates };
}

// Filter Users
export function filterUsers(
  users: User[],
  criteria: FilterCriteria
): User[] {
  return users.filter((user) => {
    return (
      (!criteria.name ||
        user.name.toLowerCase().includes(criteria.name.toLowerCase())) &&
      (!criteria.email ||
        user.email.toLowerCase().includes(criteria.email.toLowerCase())) &&
      (!criteria.role || user.role === criteria.role)
    );
  });
}

// Sort Users
export function sortUsers(
  users: User[],
  sortBy: SortableField,
  order: SortOrder
): User[] {
  return [...users].sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (valA < valB) return order === "asc" ? -1 : 1;
    if (valA > valB) return order === "asc" ? 1 : -1;
    return 0;
  });
}

// Fetch Users (mock API)
export async function fetchUsers(
  page: number,
  limit: number
): Promise<User[]> {
  try {
    const res = await fetch(
      `https://jsonplaceholder.typicode.com/users`
    );

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    const data: unknown = await res.json();

    // Type narrowing
    if (!Array.isArray(data)) {
      throw new Error("Invalid response format");
    }

    return data.slice((page - 1) * limit, page * limit).map((u: any) => ({
      id: String(u.id),
      name: String(u.name),
      email: String(u.email),
      role: UserRole.User,
      createdAt: new Date().toISOString(),
    }));

  } catch (err) {
    throw new Error(
      err instanceof Error ? err.message : "Unknown error"
    );
  }
}

// -------- USER SERVICE CLASS --------
export class UserService {
  private users: User[] = [];
  private cache: Map<string, User> = new Map();

  constructor() {}

  async getUser(id: string): Promise<User | undefined> {
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const user = this.users.find((u) => u.id === id);

    if (user) {
      this.cache.set(id, user);
    }

    return user;
  }

  addUser(name: string, email: string, role: UserRole): User {
    const user = createUser(name, email, role);
    this.users.push(user);
    this.cache.set(user.id, user);
    return user;
  }

  searchUsers(query: string): User[] {
    const q = query.toLowerCase();
    return this.users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q)
    );
  }

  filter(criteria: FilterCriteria): User[] {
    return filterUsers(this.users, criteria);
  }

  sort(sortBy: SortableField, order: SortOrder): User[] {
    return sortUsers(this.users, sortBy, order);
  }
}

// -------- USAGE --------
const service = new UserService();

const u1 = service.addUser("Alice", "alice@mail.com", UserRole.Admin);
const u2 = service.addUser("Bob", "bob@mail.com", UserRole.User);

console.log(service.searchUsers("alice"));
console.log(service.sort("name", "asc"));