import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../api';

interface OnboardingProps {
    onComplete: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);

    const roleContent = {
        admin: {
            title: 'Welcome, Administrator',
            subtitle: 'You have full control over the Atlas platform',
            steps: [
                {
                    title: 'Platform Control',
                    description: 'As an admin, you can manage users, approve content, and configure the platform.',
                    icon: '👑',
                    actions: [
                        'Manage user roles and permissions',
                        'Review and moderate content',
                        'Access analytics and system data',
                        'Configure platform settings'
                    ]
                },
                {
                    title: 'User Management',
                    description: 'Invite contributors and manage the community.',
                    icon: '👥',
                    actions: [
                        'Navigate to User Management',
                        'Upgrade viewers to contributors',
                        'Remove inappropriate users',
                        'Monitor user activity'
                    ]
                },
                {
                    title: 'Content Oversight',
                    description: 'Ensure quality and accuracy of knowledge nodes.',
                    icon: '📋',
                    actions: [
                        'Review submitted content',
                        'Verify sources and citations',
                        'Feature important articles',
                        'Maintain knowledge integrity'
                    ]
                }
            ]
        },
        contributor: {
            title: 'Welcome, Knowledge Contributor',
            subtitle: 'Help build sovereign intelligence',
            steps: [
                {
                    title: 'Create Knowledge Nodes',
                    description: 'Share insights, analysis, and verified information.',
                    icon: '✍️',
                    actions: [
                        'Access the Creator Studio',
                        'Write in Markdown format',
                        'Add tags for organization',
                        'Cite sources for credibility'
                    ]
                },
                {
                    title: 'Content Guidelines',
                    description: 'Maintain high standards for Atlas content.',
                    icon: '📚',
                    actions: [
                        'Focus on systems thinking',
                        'Provide evidence and sources',
                        'Avoid propaganda and bias',
                        'Build on existing knowledge'
                    ]
                },
                {
                    title: 'Collaboration',
                    description: 'Work with other contributors to build comprehensive knowledge.',
                    icon: '🤝',
                    actions: [
                        'Tag content appropriately',
                        'Link related articles',
                        'Update outdated information',
                        'Engage in peer review'
                    ]
                }
            ]
        },
        viewer: {
            title: 'Welcome to Atlas',
            subtitle: 'Begin your journey to intellectual sovereignty',
            steps: [
                {
                    title: 'Explore Knowledge',
                    description: 'Access curated insights on money, business, and systems thinking.',
                    icon: '🔍',
                    actions: [
                        'Browse by category (Money, Business)',
                        'Use the search bar for specific topics',
                        'Filter by tags',
                        'Save interesting articles'
                    ]
                },
                {
                    title: 'Build Understanding',
                    description: 'Move beyond surface-level information to deep comprehension.',
                    icon: '🧠',
                    actions: [
                        'Read source citations',
                        'Follow tag connections',
                        'Explore related content',
                        'Question assumptions'
                    ]
                },
                {
                    title: 'Become a Contributor',
                    description: 'Ready to share your knowledge? Request contributor access.',
                    icon: '📝',
                    actions: [
                        'Contact an administrator',
                        'Demonstrate systems thinking',
                        'Provide quality sources',
                        'Join the Atlas community'
                    ]
                }
            ]
        }
    };

    const content = roleContent[user?.role as keyof typeof roleContent] || roleContent.viewer;
    const step = content.steps[currentStep];

    const handleNext = () => {
        if (currentStep < content.steps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            handleComplete();
        }
    };

    const handleComplete = async () => {
        try {
            await api.users.completeOnboarding(user!.id);
            onComplete();

            // Navigate based on role
            if (user?.role === 'admin') {
                navigate('/admin/users');
            } else if (user?.role === 'contributor') {
                navigate('/dashboard');
            } else {
                navigate('/money');
            }
        } catch (error) {
            console.error('Failed to complete onboarding:', error);
            onComplete();
        }
    };

    const handleSkip = () => {
        handleComplete();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-black text-white p-8 text-center">
                    <div className="text-6xl mb-4">{step.icon}</div>
                    <h1 className="text-3xl font-serif font-black mb-2">{content.title}</h1>
                    <p className="text-neutral-300 font-mono text-sm">{content.subtitle}</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-serif font-black">{step.title}</h2>
                            <span className="text-xs font-mono text-neutral-400">
                                STEP {currentStep + 1} / {content.steps.length}
                            </span>
                        </div>
                        <p className="text-neutral-600 mb-6">{step.description}</p>
                    </div>

                    {/* Actions */}
                    <div className="space-y-3 mb-8">
                        {step.actions.map((action, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border border-black/5">
                                <span className="text-emerald-600 font-bold mt-0.5">✓</span>
                                <span className="text-sm text-neutral-700">{action}</span>
                            </div>
                        ))}
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center gap-2 mb-6">
                        {content.steps.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentStep(idx)}
                                className={`w-2 h-2 rounded-full transition-all ${idx === currentStep
                                    ? 'bg-black w-8'
                                    : idx < currentStep
                                        ? 'bg-emerald-500'
                                        : 'bg-neutral-300'
                                    }`}
                            />
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center">
                        <button
                            onClick={handleSkip}
                            className="text-sm text-neutral-400 hover:text-black font-bold uppercase tracking-widest"
                        >
                            Skip
                        </button>
                        <button
                            onClick={handleNext}
                            className="px-8 py-3 bg-black text-white rounded-lg font-bold uppercase tracking-widest text-sm hover:bg-neutral-800 transition-colors"
                        >
                            {currentStep < content.steps.length - 1 ? 'Next' : 'Get Started'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
