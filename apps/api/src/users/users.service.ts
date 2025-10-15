import { Injectable } from '@nestjs/common';

export type UserDto = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Contributor';
  status: 'Active' | 'Invited' | 'Suspended';
  team: string;
  lastLogin: string;
};

export type UsersQuery = {
  page: number;
  pageSize: number;
  search?: string;
  role?: string[];
  status?: string[];
};

export type UsersResult = {
  data: UserDto[];
  total: number;
  page: number;
  pageSize: number;
};

@Injectable()
export class UsersService {
  private readonly mockUsers: UserDto[];

  constructor() {
    this.mockUsers = this.generateUsers(2000);
  }

  findAll(query: UsersQuery): UsersResult {
    const { page, pageSize, search, role, status } = query;

    let filtered = this.mockUsers;

    if (search) {
      const normalized = search.trim().toLowerCase();
      filtered = filtered.filter((user) =>
        [user.name, user.email, user.role, user.status, user.team].some((value) =>
          value.toLowerCase().includes(normalized),
        ),
      );
    }

    if (role?.length) {
      const allowedRoles = new Set(role.map((value) => value.toLowerCase()));
      filtered = filtered.filter((user) => allowedRoles.has(user.role.toLowerCase()));
    }

    if (status?.length) {
      const allowedStatuses = new Set(status.map((value) => value.toLowerCase()));
      filtered = filtered.filter((user) => allowedStatuses.has(user.status.toLowerCase()));
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: filtered.slice(start, end),
      total,
      page,
      pageSize,
    };
  }

  private generateUsers(count: number): UserDto[] {
    const firstNames = [
      'Sophia',
      'Jackson',
      'Amelia',
      'Mateo',
      'Luna',
      'Noah',
      'Hannah',
      'Ethan',
      'Olivia',
      'Liam',
      'Mason',
      'Ava',
      'Evelyn',
      'Logan',
      'Aria',
      'Lucas',
      'Mia',
      'Henry',
      'Zoe',
      'Harper',
    ];
    const lastNames = [
      'Patel',
      'Lee',
      'Chen',
      'Garcia',
      'Rossi',
      'Williams',
      'Becker',
      'Davis',
      'Nguyen',
      'Smith',
      'Brown',
      'Khan',
      'Martin',
      'Hernandez',
      'Foster',
      'Wright',
      'Young',
      'Johnson',
      'Clark',
      'Rivera',
    ];
    const teams = [
      'Platform',
      'Payments',
      'Revenue Ops',
      'Orders',
      'Fulfillment',
      'Support',
      'Analytics',
      'Risk',
      'Mobile',
      'Growth',
      'Marketplace',
    ];
    const roles: UserDto['role'][] = ['Admin', 'Manager', 'Contributor'];
    const statuses: UserDto['status'][] = ['Active', 'Invited', 'Suspended'];

    return Array.from({ length: count }, (_, index) => {
      const first = firstNames[index % firstNames.length];
      const last = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
      const normalizedFirst = first.toLowerCase();
      const normalizedLast = last.toLowerCase();
      const idSuffix = (index + 1001).toString().padStart(4, '0');

      return {
        id: `USR-${idSuffix}`,
        name: `${first} ${last}`,
        email: `${normalizedFirst}.${normalizedLast}${index}@example.com`,
        role: roles[index % roles.length],
        status: statuses[index % statuses.length],
        team: teams[index % teams.length],
        lastLogin: new Date(Date.now() - index * 86_400_000 * 0.35).toISOString(),
      };
    });
  }
}
