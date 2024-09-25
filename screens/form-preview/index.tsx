import React from "react";
import { Highlight, themes } from "prism-react-renderer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { renderFormField } from "@/screens/render-form-field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormField, FormItem, FormControl } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import If from "@/components/ui/if";
import { FormFieldType } from "@/types";
import { generateCodeSnippet } from "../generate-code-field";

import { Files } from "lucide-react";

export type FormPreviewProps = {
  formFields: FormFieldType[];
};

const generateZodSchema = (formFields: FormFieldType[]) => {
  const schemaObject: Record<string, any> = {};
  formFields.forEach((field, index) => {
    if (field.type !== "Label") {
      let fieldSchema;
      switch (field.type) {
        case "Checkbox":
        case "Switch":
          fieldSchema = z.boolean();
          break;
        case "Number":
          fieldSchema = z.number();
          break;
        case "Date":
          fieldSchema = z.date();
          break;
        default:
          fieldSchema = z.string();
          break;
      }

      // if (field.required) {
      //   switch (field.type) {
      //     case "Checkbox":
      //     case "Switch":
      //       fieldSchema = z.refine(
      //         (value): value is boolean =>
      //           value !== undefined && value !== null && value !== false,
      //         {
      //           message: `${field.label} is required`,
      //         }
      //       );
      //       break;
      //     default:
      //       fieldSchema = z.min(1, {
      //         message: `${field.label} is required`,
      //       });
      //       break;
      //   }
      // }

      schemaObject[`form_element_${index}`] = fieldSchema;
    }
  });
  return z.object(schemaObject);
};

const generateFormCode = (formFields: FormFieldType[]) => {
  // Create a Set to store unique import statements
  const importSet = new Set([
    '"use client"',
    'import { useState } from "react"',
    'import { useForm } from "react-hook-form"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
    'import * as z from "zod"',
    'import { cn } from "@/lib/utils"',
    'import { Button } from "@/components/ui/button"',
    'import {\n  Form,\n  FormControl,\n  FormDescription,\n  FormField,\n  FormItem,\n  FormLabel,\n  FormMessage,\n} from "@/components/ui/form"',
  ]);

  const constantSet: Set<string> = new Set(); // Define type for constantSet

  formFields.forEach((field) => {
    switch (field.type) {
      case "Combobox":
        importSet.add(
          'import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from "@/components/ui/command"'
        );
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"'
        );
        importSet.add('import { Check, ChevronsUpDown } from "lucide-react"');
        constantSet.add(`const languages = [
          { label: "English", value: "en" },
          { label: "French", value: "fr" },
          { label: "German", value: "de" },
          { label: "Spanish", value: "es" },
          { label: "Portuguese", value: "pt" },
          { label: "Russian", value: "ru" },
          { label: "Japanese", value: "ja" },
          { label: "Korean", value: "ko" },
          { label: "Chinese", value: "zh" },
          ] as const;`);
        break;
      case "DatePicker":
        importSet.add('import { format } from "date-fns"');
        importSet.add(
          'import { Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"'
        );
        importSet.add(
          'import { Calendar as CalendarIcon } from "lucide-react"'
        );
        break;
      case "InputOTP":
        importSet.add(
          'import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot} from "@/components/ui/input-otp"'
        );
        break;
      case "Select":
        importSet.add(
          'import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select"'
        );
        break;
      case "FileInput":
        importSet.add('import { CloudUpload, Paperclip } from "lucide-react"');
        importSet.add(
          'import { FileInput, FileUploader, FileUploaderContent, FileUploaderItem } from "@/components/ui/file-upload"'
        );
        constantSet.add(`
            const [files, setFiles] = useState<File[] | null>(null); 

            const dropZoneConfig = {
              maxFiles: 5,
              maxSize: 1024 * 1024 * 4,
              multiple: true,
            };`);
        break;
      case "Phone":
        importSet.add("");
        importSet.add("");
        importSet.add("");
        importSet.add("");
        break;
      case "Password":
        importSet.add("");
        importSet.add("");
        importSet.add("");
        importSet.add("");
        break;
      default:
        importSet.add(
          `import { ${
            field.type
          } } from "@/components/ui/${field.type.toLowerCase()}"`
        );
        break;
    }
  });

  const imports = Array.from(importSet).join("\n");

  const schema = `
const formSchema = z.object({
  ${formFields
    .map(
      (field, index) =>
        `${field.name}: ${
          field.type === "Checkbox" || field.type === "Switch"
            ? "z.boolean().optional()"
            : field.type === "Number"
            ? "z.coerce.number()"
            : field.type === "Date"
            ? "z.date()"
            : "z.string()"
        }${
          field.required
            ? `.min(1, { message: "${field.label} is required" })`
            : ""
        }`
    )
    .join(",\n  ")}
})
  `;

  const constants = Array.from(constantSet).join("\n"); // Convert Set to string

  const component = `
export function MyForm() {
  ${constants} // Insert constants here
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        ${formFields
          .map((field) => `${generateCodeSnippet(field)}`)
          .join("\n        ")}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
  `;

  return imports + "\n"  + "\n" + schema + "\n" + component;
};

