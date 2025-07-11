import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

type RoleCellProps = {
  role: string;
  isEditing?: boolean;
  onRoleChange?: (value: string) => void;
};

const getRoleButton = (role: string) => {
  switch (role) {
    case "SUPER_ADMIN":
      return (
        <Button
          size="sm"
          className="bg-primary-400 text-sm hover:bg-primary-400/80"
        >
          Super-administrateur
        </Button>
      );
    case "ADMIN":
      return (
        <Button
          size="sm"
          className="bg-tertiary-300 text-sm hover:bg-tertiary-300/80"
        >
          Administrateur
        </Button>
      );
    case "EDITOR":
      return (
        <Button
          size="sm"
          className="bg-tertiary-100 text-sm hover:bg-tertiary-100/80"
        >
          Éditeur
        </Button>
      );
    case "READER":
      return (
        <Button
          size="sm"
          className="bg-secondary-400 text-sm hover:bg-secondary-400/80"
        >
          Lecteur
        </Button>
      );
    default:
      return (
        <Button
          size="sm"
          className="bg-secondary-400 text-sm hover:bg-secondary-400/80"
        >
          Non défini
        </Button>
      );
  }
};

const RoleCell = ({ role, isEditing, onRoleChange }: RoleCellProps) => {
  const [selectedRole, setSelectedRole] = useState<string>(role);

  if (!isEditing) {
    return <div>{getRoleButton(role)}</div>;
  }

  const handleRoleChange = (value: string) => {
    setSelectedRole(value);
    onRoleChange?.(value);
  };

  return (
    <div className="flex items-center space-x-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          {getRoleButton(selectedRole)}
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-auto">
          <DropdownMenuLabel>Rôle</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={selectedRole}
            onValueChange={handleRoleChange}
          >
            <DropdownMenuRadioItem value="ADMIN">
              Administrateur
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="EDITOR">
              Éditeur
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="READER">
              Lecteur
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default RoleCell;
