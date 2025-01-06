import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Campaign } from "@/types/campaign";
import { Upload } from "lucide-react";

interface EditCampaignFormProps {
  campaign: Campaign;
  onSubmit: (campaign: Campaign) => void;
}

export function EditCampaignForm({ campaign, onSubmit }: EditCampaignFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<Campaign>({
    defaultValues: campaign
  });
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(campaign.imageUrl || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data: Campaign) => {
    setIsLoading(true);
    try {
      const updatedCampaign = {
        ...data,
        imageUrl: previewImage || data.imageUrl,
        updatedAt: new Date().toISOString(),
      };
      onSubmit(updatedCampaign);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Campaign Title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          placeholder="Campaign Description"
          {...register("description", { required: "Description is required" })}
        />
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Input
          type="number"
          placeholder="Target Amount (UGX)"
          {...register("targetAmount", { 
            required: "Target amount is required",
            min: { value: 10000, message: "Minimum amount is 10,000 UGX" }
          })}
        />
        {errors.targetAmount && (
          <p className="text-sm text-red-500">{errors.targetAmount.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Location"
          {...register("location", { required: "Location is required" })}
        />
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Category"
          {...register("category", { required: "Category is required" })}
        />
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={() => document.getElementById("campaign-image-edit")?.click()}
          >
            <Upload className="mr-2 h-4 w-4" />
            Change Image
          </Button>
          <Input
            id="campaign-image-edit"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Updating..." : "Update Campaign"}
      </Button>
    </form>
  );
}