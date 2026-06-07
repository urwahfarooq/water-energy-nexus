const API_BASE_URL = 'https://water-energy-nexus-smoky.vercel.app';const CLASS_LABELS = ['Patent', 'Policy', 'Project', 'Publication'];

// Selected active prediction engine ('ML' or 'DL')
let activeEngine = 'ML';
let latestPredictionReport = null;

// LabelEncoder categories dictionary
const LABEL_ENCODER_MAP = {
  quarter: ['Q1','Q2','Q3','Q4'],
  country: ['Argentina','Australia','Bangladesh','Brazil','Canada','Chile','China','Colombia','Egypt','Ethiopia','France','Germany','India','Indonesia','Iran','Israel','Italy','Japan','Kenya','Mexico','Morocco','Netherlands','Nigeria','Norway','Pakistan','Peru','Poland','Portugal','Saudi Arabia','Singapore','South Africa','South Korea','Spain','Sweden','Turkey','UAE','UK','USA','Vietnam'],
  region: ['Asia-Pacific','Europe','Latin America','Middle East & Africa','North America','South Asia'],
  climate_zone: ['Arid','Continental','Mediterranean','Semi-Arid','Temperate','Tropical'],
  water_stress_level: ['Extremely High','High','Low','Low-Medium','Medium','Medium-High'],
  organization: ['A*STAR','ADWEC','ANA (Agência Nacional de Águas)','ANEEL','Abu Dhabi University','Al Akhawayn University','Alibaba DAMO Academy','Argentina Energy Regulatory Commission','Argentina Ministry of Water & Energy','Argentina National Research Institute','Argentina National University','Argentina Regional Water Authority','Australian National University (ANU)','BC Hydro','BRGM','Bangladesh Energy Regulatory Commission','Bangladesh Ministry of Water & Energy','Bangladesh National Research Institute','Bangladesh National University','Bangladesh Regional Water Authority','Ben-Gurion University of the Negev','Bibliotheca Alexandrina','Bureau of Meteorology','CEA','CNRS','CPCB','CSIR South Africa','CSIRO','CWRDM','Cairo University','Canal Isabel II','Carnegie Mellon University','Chile Energy Regulatory Commission','Chile Ministry of Water & Energy','Chile National Research Institute','Chile National University','Chile Regional Water Authority','China Three Gorges Corporation','China Water Resources Institute','Chinese Academy of Sciences','Colombia Energy Regulatory Commission','Colombia Ministry of Water & Energy','Colombia National Research Institute','Colombia National University','Colombia Regional Water Authority','Columbia Water Center','DEWA (Dubai Electricity & Water Authority)','DVGW','Deltares','EMBRAPA','ETRI','Egypt Electricity Holding Company','Egyptian Water Authority','Environment Agency','Environment and Climate Change Canada','Eskom','Ethiopia Energy Regulatory Commission','Ethiopia Ministry of Water & Energy','Ethiopia National Research Institute','Ethiopia National University','Ethiopia Regional Water Authority','Fraunhofer Institute','GIZ','Georgia Tech','Google DeepMind','Helmholtz Centre for Environmental Research (UFZ)','Hitachi Research','Huawei Research','IBM Research','ICAR','IDE Technologies','IHE Delft Spain Office','IISc Bangalore','IIT Bombay','IIT Delhi','IIT Madras','IMDEA Water','INPE','INRAE','IRESEN','ISRO','Imperial College London','Indonesia Energy Regulatory Commission','Indonesia Ministry of Water & Energy','Indonesia National Research Institute','Indonesia National University','Indonesia Regional Water Authority','Iran Energy Regulatory Commission','Iran Ministry of Water & Energy','Iran National Research Institute','Iran National University','Iran Regional Water Authority','Italy Energy Regulatory Commission','Italy Ministry of Water & Energy','Italy National Research Institute','Italy National University','Italy Regional Water Authority','JAXA','K-water (Korea Water Resources Corp.)','KACST','KAIST','KAUST','KEPCO','KWR Water Research Institute','Karlsruhe Institute of Technology (KIT)','Kenya Energy Regulatory Commission','Kenya Ministry of Water & Energy','Kenya National Research Institute','Kenya National University','Kenya Regional Water Authority','King Saud University','Kyoto University','Lawrence Berkeley National Lab','MIT','Masdar Institute / Khalifa University','McGill University','Mekorot National Water Company','Mexico Energy Regulatory Commission','Mexico Ministry of Water & Energy','Mexico National Research Institute','Mexico National University','Mexico Regional Water Authority','Microsoft Research','Mohamed Bin Zayed University of AI (MBZUAI)','Mohammed VI Polytechnic University (UM6P)','NIES (National Institute for Environmental Studies)','NITI Aayog','NREL','NWC (National Water Company)','NWRC','Nanyang Technological University (NTU)','National Research Council Canada','National University of Singapore (NUS)','National Water Mission India','Nigeria Energy Regulatory Commission','Nigeria Ministry of Water & Energy','Nigeria National Research Institute','Nigeria National University','Nigeria Regional Water Authority','Norway Energy Regulatory Commission','Norway Ministry of Water & Energy','Norway National Research Institute','Norway National University','Norway Regional Water Authority',"ONEE (Office National de l'Eau et de l'Électricité)",'Ofwat','PUB (Singapore National Water Agency)','PWN Water Supply Company','Pakistan Energy Regulatory Commission','Pakistan Ministry of Water & Energy','Pakistan National Research Institute','Pakistan National University','Pakistan Regional Water Authority','Peking University','Peru Energy Regulatory Commission','Peru Ministry of Water & Energy','Peru National Research Institute','Peru National University','Peru Regional Water Authority','Petrobras Research Center','Poland Energy Regulatory Commission','Poland Ministry of Water & Energy','Poland National Research Institute','Poland National University','Poland Regional Water Authority','Polytechnic University of Catalonia','Portugal Energy Regulatory Commission','Portugal Ministry of Water & Energy','Portugal National Research Institute','Portugal National University','Portugal Regional Water Authority','RWE AG','Rand Water','Red Eléctrica de España','Royal HaskoningDHV','SERIS','STFC','SWCC (Saline Water Conversion Corp.)','Saudi Aramco','Scottish Water','Seoul National University','Shanghai Jiao Tong University','Siemens AG','Stanford University','State Grid Corporation of China','Suez Environnement','Sweden Energy Regulatory Commission','Sweden Ministry of Water & Energy','Sweden National Research Institute','Sweden National University','Sweden Regional Water Authority','TERI','TU Delft','TU Munich','Technion – Israel Institute of Technology','Thames Water','Toshiba Infrastructure Systems','Tsinghua University','Turkey Energy Regulatory Commission','Turkey Ministry of Water & Energy','Turkey National Research Institute','Turkey National University','Turkey Regional Water Authority','U.S. DOE','U.S. EPA','USGS','University of California Berkeley','University of Cambridge','University of Cape Town','University of Melbourne','University of Oxford','University of Queensland','University of São Paulo (USP)','University of Tokyo','University of Toronto','Veolia Water','Vietnam Energy Regulatory Commission','Vietnam Ministry of Water & Energy','Vietnam National Research Institute','Vietnam National University','Vietnam Regional Water Authority','Vitens','Wageningen University','Water Corporation WA','Water Research Commission (WRC)','Weizmann Institute of Science','Zhejiang University','École Polytechnique'],
  collaboration_type: ['Academic','Academic-Government','Academic-Industry','Government','Industry','International Bilateral','Multi-stakeholder Consortium','NGO / Civil Society','Public-Private Partnership (PPP)','UN-affiliated'],
  sector: ['Climate Adaptation','Energy Systems','Environmental Monitoring','Industrial Optimization','Policy & Governance','Smart Agriculture','Urban Infrastructure','Water Management','Water-Energy Nexus'],
  ai_technique: ['AI Agent','Agentic AI Systems','Artificial Neural Network','Attention Mechanism','Autoencoder','BERT','Bidirectional LSTM','CNN','Contrastive Learning','Decision Tree','Deep Learning','Diffusion Model','Digital Twin','Ensemble Methods','Explainable AI (XAI)','Federated Learning','Foundation Model','GAN','Gradient Boosting','Graph Neural Network','K-Means Clustering','LSTM','Large Language Model (LLM)','Linear Regression','Machine Learning','Multimodal AI','Naive Bayes','Neuromorphic Computing','Quantum-Classical Hybrid AI','RNN','Random Forest','Reinforcement Learning','Retrieval-Augmented Generation','Self-Supervised Learning','Support Vector Machine','Transfer Learning','Transformer','Vision Transformer','XGBoost'],
  water_application: ['Agricultural Water Use Efficiency','Aquifer Recharge Monitoring','Coastal & Ocean Water Monitoring','Desalination Process Optimization','Drought Prediction & Response','Flood Prediction & Early Warning','Groundwater Level Prediction','Non-Revenue Water Reduction','Pipeline Leak Detection','Real-Time Water Quality Alerts','Reservoir Operation Optimization','River Flow & Streamflow Prediction','Sediment Transport Monitoring','Smart Irrigation Management','Stormwater Management','Transboundary Water Management','Urban Water Demand Forecasting','Urban Water Loss Reduction','Wastewater Treatment Optimization','Water Distribution Network Optimization','Water Governance Analytics','Water Quality Monitoring & Assessment','Water Tariff Optimization','Wetland Ecosystem Monitoring'],
  energy_application: ['Battery Energy Storage Optimization','Bioenergy Resource Potential Mapping','Building Energy Efficiency','Carbon Emission Monitoring','Demand Response Management','Electric Vehicle Grid Integration','Energy Access & Poverty Mapping','Energy Demand Forecasting','Energy Market Price Forecasting','Fuel Cell System Management','Green Hydrogen Production Optimization','Hydropower Plant Optimization','Microgrid & Islanding Optimization','Nuclear Plant Cooling Water Optimization','Offshore Wind Farm Management','Predictive Maintenance for Energy Assets','Renewable Energy Grid Integration','Smart Grid Management & Optimization','Solar Power Generation Forecasting','Thermal Power Plant Efficiency','Transmission Line Fault Detection','Wind Energy Output Forecasting'],
  nexus_focus: ['AI-Driven Green Infrastructure Planning','Agricultural WEF Nexus Optimization','Carbon-Water Trade-off Optimization','Climate Resilience & Adaptation Planning','Cooling Water Stress Mitigation','Decarbonization & Water Security','Energy-for-Water Treatment & Pumping','Food-Water-Energy (FWE) Nexus','Industrial Symbiosis & Eco-Parks','Integrated Water-Energy Resource Management','Joint Water-Energy System Optimization','Nature-Based Solutions Enhanced by AI','Resource Efficiency & Circular Economy','SDG 6 & SDG 7 Co-Benefit Strategies','Transboundary Water-Energy Governance','Urban Sustainability & Smart Cities','Water-Energy Poverty Alleviation','Water-for-Energy Cooling Systems'],
  deployment_scale: ['City-level','Global','International','Local / Community','National','Pilot / Proof of Concept','Regional'],
  status: ['Abandoned','Accepted (In Press)','Active','Amended','Completed','Contested','Draft Stage','Enacted / In Force','Filed','Granted','Licensed to Industry','Ongoing','Pending Examination','Preprint / arXiv','Proposed','Published','Repealed','Scaled Up','Terminated Early','Under Evaluation','Under Peer Review','Under Public Review'],
  sdg_alignment: ['SDG 11 (Sustainable Cities & Communities)','SDG 12 (Responsible Consumption & Production)','SDG 13 (Climate Action)','SDG 2 (Zero Hunger) & SDG 6','SDG 6 & SDG 7','SDG 6 (Clean Water & Sanitation)','SDG 6, SDG 7 & SDG 13','SDG 6, SDG 9 & SDG 11','SDG 7 & SDG 13','SDG 7 (Affordable & Clean Energy)','SDG 9 (Industry, Innovation & Infrastructure)'],
  model_performance_metric: ['AUC-ROC','Accuracy','Cumulative Reward','Energy Efficiency Score','F1 Score','FID Score','MAE','RMSE','Reconstruction Loss','R² Score','Silhouette Score','Simulation MAPE (%)','Task Completion Rate','Task Success Rate'],
  open_access: ['Gold OA','Green OA','No','Yes'],
  patent_class: ['A01G – Smart Irrigation & Horticulture','B01D – Desalination & Membrane Filtration','C02F – Treatment of Water or Wastewater','E03B – Water Supply & Distribution Systems','E21B – Drilling & Groundwater Extraction','F03B – Machines or Engines for Liquid Flow (Hydropower)','F24S – Solar Energy Collection Systems','G01N – Investigating or Analysing Water Quality','G01W – Meteorology & Hydrological Sensors','G06F – Data Processing for Environmental Monitoring','G06N – Machine Learning & AI Systems','G08B – Alarm & Alert Systems for Water/Energy','H02J – Power Grid Circuit Management','H02S – Solar Photovoltaic Systems','H04L – IoT & Network-Based Environmental Monitoring'],
  policy_type: ['AI Ethics in Water & Energy Infrastructure','AI Governance Framework for Public Infrastructure','Carbon Pricing & Water Credit Mechanism','Circular Economy Directive','Climate Adaptation & Resilience Policy','Data Governance Policy for Environmental AI Systems','Digital Water Economy Strategy','Green Hydrogen National Policy','National Water Strategy & AI Roadmap','Renewable Energy Transition Act','SDG 6 & SDG 7 National Implementation Plan','Smart Infrastructure Investment Regulation','Transboundary River Basin AI Monitoring Agreement','Urban Water-Energy Sustainability Charter','Water-Energy Nexus National Action Plan','Water-Food-Energy Security Act'],
  policy_level: ['International / Multilateral','Municipal / City-level','National','Regional','Subnational / Provincial'],
  language: ['English','English; Arabic','English; Chinese','English; Dutch','English; French','English; German','English; Japanese','English; Korean','English; Persian','English; Portuguese','English; Spanish','English; Turkish']
};

