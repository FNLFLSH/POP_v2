'use client';

import { useState, FormEvent, useEffect, useRef, type ReactNode } from 'react';
import Link from 'next/link';
import { ArrowRight, ShoppingBag, Calendar, Compass, CheckCircle2, Loader2, Mail, MapPin } from 'lucide-react';
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
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    company: '',
  });

  // Intersection Observer for scroll animations
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const observers = sectionRefs.current.map((ref) => {
      if (!ref) return null;
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animate-in');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
      );
      
      observer.observe(ref);
      return observer;
    });

    return () => {
      observers.forEach((observer) => observer?.disconnect());
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    // TODO: Add API call to save contact information
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSubmitted(true);
    setSubmitting(false);
  };

  const sectionClass = clsx(
    'w-full py-16 px-4 md:px-8 transition-all duration-1000',
    isDark ? 'bg-[#0a0a0a] text-[#f5f5f5]' : 'bg-white text-[#1a1a1a]'
  );

  const cardClass = clsx(
    'rounded-2xl border p-8 shadow-lg transition-all duration-500 hover:shadow-xl',
    isDark
      ? 'border-white/10 bg-[#111111] hover:border-white/20'
      : 'border-gray-200 bg-gray-50 hover:border-gray-300'
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Try to load an audio the user added; fallback filenames
    const audio = new Audio('/balloon.mp3');
    // If mp3 fails, try wav lazily when playing
    audioRef.current = audio;
  }, []);

  const handleDemoClick = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(async () => {
      // try wav fallback silently
      try {
        const wav = new Audio('/balloon.wav');
        audioRef.current = wav;
        wav.currentTime = 0;
        await wav.play();
      } catch (_) {
        // ignore if file not present
      }
    });
  };

  return (
    <div className={clsx('min-h-screen', isDark ? 'bg-[#050505]' : 'bg-[#fafafa]')}>

      {/* Header */}
      <header className={clsx(
        'sticky top-0 z-50 w-full border-b backdrop-blur-md transition-all duration-300',
        isDark ? 'border-white/10 bg-[#0a0a0a]/80' : 'border-gray-200 bg-white/80'
      )}>
        <div className="container mx-auto flex items-center justify-between px-4 py-4 md:px-8">
          <div className="flex-1"></div>
          <h1 className="text-3xl font-black tracking-tight text-glow flex-1 text-center">POP!</h1>
          <div className="flex-1 flex justify-end">
            <Link href="/demo">
              <Button
                onClick={handleDemoClick}
                variant="outline"
                className="group relative h-12 rounded-full px-4 gap-2 float-animation pulse-glow"
                aria-label="Launch POP! Demo"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
                {/* Simple white oval balloon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 32"
                  className="h-5 w-4"
                >
                  <ellipse
                    cx="12"
                    cy="14"
                    rx="8"
                    ry="12"
                    fill="white"
                  />
                  <path
                    d="M12 26 L12 32"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-sm font-semibold">Try Demo</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero/Overview Section */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)}
        className={`${sectionClass} section-hidden min-h-[50vh] flex items-center pb-8`}
      >
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-8">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-black mb-6 gradient-text text-glow"
            >
              Event Experience Builder
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto"
            >
              Transform any venue into a design playground. Plan, discover, and execute unforgettable events with POP!
            </motion.p>
          </div>
        </div>
      </section>

      {/* Our Mission */}
      <section 
        ref={(el) => (sectionRefs.current[1] = el)}
        className={`${sectionClass} py-12`}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <h2 className="text-4xl font-bold mb-8 text-center text-glow">Our Mission</h2>
          </ScrollSection>
          <ScrollSection>
            <div className={`${cardClass} max-w-4xl mx-auto`}>
              <p className="text-lg md:text-xl leading-relaxed text-gray-700 dark:text-gray-300 text-center">
                Our mission is to redefine how people discover, design, and experience event spaces turning every venue into a vibrant hub for community, creativity, and unforgettable moments. POP empowers organizers and creators with smart tools that simplify planning, amplify impact, and bring people together like never before.
              </p>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Search & Blueprint Flow Feature */}
      <section 
        ref={(el) => (sectionRefs.current[2] = el)}
        className={`${sectionClass} section-hidden`}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <div className="flex items-center gap-4 mb-8">
              <div className={clsx(
                'p-4 rounded-xl float-animation',
                isDark ? 'bg-purple-500/20 pulse-glow' : 'bg-purple-100'
              )}>
                <MapPin className="h-8 w-8 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-glow">Search & Blueprint Flow</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Turn any address into a detailed venue blueprint
                </p>
              </div>
            </div>
          </ScrollSection>
          
          <ScrollSection>
            <div className={cardClass}>
              <h3 className="text-2xl font-semibold mb-6">Step-by-Step Playbook</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Enter Your Venue Address',
                    description: 'Simply type in any address. Our system will geocode and locate the building footprint automatically.',
                  },
                  {
                    step: 2,
                    title: 'View the Blueprint',
                    description: 'See a 3D holobox render of your venue with coordinates, building type, and footprint details.',
                  },
                  {
                    step: 3,
                    title: 'Launch DesignLabz',
                    description: 'Access the infinite canvas where you can design your event layout with drag-and-drop tools.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 animate-in-left" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className={clsx(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                      isDark ? 'bg-purple-500/30 text-purple-300 pulse-glow' : 'bg-purple-100 text-purple-700'
                    )}>
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Marketplace Feature */}
      <section 
        ref={(el) => (sectionRefs.current[3] = el)}
        className={`${sectionClass} section-hidden`}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <div className="flex items-center gap-4 mb-8">
              <div className={clsx(
                'p-4 rounded-xl float-animation',
                isDark ? 'bg-pink-500/20 pulse-glow' : 'bg-pink-100'
              )}>
                <ShoppingBag className="h-8 w-8 text-pink-500 dark:text-pink-400" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-glow-pink">Marketplace</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Shop for venue equipment and connect with vendors
                </p>
              </div>
            </div>
          </ScrollSection>
          
          <ScrollSection>
            <div className={cardClass}>
              <h3 className="text-2xl font-semibold mb-6">Step-by-Step Playbook</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Browse Equipment Catalog',
                    description: 'Explore a curated selection of venue equipment, from staging to sound systems, catering setups to lighting.',
                  },
                  {
                    step: 2,
                    title: 'Connect with Vendors',
                    description: 'Browse vendor profiles, read reviews, and get quotes directly from equipment suppliers and service providers.',
                  },
                  {
                    step: 3,
                    title: 'Add to Your Event',
                    description: 'Seamlessly add equipment and vendors to your event layout, with everything synced in real-time.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 animate-in-right" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className={clsx(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                      isDark ? 'bg-pink-500/30 text-pink-300 pulse-glow' : 'bg-pink-100 text-pink-700'
                    )}>
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* My Events Feature */}
      <section 
        ref={(el) => (sectionRefs.current[4] = el)}
        className={`${sectionClass} section-hidden`}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <div className="flex items-center gap-4 mb-8">
              <div className={clsx(
                'p-4 rounded-xl float-animation',
                isDark ? 'bg-blue-500/20 pulse-glow' : 'bg-blue-100'
              )}>
                <Calendar className="h-8 w-8 text-blue-500 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">My Events</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Manage and track all your events in one place
                </p>
              </div>
            </div>
          </ScrollSection>
          
          <ScrollSection>
            <div className={cardClass}>
              <h3 className="text-2xl font-semibold mb-6">Step-by-Step Playbook</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'View Your Event List',
                    description: 'See all your events at a glance with status indicators (draft, active, completed) and key details.',
                  },
                  {
                    step: 2,
                    title: 'Manage Event Details',
                    description: 'Edit event information, update layouts, assign vendors, and track progress for each event.',
                  },
                  {
                    step: 3,
                    title: 'Collaborate & Share',
                    description: 'Invite team members, share layouts with clients, and coordinate with vendors all from one dashboard.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 animate-in-left" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className={clsx(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                      isDark ? 'bg-blue-500/30 text-blue-300 pulse-glow' : 'bg-blue-100 text-blue-700'
                    )}>
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Discover Feature */}
      <section 
        ref={(el) => (sectionRefs.current[5] = el)}
        className={`${sectionClass} section-hidden`}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <div className="flex items-center gap-4 mb-8">
              <div className={clsx(
                'p-4 rounded-xl float-animation',
                isDark ? 'bg-green-500/20 pulse-glow' : 'bg-green-100'
              )}>
                <Compass className="h-8 w-8 text-green-500 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-4xl font-bold">Discover</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Find new events happening in your area
                </p>
              </div>
            </div>
          </ScrollSection>
          
          <ScrollSection>
            <div className={cardClass}>
              <h3 className="text-2xl font-semibold mb-6">Step-by-Step Playbook</h3>
              <div className="space-y-6">
                {[
                  {
                    step: 1,
                    title: 'Browse Local Events',
                    description: 'Explore events happening in your area, filtered by date, type, and location.',
                  },
                  {
                    step: 2,
                    title: 'Get Event Insights',
                    description: 'View event details, see layouts, check vendor lists, and learn from successful event designs.',
                  },
                  {
                    step: 3,
                    title: 'Connect & Learn',
                    description: 'Connect with event organizers, get inspired by creative layouts, and discover new venues and vendors.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4 animate-in-right" style={{ animationDelay: `${idx * 0.2}s` }}>
                    <div className={clsx(
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold',
                      isDark ? 'bg-green-500/30 text-green-300 pulse-glow' : 'bg-green-100 text-green-700'
                    )}>
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">{item.title}</h4>
                      <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Benefits Section */}
      <section 
        ref={(el) => (sectionRefs.current[6] = el)}
        className={`${sectionClass} section-hidden`}
      >
        <div className="container mx-auto max-w-5xl">
          <ScrollSection>
            <h2 className="text-4xl font-bold mb-8 text-center">Why POP!</h2>
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
              <div key={idx} className="flex items-start gap-3 animate-in" style={{ animationDelay: `${idx * 0.1}s` }}>
                <CheckCircle2 className="h-6 w-6 text-purple-500 dark:text-purple-400 flex-shrink-0 mt-0.5 float-animation" />
                <p className="text-lg">{benefit}</p>
              </div>
            ))}
            </div>
          </ScrollSection>
        </div>
      </section>

      {/* Contact Form Section */}
      <section 
        ref={(el) => (sectionRefs.current[7] = el)}
        className={`${sectionClass} section-hidden`}
      >
        <div className="container mx-auto max-w-3xl">
          <ScrollSection>
            <div className="text-center mb-8">
              <h2 className="text-4xl font-bold mb-4 text-glow">Get in Touch</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Ready to transform your event planning? Let's connect.
              </p>
            </div>
          </ScrollSection>
          
          <ScrollSection>
            <div className={cardClass}>
              {submitted ? (
                <div className="text-center py-8 animate-in">
                  <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4 float-animation" />
                  <h3 className="text-2xl font-semibold mb-2">Thank You!</h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    We'll be in touch soon.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 animate-in-left">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2 animate-in-right">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        type="text"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        placeholder="John"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2 animate-in-left">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        placeholder="Doe"
                      />
                    </div>
                    <div className="space-y-2 animate-in-right">
                      <Label htmlFor="company">Company / Organization</Label>
                      <Input
                        id="company"
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Acme Events"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full pulse-glow"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4" />
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
        <div className="container mx-auto max-w-5xl px-4 md:px-8 text-center text-gray-600 dark:text-gray-400">
          <p>&copy; 2025 POP! Event Experience Builder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
