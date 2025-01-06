import { useState } from 'react';
import { Campaign } from '@/types/campaign';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ContributeForm } from './ContributeForm';
import { EditCampaignForm } from './EditCampaignForm';
import { useAuth } from '@/contexts/AuthContext';

interface CampaignCardProps {
  campaign: Campaign;
}

export function CampaignCard({ campaign }: CampaignCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { user } = useAuth();

  // Set default values and handle undefined
  const raisedAmount = campaign?.raisedAmount || 0;
  const targetAmount = campaign?.targetAmount || 0;
  const progress = targetAmount > 0 ? (raisedAmount / targetAmount) * 100 : 0;
  const isOwner = user?.id === campaign?.creatorId;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="relative h-48 mb-4">
          <img
            src={campaign?.imageUrl || '/placeholder.svg'}
            alt={campaign?.title || 'Campaign'}
            className="absolute inset-0 w-full h-full object-cover rounded-md"
          />
        </div>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{campaign?.title || 'Untitled Campaign'}</CardTitle>
          {isOwner && (
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Edit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <EditCampaignForm
                  campaign={campaign}
                  onClose={() => setIsEditOpen(false)}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600">{campaign?.description || 'No description available'}</p>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <Progress value={progress} />
          <div className="flex justify-between text-sm">
            <span>Raised: {raisedAmount.toLocaleString()} UGX</span>
            <span>Goal: {targetAmount.toLocaleString()} UGX</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 text-sm">
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {campaign?.category || 'Uncategorized'}
          </span>
          <span className="px-2 py-1 bg-gray-100 rounded-full">
            {campaign?.location || 'No location'}
          </span>
        </div>
      </CardContent>

      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full">Contribute</Button>
          </DialogTrigger>
          <DialogContent>
            <ContributeForm campaign={campaign} />
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}