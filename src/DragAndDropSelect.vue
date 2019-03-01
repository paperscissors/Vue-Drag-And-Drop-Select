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
              <div

                class="btn-group list-group-item"
                role="group"
                aria-label="Basic example"
              >
                <button class="btn btn-secondary" @click="add">Add</button>
                <button class="btn btn-secondary" @click="replace">Replace</button>
              </div>

              <draggable
                class="list-group"
                tag="ul"
                v-model="selected"
                :list="selected"
                v-bind="dragOptions"
                group="selections"
                @start="drag = true"
                @end="drag = false"
                @change="log"
              >
                <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                  <li
                    class="list-group-item"
                    v-for="(element, index) in selected"
                    :key="element.id"
                  >
                    {{ element.name }}

                    <button class="fa fa-times close" @click="removeAt(index)">remove</button>
                  </li>
                </transition-group>
              </draggable>

              <!-- <draggable id="results" class="list-group" :list="results" group="people" @change="log">
                <div
                  class="list-group-item"
                  v-for="item in results"
                  :key="item.id" :data-id="item.id"
                >
                  {{ item.name }}
                </div>
              </draggable> -->

              <!-- <draggable id="all_selected" class="list-group" :list="selected" group="people" @change="log">
                <div
                  class="list-group-item"
                  v-for="item in selected"
                  :key="item.id" :data-id="item.id"
                >
                  {{ item.name }}
                </div>
              </draggable> -->

            </div>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import draggable from 'vuedraggable'

    export default {
      props: ['selected_items', 'search_uri', 'post_uri', 'hint', 'auth_headers'],
      components: {
        draggable
      },
        data() {
            return {
                drag: false,
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
        computed: {
          dragOptions() {
            return {
              animation: 200,
              group: "description",
              disabled: false,
              ghostClass: "ghost"
            };
    }
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
            change(e) {
              console.log(e, "hey");
            },
            persistChanges() {
                this.http.post(this.data_post, {updated_slides: this.selected})
                    .then(response => {
                        this.response = String(response.data);
                    })
                    .catch(error => {
                    });
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
              sort() {
                this.selected = this.selected.sort((a, b) => a.order - b.order);
              },
              add: function() {
                this.selected.push({ id: 666, name: "Juan" });
              },
              replace: function() {
                this.list = [{ id: 653, name: "Edgard" }];
              },
              clone: function(el) {
                return {
                  name: el.name + " cloned"
                };
              },
              removeAt(idx) {
                this.selected.splice(idx, 1);
              },
              log: function(evt) {
                window.console.log(evt);
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

////
    .drag-and-drop-select-search {
        border: 4px solid #000;
        font-weight: bold;
        font-size: 18px;
        padding: 10px;
        width: 100%;
        margin-bottom: 5px;
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
        .list-group {
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

        .list-group {
            border: 4px solid #000;
            padding: 6px;
            &.drag-over {
              border: 4px dotted #000;
            }

            .list-group-item {
                display: flex;
                align-items: center;
                padding: 1.6rem;
                color: #000;
                font-weight: bold;
                background-color: #e3e3e3;
                margin-bottom: 3px;

            }

            .list-group-item:hover {
                background-color: #d3d3d3;
                cursor: move;
            }

            /* items focus state */
            .list-group-item:focus {
                outline: none;
                box-shadow: 0 0 0 2px #68b, inset 0 0 0 1px #ddd;
            }


        }
    }

    .button {
  margin-top: 35px;
}
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}
.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
.list-group {
  min-height: 20px;
}
.list-group-item {
  cursor: move;
}
.list-group-item i {
  cursor: pointer;
}
</style>
