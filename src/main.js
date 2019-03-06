import Vue from 'vue'
import DragAndDropSelect from './DragAndDropSelect'

const auth = {
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijc3ZGQ2ZDg0ODM0MzA1NjA4NGIyZDQxMDlhNzdjNWZjZmJlM2NjZmZkNzMzYTgxYzcwNjNmOWIxNzFjYTE5Y2ZiM2RkMWVjYjA5NjcyYjUyIn0.eyJhdWQiOiI1IiwianRpIjoiNzdkZDZkODQ4MzQzMDU2MDg0YjJkNDEwOWE3N2M1ZmNmYmUzY2NmZmQ3MzNhODFjNzA2M2Y5YjE3MWNhMTljZmIzZGQxZWNiMDk2NzJiNTIiLCJpYXQiOjE1MTgzNzgwNjAsIm5iZiI6MTUxODM3ODA2MCwiZXhwIjoxODMzOTEwODYwLCJzdWIiOiIzMCIsInNjb3BlcyI6W119.F643zzx74DGS2pwqEykx4_WN3J7CPDNjCowRDOxfd9HWKKWP8blgCgCPhc-wz05p2P5yeaem3ZxGpHotdvv1HyVcwnjKPTttGQiAS6ezTQ8kRG25Np1l7cE60EvTmoUXNM0AAgYq-2ykP_a6U9RakCXCJSp1_PyGkA1PL6RKyDY4_ZmHDtx8ueU7jRHrOl2axzfJxAUaCE0DJgXmDaGRnz4sr5aEepbmzWGNCqBzsGHQm5cV_g_vOk48gIh41hjrY39fLxEmOwWlsi7zqB4OyjSMBXGWAeCXy5jFzUbLt9jPUhMvcTyK13W7Ywtok8PVRTccR-O0X59wsZ48mdF0bMkL7BJneXTbLQA7V1YBOJ4SnjTr3v_Iq-NWLoZFjJ-s3BIpu75ltOLiMb4Or73EYVsyo58wEINo-lTr_ZyBYTENRq53xaGIDY3Uwvb4riCsGun3gpId8fTtJxhAVShKYu16p4ctE28K_Krf8DZ6yXbbRr9Vf3BXFFUd-B6ePUiVXwi7mSbTBAjD_A4_tEFTrcjtn_7LYQKDd3tz_Jh7kGhyce8KfXCvds1SGTc1QB-MsGvwsTdmGPJiYEI2D6JDNWPSIFxhhdKpBO3W33e_49pqIxdCxjFj8ZuoHCmR7Q8CsPnof84BBFw2EE0viXbkw9PRcjXofggz04mnNf3qn-8',
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
