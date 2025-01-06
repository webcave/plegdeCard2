import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSettings } from "@/contexts/SettingsContext";

interface FormFieldsProps {
  register: any;
  errors: any;
  setValue: any;
}

export function FormFields({ register, errors, setValue }: FormFieldsProps) {
  const { categories, locations } = useSettings();

  return (
    <>
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
          placeholder="Organizer Name"
          {...register("organizerName", { required: "Organizer name is required" })}
        />
        {errors.organizerName && (
          <p className="text-sm text-red-500">{errors.organizerName.message}</p>
        )}
      </div>

      <div>
        <Input
          placeholder="Contact Number"
          {...register("organizerContact", { 
            required: "Contact number is required",
            pattern: {
              value: /^[0-9]{10}$/,
              message: "Please enter a valid phone number"
            }
          })}
        />
        {errors.organizerContact && (
          <p className="text-sm text-red-500">{errors.organizerContact.message}</p>
        )}
      </div>

      <div>
        <Select onValueChange={(value) => setValue("location", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent>
            {locations.map((location) => (
              <SelectItem key={location} value={location}>
                {location}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.location && (
          <p className="text-sm text-red-500">{errors.location.message}</p>
        )}
      </div>

      <div>
        <Select onValueChange={(value) => setValue("category", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <p className="text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>
    </>
  );
}