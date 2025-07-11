import { SlateElement } from '@yoopta/editor';
import { LANGUAGES_MAP } from './utils/languages';
import { THEMES_MAP } from './utils/themes';
export type CodePluginElements = 'code';
export type CodeElementProps = {
    language?: keyof typeof LANGUAGES_MAP;
    theme?: keyof typeof THEMES_MAP;
};
export type CodePluginBlockOptions = {};
export type CodeElement = SlateElement<'code', CodeElementProps>;
export type CodeElementMap = {
    code: CodeElement;
};
//# sourceMappingURL=types.d.ts.map