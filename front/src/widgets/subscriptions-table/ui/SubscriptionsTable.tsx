"use client";

import { useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  MoreHorizontal,
  Calendar,
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Pencil,
  Trash2,
  CircleX,
  Check,
} from "lucide-react";
import {
  AddSubscriptionModal,
  EditSubscriptionModal,
  useDeleteSubscription,
} from "@/features/subscriptions";
import { useSubscriptionsQuery } from "@/features/subscriptions/model/use-subscriptions-query";
import {
  calculateNextPaymentDate,
  getCategoryConfig,
  Subscription,
} from "@/entities/subscriptions";
import { useToggleSubscriptionStatus } from "@/features/subscriptions/model/use-toggle-subscription-status";
import { SubscriptionBrandIcon } from "@/entities/subscriptions/ui/SubscriptionBrandIcon";

const columnHelper = createColumnHelper<Subscription>();

const columns = [
  // ... Колонка: СЕРВИС
  columnHelper.accessor("name", {
    header: "Сервисы",
    cell: (info) => {
      const row = info.row.original;
      const isCancelled = row.status === "Cancelled";

      const config = getCategoryConfig(row.category);

      return (
        <div className="flex items-center gap-4 py-2">
          <SubscriptionBrandIcon
            name={row.name}
            category={row.category}
            size="sm"
          />

          <div className="flex flex-col">
            <span
              className={`font-semibold text-sm ${
                isCancelled ? "text-zinc-500 line-through" : "text-zinc-100"
              }`}
            >
              {row.name}
            </span>
            {/* Показываем русский label (например, "Развлечения") */}
            <span className="text-xs text-zinc-500">{config.label}</span>
          </div>
        </div>
      );
    },
  }),
  // ... Колонка: СТАТУС
  columnHelper.accessor("status", {
    header: "Статус",
    cell: (info) => {
      const status = info.getValue();
      const isActive = status === "Active";

      return (
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${isActive ? "bg-[#2cfc73]/10 text-[#2cfc73] border-[#2cfc73]/20" : "bg-zinc-800/50 text-zinc-400 border-zinc-700"}`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-[#2cfc73]" : "bg-zinc-500"}`}
          ></div>
          {isActive ? "Активный" : "Отменен"}
        </div>
      );
    },
  }),
  // ... Колонка: ЦИКЛ
  columnHelper.accessor("cycle", {
    header: "Цикл",
    cell: (info) => (
      <span className="text-sm text-zinc-400">
        {info.getValue() === "Monthly" ? "Ежемесячно" : "Ежегодно"}
      </span>
    ),
  }),
  // ... Колонка: СУММА
  columnHelper.accessor("cost", {
    header: "Сумма",
    cell: (info) => {
      const isCancelled = info.row.original.status === "Cancelled";
      return (
        <span
          className={`text-sm font-bold ${isCancelled ? "text-zinc-500" : "text-white"}`}
        >
          {info.row.original.currency} {info.getValue().toFixed(2)}
        </span>
      );
    },
  }),
  // ... Колонка: СЛЕДУЮЩИЙ ПЛАТЕЖ
  columnHelper.accessor("first_payment_date", {
    header: "Следующий платеж",
    cell: (info) => {
      const row = info.row.original;
      const isCancelled = row.status === "Cancelled";
      const nextPaymentStr = calculateNextPaymentDate(
        row.first_payment_date,
        row.cycle,
      );

      const formattedDate = new Date(nextPaymentStr).toLocaleDateString(
        "ru-RU",
        {
          day: "numeric",
          month: "short",
          year: "numeric",
        },
      );

      return (
        <div
          className={`flex items-center gap-2 text-sm ${isCancelled ? "text-zinc-500 italic" : "text-zinc-400"}`}
        >
          {!isCancelled && <Calendar className="w-4 h-4 text-zinc-500" />}
          {isCancelled ? "Отменена" : formattedDate}
        </div>
      );
    },
  }),
  // ... Колонка: ДЕЙСТВИЯ
  columnHelper.display({
    id: "actions",
    header: "",
    cell: (info) => (
      <SubscriptionActionsCell subscription={info.row.original} />
    ),
  }),
];

