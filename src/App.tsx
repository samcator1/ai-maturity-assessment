import { useState, useEffect } from 'react';
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
  Zap,
  Globe,
  Settings2,
  Users
} from 'lucide-react';

// --- TYPES ---
interface Pillar {
  id: string;
  name: string;
  icon: JSX.Element;
  description: string;
}

interface Question {
  id: string;
  pillar: string;
  text: string;
  options: string[];
}

interface RoadmapItem {
  foundational: string;
  integration: string;
  advanced: string;
}

interface RoadmapActions {
  [key: string]: RoadmapItem;
}

interface RoadmapPoint {
  title: string;
  text: string;
}

// --- DATA STRUCTURES ---
const PILLARS: Pillar[] = [
  { 
    id: 'cloud', 
    name: 'Cloud & Infrastructure', 
    icon: <Network className="w-6 h-6" />,
    description: 'Evaluates scalability, accessibility, and computational readiness.'
  },
  { 
    id: 'data', 
    name: 'Data Engineering & Analytics', 
    icon: <Database className="w-6 h-6" />,
    description: 'Assesses efficiency of data collection, structure, and delivery.'
  },
  { 
    id: 'semantics', 
    name: 'Semantic & Ontological', 
    icon: <Building2 className="w-6 h-6" />,
    description: 'Measures asset definition, common language, and Digital Twin readiness.'
  },
  { 
    id: 'ai', 
    name: 'AI Strategy & Investment', 
    icon: <BrainCircuit className="w-6 h-6" />,
    description: 'Evaluates cultural readiness, leadership, and technical MLOps capability.'
  }
];

