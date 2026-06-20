import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';
import axios from 'axios';
import DragAndDropSelect from './DragAndDropSelect.vue';

vi.mock('axios', () => ({
  default: {
    create: vi.fn()
  }
}));

const DraggableStub = {
  name: 'draggable',
  props: {
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: ['update:modelValue', 'change'],
  template: `
    <ul>
      <slot
        v-for="(element, index) in modelValue"
        :key="element.id"
        name="item"
        :element="element"
        :index="index"
      />
    </ul>
  `
};

const mountComponent = (overrides = {}) => {
  const get = vi.fn().mockResolvedValue({ data: { data: [] } });
  const post = vi.fn().mockResolvedValue({ data: 'ok' });
  axios.create.mockReturnValue({ get, post });

  const wrapper = mount(DragAndDropSelect, {
    props: {
      selectedItems: [{ id: '1', name: 'One' }],
      searchUri: '/search',
      postUri: '/post',
      ...overrides
    },
    global: {
      stubs: {
        draggable: DraggableStub
      }
    }
  });

  return { wrapper, get, post };
};

describe('DragAndDropSelect', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('copies selectedItems into local state', () => {
    const source = [{ id: '1', name: 'One' }];
    const { wrapper } = mountComponent({ selectedItems: source });

    expect(wrapper.vm.selected).toEqual(source);
    expect(wrapper.vm.selected).not.toBe(source);
  });

  it('adds a new selection and persists changes', async () => {
    const { wrapper, post } = mountComponent();

    wrapper.vm.add({ id: '2', name: 'Two' });
    await nextTick();

    expect(wrapper.vm.selected[0]).toEqual({ id: '2', name: 'Two' });
    expect(post).toHaveBeenCalledWith('/post', { selectedItems: wrapper.vm.selected });
    expect(wrapper.emitted('selected')).toBeTruthy();
    expect(wrapper.emitted('update:selectedItems')).toBeTruthy();
  });

  it('fetches search results after debounce', async () => {
    const { wrapper, get } = mountComponent();

    wrapper.vm.search = 'abcd';
    await nextTick();

    vi.runAllTimers();
    await Promise.resolve();

    expect(get).toHaveBeenCalledWith('/search', { params: { search: 'abcd' } });
  });

  it('normalizes malformed search payloads to an empty result set', async () => {
    const { wrapper, get } = mountComponent();
    get.mockResolvedValueOnce({ data: { invalid: true } });

    wrapper.vm.search = 'abcd';
    await wrapper.vm.fetch();

    expect(wrapper.vm.results).toEqual([]);
  });

  it('handles search failures without throwing', async () => {
    const logSpy = vi.spyOn(window.console, 'log').mockImplementation(() => {});
    const { wrapper, get } = mountComponent();
    get.mockRejectedValueOnce(new Error('network'));

    wrapper.vm.search = 'abcd';
    await wrapper.vm.fetch();

    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });

  it('removes selected items and persists', () => {
    const { wrapper, post } = mountComponent();

    wrapper.vm.removeAt(0);

    expect(wrapper.vm.selected).toHaveLength(0);
    expect(post).toHaveBeenCalled();
  });

  it('supports custom persistence payload key', async () => {
    const { wrapper, post } = mountComponent({ persistPayloadKey: 'updated_slides' });

    wrapper.vm.add({ id: '2', name: 'Two' });
    await nextTick();

    expect(post).toHaveBeenCalledWith('/post', { updated_slides: wrapper.vm.selected });
  });
});
