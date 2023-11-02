import { withInstall } from '@/utils/util';

import appLogo from './src/AppLogo.vue';
import appLocalePicker from './src/AppLocalePicker.vue';

export const AppLogo = withInstall(appLogo);
export const AppLocalePicker = withInstall(appLocalePicker);
