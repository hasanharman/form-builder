import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { renderFormField } from "../render-form-field";
import { Highlight, themes } from "prism-react-renderer";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";

type FormField = {
  type: string;
  name: string;
  label: string;
  value?: string;
  placeholder?: string;
  required: boolean;
  disabled: boolean;
  description?: string;
};

type FormPreviewProps = {
  formFields: FormField[];
};

// const generateCodeSnippet = (field: FormField) => {
//   const props = [
//     `name="${field.name}"`,
//     field.disabled ? `disabled` : "",
//     field.required ? `required` : "",
//     field.placeholder ? `placeholder="${field.placeholder}"` : "",
//   ]
//     .filter(Boolean)
//     .join(" ");

//   return `<${field.type} ${props} />`;
// };

const generateZodSchema = (formFields: FormField[]) => {
  const schemaObject: Record<string, any> = {};
  formFields.forEach((field) => {
    if (field.type !== "Label") {
      let fieldSchema = z.string();
      if (field.required) {
        fieldSchema = fieldSchema.min(1, {
          message: `${field.label} is required`,
        });
      }
      schemaObject[field.name] = fieldSchema;
    }
  });
  return z.object(schemaObject);
};

const generateFormCode = (formFields: FormField[]) => {
  // Create a Set to store unique import statements
  const importSet = new Set([
    'import { useForm } from "react-hook-form"',
    'import { zodResolver } from "@hookform/resolvers/zod"',
    'import * as z from "zod"',
    'import { Button } from "@/components/ui/button"',
    'import {\n  Form,\n  FormControl,\n  FormDescription,\n  FormField,\n  FormItem,\n  FormLabel,\n  FormMessage,\n} from "@/components/ui/form"',
  ]);

  formFields.forEach((field) => {
    importSet.add(
      `import { ${
        field.type
      } } from "@/components/ui/${field.type.toLowerCase()}"`
    );
  });

  const imports = Array.from(importSet).join("\n");

  const schema = `
const formSchema = z.object({
  ${formFields
    .map(
      (field) =>
        `${field.name}: z.string()${
          field.required ? '.min(1, { message: "Required" })' : ""
        }`
    )
    .join(",\n  ")}
})
  `;

  const component = `
export function MyForm() {
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
          .map(
            (field) => `
        <FormField
          control={form.control}
          name="${field.name}"
          render={({ field }) => (
            <FormItem>
              <FormLabel>${field.label}</FormLabel>
              <FormControl>
                <${field.type} {...field} ${
              field.placeholder ? `placeholder="${field.placeholder}"` : ""
            } ${field.disabled ? "disabled" : ""} />
              </FormControl>
              ${
                field.description
                  ? `<FormDescription>${field.description}</FormDescription>`
                  : ""
              }
              <FormMessage />
            </FormItem>
          )}
        />`
          )
          .join("\n        ")}
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
  `;

  return imports + "\n\n" + schema + "\n" + component;
};

export const FormPreview: React.FC<FormPreviewProps> = ({ formFields }) => {
  const formSchema = generateZodSchema(formFields);
  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: formFields.reduce((acc, field) => {
      if (field.type !== "Label") {
        acc[field.name] = field.value || "";
      }
      return acc;
    }, {} as Record<string, string>),
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
  };

  const generatedCode = generateFormCode(formFields);

  return (
    <div className="w-full h-full col-span-1 rounded-xl flex justify-center">
      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="flex justify-center w-fit mx-auto">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>

          <TabsTrigger value="code">Code</TabsTrigger>
        </TabsList>
        <TabsContent
          value="preview"
          className="space-y-4 px-20 max-h-[80vh] h-full overflow-auto"
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {formFields.map((field, index) => (
                <React.Fragment key={index}>
                  {field.type === "Label" ? (
                    <Label htmlFor={field.name}>{field.label}</Label>
                  ) : (
                    <FormField
                      control={form.control}
                      name={field.name}
                      render={({ field: formField }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{field.label}</FormLabel>
                          <FormControl>
                            {React.cloneElement(
                              renderFormField(field) as React.ReactElement,
                              {
                                ...formField,
                                name: field.name,
                                disabled: field.disabled,
                                required: field.required,
                                placeholder: field.placeholder,
                              }
                            )}
                          </FormControl>
                          {field.description && (
                            <FormDescription>
                              {field.description}
                            </FormDescription>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </React.Fragment>
              ))}
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="json">
          <pre className="p-4 text-sm bg-gray-100 rounded-lg max-h-[80vh] h-full overflow-auto">
            {JSON.stringify(formFields, null, 2)}
          </pre>
        </TabsContent>
        <TabsContent value="code">
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
                className={`${className} p-4 text-sm bg-gray-100 rounded-lg max-h-[80vh] h-full overflow-auto`}
                style={style}
              >
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
        </TabsContent>
      </Tabs>
    </div>
  );
};
