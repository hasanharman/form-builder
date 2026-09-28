import { z } from 'zod'

/**
 * A zod expression written once and read two ways: as the runtime schema
 * the playground validates with, and as the source code the generator
 * prints. `zx` records property reads and calls instead of running them,
 * so `zx.string().min(1)` becomes both `z.string().min(1)` (runtime) and
 * the text "z.string().min(1)".
 *
 * `zx` is typed as `typeof z` for autocompletion; what it returns are
 * recordings, only meaningful to `toZod` and `toSource`. A property named
 * with a type argument, `zx.coerce['number<string>']`, prints the type
 * argument and ignores it at runtime.
 */

type Step = { kind: 'get'; name: string } | { kind: 'call'; args: unknown[] }

const STEPS = Symbol('schema-expr steps')
const CODE = Symbol('schema-expr code')

type Recording = { [STEPS]: Step[] }

/** A value with a runtime form and a hand-written source form, e.g. a refine callback. */
export type Code<T> = { [CODE]: string; value: T }

/** Typed as the value so it fits where zod expects it, e.g. `.refine(code(fn, 'fn'))`. */
export function code<T>(value: T, source: string): T {
  return { [CODE]: source, value } as Code<T> as unknown as T
}

function record(steps: Step[]): unknown {
  const target = function () {} as unknown as Recording
  return new Proxy(target, {
    get(_, prop) {
      if (prop === STEPS) return steps
      if (typeof prop === 'symbol' || prop === 'then') return undefined
      return record([...steps, { kind: 'get', name: prop }])
    },
    apply(_, __, args) {
      return record([...steps, { kind: 'call', args }])
    },
  })
}

export const zx = record([]) as typeof z

export type SchemaExpr = unknown

function stepsOf(expr: SchemaExpr): Step[] | undefined {
  return typeof expr === 'function' ? (expr as unknown as Recording)[STEPS] : undefined
}

function isCode(value: unknown): value is Code<unknown> {
  return typeof value === 'object' && value !== null && CODE in value
}

function runtimeArg(arg: unknown): unknown {
  if (stepsOf(arg)) return toZod(arg)
  if (isCode(arg)) return arg.value
  if (Array.isArray(arg)) return arg.map(runtimeArg)
  if (arg && typeof arg === 'object' && !(arg instanceof Date)) {
    return Object.fromEntries(Object.entries(arg).map(([k, v]) => [k, runtimeArg(v)]))
  }
  return arg
}

export function toZod(expr: SchemaExpr): z.ZodType {
  const steps = stepsOf(expr)
  if (!steps) throw new Error('Not a schema expression')
  let receiver: unknown = undefined
  let current: unknown = z
  for (const step of steps) {
    if (step.kind === 'get') {
      receiver = current
      // `zx.coerce['number<string>']` records a type argument for the source only.
      current = (current as Record<string, unknown>)[step.name.replace(/<.*>$/, '')]
    } else {
      current = (current as (...args: unknown[]) => unknown).apply(receiver, step.args.map(runtimeArg))
      receiver = undefined
    }
  }
  return current as z.ZodType
}

const IDENTIFIER = /^[A-Za-z_$][\w$]*$/

/** Prints a JS value as source: dates as `new Date()`, identifier keys unquoted. */
export function printValue(value: unknown): string {
  if (stepsOf(value)) return toSource(value)
  if (isCode(value)) return value[CODE]
  if (typeof value === 'function') {
    throw new Error(`Wrap ${value.name || 'functions'} in code() so it has a source form`)
  }
  if (value instanceof Date) return 'new Date()'
  if (value === undefined) return 'undefined'
  if (Array.isArray(value)) return `[${value.map(printValue).join(', ')}]`
  if (value && typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, v]) => `${IDENTIFIER.test(key) ? key : JSON.stringify(key)}: ${printValue(v)}`,
    )
    return entries.length ? `{ ${entries.join(', ')} }` : '{}'
  }
  return JSON.stringify(value)
}

export function toSource(expr: SchemaExpr): string {
  const steps = stepsOf(expr)
  if (!steps) throw new Error('Not a schema expression')
  return steps.reduce(
    (source, step) =>
      step.kind === 'get'
        ? `${source}.${step.name}`
        : `${source}(${step.args.map(printValue).join(', ')})`,
    'z',
  )
}
