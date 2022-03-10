import Vue from 'vue'
import DragAndDropSelect from './DragAndDropSelect'

// if you want to pass auth headers, this is how
const auth = {
//     headers: {
//         'Authorization': 'Bearer {token}',
//         'Content-Type': 'application/json'
//     }
};

// this is the format for passing a list
const items = [{"name":"abcd","id":14},{"name":"xyz", 15}];

new Vue({
  render: createElement => {
   const context = {
     props: {
       auth_headers: auth,
       selected_items: items,
       search_uri: '...',
       post_uri: '...',
       hint: 'Search by field name a, b, c',
       limit: 5
      },
   };
   return createElement(DragAndDropSelect, context);
 },
}).$mount('#app')