const QUESTIONS: Question[] = [
  // Pillar 1: Cloud & Infrastructure Maturity
  {
    id: 'c1',
    pillar: 'cloud',
    text: 'Where does your primary asset, spatial, and operational data live?',
    options: [
      'Entirely on-premise legacy servers or localized spreadsheets.',
      'Mostly on-premise, with a few isolated cloud-based storage buckets used by specific teams.',
      'A hybrid model; core systems are migrating to the cloud, but legacy operational silos remain on-premise.',
      'Cloud-first environment; almost all enterprise and engineering data is hosted in a centralized cloud platform.',
      'Fully cloud-native; infrastructure dynamically scales automatically to handle massive compute workloads.'
    ]
  },
  {
    id: 'c2',
    pillar: 'cloud',
    text: 'How is your cloud infrastructure managed and spun up?',
    options: [
      'Manually by an IT helpdesk request, taking weeks or months.',
      'Manually by dedicated cloud administrators using cloud console UIs.',
      'Partially automated using basic scripting, but requires significant manual oversight.',
      'Managed as code (Infrastructure as Code / IaC) allowing consistent, automated setups.',
      'Fully automated CI/CD pipelines drive infrastructure deployment with continuous security scanning.'
    ]
  },
  {
    id: 'c3',
    pillar: 'cloud',
    text: 'How easily can your infrastructure scale to handle data surges (e.g., massive IoT updates or LiDAR scans)?',
    options: [
      'It can’t; data surges routinely slow down or crash our existing systems.',
      'We have to provision and pay for expensive, oversized servers in advance to handle peak loads.',
      'Systems can scale up, but it requires manual intervention and results in delays.',
      'Cloud environments scale automatically based on demand, though costs can occasionally spike.',
      'Highly optimized, serverless, or auto-scaling architecture that scales instantly and cost-effectively.'
    ]
  },
  {
    id: 'c4',
    pillar: 'cloud',
    text: 'How securely and easily can internal teams and trusted supply-chain partners access data?',
    options: [
      'Data sharing happens via emailed spreadsheets, USB drives, or physical hard drives.',
      'Access requires cumbersome, slow corporate VPNs; external partners cannot easily access anything.',
      'Standard cloud access controls (IAM) are in place, but granting permissions is a slow process.',
      'Secure, role-based access control allows smooth internal sharing and governed external access.',
      'A robust "Zero Trust" API-driven ecosystem allows secure, instantaneous access for humans and machines.'
    ]
  },
  {
    id: 'c5',
    pillar: 'cloud',
    text: 'What is your approach to backup, disaster recovery, and system uptime for data platforms?',
    options: [
      'Backups are manual, infrequent, or non-existent; a failure would mean permanent data loss.',
      'Scheduled backups exist, but restoring data is slow and rarely successfully tested.',
      'Standard automated backups exist, but a major cloud outage would cause operational disruption.',
      'Multi-region backups and highly available systems ensure minimal downtime and rapid recovery.',
      'Fault-tolerant, self-healing cloud architecture with near-zero data loss, continuously tested.'
    ]
  },

  // Pillar 2: Data Engineering & Analytics Maturity
  {
    id: 'd1',
    pillar: 'data',
    text: 'How are your data pipelines (the processes that move data from source to report) built and maintained?',
    options: [
      'Entirely manual data extraction, manipulation, and copying in Excel.',
      'Legacy scripts move data, but they break frequently and require constant firefighting.',
      'Modern scheduling tools run data transfers overnight, but error handling is reactive.',
      'Production-grade, automated data pipelines (ETL/ELT) with automated alerting and lineage tracking.',
      'Real-time event-driven data pipelines that ingest and deliver asset data streams in seconds.'
    ]
  },
  {
    id: 'd2',
    pillar: 'data',
    text: 'Where is your engineering and corporate data consolidated for analysis?',
    options: [
      'Scattered across hundreds of isolated databases, network folders, and individual desktops.',
      'Consolidated into department-level data marts, but these departments do not talk to each other.',
      'A central Data Warehouse or Data Lake exists, but combining different datasets is still difficult.',
      'A modern central repository (e.g., Data Lakehouse) unifies structured asset data and documents.',
      'A unified data mesh where data is instantly discoverable and usable as a product across the org.'
    ]
  },
  {
    id: 'd3',
    pillar: 'data',
    text: 'How do you ensure the quality, accuracy, and reliability of your asset data?',
    options: [
      'We don’t; data errors are usually discovered only when a business decision goes wrong.',
      'Basic manual spot-checks are conducted right before big reporting deadlines.',
      'Standard validation rules prevent bad data entry, but legacy issues persist.',
      'Automated data quality monitoring continually checks for anomalies and alerts data owners.',
      'Automated, self-correcting validation pipelines quarantine bad data instantly and trace root sources.'
    ]
  },
  {
    id: 'd4',
    pillar: 'data',
    text: 'Who owns data quality and data governance within the organization?',
    options: [
      'Nobody; data is seen as an IT problem rather than a business asset.',
      'IT owns the data systems, but business units manage quality without clear guidelines.',
      'A data governance framework exists on paper, but owners are not actively enforcing it.',
      'Clearly defined business data owners actively manage quality, access rights, and standards.',
      'Data governance is fully embedded in the culture, supported by automated compliance tools.'
    ]
  },
  {
    id: 'd5',
    pillar: 'data',
    text: 'How easily can historical asset performance data be retrieved to analyze trends?',
    options: [
      'Impossible; historical data is routinely overwritten, archived off-site, or lost.',
      'It takes weeks of specialized IT requests to pull older data from deep archives.',
      'Historical data is saved, but changes in past formats make long-term analysis challenging.',
      'Multi-year historical data is structured, indexed, and readily accessible for trend modeling.',
      'Complete, continuous time-series history for all critical assets is instantly queryable for AI models.'
    ]
  },

  // Pillar 3: Semantic, Ontological, & Taxonomical Maturity
  {
    id: 's1',
    pillar: 'semantics',
    text: 'Do different parts of your organization use the same names and codes for identical assets?',
    options: [
      'No; every project and department has its own naming conventions and spreadsheets.',
      'A master list exists, but teams frequently deviate from it or create custom workarounds.',
      'A centralized dictionary defines categories, but legacy systems still use conflicting codes.',
      'A unified, organization-wide asset classification standard is enforced across all systems.',
      'Our asset classification seamlessly maps to international industry standards (IFC, BIM) automatically.'
    ]
  },
  {
    id: 's2',
    pillar: 'semantics',
    text: 'How well do your data systems understand how one asset affects another?',
    options: [
      'Systems treat assets as flat, isolated records; there is no digital link to the wider network.',
      'Assets are grouped by basic geography or parent-child hierarchy, but complex relationships are lost.',
      'Systems map spatial proximities (GIS), but cannot tell you operational impact of failure.',
      'We map logical dependencies; our systems know how failure impacts the broader service delivery.',
      'A mature "Knowledge Graph" maps every physical, operational, and environmental relationship.'
    ]
  },
  {
    id: 's3',
    pillar: 'semantics',
    text: 'How does an asset change in the field (e.g., a component replacement) reflect in your software?',
    options: [
      'It requires manual, repetitive data entry into multiple separate software systems.',
      'The primary system is updated manually, but secondary systems remain out of sync for weeks.',
      'Systems are linked via nightly batch updates; changes propagate but require manual reconciliation.',
      'Modern APIs instantly sync asset modifications across core enterprise systems (GIS, ERP).',
      'Real-time, event-driven synchronization ensures any change updates the entire ecosystem instantly.'
    ]
  },
  {
    id: 's4',
    pillar: 'semantics',
    text: 'To what extent does your data support a living "Digital Twin" of your infrastructure network?',
    options: [
      'We rely entirely on 2D paper drawings, PDFs, and disconnected legacy text records.',
      'We use 3D BIM/CAD for new projects, but they are not updated post-construction.',
      'We have nationwide GIS and asset registers, but they do not integrate with real-time feeds.',
      'A spatial digital representation combines static data with recent inspection and performance history.',
      'A fully predictive Digital Twin continuously ingests live IoT and weather streams for simulations.'
    ]
  },
  {
    id: 's5',
    pillar: 'semantics',
    text: 'How easy is it for an analyst to combine different data types (e.g., spend, weather, and failure rates)?',
    options: [
      'Practically impossible; it requires months of data extraction and guesswork.',
      'Possible, but requires a highly complex data engineering project every time.',
      'Data can be joined using keys, but cleaning and aligning data takes 80% of the analyst\'s time.',
      'A shared semantic layer allows data to be combined intuitively using standardized business terms.',
      'An AI-ready data catalog allows analysts or AI models to instantly join any datasets seamlessly.'
    ]
  },

  // Pillar 4: AI Strategy, Alignment, & Investment
  {
    id: 'a1',
    pillar: 'ai',
    text: 'How are your data analytics and AI initiatives currently funded?',
    options: [
      'No allocated budget; data work is squeezed into broader engineering project contingencies.',
      'Ad-hoc, short-term funding for isolated innovation trials that rarely scale.',
      'Dedicated annual budget for data projects, but heavily scrutinized for immediate ROI.',
      'Sustained, multi-year strategic investment funding a structured portfolio of AI programs.',
      'Data and AI are funded as core business infrastructure with mechanisms to rapidly scale.'
    ]
  },
  {
    id: 'a2',
    pillar: 'ai',
    text: 'What is the primary focus of your current analytical or machine learning tools?',
    options: [
      'Descriptive: We look backward to see what happened and compile retrospective reports.',
      'Diagnostic: We can drill into charts to understand why an asset failed after the fact.',
      'Predictive: We use statistical modeling to predict when assets might fail or require renewals.',
      'Prescriptive: ML models actively recommend optimized maintenance and interventions.',
      'Autonomous: AI systems continuously optimize operations and asset lifecycles dynamically.'
    ]
  },
  {
    id: 'a3',
    pillar: 'ai',
    text: 'What does your internal data science and engineering talent pool look like?',
    options: [
      'No internal data professionals; any data work falls on tech-savvy engineering enthusiasts.',
      'We rely entirely on external consultants or software vendors to build and run any models.',
      'We have a centralized data team, but they are overwhelmed by basic reporting requests.',
      'We have clear, multidisciplinary squads (Engineers, Scientists, Experts) working on production.',
      'Data literacy is systemic; teams have self-service AI tooling and elite support.'
    ]
  },
  {
    id: 'a4',
    pillar: 'ai',
    text: 'How aligned is executive leadership on the strategic risks and opportunities of AI?',
    options: [
      'Leadership views AI as hype, or is unaware of its practical applications to infrastructure.',
      'Leadership is enthusiastic about the hype but lacks understanding of required foundations.',
      'Leadership has approved an AI strategy, but there is a disconnect from operational reality.',
      'Executives understand technical requirements and actively sponsor AI programs.',
      'AI and data strategy are foundational pillars of corporate strategy, driven from the Board down.'
    ]
  },
  {
    id: 'a5',
    pillar: 'ai',
    text: 'What is the primary hurdle when trying to deploy an AI model into live operations?',
    options: [
      'We cannot get past basic data quality and infrastructure roadblocks to build a model.',
      'We can build prototypes, but lack technical capability to deploy to production (no MLOps).',
      'Technical deployment is possible, but operational teams do not trust the models.',
      'Models are deployed, but the assurance and safety-case sign-off takes a very long time.',
      'A robust MLOps pipeline safely tests and monitors live models against engineering standards.'
    ]
  }
];

