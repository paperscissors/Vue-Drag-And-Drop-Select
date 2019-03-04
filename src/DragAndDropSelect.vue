<template>
    <div class="drag-and-drop-select" ref="selector">
        <div class="col-md-12">
            <div class="message" role="alert" v-if="response">
              <transition name="fade">
                <div class="content">
                  <p>Changes saved.</p>
                </div>
              </transition>
            </div>
            <input type="text" v-model="search" class="search-field"
                   :placeholder="search_hint">

            <div class="drags">
              <ul id="results" class="result-group" v-if="results.length > 0 && search != null">
                <li class="result-group-item header"><h5>Search results for "{{ search }}"</h5> <button class="button-close" @click="results = []; search = null"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg></button></li>
                <li class="result-group-item"
                    v-for="(element) in filteredResults"
                    :key="element.id"
                    :data-id="element.id">
                    {{ element.name }}

                    <button class="action-button" @click="add">add</button>
                  </li>
              </ul>

              <draggable
                v-if="selected.length > 0"
                class="list-group"
                tag="ul"
                v-model="selected"
                :list="selected"
                v-bind="dragOptions"
                group="selections"
                @start="drag = true"
                @end="drag = false"
                @change="changed"
              >
                <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                  <li
                    class="list-group-item"
                    v-for="(element, index) in selected"
                    :key="element.id"
                  >
                    {{ element.name }}

                    <button class="action-button" @click="removeAt(index)">remove</button>
                  </li>
                </transition-group>
              </draggable>
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
                results: [],
                data_search: null,
                search_hint:null,
                data_post: null,
                response: null,
                updated_slides: [],
                sortable: null,
                selected: null,
                headers: null,
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
          filteredResults() {
            return this.results.filter((item) => {
              return typeof this.selected.find(o => o.id === item.id) === 'undefined';
            });
          },
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
                if (this.search !== null && this.search.length > 2) {
                    this.http.get(this.data_search, {params: {search: this.search}})
                        .then(response => this.results = response.data.data)
                        .catch(error => {
                            window.console.log(error);
                        });
                }
            },
            persistChanges() {
                this.http.post(this.data_post, {updated_slides: this.selected})
                    .then(response => {
                        this.response = String(response.data);
                        setTimeout(() => {
                          this.response = null;
                        }, 1600);
                    })
                    .catch(error => {
                      window.console.log(error);
                    });

                this.results = [];
                this.search = null;
            },
              add: function(e) {
                this.selected.push({ id: e.srcElement.parentElement.dataset.id, name: e.srcElement.parentElement.innerText });
                this.persistChanges();
              },
              removeAt(idx) {
                this.selected.splice(idx, 1);
                this.persistChanges();
              },
              changed: function() {
                this.persistChanges(); // all we need to do here
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

    .drag-and-drop-select {
      position: relative;
      max-width: 500px;
    }
////
    .search-field {
        border: 4px solid #000;
        font-weight: bold;
        font-size: 18px;
        padding: 10px .33em 10px .33em;
        width: 100%;
        margin-bottom: 5px;
    }

    .message {
      position: absolute;
      z-index: 1005;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      .content {
        margin: auto;
        opacity: 0.98;
        font-weight: 600;
        margin-top: 20px;
        align-items: center;
        justify-content: center;
        background-color: pink;
        color: #000;
        width: 200px;
        text-align: center;
        padding: 10px;
      }
    }

    .drags {
        color: #212529;
        width: 100%;
        .list-group {
          display: flex;
          flex-direction: column;
        }

        .action-button {
          border: 2px solid #000;
          color: #000;
          padding: 6px;
          background: transparent;
          text-transform: uppercase;
          font-weight: 700;
          font-size: 10px;
          max-height: 28px;
          letter-spacing: 0.07em;
          &:hover {
            color: #fff;
            background-color: #000;
          }
        }

        ul#results {
            background-color: #fff;
            max-height: 218px;
            min-height: 218px;
            overflow-y: auto;
            position: absolute;
            width: 100%;
            z-index: 1000;
            top: 38px;
        }

        .result-group {
            width: 100%;
            border: 4px solid #000;
            padding: 6px;

            .result-group-item {
                display: grid;
                grid-template-columns: 0.8fr .2fr;
                padding: 0.7rem;
                border-bottom: 2px solid #000;
                color: #000;
                font-weight: bold;
                margin-bottom: 3px;
                align-items: center;
                &.header {
                  h5 {
                    margin: 0px;
                  }

                  .button-close {
                    border: 0px;
                    background: transparent;
                    height: 15px;
                    width: 15px;
                    svg {
                      width: 15px;
                    }
                    margin-left: 72px;
                    margin-top: -8px;
                    &:hover { cursor: pointer; }
                  }
                }
            }
          }

        .list-group {
            width: 100%;
            border: 4px solid #000;
            padding: 6px;
            &.drag-over {
              border: 4px dotted #000;
            }

            .list-group-item {
                display: grid;
                grid-template-columns: 0.8fr .2fr;
                grid-column-gap: 20px;
                align-items: center;
                padding: 1.0rem;
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
