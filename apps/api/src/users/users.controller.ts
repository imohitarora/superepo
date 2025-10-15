import { Controller, Get, Query } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query('page') pageParam?: string,
    @Query('pageSize') pageSizeParam?: string,
    @Query('search') search?: string,
    @Query('role') role?: string | string[],
    @Query('status') status?: string | string[],
  ) {
    const page = Math.max(Number.parseInt(pageParam ?? '1', 10) || 1, 1);
    const pageSize = clampPageSize(Number.parseInt(pageSizeParam ?? '20', 10) || 20);

    return this.usersService.findAll({
      page,
      pageSize,
      search,
      role: toArray(role),
      status: toArray(status),
    });
  }
}

function toArray(value?: string | string[]): string[] | undefined {
  if (!value) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function clampPageSize(requested: number) {
  const minimum = 5;
  const maximum = 100;
  return Math.min(Math.max(requested, minimum), maximum);
}