// Initial form config defaults
const FORM_DEFAULTS = {
  quarter: 'Q2',
  country: 'Pakistan',
  region: 'South Asia',
  climate_zone: 'Arid',
  water_stress_level: 'High',
  collaboration_type: 'Academic-Government',
  sector: 'Water Management',
  ai_technique: 'CNN',
  water_application: 'Agricultural Water Use Efficiency',
  energy_application: 'Energy Demand Forecasting',
  nexus_focus: 'Agricultural WEF Nexus Optimization',
  deployment_scale: 'National',
  status: 'Active',
  sdg_alignment: 'SDG 6 & SDG 7',
  model_performance_metric: 'Accuracy',
  open_access: 'Green OA',
  organization: 'IIT Bombay',
  patent_class: 'C02F – Treatment of Water or Wastewater',
  policy_type: 'National Water Strategy & AI Roadmap',
  policy_level: 'National',
  language: 'English'
};

// Preset Scenario configurations
const SCENARIO_PRESETS = {
  patent: {
    f_year: 2024,
    f_month: 8,
    f_quarter: 'Q3',
    f_country: 'Germany',
    f_region: 'Europe',
    f_climate_zone: 'Temperate',
    f_water_stress_level: 'Medium-High',
    f_organization: 'Fraunhofer Institute',
    f_collaboration_type: 'Academic-Industry',
    f_sector: 'Industrial Optimization',
    f_ai_technique: 'CNN',
    f_water_application: 'Wastewater Treatment Optimization',
    f_energy_application: 'Smart Grid Management & Optimization',
    f_nexus_focus: 'Joint Water-Energy System Optimization',
    f_deployment_scale: 'Regional',
    f_status: 'Filed',
    f_sdg_alignment: 'SDG 6 & SDG 7',
    f_funding_usd: 450000,
    f_investment_roi: 3.2,
    f_population_served: 200000,
    f_citation_count: 8,
    f_impact_score: 68,
    f_innovation_index: 7.2,
    f_model_performance_metric: 'Accuracy',
    f_model_performance_value: 0.91,
    f_co2_reduction_tons: 1200,
    f_water_savings_liters: 1200000,
    f_energy_savings_kwh: 85000,
    f_renewable_energy_share_pct: 65,
    f_open_access: 'No',
    f_venue_h_index: 0,
    f_patent_class: 'C02F – Treatment of Water or Wastewater',
    f_patent_family_size: 5,
    f_policy_type: 'National Water Strategy & AI Roadmap',
    f_policy_level: 'National',
    f_policy_stringency_score: 0,
    f_language: 'English'
  },
  policy: {
    f_year: 2025,
    f_month: 3,
    f_quarter: 'Q1',
    f_country: 'Pakistan',
    f_region: 'South Asia',
    f_climate_zone: 'Arid',
    f_water_stress_level: 'Extremely High',
    f_organization: 'Pakistan Ministry of Water & Energy',
    f_collaboration_type: 'Government',
    f_sector: 'Policy & Governance',
    f_ai_technique: 'Machine Learning',
    f_water_application: 'Water Governance Analytics',
    f_energy_application: 'Carbon Emission Monitoring',
    f_nexus_focus: 'Climate Resilience & Adaptation Planning',
    f_deployment_scale: 'National',
    f_status: 'Enacted / In Force',
    f_sdg_alignment: 'SDG 6, SDG 7 & SDG 13',
    f_funding_usd: 80000,
    f_investment_roi: 1.5,
    f_population_served: 15000000,
    f_citation_count: 0,
    f_impact_score: 85,
    f_innovation_index: 5.0,
    f_model_performance_metric: 'F1 Score',
    f_model_performance_value: 0.88,
    f_co2_reduction_tons: 25000,
    f_water_savings_liters: 150000000,
    f_energy_savings_kwh: 450000,
    f_renewable_energy_share_pct: 35,
    f_open_access: 'Yes',
    f_venue_h_index: 0,
    f_patent_class: 'G06N – Machine Learning & AI Systems',
    f_patent_family_size: 0,
    f_policy_type: 'Water-Energy Nexus National Action Plan',
    f_policy_level: 'National',
    f_policy_stringency_score: 4.5,
    f_language: 'English'
  },
  project: {
    f_year: 2023,
    f_month: 11,
    f_quarter: 'Q4',
    f_country: 'USA',
    f_region: 'North America',
    f_climate_zone: 'Semi-Arid',
    f_water_stress_level: 'High',
    f_organization: 'MIT',
    f_collaboration_type: 'Public-Private Partnership (PPP)',
    f_sector: 'Urban Infrastructure',
    f_ai_technique: 'Reinforcement Learning',
    f_water_application: 'Reservoir Operation Optimization',
    f_energy_application: 'Renewable Energy Grid Integration',
    f_nexus_focus: 'Integrated Water-Energy Resource Management',
    f_deployment_scale: 'City-level',
    f_status: 'Active',
    f_sdg_alignment: 'SDG 6 & SDG 7 Co-Benefit Strategies',
    f_funding_usd: 5800000,
    f_investment_roi: 4.8,
    f_population_served: 850000,
    f_citation_count: 24,
    f_impact_score: 79,
    f_innovation_index: 8.5,
    f_model_performance_metric: 'RMSE',
    f_model_performance_value: 0.94,
    f_co2_reduction_tons: 45000,
    f_water_savings_liters: 500000000,
    f_energy_savings_kwh: 1200000,
    f_renewable_energy_share_pct: 80,
    f_open_access: 'Yes',
    f_venue_h_index: 35,
    f_patent_class: 'G06N – Machine Learning & AI Systems',
    f_patent_family_size: 1,
    f_policy_type: 'Smart Infrastructure Investment Regulation',
    f_policy_level: 'Regional',
    f_policy_stringency_score: 2.0,
    f_language: 'English'
  },
  publication: {
    f_year: 2022,
    f_month: 6,
    f_quarter: 'Q2',
    f_country: 'China',
    f_region: 'Asia-Pacific',
    f_climate_zone: 'Continental',
    f_water_stress_level: 'Medium-High',
    f_organization: 'Tsinghua University',
    f_collaboration_type: 'Academic',
    f_sector: 'Water-Energy Nexus',
    f_ai_technique: 'Attention Mechanism',
    f_water_application: 'Desalination Process Optimization',
    f_energy_application: 'Bioenergy Resource Potential Mapping',
    f_nexus_focus: 'Food-Water-Energy (FWE) Nexus',
    f_deployment_scale: 'Pilot / Proof of Concept',
    f_status: 'Published',
    f_sdg_alignment: 'SDG 6, SDG 7 & SDG 13',
    f_funding_usd: 120000,
    f_investment_roi: 2.2,
    f_population_served: 5000,
    f_citation_count: 142,
    f_impact_score: 92,
    f_innovation_index: 9.0,
    f_model_performance_metric: 'Accuracy',
    f_model_performance_value: 0.96,
    f_co2_reduction_tons: 150,
    f_water_savings_liters: 85000,
    f_energy_savings_kwh: 45000,
    f_renewable_energy_share_pct: 50,
    f_open_access: 'Gold OA',
    f_venue_h_index: 88,
    f_patent_class: 'B01D – Desalination & Membrane Filtration',
    f_patent_family_size: 0,
    f_policy_type: 'Circular Economy Directive',
    f_policy_level: 'Municipal / City-level',
    f_policy_stringency_score: 1.0,
    f_language: 'English; Chinese'
  }
};

