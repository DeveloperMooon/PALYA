
import { Router } from 'express';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { supabase } from '../db/supabase';

const router = Router();

interface SessionPayload extends jwt.JwtPayload {
  sub: string;
  role: string;
}

async function getAuthenticatedUser(req: Request) {
  const token = req.cookies?.palya_session;

  if (!token || !process.env.JWT_SECRET) {
    return null;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as SessionPayload;

    if (typeof payload.sub !== 'string') {
      return null;
    }

    const { data, error } = await supabase
      .from('app_users')
      .select('id, role')
      .eq('id', payload.sub)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data;
  } catch {
    return null;
  }
}

// Submit feedback - every authenticated role
router.post('/', async (req: Request, res: Response) => {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return res.status(401).json({
        error: 'Please log in to submit feedback.'
      });
    }

    const { rating, category, message } = req.body;

    const validCategories = [
      'Suggestion',
      'Bug Report',
      'Complaint',
      'General Feedback'
    ];

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return res.status(400).json({
        error: 'Please select a rating between 1 and 5.'
      });
    }

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        error: 'Invalid feedback category.'
      });
    }

    if (
      typeof message !== 'string' ||
      message.trim().length < 5 ||
      message.trim().length > 2000
    ) {
      return res.status(400).json({
        error: 'Feedback must contain 5 to 2000 characters.'
      });
    }

    const { data, error } = await supabase
      .from('palya_feedback')
      .insert({
        user_id: user.id,
        user_role: user.role,
        rating,
        category,
        message: message.trim(),
        status: 'new'
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json({
      success: true,
      message: 'Feedback submitted successfully.',
      data
    });

  } catch (error) {
    console.error('Feedback submission error:', error);

    return res.status(500).json({
      error: 'Failed to submit feedback.'
    });
  }
});

// Admin only - view all feedback
router.get('/', async (req: Request, res: Response) => {
  try {
    const user = await getAuthenticatedUser(req);

    if (!user) {
      return res.status(401).json({
        error: 'Authentication required.'
      });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({
        error: 'Admin access required.'
      });
    }

    const { data, error } = await supabase
      .from('palya_feedback')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      throw error;
    }

    return res.json({
      success: true,
      data: data || []
    });

  } catch (error) {
    console.error('Feedback fetch error:', error);

    return res.status(500).json({
      error: 'Failed to fetch feedback.'
    });
  }
});

export const feedbackRouter = router;
