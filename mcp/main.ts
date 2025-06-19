import {
  McpServer,
  ResourceTemplate,
} from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'

import { generateFormCode } from '@/screens/generate-code-parts'
import { formatJSXCode } from '@/lib/utils'
import { FormFieldType } from '@/types'
import { FormFieldOrGroup } from '@/screens/form-builder'
import { fieldTypes } from '@/constants'

const FORM_OBJECT = z.object({
  checked: z.boolean(),
  description: z.string(),
  disabled: z.boolean(),
  label: z.string(),
  name: z.string(),
  placeholder: z.string(),
  required: z.boolean(),
  rowIndex: z.number(),
  type: z.string(),
  variant: z
    .enum(fieldTypes.map((field) => field.name) as [string, ...string[]])
    .describe('The type of form input to create'),
})

// Create an MCP server
const server = new McpServer({
  name: 'demo-server',
  version: '1.0.0',
})

// Add an addition tool
server.registerTool(
  'create_react_form',
  {
    title: 'Create React Form',
    description:
      'This tool simplifies the form-building process for React developers that use shadcn/ui and react-hook-form. Given a list of form field definitions, it generates React code that can be used in a standalong react component.Input fields are arragned in rows, with one form input per row by default, but can be configured to be in columns.',
    inputSchema: {
      input_rows: z
        .array(z.union([FORM_OBJECT, z.array(FORM_OBJECT)]))
        .describe(
          'One form input object per row. Only add an array when there are 2 or more inputs in a row. Otherwise, just add the form input object directly',
        ),
    },
  },
  async ({ input_rows }) => {
    const formCode = generateFormCode(input_rows as FormFieldOrGroup[])
    const formattedCode = formatJSXCode(formCode)
    await import('fs/promises').then((fs) =>
      fs.appendFile(
        '/tmp/test.log',
        `${JSON.stringify(input_rows, null, 2)}\n--------------------\n${formattedCode}\n`,
      ),
    )
    return {
      content: [{ type: 'text', text: formattedCode }],
    }
  },
)

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport()
await server.connect(transport)
