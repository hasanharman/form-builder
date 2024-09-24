import { FormField } from "@/types";
import React from "react";

const generateCodeSnippet = (field: FormField) => {
  switch (field.type) {
    case "Checkbox":
      return `
  <FormField
    control={form.control}
    name="${field.label}"
    render={({ field }) => (
      <FormItem>
        <FormControl>
          <Checkbox
            id="${field.label}"
            checked={field.value}
            {...field}
            disabled={${field.disabled}}
          />
        </FormControl>
        <FormLabel htmlFor="${field.label}">${field.label}</FormLabel>
      </FormItem>
    )}
  />`;

    case "Input":
      return `
  <FormField
    control={form.control}
    name="${field.label}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${field.label}</FormLabel>
        <FormControl>
          <Input
            id="${field.label}"
            placeholder="${field.placeholder}"
            disabled={${field.disabled}}
            {...field}
          />
        </FormControl>
      </FormItem>
    )}
  />`;

    case "Textarea":
      return `
  <FormField
    control={form.control}
    name="${field.label}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${field.label}</FormLabel>
        <FormControl>
          <Textarea
            id="${field.label}"
            placeholder="${field.placeholder}"
            disabled={${field.disabled}}
            {...field}
          />
        </FormControl>
      </FormItem>
    )}
  />`;

    case "Slider":
      return `
  <FormField
    control={form.control}
    name="${field.label}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${field.label}</FormLabel>
        <FormControl>
          <Slider
            value={field.value || 50}
            max={100}
            step={1}
            onChange={field.onChange}
            disabled={${field.disabled}}
          />
        </FormControl>
      </FormItem>
    )}
  />`;

    case "DatePicker":
      return `
  <FormField
    control={form.control}
    name="${field.label}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${field.label}</FormLabel>
        <FormControl>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {field.value ? format(new Date(field.value), "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Calendar selected={field.value ? new Date(field.value) : undefined} />
            </PopoverContent>
          </Popover>
        </FormControl>
      </FormItem>
    )}
  />`;

    case "Select":
      return `
  <FormField
    control={form.control}
    name="${field.label}"
    render={({ field }) => (
      <FormItem>
        <FormLabel>${field.label}</FormLabel>
        <FormControl>
          <Select onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="${field.placeholder}" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="option1">Option 1</SelectItem>
              <SelectItem value="option2">Option 2</SelectItem>
            </SelectContent>
          </Select>
        </FormControl>
      </FormItem>
    )}
  />`;

    default:
      return null;
  }
};

export default function GenerateCodeFields() {
  return <div>index</div>;
}
