# Domain glossary

Terms used across this codebase. Architecture words (module, interface,
seam, adapter, depth) follow their usual meanings in design reviews.

**Field variant**: a kind of form field the playground offers (Input, Phone,
Credit Card, …). Each is one module in `components/field-variants/` that
owns its defaults, builder settings, validation, default value, live
preview control and generated control. `FormFieldType.variant` names one.

**Form field**: one field the user added in the playground: a variant plus
the user's label, name, placeholder, required flag and variant settings.
Fields can be grouped into rows of two or three.

**Form library**: the library generated code targets: React Hook Form or
TanStack Form. Each has an adapter in `lib/form-code/` that supplies the
form hook, the `<form>` element and how a field binds its value.

**Schema expression**: a zod chain written once with `zx`
(`components/field-variants/schema-expr.ts`) and read two ways: as the
runtime schema the preview validates with, and as the source the generator
prints.

**Registry item**: a component, block or file published through the shadcn
registry. `registry.json` is the **Registry catalog**, the single source for
items' files, titles, descriptions and dependencies;
`lib/registry-catalog.ts` is its only reader.

**Template**: a ready-made form (auth flows, contact, newsletter) shipped as
a `registry:block`. A template can have **flows**, pages at their own routes
(`/sign-in`, `/sign-up`, …) that link to each other.

**Primitive seam**: `components/ui/`, the only modules allowed to import
the primitive library (Base UI). App code uses the wrappers' props, so
swapping or upgrading primitives stays inside `components/ui/`.
