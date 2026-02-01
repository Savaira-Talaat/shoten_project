import { screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AdvancedSearch from '../pages/AdvancedSearch';
import { renderWithRouter } from './renderWithRouter';

describe('Page AdvancedSearch', () => {

  it('le bouton Rechercher est désactivé au départ', () => {
    renderWithRouter(<AdvancedSearch />);
    const bouton = screen.getByText('Rechercher');
    expect(bouton).toBeDisabled();
  });

  it('le bouton se reactive dès qu\'on tape quelque chose', () => {
    renderWithRouter(<AdvancedSearch />);

    const champTitre = screen.getByPlaceholderText(/dune/i);
    fireEvent.change(champTitre, { target: { value: 'Dune' } });

    const bouton = screen.getByText('Rechercher');
    expect(bouton).not.toBeDisabled();
  });

  it('réinitialise les champs quand on clique Réinitialiser', () => {
    renderWithRouter(<AdvancedSearch />);

    const champTitre = screen.getByPlaceholderText(/dune/i);
    fireEvent.change(champTitre, { target: { value: 'Dune' } });

    const boutonReset = screen.getByText('Réinitialiser');
    fireEvent.click(boutonReset);

    expect(champTitre).toHaveValue('');
  });
});