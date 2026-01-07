import { Response } from 'express';
import { Job } from '../models/Job';
import { AuthRequest } from '../middleware/auth';
import mongoose from 'mongoose';

export const getJobs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
};

export const createJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const job = new Job({
      ...req.body,
      userId: req.userId
    });
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
};

export const updateJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const job = await Job.findOneAndUpdate(
      { _id: id, userId: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
};

export const deleteJob = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const job = await Job.findOneAndDelete({ _id: id, userId: req.userId });

    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }

    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
};
