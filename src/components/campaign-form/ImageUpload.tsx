import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ImageUploadProps {
  previewImage: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  register: any;
}

export function ImageUpload({ previewImage, onImageChange, register }: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => document.getElementById("campaign-image")?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          Upload Image
        </Button>
        <Input
          id="campaign-image"
          type="file"
          accept="image/*"
          className="hidden"
          {...register("image")}
          onChange={onImageChange}
        />
      </div>
      {previewImage && (
        <div className="relative w-full h-40">
          <img
            src={previewImage}
            alt="Campaign preview"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      )}
    </div>
  );
}