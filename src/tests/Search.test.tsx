import { screen, waitFor } from '@testing-library/react';
import { describe, it, expect, afterEach, vi } from 'vitest';
import Search from '../pages/Search';
import { renderWithRouter } from './renderWithRouter';
import { mockFetch } from './mockFetch';

describe('Page Search', () => {

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('affiche les résultats de recherche', async () => {
    mockFetch({
      'openlibrary.org/search.json': {
        numFound: 2,
        docs: [
          { key: '/works/OL1W', title: 'Dune', author_name: ['Frank Herbert'] },
          { key: '/works/OL2W', title: 'Foundation', author_name: ['Isaac Asimov'] },
        ],
      },
    });
    renderWithRouter(<Search />, ['/search?q=dune']);
    await waitFor(() => {
      expect(screen.getByText('Dune')).toBeInTheDocument();
      expect(screen.getByText('Foundation')).toBeInTheDocument();
      expect(screen.getByText(/2 résultat/i)).toBeInTheDocument();
    });
  });

  it('affiche "Aucun résultat" si l\'API retourne une liste vide', async () => {
    mockFetch({
      'openlibrary.org/search.json': { numFound: 0, docs: [] },
    });
    renderWithRouter(<Search />, ['/search?q=xyzinexistant']);
    await waitFor(() => {
      expect(screen.getByText(/Aucun résultat/i)).toBeInTheDocument();
    });
  });

  it('affiche un message si aucune recherche n\'a été lancée', () => {
    renderWithRouter(<Search />, ['/search']);
    expect(screen.getByText(/recherche avancée/i)).toBeInTheDocument();
  });
});