"use client";

import { cn } from "@/lib/utils";
import { Trash2, Upload, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Badge } from "./badge";
import { Button } from "./button";

interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number;
  size?: "default" | "icon";
  accept?: Record<string, string[]>;
}

export const FileUpload = ({
  value = [],
  onChange,
  maxFiles = 5,
  maxSize = 10,
  size = "default",
  accept,
}: FileUploadProps) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      if (fileRejections.length > 0) {
        const tooManyFiles = fileRejections.some((rej) =>
          rej.errors.find((err) => err.code === "too-many-files")
        );
        if (tooManyFiles) {
          toast.error(
            `Vous ne pouvez pas dépasser le maximum de ${maxFiles} fichiers.`,
            { duration: 3000 }
          );
          return;
        }
      }

      const validFiles = acceptedFiles.filter((file) => {
        const isValidSize = file.size <= maxSize * 1024 * 1024; // Convert Mo to bytes

        if (!isValidSize) {
          toast.error(
            `Le fichier ${file.name} dépasse la taille maximale de ${maxSize} Mo`,
            {
              duration: 3000,
            }
          );
          return false;
        }
        return true;
      });

      let newFiles =
        maxFiles === 1
          ? validFiles
          : [...value, ...validFiles].slice(0, maxFiles);

      onChange?.(newFiles);
      if (size === "icon") handleImageChange(newFiles);
    },
    [value, maxFiles, maxSize, onChange]
  );

  const removeFile = (fileToRemove: File) => {
    const newFiles = value.filter((file) => file !== fileToRemove);
    onChange?.(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    maxFiles,
    accept,
    noClick: false,
    noKeyboard: false,
  });

  useEffect(() => {
    if (size === "icon" && value.length > 0) {
      handleImageChange(value);
    } else {
      setImagePreview(null);
    }
  }, [value, size]);

  const handleImageChange = (files: File[] | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="relative h-full">
      <div
        className={cn(
          size === "icon"
            ? "flex items-center justify-center rounded-full size-28 border-secondary"
            : "flex h-full flex-col items-center justify-center rounded-xl border-secondary-400 gap-2",
          "cursor-pointer border-2 border-dashed bg-primary-100 p-4",
          isDragActive && "bg-primary-100/80"
        )}
        {...getRootProps()}
        onClick={() => {
          if (value.length < maxFiles) open();
        }}
      >
        <input type="file" {...getInputProps()} />
        <Upload
          size={40}
          className={cn(
            size === "icon" ? "text-secondary" : "text-secondary-400"
          )}
        />
        {size === "icon" && value.length > 0 && imagePreview && (
          <>
            <Button
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                removeFile(value[0]);
                setImagePreview(null);
              }}
              className="absolute right-0 top-0 z-50 rounded-full hover:text-error-foreground [&_svg]:size-5"
            >
              <Trash2 />
            </Button>
            <Image
              src={imagePreview}
              alt="Aperçu de l'image"
              className="absolute inset-0 size-full rounded-full object-cover"
              width={112}
              height={112}
            />
          </>
        )}
        {size === "default" && (
          <>
            {value.length < maxFiles ? (
              <>
                <p className="pt-3">
                  <span className="underline">Cliquez pour importer</span> ou
                  glissez-déposez
                </p>
                <p className="text-sm">
                  Taille maximale par fichier : {maxSize}Mo
                </p>
              </>
            ) : (
              <p className="pt-3 text-sm font-medium text-muted-foreground">
                Max {maxFiles} fichiers atteints
              </p>
            )}
            {value.length > 0 && (
              <div className="flex w-full max-w-2xl flex-wrap items-center justify-center gap-3">
                {value.map((file, index) => (
                  <Badge key={index} className="space-x-2">
                    <span className="max-w-[150px] truncate">{file.name}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeFile(file);
                      }}
                      className="size-7"
                    >
                      <X strokeWidth={3} />
                    </Button>
                  </Badge>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
