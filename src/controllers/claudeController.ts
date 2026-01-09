import { Response } from 'express';
import Anthropic from '@anthropic-ai/sdk';
import { AuthRequest } from '../middleware/auth';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Extract job information from text
export const extractJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { text, url } = req.body;

    if (!text && !url) {
      res.status(400).json({ error: 'Text or URL is required' });
      return;
    }

    const prompt = `Extract job information from the following text and return it as a JSON object with these fields:
- company (string): Company name
- role (string): Job title/role
- location (string): Job location
- type (string): One of "Remote", "Hybrid", or "On-site"
- deadline (string): Application deadline if mentioned, otherwise empty string
- notes (string): Any additional important details

Text to analyze:
${text || `Job posting URL: ${url}`}

Return ONLY valid JSON, no additional text.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const extractedData = JSON.parse(jsonMatch[0]);
        res.json(extractedData);
      } else {
        res.status(500).json({ error: 'Failed to extract job information' });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response format' });
    }
  } catch (error) {
    console.error('Extract job error:', error);
    res.status(500).json({ error: 'Failed to extract job information' });
  }
};

// Categorize job based on status
export const categorizeJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { company, role, notes, currentStatus } = req.body;

    if (!company || !role) {
      res.status(400).json({ error: 'Company and role are required' });
      return;
    }

    const prompt = `Based on the following job information, suggest the most appropriate status category:
Company: ${company}
Role: ${role}
Notes: ${notes || 'None'}
Current Status: ${currentStatus || 'Unknown'}

Available status categories:
- Wishlist: Jobs you're interested in but haven't applied yet
- Applied: Jobs you've submitted applications for
- Interview: Jobs where you have scheduled or completed interviews
- Offer: Jobs where you've received an offer
- Rejected: Jobs where you've been rejected or declined

Analyze the information and return ONLY a JSON object with this structure:
{
  "suggestedStatus": "one of the status categories above",
  "reason": "brief explanation for the suggestion"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 512,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        res.json(result);
      } else {
        res.status(500).json({ error: 'Failed to categorize job' });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response format' });
    }
  } catch (error) {
    console.error('Categorize job error:', error);
    res.status(500).json({ error: 'Failed to categorize job' });
  }
};

// Analyze resume and provide suggestions
export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeText, jobDescription } = req.body;

    if (!resumeText) {
      res.status(400).json({ error: 'Resume text is required' });
      return;
    }

    const prompt = jobDescription
      ? `Analyze the following resume against this job description and provide feedback:

Job Description:
${jobDescription}

Resume:
${resumeText}

Provide a JSON response with:
{
  "matchScore": number (0-100),
  "strengths": array of strings (key strengths that match the job),
  "gaps": array of strings (missing skills or experience),
  "suggestions": array of strings (specific improvements to make)
}`
      : `Analyze the following resume and provide general feedback:

Resume:
${resumeText}

Provide a JSON response with:
{
  "strengths": array of strings (key strengths),
  "improvements": array of strings (areas to improve),
  "suggestions": array of strings (specific recommendations)
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const content = message.content[0];
    if (content.type === 'text') {
      const jsonMatch = content.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const analysis = JSON.parse(jsonMatch[0]);
        res.json(analysis);
      } else {
        res.status(500).json({ error: 'Failed to analyze resume' });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response format' });
    }
  } catch (error) {
    console.error('Analyze resume error:', error);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
};
