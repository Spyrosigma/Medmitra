import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { signInWithGoogleAction } from "@/app/actions"
import { Button } from "@/components/ui/button"
import { ThemeSwitcher } from "@/components/landing/theme-switcher"
import { Brain, Sparkles, ArrowRight, Star, Users, Shield, Zap, Database, FileText, Activity, Stethoscope, Microscope, Heart, TrendingUp } from "lucide-react"
import { getIndianDate } from "@/utils/timezone"

// Google SVG Component
const GoogleIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
)

export default async function Home() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const quotes = [
    {
      text: "AI will augment human intelligence, not replace it. In medicine, this partnership will save lives.",
      author: "Dr. Eric Topol, Digital Medicine Expert"
    },
    {
      text: "The future of medicine is not just personalized, it's intelligent.",
      author: "Dr. Regina Barzilay, MIT AI Research"
    },
    {
      text: "AI in healthcare isn't about replacing doctors, it's about making them superhuman.",
      author: "Dr. Blackford Middleton, CIO Johns Hopkins"
    }
  ];

  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect("/cases")
  }

  // Show landing page for unauthenticated users
  return (
    <div className="min-h-screen relative">
      {/* Header with Sign in button and Theme Switcher - Only visible when not logged in */}
      <header className="fixed top-0 left-0 right-0 z-50 p-4">
        <div className="flex items-center justify-end gap-3">
          {/* Sign in with Google Button */}
          <form action={signInWithGoogleAction}>
            <Button
              type="submit"
              size="sm"
              className="group relative overflow-hidden bg-white/95 hover:bg-white text-gray-700 hover:text-gray-900 border border-gray-200/80 hover:border-gray-300 shadow-lg hover:shadow-xl backdrop-blur-sm transition-all duration-300 hover:scale-105 active:scale-95 rounded-full px-4 py-2 h-auto"
            >
              <span className="flex items-center gap-2">
                <GoogleIcon className="w-4 h-4 shrink-0" />
                <span className="hidden sm:inline text-sm font-medium">Sign in with Google</span>
                <span className="sm:hidden text-sm font-medium">Sign in</span>
              </span>
            </Button>
          </form>

          {/* Theme Switcher */}
          <ThemeSwitcher />
        </div>
      </header>

      
      {/* Hero Section */}
      <section className="relative flex items-center justify-center min-h-screen overflow-hidden">
        <div className="relative z-10 text-center space-y-12 top-8 p-8 max-w-5xl mx-auto">
          {/* Enhanced Badge */}
          <div className="space-y-8">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3 sm:gap-3 px-6 py-4 sm:py-3 bg-gradient-to-r from-secondary/60 to-secondary/40 rounded-full text-sm font-medium text-secondary-foreground/90 backdrop-blur-sm border border-border/30 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-primary animate-pulse" />
                <span className="text-center sm:text-left">AI-Powered Clinical Intelligence at Your Fingertips</span>
              </div>
              <div className="flex items-center gap-1 xs:hidden sm:flex" >
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-primary text-primary" />
                ))}
              </div>
            </div>

            {/* Enhanced Main Heading */}
            <div className="space-y-6">
              <h1 className="text-6xl sm:text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight leading-none">
                <span className="gradient-text block animate-fade-in">MedMitra AI</span>
              </h1>

              <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-3xl mx-auto leading-relaxed animate-fade-in-delayed px-4 sm:px-0">
                Transform patient care with
                <span className="text-primary font-medium"> intelligent analysis</span> of medical data, lab reports, and clinical insights
              </p>
            </div>
          </div>

          {/* Enhanced Feature Pills */}
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 animate-fade-in-delayed-2 px-4 sm:px-0">
            <div className="group flex items-center gap-3 px-6 py-3 bg-card/80 rounded-full text-sm backdrop-blur-sm border border-primary/20 shadow-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-out cursor-pointer active:scale-95">
              <Activity className="w-4 h-4 text-primary scale-110 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
              <span className="font-medium group-hover:text-primary transition-colors duration-300">Patient Case Analysis</span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 bg-card/80 rounded-full text-sm backdrop-blur-sm border border-primary/20 shadow-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-out cursor-pointer active:scale-95">
              <Microscope className="w-4 h-4 text-primary scale-110 group-hover:scale-125 group-hover:rotate-6 transition-all duration-300" />
              <span className="font-medium group-hover:text-primary transition-colors duration-300">Lab Report Insights</span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 bg-card/80 rounded-full text-sm backdrop-blur-sm border border-primary/20 shadow-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-out cursor-pointer active:scale-95">
              <Brain className="w-4 h-4 text-primary scale-110 group-hover:scale-125 group-hover:-rotate-6 transition-all duration-300" />
              <span className="font-medium group-hover:text-primary transition-colors duration-300">Clinical Decision Support</span>
            </div>
            <div className="group flex items-center gap-3 px-6 py-3 bg-card/80 rounded-full text-sm backdrop-blur-sm border border-primary/20 shadow-lg hover:scale-105 hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 ease-out cursor-pointer active:scale-95">
              <Database className="w-4 h-4 text-primary scale-110 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300" />
              <span className="font-medium group-hover:text-primary transition-colors duration-300">Multimodal Analysis</span>
            </div>
          </div>

          {/* Enhanced CTA Section */}
          <div className="space-y-8 animate-fade-in-delayed-3 px-4 sm:px-0">
            <form action={signInWithGoogleAction}>
              <Button
                type="submit"
                size="lg"
                className="text-base sm:text-lg px-8 sm:px-12 py-6 sm:py-8 rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground font-semibold shadow-2xl hover:shadow-3xl transition-all duration-500 group hover:scale-105 border-2 border-primary/20 w-full sm:w-auto"
              >
                <span className="flex items-center justify-center gap-3">
                  Start Your Clinical AI Journey
                  <ArrowRight className="w-5 sm:w-6 h-5 sm:h-6 group-hover:translate-x-2 transition-transform duration-300" />
                </span>
              </Button>
            </form>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <GoogleIcon className="w-4 h-4 text-primary" />
                <span>Secure Healthcare Login</span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-muted-foreground/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span>HIPAA Compliant Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="py-10 px-4 sm:px-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-secondary/3 to-transparent"></div>
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center space-y-6 mb-16 sm:mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Sparkles className="w-4 h-4" />
              Beyond traditional healthcare tools
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight px-4 sm:px-0">
              Clinical insights that <span className="text-primary">think</span> with you
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-4 sm:px-0">
              Every feature designed to enhance your diagnostic capabilities and patient care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
            {/* Feature Card 0 - Patient Case Management */}
            <div className="group relative overflow-hidden md:col-span-3">
              <div className="relative p-8 sm:p-12 bg-gradient-to-br from-card/60 to-card/40 rounded-3xl border border-border/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card/80 hover:to-card/60 duration-300 hover:border-primary/100 border-primary/50">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <div className="relative mb-6 sm:mb-8">
                      <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                        <Activity className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-6">
                      <h3 className="text-2xl sm:text-3xl font-bold group-hover:text-primary transition-colors duration-300">
                        Comprehensive Patient Case Analysis
                      </h3>
                      <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                        Upload patient data, symptoms, and medical history. Our AI provides detailed analysis, potential diagnoses, and treatment recommendations with evidence-based insights.
                      </p>

                      <div className="space-y-2 sm:space-y-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>Multi-source data integration</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>Evidence-based recommendations</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                          <span>Differential diagnosis support</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="bg-gradient-to-br from-muted/40 to-muted/20 rounded-2xl p-6 border border-border/30">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-muted-foreground">Case Analysis</h4>
                          <span className="text-xs text-muted-foreground bg-primary/10 px-2 py-1 rounded-full">AI Insights</span>
                        </div>
                        <div className="bg-background/50 rounded-lg p-4 min-h-[120px] text-sm text-muted-foreground border border-border/20">
                          <div className="space-y-2">
                            <p><strong>Primary Concern:</strong> Chest pain, shortness of breath</p>
                            <p><strong>AI Analysis:</strong> Consider cardiac evaluation, ECG recommended</p>
                            <p><strong>Risk Factors:</strong> Hypertension, family history</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>Confidence: 92%</span>
                          <span>Evidence Level: High</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 1 - Lab Report Analysis */}
            <div className="group relative overflow-hidden">
              <div className="relative p-8 sm:p-12 bg-gradient-to-br from-card/60 to-card/40 rounded-3xl border border-border/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card/80 hover:to-card/60 duration-300 hover:border-primary/100 border-primary/50">
                <div className="relative mb-6 sm:mb-8">
                  <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    <Microscope className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    Intelligent Lab Insights
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Upload lab reports and receive instant interpretation with clinical significance, trend analysis, and actionable recommendations.
                  </p>

                  <div className="space-y-2 sm:space-y-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Automated value interpretation</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Trend analysis over time</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Clinical correlation alerts</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 2 - Clinical Decision Support */}
            <div className="group relative overflow-hidden">
              <div className="relative p-8 sm:p-12 bg-gradient-to-br from-card/60 to-card/40 rounded-3xl border border-border/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card/80 hover:to-card/60 transition-all duration-300 hover:border-primary/100 border-primary/50">
                <div className="relative mb-6 sm:mb-8">
                  <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    <Brain className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    AI-Powered Decision Support
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Get intelligent treatment suggestions, drug interactions, and clinical guidelines tailored to your specific patient cases.
                  </p>

                  <div className="space-y-2 sm:space-y-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Treatment recommendations</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Drug interaction checking</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Guidelines integration</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature Card 3 - Multimodal Integration */}
            <div className="group relative overflow-hidden">
              <div className="relative p-8 sm:p-12 bg-gradient-to-br from-card/60 to-card/40 rounded-3xl border border-border/40 backdrop-blur-sm hover:bg-gradient-to-br hover:from-card/80 hover:to-card/60 transition-all duration-300 hover:border-primary/100 border-primary/50">
                <div className="relative mb-6 sm:mb-8">
                  <div className="relative w-16 sm:w-20 h-16 sm:h-20 bg-gradient-to-br from-primary/20 to-primary/10 rounded-3xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-lg">
                    <Database className="w-8 sm:w-10 h-8 sm:h-10 text-primary" />
                  </div>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors duration-300">
                    Multimodal Analysis
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    Analyze text notes, medical images, lab reports, and patient data simultaneously for comprehensive clinical insights.
                  </p>

                  <div className="space-y-2 sm:space-y-3 opacity-80 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Text & image integration</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Cross-modal correlation</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      <span>Holistic patient view</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Section - Why choose over traditional tools */}
      <section className="py-10 px-4 sm:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-6 mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
              <Stethoscope className="w-4 h-4" />
              Beyond traditional healthcare tools
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-tight">
              Why settle for <span className="text-muted-foreground line-through">basic tools</span><br />
              when you can have <span className="text-primary">intelligent assistance</span>?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Tools */}
            <div className="space-y-6 p-8 bg-muted/20 rounded-3xl border border-border/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-muted/40 rounded-2xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-muted-foreground">Traditional Systems</h3>
              </div>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                  <span>Manual chart review</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                  <span>Separate lab analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                  <span>Manual decision support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                  <span>Time-consuming processes</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
                  <span>Limited pattern recognition</span>
                </li>
              </ul>
            </div>

            {/* MedMitra AI */}
            <div className="space-y-6 p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-3xl border border-primary/20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/20 rounded-2xl flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-primary">MedMitra AI</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Intelligent case analysis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Automated lab interpretation</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>AI-powered decision support</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Instant clinical insights</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span>Advanced pattern detection</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials with medical quotes */}
      <section className="py-10 px-4 sm:px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {quotes.map((quote, index) => (
              <div
                key={index}
                className="group relative bg-gradient-to-br from-card/40 via-card/20 to-card/40 backdrop-blur-sm rounded-3xl p-8 border border-border/20 hover:border-primary/100 border-primary/50 transition-all duration-300"
              >
                <div className="space-y-4">
                  <blockquote className="text-xl sm:text-2xl font-light text-foreground/90 leading-relaxed">
                    "{quote.text}"
                  </blockquote>
                  <p className="text-sm text-muted-foreground font-medium">
                    — {quote.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Quote Section */}
      <section className="py-10 px-4 sm:px-8 relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center space-y-12 sm:space-y-16 relative">
          {/* Enhanced quote container */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-card/20 via-card/30 to-card/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative bg-gradient-to-br from-card/40 via-card/20 to-card/40 backdrop-blur-sm rounded-3xl p-8 sm:p-12 md:p-16 border border-border/20 shadow-2xl">
              <blockquote className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl font-light text-foreground/95 leading-relaxed tracking-wide">
                <span className="bg-gradient-to-r from-foreground via-foreground/90 to-foreground bg-clip-text text-transparent">
                  Healthcare deserves intelligence that <span className="text-primary font-medium not-italic">evolves</span> with medicine.
                </span>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-5 px-4 sm:px-8 relative">
        <div className="max-w-6xl mx-auto">
          {/* Enhanced decorative elements */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-6">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-300"></div>
              <div className="w-1.5 h-1.5 bg-primary/35 rounded-full animate-pulse delay-600"></div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-md text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>&copy; {getIndianDate().getFullYear()} MedMitra AI. All rights reserved</span>
              </div>
              <div className="hidden sm:block w-2 h-2 bg-muted-foreground/50 rounded-full"></div>
              <div className="flex items-center gap-2">
                <p>Built with &hearts; by&nbsp;
              <a href="https://spyrosigma.tech" target="_blank" className="hover:underline ">
                 <span className="text-primary font-medium not-italic">SpyroSigma</span>
              </a>
              </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-1.5 h-1.5 bg-primary/35 rounded-full animate-pulse"></div>
              <div className="w-1 h-1 bg-primary/30 rounded-full animate-pulse delay-300"></div>
              <div className="w-2 h-2 bg-primary/40 rounded-full animate-pulse delay-600"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
