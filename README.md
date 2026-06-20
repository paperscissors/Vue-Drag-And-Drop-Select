# @paperscissors/drag-and-drop-select

Vue 3 drag-and-drop selector component with async search, sortable selected items, and optional persistence callbacks.

## Requirements

- Node.js 18+
- Vue 3.4+

## Install

```bash
yarn add @paperscissors/drag-and-drop-select
# or
npm install @paperscissors/drag-and-drop-select
```

## Development

```bash
yarn install
yarn dev
```

## Build

```bash
yarn build
```

This generates library bundles in `dist/`:

- `drag-and-drop-select.es.js`
- `drag-and-drop-select.cjs.js`
- `drag-and-drop-select.umd.js`

## Test

```bash
yarn test
```

## Lint

```bash
yarn lint
```

## Usage

```js
import { createApp } from 'vue';
import { DragAndDropSelect } from '@paperscissors/drag-and-drop-select';

createApp({
  components: { DragAndDropSelect },
  data() {
    return {
      items: []
    };
  }
});
```

### Component props

- `selectedItems` (`Array`, default `[]`)
- `searchUri` (`String`, required)
- `postUri` (`String`, optional)
- `hint` (`String`, optional)
- `authHeaders` (`Object`, default `{}`)
- `visibility` (`Boolean`, default `true`)
- `limit` (`Number`, default `999`)
- `persistPayloadKey` (`String`, default `"selectedItems"`)

### Emitted events

- `selected`: emits the updated selected item array
- `update:selectedItems`: emits the updated selected item array for parent syncing (`selected` is retained for compatibility)

## Browser support

Built for modern browsers (Browserslist: `defaults`, excluding IE11).

## Vue 2 -> Vue 3 migration notes

- Tooling moved from Vue CLI to Vite.
- Library output now targets `dist/` bundles instead of pointing `main` to a raw `.vue` file.
- `node-sass` was replaced with `sass`.
- Drag-and-drop integration now uses `vuedraggable` Vue 3 API.
- Props were normalized to camelCase (`selectedItems`, `searchUri`, `postUri`, `authHeaders`).
- Persist payload key now defaults to `selectedItems` and is configurable through `persistPayloadKey` (set to `updated_slides` for legacy integrations).
- Component internals no longer mutate incoming prop references directly.
