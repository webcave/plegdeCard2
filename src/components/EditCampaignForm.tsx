import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Campaign } from '@/types/campaign';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { FormFields } from './campaign-form/FormFields';
import { ImageUpload } from './campaign-form/ImageUpload';

interface EditCampaignFormProps {
  campaign: Campaign;
  onClose: () => void;
}

export function EditCampaignForm({ campaign, onClose }: EditCampaignFormProps) {
  const [formData, setFormData] = useState({
    title: campaign.title,
    description: campaign.description,
    targetAmount: campaign.targetAmount.toString(),
    location: campaign.location,
    category: campaign.category,
    image: campaign.imageUrl,
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (imageUrl: string) => {
    setFormData((prev) => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await api.campaigns.update(campaign.id, {
        ...formData,
        targetAmount: parseFloat(formData.targetAmount),
      });

      queryClient.invalidateQueries(['campaigns']);
      toast({
        title: 'Success',
        description: 'Campaign updated successfully',
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update campaign',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormFields
        formData={formData}
        handleInputChange={handleInputChange}
      />
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Campaign Image</label>
        <ImageUpload
          currentImage={formData.image}
          onImageUploaded={handleImageChange}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Updating...' : 'Update Campaign'}
        </Button>
      </div>
    </form>
  );
}