import { Campaign } from "@/types/campaign";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Heart } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EditCampaignForm } from "./EditCampaignForm";
import { ContributeForm } from "./ContributeForm";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface CampaignCardProps {
  campaign: Campaign;
  onClick?: () => void;
  onDelete?: (id: string) => void;
  onUpdate?: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onClick, onDelete, onUpdate }: CampaignCardProps) {
  const progress = (campaign.currentAmount / campaign.targetAmount) * 100;
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = () => {
    if (onDelete) {
      onDelete(campaign.id);
      toast({
        title: "Campaign Deleted",
        description: "The campaign has been successfully deleted.",
      });
    }
  };

  const handleUpdate = (updatedCampaign: Campaign) => {
    if (onUpdate) {
      onUpdate(updatedCampaign);
      toast({
        title: "Campaign Updated",
        description: "The campaign has been successfully updated.",
      });
    }
  };

  const handleContributeSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    toast({
      title: "Thank you!",
      description: "Your contribution has been received.",
    });
  };

  return (
    <Card className="w-full hover:shadow-lg transition-shadow">
      <div onClick={onClick}>
        {campaign.imageUrl && (
          <div className="w-full h-48 relative overflow-hidden rounded-t-lg">
            <img 
              src={campaign.imageUrl} 
              alt={campaign.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6';
              }}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="text-lg font-bold">{campaign.title}</CardTitle>
          <p className="text-sm text-muted-foreground">by {campaign.organizerName}</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-4 line-clamp-2">{campaign.description}</p>
          <Progress value={progress} className="h-2" />
          <div className="mt-2 flex justify-between text-sm">
            <span>UGX {campaign.currentAmount.toLocaleString()}</span>
            <span className="text-muted-foreground">
              {progress.toFixed(0)}% of UGX {campaign.targetAmount.toLocaleString()}
            </span>
          </div>
        </CardContent>
      </div>
      <CardFooter className="flex justify-between items-center">
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <span>{campaign.location}</span>
          <span>•</span>
          <span>{campaign.category}</span>
        </div>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="default">
                <Heart className="h-4 w-4 mr-2" />
                Contribute
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Contribute to {campaign.title}</DialogTitle>
              </DialogHeader>
              <ContributeForm 
                campaignId={campaign.id} 
                onSuccess={handleContributeSuccess}
              />
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Campaign</DialogTitle>
              </DialogHeader>
              <EditCampaignForm campaign={campaign} onSubmit={handleUpdate} />
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this campaign? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}