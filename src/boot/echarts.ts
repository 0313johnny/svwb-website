import { defineBoot } from '#q-app/wrappers';
import VChart from 'vue-echarts';

export default defineBoot(({ app }) => {
  app.component('VChart', VChart);
});
