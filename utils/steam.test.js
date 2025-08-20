import assert from 'node:assert/strict';
import test from 'node:test';
import { fetchInventory } from './steam.js';

test('fetchInventory returns response data', async () => {
  const steamid = '123';
  let calledUrl = '';
  global.fetch = async (url) => {
    calledUrl = url;
    return {
      ok: true,
      json: async () => ({ response: { games: [{ appid: 1 }] } }),
    };
  };

  const data = await fetchInventory(steamid);
  assert.ok(calledUrl.includes(`steamid=${steamid}`));
  assert.deepEqual(data, { games: [{ appid: 1 }] });
});

test('fetchInventory throws on non-ok response', async () => {
  global.fetch = async () => ({ ok: false, json: async () => ({}) });
  await assert.rejects(() => fetchInventory('123'), /Failed to fetch inventory/);
});

