"use client";

import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { useRef, useState } from "react";

import { ActionsCell } from "@/components/cells/actions-cell";
import RoleCell from "@/components/cells/role-cell";
import LoadingCell from "@/components/cells/skeleton-cell";
import TextCell from "@/components/cells/text-cell";
import { DeleteModal } from "@/components/delete-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import type { Session } from "@/lib/types/session.types";
import type { EditedUser, User } from "@/lib/types/user.types";
import { userService } from "@/services/user.service";

import { useDeleteMember } from "../_hooks/use-delete-members";
import { useMemberMutations } from "../_hooks/use-members-mutations";

dayjs.extend(isBetween);

interface DataTableMembersProps {
  session: Session;
}

export default function DataTableMembers({ session }: DataTableMembersProps) {
  const isUnauthorized = session.role === "READER";
  const [memberEditedRowId, setMemberEditedRowId] = useState<string | null>(
    null
  );
  const [selectedMemberName, setSelectedMemberName] = useState<string | null>(
    null
  );
  const memberOriginalRow = useRef<User | null>(null);
  const memberEditedRowRef = useRef<EditedUser | null>(null);
  const selectedMemberRef = useRef<User | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    data: members,
    isPending,
    isError: isMemberError,
  } = useQuery({
    queryKey: ["members"],
    queryFn: () => userService.findAll(),
  });

  const deleteMemberMutation = useDeleteMember();

  const { updateRoleMutation } = useMemberMutations();

  const handleCancelEdit = () => {
    setMemberEditedRowId(null);
  };

  const handleDelete = (member: User) => {
    selectedMemberRef.current = member;
    setSelectedMemberName(member.username);
    setIsModalOpen(true);
  };

  const confirmDelete = () => {
    if (selectedMemberRef.current) {
      deleteMemberMutation.mutate({
        id: selectedMemberRef.current.id,
      });
      setIsModalOpen(false);
    }
  };

  const startEditing = (row: User) => {
    memberOriginalRow.current = row;
    memberEditedRowRef.current = { username: row.username, role: row.role };

    setMemberEditedRowId(row.id);
  };

  const handleChange = (key: keyof EditedUser, value: string) => {
    if (!memberEditedRowRef.current) return;

    memberEditedRowRef.current = {
      ...memberEditedRowRef.current,
      [key]: value,
    };
  };

  const saveEditing = () => {
    if (!memberEditedRowRef.current || !memberOriginalRow.current) return;

    const { role } = memberEditedRowRef.current;
    const original = memberOriginalRow.current;

    if (role === original.role) return;

    updateRoleMutation.mutate({
      id: original.id,
      role: memberEditedRowRef.current.role,
    });

    setMemberEditedRowId(null);
    memberEditedRowRef.current = null;
    memberOriginalRow.current = null;
  };

  const columns: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
            className="border-white text-black data-[state=checked]:bg-white"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            className="border-foreground text-background data-[state=checked]:bg-foreground"
          />
        </div>
      ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "username",
      header: "Nom d'utilisateur",
      cell: ({ row }) =>
        isPending ? (
          <LoadingCell />
        ) : (
          <TextCell className="truncate" label={row.getValue("username")} />
        ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "email",
      header: "Email",
      cell: ({ row }) =>
        isPending ? (
          <LoadingCell />
        ) : (
          <TextCell
            className="truncate max-w-[250px]"
            label={row.getValue("email")}
          />
        ),
      enableColumnFilter: false,
    },
    {
      accessorKey: "role",
      header: "Rôle",
      cell: ({ row }) =>
        isPending ? (
          <LoadingCell />
        ) : (
          <RoleCell
            role={row.getValue("role")}
            isEditing={memberEditedRowId === row.original.id}
            onRoleChange={(value) => handleChange("role", value)}
          />
        ),
      enableColumnFilter: true,
    },
    {
      accessorKey: "createdAt",
      header: "Date de création",
      cell: ({ row }) =>
        isPending ? (
          <LoadingCell />
        ) : (
          <TextCell
            label={dayjs(row.getValue("createdAt")).format("DD/MM/YYYY")}
          />
        ),
      filterFn: (rows, columnIds, filterValue) => {
        const rowDate = dayjs(rows.getValue(columnIds));
        const today = dayjs();
        const filter = Array.isArray(filterValue)
          ? filterValue[0]
          : filterValue;

        if (!filter) return true;

        if (filter === "Aujourd'hui") {
          const dayStart = dayjs(today).startOf("day");
          return rowDate.isAfter(dayStart);
        }

        if (filter === "Cette semaine") {
          const weekStart = today.clone().startOf("week");
          return rowDate.isAfter(weekStart);
        }

        if (filter === "Ce mois") {
          const monthStart = today.clone().startOf("month");
          return rowDate.isAfter(monthStart);
        }

        if (filter === "Cette année") {
          const yearStart = today.clone().startOf("year");
          return rowDate.isAfter(yearStart);
        }

        if (filter.label === "Personnalisé") {
          const {
            range: { from, to },
          } = filterValue;
          if (from && to) {
            return rowDate.isBetween(dayjs(from), dayjs(to));
          }
          return false;
        }

        return false;
      },
      enableColumnFilter: true,
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const statut = row.getValue("status");
        const statutAffiche =
          statut && typeof statut === "string" ? statut : "Non défini";
        return isPending ? <LoadingCell /> : <TextCell label={statutAffiche} />;
      },
      filterFn: (rows, columnIds, filterValue) => {
        const rowStatut = rows.getValue(columnIds) as string;
        return rowStatut.toLowerCase().includes(filterValue.toLowerCase());
      },
      enableColumnFilter: false,
    },
    {
      id: "actions",
      cell: ({ row }) =>
        isPending ? (
          <LoadingCell />
        ) : (
          <ActionsCell
            disabled={isUnauthorized}
            row={row.original}
            isEditing={memberEditedRowId === row.original.id}
            onEdit={() => startEditing(row.original)}
            onSave={saveEditing}
            onCancel={handleCancelEdit}
            onDelete={() => handleDelete(row.original)}
          />
        ),
    },
  ];

  return (
    <>
      <DataTable
        data={
          isPending
            ? Array.from({ length: 10 }, () => ({} as User))
            : members || []
        }
        columns={columns}
        isError={isMemberError}
      />
      <DeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDelete={confirmDelete}
        siteName={selectedMemberName ?? undefined}
      />
    </>
  );
}
