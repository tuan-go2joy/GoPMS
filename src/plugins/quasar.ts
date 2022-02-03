import type { QuasarPluginOptions } from 'quasar';
import { Notify } from 'quasar';

export const quasarOptions: Partial<QuasarPluginOptions> = { plugins: { Notify } };
