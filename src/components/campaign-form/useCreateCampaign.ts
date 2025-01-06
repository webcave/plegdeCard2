import { useState } from "react";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

interface CreateCampaignFormData {
  title: string;
  description: string;
  targetAmount: number;
  organizerName: string;
  organizerContact: string;
  location: string;
  category: string;
  image?: FileList;
}

export function useCreateCampaign() {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<CreateCampaignFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateCampaignCode = () => {
    const prefix = Math.random().toString(36).substring(2, 4).toUpperCase();
    const numbers = Math.random().toString().substring(2, 6);
    return `${prefix}${numbers}`;
  };

  const onSubmit = async (data: CreateCampaignFormData) => {
    setIsLoading(true);
    try {
      const campaignData = {
        title: data.title,
        description: data.description,
        targetAmount: Number(data.targetAmount),
        organizerName: data.organizerName,
        organizerContact: data.organizerContact,
        location: data.location,
        category: data.category,
        code: generateCampaignCode(),
        imageUrl: previewImage || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6', // Default image if none provided
      };

      await api.campaigns.create(campaignData);
      
      toast({
        title: "Success",
        description: "Campaign created successfully",
      });
      
      reset();
      setPreviewImage(null);
      navigate('/');
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    register,
    handleSubmit,
    errors,
    setValue,
    isLoading,
    previewImage,
    handleImageChange,
    onSubmit,
  };
}