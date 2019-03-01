<template>
    <div class="drag-and-drop-select row" ref="selector">
        <div class="col-md-12">
            <div class="alert alert-primary" role="alert" v-if="response">
                {{ response }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <input type="text" v-model="search" class="drag-and-drop-select-search"
                   :placeholder="search_hint">

            <div class="drags">
                <ul id="results">
                    <li v-for="item in results" :key="item.id" :data-id="item.id" v-dragger draggable='true'>
                        {{ item.name }}
                    </li>
                </ul>

                <ul id="all_selected" v-dragger>
                    <li v-for="item in selected" :key="item.id" :data-id="item.id" draggable='true' >
                        {{ item.name }}
                    </li>
                </ul>

                <ul id="delete" v-dragger>
                    <i></i>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Vue from 'vue'

    export default {
      props: ['selected_items', 'search_uri', 'post_uri', 'hint', 'auth_headers'],
        directives: {
          dragger: {
            bind: (el, bindings, vnode) => {
              const vm = vnode.context;
              el.addEventListener('dragstart', vm.handleDragStart, false);
              el.addEventListener('dragenter', vm.handleDragEnter, false);
              el.addEventListener('dragover', vm.handleDragOver, false);
              el.addEventListener('dragleave', vm.handleDragLeave, false);
              el.addEventListener('drop', vm.handleDrop, false);
              el.addEventListener('dragend', vm.handleDragEnd, false);
            }
          }
        },
        data() {
            return {
                search: null,
                shake_error: false,
                results: [],
                data_search: null,
                search_hint:null,
                data_post: null,
                response: null,
                updated_slides: [],
                sortable: null,
                selected: null,
                headers: null,
                drag_source: null,
                drag_source_name: null,
                element: null,
                http:null
            }
        },
        name: "DragAndDropSelect",
        watch: {
            search(after, before) {
                if (after !== before) {
                  if (typeof timeout !== 'undefined') clearTimeout(timeout);

                  // Make a new timeout set to go off in 800ms
                  let timeout = setTimeout(() => {
                      this.fetch();
                  }, 500);

                }
            }
        },
        created() {
          this.data_search = this.search_uri;
          this.data_post = this.post_uri;
          this.search_hint = this.hint;
          this.selected = this.selected_items;
          this.headers = this.auth_headers;
          this.http = axios.create(this.headers);
        },
        mounted() {

        },
        methods: {
            fetch() {
                if (this.search.length > 2) {
                    this.http.get(this.data_search, {params: {search: this.search}})
                        .then(response => this.results = response.data.data)
                        .catch(error => {
                            console.log(error)
                        });
                }
            },
            persistChanges() {
                this.http.post(this.data_post, {updated_slides: this.selected})
                    .then(response => {
                        this.response = String(response.data);
                    })
                    .catch(error => {
                    });
            },
            animate: function () {
                this.shake_error = true;
                setTimeout(() => {
                    this.shake_error = false;
                }, 1000);
            },
            handleDragStart: function (e) {
                e.target.classList.add('dragging');
                this._dragSrcEl = e.target;
                e.dataTransfer.effectAllowed = 'move';
                // Need to set to something or else drag doesn't start
                e.dataTransfer.setData('text', '*');
                this.drag_source = e.target.dataset.id;
                this.drag_source_name = e.target.innerText;
                this.element = e.target;
                // if (typeof(this.vm[this.$params.dragStart]) === 'function') {
                //   this.vm[this.$params.dragStart].call(this, e.target);
                // }
              },
              handleDragOver: function (e) {
                if (e.preventDefault) {
                  // allows dropping
                  e.preventDefault();
                }

                e.dataTransfer.dropEffect = 'move';
                e.target.classList.add('drag-over');
                e.dataTransfer.effectAllowed='move';
                e.dataTransfer.setData("Text", '*');

                // var src = e.dataTransfer.setData('text', '');
                // if (typeof(this.vm[this.params.dragOver]) === 'function') {
                //   this.vm[this.params.dragOver].call(this, e.target);
                // }
                return false;
              },
              handleDragEnter: function (e) {
                // if (typeof(this.vm[this.params.dragEnter]) === 'function') {
                //   this.vm[this.params.dragEnter].call(this, e.target);
                // }
                e.preventDefault();
                e.target.classList.add('drag-enter');
              },
              handleDragLeave: function (e) {
                // if (typeof(this.vm[this.params.dragLeave]) === 'function') {
                //   this.vm[this.params.dragLeave].call(this, e.target);
                // }
                e.target.classList.remove('drag-enter');
              },
              handleDragEnd: function (e) {
                e.target.classList.remove('dragging', 'drag-over', 'drag-enter');
                this.element = null;
                // if (typeof(this.vm[this.params.dragEnd]) === 'function') {
                //   this.vm[this.params.dragEnd].call(this, e.target);
                // }
              },
              handleDrop: function (e) {
                if (e.target.id == "delete") {
                  for (var i = this.selected.length - 1; i >= 0; --i) {
                      if (this.selected[i].id == this.drag_source) {
                          this.selected.splice(i,1);
                      }
                  }
                  this.persistChanges();
                }

                if (e.target.id == "all_selected") {
                  if (this.isBefore(this.element, e.target)) {
                    console.log("one", this.element, e.target)

                    //e.target.parentNode.insertBefore(this.element, e.target);
                  } else {
                    console.log("two", this.element, e.target.nextSibling)
                    for (var i = this.selected.length - 1; i >= 0; --i) {
                        if (this.selected[i].id == this.drag_source) {
                            this.selected.splice(i,1);
                        }
                    }

                    this.selected.push({id: this.drag_source, name: this.drag_source_name});
                    //e.target.parentNode.insertBefore(this.element, e.target.nextSibling);
                  }

                  // if selected is the same count as the LIs in this, we need to reserialize in order, not push

                  this.persistChanges();
                }

                e.target.classList.remove('dragging', 'drag-over', 'drag-enter');

                var elems = document.querySelectorAll(".drag-over");
`
                [].forEach.call(elems, function(el) {
                    el.classList.remove("hover");
                });
`

                this.drag_source = this.drag_source_name = null; // maybe we set the text like this, too?

                if (e.stopPropagation) {
                  // stops the browser from redirecting.
                  e.stopPropagation();
                }

                return false;
              },

              isBefore: function(el1, el2) {
                  if (el2.parentNode === el1.parentNode)
                      for (var cur = el1.previousSibling; cur; cur = cur.previousSibling)
                          if (cur === el2)
                              return true;
                  return false;
              }
        }
    }
</script>

<style lang="scss">
[draggable] {
      -moz-user-select: none;
      -khtml-user-select: none;
      -webkit-user-select: none;
      user-select: none;
      /* Required to make elements draggable in old WebKit */
      -khtml-user-drag: element;
      -webkit-user-drag: element;
    }
    li {
      color: black;
    }
    .dragging {
      opacity: 0.8;
      color: #6894D1;
      border: 2px dotted #c3c3c3;
    }
    .drag-over {
      border-bottom: 4px solid #333;
    }
    .drag-enter {
      color: #C93742;
    }
////
    .drag-and-drop-select-search {
        border: 4px solid #000;
        font-weight: bold;
        font-size: 18px;
        padding: 10px;
        width: 100%;
        margin-bottom: 5px;
    }

    .dragging {
      border: 4px dotted #c3c3c3;
      box-sizing: border-box;
      -moz-box-sizing: border-box;
      -webkit-box-sizing: border-box;
    }

    .drags {
        background-image: repeating-linear-gradient(-45deg, var(--pattern-bg-color), var(--pattern-bg-color) 40%, currentColor 0, currentColor 50%, var(--pattern-bg-color) 0);
        background-size: .8rem .8rem;
        position: relative;
        color: #212529;
        display: grid;
        grid-column-gap: 1rem;
        grid-row-gap: 20px;
        grid-template-columns: 1fr 1fr 0.5fr;
        ul {
          display: flex;
          flex-direction: column;
        }
        ul#results {
            min-height: 170px;
            background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMjMuODMyIDE5LjY0MWwtNi44MjEtNi44MjFjMi44MzQtNS44NzgtMS40NS0xMi44Mi04LjA2NS0xMi44Mi00LjkzMiAwLTguOTQ2IDQuMDE0LTguOTQ2IDguOTQ3IDAgNi41MDggNi43MzkgMTAuNzk4IDEyLjYwMSA4LjE2Nmw2Ljg3OSA2Ljg3OWMxLjk1Ny4xNjQgNC41Mi0yLjMyNiA0LjM1Mi00LjM1MXptLTE0Ljg4Ni00LjcyMWMtMy4yOTMgMC01Ljk3My0yLjY4LTUuOTczLTUuOTczczIuNjgtNS45NzMgNS45NzMtNS45NzNjMy4yOTQgMCA1Ljk3NCAyLjY4IDUuOTc0IDUuOTczcy0yLjY4IDUuOTczLTUuOTc0IDUuOTczeiIvPjwvc3ZnPg==") no-repeat center center;
            background-size: 50px 50px;
        }
        ul#selected_items {
            min-height: 170px;
            background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMTIuMDE1IDdjNC43NTEgMCA4LjA2MyAzLjAxMiA5LjUwNCA0LjYzNi0xLjQwMSAxLjgzNy00LjcxMyA1LjM2NC05LjUwNCA1LjM2NC00LjQyIDAtNy45My0zLjUzNi05LjQ3OC01LjQwNyAxLjQ5My0xLjY0NyA0LjgxNy00LjU5MyA5LjQ3OC00LjU5M3ptMC0yYy03LjU2OSAwLTEyLjAxNSA2LjU1MS0xMi4wMTUgNi41NTFzNC44MzUgNy40NDkgMTIuMDE1IDcuNDQ5YzcuNzMzIDAgMTEuOTg1LTcuNDQ5IDExLjk4NS03LjQ0OXMtNC4yOTEtNi41NTEtMTEuOTg1LTYuNTUxem0tLjAxNSAzYy0yLjIxIDAtNCAxLjc5MS00IDRzMS43OSA0IDQgNGMyLjIwOSAwIDQtMS43OTEgNC00cy0xLjc5MS00LTQtNHptLS4wMDQgMy45OTljLS41NjQuNTY0LTEuNDc5LjU2NC0yLjA0NCAwcy0uNTY1LTEuNDggMC0yLjA0NGMuNTY0LS41NjQgMS40NzktLjU2NCAyLjA0NCAwcy41NjUgMS40NzkgMCAyLjA0NHoiLz48L3N2Zz4=") no-repeat center center;
            background-size: 50px 50px;
        }
        ul#delete {
            min-height: 170px;
            max-height: 170px;
            background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBkPSJNMyA2djE4aDE4di0xOGgtMTh6bTUgMTRjMCAuNTUyLS40NDggMS0xIDFzLTEtLjQ0OC0xLTF2LTEwYzAtLjU1Mi40NDgtMSAxLTFzMSAuNDQ4IDEgMXYxMHptNSAwYzAgLjU1Mi0uNDQ4IDEtMSAxcy0xLS40NDgtMS0xdi0xMGMwLS41NTIuNDQ4LTEgMS0xczEgLjQ0OCAxIDF2MTB6bTUgMGMwIC41NTItLjQ0OCAxLTEgMXMtMS0uNDQ4LTEtMXYtMTBjMC0uNTUyLjQ0OC0xIDEtMXMxIC40NDggMSAxdjEwem00LTE4djJoLTIwdi0yaDUuNzExYy45IDAgMS42MzEtMS4wOTkgMS42MzEtMmg1LjMxNWMwIC45MDEuNzMgMiAxLjYzMSAyaDUuNzEyeiIvPjwvc3ZnPg==") no-repeat center center;

            background-size: 50px 50px;

            &:hover, &:focus {
                background: #000;
            }
        }

                /* drop target state */
        ul[aria-dropeffect="move"] {
          border-color:#68b;
          background:#fff;
        }

        /* drop target focus and dragover state */
        ul[aria-dropeffect="move"]:focus,
        ul[aria-dropeffect="move"].dragover
        {
          outline:none;
          box-shadow:0 0 0 1px #fff, 0 0 0 3px #68b;
        }

        li[aria-grabbed="true"]
        {
          background:#5cc1a6;
          color:#fff;
        }

        .item-dropzone-area {
            height: 2rem;
            background: #888;
            opacity: 0.8;
            animation-duration: 0.5s;
            animation-name: nodeInserted;
        }

        ul {
            border: 4px solid #000;
            padding: 6px;
            &.drag-over {
              border: 4px dotted #000;
            }

            li {
                display: flex;
                align-items: center;
                padding: 1.6rem;
                color: #000;
                font-weight: bold;
                background-color: #e3e3e3;
                margin-bottom: 3px;

            }

            li:hover {
                background-color: #d3d3d3;
                cursor: move;
            }

            /* items focus state */
            li:focus {
                outline: none;
                box-shadow: 0 0 0 2px #68b, inset 0 0 0 1px #ddd;
            }

            /* items grabbed state */
            li[aria-grabbed="true"] {
                background-color: #a3a3a3;
                color: #fff;
            }

            @keyframes nodeInserted {
                from {
                    opacity: 0.2;
                }
                to {
                    opacity: 0.8;
                }
            }

            ul .item-dropzone-area {
                height: 2rem;
                background: #888;
                opacity: 0.8;
                animation-duration: 0.5s;
                animation-name: nodeInserted;
            }
        }
    }

    .shake-error {
        -webkit-animation: kf_shake 0.4s 1 linear;
        -moz-animation: kf_shake 0.4s 1 linear;
        -o-animation: kf_shake 0.4s 1 linear;
    }

    @-webkit-keyframes kf_shake {
        0% {
            -webkit-transform: translate(30px);
        }
        20% {
            -webkit-transform: translate(-30px);
        }
        40% {
            -webkit-transform: translate(15px);
        }
        60% {
            -webkit-transform: translate(-15px);
        }
        80% {
            -webkit-transform: translate(8px);
        }
        100% {
            -webkit-transform: translate(0px);
        }
    }

    @-moz-keyframes kf_shake {
        0% {
            -moz-transform: translate(30px);
        }
        20% {
            -moz-transform: translate(-30px);
        }
        40% {
            -moz-transform: translate(15px);
        }
        60% {
            -moz-transform: translate(-15px);
        }
        80% {
            -moz-transform: translate(8px);
        }
        100% {
            -moz-transform: translate(0px);
        }
    }

    @-o-keyframes kf_shake {
        0% {
            -o-transform: translate(30px);
        }
        20% {
            -o-transform: translate(-30px);
        }
        40% {
            -o-transform: translate(15px);
        }
        60% {
            -o-transform: translate(-15px);
        }
        80% {
            -o-transform: translate(8px);
        }
        100% {
            -o-origin-transform: translate(0px);
        }
    }

</style>
