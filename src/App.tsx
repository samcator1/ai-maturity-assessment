import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ChevronRight, 
  ChevronLeft, 
  Activity, 
  Database, 
  BrainCircuit, 
  Network, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  BarChart3,
  Building2,
  ShieldCheck,
  Zap
} from 'lucide-react';

// --- DATA STRUCTURES ---
const PILLARS = [
  { id: 'cloud', name: 'Cloud Infrastructure', icon: <Network className="w-6 h-6" /> },
  { id: 'data', name: 'Data Engineering', icon: <Database className="w-6 h-6" /> },
  { id: 'semantics', name: 'Semantics & Ontology', icon: <Building2 className="w-6 h-6" /> },
  { id: 'ai', name: 'AI Strategy', icon: <BrainCircuit className="w-6 h-6" /> }
];

const QUESTIONS = [
  // Pillar 1: Cloud Infrastructure
  { id: 'c1', pillar: 'cloud', text: 'How is your core infrastructure currently hosted and managed?' },
  { id: 'c2', pillar: 'cloud', text: 'To what extent is your infrastructure provisioning automated (Infrastructure as Code)?' },
  { id: 'c3', pillar: 'cloud', text: 'How robust are your Disaster Recovery and high-availability implementations?' },
  { id: 'c4', pillar: 'cloud', text: 'How well integrated are your security and compliance protocols within the cloud environment?' },
  { id: 'c5', pillar: 'cloud', text: 'How dynamically does your infrastructure scale in response to operational network demand?' },
  
  // Pillar 2: Data Engineering
  { id: 'd1', pillar: 'data', text: 'How automated and reliable are your data ingestion pipelines from field assets?' },
  { id: 'd2', pillar: 'data', text: 'How effectively do you monitor and maintain data quality across your platforms?' },
  { id: 'd3', pillar: 'data', text: 'To what extent are data storage solutions centralized and accessible across departments?' },
  { id: 'd4', pillar: 'data', text: 'How mature is your real-time or streaming data processing capability?' },
  { id: 'd5', pillar: 'data', text: 'How well established is your overarching data governance framework?' },

  // Pillar 3: Semantics & Ontology
  { id: 's1', pillar: 'semantics', text: 'How standardized is the business glossary and data terminology across the organization?' },
  { id: 's2', pillar: 'semantics', text: 'To what extent do you utilize Master Data Management (MDM) for critical physical assets?' },
  { id: 's3', pillar: 'semantics', text: 'How developed is your enterprise data taxonomy and categorization?' },
  { id: 's4', pillar: 'semantics', text: 'Are you actively utilizing Knowledge Graphs to map relationships between infrastructure nodes?' },
  { id: 's5', pillar: 'semantics', text: 'How interoperable is your data with external national infrastructure partners/regulators?' },

  // Pillar 4: AI Strategy
  { id: 'a1', pillar: 'ai', text: 'How aligned is your AI development with overarching corporate strategic goals?' },
  { id: 'a2', pillar: 'ai', text: 'How systematically do you identify, prioritize, and validate AI use cases (e.g., predictive maintenance)?' },
  { id: 'a3', pillar: 'ai', text: 'How mature are your MLOps practices for deploying and monitoring models in production?' },
  { id: 'a4', pillar: 'ai', text: 'How robust are your ethical AI and algorithmic fairness governance structures?' },
  { id: 'a5', pillar: 'ai', text: 'How effectively do you measure and report the ROI of deployed machine learning solutions?' },
];

