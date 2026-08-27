import Link from "next/link";
import { ArrowRight, CheckCircle2, Target, Zap, ShieldCheck, Activity, BarChart3, Database } from "lucide-react";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <header className="relative z-50">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8">
          <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">LifeOS</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/api/auth/signin" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-600 transition">
            Log in
          </a>
          <a
            href="/api/auth/signin"
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition"
          >
            Get started
          </a>
        </div>
      </nav>
      </header>

      {/* Hero Section */}
      <div className="relative isolate pt-14">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)" }}></div>
        </div>
        
        <div className="py-24 sm:py-32 lg:pb-40">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                The ultimate operating system for your life.
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Stop juggling multiple apps. LifeOS integrates your goals, daily tasks, learning paths, and personal discipline into one centralized, powerful dashboard.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <a
                  href="/api/auth/signin"
                  className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition flex items-center gap-2"
                >
                  Start your journey <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Section */}
      <div className="bg-gray-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Complete Control</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to execute.
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              LifeOS is built on proven productivity frameworks. It seamlessly connects your high-level vision down to your daily habits.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  Goal Tracking
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Set ambitious goals, break them down into actionable milestones, and track your progress automatically as you complete related tasks.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <CheckCircle2 className="h-6 w-6 text-white" />
                  </div>
                  Task Management
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Organize your daily priorities. Link tasks directly to projects and goals so you always know why you're doing the work.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <ShieldCheck className="h-6 w-6 text-white" />
                  </div>
                  Discipline & Habits
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Build strong routines with daily discipline trackers. Enforce positive habits and abstain from negative ones with one-click logging.
                </dd>
              </div>

              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                  Activity Logging
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Log your deep work sessions, study time, and exercise. Track planned vs actual duration to measure your execution accuracy.
                </dd>
              </div>

            </dl>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Ready to upgrade your life?
            <br />
            <span className="text-blue-600">Start using LifeOS today.</span>
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <a
              href="/api/auth/signin"
              className="rounded-full bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
            >
              Sign up with Google
            </a>
          </div>
        </div>
      </div>
      
    </div>
  );
}
