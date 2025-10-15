import * as React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { RotateCcw, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { Button } from '@repo/ui/components/button';

import { DataTable } from '@/components/data-table';
import { User, useUsers } from '@/hooks/use-api';

const ROLE_OPTIONS: User['role'][] = ['Admin', 'Manager', 'Contributor'];
const STATUS_OPTIONS: User['status'][] = ['Active', 'Invited', 'Suspended'];
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Member',
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{user.name}</span>
          <span className="text-xs text-muted-foreground">{user.email}</span>
        </div>
      );
    },
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ getValue }) => (
      <span className="text-sm font-medium text-foreground">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: 'team',
    header: 'Team',
    sortingFn: 'alphanumeric',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    enableSorting: false,
    cell: ({ getValue }) => {
      const status = getValue<User['status']>();
      const styleMap: Record<User['status'], string> = {
        Active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
        Invited: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
        Suspended: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
      };

      return (
        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${styleMap[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: 'lastLogin',
    header: 'Last Login',
    cell: ({ getValue }) => formatDate(getValue<string>()),
    sortingFn: (rowA, rowB, columnId) => {
      const valueA = new Date(rowA.getValue<string>(columnId)).getTime();
      const valueB = new Date(rowB.getValue<string>(columnId)).getTime();
      return valueA - valueB;
    },
  },
  {
    accessorKey: 'id',
    header: 'ID',
    enableSorting: false,
    cell: ({ getValue }) => (
      <span className="rounded bg-muted px-2 py-1 text-xs font-medium text-muted-foreground">
        {getValue<string>()}
      </span>
    ),
  },
];

export function UserTable() {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(20);
  const [search, setSearch] = React.useState('');
  const [roleFilter, setRoleFilter] = React.useState<User['role'][]>([]);
  const [statusFilter, setStatusFilter] = React.useState<User['status'][]>([]);

  const queryParams = React.useMemo(
    () => ({
      page,
      pageSize,
      search: search.trim() ? search.trim() : undefined,
      role: roleFilter.length ? roleFilter : undefined,
      status: statusFilter.length ? statusFilter : undefined,
    }),
    [page, pageSize, search, roleFilter, statusFilter],
  );

  const { data, isLoading, isFetching, error, refetch } = useUsers(queryParams);

  const total = data?.total ?? 0;
  const currentPage = data?.page ?? page;
  const currentPageSize = data?.pageSize ?? pageSize;
  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil(Math.max(total, 1) / currentPageSize));

  React.useEffect(() => {
    if (!data) {
      return;
    }

    const nextTotalPages = Math.max(1, Math.ceil(Math.max(data.total, 1) / data.pageSize));
    if (page > nextTotalPages) {
      setPage(nextTotalPages);
    }
  }, [data, page]);

  const showLoadingState = isLoading || (isFetching && rows.length === 0);
  const isRefetching = isFetching && !isLoading;

  const start = total === 0 ? 0 : (currentPage - 1) * currentPageSize + 1;
  const end = total === 0 ? 0 : Math.min(start + rows.length - 1, total);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    setPage(1);
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(event.target.value));
    setPage(1);
  };

  const toggleFilter = <T extends string>(value: T, setter: React.Dispatch<React.SetStateAction<T[]>>) => {
    setter((prev) => {
      const exists = prev.includes(value);
      const next = exists ? prev.filter((item) => item !== value) : [...prev, value];
      return next;
    });
    setPage(1);
  };

  const clearFilters = () => {
    setRoleFilter([]);
    setStatusFilter([]);
    setPage(1);
  };

  return (
    <section className="space-y-5">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-2xl space-y-1.5">
          <h2 className="text-lg font-semibold text-foreground">Team Members</h2>
          <p className="text-sm text-muted-foreground">
            Paginated roster backed by a mock API returning thousands of records. Use the filters to refine the table without downloading the entire dataset.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input
            value={search}
            onChange={handleSearchChange}
            placeholder="Search name, email, role, team..."
            className="h-9 min-w-[220px] rounded-md border border-input bg-background px-3 text-sm shadow-xs outline-none transition focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]"
            aria-label="Search team members"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            <RotateCcw
              className={`size-4 ${isRefetching ? 'animate-spin text-muted-foreground' : ''}`}
              aria-hidden
            />
            Refresh
          </Button>
        </div>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/40 px-4 py-3">
        <FilterGroup label="Role">
          {ROLE_OPTIONS.map((role) => (
            <FilterPill
              key={role}
              label={role}
              active={roleFilter.includes(role)}
              onClick={() => toggleFilter(role, setRoleFilter)}
            />
          ))}
        </FilterGroup>
        <FilterGroup label="Status">
          {STATUS_OPTIONS.map((status) => (
            <FilterPill
              key={status}
              label={status}
              active={statusFilter.includes(status)}
              onClick={() => toggleFilter(status, setStatusFilter)}
            />
          ))}
        </FilterGroup>
        {(roleFilter.length > 0 || statusFilter.length > 0) && (
          <Button type="button" variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
          {error.message}
        </div>
      )}

      <DataTable<User>
        columns={columns}
        data={rows}
        isLoading={showLoadingState}
        emptyMessage={search || roleFilter.length || statusFilter.length ? 'No users match your filters.' : 'No users available yet.'}
      />

      <footer className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-sm text-muted-foreground">
          Showing {start.toLocaleString()} to {end.toLocaleString()} of {total.toLocaleString()} users
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            Rows per page
            <select
              value={currentPageSize}
              onChange={handlePageSizeChange}
              className="h-8 rounded-md border border-input bg-background px-2 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-ring/40 focus-visible:ring-[3px]"
            >
              {PAGE_SIZE_OPTIONS.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </label>

          <nav className="flex items-center gap-1">
            <PaginationButton
              label="First page"
              icon={ChevronsLeft}
              disabled={currentPage <= 1 || isFetching}
              onClick={() => setPage(1)}
            />
            <PaginationButton
              label="Previous page"
              icon={ChevronLeft}
              disabled={currentPage <= 1 || isFetching}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            />
            <span className="px-2 text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <PaginationButton
              label="Next page"
              icon={ChevronRight}
              disabled={currentPage >= totalPages || isFetching}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            />
            <PaginationButton
              label="Last page"
              icon={ChevronsRight}
              disabled={currentPage >= totalPages || isFetching}
              onClick={() => setPage(totalPages)}
            />
          </nav>
        </div>
      </footer>
    </section>
  );
}

type FilterGroupProps = {
  label: string;
  children: React.ReactNode;
};

function FilterGroup({ label, children }: FilterGroupProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
    </div>
  );
}

type FilterPillProps = {
  label: string;
  active: boolean;
  onClick: () => void;
};

function FilterPill({ label, active, onClick }: FilterPillProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
        active
          ? 'border-primary bg-primary text-primary-foreground'
          : 'border-border text-muted-foreground hover:text-foreground'
      }`}
    >
      {label}
    </button>
  );
}

type PaginationButtonProps = {
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  disabled: boolean;
  onClick: () => void;
};

function PaginationButton({ label, icon: Icon, disabled, onClick }: PaginationButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="size-8"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
    >
      <Icon className="size-4" aria-hidden />
    </Button>
  );
}

function formatDate(input: string) {
  const date = new Date(input);
  if (Number.isNaN(date.valueOf())) {
    return 'N/A';
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}
