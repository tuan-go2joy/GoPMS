import { Quasar } from 'quasar';
import { createApp } from 'vue';
import App from '~/App.vue';
import { quasarOptions } from '~/plugins/quasar';
import { router } from '~/plugins/router';
import { i18n } from './plugins/i18n';
import { VueQueryPlugin } from 'vue-query';

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css';

// Import Quasar css
import 'quasar/src/css/index.sass';

createApp(App).use(router).use(Quasar, quasarOptions).use(i18n).use(VueQueryPlugin).mount('#app');