// Document startup initialization
window.addEventListener('DOMContentLoaded', () => {
  populateAllDropdowns();
  checkServerConnection();
  // Poll backend status every 6 seconds
  setInterval(checkServerConnection, 6000);
  // Auto-render Lucide icons
  lucide.createIcons();
});

// Populate categorical selects using map dictionaries
function populateAllDropdowns() {
  const elementsMap = {
    f_quarter: 'quarter',
    f_country: 'country',
    f_region: 'region',
    f_climate_zone: 'climate_zone',
    f_water_stress_level: 'water_stress_level',
    f_organization: 'organization',
    f_collaboration_type: 'collaboration_type',
    f_language: 'language',
    f_open_access: 'open_access',
    f_sector: 'sector',
    f_ai_technique: 'ai_technique',
    f_water_application: 'water_application',
    f_energy_application: 'energy_application',
    f_nexus_focus: 'nexus_focus',
    f_deployment_scale: 'deployment_scale',
    f_status: 'status',
    f_sdg_alignment: 'sdg_alignment',
    f_model_performance_metric: 'model_performance_metric',
    f_patent_class: 'patent_class',
    f_policy_type: 'policy_type',
    f_policy_level: 'policy_level'
  };

  for (const [selectId, mapKey] of Object.entries(elementsMap)) {
    const el = document.getElementById(selectId);
    if (!el) continue;

    const optionsList = LABEL_ENCODER_MAP[mapKey];
    const defaultVal = FORM_DEFAULTS[mapKey];

    el.innerHTML = optionsList.map(opt => {
      const isSelected = opt === defaultVal ? 'selected' : '';
      return `<option value="${opt}" ${isSelected}>${opt}</option>`;
    }).join('');
  }
}

