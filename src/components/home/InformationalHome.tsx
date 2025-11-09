'use client';

import { useState, FormEvent, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Calendar, Compass, CheckCircle2, Loader2, Mail, MapPin, FlaskConical, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useThemeContext } from '@/components/providers/ThemeProvider';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';

// Reusable scroll animation component
function ScrollSection({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.6 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function InformationalHome() {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [topSubmitting, setTopSubmitting] = useState(false);
  const [topSubmitted, setTopSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
  });
  const [topFormData, setTopFormData] = useState({
    email: '',
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  const handleTopSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTopSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setTopSubmitted(true);
    setTopSubmitting(false);
  };

  const features = [
    {
      icon: MapPin,
      title: 'Search & Blueprint',
      description: 'Turn any address into a detailed 3D venue blueprint with automatic geocoding and building footprint detection.',
      color: 'purple',
    },
    {
      icon: FlaskConical,
      title: 'Design Labs',
      description: 'Create and design event layouts in an infinite 3D canvas with drag-and-drop tools and real-time collaboration.',
      color: 'pink',
    },
    {
      icon: ShoppingBag,
      title: 'Marketplace',
      description: 'Shop for venue equipment and connect directly with vendors, all integrated into your event planning workflow.',
      color: 'blue',
    },
    {
      icon: Compass,
      title: 'Discover',
      description: 'Find and explore events happening in your area, get inspired by successful layouts, and connect with organizers.',
      color: 'green',
    },
  ];

  return (
    <div className={clsx('min-h-screen', isDark ? 'bg-[#050505]' : 'bg-[#fafafa]')}>
      {/* Header */}
      <header className={clsx(
        'sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300',
        isDark ? 'border-white/10 bg-[#0a0a0a]/80' : 'border-gray-200 bg-white/80'
      )}>
        <div className="container mx-auto flex items-center justify-center px-4 py-4 md:px-8">
          <h1 className="text-3xl font-black tracking-tight text-glow">POP!</h1>
        </div>
      </header>

      {/* Hero Section - RunPod Style */}
      <section className={clsx(
        'w-full py-20 md:py-32 px-4 md:px-8',
        isDark ? 'bg-[#0a0a0a]' : 'bg-white'
      )}>
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <h2 className={clsx(
                'text-4xl md:text-5xl lg:text-6xl font-black mb-6',
                isDark ? 'text-white' : 'text-[#1a1a1a]'
              )}>
                Event spaces organizers trust
              </h2>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className={clsx(
                'text-xl md:text-2xl mb-8 max-w-3xl mx-auto',
                isDark ? 'text-white/70' : 'text-gray-600'
              )}
            >
              Everything you need to discover, design, and experience events all in one place.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/">
                <Button
                  size="lg"
                  className="rounded-full px-12 py-8 text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg hover:shadow-xl transition-all"
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      sessionStorage.setItem('popHasSeenWelcome', 'true');
                    }
                  }}
                >
                  Get started
                  <ArrowRight className="ml-3 h-6 w-6 md:h-7 md:w-7" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Top Email Form - Simple Email Only */}
      <section className={clsx(
        'w-full py-16 md:py-20 px-4 md:px-8',
        isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'
      )}>
        <div className="container mx-auto max-w-4xl">
          <ScrollSection>
            <div className={clsx(
              'rounded-2xl border p-10 md:p-12 lg:p-16 text-center',
              isDark
                ? 'border-white/10 bg-[#111111]'
                : 'border-gray-200 bg-white'
            )}>
              {topSubmitted ? (
                <div className="py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className={clsx(
                    'text-2xl md:text-3xl font-semibold mb-3',
                    isDark ? 'text-white' : 'text-[#1a1a1a]'
                  )}>
                    Thank You!
                  </h3>
                  <p className={clsx(
                    'text-base md:text-lg',
                    isDark ? 'text-white/70' : 'text-gray-600'
                  )}>
                    We'll keep you updated.
                  </p>
                </div>
              ) : (
                <>
                  <h3 className={clsx(
                    'text-3xl md:text-4xl lg:text-5xl font-bold mb-4',
                    isDark ? 'text-white' : 'text-[#1a1a1a]'
                  )}>
                    Stay in the loop
                  </h3>
                  <p className={clsx(
                    'mb-8 text-base md:text-lg',
                    isDark ? 'text-white/70' : 'text-gray-600'
                  )}>
                    Get updates on new features and event planning insights.
                  </p>
                  <form onSubmit={handleTopSubmit} className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                    <Input
                      type="email"
                      required
                      value={topFormData.email}
                      onChange={(e) => setTopFormData({ email: e.target.value })}
                      placeholder="Enter your email"
                      className={clsx(
                        'flex-1 h-14 text-base',
                        isDark
                          ? 'bg-black/40 border-white/10 text-white placeholder:text-white/40'
                          : 'bg-white border-gray-300 text-[#1a1a1a]'
                      )}
                    />
                    <Button
                      type="submit"
                      disabled={topSubmitting}
                      className="rounded-full px-8 py-6 h-14 text-base bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold whitespace-nowrap"
                    >
                      {topSubmitting ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                          Submitting...
                        </>
                      ) : (
                        'Subscribe'
                      )}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Mission Section */}
      <section className={clsx(
        'w-full py-20 md:py-24 px-4 md:px-8',
        isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'
      )}>
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <div className="text-center mb-12">
              <h2 className={clsx(
                'text-3xl md:text-4xl font-bold mb-6',
                isDark ? 'text-white' : 'text-[#1a1a1a]'
              )}>
                Our Mission
              </h2>
            </div>
          </ScrollSection>
          <ScrollSection>
            <div className={clsx(
              'rounded-2xl border p-8 md:p-12',
              isDark
                ? 'border-white/10 bg-[#111111]'
                : 'border-gray-200 bg-white'
            )}>
              <p className={clsx(
                'text-lg md:text-xl leading-relaxed text-center',
                isDark ? 'text-white/90' : 'text-gray-700'
              )}>
                Our mission is to redefine how people discover, design, and experience event spaces — turning every venue into a vibrant hub for community, creativity, and unforgettable moments. POP empowers organizers and creators with smart tools that simplify planning, amplify impact, and bring people together like never before.
              </p>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Features Grid - RunPod Style */}
      <section className={clsx(
        'w-full py-20 md:py-24 px-4 md:px-8',
        isDark ? 'bg-[#0a0a0a]' : 'bg-white'
      )}>
        <div className="container mx-auto max-w-7xl">
          <ScrollSection>
            <div className="text-center mb-16">
              <h2 className={clsx(
                'text-3xl md:text-4xl font-bold mb-4',
                isDark ? 'text-white' : 'text-[#1a1a1a]'
              )}>
                POP makes event planning simple.
              </h2>
              <p className={clsx(
                'text-lg md:text-xl',
                isDark ? 'text-white/70' : 'text-gray-600'
              )}>
                From venue discovery to layout design, we simplify every step of your workflow.
              </p>
            </div>
          </ScrollSection>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              const colorClasses = {
                purple: isDark ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600',
                pink: isDark ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-100 text-pink-600',
                blue: isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600',
                green: isDark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600',
              };
              
              return (
                <ScrollSection key={idx}>
                  <div className={clsx(
                    'rounded-2xl border p-6 md:p-8 transition-all duration-300 hover:scale-105',
                    isDark
                      ? 'border-white/10 bg-[#111111] hover:border-white/20'
                      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  )}>
                    <div className={clsx(
                      'w-12 h-12 rounded-xl flex items-center justify-center mb-4',
                      colorClasses[feature.color as keyof typeof colorClasses]
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className={clsx(
                      'text-xl font-bold mb-3',
                      isDark ? 'text-white' : 'text-[#1a1a1a]'
                    )}>
                      {feature.title}
                    </h3>
                    <p className={clsx(
                      'text-sm md:text-base',
                      isDark ? 'text-white/70' : 'text-gray-600'
                    )}>
                      {feature.description}
                    </p>
                  </div>
                </ScrollSection>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className={clsx(
        'w-full py-20 md:py-24 px-4 md:px-8',
        isDark ? 'bg-[#0a0a0a]' : 'bg-white'
      )}>
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <h2 className={clsx(
              'text-3xl md:text-4xl font-bold mb-12 text-center',
              isDark ? 'text-white' : 'text-[#1a1a1a]'
            )}>
              Why POP!
            </h2>
          </ScrollSection>
          <ScrollSection>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                'Streamlined event planning workflow',
                'Real-time collaboration tools',
                'Integrated vendor marketplace',
                'Comprehensive venue blueprints',
                'Discover trending events',
                'Professional event management',
              ].map((benefit, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle2 className={clsx(
                    'h-6 w-6 flex-shrink-0 mt-0.5',
                    isDark ? 'text-purple-400' : 'text-purple-600'
                  )} />
                  <p className={clsx(
                    'text-lg',
                    isDark ? 'text-white/90' : 'text-gray-700'
                  )}>
                    {benefit}
                  </p>
                </div>
              ))}
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Final Contact Form Section */}
      <section className={clsx(
        'w-full py-20 md:py-24 px-4 md:px-8',
        isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'
      )}>
        <div className="container mx-auto max-w-3xl">
          <ScrollSection>
            <div className="text-center mb-8">
              <h2 className={clsx(
                'text-3xl md:text-4xl font-bold mb-4',
                isDark ? 'text-white' : 'text-[#1a1a1a]'
              )}>
                Get in Touch
              </h2>
              <p className={clsx(
                'text-lg',
                isDark ? 'text-white/70' : 'text-gray-600'
              )}>
                Ready to transform your event planning? Let's connect.
              </p>
            </div>
          </ScrollSection>
          
          <ScrollSection>
            <div className={clsx(
              'rounded-2xl border p-8 md:p-12',
              isDark
                ? 'border-white/10 bg-[#111111]'
                : 'border-gray-200 bg-white'
            )}>
              {submitted ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                  <h3 className={clsx(
                    'text-2xl font-semibold mb-2',
                    isDark ? 'text-white' : 'text-[#1a1a1a]'
                  )}>
                    Thank You!
                  </h3>
                  <p className={clsx(
                    isDark ? 'text-white/70' : 'text-gray-600'
                  )}>
                    We'll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className={isDark ? 'text-white' : ''}>Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                        className={isDark ? 'bg-black/40 border-white/10 text-white' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className={isDark ? 'text-white' : ''}>First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                        className={isDark ? 'bg-black/40 border-white/10 text-white' : ''}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className={isDark ? 'text-white' : ''}>Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                        className={isDark ? 'bg-black/40 border-white/10 text-white' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company" className={isDark ? 'text-white' : ''}>Company / Organization</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Events"
                        className={isDark ? 'bg-black/40 border-white/10 text-white' : ''}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full rounded-full px-8 py-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-5 w-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Footer */}
      <footer className={clsx(
        'border-t py-8',
        isDark ? 'border-white/10 bg-[#0a0a0a]' : 'border-gray-200 bg-white'
      )}>
        <div className="container mx-auto max-w-5xl px-4 md:px-8 text-center">
          <p className={clsx(
            isDark ? 'text-white/60' : 'text-gray-600'
          )}>
            &copy; 2025 POP! Event Experience Builder. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
