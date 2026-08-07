"use client";

import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { CategoryIcon } from "@/components/category-icon";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Camera,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  MapPin,
  Building2,
  TrendingUp,
  Activity,
  ChevronRight,
} from "lucide-react";

const stats = [
  {
    value: "10,000+",
    label: "Issues Resolved",
    description: "Successfully fixed by local authorities",
    icon: CheckCircle2,
  },
  {
    value: "50+",
    label: "Departments",
    description: "Active municipal teams connected",
    icon: Building2,
  },
  {
    value: "98%",
    label: "Satisfaction Rate",
    description: "Positive feedback from citizens",
    icon: TrendingUp,
  },
  {
    value: "24/7",
    label: "Available",
    description: "Round-the-clock issue tracking",
    icon: Clock,
  },
];

const steps = [
  {
    step: "01",
    title: "Report",
    subtitle: "Describe + Photo",
    description:
      "Capture photos of the issue, pin the precise location on the map, add a quick description, and submit in seconds.",
    icon: Camera,
    color: "from-emerald-500 to-teal-600",
  },
  {
    step: "02",
    title: "Track",
    subtitle: "Real-Time Updates",
    description:
      "Follow live progress status, assigned department notifications, and direct updates as officers attend to your report.",
    icon: Activity,
    color: "from-teal-500 to-cyan-600",
  },
  {
    step: "03",
    title: "Resolve",
    subtitle: "Department Action",
    description:
      "Municipal authorities inspect, resolve, and upload proof of work. Verify the fix and rate the service quality.",
    icon: ShieldCheck,
    color: "from-cyan-500 to-blue-600",
  },
];

