import { createApp, h } from 'vue';
import DragAndDropSelect from './DragAndDropSelect.vue';

// if you want to pass auth headers, this is how
const auth = {
//     headers: {
//         'Authorization': 'Bearer {token}',
//         'Content-Type': 'application/json'
//     }
};

// this is the format for passing a list
const items = [];

createApp({
 render: () => {
   const context = {
     props: {
       authHeaders: auth,
       selectedItems: items,
       searchUri: '...',
       postUri: '...',
       hint: 'Search by field name a, b, c',
       limit: 5
     }
   };
   return h(DragAndDropSelect, context.props);
 }
}).mount('#app');
