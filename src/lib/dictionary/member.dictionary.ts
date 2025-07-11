export const roleErrorMessages: { [key: string]: string } = {
  "You can't change your own role":
    "Vous ne pouvez pas changer votre propre rôle",
  "You are not allowed to access to this role":
    "Vous n'avez pas les droits pour changer ce rôle",
  "An admin can't change another admin's role":
    "Vous ne pouvez pas changer le rôle d'un admin ou d'un super-admin",
  default: "Une erreur est survenue lors de la mise à jour du rôle du membre",
};

export const deleteErrorMessages: { [key: string]: string } = {
  "You can't delete yourself":
    "Pour supprimer votre compte, rendez-vous dans 'Mon compte'",
  "You are not allowed to delete a super-admin user":
    "Vous n'avez pas les droits pour supprimer un super-administrateur",
  "An admin can't delete another admin's account":
    "Vous ne pouvez pas supprimer un administrateur",
  default: "Une erreur est survenue lors de la suppression du membre",
};
