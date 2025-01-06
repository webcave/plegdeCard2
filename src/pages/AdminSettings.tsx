import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api";
import { Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ItemFormProps {
  onSubmit: (data: { name: string; description?: string }) => Promise<void>;
  title: string;
}

function ItemForm({ onSubmit, title }: ItemFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onSubmit({ name, description });
      setName("");
      setDescription("");
      toast({
        title: "Success",
        description: `${title} created successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to create ${title.toLowerCase()}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </Button>
    </form>
  );
}

interface ItemListProps {
  items: Array<{ id: string; name: string; description?: string }>;
  onDelete: (id: string) => Promise<void>;
  title: string;
}

function ItemList({ items, onDelete, title }: ItemListProps) {
  const { toast } = useToast();

  const handleDelete = async (id: string) => {
    try {
      await onDelete(id);
      toast({
        title: "Success",
        description: `${title} deleted successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to delete ${title.toLowerCase()}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg">{item.name}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </div>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete {title}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this {title.toLowerCase()}? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(item.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function ContributionsSection() {
  const { data: contributions = [] } = useQuery({
    queryKey: ["contributions"],
    queryFn: api.contributions.list,
  });

  return (
    <section className="col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Contributions</h2>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Contributor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Message</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map((contribution) => (
                <TableRow key={contribution.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{contribution.campaign.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {contribution.campaign.code}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{contribution.name}</TableCell>
                  <TableCell>
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'UGX'
                    }).format(contribution.amount)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div>{contribution.email}</div>
                      <div className="text-sm text-muted-foreground">
                        {contribution.phoneNumber}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    }).format(new Date(contribution.createdAt))}
                  </TableCell>
                  <TableCell className="max-w-xs truncate">
                    {contribution.message}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

function UsersSection() {
  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: api.users.list,
  });

  return (
    <section className="col-span-2">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Users</h2>
      </div>
      <div className="space-y-4">
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset">
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Intl.DateTimeFormat('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short'
                    }).format(new Date(user.createdAt!))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}

export function AdminSettings() {
  const queryClient = useQueryClient();
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: api.categories.list,
  });
  const { data: locations = [] } = useQuery({
    queryKey: ["locations"],
    queryFn: api.locations.list,
  });

  const handleCreateCategory = async (data: { name: string; description?: string }) => {
    await api.categories.create(data);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleCreateLocation = async (data: { name: string; description?: string }) => {
    await api.locations.create(data);
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };

  const handleDeleteCategory = async (id: string) => {
    await api.categories.delete(id);
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  };

  const handleDeleteLocation = async (id: string) => {
    await api.locations.delete(id);
    queryClient.invalidateQueries({ queryKey: ["locations"] });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          <h1 className="text-3xl font-bold">Admin Settings</h1>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Categories Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Categories</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Category</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Category</DialogTitle>
                    </DialogHeader>
                    <ItemForm onSubmit={handleCreateCategory} title="Category" />
                  </DialogContent>
                </Dialog>
              </div>
              <ItemList
                items={categories}
                onDelete={handleDeleteCategory}
                title="Category"
              />
            </section>

            {/* Locations Section */}
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Locations</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>Add Location</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Location</DialogTitle>
                    </DialogHeader>
                    <ItemForm onSubmit={handleCreateLocation} title="Location" />
                  </DialogContent>
                </Dialog>
              </div>
              <ItemList
                items={locations}
                onDelete={handleDeleteLocation}
                title="Location"
              />
            </section>

            {/* Users Section */}
            <UsersSection />

            {/* Contributions Section */}
            <ContributionsSection />
          </div>
        </div>
      </main>
    </div>
  );
}