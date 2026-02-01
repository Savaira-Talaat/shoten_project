import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import { Route, Routes } from 'react-router-dom';
import BookDetail from '../pages/BookDetail';
import { renderWithRouter } from './renderWithRouter';
import { mockFetch } from './mockFetch';

describe('Page BookDetail', () => {

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('affiche le titre du livre et l\'auteur', async () => {
    mockFetch({
      'works/OL123W.json': {
        title: 'Dune',
        description: 'Une grande aventure dans le désert.',
        authors: [{ author: { key: '/authors/OL1A' } }],
      },
      'authors/OL1A.json': { name: 'Frank Herbert' },
      'works/OL123W/editions.json': {
        entries: [{ publish_date: '1965', covers: [12345] }],
      },
      'wikipedia.org': { extract: 'Dune est un roman de science-fiction.' },
    });

    renderWithRouter(
      <Routes>
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>,
      ['/book/OL123W']
    );

    await waitFor(() => {
      expect(screen.getByText('Dune')).toBeInTheDocument();
      expect(screen.getByText('Frank Herbert')).toBeInTheDocument();
      expect(screen.getByText(/1965/)).toBeInTheDocument();
    });
  });

  it('affiche "Livre introuvable" si le livre n\'existe pas', async () => {
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({ ok: false, json: () => Promise.reject() })
    ));

    renderWithRouter(
      <Routes>
        <Route path="/book/:id" element={<BookDetail />} />
      </Routes>,
      ['/book/INEXISTANT']
    );

    await waitFor(() => {
      expect(screen.getByText(/introuvable/i)).toBeInTheDocument();
    });
  });
});