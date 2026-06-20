import DragAndDropSelect from './DragAndDropSelect.vue';

export { DragAndDropSelect };

export default {
  install(app) {
    app.component('DragAndDropSelect', DragAndDropSelect);
  }
};
