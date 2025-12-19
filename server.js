import express from 'express';
import cors from 'cors';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const anthropic = new Anthropic({
  apiKey: process.env.VITE_ANTHROPIC_API_KEY,
});

app.post('/api/scrape', async (req, res) => {
  const { url, type } = req.body;

  if (!url || !type) {
    return res.status(400).json({ error: 'URL and type are required' });
  }

  console.log(`[Scraper] Starting scrape for ${type}: ${url}`);

  // Check if API key is configured
  if (!process.env.VITE_ANTHROPIC_API_KEY) {
    console.error('[Scraper] Missing VITE_ANTHROPIC_API_KEY in environment');
    return res.status(500).json({
      error: 'Server configuration error',
      details: 'Anthropic API key not configured'
    });
  }

  try {
    // Fetch the webpage content
    console.log('[Scraper] Fetching URL...');
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status} ${response.statusText}`);
    }

    const html = await response.text();
    console.log(`[Scraper] Fetched ${html.length} characters of HTML`);

    // Use Claude to extract structured data
    const prompt = type === 'event'
      ? `You are extracting event information from a webpage. Analyze the following HTML and extract:
- title: The event title
- description: A detailed description of the event
- event_date: The event date in YYYY-MM-DD format if available
- event_time: The event time if available
- end_date: The end date if it's a multi-day event in YYYY-MM-DD format
- location: The full location string
- address: Street address
- city: City name
- state: State/province
- country: Country name
- postal_code: Postal/ZIP code
- venue: Venue name
- format: "in-person", "virtual", or "hybrid"
- cost: The cost (e.g., "Free", "$25", "$10-$50")
- organizer: The organizer/host name
- category: Event category (e.g., "networking", "workshop", "conference")
- image_url: The URL of the event image if available
- source_url: Use "${url}" as the source
- slug: A URL-friendly slug based on the title (lowercase, hyphens, no special chars)
- tags: An array of relevant tags

Return ONLY a valid JSON object with these fields. Use null for any missing fields. Do not include any explanatory text.

HTML Content:
${html.substring(0, 15000)}`
      : `You are extracting opportunity information (job or volunteer position) from a webpage. Analyze the following HTML and extract:
- title: The opportunity title
- description: A detailed description
- type: "job" or "volunteer" (infer from context)
- organization: The organization name
- location: The location (physical address or "Remote")
- format: "remote", "in-person", or "hybrid"
- external_url: The application URL or external listing URL
- commitment: The time commitment (e.g., "part-time", "full-time", "one-time", "ongoing")
- requirements: The requirements or qualifications
- application_deadline: The deadline in YYYY-MM-DD format if available
- posted_date: When it was posted in YYYY-MM-DD format if available
- compensation: Salary info for jobs or "unpaid" for volunteer
- image_url: The URL of the opportunity image if available
- slug: A URL-friendly slug based on the title
- tags: An array of relevant tags

Return ONLY a valid JSON object with these fields. Use null for any missing fields. Do not include any explanatory text.

HTML Content:
${html.substring(0, 15000)}`;

    console.log('[Scraper] Calling Claude API...');
    const message = await anthropic.messages.create({
      model: 'claude-3-opus-20240229',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    console.log('[Scraper] Received response from Claude');

    // Parse the response
    const content = message.content[0].text;
    console.log('[Scraper] Claude response:', content.substring(0, 200) + '...');

    let extractedData;

    try {
      extractedData = JSON.parse(content);
      console.log('[Scraper] Successfully parsed JSON');
    } catch (parseError) {
      console.log('[Scraper] Direct JSON parse failed, attempting to extract...');
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0]);
        console.log('[Scraper] Successfully extracted and parsed JSON');
      } else {
        console.error('[Scraper] Failed to find JSON in response');
        throw new Error('Failed to parse extracted data');
      }
    }

    // Ensure source_url is set
    extractedData.source_url = url;

    console.log('[Scraper] Successfully processed. Sending response.');
    res.json(extractedData);
  } catch (error) {
    console.error('[Scraper] Error occurred:', error);
    console.error('[Scraper] Error stack:', error.stack);
    res.status(500).json({
      error: 'Failed to scrape URL',
      details: error.message,
      type: error.constructor.name
    });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});
