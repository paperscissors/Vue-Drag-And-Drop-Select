<template>
  <div v-if="visibility" ref="selector" class="drag-and-drop-select">
    <div class="components-grid">
      <div v-if="response" class="message" role="alert">
        <transition name="fade">
          <div v-if="response" class="content">
            <p>Changes saved.</p>
          </div>
        </transition>
      </div>
      <input
        v-if="selection_limit > selected.length"
        v-model="search"
        type="text"
        class="search-field"
        :placeholder="search_hint"
      >

      <div class="drags">
        <ul v-if="search !== null" id="results" class="result-group">
          <li class="result-group-item result-header">
            <h5>Search results for "{{ search }}"</h5>
            <button class="button-close" @click="clearSearch">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M23.954 21.03l-9.184-9.095 9.092-9.174-2.832-2.807-9.09 9.179-9.176-9.088-2.81 2.81 9.186 9.105-9.095 9.184 2.81 2.81 9.112-9.192 9.18 9.1z"/></svg>
            </button>
          </li>
          <li
            v-for="element in filteredResults"
            :key="element.id"
            class="result-group-item"
          >
            {{ element.name }}
            <button class="action-button" @click.stop.prevent="add(element)">add</button>
          </li>
        </ul>

        <draggable
          v-if="selected.length > 0"
          v-model="selected"
          class="list-group"
          tag="ul"
          item-key="id"
          v-bind="dragOptions"
          @change="changed"
        >
          <template #item="{ element, index }">
            <li class="list-group-item">
              {{ element.name }}
              <button class="action-button" @click.stop.prevent="removeAt(index)">remove</button>
            </li>
          </template>
        </draggable>
      </div>
      <h4 v-if="selection_limit <= selected.length">Max of {{ selection_limit }} items selected.</h4>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';

export default {
  name: 'DragAndDropSelect',
  components: {
    draggable
  },
  props: {
    selectedItems: {
      type: Array,
      default: () => []
    },
    searchUri: {
      type: String,
      required: true
    },
    postUri: {
      type: String,
      default: ''
    },
    hint: {
      type: String,
      default: ''
    },
    authHeaders: {
      type: Object,
      default: () => ({})
    },
    visibility: {
      type: Boolean,
      default: true
    },
    limit: {
      type: Number,
      default: 999
    }
  },
  emits: ['selected', 'update:selectedItems'],
  data() {
    return {
      search: null,
      results: [],
      search_hint: this.hint,
      data_post: this.postUri,
      data_search: this.searchUri,
      response: null,
      selected: [],
      http: axios.create(this.authHeaders),
      search_timeout: null,
      selection_limit: this.limit || 999
    };
  },
  computed: {
    filteredResults() {
      return this.results.filter((item) => {
        return typeof this.selected.find((selection) => selection.id === item.id) === 'undefined';
      });
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      };
    }
  },
  watch: {
    selectedItems: {
      handler(items) {
        this.selected = Array.isArray(items) ? [...items] : [];
      },
      immediate: true,
      deep: true
    },
    search(after, before) {
      if (after === before) {
        return;
      }
      clearTimeout(this.search_timeout);
      this.search_timeout = setTimeout(() => {
        this.fetch();
      }, 500);
    }
  },
  beforeUnmount() {
    clearTimeout(this.search_timeout);
  },
  methods: {
    clearSearch() {
      this.results = [];
      this.search = null;
    },
    fetch() {
      if (this.search !== null && this.search.length > 2) {
        this.http.get(this.data_search, { params: { search: this.search } })
          .then((response) => {
            const data = response?.data?.data ?? response?.data ?? [];
            this.results = Array.isArray(data) ? data : [];
          })
          .catch((error) => {
            window.console.log(error);
          });
      }
    },
    persistChanges() {
      if (this.data_post) {
        this.http.post(this.data_post, { updated_slides: this.selected })
          .then((response) => {
            this.response = String(response.data);
            setTimeout(() => {
              this.response = null;
            }, 1600);
          })
          .catch((error) => {
            window.console.log(error);
          });
      }

      const payload = [...this.selected];
      this.$emit('selected', payload);
      this.$emit('update:selectedItems', payload);
      this.clearSearch();
    },
    add(element) {
      this.selected.unshift({ id: element.id, name: element.name });
      this.persistChanges();
    },
    removeAt(idx) {
      this.selected.splice(idx, 1);
      this.persistChanges();
    },
    changed() {
      this.persistChanges();
    }
  }
};
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
    .components-grid {
      display: grid;
      h4 {
        text-align:center;
      }
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
                &.result-header {
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
