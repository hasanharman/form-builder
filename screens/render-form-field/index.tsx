import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { PasswordInput } from "@/components/ui/password-input";
import { PhoneInput } from "@/components/ui/phone-input";

type FormField = {
  type: string;
  label: string;
  value?: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
};

export const renderFormField = (field: FormField) => {
  switch (field.type) {
    case "Checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={field.label} />
          <Label htmlFor={field.label}>{field.label}</Label>
        </div>
      );
    case "Combobox":
      // Simplified combobox for preview
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
        </Select>
      );
    case "DatePicker":
      return (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-start text-left font-normal"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {field.value ? (
                format(new Date(field.value), "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={field.value ? new Date(field.value) : undefined}
            />
          </PopoverContent>
        </Popover>
      );
    case "FileInput":
      return <Input type="file" />;
    case "Input":
      return <Input />;
    case "InputOTP":
      return (
        <InputOTP maxLength={6}>
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
        </InputOTP>
      );
    case "Select":
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select an option" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="option1">Option 1</SelectItem>
            <SelectItem value="option2">Option 2</SelectItem>
            <SelectItem value="option3">Option 3</SelectItem>
          </SelectContent>
        </Select>
      );
    case "Slider":
      return <Slider defaultValue={[50]} max={100} step={1} />;
    case "Switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch id={field.label} />
          <Label htmlFor={field.label}>{field.label}</Label>
        </div>
      );
    case "Textarea":
      return <Textarea />;
    case "Password":
      return <PasswordInput />;
    case "Phone":
      return <PhoneInput />;
    case "Tags":
      // Simplified tags input for preview
      return <Input placeholder="Enter tags..." />;
    case "Multi Select":
      // Simplified multi-select for preview
      return (
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select multiple..." />
          </SelectTrigger>
        </Select>
      );
    default:
      return null;
  }
};