const ROADMAP_ACTIONS = {
  cloud: {
    foundational: "Migrate legacy physical asset data to secure cloud environments. Establish basic landing zones.",
    integration: "Implement automated CI/CD for cloud environments and standardize Infrastructure as Code.",
    advanced: "Optimize multi-cloud architecture for edge computing near physical infrastructure nodes."
  },
  data: {
    foundational: "Establish foundational data pipelines, basic ETL processes, and centralized data governance councils.",
    integration: "Scale automated data pipelines across all operational regions with automated quality checks.",
    advanced: "Deploy self-healing data pipelines with real-time streaming from IoT asset sensors."
  },
  semantics: {
    foundational: "Define core business glossary, unify departmental silos, and create a basic data taxonomy.",
    integration: "Develop an enterprise knowledge graph mapping complex physical and logical asset relationships.",
    advanced: "Deploy dynamic, real-time Digital Twins powered by deep semantic models and ontologies."
  },
  ai: {
    foundational: "Identify initial high-value AI use cases (e.g., basic fault detection) and secure leadership buy-in.",
    integration: "Deploy predictive maintenance models across major networks and establish baseline MLOps.",
    advanced: "Implement fully autonomous MLOps, prescriptive decision systems, and autonomous asset optimization."
  }
};

export default function App() {
  const [view, setView] = useState('landing'); // landing, assessment, loading, results
  const [currentPillar, setCurrentPillar] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    "Analyzing infrastructure data...",
    "Evaluating architectural maturity...",
    "Correlating semantic ontologies...",
    "Computing AI readiness scores...",
    "Generating strategic roadmap..."
  ];

  // Calculate averages per pillar
  const getResults = () => {
    const results = PILLARS.map(pillar => {
      const pillarQs = QUESTIONS.filter(q => q.pillar === pillar.id);
      const totalScore = pillarQs.reduce((sum, q) => sum + (answers[q.id] || 0), 0);
      const average = totalScore / pillarQs.length;
      return {
        subject: pillar.name,
        score: parseFloat(average.toFixed(1)),
        fullMark: 5,
        id: pillar.id
      };
    });
    return results;
  };

  const handleStart = () => setView('assessment');

  const handleAnswer = (questionId, score) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const currentQuestions = QUESTIONS.filter(q => q.pillar === PILLARS[currentPillar].id);
  const isCurrentPillarComplete = currentQuestions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentPillar < PILLARS.length - 1) {
      setCurrentPillar(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setView('loading');
    }
  };

  const handlePrev = () => {
    if (currentPillar > 0) {
      setCurrentPillar(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Loading Screen Effect
  useEffect(() => {
    if (view === 'loading') {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => {
          if (prev >= loadingTexts.length - 1) {
            clearInterval(interval);
            setTimeout(() => setView('results'), 800); // Transition to results
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [view]);


  // --- VIEWS ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
        <Activity className="w-10 h-10" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
        Enterprise Data & AI <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
          Maturity Assessment
        </span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Designed for senior directors at major infrastructure organizations. Evaluate your current capabilities across Cloud, Data Engineering, Semantics, and AI Strategy to receive a tailored, strategic roadmap for scale and innovation.
      </p>
      <button 
        onClick={handleStart}
        className="group flex items-center gap-3 bg-slate-900 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-teal-900/20 hover:-translate-y-1"
      >
        Commence Assessment
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-4xl w-full">
        {PILLARS.map(p => (
          <div key={p.id} className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100">
            <div className="text-teal-600 mb-3">{p.icon}</div>
            <span className="text-sm font-semibold text-slate-700 text-center">{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssessment = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Progress Bar */}
      <div className="mb-10">
        <div className="flex justify-between text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
          <span>{PILLARS[currentPillar].name}</span>
          <span>Step {currentPillar + 1} of {PILLARS.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentPillar + 1) / PILLARS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-10 mb-8">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100">
          <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
            {PILLARS[currentPillar].icon}
          </div>
          <h2 className="text-3xl font-bold text-slate-900">{PILLARS[currentPillar].name}</h2>
        </div>

        <div className="space-y-10">
          {currentQuestions.map((q, idx) => (
            <div key={q.id} className="space-y-4">
              <p className="text-lg font-medium text-slate-800 flex gap-3">
                <span className="text-teal-600 font-bold">{idx + 1}.</span> 
                {q.text}
              </p>
              
              <div className="grid grid-cols-5 gap-2 md:gap-4">
                {[1, 2, 3, 4, 5].map(score => {
                  const isSelected = answers[q.id] === score;
                  return (
                    <button
                      key={score}
                      onClick={() => handleAnswer(q.id, score)}
                      className={`
                        relative flex flex-col items-center justify-center py-4 px-2 rounded-xl border-2 transition-all duration-200
                        ${isSelected 
                          ? 'border-teal-600 bg-teal-50 text-teal-800 shadow-md transform scale-[1.02]' 
                          : 'border-slate-200 bg-white text-slate-600 hover:border-teal-300 hover:bg-slate-50'}
                      `}
                    >
                      <span className={`text-xl font-bold ${isSelected ? 'text-teal-700' : 'text-slate-400'}`}>
                        {score}
                      </span>
                      {/* Sub-labels for clarity on the ends */}
                      {score === 1 && <span className="text-[10px] uppercase font-semibold mt-1 opacity-60 text-center leading-tight hidden md:block">Ad-hoc /<br/>Manual</span>}
                      {score === 5 && <span className="text-[10px] uppercase font-semibold mt-1 opacity-60 text-center leading-tight hidden md:block">Optimized /<br/>Leading</span>}
                      
                      {isSelected && (
                        <div className="absolute -top-2 -right-2 bg-teal-600 text-white rounded-full p-0.5 shadow-sm">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={handlePrev}
          disabled={currentPillar === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-colors ${
            currentPillar === 0 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-200 bg-slate-100'
          }`}
        >
          <ChevronLeft className="w-5 h-5" /> Previous
        </button>

        <button
          onClick={handleNext}
          disabled={!isCurrentPillarComplete}
          className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold shadow-md transition-all ${
            !isCurrentPillarComplete
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : 'bg-teal-600 hover:bg-teal-700 text-white hover:shadow-lg hover:-translate-y-0.5'
          }`}
        >
          {currentPillar === PILLARS.length - 1 ? 'Generate Results' : 'Next Category'}
          {currentPillar !== PILLARS.length - 1 && <ChevronRight className="w-5 h-5" />}
          {currentPillar === PILLARS.length - 1 && <Zap className="w-5 h-5 ml-1" />}
        </button>
      </div>
    </div>
  );

  const renderLoading = () => (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-teal-200 rounded-full blur-xl animate-pulse opacity-50"></div>
        <Loader2 className="w-16 h-16 text-teal-600 animate-spin relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 h-8">
        {loadingTexts[loadingTextIndex]}
      </h2>
      <p className="text-slate-500">Applying sector benchmarks...</p>
    </div>
  );

  const renderResults = () => {
    const results = getResults();
    
    // Dynamic Roadmap Logic
    const h1Items = []; // < 3
    const h2Items = []; // 3 or 4
    const h3Items = []; // > 4

    results.forEach(pillar => {
      const pId = pillar.id;
      if (pillar.score < 3) h1Items.push({ title: pillar.subject, text: ROADMAP_ACTIONS[pId].foundational });
      else if (pillar.score >= 3 && pillar.score <= 4) h2Items.push({ title: pillar.subject, text: ROADMAP_ACTIONS[pId].integration });
      else if (pillar.score > 4) h3Items.push({ title: pillar.subject, text: ROADMAP_ACTIONS[pId].advanced });
    });

    const overallAvg = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-1000">
        
        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Maturity Diagnostic Results</h1>
            <p className="text-slate-600 text-lg">Confidential Assessment for Infrastructure Leadership</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md border border-slate-100 flex items-center gap-5">
            <div className="p-3 bg-slate-900 text-white rounded-lg">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Overall Maturity Index</p>
              <p className="text-4xl font-black text-teal-600">{overallAvg}<span className="text-xl text-slate-400">/5.0</span></p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Radar Chart Section */}
          <div className="lg:col-span-1 bg-white rounded-2xl shadow-xl border border-slate-100 p-6 flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-800 mb-6 w-full border-b border-slate-100 pb-4">Capability Radar</h3>
            <div className="w-full h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={results}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#334155', fontSize: 12, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8' }} />
                  <Radar
                    name="Maturity Score"
                    dataKey="score"
                    stroke="#0f766e"
                    strokeWidth={3}
                    fill="#0d9488"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
               {results.map(r => (
                 <div key={r.subject} className="bg-slate-50 p-3 rounded-lg flex justify-between items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-600">{r.subject}</span>
                    <span className="text-sm font-black text-teal-700">{r.score}</span>
                 </div>
               ))}
            </div>
          </div>

          {/* Dynamic Roadmap Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-2xl shadow-xl p-6 md:p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-bold mb-8 relative z-10">Strategic Roadmap to AI Maturity</h3>
              
              <div className="space-y-8 relative z-10">
                {/* Horizon 1 */}
                <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-[-2rem] before:w-0.5 before:bg-slate-700 last:before:hidden">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-rose-500 rounded-full border-4 border-slate-900 shadow-sm"></div>
                  <h4 className="text-lg font-bold text-rose-400 mb-1">Horizon 1: Foundations (0-6 Months)</h4>
                  <p className="text-sm text-slate-400 mb-3">Stabilize core infrastructure and governance.</p>
                  <div className="space-y-3">
                    {h1Items.length > 0 ? h1Items.map((item, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 block">{item.title}</span>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    )) : (
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-slate-400 text-sm">
                        Baseline foundations are strong across all pillars. Continue monitoring legacy system depreciation.
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizon 2 */}
                <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-[-2rem] before:w-0.5 before:bg-slate-700 last:before:hidden">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-amber-500 rounded-full border-4 border-slate-900 shadow-sm"></div>
                  <h4 className="text-lg font-bold text-amber-400 mb-1">Horizon 2: Integration (6-18 Months)</h4>
                  <p className="text-sm text-slate-400 mb-3">Scale automation and deploy initial models.</p>
                  <div className="space-y-3">
                    {h2Items.length > 0 ? h2Items.map((item, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1 block">{item.title}</span>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    )) : (
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-slate-400 text-sm">
                        Standard integration tasks depend on foundational completion or are currently scaling well. Expand cross-functional training.
                      </div>
                    )}
                  </div>
                </div>

                {/* Horizon 3 */}
                <div className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 bg-teal-500 rounded-full border-4 border-slate-900 shadow-sm"></div>
                  <h4 className="text-lg font-bold text-teal-400 mb-1">Horizon 3: Advanced AI (18-36 Months)</h4>
                  <p className="text-sm text-slate-400 mb-3">Push the boundary with autonomous systems and digital twins.</p>
                  <div className="space-y-3">
                    {h3Items.length > 0 ? h3Items.map((item, i) => (
                      <div key={i} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                        <span className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 block">{item.title}</span>
                        <p className="text-slate-300 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    )) : (
                      <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700 text-slate-400 text-sm">
                        Prepare organizational readiness for advanced use cases once Horizons 1 & 2 are solidified. Focus on securing emerging talent.
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-8">
          <button 
            onClick={() => window.location.reload()}
            className="text-slate-500 hover:text-slate-900 font-semibold underline underline-offset-4 transition-colors"
          >
            Start New Assessment
          </button>
        </div>

      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200 selection:text-teal-900">
      {/* Top Navigation / Branding */}
      <header className="bg-slate-900 text-white p-5 shadow-md flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-teal-600 p-2 rounded-lg">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-wide leading-tight">Apex Analytics Group</h1>
            <p className="text-xs text-teal-300 font-medium uppercase tracking-widest">Infrastructure Consulting</p>
          </div>
        </div>
        {view !== 'landing' && (
           <div className="hidden md:flex gap-4 text-sm font-medium text-slate-400">
             <span>Confidential</span>
             <span>•</span>
             <span>Board-Level Summary</span>
           </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pb-20">
        {view === 'landing' && renderLanding()}
        {view === 'assessment' && renderAssessment()}
        {view === 'loading' && renderLoading()}
        {view === 'results' && renderResults()}
      </main>
    </div>
  );
}