"use client";

import type { Table } from "@tanstack/react-table";
import { useState } from "react";
import { createPortal } from "react-dom";

import { useDeleteManyMembers } from "@/app/(dashboard)/membres/_hooks/use-delete-members";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MutationTypeEnum } from "@/lib/types/enum";
import type { User } from "@/lib/types/user.types";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
  mutationType: MutationTypeEnum;
}

export function DataTablePagination<TData>({
  table,
  mutationType,
}: DataTablePaginationProps<TData>) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<User[]>([]);
  const deleteMemberMutation = useDeleteManyMembers();

  const openModal = () => {
    const selectedRows = table
      .getSelectedRowModel()
      .rows.map((row) => row.original);

    setSelectedItems(selectedRows as User[]);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedItems([]);
  };

  const handleDelete = () => {
    const idsToDelete = selectedItems.map((item) => item.id);

    if (mutationType === MutationTypeEnum.member) {
      deleteMemberMutation.mutate({ ids: idsToDelete });
    }

    table.resetRowSelection();
    closeModal();
  };

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {table.getFilteredSelectedRowModel().rows.length} sur{" "}
        {table.getFilteredRowModel().rows.length} ligne(s) sélectionnée
      </p>
      {table.getSelectedRowModel().rows.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="rounded-lg bg-red-600 px-4 py-2 font-medium text-white transition-colors hover:bg-red-700"
              onClick={openModal}
            >
              Supprimer
            </button>
          </DropdownMenuTrigger>
        </DropdownMenu>
      ) : (
        <p></p>
      )}

      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium">Lignes par page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-center text-muted-foreground max-sm:space-y-3 sm:space-x-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Précédent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Suivant
          </Button>
        </div>
      </div>
      {isModalOpen &&
        createPortal(
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-lg font-semibold">
                Confirmer la suppression
              </h2>
              <br />
              <p>
                {selectedItems.length > 1
                  ? `Êtes-vous sûr de vouloir supprimer les ${selectedItems.length} éléments sélectionnés ?`
                  : "Êtes-vous sûr de vouloir supprimer l'élément sélectionné ?"}
              </p>
              <br />
              <div className="flex justify-end mt-4 space-x-2">
                <Button onClick={closeModal} variant="outline">
                  Annuler
                </Button>
                <Button
                  onClick={handleDelete}
                  className="bg-orange-400 text-white hover:bg-orange-500"
                >
                  Supprimer
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
