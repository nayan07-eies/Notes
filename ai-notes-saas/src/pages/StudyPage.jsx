import React from 'react';
import { StudyAssistant } from '@/features/study/ui/StudyAssistant';

export default function StudyPage() {
  return (
    <div className="min-h-full w-full max-w-5xl mx-auto space-y-8 p-6 bg-gradient-to-br from-card/50 to-background rounded-2xl border border-border shadow-sm">
      <StudyAssistant />
    </div>
  );
}
