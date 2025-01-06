import { Button } from "@/components/ui/button";
import { ImageUpload } from "./campaign-form/ImageUpload";
import { FormFields } from "./campaign-form/FormFields";
import { useCreateCampaign } from "./campaign-form/useCreateCampaign";

export function CreateCampaignForm() {
  const {
    register,
    handleSubmit,
    errors,
    setValue,
    isLoading,
    previewImage,
    handleImageChange,
    onSubmit,
  } = useCreateCampaign();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormFields
        register={register}
        errors={errors}
        setValue={setValue}
      />

      <ImageUpload
        previewImage={previewImage}
        onImageChange={handleImageChange}
        register={register}
      />

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create Campaign"}
      </Button>
    </form>
  );
}