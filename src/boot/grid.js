import { boot } from "quasar/wrappers";
import VueGridLayout from "vue-grid-layout";

export default boot(({ app }) => {
  app.use(VueGridLayout);
});