// Check Flask server status
async function checkServerConnection() {
  const dot = document.getElementById('status-dot');
  const text = document.getElementById('status-text');
  const mlChip = document.getElementById('ml-status');
  const dlChip = document.getElementById('dl-status');

  try {
    const response = await fetch(`${API_BASE_URL}/`);
    const data = await response.json();

    if (data.status === 'running') {
      dot.className = 'status-pulse online';
      text.innerText = 'ONLINE';

      if (data.ml) {
        mlChip.className = 'status-chip loaded-ml';
        mlChip.innerText = 'ML Core Active';
      } else {
        mlChip.className = 'status-chip';
        mlChip.innerText = 'ML Loaded Err';
      }

      if (data.dl) {
        dlChip.className = 'status-chip loaded-dl';
        dlChip.innerText = 'DL Core Active';
      } else {
        dlChip.className = 'status-chip';
        dlChip.innerText = 'DL Offline';
      }
    } else {
      setServerOffline(dot, text, mlChip, dlChip);
    }
  } catch (e) {
    setServerOffline(dot, text, mlChip, dlChip);
  }
}

function setServerOffline(dot, text, mlChip, dlChip) {
  dot.className = 'status-pulse offline';
  text.innerText = 'OFFLINE';
  mlChip.className = 'status-chip';
  mlChip.innerText = 'ML Engine: Off';
  dlChip.className = 'status-chip';
  dlChip.innerText = 'DL Engine: Off';
}

