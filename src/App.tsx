import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ShieldCheck, ChevronRight } from 'lucide-react';

type FormData = {
  stairsType?: string;
  stairsLocation?: string;
  mobilityNeeds?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

const QUESTIONS = [
  {
    id: 'stairsType',
    question: "What type of stairs do you have?",
    options: [
      { label: "Straight Stairs", value: "straight" },
      { label: "Stairs with a Curve or Landing", value: "curved" },
      { label: "Multiple Flights", value: "multiple" },
    ]
  },
  {
    id: 'stairsLocation',
    question: "Where are these stairs located?",
    options: [
      { label: "Indoor", value: "indoor" },
      { label: "Outdoor", value: "outdoor" },
    ]
  },
  {
    id: 'mobilityNeeds',
    question: "Who is the primary user, and what are their mobility needs?",
    options: [
      { label: "Difficulty walking, needs assistance", value: "high_need" },
      { label: "Independent but struggles with stairs", value: "moderate_need" },
      { label: "Planning for the future (Aging in place)", value: "future_planning" },
      { label: "Recovering from an injury or surgery", value: "recovery" },
    ]
  }
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(-1); // -1 is Welcome, 0-2 are Questions, 3 is Lead Capture, 4 is Success
  const [formData, setFormData] = useState<FormData>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSelectOption = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    setTimeout(() => setCurrentStep(prev => prev + 1), 300); // Small delay for visual feedback
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('https://formspree.io/f/xnjlppyz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setCurrentStep(4);
      } else {
        console.error("Form submission failed");
        setCurrentStep(4);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setCurrentStep(4);
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: { x: 50, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -50, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-muted flex flex-col font-sans">
      {/* Header */}
      <header className="w-full bg-background border-b border-border py-4 px-6 fixed top-0 z-10 flex justify-between items-center shadow-sm">
        <div className="font-bold text-2xl tracking-tight text-secondary flex items-center gap-2">
          <span className="text-primary text-3xl">◆</span> Southern Stairlifts
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500 font-medium">
          <ShieldCheck size={18} className="text-primary" />
          Trusted Local Provider
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 pt-24 overflow-hidden">
        <div className="w-full max-w-lg bg-background rounded-2xl shadow-xl border border-gray-100 overflow-hidden relative min-h-[450px] flex flex-col">
          
          {/* Progress Bar (Only show during questions) */}
          {currentStep >= 0 && currentStep < QUESTIONS.length && (
            <div className="w-full bg-gray-100 h-1.5 absolute top-0 left-0">
              <div 
                className="h-full bg-primary transition-all duration-500 ease-out"
                style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
          )}

          {/* Back Button */}
          {currentStep >= 0 && currentStep < 4 && (
            <button 
              onClick={() => setCurrentStep(prev => prev - 1)}
              className="absolute top-4 left-4 p-2 text-gray-400 hover:text-secondary transition-colors z-20 rounded-full hover:bg-gray-100"
              aria-label="Go back"
            >
              <ArrowLeft size={20} />
            </button>
          )}

          <div className="flex-1 p-8 sm:p-10 flex flex-col relative h-full">
            <AnimatePresence mode="wait">
              
              {/* WELCOME SCREEN */}
              {currentStep === -1 && (
                <motion.div 
                  key="welcome"
                  initial="enter" animate="center" exit="exit"
                  variants={slideVariants}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col justify-center items-center text-center space-y-6"
                >
                  <div className="bg-red-50 p-4 rounded-full mb-2">
                    <ShieldCheck size={48} className="text-primary" />
                  </div>
                  <h1 className="text-3xl font-bold tracking-tight text-secondary">
                    Is your home safe for aging in place?
                  </h1>
                  <p className="text-gray-500 text-lg">
                    Take our 60-second home assessment to receive a customized stairlift safety report and cost estimate.
                  </p>
                  <button 
                    onClick={() => setCurrentStep(0)}
                    className="w-full sm:w-auto bg-primary text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    Start Assessment <ChevronRight size={20} />
                  </button>
                </motion.div>
              )}

              {/* QUESTIONS */}
              {currentStep >= 0 && currentStep < QUESTIONS.length && (
                <motion.div 
                  key={`question-${currentStep}`}
                  initial="enter" animate="center" exit="exit"
                  variants={slideVariants}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col pt-8"
                >
                  <h2 className="text-2xl font-bold text-secondary mb-8 leading-tight">
                    {QUESTIONS[currentStep].question}
                  </h2>
                  <div className="space-y-3 mt-auto">
                    {QUESTIONS[currentStep].options.map((option) => {
                      const isSelected = formData[QUESTIONS[currentStep].id as keyof FormData] === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSelectOption(QUESTIONS[currentStep].id, option.value)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all duration-200 flex justify-between items-center ${
                            isSelected 
                              ? 'border-primary bg-red-50 text-secondary font-semibold' 
                              : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          {option.label}
                          {isSelected && <CheckCircle2 className="text-primary" size={20} />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* LEAD CAPTURE FORM */}
              {currentStep === QUESTIONS.length && (
                <motion.div 
                  key="lead-capture"
                  initial="enter" animate="center" exit="exit"
                  variants={slideVariants}
                  transition={{ duration: 0.3 }}
                  className="flex-1 flex flex-col pt-6"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-secondary mb-2">Great news! </h2>
                    <p className="text-gray-500">We have enough details to generate your safety rating and cost estimate. Where should we send it?</p>
                  </div>
                  
                  <form onSubmit={handleLeadSubmit} className="space-y-4 flex-1 flex flex-col">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">First Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.firstName || ''}
                          onChange={e => setFormData(p => ({...p, firstName: e.target.value}))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                          placeholder="Jane"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Name</label>
                        <input 
                          required
                          type="text" 
                          value={formData.lastName || ''}
                          onChange={e => setFormData(p => ({...p, lastName: e.target.value}))}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email Address</label>
                      <input 
                        required
                        type="email" 
                        value={formData.email || ''}
                        onChange={e => setFormData(p => ({...p, email: e.target.value}))}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="jane@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone Number <span className="text-gray-400 font-normal capitalize">(Optional)</span></label>
                      <input 
                        type="tel" 
                        value={formData.phone || ''}
                        onChange={e => setFormData(p => ({...p, phone: e.target.value}))}
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    
                    <div className="mt-auto pt-6">
                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-primary text-white font-semibold text-lg py-4 px-8 rounded-xl shadow-lg hover:bg-red-700 hover:scale-[1.02] active:scale-95 transition-all text-center disabled:opacity-70 disabled:hover:scale-100 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? "Submitting..." : "Get My Estimate"}
                      </button>
                      <p className="text-center text-xs text-gray-400 mt-4">
                        By submitting, you agree to our Terms of Service and Privacy Policy. We will never sell your data.
                      </p>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* SUCCESS SCREEN */}
              {currentStep === 4 && (
                <motion.div 
                  key="success"
                  initial="enter" animate="center"
                  variants={slideVariants}
                  transition={{ duration: 0.4 }}
                  className="flex-1 flex flex-col justify-center items-center text-center space-y-4"
                >
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                  >
                    <CheckCircle2 size={80} className="text-green-500 mb-4" />
                  </motion.div>
                  <h2 className="text-3xl font-bold text-secondary">
                    Request Received!
                  </h2>
                  <p className="text-gray-500 text-lg max-w-sm">
                    Thank you, {formData.firstName}. Our specialists are analyzing your details and will send your customized estimate and report shortly.
                  </p>
                  
                  <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100 w-full">
                    <p className="text-sm text-gray-500 font-medium mb-1">Need immediate assistance?</p>
                    <p className="text-secondary font-bold text-lg">Call us: (800) 555-0199</p>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </div>
      </main>
    </div>
  );
}
