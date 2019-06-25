import Vue from 'vue'
import DragAndDropSelect from './DragAndDropSelect'

const auth = {
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImViZTA3ZWUxNWYxZDgxZWJiMWZjNTZmZDg1M2NhYjlhZjdlMzlkZGYxZTlkNDRlOGIyMDY2YzMyMTRlMTVjZWY1YWNlNDE4NDM0YTgzYzY1In0.eyJhdWQiOiIyIiwianRpIjoiZWJlMDdlZTE1ZjFkODFlYmIxZmM1NmZkODUzY2FiOWFmN2UzOWRkZjFlOWQ0NGU4YjIwNjZjMzIxNGUxNWNlZjVhY2U0MTg0MzRhODNjNjUiLCJpYXQiOjE1NjAxODc4NjYsIm5iZiI6MTU2MDE4Nzg2NiwiZXhwIjoxNTkxODEwMjY2LCJzdWIiOiIzMCIsInNjb3BlcyI6W119.TbvaVqE2FalAsSFIQp0TPlsfBmLvx9Om4RMXo-H_5i576DD64dp1O3XR2s1o8NtycL-mYEfpCcjZY5x6kH9s78HtzyHZF1ay3zn8_nh1e1eu5D7chEfzlZ0bDKavjRr8z6Jr5EUsCQ2TopmRc52-bmDjOzfoAAws2g_-4ctHSZSCJqEjaEZWg6ZQU0JEoVyjfxg3EpAQ0TH4Yti6yt1osqT_uo2SNbmJTiJKrdNJsFt1c993QqqTv-qI7P_V7ZKjkx4d0AeQe7lqa6klMaHxn2sxIEqghUbfk2qUywHrxGdOv0W1FTftbT3RmG0gCaO5_aTjas7PQ3FH7wQvPLBeq6nrqGwEE3Rbcoob-8LTBZpT9mctRVYAhZdwklSYcZo5TVJeLfY_jDpUXtLi5PQIDHgq6kQmnVYav98euQqPWTE5KNw5opd572Q1EUPATwXTlSWRc-j6VAvGoj242xn4T-WAICJFcS0zZ10ekzajOZBHul3BpGOKnyQTms51p3AXItmnfE6JnqDSAyFey6XdN_10BwfudObpgmhZJHOD8I3Iw_oUGZQ8lfxE1emsV-ZDCiyycU6OrY9WC2MNvGwDRURe7VpPVEj52v-9UHpr0UW8EpYQwwoC4tcQxDF2r8nuaeDccsl_TzhMZS1yTVrBEuT-aI_L3KMu1Xrnh9sAx58',
        'Content-Type': 'application/json'
    }
};

const items = [{"name":"Of Feather And Bone - Bestial Hymns Of Perversion","id":139021}];

new Vue({
  render: createElement => {
   const context = {
     props: {
       auth_headers: auth,
       selected_items: items,
       search_uri: 'http://revolver.test/api/search/products',
       post_uri: 'http://revolver.test/api/front/slideshow',
       hint: 'Search by Revolver code, label code, or UPC',
       limit: 2
      },
   };
   return createElement(DragAndDropSelect, context);
 },
  // render: h => h(DragAndDropSelect),
}).$mount('#app')


// const app = new Vue({
//     components: { DragAndDropSelect },
//     template: "<DragAndDropSelect auth_headers='auth' selected_items='items' search_uri='/api/search/products' post_uri='/api/front/slideshow' hint='Search by Revolver code, label code, or UPC'/>",
//     mounted: function() {
//     }
// }).$mount("#app");