// Switch between form tabs
function switchFormTab(tabName, clickedBtn) {
  // Reset tabs navigation buttons
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
  clickedBtn.classList.add('active');

  // Switch tab panes visibility
  document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
  document.getElementById(`pane-${tabName}`).classList.add('active');
}

// Switch prediction model engine (ML vs DL)
function selectEngine(engineType) {
  activeEngine = engineType;
  const mlBtn = document.getElementById('engine-ml');
  const dlBtn = document.getElementById('engine-dl');

  mlBtn.classList.remove('active');
  dlBtn.classList.remove('active', 'dl-active');

  if (engineType === 'ML') {
    mlBtn.classList.add('active');
  } else {
    dlBtn.classList.add('active', 'dl-active');
  }
}

// Load presets
function loadPreset(presetName) {
  let values = {};
  if (presetName === 'random') {
    values = generateRandomScenario();
  } else {
    values = SCENARIO_PRESETS[presetName];
  }

  if (!values) return;

  // Fill in form values with highlight flash effect
  for (const [inputId, value] of Object.entries(values)) {
    const el = document.getElementById(inputId);
    if (el) {
      el.value = value;
      el.classList.remove('flash-input-fill');
      void el.offsetWidth; // Force CSS reflow
      el.classList.add('flash-input-fill');
    }
  }

  showToast(presetName === 'random' ? 'Random parameters injected' : `Scenario Preset: ${presetName.toUpperCase()} loaded`);
}

