import { act, cleanup, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from '../App';
import { TOKEN_KEY } from '../api/client';
import type { ApiUser, DayDoses, DoseStatus, LinkInfo } from '../types';
import { MediRecordProvider, useMediRecord } from './MediRecordContext';

const json = (body: unknown, status = 200) =>
  Promise.resolve(new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } }));

const user = (id: number, name: string, role: ApiUser['role'] = 'patient'): ApiUser => ({
  id,
  username: name.toLowerCase(),
  displayName: name,
  role,
  linkCode: role === 'patient' ? '123456' : null,
  fontSize: 'large',
  highContrast: false,
  soundEnabled: true,
  vibrationEnabled: true,
  voiceConfirmationEnabled: true,
  alertWaitMinutes: 60
});
const NO_LINK: LinkInfo = { status: 'none', otherDisplayName: null, otherUsername: null };
const day = (status: DoseStatus, name = 'Metformina'): DayDoses => ({
  date: '2026-11-26',
  isToday: true,
  doses: [{ id: '1_2026-11-26_1400', medicineId: '1', medicineName: name, time: '14:00', doseDescription: '500 mg', status }]
});

type Handler = (method: string) => Promise<Response>;
let routes: Record<string, Handler>;
const fetchMock = vi.fn((url: string, init?: RequestInit) => {
  const path = new URL(url).pathname + new URL(url).search;
  const handler = routes[path] ?? routes[new URL(url).pathname];
  if (!handler) throw new Error(`unmocked ${path}`);
  return handler(init?.method ?? 'GET');
});

function deferred<T>() {
  let resolve!: (v: T) => void;
  const promise = new Promise<T>(r => (resolve = r));
  return { promise, resolve };
}

let ctx: ReturnType<typeof useMediRecord>;
const Probe = () => {
  ctx = useMediRecord();
  return (
    <div>
      <span data-testid="user">{ctx.state.user?.displayName ?? '-'}</span>
      <span data-testid="status">{ctx.state.todayDoses.map(d => `${d.medicineName}:${d.status}`).join(',')}</span>
    </div>
  );
};

beforeEach(() => {
  localStorage.clear();
  fetchMock.mockClear();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function patientRoutes(today: () => Promise<Response>) {
  routes = {
    '/api/me': () => json(user(1, 'Ana')),
    '/api/link': () => json(NO_LINK),
    '/api/medicines': () => json([]),
    '/api/history': () => json([]),
    '/api/doses/today': today
  };
}

describe('MediRecordContext', () => {
  it('a mutation is never overwritten by a stale in-flight refresh', async () => {
    localStorage.setItem(TOKEN_KEY, 't');
    let serverStatus: DoseStatus = 'pending';
    const held = deferred<Response>();
    let holdNext = false;
    patientRoutes(() => {
      if (holdNext) {
        holdNext = false;
        return held.promise; // la respuesta vieja (pending) queda colgada
      }
      return json(day(serverStatus));
    });
    routes['/api/doses/1_2026-11-26_1400/take'] = () => {
      serverStatus = 'taken';
      return json({});
    };
    render(<MediRecordProvider><Probe /></MediRecordProvider>);
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('Metformina:pending'));

    holdNext = true;
    let polling!: Promise<void>;
    act(() => {
      polling = ctx.refresh();
    });
    await act(async () => {
      await ctx.markDoseTaken('1_2026-11-26_1400');
    });
    expect(screen.getByTestId('status').textContent).toBe('Metformina:taken');

    await act(async () => {
      held.resolve(new Response(JSON.stringify(day('pending')), { status: 200 }));
      await polling;
    });
    expect(screen.getByTestId('status').textContent).toBe('Metformina:taken');
  });

  it('data from a previous session never shows after logout + login', async () => {
    localStorage.setItem(TOKEN_KEY, 't-ana');
    const held = deferred<Response>();
    patientRoutes(() => held.promise);
    render(<MediRecordProvider><Probe /></MediRecordProvider>);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());

    act(() => ctx.logout());
    routes = {
      '/api/auth/login': () => json({ token: 't-bea', user: user(2, 'Bea') }),
      '/api/me': () => json(user(2, 'Bea')),
      '/api/link': () => json(NO_LINK),
      '/api/medicines': () => json([]),
      '/api/history': () => json([]),
      '/api/doses/today': () => json(day('pending', 'Aspirina'))
    };
    await act(async () => {
      await ctx.login('bea', 'secret123');
    });
    await waitFor(() => expect(screen.getByTestId('status').textContent).toBe('Aspirina:pending'));

    await act(async () => {
      held.resolve(new Response(JSON.stringify(day('taken', 'Metformina')), { status: 200 }));
      await Promise.resolve();
    });
    expect(screen.getByTestId('user').textContent).toBe('Bea');
    expect(screen.getByTestId('status').textContent).toBe('Aspirina:pending');
  });

  it('actions report failure so callers can keep user input', async () => {
    localStorage.setItem(TOKEN_KEY, 't');
    patientRoutes(() => json(day('pending')));
    routes['/api/me'] = () => json(user(3, 'Augusto', 'caregiver'));
    routes['/api/link/invite'] = () => json({ detail: 'No encontramos a nadie con ese código' }, 404);
    render(<MediRecordProvider><Probe /></MediRecordProvider>);
    await waitFor(() => expect(screen.getByTestId('user').textContent).toBe('Augusto'));
    let ok: boolean | undefined;
    await act(async () => {
      ok = await ctx.inviteByCode('123 457');
    });
    expect(ok).toBe(false);
  });
});

describe('App', () => {
  it('shows a retry screen when the first load fails instead of an empty patient UI', async () => {
    localStorage.setItem(TOKEN_KEY, 't');
    routes = {
      '/api/me': () => json({ detail: 'boom' }, 503),
      '/api/link': () => json(NO_LINK)
    };
    render(<App />);
    expect(await screen.findByRole('button', { name: 'Reintentar' })).toBeTruthy();
    expect(screen.queryByText(/^Hola/)).toBeNull();
  });
});
