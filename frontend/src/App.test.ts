import { test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/svelte';
import App from './App.svelte';

  //Article Content
const mockArticle = {
  headline: { main: "Test Article Title" },
  snippet: "This is a test article summary",
  web_url: "https://example.com/article",
  multimedia: [
    {
      url: "test-image.jpg",
      subtype: "photo",
      type: "image"
    }
  ]
};

test('shows articles when loaded', async () => {
  // Mock fetch
  global.fetch = vi.fn()
    // First mock the API key response
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ apiKey: "test-key" })
    })
    //mock articles response
    .mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ 
        response: { docs: [mockArticle] } 
      })
    });

  // Render component
  render(App);

  // Wait for content 
  await new Promise(resolve => setTimeout(resolve, 100));

  // Check article
  expect(screen.getByText("Test Article Title")).toBeTruthy();
  expect(screen.getByText("This is a test article summary")).toBeTruthy();
  
  // Check the "Read More" link exists
  const link = screen.getByText("Read More");
  expect(link.getAttribute('href')).toBe("https://example.com/article");
});


test('Check correct querry (Davis/Sacramento news)', async () => {
  // watch fetch function with spyOn call
  const fetchSpy = vi.spyOn(global, 'fetch');
  
  // Mock API responses
  fetchSpy.mockResolvedValueOnce({ 
    ok: true,
    json: () => Promise.resolve({ apiKey: "test-key" })
  });
  //Article
  fetchSpy.mockResolvedValueOnce({ 
    ok: true,
    json: () => Promise.resolve({ response: { docs: [] } })
  });

  render(App);
  
  await new Promise(resolve => setTimeout(resolve, 100));

  //Check URLs 
  const nytCall = fetchSpy.mock.calls[1][0]; // Second fetch call
  expect(nytCall).toContain("q=Davis%20OR%20Sacramento");
  expect(nytCall).toContain("api-key=test-key");
});