// Helper to generate completely randomized inputs
function generateRandomScenario() {
  const selectRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const selectRandomRange = (min, max, step = 1) => {
    const val = Math.random() * (max - min) + min;
    return Number((Math.round(val / step) * step).toFixed(2));
  };

  return {
    f_year: selectRandomRange(2016, 2026, 1),
    f_month: selectRandomRange(1, 12, 1),
    f_quarter: selectRandom(LABEL_ENCODER_MAP.quarter),
    f_country: selectRandom(LABEL_ENCODER_MAP.country),
    f_region: selectRandom(LABEL_ENCODER_MAP.region),
    f_climate_zone: selectRandom(LABEL_ENCODER_MAP.climate_zone),
    f_water_stress_level: selectRandom(LABEL_ENCODER_MAP.water_stress_level),
    f_organization: selectRandom(LABEL_ENCODER_MAP.organization),
    f_collaboration_type: selectRandom(LABEL_ENCODER_MAP.collaboration_type),
    f_language: selectRandom(LABEL_ENCODER_MAP.language),
    f_open_access: selectRandom(LABEL_ENCODER_MAP.open_access),
    f_sector: selectRandom(LABEL_ENCODER_MAP.sector),
    f_ai_technique: selectRandom(LABEL_ENCODER_MAP.ai_technique),
    f_water_application: selectRandom(LABEL_ENCODER_MAP.water_application),
    f_energy_application: selectRandom(LABEL_ENCODER_MAP.energy_application),
    f_nexus_focus: selectRandom(LABEL_ENCODER_MAP.nexus_focus),
    f_deployment_scale: selectRandom(LABEL_ENCODER_MAP.deployment_scale),
    f_status: selectRandom(LABEL_ENCODER_MAP.status),
    f_sdg_alignment: selectRandom(LABEL_ENCODER_MAP.sdg_alignment),
    f_funding_usd: selectRandomRange(20000, 8000000, 10000),
    f_investment_roi: selectRandomRange(0.5, 6.0, 0.1),
    f_population_served: selectRandomRange(1000, 25000000, 5000),
    f_citation_count: selectRandomRange(0, 300, 1),
    f_impact_score: selectRandomRange(10, 100, 0.5),
    f_innovation_index: selectRandomRange(1, 10, 0.1),
    f_model_performance_metric: selectRandom(LABEL_ENCODER_MAP.model_performance_metric),
    f_model_performance_value: selectRandomRange(0.5, 0.99, 0.01),
    f_co2_reduction_tons: selectRandomRange(50, 80000, 50),
    f_water_savings_liters: selectRandomRange(10000, 1000000000, 10000),
    f_energy_savings_kwh: selectRandomRange(500, 5000000, 100),
    f_renewable_energy_share_pct: selectRandomRange(5, 100, 0.5),
    f_venue_h_index: selectRandomRange(0, 120, 1),
    f_patent_class: selectRandom(LABEL_ENCODER_MAP.patent_class),
    f_patent_family_size: selectRandomRange(0, 15, 1),
    f_policy_type: selectRandom(LABEL_ENCODER_MAP.policy_type),
    f_policy_level: selectRandom(LABEL_ENCODER_MAP.policy_level),
    f_policy_stringency_score: selectRandomRange(0, 5.0, 0.1)
  };
}

