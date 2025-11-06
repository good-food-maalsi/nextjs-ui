"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useDeleteYourself } from "@/app/dashboard/(dashboard-layout)/membres/_hooks/use-delete-members";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { useUpdateUserPicture } from "@/hooks/use-update-user-picture";
import { userFormSchema } from "@/lib/schemas/user.schema";
import { sessionStore } from "@/lib/session/session-store";
import type { UserForm } from "@/lib/types/user.types";

import { BASE_URL } from "../lib/constants/global.constants";
import { authService } from "../services/auth.service";
import { EditEmailDialog } from "./edit-email-dialog";
import { EditPasswordDialog } from "./edit-password-dialog";
import { EditUsernameDialog } from "./edit-username-dialog";
import { Tabs, TabsContent } from "./ui/tabs";

interface AccountSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

async function fetchImageAsFile(url: string): Promise<File> {
  const response = await fetch(`${BASE_URL}/${url}`);
  if (!response.ok) {
    throw new Error("Erreur lors du téléchargement de l'image");
  }
  const blob = await response.blob();
  return new File([blob], "profile-picture.png", {
    type: blob.type,
    lastModified: Date.now(),
  });
}

export function AccountSettingsDialog({
  open,
  onOpenChange,
}: AccountSettingsDialogProps) {
  const session = sessionStore.get();

  const { mutate: updateUserPicture } = useUpdateUserPicture();

  const [activeDialog, setActiveDialog] = useState<
    "username" | "email" | "password" | "delete" | null
  >(null);

  const form = useForm<UserForm>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      username: session.username || "",
      email: session.email || "",
      profilePicture: [],
    },
  });
  useEffect(() => {
    if (session.picture && !form.getValues("profilePicture")?.length) {
      const pictureUrl = session.picture;
      if (pictureUrl) {
        fetchImageAsFile(pictureUrl)
          .then((file) => {
            form.setValue("profilePicture", [file]);
          })
          .catch((error) => {
            console.error("Erreur lors de la conversion de l'image :", error);
          });
      }
    }
  }, [session.picture, form]);

  const router = useRouter();

  const { mutate } = useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      router.push("/login");
    },
    onError: () => {
      toast.error("Une erreur est survenue lors de la déconnexion");
    },
  });

  const { mutate: deleteMember } = useDeleteYourself();

  const handleDeleteAccount = () => {
    if (session.sub) {
      deleteMember(
        { id: session.sub },
        {
          onSuccess: () => {
            mutate();
          },
        }
      );
      setActiveDialog(null);
    }
  };

  const handleFileUploadChange = (files: File[]) => {
    if (files.length > 0 && files[0].name.startsWith("http")) {
      form.setValue("pictureUrl", session.picture || "");
    }
    form.setValue("profilePicture", files);
  };

  const handleUpdateProfilePicture = () => {
    const profilePicture = form.getValues("profilePicture");

    if (profilePicture && profilePicture.length > 0) {
      updateUserPicture({ file: profilePicture[0], id: session.sub || "" });
    } else {
      toast.error("Aucune photo sélectionnée !");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="space-y-3 sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-4xl font-medium">
              Mon compte
            </DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-start gap-6 sm:flex-row flex-col">
                  <FileUpload
                    value={form.watch("profilePicture")}
                    onChange={handleFileUploadChange}
                    size="icon"
                    accept={{ "image/*": [".jpg", ".jpeg", ".png"] }}
                    maxFiles={1}
                    maxSize={0.5}
                  />
                  <div className="space-y-3">
                    <h3 className="font-medium text-secondary">
                      Uploader une nouvelle photo
                    </h3>
                    <p className="text-sm">
                      Cliquez pour importer ou glissez-déposez dans le cercle en
                      pointillés.
                      <br />
                      Taille maximale du fichier : 500ko.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {form.watch("profilePicture")?.length === 0
                        ? "Aucun fichier sélectionné"
                        : "Fichier sélectionné"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="secondaryOutline"
                  size="sm"
                  onClick={handleUpdateProfilePicture}
                  disabled={form.watch("profilePicture")?.length === 0}
                >
                  Mettre à jour la photo de profil
                </Button>
                <Separator className="bg-secondary-400" />
              </div>
              <Tabs defaultValue="informations" className="space-y-10">
                {/* <div className="flex justify-center">
                  <TabsList className="h-auto p-1.5">
                    <TabsTrigger
                      className="px-3 py-1.5 hover:text-accent-foreground"
                      value="informations"
                    >
                      Informations du compte
                    </TabsTrigger>
                    <TabsTrigger
                      className="px-3 py-1.5 hover:text-accent-foreground"
                      value="notifications"
                    >
                      Gestion des notifications
                    </TabsTrigger>
                  </TabsList>
                </div> */}
                <TabsContent value="informations">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">Nom d’utilisateur</h3>
                        <p className="text-sm">{session.username}</p>
                      </div>
                      <Button
                        variant="secondaryOutline"
                        size="sm"
                        onClick={() => setActiveDialog("username")}
                      >
                        Changer de nom d’utilisateur
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">Email</h3>
                        <p className="text-sm">{session.email}</p>
                      </div>
                      <Button
                        variant="secondaryOutline"
                        size="sm"
                        onClick={() => setActiveDialog("email")}
                      >
                        Changer d’adresse e-mail
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h3 className="font-medium">Mot de passe</h3>
                        <p className="text-sm text-muted-foreground">
                          Modifiez votre mot de passe pour vous connecter à
                          votre compte
                        </p>
                      </div>
                      <Button
                        variant="secondaryOutline"
                        size="sm"
                        onClick={() => setActiveDialog("password")}
                      >
                        Modifier le mot de passe
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <Button
                          variant="ghost"
                          className="text-error-foreground p-0 h-auto bg-transparent shadow-none hover:bg-transparent hover:text-error-foreground"
                          onClick={() => setActiveDialog("delete")}
                        >
                          <span className="cursor-pointer">
                            Supprimer mon compte
                          </span>
                        </Button>
                        <p className="text-sm text-muted-foreground">
                          Vous supprimez définitivement le compte ainsi que
                          l'accès au tableau de bord
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setActiveDialog("delete")}
                      >
                        <ChevronRight />
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="notifications"></TabsContent>
              </Tabs>
            </div>
          </Form>
        </DialogContent>
      </Dialog>
      <EditUsernameDialog
        open={activeDialog === "username"}
        onOpenChange={(open) => setActiveDialog(open ? "username" : null)}
        initialValue={session.username || ""}
        userId={session.sub || ""}
      />
      <EditEmailDialog
        open={activeDialog === "email"}
        onOpenChange={(open) => setActiveDialog(open ? "email" : null)}
        initialValue={session.email || ""}
        userId={session.sub || ""}
      />
      <EditPasswordDialog
        open={activeDialog === "password"}
        onOpenChange={(open) => setActiveDialog(open ? "password" : null)}
        userId={session.sub || ""}
      />
      {activeDialog === "delete" && (
        <Dialog open={true} onOpenChange={() => setActiveDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirmer la suppression</DialogTitle>
            </DialogHeader>
            <p>
              Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est
              irréversible.
            </p>
            <div className="flex justify-end space-x-4">
              <Button
                variant="secondaryOutline"
                onClick={() => setActiveDialog(null)}
              >
                Annuler
              </Button>
              <Button onClick={handleDeleteAccount}>Supprimer</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
