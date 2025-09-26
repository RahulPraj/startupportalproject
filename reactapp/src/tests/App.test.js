import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import IdeaForm from '../components/IdeaForm';
import ValidationBoard from '../components/ValidationBoard';
import * as api from '../services/api';

jest.mock('../services/api');

const mockIdeas = [
  { id: 1, ideaTitle: 'Idea One', description: 'Description one', targetMarket: 'Market A', estimatedBudget: 1000 },
  { id: 2, ideaTitle: 'Idea Two', description: 'Description two', targetMarket: 'Market B', estimatedBudget: 2000 }
];

describe('Startup Idea Validation Portal - Easy Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1 ✅ Renders app title
  test('renders app title', () => {
    api.getIdeas.mockResolvedValue([]);
    render(<App />);
    expect(screen.getByText(/Startup Idea Validation Portal/i)).toBeInTheDocument();
  });

  // 2 ✅ Fetches and displays ideas
  test('fetches and displays ideas', async () => {
    api.getIdeas.mockResolvedValueOnce(mockIdeas);
    render(<App />);
    expect(await screen.findByText('Idea One')).toBeInTheDocument();
    expect(screen.getByText('Idea Two')).toBeInTheDocument();
  });

  // 3 ✅ Shows empty message if no ideas
  test('shows empty table if no ideas', async () => {
    api.getIdeas.mockResolvedValueOnce([]);
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/No ideas to display/i)).toBeInTheDocument();
    });
  });

  // 4 ✅ Handles fetch error gracefully
  test('handles fetch error gracefully', async () => {
    api.getIdeas.mockRejectedValueOnce(new Error('Error fetching'));
    render(<App />);
    expect(await screen.findByText(/Startup Idea Validation Portal/i)).toBeInTheDocument();
  });

  test('renders idea form inputs', () => {
    render(<IdeaForm onAdd={jest.fn()} />);
    expect(screen.getByPlaceholderText(/Idea Title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Describe your idea/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g., Small Businesses, Online Retailers/i)).toBeInTheDocument(); // <-- fixed line
    expect(screen.getByPlaceholderText(/e.g., 20000/i)).toBeInTheDocument();
  });
  

  // 6 ✅ Submits form and calls API
  test('submits form and calls addIdea API', async () => {
    const mockAdd = jest.fn();
    api.addIdea.mockResolvedValueOnce({});
    render(<IdeaForm onAdd={mockAdd} />);
    fireEvent.change(screen.getByPlaceholderText(/Idea Title/i), { target: { value: 'New Idea' } });
    fireEvent.change(screen.getByPlaceholderText(/Describe your idea/i), { target: { value: 'A great idea' } });
    fireEvent.click(screen.getByRole('button', { name: /Submit Idea/i }));
    await waitFor(() => expect(api.addIdea).toHaveBeenCalled());
  });

  // 7 ✅ Handles delete button click
  test('handles delete button click', async () => {
    api.getIdeas.mockResolvedValueOnce(mockIdeas);
    api.deleteIdea.mockResolvedValueOnce({});
    render(<App />);
    expect(await screen.findByText('Idea One')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    await waitFor(() => expect(api.deleteIdea).toHaveBeenCalledWith(1));
  });

  // 8 ✅ Handles delete API error
  test('handles delete API error', async () => {
    api.getIdeas.mockResolvedValueOnce(mockIdeas);
    api.deleteIdea.mockRejectedValueOnce(new Error('Delete error'));
    render(<App />);
    expect(await screen.findByText('Idea One')).toBeInTheDocument();
    fireEvent.click(screen.getAllByText(/Delete/i)[0]);
    await waitFor(() => expect(api.deleteIdea).toHaveBeenCalled());
  });

  // 9 ✅ Displays correct target market and budget
  test('displays correct target market and budget', () => {
    render(<ValidationBoard ideas={mockIdeas} viewMode="all" onDelete={jest.fn()} />);
    expect(screen.getByText('Market A')).toBeInTheDocument();
    expect(screen.getByText('Market B')).toBeInTheDocument();
    expect(screen.getByText('1000')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  // 10 ✅ Displays validated view with score and feedback
  test('displays validated ideas with score and feedback', () => {
    const validatedIdeas = [
      { id: 1, ideaTitle: 'Idea Val 1', averageScore: 4.5, feedback: 'Great!' },
      { id: 2, ideaTitle: 'Idea Val 2', averageScore: 3.2, feedback: 'Needs work.' }
    ];
    render(<ValidationBoard ideas={validatedIdeas} viewMode="validated" onDelete={jest.fn()} />);
    expect(screen.getByText('4.5')).toBeInTheDocument();
    expect(screen.getByText('Great!')).toBeInTheDocument();
    expect(screen.getByText('3.2')).toBeInTheDocument();
    expect(screen.getByText('Needs work.')).toBeInTheDocument();
  });
});
