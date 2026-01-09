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

// Categorize all jobs by role type
export const categorizeJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { jobs } = req.body;

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      res.status(400).json({ error: 'Jobs array is required' });
      return;
    }

    const jobsList = jobs.map((job, idx) =>
      `${idx}: ${job.role} at ${job.company}`
    ).join('\n');

    const prompt = `Categorize these jobs into role-based categories (like "Software Engineering", "Product Manager", "Design", "Data Science", etc.).

Jobs:
${jobsList}

Return ONLY a JSON object with this structure:
{
  "categories": [
    {
      "name": "Category Name",
      "jobIds": [array of job _id values that belong to this category]
    }
  ]
}

Use the actual _id values from the jobs provided. Group similar roles together.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 2048,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
        {
          role: 'assistant',
          content: 'Here are the job details with their IDs:\n' + jobs.map((job, idx) =>
            `${idx}: ID=${job._id}, Role=${job.role}, Company=${job.company}`
          ).join('\n'),
        },
        {
          role: 'user',
          content: 'Now categorize them using their actual _id values.',
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
        res.status(500).json({ error: 'Failed to categorize jobs' });
      }
    } else {
      res.status(500).json({ error: 'Unexpected response format' });
    }
  } catch (error) {
    console.error('Categorize jobs error:', error);
    res.status(500).json({ error: 'Failed to categorize jobs' });
  }
};

// Analyze resume against jobs
export const analyzeResume = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { resumeText, jobs } = req.body;

    if (!resumeText) {
      res.status(400).json({ error: 'Resume text is required' });
      return;
    }

    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      res.status(400).json({ error: 'Jobs array is required' });
      return;
    }

    const jobsList = jobs.map(job =>
      `• ${job.role} at ${job.company} (${job.location}, ${job.type})`
    ).join('\n');

    const prompt = `You are a career advisor analyzing a resume against job applications.

Resume:
${resumeText}

Jobs Applied To:
${jobsList}

Provide a comprehensive analysis as an HTML string with:
1. Overall assessment of the resume quality
2. How well the resume matches the types of roles applied to
3. Key strengths that align with these positions
4. Gaps or missing skills for these roles
5. Specific, actionable suggestions to improve the resume for these applications

Format your response as HTML with proper styling. Use headings, lists, and emphasis where appropriate. Make it visually appealing and easy to read.

Return ONLY a JSON object with this structure:
{
  "analysis": "<complete HTML string here>"
}`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
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
