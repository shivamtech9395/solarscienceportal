export interface SolarStageTemplate {
  stageNumber: number;
  title: string;
  description: string;
  requiredRole: string;
  defaultChecklist: string[];
}

export const SOLAR_INSTALLATION_STAGES: SolarStageTemplate[] = [
  {
    stageNumber: 1,
    title: "Site Survey & Rooftop Feasibility",
    description: "Physical inspection of rooftop area, shadow analysis, azimuth/tilt evaluation, and existing electrical load/meter audit.",
    requiredRole: "Site Surveyor",
    defaultChecklist: [
      "Rooftop dimensions and usable area measured",
      "Shadow obstacles (water tanks, parapets, nearby trees) documented",
      "Sanctioned load & electricity bill verified",
      "Site 360-degree photos uploaded"
    ]
  },
  {
    stageNumber: 2,
    title: "System Design & 3D Engineering",
    description: "Preparation of 3D shadow modeling layout, string calculation, Single Line Diagram (SLD), and customer blueprint sign-off.",
    requiredRole: "Solar Design Engineer",
    defaultChecklist: [
      "Shadow-free module layout planned",
      "Single Line Diagram (SLD) generated",
      "Bill of Materials (BOM) finalized",
      "Customer design approval obtained"
    ]
  },
  {
    stageNumber: 3,
    title: "DISCOM / Net-Metering Application",
    description: "Application submission to state electricity board (DISCOM) or PM Surya Ghar portal for grid feasibility & subsidy authorization.",
    requiredRole: "Liaisoning Officer",
    defaultChecklist: [
      "Solar application submitted on DISCOM portal",
      "Required KYC & electricity bill documents submitted",
      "Grid feasibility approval obtained from subdivision engineer",
      "Subsidy registration token generated"
    ]
  },
  {
    stageNumber: 4,
    title: "Material Procurement & Delivery",
    description: "Dispatch of Tier-1 solar modules, string inverter, galvanized mounting structure, DC cables, and ACDB/DCDB protection boxes to site.",
    requiredRole: "Warehouse Manager",
    defaultChecklist: [
      "Solar modules batch barcode verified",
      "Inverter serial number verified against warranty",
      "Mounting structure & hardware kits dispatched",
      "Customer signature received on delivery challan"
    ]
  },
  {
    stageNumber: 5,
    title: "Mechanical Structure Assembly",
    description: "Civil anchoring, chemical chemical fasteners / base plates, hot-dip galvanized structure erection, and panel clamping.",
    requiredRole: "Structure Technician",
    defaultChecklist: [
      "Anchor bolts fastened with waterproofing sealant",
      "Structure tilt angle adjusted (optimal seasonal degree)",
      "Solar modules clamped securely (mid & end clamps)",
      "Wind-load structural stability verified"
    ]
  },
  {
    stageNumber: 6,
    title: "Electrical Cabling & Inverter Setup",
    description: "DC string wiring in conduits, AC/DC distribution boxes, inverter wall mounting, lightning arrestor (LA), and 3 earthing pits installation.",
    requiredRole: "Solar Electrician",
    defaultChecklist: [
      "UV-resistant solar DC cables routed in HDPE conduits",
      "Inverter mounted in shaded, ventilated area",
      "Dedicated earthing pits installed (Inverter, DC, LA)",
      "Earthing resistance measured below 5 Ohms"
    ]
  },
  {
    stageNumber: 7,
    title: "DISCOM Inspection & Net-Meter Install",
    description: "Joint inspection with electricity board officer, verification of anti-islanding safety features, and installation of bidirectional net meter.",
    requiredRole: "Liaisoning Officer",
    defaultChecklist: [
      "DISCOM inspector site visit conducted",
      "Anti-islanding test demonstrated",
      "Bi-directional net-meter installed & sealed",
      "Old conventional meter decommissioned"
    ]
  },
  {
    stageNumber: 8,
    title: "Commissioning, App Setup & Handover",
    description: "Grid synchronization, live solar generation verification, customer mobile app Wi-Fi monitoring configuration, and warranty handover.",
    requiredRole: "Commissioning Engineer",
    defaultChecklist: [
      "Inverter synchronized with grid successfully",
      "Real-time solar generation (kWh) verified",
      "Mobile monitoring app configured on customer phone",
      "Warranty certificates & handover docket delivered"
    ]
  }
];

export const EMPLOYEE_ROLES = [
  "Site Surveyor",
  "Solar Design Engineer",
  "Liaisoning Officer",
  "Warehouse Manager",
  "Structure Technician",
  "Solar Electrician",
  "Commissioning Engineer",
  "Operations Admin"
];