const ROADMAP_ACTIONS: RoadmapActions = {
  cloud: {
    foundational: "Centralize legacy engineering data into a secure cloud landing zone. Eliminate spreadsheet-based siloes.",
    integration: "Implement Infrastructure as Code (IaC) and role-based access to enable supply chain data sharing.",
    advanced: "Deploy serverless, auto-scaling architecture optimized for real-time sensor processing and Zero Trust security."
  },
  data: {
    foundational: "Automate manual ETL processes and define clear business ownership for core asset data quality.",
    integration: "Unify data into a Lakehouse architecture with automated quality monitoring and anomaly detection.",
    advanced: "Establish a Data Mesh where real-time event-driven streams are consumed as products across the organization."
  },
  semantics: {
    foundational: "Standardize asset taxonomy across departments. Map parent-child hierarchies in a centralized GIS.",
    integration: "Build an enterprise semantic layer and Digital Twin that integrates static assets with inspection history.",
    advanced: "Leverage Knowledge Graphs to map complex dependencies and power predictive simulations of the entire network."
  },
  ai: {
    foundational: "Secure strategic funding for data foundations and pilot high-value descriptive/diagnostic use cases.",
    integration: "Scale multidisciplinary AI squads and implement baseline MLOps for predictive maintenance models.",
    advanced: "Deploy prescriptive and autonomous systems driven by a Board-level AI strategy and robust safety assurance."
  }
};

