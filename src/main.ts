import { Quasar } from 'quasar';
import { createApp } from 'vue';
import App from '~/App.vue';
import { quesarOptions } from '~/plugins/quasar';
import { router } from '~/plugins/router';
import { i18n } from './plugins/i18n';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

createApp(App).use(router).use(Quasar, quesarOptions).use(i18n).mount('#app');