export const SubscriptionsTable = () => {
  const {
    data: subscriptions = [],
    isLoading,
    isError,
  } = useSubscriptionsQuery();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data: subscriptions,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 8,
      },
    },
    state: {
      globalFilter,
      columnFilters,
    },
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
  });

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-[#0a0a0a] rounded-xl flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-[#2cfc73] animate-spin" />
        <span className="text-zinc-500 text-sm">Загрузка подписок...</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6 my-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Все подписки</h1>
            <p className="text-zinc-400 text-sm sm:text-base">
              Управляйте и отслеживайте свои регулярные расходы.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#2cfc73] hover:bg-[#25db63] text-black font-semibold rounded-lg px-4 py-2 sm:py-2.5 transition-all shadow-[0_0_15px_rgba(44,252,115,0.15)] hover:shadow-[0_0_20px_rgba(44,252,115,0.25)] flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            Добавить подписку
          </button>
        </div>

        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between bg-[#0a0a0a] rounded-xl gap-4">
          <div className="relative w-full xl:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              value={globalFilter ?? ""}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder="Поиск подписок..."
              className="w-full bg-[#121212] border border-zinc-800/80 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full xl:w-auto overflow-x-auto pb-1 xl:pb-0">
            <div className="relative">
              <select
                value={
                  (table.getColumn("status")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("status")?.setFilterValue(e.target.value)
                }
                className="appearance-none bg-[#121212] border border-zinc-800/80 rounded-lg pl-3 pr-8 py-2.5 text-sm text-white hover:border-zinc-700 transition-colors cursor-pointer outline-none w-36"
              >
                <option value="">Статус: Все</option>
                <option value="Active">Активные</option>
                <option value="Cancelled">Отмененные</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={
                  (table.getColumn("cycle")?.getFilterValue() as string) ?? ""
                }
                onChange={(e) =>
                  table.getColumn("cycle")?.setFilterValue(e.target.value)
                }
                className="appearance-none bg-[#121212] border border-zinc-800/80 rounded-lg pl-3 pr-8 py-2.5 text-sm text-white hover:border-zinc-700 transition-colors cursor-pointer outline-none w-44"
              >
                <option value="">Цикл: Все</option>
                <option value="Monthly">Ежемесячно</option>
                <option value="Yearly">Ежегодно</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      {/* ТАБЛИЦА */}
      <div className="w-full border border-zinc-800 bg-[#0a0a0a] rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a] border-b border-zinc-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-xs font-semibold text-zinc-500 uppercase tracking-wider"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>

            <tbody className="divide-y divide-zinc-800/50">
              {table.getRowModel().rows.length > 0 ? (
                table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-zinc-900/30 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-6 py-3 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    className="px-6 py-8 text-center text-zinc-500"
                  >
                    По вашему запросу ничего не найдено.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 4. ПАНЕЛЬ ПАГИНАЦИИ */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-800 bg-[#0a0a0a]">
          {/* Текст со счетчиком страниц */}
          <div className="text-sm text-zinc-400">
            Страница{" "}
            <span className="text-white font-medium">
              {table.getState().pagination.pageIndex + 1}
            </span>{" "}
            из{" "}
            <span className="text-white font-medium">
              {table.getPageCount()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-lg border border-zinc-800 bg-[#121212] text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">Назад</span>
            </button>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-lg border border-zinc-800 bg-[#121212] text-zinc-400 disabled:opacity-50 disabled:cursor-not-allowed hover:text-white hover:border-zinc-700 transition-colors flex items-center gap-1"
            >
              <span className="hidden sm:inline text-sm">Вперед</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <AddSubscriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

const SubscriptionActionsCell = ({
  subscription,
}: {
  subscription: Subscription;
}) => {
  const { mutate: deleteSubscription, isPending: isDeleting } =
    useDeleteSubscription();
  const { mutate: toggleSubscription, isPending: isTogglingStatus } =
    useToggleSubscriptionStatus();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <div className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-zinc-800 outline-none">
            <MoreHorizontal className="w-5 h-5" />
          </div>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="bg-[#18181b] border-zinc-800 text-zinc-300 rounded-xl p-1 shadow-2xl min-w-[180px]"
        >
          <DropdownMenuItem
            onClick={() => setIsEditModalOpen(true)}
            className="cursor-pointer flex items-center gap-2 py-2.5 px-3 rounded-lg outline-none transition-colors"
          >
            <Pencil className="w-4 h-4" />
            <span className="font-medium">Редактировать</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => deleteSubscription(subscription.id)}
            disabled={isDeleting}
            className="cursor-pointer text-red-500 focus:text-red-500 focus:bg-red-500/10 flex items-center gap-2 py-2.5 px-3 rounded-lg outline-none transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">Удалить</span>
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() =>
              toggleSubscription({
                id: subscription.id,
                status:
                  subscription.status === "Active" ? "Cancelled" : "Active",
              })
            }
            disabled={isTogglingStatus}
            className="cursor-pointer focus:text-white flex items-center gap-2 py-2.5 px-3 rounded-lg outline-none transition-colors disabled:opacity-50"
          >
            {subscription.status === "Active" ? (
              <>
                <CircleX className="w-4 h-4" />
                <span className="font-medium">Отменить подписку</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4 text-[#2cfc73]" />
                <span className="font-medium text-[#2cfc73]">Активировать</span>
              </>
            )}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isEditModalOpen && (
        <EditSubscriptionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          subscription={subscription}
        />
      )}
    </>
  );
};