// Show Toast Message
function showToast(message) {
  const toast = document.getElementById('toast');
  document.getElementById('toast-text').innerText = message;
  toast.classList.add('active');
  setTimeout(() => toast.classList.remove('active'), 2500);
}

// Extract features form inputs into sequential training array
function extractFeatures() {
  const encodeVal = (mapKey, inputId) => {
    const val = document.getElementById(inputId).value;
    const idx = LABEL_ENCODER_MAP[mapKey] ? LABEL_ENCODER_MAP[mapKey].indexOf(val) : -1;
    return idx === -1 ? 0 : idx;
  };

  const getFloatVal = (inputId, defaultVal = 0) => {
    return parseFloat(document.getElementById(inputId).value) || defaultVal;
  };

  return [
    getFloatVal('f_year', 2022),
    getFloatVal('f_month', 6),
    encodeVal('quarter', 'f_quarter'),
    encodeVal('country', 'f_country'),
    encodeVal('region', 'f_region'),
    encodeVal('climate_zone', 'f_climate_zone'),
    encodeVal('water_stress_level', 'f_water_stress_level'),
    encodeVal('organization', 'f_organization'),
    encodeVal('collaboration_type', 'f_collaboration_type'),
    encodeVal('sector', 'f_sector'),
    encodeVal('ai_technique', 'f_ai_technique'),
    encodeVal('water_application', 'f_water_application'),
    encodeVal('energy_application', 'f_energy_application'),
    encodeVal('nexus_focus', 'f_nexus_focus'),
    encodeVal('deployment_scale', 'f_deployment_scale'),
    encodeVal('status', 'f_status'),
    encodeVal('sdg_alignment', 'f_sdg_alignment'),
    getFloatVal('f_funding_usd', 150000),
    getFloatVal('f_investment_roi', 2.5),
    getFloatVal('f_population_served', 50000),
    getFloatVal('f_citation_count', 15),
    getFloatVal('f_impact_score', 55),
    getFloatVal('f_innovation_index', 5),
    encodeVal('model_performance_metric', 'f_model_performance_metric'),
    getFloatVal('f_model_performance_value', 0.85),
    getFloatVal('f_co2_reduction_tons', 500),
    getFloatVal('f_water_savings_liters', 50000),
    getFloatVal('f_energy_savings_kwh', 2000),
    getFloatVal('f_renewable_energy_share_pct', 45),
    encodeVal('open_access', 'f_open_access'),
    getFloatVal('f_venue_h_index', 50),
    encodeVal('patent_class', 'f_patent_class'),
    getFloatVal('f_patent_family_size', 3),
    encodeVal('policy_type', 'f_policy_type'),
    encodeVal('policy_level', 'f_policy_level'),
    getFloatVal('f_policy_stringency_score', 3),
    encodeVal('language', 'f_language')
  ];
}

// Toggle Dashboard Output states
function showOutputState(state) {
  document.getElementById('state-placeholder').classList.add('hidden');
  document.getElementById('state-loading').classList.add('hidden');
  document.getElementById('state-error').classList.add('hidden');
  document.getElementById('state-result').classList.add('hidden');

  if (state === 'placeholder') {
    document.getElementById('state-placeholder').classList.remove('hidden');
  } else if (state === 'loading') {
    document.getElementById('state-loading').classList.remove('hidden');
  } else if (state === 'error') {
    document.getElementById('state-error').classList.remove('hidden');
  } else if (state === 'result') {
    document.getElementById('state-result').classList.remove('hidden');
  }
}

