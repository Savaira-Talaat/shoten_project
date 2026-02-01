import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Accueil from '../pages/Home';
import { renderWithRouter } from './renderWithRouter';
import { mockFetch } from './mockFetch';

const fakeData = [
  {
    id: 1,
    kind: 'update',
    timestamp: '2024-06-15T10:00:00Z',
    data: { title: 'Dune', key: '/works/OL123W' },
  },
  {
    id: 2,
    kind: 'insert',
    timestamp: '2024-06-16T12:00:00Z',
    data: { title: '1984', key: '/works/OL456W' },
  },
];

describe('Page Accueil', () => {

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('affiche un message de chargement au départ', () => {
    mockFetch({ 'recentchanges.json': fakeData });
    renderWithRouter(<Accueil />);
    expect(screen.getByText(/Chargement/i)).toBeInTheDocument();
  });

  it('affiche les changements récents après le chargement', async () => {
    mockFetch({ 'recentchanges.json': fakeData });
    renderWithRouter(<Accueil />);
    await waitFor(() => {
      expect(screen.getByText('Dune')).toBeInTheDocument();
      expect(screen.getByText('1984')).toBeInTheDocument();
    });
  });

  it('affiche un message d\'erreur si le fetch échoue', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.reject() })
    ));
    renderWithRouter(<Accueil />);
    await waitFor(() => {
      expect(screen.getByText(/erreur/i)).toBeInTheDocument();
    });
  });
});