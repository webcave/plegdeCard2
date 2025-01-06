import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { CampaignCard } from "@/components/CampaignCard";
import { CreateCampaignForm } from "@/components/CreateCampaignForm";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Campaign } from "@/types/campaign";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Header } from "@/components/Header";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

const categories = ["All", "Education", "Healthcare", "Agriculture", "Technology", "Community"];
const locations = ["All", "Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu"];

const Index = () => {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: api.campaigns.list,
    refetchInterval: 2000, // Refetch every 2 seconds
    staleTime: 0, // Consider data stale immediately
  });

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesCategory = selectedCategory === "All" || campaign.category === selectedCategory;
    const matchesLocation = selectedLocation === "All" || campaign.location === selectedLocation;
    const matchesSearch = campaign.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      campaign.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesLocation && matchesSearch;
  });

  const handleCreateSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['campaigns'] });
    toast({
      title: "Success!",
      description: "Campaign created successfully.",
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Campaigns</h1>
          <div className="flex items-center gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Create Campaign</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                </DialogHeader>
                <CreateCampaignForm onSuccess={handleCreateSuccess} />
              </DialogContent>
            </Dialog>
            {user?.isAdmin && (
              <Link to="/admin/settings">
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-[1fr_200px_200px] mb-8">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCampaigns.map((campaign) => (
            <CampaignCard key={campaign.id} campaign={campaign} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;