// Execute prediction API call
async function runPrediction() {
  const btn = document.getElementById('btn-predict');
  btn.disabled = true;
  btn.innerHTML = `<i class="icon-spin-hover" data-lucide="loader" style="animation: spinClockwise 1.5s linear infinite"></i> <span>ANALYZING SCENARIO...</span>`;
  lucide.createIcons();

  const features = extractFeatures();
  const endpoint = activeEngine === 'ML' ? '/predict/ml' : '/predict/dl';
  
  // Set intermediate load labels
  document.getElementById('loading-header').innerText = `Analyzing via ${activeEngine === 'ML' ? 'Machine Learning' : 'Deep Learning'} core...`;
  document.getElementById('loading-desc').innerText = `Scaling vector elements and loading ${activeEngine === 'ML' ? 'best_ml_model.pkl' : 'best_dl_model.h5'} weights...`;
  showOutputState('loading');

  try {
    const startTime = performance.now();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ features })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const latencyMs = Math.round(performance.now() - startTime);

    if (data.error) {
      throw new Error(data.error);
    }

    displayPredictionResult(data, latencyMs);
  } catch (error) {
    document.getElementById('err-message').innerText = error.message || "Failed to make prediction. Core connection timed out.";
    showOutputState('error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<i data-lucide="cpu" class="icon-spin-hover"></i> <span>EXECUTE AI MODEL ANALYSIS</span>`;
    lucide.createIcons();
  }
}

// Render result details on success
function displayPredictionResult(data, latencyMs) {
  latestPredictionReport = {
    engine: activeEngine,
    timestamp: new Date().toISOString(),
    latency_ms: latencyMs,
    prediction: data
  };

  // Set header details
  const badge = document.getElementById('res-badge');
  badge.innerText = `${activeEngine} ENGINE`;
  if (activeEngine === 'ML') {
    badge.className = 'engine-badge';
  } else {
    badge.className = 'engine-badge badge-dl';
  }

  // Set predicted winner text
  document.getElementById('res-label').innerText = data.label;
  
  // Set secondary stats
  const modelNameMap = {
    'ML': 'Gradient Boosting (best_ml_model.pkl)',
    'DL': 'LSTM Recurrent Net (best_dl_model.h5)'
  };
  document.getElementById('res-inference-core').innerText = modelNameMap[activeEngine] || 'AI Core';
  document.getElementById('res-idx').innerText = data.prediction;
  document.getElementById('res-latency').innerText = `${latencyMs} ms`;

  // Draw confidence gauge ring. Circumference = 2 * PI * r = 2 * 3.14159 * 40 = 251.2
  let probs = data.probability;
  if (probs && Array.isArray(probs[0])) {
    probs = probs[0];
  }
  
  const maxProbability = Math.max(...probs);
  const percentageStr = `${(maxProbability * 100).toFixed(1)}%`;
  document.getElementById('res-conf').innerText = percentageStr;

  const ringOffset = 251.2 * (1 - maxProbability);
  const ring = document.getElementById('result-gauge-ring');
  ring.style.strokeDashoffset = ringOffset;

  // Set color accent of ring based on winning prediction
  const categoryColors = {
    'Patent': 'var(--accent-violet)',
    'Policy': 'var(--accent-magenta)',
    'Project': 'var(--accent-cyan)',
    'Publication': '#00b4d8'
  };
  ring.style.stroke = categoryColors[data.label] || 'var(--accent-cyan)';

  // Build horizontal probability distribution mapping
  const barsRoot = document.getElementById('prob-bars-root');
  const barColors = ['var(--accent-violet)', 'var(--accent-magenta)', 'var(--accent-cyan)', '#00b4d8'];

  barsRoot.innerHTML = CLASS_LABELS.map((className, index) => {
    const probabilityValue = probs[index] || 0;
    const pct = (probabilityValue * 100).toFixed(1);
    const isWinner = index === data.prediction;

    return `
      <div class="bar-row ${isWinner ? 'is-winner' : ''}">
        <div class="bar-meta">
          <span class="bar-name">${className}</span>
          <span class="bar-percent">${pct}%</span>
        </div>
        <div class="bar-track">
          <div class="bar-fill-indicator" style="width: ${pct}%; background: ${barColors[index]}; box-shadow: ${isWinner ? '0 0 10px ' + barColors[index] : 'none'};"></div>
        </div>
      </div>
    `;
  }).join('');

  showOutputState('result');
}

// Reset Simulator State
function resetSimulator() {
  showOutputState('placeholder');
  latestPredictionReport = null;
  showToast("Simulator memory flushed");
}

// Download local simulation details report
function downloadSimulationJSON() {
  if (!latestPredictionReport) return;

  const fullReport = {
    input_vector: extractFeatures(),
    ...latestPredictionReport
  };

  const reportBlob = new Blob([JSON.stringify(fullReport, null, 2)], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(reportBlob);

  const dlAnchor = document.createElement('a');
  dlAnchor.href = downloadUrl;
  dlAnchor.download = `nexus_inference_report_${Date.now()}.json`;
  document.body.appendChild(dlAnchor);
  dlAnchor.click();
  
  document.body.removeChild(dlAnchor);
  URL.revokeObjectURL(downloadUrl);
}
