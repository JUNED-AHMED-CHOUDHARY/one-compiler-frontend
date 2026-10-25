/** A testcase input is raw stdin with one line per param — these map it to / from per-param boxes. */
export function splitTestcaseInput(input: string, paramCount: number): string[] {
  const lines = input.split(/\r?\n/)
  return Array.from({ length: paramCount }, (_, index) => lines[index] ?? '')
}

export function setTestcaseParam(
  input: string,
  paramCount: number,
  paramIndex: number,
  value: string,
): string {
  const values = splitTestcaseInput(input, paramCount)
  values[paramIndex] = value
  return values.join('\n')
}