export default function App() {
  const [view, setView] = useState<'landing' | 'assessment' | 'loading' | 'results'>('landing');
  const [currentPillar, setCurrentPillar] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loadingTextIndex, setLoadingTextIndex] = useState(0);

  const loadingTexts = [
    "Analyzing infrastructure data...",
    "Evaluating architectural maturity...",
    "Correlating semantic ontologies...",
    "Computing AI readiness scores...",
    "Generating strategic roadmap..."
  ];

  const getResults = () => {
    return PILLARS.map(pillar => {
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
  };

  const handleStart = () => setView('assessment');

  const handleAnswer = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const currentQuestions = QUESTIONS.filter(q => q.pillar === PILLARS[currentPillar].id);
  const isCurrentPillarComplete = currentQuestions.every(q => answers[q.id] !== undefined);

  const handleNext = () => {
    if (currentPillar < PILLARS.length - 1) {
      setCurrentPillar(prev => prev + 1);
    } else {
      setView('loading');
    }
  };

  const handlePrev = () => {
    if (currentPillar > 0) {
      setCurrentPillar(prev => prev - 1);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPillar, view]);

  useEffect(() => {
    if (view === 'loading') {
      const interval = setInterval(() => {
        setLoadingTextIndex(prev => {
          if (prev >= loadingTexts.length - 1) {
            clearInterval(interval);
            setTimeout(() => setView('results'), 800);
            return prev;
          }
          return prev + 1;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [view]);

  // --- RENDERING ---

  const renderLanding = () => (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 animate-in fade-in duration-700">
      <div className="w-20 h-20 bg-teal-100 text-teal-700 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
        <Activity className="w-10 h-10" />
      </div>
      <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6 leading-tight">
        Infrastructure Data & AI <br/>
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600">
          Maturity Diagnostic
        </span>
      </h1>
      <p className="text-lg text-slate-600 max-w-2xl mb-10 leading-relaxed">
        Strategic evaluation for major infrastructure organizations. Assess your capabilities across Cloud, Data Engineering, Semantics, and AI Strategy to receive a tailored innovation roadmap.
      </p>
      <button 
        onClick={handleStart}
        className="group flex items-center gap-3 bg-slate-900 hover:bg-teal-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all shadow-xl hover:shadow-teal-900/20 hover:-translate-y-1"
      >
        Commence Assessment
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20 max-w-5xl w-full">
        {PILLARS.map(p => (
          <div key={p.id} className="flex flex-col items-center p-5 bg-white rounded-xl shadow-sm border border-slate-100 text-center">
            <div className="text-teal-600 mb-3">{p.icon}</div>
            <span className="text-sm font-bold text-slate-800 mb-1">{p.name}</span>
            <span className="text-[10px] text-slate-400 uppercase tracking-tighter leading-tight">{p.description}</span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAssessment = () => (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10">
        <div className="flex justify-between text-sm font-semibold text-slate-500 mb-3 uppercase tracking-wider">
          <span className="flex items-center gap-2">
            <span className="text-teal-600">{PILLARS[currentPillar].icon}</span>
            {PILLARS[currentPillar].name}
          </span>
          <span>Category {currentPillar + 1} of {PILLARS.length}</span>
        </div>
        <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-600 transition-all duration-500 ease-out"
            style={{ width: `${((currentPillar + 1) / PILLARS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-12 mb-12">
        {currentQuestions.map((q, idx) => (
          <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 md:p-8 bg-slate-50 border-b border-slate-100">
              <p className="text-xl font-bold text-slate-900 flex gap-4">
                <span className="text-teal-600">{idx + 1}.</span> 
                {q.text}
              </p>
            </div>
            
            <div className="p-4 md:p-6 grid gap-3">
              {q.options.map((optionText, optionIdx) => {
                const score = optionIdx + 1;
                const isSelected = answers[q.id] === score;
                return (
                  <button
                    key={optionIdx}
                    onClick={() => handleAnswer(q.id, score)}
                    className={`
                      group relative flex items-start gap-4 p-5 rounded-xl border-2 text-left transition-all duration-200
                      ${isSelected 
                        ? 'border-teal-600 bg-teal-50 text-teal-900 shadow-md ring-4 ring-teal-600/5' 
                        : 'border-slate-100 bg-white text-slate-600 hover:border-teal-200 hover:bg-slate-50'}
                    `}
                  >
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors
                      ${isSelected ? 'bg-teal-600 border-teal-600 text-white' : 'border-slate-200 text-slate-300 group-hover:border-teal-300 group-hover:text-teal-400'}
                    `}>
                      {score}
                    </div>
                    <div className="flex-grow pt-0.5">
                      <p className={`text-sm md:text-base leading-relaxed ${isSelected ? 'font-semibold' : 'font-medium'}`}>
                        {optionText}
                      </p>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-5 h-5 text-teal-600 flex-shrink-0 mt-1" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center sticky bottom-6 z-40 bg-slate-50/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg">
        <button
          onClick={handlePrev}
          disabled={currentPillar === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
            currentPillar === 0 
              ? 'text-slate-300 cursor-not-allowed' 
              : 'text-slate-600 hover:bg-slate-200 bg-white shadow-sm'
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
              : 'bg-slate-900 hover:bg-teal-700 text-white hover:shadow-xl hover:-translate-y-0.5'
          }`}
        >
          {currentPillar === PILLARS.length - 1 ? 'Generate Results' : 'Next Category'}
          {currentPillar !== PILLARS.length - 1 && <ChevronRight className="w-5 h-5" />}
          {currentPillar === PILLARS.length - 1 && <Zap className="w-5 h-5 ml-1 text-teal-400" />}
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
      <h2 className="text-2xl font-bold text-slate-800 mb-2 h-8 transition-all">
        {loadingTexts[loadingTextIndex]}
      </h2>
      <p className="text-slate-500">Cross-referencing organizational benchmarks...</p>
    </div>
  );

  const renderResults = () => {
    const results = getResults();
    const h1Items: RoadmapPoint[] = [];
    const h2Items: RoadmapPoint[] = [];
    const h3Items: RoadmapPoint[] = [];

    results.forEach(pillar => {
      const pId = pillar.id;
      if (pillar.score < 3) h1Items.push({ title: pillar.subject, text: ROADMAP_ACTIONS[pId].foundational });
      else if (pillar.score >= 3 && pillar.score <= 4) h2Items.push({ title: pillar.subject, text: ROADMAP_ACTIONS[pId].integration });
      else if (pillar.score > 4) h3Items.push({ title: pillar.subject, text: ROADMAP_ACTIONS[pId].advanced });
    });

    const overallAvg = (results.reduce((sum, r) => sum + r.score, 0) / results.length).toFixed(1);

    return (
      <div className="max-w-6xl mx-auto px-4 py-8 animate-in fade-in duration-1000">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Maturity Diagnostic Results</h1>
            <p className="text-slate-600 text-lg font-medium">Confidential Strategy for Infrastructure Leadership</p>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-6">
            <div className="p-4 bg-slate-900 text-white rounded-xl shadow-lg">
              <BarChart3 className="w-8 h-8" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Maturity Index</p>
              <p className="text-5xl font-black text-teal-600 tabular-nums">{overallAvg}<span className="text-xl text-slate-300">/5.0</span></p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-xl border border-slate-100 p-8 flex flex-col items-center">
            <h3 className="text-xl font-bold text-slate-800 mb-8 w-full border-b border-slate-50 pb-4">Capability Radar</h3>
            <div className="w-full h-[350px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={results}>
                  <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />
                  <Radar
                    name="Maturity Score"
                    dataKey="score"
                    stroke="#0d9488"
                    strokeWidth={4}
                    fill="#0d9488"
                    fillOpacity={0.4}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 w-full mt-6">
               {results.map(r => (
                 <div key={r.subject} className="bg-slate-50 px-4 py-3 rounded-xl flex justify-between items-center border border-slate-100">
                    <span className="text-xs font-bold text-slate-600">{r.subject}</span>
                    <span className="text-base font-black text-teal-700">{r.score}</span>
                 </div>
               ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-900 rounded-3xl shadow-2xl p-8 md:p-10 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-teal-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
              <h3 className="text-2xl font-bold mb-10 relative z-10 flex items-center gap-3">
                <Zap className="text-teal-400" />
                Strategic Roadmap to AI Maturity
              </h3>
              
              <div className="space-y-10 relative z-10">
                <div className="relative pl-10 before:absolute before:left-3.5 before:top-2 before:bottom-[-2.5rem] before:w-1 before:bg-slate-800 last:before:hidden">
                  <div className="absolute left-0 top-1 w-8 h-8 bg-rose-500 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                    <Settings2 className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-rose-400 mb-1">Horizon 1: Foundations (0-6 Months)</h4>
                  <p className="text-sm text-slate-400 mb-4 font-medium">Stabilize core infrastructure and governance.</p>
                  <div className="grid gap-3">
                    {h1Items.length > 0 ? h1Items.map((item, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1 block">{item.title}</span>
                        <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    )) : (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-slate-500 text-sm italic">
                        Foundation targets achieved. Focus on acceleration.
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative pl-10 before:absolute before:left-3.5 before:top-2 before:bottom-[-2.5rem] before:w-1 before:bg-slate-800 last:before:hidden">
                  <div className="absolute left-0 top-1 w-8 h-8 bg-amber-500 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                    <Globe className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-amber-400 mb-1">Horizon 2: Integration (6-18 Months)</h4>
                  <p className="text-sm text-slate-400 mb-4 font-medium">Scale automation and deploy initial models.</p>
                  <div className="grid gap-3">
                    {h2Items.length > 0 ? h2Items.map((item, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 mb-1 block">{item.title}</span>
                        <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    )) : (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-slate-500 text-sm italic">
                        System integration targets met.
                      </div>
                    )}
                  </div>
                </div>

                <div className="relative pl-10">
                  <div className="absolute left-0 top-1 w-8 h-8 bg-teal-500 rounded-full border-4 border-slate-900 shadow-xl flex items-center justify-center">
                    <Users className="w-3 h-3 text-white" />
                  </div>
                  <h4 className="text-lg font-bold text-teal-400 mb-1">Horizon 3: Advanced AI (18-36 Months)</h4>
                  <p className="text-sm text-slate-400 mb-4 font-medium">Autonomous systems and network-wide Digital Twins.</p>
                  <div className="grid gap-3">
                    {h3Items.length > 0 ? h3Items.map((item, i) => (
                      <div key={i} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10 hover:border-white/20 transition-all">
                        <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-1 block">{item.title}</span>
                        <p className="text-slate-200 text-sm leading-relaxed">{item.text}</p>
                      </div>
                    )) : (
                      <div className="bg-white/5 rounded-xl p-4 border border-white/5 text-slate-500 text-sm italic">
                        Elite operational state. Maintain innovation leadership.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-12 pb-12 border-t border-slate-100 pt-10">
          <p className="text-slate-400 text-sm font-medium">Want to share this assessment with your board?</p>
          <div className="flex gap-4">
            <button 
              onClick={() => window.print()}
              className="bg-white text-slate-700 px-6 py-3 rounded-xl font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              Export PDF Report
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all"
            >
              Start New Assessment
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-200 selection:text-teal-900 text-slate-900">
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-teal-600 p-2 rounded-lg shadow-inner">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide leading-tight">Apex Analytics Group</h1>
              <p className="text-[10px] text-teal-400 font-black uppercase tracking-[0.2em]">Infrastructure Consulting</p>
            </div>
          </div>
          {view !== 'landing' && (
             <div className="hidden md:flex items-center gap-6">
               <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                 <span className="bg-slate-800 px-2 py-1 rounded">Confidential</span>
                 <span className="bg-slate-800 px-2 py-1 rounded border border-teal-500/30 text-teal-400">Board-Level</span>
               </div>
             </div>
          )}
        </div>
      </header>

      <main className="pb-20">
        {view === 'landing' && renderLanding()}
        {view === 'assessment' && renderAssessment()}
        {view === 'loading' && renderLoading()}
        {view === 'results' && renderResults()}
      </main>

      <footer className="py-10 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-400 text-xs font-medium">
          <p>© 2026 Apex Analytics Group. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-teal-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Methodology</a>
            <a href="#" className="hover:text-teal-600 transition-colors">Contact Expert</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
