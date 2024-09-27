import { FormFieldType } from "@/types";

export const generateCodeSnippet = (field: FormFieldType) => {
  switch (field.type) {
    case "Checkbox":
      return `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  ${field.required ? "required" : ""}
                  ${field.disabled ? "disabled" : ""}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>${field.label}</FormLabel>
                ${
                  field.description &&
                  `<FormDescription>${field.description}</FormDescription>`
                }
                <FormMessage />
              </div>
            </FormItem>
          )}
        />`;
    case "Combobox":
      return `<FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>${field.label}</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                      ${field.required ? "required" : ""}
                      ${field.disabled ? "disabled" : ""}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandList>
                      <CommandEmpty>No language found.</CommandEmpty>
                      <CommandGroup>
                        {languages.map((language) => (
                          <CommandItem
                            value={language.label}
                            key={language.value}
                            onSelect={() => {
                              form.setValue("${field.name}", language.value);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                language.value === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {language.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              ${
                field.description &&
                `<FormDescription>${field.description}</FormDescription>`
              }
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "DatePicker":
      return `
      <FormField
      control={form.control}
      name="${field.name}"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>${field.label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
              />
            </PopoverContent>
          </Popover>
       ${
         field.description &&
         `<FormDescription>${field.description}</FormDescription>`
       }
          <FormMessage />
        </FormItem>
      )}
    />`;
    case "Input":
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Input 
                placeholder="${field.placeholder}"
                ${field.required ? "required" : ""}
                ${field.disabled ? "disabled" : ""}
                {...field} />
              </FormControl>
              ${
                field.description &&
                `<FormDescription>${field.description}</FormDescription>`
              }
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "InputOTP":
      return `
       <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                  </InputOTPGroup>
                  <InputOTPSeparator />
                  <InputOTPGroup>
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              ${
                field.description &&
                `<FormDescription>${field.description}</FormDescription>`
              }
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "Select":
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="${field.placeholder}" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="m@example.com">m@example.com</SelectItem>
                  <SelectItem value="m@google.com">m@google.com</SelectItem>
                  <SelectItem value="m@support.com">m@support.com</SelectItem>
                </SelectContent>
              </Select>
                ${
                  field.description &&
                  `<FormDescription>${field.description}</FormDescription>`
                }
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "Switch":
      return `
          <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel>${field.label}</FormLabel>
                    ${
                      field.description &&
                      `<FormDescription>${field.description}</FormDescription>`
                    }
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled
                      aria-readonly
                    />
                  </FormControl>
                </FormItem>
              )}
            />`;
    case "Textarea":
      return `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="${field.placeholder}"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              ${
                field.description &&
                `<FormDescription>${field.description}</FormDescription>`
              }
              <FormMessage />
            </FormItem>
          )}
        />`;
    case "FileInput":
      return `
            <FormField
              control={form.control}
              name="${field.name}"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>${field.label}</FormLabel>
                  <FormControl>
                    <FileUploader
                      value={files}
                      onValueChange={setFiles}
                      dropzoneOptions={dropZoneConfig}
                      className="relative bg-background rounded-lg p-2"
                    >
                      <FileInput
                        id="fileInput"
                        className="outline-dashed outline-1 outline-slate-500"
                      >
                        <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                          <CloudUpload />
                        </div>
                      </FileInput>
                      <FileUploaderContent>
                        {files &&
                          files.length > 0 &&
                          files.map((file, i) => (
                            <FileUploaderItem key={i} index={i}>
                              <Paperclip className="h-4 w-4 stroke-current" />
                              <span>{file.name}</span>
                            </FileUploaderItem>
                          ))}
                      </FileUploaderContent>
                    </FileUploader>
                  </FormControl>
                  ${field.description ? `<FormDescription>${field.description}</FormDescription>` : ""}
                  <FormMessage />
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
