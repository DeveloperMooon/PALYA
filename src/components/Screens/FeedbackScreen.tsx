
import React, { useState } from 'react';
import { MessageSquare, Send, Star } from 'lucide-react';
import { featureApi } from '../../services/palyaFeaturesApi';

export const FeedbackScreen: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [category, setCategory] = useState('Suggestion');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('');
    setBusy(true);

    try {
      await featureApi('/feedback', {
        method: 'POST',
        body: JSON.stringify({
          rating,
          category,
          message: message.trim()
        })
      });

      setMessage('');
      setRating(0);
      setStatus('Feedback submitted successfully. Thank you.');
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : 'Could not send feedback.'
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-5 pb-12">
      <div className="flex items-center gap-3">
        <MessageSquare className="w-7 h-7 text-primary" />
        <div>
          <h1 className="text-2xl font-black text-on-surface">
            Feedback
          </h1>
          <p className="text-sm text-on-surface-variant">
            Share a suggestion, report an issue or rate PALYA.
          </p>
        </div>
      </div>

      <form
        onSubmit={submit}
        className="bg-surface-container-lowest border border-outline-variant/60 rounded-2xl shadow-xs p-6 space-y-5"
      >
        <div>
          <label className="block text-sm font-bold mb-2">
            Rate your experience
          </label>
          <div
            className="flex gap-2"
            role="group"
            aria-label="Rating"
          >
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setRating(n)}
                aria-label={`${n} stars`}
                aria-pressed={rating === n}
              >
                <Star
                  className={`w-8 h-8 ${
                    n <= rating
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-outline'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label
            htmlFor="palya-feedback-category"
            className="block text-sm font-bold mb-2"
          >
            Category
          </label>
          <select
            id="palya-feedback-category"
            className="w-full rounded-xl border border-outline-variant bg-surface p-3"
            value={category}
            onChange={e => setCategory(e.target.value)}
          >
            {[
              'Suggestion',
              'Bug Report',
              'Complaint',
              'General Feedback'
            ].map(v => (
              <option key={v}>{v}</option>
            ))}
          </select>
        </div>

        <div>
          <label
            htmlFor="palya-feedback-message"
            className="block text-sm font-bold mb-2"
          >
            Your feedback
          </label>
          <textarea
            id="palya-feedback-message"
            required
            minLength={5}
            maxLength={2000}
            value={message}
            onChange={e => setMessage(e.target.value)}
            rows={5}
            placeholder="Tell us what you think..."
            className="w-full rounded-xl border border-outline-variant bg-surface p-3"
          />
        </div>

        {status && (
          <p role="status" className="text-sm text-on-surface">
            {status}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !rating || message.trim().length < 5}
          className="inline-flex items-center gap-2 rounded-xl px-5 py-3 bg-primary text-on-primary font-bold disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {busy ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  );
};
