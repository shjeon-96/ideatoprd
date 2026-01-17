'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Sparkles, Lightbulb, Rocket, FileText } from 'lucide-react';
import { Button } from '@/src/shared/ui/button';

interface WelcomeModalProps {
  isNewUser: boolean;
  hasPrds: boolean;
}

const SAMPLE_IDEAS = [
  {
    icon: Lightbulb,
    titleKey: 'sampleIdeas.taskManager.title',
    descriptionKey: 'sampleIdeas.taskManager.description',
    idea: 'AI-powered task management app that automatically prioritizes tasks based on deadlines, importance, and user behavior patterns',
  },
  {
    icon: Rocket,
    titleKey: 'sampleIdeas.fitnessApp.title',
    descriptionKey: 'sampleIdeas.fitnessApp.description',
    idea: 'Personalized fitness coaching app that creates workout plans based on user goals, available equipment, and fitness level',
  },
  {
    icon: FileText,
    titleKey: 'sampleIdeas.invoiceApp.title',
    descriptionKey: 'sampleIdeas.invoiceApp.description',
    idea: 'Simple invoicing app for freelancers with automatic payment reminders, expense tracking, and tax calculation',
  },
];

export function WelcomeModal({ isNewUser, hasPrds }: WelcomeModalProps) {
  const t = useTranslations('onboarding');
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const checkedRef = useRef(false);

  // Check once on client-side mount if we should show the modal
  useEffect(() => {
    if (checkedRef.current) return;
    checkedRef.current = true;

    // Show modal only for new users who haven't created any PRDs
    if (isNewUser && !hasPrds) {
      const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
      if (!hasSeenWelcome) {
        // Use requestAnimationFrame to defer state update
        requestAnimationFrame(() => setIsOpen(true));
      }
    }
  }, [isNewUser, hasPrds]);

  const handleClose = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    setIsOpen(false);
  };

  const handleStartWithIdea = (idea: string) => {
    localStorage.setItem('hasSeenWelcome', 'true');
    localStorage.setItem('prefillIdea', idea);
    router.push('/generate');
  };

  const handleStartBlank = () => {
    localStorage.setItem('hasSeenWelcome', 'true');
    router.push('/generate');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl mx-4 bg-background rounded-2xl shadow-2xl border overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-2">{t('welcome.title')}</h2>
          <p className="text-muted-foreground">{t('welcome.subtitle')}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4 uppercase tracking-wide">
            {t('welcome.sampleIdeasTitle')}
          </h3>

          <div className="space-y-3">
            {SAMPLE_IDEAS.map((item, index) => {
              const Icon = item.icon;
              const isSelected = selectedIdea === item.idea;

              return (
                <button
                  key={index}
                  onClick={() => setSelectedIdea(isSelected ? null : item.idea)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-primary/10' : 'bg-muted'}`}>
                      <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium">{t(item.titleKey)}</h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {t(item.descriptionKey)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => selectedIdea && handleStartWithIdea(selectedIdea)}
            disabled={!selectedIdea}
            className="flex-1"
            size="lg"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {t('welcome.startWithSample')}
          </Button>
          <Button
            onClick={handleStartBlank}
            variant="outline"
            className="flex-1"
            size="lg"
          >
            {t('welcome.startBlank')}
          </Button>
        </div>

        {/* Skip link */}
        <div className="px-6 pb-6 text-center">
          <button
            onClick={handleClose}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {t('welcome.skipForNow')}
          </button>
        </div>
      </div>
    </div>
  );
}