export const FormPreview: React.FC<FormPreviewProps> = ({ formFields }) => {
  const formSchema = generateZodSchema(formFields);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(data: any) {
    try {
      console.log("DATA", data);
      toast(
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      );
    } catch (error) {
      console.error("Form submission error", error);
      toast.error("Failed to submit the form. Please try again.");
    }
  }

  const generatedCode = generateFormCode(formFields);

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="flex justify-center w-fit mx-auto">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="space-y-4 ">
          <If
            condition={formFields.length > 0}
            render={() => (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4 py-5 max-w-lg mx-auto"
                >
                  {formFields.map((field, index) => (
                    <React.Fragment key={index}>
                      <FormField
                        control={form.control}
                        name={`form_element_${index}`}
                        render={({ field: formField }) => (
                          <FormItem>
                            <FormControl>
                              {React.cloneElement(
                                renderFormField(field) as React.ReactElement,
                                {
                                  ...formField,
                                }
                              )}
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </React.Fragment>
                  ))}
                  <Button type="submit">Submit</Button>
                </form>
              </Form>
            )}
            otherwise={() => <p>No form element selected yet.</p>}
          />
        </TabsContent>
        <TabsContent value="json">
          <If
            condition={formFields.length > 0}
            render={() => (
              <pre className="p-4 text-sm bg-gray-100 rounded-lg ">
                {JSON.stringify(formFields, null, 2)}
              </pre>
            )}
            otherwise={() => <p>No form element selected yet.</p>}
          />
        </TabsContent>
        <TabsContent value="code">
          <If
            condition={formFields.length > 0}
            render={() => (
              <Highlight
                code={generatedCode}
                language="tsx"
                theme={themes.shadesOfPurple}
              >
                {({
                  className,
                  style,
                  tokens,
                  getLineProps,
                  getTokenProps,
                }: any) => (
                  <pre
                    className={`${className} p-4 text-sm bg-gray-100 rounded-lg relative`}
                    style={style}
                  >
                    <Button
                      className="absolute right-1 top-1"
                      variant="secondary"
                      size="icon"
                      onClick={() => {
                        navigator.clipboard.writeText(generatedCode);
                        toast.success("Code copied to clipboard!");
                      }}
                    >
                      <Files />
                    </Button>
                    {tokens.map((line: any, i: number) => (
                      <div {...getLineProps({ line, key: i })}>
                        {line.map((token: any, key: any) => (
                          <span {...getTokenProps({ token, key })} />
                        ))}
                      </div>
                    ))}
                  </pre>
                )}
              </Highlight>
            )}
            otherwise={() => <p>No form element selected yet.</p>}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