const categories = [
  {
    name: "Road Damage",
    desc: "Potholes, cracks, damaged asphalt, and missing curb stones",
  },
  {
    name: "Garbage",
    desc: "Overflowing bins, uncollected waste, and illegal dumping sites",
  },
  {
    name: "Street Light",
    desc: "Flickering, non-functional, or damaged street light fixtures",
  },
  {
    name: "Water Leakage",
    desc: "Burst pipelines, main valve leaks, and potable water wastage",
  },
  {
    name: "Sewage",
    desc: "Overflowing drains, blocked sewer lines, and foul odors",
  },
  {
    name: "Tree Hazard",
    desc: "Fallen branches, overgrown trees blocking signals or power lines",
  },
  {
    name: "Public Facility Damage",
    desc: "Vandalized park benches, broken bus shelters, and public toilets",
  },
  {
    name: "Encroachment",
    desc: "Unauthorized construction, illegal street stalls blocking paths",
  },
  {
    name: "Other",
    desc: "General municipal complaints, safety hazards, and suggestions",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white overflow-x-hidden">
      {/* Top Header / Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden bg-gradient-to-b from-emerald-950 via-slate-950 to-slate-950">
        {/* Decorative Background Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-teal-500/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-600/10 blur-[90px] rounded-full pointer-events-none" />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#34d399_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Hero Text Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6">
              {/* Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs sm:text-sm font-medium backdrop-blur-md transition-all hover:bg-emerald-500/20">
                <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Next-Gen Civic Issue Resolution Platform</span>
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
                Your City,{" "}
                <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                  Your Voice
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
                Empowering citizens to report municipal issues instantly, track resolution progress in real-time, and collaborate with local departments for a cleaner, safer city.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2 flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-8 py-6 rounded-xl shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] text-base group"
                >
                  <Link href="/register" className="flex items-center gap-2">
                    <span>Report an Issue</span>
                    <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-slate-200 hover:text-white font-medium px-7 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 hover:border-slate-600 text-base"
                >
                  <Link href="#how-it-works" className="flex items-center gap-2">
                    <span>How It Works</span>
                  </Link>
                </Button>
              </div>

              {/* Quick Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 w-full flex items-center gap-6 text-slate-400 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Instant Routing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>GPS Geotagged</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>100% Free</span>
                </div>
              </div>
            </div>

            {/* Hero Visual Card / Mockup */}
            <div className="lg:col-span-5 relative">
              {/* Outer Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />

              <div className="relative rounded-2xl bg-slate-900/90 border border-slate-800 p-6 shadow-2xl backdrop-blur-xl space-y-5">
                {/* Mock Card Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-800/50">
                    Live Report Feed
                  </span>
                </div>

                {/* Sample Report Card 1 */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon category="Road Damage" size="sm" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Deep Pothole on Main Avenue</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" /> Sector 4, Downtown • 5 mins ago
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                      In Progress
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                    <span className="text-emerald-400 font-medium">Assigned: Public Works Dept</span>
                    <span className="text-slate-500">ETA: 2 Hours</span>
                  </div>
                </div>

                {/* Sample Report Card 2 */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-3 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <CategoryIcon category="Street Light" size="sm" />
                      <div>
                        <h4 className="text-sm font-semibold text-white">Flickering Street Lamp</h4>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500" /> Parkside Lane • 20 mins ago
                        </p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 shrink-0">
                      Resolved
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-900">
                    <span className="text-blue-400 font-medium">Verified by Electrical Dept</span>
                    <span className="text-slate-500">Fixed</span>
                  </div>
                </div>

                {/* Floating Stat Widget */}
                <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Today&apos;s Resolution Rate</p>
                      <p className="text-sm font-bold text-white">99.4% Completed</p>
                    </div>
                  </div>
                  <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2 py-1 rounded">
                    +14.2% vs last wk
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 bg-slate-900/60 border-y border-slate-800/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <div
                  key={idx}
                  className="relative group p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/30 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:bg-emerald-500/20 transition-all duration-300">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-mono text-emerald-400/80 bg-emerald-950/40 px-2 py-0.5 rounded">
                      Verified
                    </span>
                  </div>
                  <h3 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm font-semibold text-emerald-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-400">{stat.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative overflow-hidden bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Simple Workflow
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              How <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">CitiCare</span> Works
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Empowering citizens to fix neighborhood issues in three seamless steps.
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10 relative">
            {/* Desktop Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-emerald-500/20 via-teal-500/40 to-cyan-500/20 -translate-y-8 z-0 pointer-events-none" />

            {steps.map((item, idx) => {
              const StepIcon = item.icon;
              return (
                <div
                  key={idx}
                  className="relative z-10 group rounded-2xl bg-slate-900/60 border border-slate-800 p-8 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-950/50 hover:-translate-y-2 flex flex-col justify-between"
                >
                  <div>
                    {/* Top Step Badge & Icon */}
                    <div className="flex items-center justify-between mb-8">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 group-hover:border-emerald-400 transition-all duration-300 shadow-lg">
                        <StepIcon className="w-7 h-7" />
                      </div>
                      <span className="text-3xl font-extrabold text-slate-800 group-hover:text-emerald-500/30 transition-colors font-mono">
                        {item.step}
                      </span>
                    </div>

                    {/* Step Title & Subtitle */}
                    <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-4">
                      {item.subtitle}
                    </p>

                    {/* Description */}
                    <p className="text-sm text-slate-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Step Action Tag */}
                  <div className="mt-8 pt-4 border-t border-slate-800/80 flex items-center text-xs font-medium text-slate-400 group-hover:text-emerald-400 transition-colors">
                    <span>Learn step details</span>
                    <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-24 relative bg-slate-900/40 border-t border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-teal-500/30 bg-teal-500/10 text-teal-400 text-xs font-semibold uppercase tracking-wider">
              Issue Categories
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
              Report Any <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Civic Issue</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg">
              Routing complaints directly to specialized municipal authorities for quick resolution.
            </p>
          </div>

          {/* 9 Categories Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl bg-slate-950/80 border border-slate-800/90 p-6 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <CategoryIcon category={cat.name} size="lg" />
                    <span className="text-xs text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-full group-hover:border-emerald-500/30 group-hover:text-emerald-400 transition-colors">
                      Category {idx + 1}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                    {cat.name}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-900 flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400 group-hover:text-slate-300 transition-colors">
                    File report under this tag
                  </span>
                  <Link
                    href="/register"
                    className="text-emerald-400 flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Report</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden bg-gradient-to-b from-slate-950 via-emerald-950/50 to-slate-950 border-t border-slate-800/80">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 text-sm font-semibold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Join Our Active Civic Community</span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Ready to make a <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-300 bg-clip-text text-transparent">difference?</span>
          </h2>

          <p className="text-slate-300 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
            Take action today. Register in less than a minute to report issues, track progress, and help shape a cleaner, safer, and better city for everyone.
          </p>

          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold px-9 py-6 rounded-xl shadow-xl shadow-emerald-500/30 transition-all duration-300 hover:scale-[1.03] text-base group"
            >
              <Link href="/register" className="flex items-center gap-2">
                <span>Create Your Free Account</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold px-8 py-6 rounded-xl backdrop-blur-sm transition-all duration-300 text-base"
            >
              <Link href="/login">Log In to Account</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple Footer with CitiCare Branding */}
      <footer className="bg-slate-950 border-t border-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-black text-lg">
                C
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                Citi<span className="text-emerald-400">Care</span>
              </span>
            </div>
            <span className="hidden sm:inline text-slate-700">|</span>
            <p className="text-xs text-slate-400">
              Empowering citizens to build better, safer, and cleaner communities together.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
            <Link href="#how-it-works" className="hover:text-emerald-400 transition-colors">
              How It Works
            </Link>
            <Link href="#categories" className="hover:text-emerald-400 transition-colors">
              Categories
            </Link>
            <Link href="/register" className="hover:text-emerald-400 transition-colors">
              Register
            </Link>
            <Link href="/login" className="hover:text-emerald-400 transition-colors">
              Log In
            </Link>
          </div>

          {/* Copyright */}
          <p className="text-xs text-slate-500 text-center md:text-right">
            &copy; {new Date().getFullYear()} CitiCare. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
