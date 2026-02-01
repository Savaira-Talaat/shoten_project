import { screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Navbar from '../components/Navbar';
import { renderWithRouter } from './renderWithRouter';

describe('Composant Navbar', () => {
  it('affiche le logo et les liens de navigation', () => {
    renderWithRouter(<Navbar />);
    expect(screen.getByText('Shoten')).toBeInTheDocument();
    expect(screen.getByText('Recherche avancée')).toBeInTheDocument();
    expect(screen.getByText('Accueil')).toBeInTheDocument();
  })
});