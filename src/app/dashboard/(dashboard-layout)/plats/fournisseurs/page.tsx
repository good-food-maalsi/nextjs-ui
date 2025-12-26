"use client";

import React from "react";

import { Button } from "@/components/ui/button";
import { PageHeaderActions } from "@/components/ui/page-header-actions";
import { SuppliersDataTable } from "./_components/suppliers-data-table";
import { createColumns, type Fournisseur } from "./_components/columns";
import { SupplierFormDialog } from "./_components/supplier-form-dialog";
import { DeleteSupplierDialog } from "./_components/delete-supplier-dialog";
import { useSuppliers } from "@/hooks/use-suppliers";
import type { Supplier } from "@/lib/types/supplier.types";

function mapSupplierToFournisseur(supplier: Supplier): Fournisseur {
  return {
    id: supplier.id,
    nom: supplier.name,
    adresse:
      supplier.latitude && supplier.longitude
        ? `${supplier.latitude.toFixed(4)}, ${supplier.longitude.toFixed(4)}`
        : "Position non définie",
    telephone: supplier.phone,
    email: supplier.email,
    logo_url: supplier.logo_url,
  };
}

export default function FournisseursPage() {
  const [page] = React.useState(1);
  const [limit] = React.useState(100);
  const [search] = React.useState("");

  const { data, isLoading, isError } = useSuppliers({ page, limit, search });

  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [selectedSupplier, setSelectedSupplier] =
    React.useState<Supplier | null>(null);

  const handleEdit = (fournisseur: Fournisseur) => {
    const supplier = data?.data.find((s) => s.id === fournisseur.id);
    if (supplier) {
      setSelectedSupplier(supplier);
      setEditDialogOpen(true);
    }
  };

  const handleDelete = (fournisseur: Fournisseur) => {
    const supplier = data?.data.find((s) => s.id === fournisseur.id);
    if (supplier) {
      setSelectedSupplier(supplier);
      setDeleteDialogOpen(true);
    }
  };

  const fournisseurs: Fournisseur[] =
    data?.data.map(mapSupplierToFournisseur) ?? [];

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Fournisseurs</h1>
        </div>

        <PageHeaderActions>
          <Button variant="secondaryOutline" size="sm">
            Importer
          </Button>
          <Button variant="secondaryOutline" size="sm">
            Exporter
          </Button>
          <Button
            variant="secondaryOutline"
            size="sm"
            onClick={() => setCreateDialogOpen(true)}
          >
            Ajouter un fournisseur
          </Button>
        </PageHeaderActions>
      </div>

      <SuppliersDataTable
        columns={createColumns}
        data={fournisseurs}
        isLoading={isLoading}
        isError={isError}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <SupplierFormDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />

      <SupplierFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        supplier={selectedSupplier || undefined}
      />

      <DeleteSupplierDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        supplier={selectedSupplier}
      />
    </div>
  );
}
