export function gql(
  literals: TemplateStringsArray,
  ...substitutions: string[]
): string {
  let result = '';

  // run the loop only for the substitution count
  for (let i = 0; i < substitutions.length; i += 1) {
    result += literals[i];
    result += substitutions[i];
  }

  // add the last literal
  result += literals[literals.length - 1];

  return result;
}
