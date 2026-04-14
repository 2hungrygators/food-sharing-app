import React, { useState, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { X, Camera, Image as ImageIcon, Loader2 } from 'lucide-react';
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
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setError(null);
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    setLoading(true);
    const storageRef = ref(storage, `meals/${user.uid}/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      }, 
      (err) => {
        console.error("Upload failed:", err);
        setError("Upload failed. Please try again.");
        setLoading(false);
        setUploadProgress(null);
      }, 
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setImageUrl(downloadURL);
        setLoading(false);
        setUploadProgress(null);
      }
    );
  };

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
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
            className="relative w-full max-w-xl bg-card-bg border border-border p-6 sm:p-8 rounded-sm shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <button onClick={onClose} className="absolute top-4 right-4 text-text-dim hover:text-text-main">
              <X size={24} />
            </button>

            <h2 className="text-2xl font-serif mb-6 sm:mb-8">Share a Meal</h2>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 mb-6 text-red-500 text-[10px] uppercase tracking-widest">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-[10px] uppercase tracking-widest text-text-dim">Meal Photo</label>
                
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  accept="image/*" 
                  className="hidden" 
                />

                {!imageUrl ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={loading}
                    className="w-full aspect-video bg-bg border border-dashed border-border flex flex-col items-center justify-center gap-3 hover:border-accent transition-colors group"
                  >
                    {loading ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="animate-spin text-accent" size={32} />
                        <span className="text-[10px] uppercase tracking-widest text-accent">
                          Uploading {uploadProgress ? `${Math.round(uploadProgress)}%` : ''}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-border flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                          <Camera className="text-text-dim group-hover:text-accent" size={24} />
                        </div>
                        <span className="text-[10px] uppercase tracking-widest text-text-dim">Tap to take or upload photo</span>
                      </>
                    )}
                  </button>
                ) : (
                  <div className="relative aspect-video bg-bg border border-border rounded-sm overflow-hidden">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    <button 
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white hover:bg-black"
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
                
                <div className="flex items-center gap-2 py-2">
                  <div className="h-px flex-1 bg-border"></div>
                  <span className="text-[10px] uppercase tracking-widest text-text-dim">Or use URL</span>
                  <div className="h-px flex-1 bg-border"></div>
                </div>

                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-bg border border-border p-3 text-sm focus:border-accent outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
