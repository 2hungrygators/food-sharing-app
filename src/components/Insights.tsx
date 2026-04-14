import React from 'react';
import { useAuth } from '../context/AuthContext';

const Insights: React.FC = () => {
  const { profile } = useAuth();

  return (
    <div className="w-[300px] p-10 border-l border-border flex flex-col gap-10 h-screen sticky top-0 overflow-y-auto">
      <div className="stat-group">
        <h3 className="stat-label">Current Streak</h3>
        <div className="flex items-baseline gap-2">
          <span className="streak-num">{profile?.streak || 0}</span>
          <span className="text-sm text-text-dim uppercase tracking-wider">Days</span>
        </div>
      </div>

      <div className="stat-group">
        <h3 className="stat-label">Mood Trends</h3>
        <div className="flex items-end gap-3 h-[100px] pb-2 border-bottom border-border">
          <div className="flex-1 bg-accent rounded-t-sm relative h-[80%]">
            <span className="absolute -bottom-6 w-full text-center text-[10px] text-text-dim">Happy</span>
          </div>
          <div className="flex-1 bg-border rounded-t-sm relative h-[45%]">
            <span className="absolute -bottom-6 w-full text-center text-[10px] text-text-dim">Neut.</span>
          </div>
          <div className="flex-1 bg-border rounded-t-sm relative h-[20%]">
            <span className="absolute -bottom-6 w-full text-center text-[10px] text-text-dim">Sad</span>
          </div>
        </div>
      </div>

      <div className="stat-group mt-4">
        <h3 className="stat-label">Accountability</h3>
        <p className="text-[13px] text-text-dim leading-relaxed">
          You've received <span className="text-text-main font-semibold">{profile?.totalLikes || 0} thumbs up</span> this week from your circle. You're in the top 10% of your group's consistency.
        </p>
      </div>

      <div className="mt-auto p-4 bg-card-bg border border-border rounded-sm">
        <h4 className="text-xs font-semibold mb-2 text-accent uppercase tracking-widest">Pro Tip</h4>
        <p className="text-[11px] text-text-dim italic">
          "Consistency is better than perfection. Log every meal, even the 'bad' ones."
        </p>
      </div>
    </div>
  );
};

export default Insights;
