<template>
    <div class="drag-and-drop-select row">
        <div class="col-md-12">
            <div class="alert alert-primary" role="alert" v-if="response">
                {{ response }}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <input type="text" v-model="search" class="drag-and-drop-select-search"
                   :placeholder="search_hint">

            <div v-drag-and-drop:options="options" class="drags">
                <ul id="results">
                    <li v-for="(item) in results" :key="item.id" :data-id="item.id">
                        {{ item.name }}
                    </li>
                </ul>

                <ul id="all_selected">
                    <li v-for="(item) in selected_items" :key="item.id" :data-id="item.id">
                        {{ item.name }}
                    </li>
                </ul>

                <ul id="delete">
                    <i></i>
                </ul>
            </div>

        </div>
    </div>
</template>

<script>
    import axios from 'axios'
    import Vue from 'vue'
    import VueDraggable from 'vue-draggable'

    Vue.use(VueDraggable);

    export default {
      props: ['selected_items', 'search_uri', 'post_uri', 'hint', 'auth_headers'],
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
                http:null,
                options: {
                    dropzoneSelector: 'ul',
                    draggableSelector: 'li',
                    excludeOlderBrowsers: true,
                    multipleDropzonesItemsDraggingEnabled: true,
                    showDropzoneAreas: true,
                    onDrop: (event) => {
                        this.selectionDropped(event);
                    }
                    // ,
                    // onDragstart: function (event) {
                    //
                    // },
                    // onDragend: function (event) {
                    //     // if (String(event.droptarget.id) === "results") {
                    //     //     this.animate();
                    //     //     event.stop();
                    //     // }
                    // }                    //
                }
            }
        },
        name: "DragAndDropSelect",
        watch: {
            search() {
                this.fetch();
            },
            results() {
                if (this.updated_slides.length > 0) {
                    this.selected_items = this.updated_slides
                }
            }
        },
        created() {
          this.data_search = this.search_uri;
          this.data_post = this.post_uri;
          this.search_hint = this.hint;
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
                            return error;
                        });
                }
            },
            persistChanges() {
                let slides = document.getElementById("all_selected").getElementsByTagName("LI");
                let updated_slides = Array.from(slides).map(function (slide) {
                    return {'id': slide.dataset.id, 'name': slide.innerText};
                });

                this.updated_slides = updated_slides;
                this.http.post(this.data_post, {updated_slides: updated_slides})
                    .then(response => {
                        this.response = String(response.data);
                    })
                    .catch(error => {
                      return error;
                    });
            },
            selectedEvent(item) {
                this.selected = item;
            },
            selectionDropped(event) {
                if (String(event.droptarget.id) === "all_selected") {
                    this.persistChanges();
                }

                if (String(event.droptarget.id) === "delete") {
                    event.items[0].remove();
                    this.persistChanges();
                }
            },
            animate: function () {

                this.shake_error = true;
                setTimeout(() => {
                    this.shake_error = false;
                }, 1000);
            }
        }
    }
</script>

<style lang="scss">
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

        ul[aria-dropeffect="move"] {
            border-color: #68b;
            background: #fff;
        }

        ul[aria-dropeffect="move"]:focus,
        ul[aria-dropeffect="move"].dragover {
            outline: none;
            box-shadow: 0 0 0 1px #fff, 0 0 0 3px #68b;
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
        ul {
            border: 4px solid #000;
            padding: 6px;

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
