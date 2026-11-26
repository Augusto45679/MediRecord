import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { api, ApiError, setOnUnauthorized, TOKEN_KEY } from './client';

const fetchMock = vi.fn();

function fetchReturns(status: number, body?: unknown) {
  fetchMock.mockResolvedValueOnce(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { 'content-type': 'application/json' },
    }),
  );
}

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear();
    fetchMock.mockReset();
    vi.stubGlobal('fetch', fetchMock);
    setOnUnauthorized(() => {});
  });
  afterEach(() => vi.unstubAllGlobals());

  it('sends bearer token and JSON body', async () => {
    localStorage.setItem(TOKEN_KEY, 'abc');
    fetchReturns(200, { ok: true });
    const res = await api<{ ok: boolean }>('/api/x', { method: 'POST', body: { a: 1 } });
    expect(res).toEqual({ ok: true });
    const [url, init] = fetchMock.mock.calls[0];
    expect(String(url)).toMatch(/\/api\/x$/);
    expect(init.method).toBe('POST');
    expect(init.headers.Authorization).toBe('Bearer abc');
    expect(init.headers['Content-Type']).toBe('application/json');
    expect(init.body).toBe(JSON.stringify({ a: 1 }));
  });

  it('401 clears token and calls onUnauthorized', async () => {
    localStorage.setItem(TOKEN_KEY, 'abc');
    const cb = vi.fn();
    setOnUnauthorized(cb);
    fetchReturns(401, { detail: 'Token inválido' });
    await expect(api('/api/me')).rejects.toBeInstanceOf(ApiError);
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull();
    expect(cb).toHaveBeenCalledOnce();
  });

  it('422 array detail becomes first msg', async () => {
    fetchReturns(422, { detail: [{ msg: 'Value error, x' }] });
    const err = (await api('/api/x').catch(e => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(422);
    expect(err.message).toBe('x');
  });

  it('204 resolves undefined', async () => {
    fetchReturns(204);
    await expect(api('/api/x', { method: 'DELETE' })).resolves.toBeUndefined();
  });

  it('network failure becomes ApiError with friendly message', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    const err = (await api('/api/x').catch(e => e)) as ApiError;
    expect(err).toBeInstanceOf(ApiError);
    expect(err.status).toBe(0);
  });
});
