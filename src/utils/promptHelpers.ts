import { Prompt } from '../services/mockData';

export function getLocalizedPrompt(prompt: Prompt, t: (key: string) => string): Prompt {
  const titleKey = `prompt.${prompt.id}.title`;
  const textKey = `prompt.${prompt.id}.text`;
  const constraintKey = `prompt.${prompt.id}.constraint`;
  const inspirationKey = `prompt.${prompt.id}.inspiration`;

  const title = t(titleKey);
  const text = t(textKey);
  const constraint = prompt.constraint ? t(constraintKey) : undefined;
  const inspiration = prompt.inspiration ? t(inspirationKey) : undefined;

  return {
    ...prompt,
    title: title !== titleKey ? title : prompt.title,
    text: text !== textKey ? text : prompt.text,
    constraint: (prompt.constraint && constraint !== constraintKey) ? constraint : prompt.constraint,
    inspiration: (prompt.inspiration && inspiration !== inspirationKey) ? inspiration : prompt.inspiration,
  };
}
