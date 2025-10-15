'use client';

import { useMemo } from 'react';
import CustomStore, { type Options as CustomStoreOptions } from 'devextreme/data/custom_store';
import type { LoadOptions } from 'devextreme/data/load_options';
import DataGrid, { Column, FilterRow, LoadPanel, Pager, Paging, SearchPanel } from 'devextreme-react/data-grid';
import type { ColumnCellTemplateData } from 'devextreme/ui/data_grid';

import { api } from '@/lib/api';
import type { User, UsersResponse } from '@/hooks/use-api';

type GridLoadOptions = LoadOptions & {
  skip?: number;
  take?: number;
  searchValue?: string;
  filter?: unknown;
};

const DEFAULT_PAGE_SIZE = 20;
const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function DevExtremeUserGrid() {
  const dataSource = useMemo(() => {
    const storeConfig: CustomStoreOptions<User, string> = {
      key: 'id',
      load: async (loadOptions: GridLoadOptions) => {
        const { skip = 0, take = DEFAULT_PAGE_SIZE, searchValue, filter } = loadOptions;
        const pageSize = typeof take === 'number' && take > 0 ? take : DEFAULT_PAGE_SIZE;
        const page = Math.floor((typeof skip === 'number' ? skip : 0) / pageSize) + 1;

        const params = new URLSearchParams({
          page: String(page),
          pageSize: String(pageSize),
        });

        if (typeof searchValue === 'string' && searchValue.trim()) {
          params.set('search', searchValue.trim());
        }

        const parsed = parseFilter(filter);
        parsed.role.forEach((value) => params.append('role', value));
        parsed.status.forEach((value) => params.append('status', value));

        const endpoint = `/users?${params.toString()}`;
        const response = await api.get<UsersResponse>(endpoint);

        return {
          data: response.data,
          totalCount: response.total,
        };
      },
    };

    return new CustomStore<User, string>(storeConfig);
  }, []);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <DataGrid<User, string>
        dataSource={dataSource}
        keyExpr="id"
        showBorders={false}
        remoteOperations={{ paging: true, filtering: true, sorting: false }}
        height="70vh"
        columnAutoWidth
        rowAlternationEnabled
        allowColumnResizing
        wordWrapEnabled
      >
        <SearchPanel visible highlightCaseSensitive={false} placeholder="Search members..." />
        <FilterRow visible applyFilter="auto" />
        <LoadPanel enabled />
        <Paging defaultPageSize={DEFAULT_PAGE_SIZE} />
        <Pager
          showInfo
          showNavigationButtons
          showPageSizeSelector
          allowedPageSizes={PAGE_SIZE_OPTIONS}
          displayMode="compact"
        />

        <Column
          dataField="name"
          caption="Member"
          cellRender={(cell) => renderMemberCell(cell as ColumnCellTemplateData<User, string>)}
          allowSorting={false}
          allowFiltering={false}
          allowHeaderFiltering={false}
        />
        <Column dataField="role" caption="Role" allowSorting={false} />
        <Column dataField="team" caption="Team" allowSorting={false} allowFiltering={false} allowHeaderFiltering={false} />
        <Column dataField="status" caption="Status" allowSorting={false} />
        <Column
          dataField="lastLogin"
          caption="Last Login"
          dataType="datetime"
          customizeText={({ valueText }) => valueText || 'N/A'}
        />
        <Column dataField="id" caption="ID" width={120} allowSorting={false} allowFiltering={false} allowHeaderFiltering={false} />
      </DataGrid>
    </div>
  );
}

function renderMemberCell(cell: ColumnCellTemplateData<User, string>) {
  const user = cell.data as User | undefined;

  if (!user) {
    return null;
  }

  return (
    <div className="flex flex-col">
      <span className="font-medium text-foreground">{user.name}</span>
      <span className="text-xs text-muted-foreground">{user.email}</span>
    </div>
  );
}

function parseFilter(filter: GridLoadOptions['filter']): { role: string[]; status: string[] } {
  const role = new Set<string>();
  const status = new Set<string>();

  const visit = (node: unknown) => {
    if (!node) {
      return;
    }

    if (Array.isArray(node)) {
      if (
        node.length === 3 &&
        typeof node[0] === 'string' &&
        typeof node[1] === 'string'
      ) {
        const [field, operator, value] = node;
        if (operator === '=' && typeof value === 'string') {
          if (field === 'role') {
            role.add(value);
          }
          if (field === 'status') {
            status.add(value);
          }
        }
      } else {
        node.forEach(visit);
      }
    }
  };

  visit(filter);

  return {
    role: Array.from(role),
    status: Array.from(status),
  };
}
