import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { X, Camera, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [tag, setTag] = useState('Breakfast');
  const [mood, setMood] = useState('happy');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !imageUrl) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'posts'), {
        authorUid: user.uid,
        authorName: profile?.displayName || user.displayName || 'Anonymous',
        authorPhoto: profile?.photoURL || user.photoURL || '',
        imageUrl,
        tag,
        mood,
        caption,
        likeCount: 0,
        dislikeCount: 0,
        createdAt: serverTimestamp(),
      });
      onClose();
      setImageUrl('');
      setCaption('');
    } catch (error) {
      console.error("Error creating post:", error);
    } finally {
      setLoading(false);
    }
  };

  const tags = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
  const moods = [
    { id: 'happy', emoji: '😊', label: 'Happy' },
    { id: 'neutral', emoji: '😐', label: 'Neutral' },
    { id: 'sad', emoji: '😔', label: 'Sad' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-card-bg border border-border p-8 rounded-sm shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-text-dim hover:text-text-main">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-serif mb-8">Share a Meal</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-text-dim">Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="flex-1 bg-bg border border-border p-3 text-sm focus:border-accent outline-none"
                    required
                  />
                  <button type="button" className="bg-border p-3 text-text-dim hover:text-text-main">
                    <Camera size={20} />
                  </button>
                </div>
                {imageUrl && (
                  <div className="mt-4 aspect-video bg-bg border border-border rounded-sm overflow-hidden">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-text-dim">Meal Type</label>
                  <select
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className="w-full bg-bg border border-border p-3 text-sm focus:border-accent outline-none appearance-none"
                  >
                    {tags.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase tracking-widest text-text-dim">Mood</label>
                  <div className="flex gap-2">
                    {moods.map(m => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMood(m.id)}
                        className={`flex-1 p-2 border transition-all ${mood === m.id ? 'border-accent bg-accent/10' : 'border-border bg-bg'}`}
                        title={m.label}
                      >
                        <span className="text-xl">{m.emoji}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-text-dim">Caption (Optional)</label>
                <textarea
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  maxLength={280}
                  className="w-full bg-bg border border-border p-3 text-sm focus:border-accent outline-none h-24 resize-none"
                  placeholder="What are you eating?"
                />
                <div className="text-[10px] text-right text-text-dim uppercase tracking-widest">
                  {caption.length}/280
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !imageUrl}
                className="w-full bg-accent text-bg p-4 text-xs uppercase tracking-[0.2em] font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? 'Posting...' : 'Post Meal'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreatePostModal;
