import { App } from 'vue'
import GuestLayout from '@/layouts/GuestLayout.vue'
import MemberLayout from '@/layouts/MemberLayout.vue'
import PortalSection from './PortalSection.vue'
const comps = [
  GuestLayout,
  MemberLayout,
  PortalSection
]
const install = (app: App): void => {
  comps.forEach(comp => {
    app.component(comp.name, comp)
  })
}
export default {
  install
}
