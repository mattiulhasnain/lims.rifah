import React, { useState } from 'react';
import {
  Search, TestTube, AlertTriangle,
  TrendingUp, TrendingDown, Bookmark,
  ChevronRight, ChevronDown
} from 'lucide-react';

interface DiagnosticTest {
  id: string;
  testName: string;
  category: 'hematology' | 'biochemistry' | 'immunology' | 'microbiology' | 'molecular' | 'urinalysis' | 'coagulation' | 'hormones' | 'tumor-markers' | 'cardiac';
  subcategory: string;
  specimen: string;
  normalRange: {
    male?: string;
    female?: string;
    children?: string;
    elderly?: string;
    units: string;
  };
  criticalValues: {
    low?: string;
    high?: string;
  };
  clinicalSignificance: string;
  interpretation: string;
  causes: {
    increased: string[];
    decreased: string[];
  };
  relatedTests: string[];
  preparation: string;
  methodology: string;
  turnaroundTime: string;
  isBookmarked?: boolean;
  isPopular?: boolean;
}

const DiagnosticKnowledgeHub: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [bookmarkedItems, setBookmarkedItems] = useState<Set<string>>(new Set());
  const [showBookmarksOnly, setShowBookmarksOnly] = useState(false);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);

  const diagnosticTests: DiagnosticTest[] = [
    // Hematology Tests
    {
      id: 'cbc',
      testName: 'Complete Blood Count (CBC)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '4.5-5.5 x 10^12/L',
        female: '4.0-5.0 x 10^12/L',
        children: '4.0-5.5 x 10^12/L',
        units: 'x 10^12/L'
      },
      criticalValues: {
        low: '< 2.0 x 10^12/L',
        high: '> 7.0 x 10^12/L'
      },
      clinicalSignificance: 'Measures red blood cell count, white blood cell count, hemoglobin, hematocrit, and platelet count. Essential for diagnosing anemia, infection, and blood disorders.',
      interpretation: 'Low RBC count indicates anemia. High RBC count may indicate polycythemia. WBC changes indicate infection or inflammation. Platelet changes affect clotting.',
      causes: {
        increased: ['Polycythemia vera', 'Dehydration', 'High altitude', 'Smoking', 'Lung disease'],
        decreased: ['Iron deficiency anemia', 'Vitamin B12 deficiency', 'Blood loss', 'Bone marrow disorders', 'Chronic disease']
      },
      relatedTests: ['Hemoglobin', 'Hematocrit', 'Reticulocyte Count', 'Iron Studies', 'Vitamin B12'],
      preparation: 'Fasting not required. Avoid strenuous exercise 24 hours before.',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day',
      isPopular: true
    },

    {
      id: 'hemoglobin',
      testName: 'Hemoglobin (Hb)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '13.5-17.5 g/dL',
        female: '12.0-15.5 g/dL',
        children: '11.0-16.0 g/dL',
        units: 'g/dL'
      },
      criticalValues: {
        low: '< 7.0 g/dL',
        high: '> 20.0 g/dL'
      },
      clinicalSignificance: 'Measures oxygen-carrying capacity of blood. Primary indicator of anemia and polycythemia.',
      interpretation: 'Low levels indicate anemia. High levels may indicate polycythemia or dehydration.',
      causes: {
        increased: ['Polycythemia vera', 'Dehydration', 'High altitude', 'Smoking', 'Lung disease'],
        decreased: ['Iron deficiency', 'Blood loss', 'Hemolysis', 'Bone marrow failure', 'Chronic disease']
      },
      relatedTests: ['CBC', 'Hematocrit', 'Iron Studies', 'Reticulocyte Count'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'wbc',
      testName: 'White Blood Cell Count (WBC)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '4.5-11.0 x 10^9/L',
        female: '4.5-11.0 x 10^9/L',
        children: '5.0-15.0 x 10^9/L',
        units: 'x 10^9/L'
      },
      criticalValues: {
        low: '< 1.0 x 10^9/L',
        high: '> 30.0 x 10^9/L'
      },
      clinicalSignificance: 'Measures immune system cells. Essential for detecting infection, inflammation, and blood disorders.',
      interpretation: 'High levels indicate infection or inflammation. Low levels indicate immune suppression or bone marrow disorders.',
      causes: {
        increased: ['Bacterial infection', 'Viral infection', 'Inflammation', 'Leukemia', 'Stress'],
        decreased: ['Viral infection', 'Bone marrow suppression', 'Chemotherapy', 'Autoimmune disease', 'Severe infection']
      },
      relatedTests: ['CBC', 'Differential Count', 'CRP', 'ESR'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    // Biochemistry Tests
    {
      id: 'glucose',
      testName: 'Fasting Blood Glucose',
      category: 'biochemistry',
      subcategory: 'metabolic',
      specimen: 'Serum/Plasma',
      normalRange: {
        male: '70-100 mg/dL',
        female: '70-100 mg/dL',
        children: '70-100 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 40 mg/dL',
        high: '> 400 mg/dL'
      },
      clinicalSignificance: 'Primary test for diabetes diagnosis and monitoring. Essential for metabolic health assessment.',
      interpretation: 'High levels indicate diabetes or prediabetes. Low levels indicate hypoglycemia.',
      causes: {
        increased: ['Diabetes mellitus', 'Stress', 'Cushing syndrome', 'Pancreatitis', 'Medications'],
        decreased: ['Insulin overdose', 'Liver disease', 'Adrenal insufficiency', 'Fasting', 'Alcohol']
      },
      relatedTests: ['HbA1c', 'Insulin', 'C-Peptide', 'Oral Glucose Tolerance Test'],
      preparation: '8-12 hours fasting required',
      methodology: 'Enzymatic colorimetric',
      turnaroundTime: 'Same day',
      isPopular: true
    },

    {
      id: 'creatinine',
      testName: 'Serum Creatinine',
      category: 'biochemistry',
      subcategory: 'renal',
      specimen: 'Serum',
      normalRange: {
        male: '0.7-1.3 mg/dL',
        female: '0.6-1.1 mg/dL',
        children: '0.3-0.7 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 0.3 mg/dL',
        high: '> 5.0 mg/dL'
      },
      clinicalSignificance: 'Primary marker of kidney function. Essential for renal disease diagnosis and monitoring.',
      interpretation: 'High levels indicate kidney dysfunction. Low levels may indicate muscle wasting.',
      causes: {
        increased: ['Acute kidney injury', 'Chronic kidney disease', 'Dehydration', 'Heart failure', 'Medications'],
        decreased: ['Muscle wasting', 'Liver disease', 'Pregnancy', 'Malnutrition']
      },
      relatedTests: ['BUN', 'eGFR', 'Urinalysis', 'Cystatin C'],
      preparation: 'Fasting not required',
      methodology: 'Jaffe reaction/Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'alt',
      testName: 'Alanine Aminotransferase (ALT)',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '7-55 U/L',
        female: '7-45 U/L',
        children: '7-40 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 5 U/L',
        high: '> 1000 U/L'
      },
      clinicalSignificance: 'Liver enzyme indicating hepatocellular damage. Primary marker for liver disease.',
      interpretation: 'High levels indicate liver damage. Very high levels suggest acute hepatitis.',
      causes: {
        increased: ['Viral hepatitis', 'Alcoholic liver disease', 'NAFLD', 'Drug toxicity', 'Autoimmune hepatitis'],
        decreased: ['Normal variation', 'Severe liver failure']
      },
      relatedTests: ['AST', 'ALP', 'GGT', 'Bilirubin', 'Albumin'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    // Cardiac Markers
    {
      id: 'troponin',
      testName: 'Troponin I',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '< 0.04 ng/mL',
        female: '< 0.04 ng/mL',
        children: '< 0.04 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 0.04 ng/mL'
      },
      clinicalSignificance: 'Gold standard for myocardial infarction diagnosis. Highly specific for heart muscle damage.',
      interpretation: 'Elevated levels indicate myocardial injury. Serial measurements help determine MI extent.',
      causes: {
        increased: ['Myocardial infarction', 'Heart failure', 'Myocarditis', 'Cardiac surgery', 'Renal failure'],
        decreased: ['Normal']
      },
      relatedTests: ['Troponin T', 'CK-MB', 'BNP', 'ECG', 'Echocardiogram'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1 hour (STAT)',
      isPopular: true
    },

    // Hormones
    {
      id: 'tsh',
      testName: 'Thyroid Stimulating Hormone (TSH)',
      category: 'hormones',
      subcategory: 'thyroid',
      specimen: 'Serum',
      normalRange: {
        male: '0.4-4.0 mIU/L',
        female: '0.4-4.0 mIU/L',
        children: '0.7-6.0 mIU/L',
        units: 'mIU/L'
      },
      criticalValues: {
        low: '< 0.01 mIU/L',
        high: '> 20.0 mIU/L'
      },
      clinicalSignificance: 'Primary screening test for thyroid function. Essential for thyroid disorder diagnosis.',
      interpretation: 'High levels indicate hypothyroidism. Low levels indicate hyperthyroidism.',
      causes: {
        increased: ['Primary hypothyroidism', 'Thyroiditis', 'Iodine deficiency', 'Medications'],
        decreased: ['Primary hyperthyroidism', 'Secondary hypothyroidism', 'Pituitary disease']
      },
      relatedTests: ['Free T4', 'Free T3', 'Thyroid Antibodies', 'Thyroid Ultrasound'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Tumor Markers
    {
      id: 'psa',
      testName: 'Prostate Specific Antigen (PSA)',
      category: 'tumor-markers',
      subcategory: 'prostate',
      specimen: 'Serum',
      normalRange: {
        male: '< 4.0 ng/mL',
        female: 'Not applicable',
        children: 'Not applicable',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 ng/mL'
      },
      clinicalSignificance: 'Screening test for prostate cancer. Also elevated in benign prostatic hyperplasia.',
      interpretation: 'Elevated levels may indicate prostate cancer or BPH. Age-specific reference ranges apply.',
      causes: {
        increased: ['Prostate cancer', 'Benign prostatic hyperplasia', 'Prostatitis', 'Prostate biopsy', 'Age'],
        decreased: ['Normal', 'Prostate removal']
      },
      relatedTests: ['Free PSA', 'PSA Ratio', 'Digital Rectal Exam', 'Prostate Biopsy'],
      preparation: 'Avoid ejaculation 48 hours before',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Coagulation
    {
      id: 'pt',
      testName: 'Prothrombin Time (PT)',
      category: 'coagulation',
      subcategory: 'coagulation-tests',
      specimen: 'Citrated Plasma',
      normalRange: {
        male: '11-13 seconds',
        female: '11-13 seconds',
        children: '11-13 seconds',
        units: 'seconds'
      },
      criticalValues: {
        low: '< 8 seconds',
        high: '> 20 seconds'
      },
      clinicalSignificance: 'Measures extrinsic coagulation pathway. Essential for warfarin monitoring.',
      interpretation: 'Prolonged PT indicates coagulation disorder or anticoagulant effect.',
      causes: {
        increased: ['Warfarin therapy', 'Liver disease', 'Vitamin K deficiency', 'DIC', 'Factor deficiencies'],
        decreased: ['Hypercoagulable state', 'Estrogen therapy']
      },
      relatedTests: ['INR', 'aPTT', 'Fibrinogen', 'D-Dimer'],
      preparation: 'Fasting not required',
      methodology: 'Clot-based assay',
      turnaroundTime: 'Same day'
    },

    // Additional Hematology Tests
    {
      id: 'platelets',
      testName: 'Platelet Count',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '150,000-450,000 /μL',
        female: '150,000-450,000 /μL',
        children: '150,000-450,000 /μL',
        units: '/μL'
      },
      criticalValues: {
        low: '< 20,000 /μL',
        high: '> 1,000,000 /μL'
      },
      clinicalSignificance: 'Measures blood clotting cells. Essential for hemostasis and bleeding risk assessment.',
      interpretation: 'Low levels increase bleeding risk. High levels may cause thrombosis.',
      causes: {
        increased: ['Essential thrombocythemia', 'Inflammation', 'Iron deficiency', 'Splenectomy', 'Infection'],
        decreased: ['ITP', 'Bone marrow disorders', 'Chemotherapy', 'DIC', 'Viral infection']
      },
      relatedTests: ['CBC', 'PT', 'aPTT', 'Bleeding Time'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hematocrit',
      testName: 'Hematocrit (Hct)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '41-50%',
        female: '36-46%',
        children: '32-44%',
        units: '%'
      },
      criticalValues: {
        low: '< 15%',
        high: '> 60%'
      },
      clinicalSignificance: 'Measures percentage of blood volume occupied by red blood cells.',
      interpretation: 'Low levels indicate anemia. High levels may indicate polycythemia or dehydration.',
      causes: {
        increased: ['Polycythemia vera', 'Dehydration', 'High altitude', 'Smoking', 'Lung disease'],
        decreased: ['Iron deficiency anemia', 'Blood loss', 'Bone marrow disorders', 'Chronic disease']
      },
      relatedTests: ['CBC', 'Hemoglobin', 'RBC Count', 'Iron Studies'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mcv',
      testName: 'Mean Corpuscular Volume (MCV)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '80-100 fL',
        female: '80-100 fL',
        children: '80-100 fL',
        units: 'fL'
      },
      criticalValues: {
        low: '< 60 fL',
        high: '> 120 fL'
      },
      clinicalSignificance: 'Measures average size of red blood cells. Essential for anemia classification.',
      interpretation: 'Low MCV indicates microcytic anemia. High MCV indicates macrocytic anemia.',
      causes: {
        increased: ['Vitamin B12 deficiency', 'Folate deficiency', 'Alcoholism', 'Liver disease', 'Hypothyroidism'],
        decreased: ['Iron deficiency', 'Thalassemia', 'Lead poisoning', 'Chronic disease']
      },
      relatedTests: ['CBC', 'Iron Studies', 'Vitamin B12', 'Folate'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    // Additional Biochemistry Tests
    {
      id: 'ast',
      testName: 'Aspartate Aminotransferase (AST)',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '8-48 U/L',
        female: '8-43 U/L',
        children: '8-40 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 5 U/L',
        high: '> 1000 U/L'
      },
      clinicalSignificance: 'Liver enzyme indicating hepatocellular damage. Also elevated in cardiac and muscle injury.',
      interpretation: 'High levels indicate liver damage or muscle injury. AST/ALT ratio helps determine cause.',
      causes: {
        increased: ['Viral hepatitis', 'Alcoholic liver disease', 'Myocardial infarction', 'Muscle injury', 'Drug toxicity'],
        decreased: ['Normal variation', 'Severe liver failure']
      },
      relatedTests: ['ALT', 'ALP', 'GGT', 'Bilirubin', 'CK'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'bun',
      testName: 'Blood Urea Nitrogen (BUN)',
      category: 'biochemistry',
      subcategory: 'renal',
      specimen: 'Serum',
      normalRange: {
        male: '7-20 mg/dL',
        female: '7-20 mg/dL',
        children: '5-18 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 3 mg/dL',
        high: '> 100 mg/dL'
      },
      clinicalSignificance: 'Measures kidney function and protein metabolism. Part of renal function assessment.',
      interpretation: 'High levels indicate kidney dysfunction or dehydration. Low levels may indicate liver disease.',
      causes: {
        increased: ['Acute kidney injury', 'Chronic kidney disease', 'Dehydration', 'High protein diet', 'Gastrointestinal bleeding'],
        decreased: ['Liver disease', 'Malnutrition', 'Overhydration', 'Pregnancy']
      },
      relatedTests: ['Creatinine', 'eGFR', 'BUN/Creatinine Ratio', 'Urinalysis'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'sodium',
      testName: 'Sodium (Na+)',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '135-145 mEq/L',
        female: '135-145 mEq/L',
        children: '135-145 mEq/L',
        units: 'mEq/L'
      },
      criticalValues: {
        low: '< 120 mEq/L',
        high: '> 160 mEq/L'
      },
      clinicalSignificance: 'Primary extracellular cation. Essential for fluid balance and nerve function.',
      interpretation: 'Low levels (hyponatremia) can cause confusion. High levels (hypernatremia) indicate dehydration.',
      causes: {
        increased: ['Dehydration', 'Diabetes insipidus', 'Excessive salt intake', 'Cushing syndrome'],
        decreased: ['SIADH', 'Heart failure', 'Liver cirrhosis', 'Diuretics', 'Vomiting']
      },
      relatedTests: ['Potassium', 'Chloride', 'Bicarbonate', 'Osmolality'],
      preparation: 'Fasting not required',
      methodology: 'Ion-selective electrode',
      turnaroundTime: 'Same day'
    },

    {
      id: 'potassium',
      testName: 'Potassium (K+)',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '3.5-5.0 mEq/L',
        female: '3.5-5.0 mEq/L',
        children: '3.5-5.0 mEq/L',
        units: 'mEq/L'
      },
      criticalValues: {
        low: '< 2.5 mEq/L',
        high: '> 6.5 mEq/L'
      },
      clinicalSignificance: 'Essential electrolyte for cardiac and muscle function. Critical for heart rhythm.',
      interpretation: 'High levels can cause cardiac arrhythmias. Low levels cause muscle weakness.',
      causes: {
        increased: ['Kidney failure', 'ACE inhibitors', 'Spironolactone', 'Rhabdomyolysis', 'Acidosis'],
        decreased: ['Diuretics', 'Vomiting', 'Diarrhea', 'Alkalosis', 'Insulin']
      },
      relatedTests: ['Sodium', 'Chloride', 'Bicarbonate', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'Ion-selective electrode',
      turnaroundTime: 'Same day'
    },

    // Additional Cardiac Markers
    {
      id: 'ck-mb',
      testName: 'Creatine Kinase-MB (CK-MB)',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '< 5.0 ng/mL',
        female: '< 5.0 ng/mL',
        children: '< 5.0 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 5.0 ng/mL'
      },
      clinicalSignificance: 'Cardiac-specific enzyme for myocardial infarction diagnosis. More specific than total CK.',
      interpretation: 'Elevated levels indicate myocardial injury. Serial measurements show infarction pattern.',
      causes: {
        increased: ['Myocardial infarction', 'Cardiac surgery', 'Cardiomyopathy', 'Severe exercise'],
        decreased: ['Normal']
      },
      relatedTests: ['Troponin I', 'Troponin T', 'Total CK', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1 hour (STAT)'
    },

    {
      id: 'bnp',
      testName: 'B-Type Natriuretic Peptide (BNP)',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '< 100 pg/mL',
        female: '< 100 pg/mL',
        children: '< 100 pg/mL',
        units: 'pg/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 400 pg/mL'
      },
      clinicalSignificance: 'Hormone released by heart in response to increased pressure. Marker for heart failure.',
      interpretation: 'High levels indicate heart failure. Levels correlate with severity and prognosis.',
      causes: {
        increased: ['Heart failure', 'Pulmonary hypertension', 'Kidney failure', 'Age', 'Obesity'],
        decreased: ['Normal cardiac function', 'Young age']
      },
      relatedTests: ['NT-proBNP', 'Echocardiogram', 'Chest X-ray', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Hormone Tests
    {
      id: 'free-t4',
      testName: 'Free Thyroxine (Free T4)',
      category: 'hormones',
      subcategory: 'thyroid',
      specimen: 'Serum',
      normalRange: {
        male: '0.8-1.8 ng/dL',
        female: '0.8-1.8 ng/dL',
        children: '0.8-1.8 ng/dL',
        units: 'ng/dL'
      },
      criticalValues: {
        low: '< 0.3 ng/dL',
        high: '> 4.0 ng/dL'
      },
      clinicalSignificance: 'Active thyroid hormone. More accurate than total T4 for thyroid function assessment.',
      interpretation: 'High levels indicate hyperthyroidism. Low levels indicate hypothyroidism.',
      causes: {
        increased: ['Hyperthyroidism', 'Thyroiditis', 'Excessive thyroid medication', 'Pregnancy'],
        decreased: ['Hypothyroidism', 'Iodine deficiency', 'Thyroid surgery', 'Radiation therapy']
      },
      relatedTests: ['TSH', 'Free T3', 'Total T4', 'Thyroid Antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cortisol',
      testName: 'Cortisol',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Serum',
      normalRange: {
        male: '6.2-19.4 μg/dL (AM), 2.3-11.9 μg/dL (PM)',
        female: '6.2-19.4 μg/dL (AM), 2.3-11.9 μg/dL (PM)',
        children: '6.2-19.4 μg/dL (AM), 2.3-11.9 μg/dL (PM)',
        units: 'μg/dL'
      },
      criticalValues: {
        low: '< 3 μg/dL',
        high: '> 25 μg/dL'
      },
      clinicalSignificance: 'Primary stress hormone. Essential for metabolism and immune function.',
      interpretation: 'High levels indicate Cushing syndrome. Low levels indicate adrenal insufficiency.',
      causes: {
        increased: ['Cushing syndrome', 'Stress', 'Obesity', 'Depression', 'Pregnancy'],
        decreased: ['Addison disease', 'Pituitary insufficiency', 'Adrenal insufficiency', 'Steroid withdrawal']
      },
      relatedTests: ['ACTH', 'DHEA-S', 'Aldosterone', '24h Urine Cortisol'],
      preparation: 'Fasting required. Morning sample preferred.',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Tumor Markers
    {
      id: 'cea',
      testName: 'Carcinoembryonic Antigen (CEA)',
      category: 'tumor-markers',
      subcategory: 'colorectal',
      specimen: 'Serum',
      normalRange: {
        male: '< 3.0 ng/mL',
        female: '< 3.0 ng/mL',
        children: '< 3.0 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for colorectal cancer. Used for monitoring treatment response.',
      interpretation: 'Elevated levels may indicate colorectal cancer. Also elevated in other cancers and smoking.',
      causes: {
        increased: ['Colorectal cancer', 'Lung cancer', 'Breast cancer', 'Smoking', 'Inflammatory bowel disease'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CA 19-9', 'Colonoscopy', 'CT Scan', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ca-125',
      testName: 'Cancer Antigen 125 (CA-125)',
      category: 'tumor-markers',
      subcategory: 'ovarian',
      specimen: 'Serum',
      normalRange: {
        male: '< 35 U/mL',
        female: '< 35 U/mL',
        children: '< 35 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 200 U/mL'
      },
      clinicalSignificance: 'Tumor marker for ovarian cancer. Used for monitoring and recurrence detection.',
      interpretation: 'Elevated levels may indicate ovarian cancer. Also elevated in benign conditions.',
      causes: {
        increased: ['Ovarian cancer', 'Endometriosis', 'Pregnancy', 'Menstruation', 'Pelvic inflammatory disease'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['HE4', 'Transvaginal Ultrasound', 'CT Scan', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Coagulation Tests
    {
      id: 'aptt',
      testName: 'Activated Partial Thromboplastin Time (aPTT)',
      category: 'coagulation',
      subcategory: 'coagulation-tests',
      specimen: 'Citrated Plasma',
      normalRange: {
        male: '25-35 seconds',
        female: '25-35 seconds',
        children: '25-35 seconds',
        units: 'seconds'
      },
      criticalValues: {
        low: '< 20 seconds',
        high: '> 60 seconds'
      },
      clinicalSignificance: 'Measures intrinsic coagulation pathway. Essential for heparin monitoring.',
      interpretation: 'Prolonged aPTT indicates coagulation disorder or anticoagulant effect.',
      causes: {
        increased: ['Heparin therapy', 'Hemophilia', 'von Willebrand disease', 'Liver disease', 'DIC'],
        decreased: ['Hypercoagulable state', 'Factor VIII elevation', 'Pregnancy']
      },
      relatedTests: ['PT', 'INR', 'Fibrinogen', 'Factor Assays'],
      preparation: 'Fasting not required',
      methodology: 'Clot-based assay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'fibrinogen',
      testName: 'Fibrinogen',
      category: 'coagulation',
      subcategory: 'coagulation-tests',
      specimen: 'Citrated Plasma',
      normalRange: {
        male: '200-400 mg/dL',
        female: '200-400 mg/dL',
        children: '200-400 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 100 mg/dL',
        high: '> 800 mg/dL'
      },
      clinicalSignificance: 'Essential clotting factor. Converted to fibrin during clot formation.',
      interpretation: 'Low levels increase bleeding risk. High levels may indicate inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Pregnancy', 'Oral contraceptives', 'Cancer'],
        decreased: ['DIC', 'Liver disease', 'Hemophilia', 'Fibrinogen deficiency']
      },
      relatedTests: ['PT', 'aPTT', 'D-Dimer', 'FDP'],
      preparation: 'Fasting not required',
      methodology: 'Clot-based assay',
      turnaroundTime: 'Same day'
    },

    // Immunology Tests
    {
      id: 'crp',
      testName: 'C-Reactive Protein (CRP)',
      category: 'immunology',
      subcategory: 'inflammation',
      specimen: 'Serum',
      normalRange: {
        male: '< 3.0 mg/L',
        female: '< 3.0 mg/L',
        children: '< 3.0 mg/L',
        units: 'mg/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 mg/L'
      },
      clinicalSignificance: 'Acute phase reactant indicating inflammation or infection.',
      interpretation: 'High levels indicate inflammation, infection, or tissue injury.',
      causes: {
        increased: ['Infection', 'Inflammation', 'Tissue injury', 'Autoimmune disease', 'Cancer'],
        decreased: ['Normal', 'Resolved inflammation']
      },
      relatedTests: ['ESR', 'WBC Count', 'Procalcitonin', 'Blood Cultures'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'esr',
      testName: 'Erythrocyte Sedimentation Rate (ESR)',
      category: 'immunology',
      subcategory: 'inflammation',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '0-15 mm/hr',
        female: '0-20 mm/hr',
        children: '0-10 mm/hr',
        units: 'mm/hr'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 50 mm/hr'
      },
      clinicalSignificance: 'Non-specific marker of inflammation. Used for monitoring inflammatory conditions.',
      interpretation: 'High levels indicate inflammation, infection, or tissue injury.',
      causes: {
        increased: ['Infection', 'Inflammation', 'Autoimmune disease', 'Cancer', 'Pregnancy'],
        decreased: ['Normal', 'Polycythemia', 'Sickle cell disease']
      },
      relatedTests: ['CRP', 'WBC Count', 'Autoimmune Panel', 'Rheumatoid Factor'],
      preparation: 'Fasting not required',
      methodology: 'Westergren method',
      turnaroundTime: 'Same day'
    },

    // Microbiology Tests
    {
      id: 'blood-culture-advanced',
      testName: 'Blood Culture',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Blood (Aerobic & Anaerobic bottles)',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'No growth'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detects bloodstream infections. Critical for sepsis diagnosis and treatment.',
      interpretation: 'Any growth indicates bloodstream infection. Identification and sensitivity testing required.',
      causes: {
        increased: ['Bacterial infection', 'Fungal infection', 'Contamination', 'Endocarditis', 'Catheter infection'],
        decreased: ['Normal', 'No infection']
      },
      relatedTests: ['WBC Count', 'CRP', 'Procalcitonin', 'Urine Culture'],
      preparation: 'Sterile technique required. Multiple sets recommended.',
      methodology: 'Automated culture system',
      turnaroundTime: '24-48 hours'
    },

    // Molecular Tests
    {
      id: 'pcr-covid',
      testName: 'COVID-19 PCR',
      category: 'molecular',
      subcategory: 'viral',
      specimen: 'Nasopharyngeal swab',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects SARS-CoV-2 viral RNA. Gold standard for COVID-19 diagnosis.',
      interpretation: 'Positive result indicates active COVID-19 infection. Negative does not rule out infection.',
      causes: {
        increased: ['COVID-19 infection', 'False positive', 'Contamination'],
        decreased: ['No infection', 'False negative', 'Poor sample collection']
      },
      relatedTests: ['COVID-19 Antigen', 'COVID-19 Antibody', 'Chest X-ray', 'Oxygen Saturation'],
      preparation: 'Proper swab technique required',
      methodology: 'Real-time PCR',
      turnaroundTime: '4-24 hours'
    },

    // Urinalysis Tests
    {
      id: 'urine-protein',
      testName: 'Urine Protein',
      category: 'urinalysis',
      subcategory: 'chemical',
      specimen: 'Random urine',
      normalRange: {
        male: '< 150 mg/24h',
        female: '< 150 mg/24h',
        children: '< 150 mg/24h',
        units: 'mg/24h'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 3.5 g/24h'
      },
      clinicalSignificance: 'Detects protein in urine. Essential for kidney disease assessment.',
      interpretation: 'High levels indicate kidney disease, diabetes, or other systemic conditions.',
      causes: {
        increased: ['Diabetic nephropathy', 'Glomerulonephritis', 'Hypertension', 'Preeclampsia', 'Multiple myeloma'],
        decreased: ['Normal kidney function', 'Adequate hydration']
      },
      relatedTests: ['Creatinine', 'BUN', 'eGFR', '24h Urine Protein', 'Kidney Biopsy'],
      preparation: 'Clean catch technique. 24h collection preferred.',
      methodology: 'Chemical dipstick/Quantitative',
      turnaroundTime: 'Same day'
    },

    // Additional Hematology Tests
    {
      id: 'reticulocytes',
      testName: 'Reticulocyte Count',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '0.5-2.5%',
        female: '0.5-2.5%',
        children: '0.5-2.5%',
        units: '%'
      },
      criticalValues: {
        low: '< 0.1%',
        high: '> 10%'
      },
      clinicalSignificance: 'Measures immature red blood cells. Essential for anemia evaluation and bone marrow response.',
      interpretation: 'High levels indicate increased RBC production. Low levels indicate bone marrow suppression.',
      causes: {
        increased: ['Hemolytic anemia', 'Blood loss', 'Iron therapy response', 'B12/folate therapy', 'Hemorrhage'],
        decreased: ['Aplastic anemia', 'Bone marrow failure', 'Iron deficiency', 'B12/folate deficiency']
      },
      relatedTests: ['CBC', 'Hemoglobin', 'Iron Studies', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: 'Same day'
    },

    {
      id: 'iron',
      testName: 'Serum Iron',
      category: 'hematology',
      subcategory: 'iron-studies',
      specimen: 'Serum',
      normalRange: {
        male: '60-170 μg/dL',
        female: '50-170 μg/dL',
        children: '50-120 μg/dL',
        units: 'μg/dL'
      },
      criticalValues: {
        low: '< 30 μg/dL',
        high: '> 300 μg/dL'
      },
      clinicalSignificance: 'Measures circulating iron levels. Essential for iron deficiency anemia diagnosis.',
      interpretation: 'Low levels indicate iron deficiency. High levels may indicate iron overload.',
      causes: {
        increased: ['Hemochromatosis', 'Iron overload', 'Hemolytic anemia', 'Liver disease', 'Iron therapy'],
        decreased: ['Iron deficiency anemia', 'Chronic disease', 'Inflammation', 'Malnutrition']
      },
      relatedTests: ['TIBC', 'Ferritin', 'Transferrin Saturation', 'CBC'],
      preparation: 'Fasting required',
      methodology: 'Colorimetric',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ferritin',
      testName: 'Ferritin',
      category: 'hematology',
      subcategory: 'iron-studies',
      specimen: 'Serum',
      normalRange: {
        male: '20-250 ng/mL',
        female: '10-120 ng/mL',
        children: '7-140 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: '< 10 ng/mL',
        high: '> 1000 ng/mL'
      },
      clinicalSignificance: 'Iron storage protein. Most sensitive indicator of iron stores.',
      interpretation: 'Low levels indicate iron deficiency. High levels indicate iron overload or inflammation.',
      causes: {
        increased: ['Iron overload', 'Inflammation', 'Infection', 'Cancer', 'Liver disease'],
        decreased: ['Iron deficiency', 'Chronic blood loss', 'Malnutrition', 'Pregnancy']
      },
      relatedTests: ['Iron', 'TIBC', 'Transferrin Saturation', 'CBC'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Biochemistry Tests
    {
      id: 'albumin',
      testName: 'Albumin',
      category: 'biochemistry',
      subcategory: 'protein',
      specimen: 'Serum',
      normalRange: {
        male: '3.4-5.4 g/dL',
        female: '3.4-5.4 g/dL',
        children: '3.4-5.4 g/dL',
        units: 'g/dL'
      },
      criticalValues: {
        low: '< 2.0 g/dL',
        high: '> 6.0 g/dL'
      },
      clinicalSignificance: 'Major plasma protein. Essential for oncotic pressure and transport.',
      interpretation: 'Low levels indicate liver disease, malnutrition, or protein loss. High levels indicate dehydration.',
      causes: {
        increased: ['Dehydration', 'Shock', 'Burns', 'Multiple myeloma'],
        decreased: ['Liver disease', 'Malnutrition', 'Nephrotic syndrome', 'Inflammation', 'Burns']
      },
      relatedTests: ['Total Protein', 'Globulin', 'A/G Ratio', 'Liver Function Tests'],
      preparation: 'Fasting not required',
      methodology: 'Bromcresol green',
      turnaroundTime: 'Same day'
    },

    {
      id: 'bilirubin-total',
      testName: 'Total Bilirubin',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '0.3-1.2 mg/dL',
        female: '0.3-1.2 mg/dL',
        children: '0.3-1.2 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 5.0 mg/dL'
      },
      clinicalSignificance: 'Breakdown product of hemoglobin. Essential for liver function assessment.',
      interpretation: 'High levels indicate liver disease, hemolysis, or bile duct obstruction.',
      causes: {
        increased: ['Liver disease', 'Bile duct obstruction', 'Hemolysis', 'Gilbert syndrome', 'Neonatal jaundice'],
        decreased: ['Normal', 'Anemia']
      },
      relatedTests: ['Direct Bilirubin', 'Indirect Bilirubin', 'ALT', 'AST', 'ALP'],
      preparation: 'Fasting not required',
      methodology: 'Diazo method',
      turnaroundTime: 'Same day'
    },

    {
      id: 'calcium',
      testName: 'Calcium (Total)',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '8.5-10.5 mg/dL',
        female: '8.5-10.5 mg/dL',
        children: '8.5-10.5 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 7.0 mg/dL',
        high: '> 12.0 mg/dL'
      },
      clinicalSignificance: 'Essential mineral for bone health and muscle function.',
      interpretation: 'High levels can cause confusion and kidney stones. Low levels cause muscle spasms.',
      causes: {
        increased: ['Hyperparathyroidism', 'Cancer', 'Vitamin D excess', 'Thiazide diuretics', 'Immobilization'],
        decreased: ['Hypoparathyroidism', 'Vitamin D deficiency', 'Kidney disease', 'Malnutrition']
      },
      relatedTests: ['Ionized Calcium', 'Phosphorus', 'PTH', 'Vitamin D', 'ALP'],
      preparation: 'Fasting required',
      methodology: 'Colorimetric',
      turnaroundTime: 'Same day'
    },

    {
      id: 'chloride',
      testName: 'Chloride (Cl-)',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '96-106 mEq/L',
        female: '96-106 mEq/L',
        children: '96-106 mEq/L',
        units: 'mEq/L'
      },
      criticalValues: {
        low: '< 80 mEq/L',
        high: '> 115 mEq/L'
      },
      clinicalSignificance: 'Major anion in extracellular fluid. Essential for acid-base balance.',
      interpretation: 'Changes usually follow sodium changes. Independent changes indicate acid-base disorders.',
      causes: {
        increased: ['Dehydration', 'Metabolic acidosis', 'Respiratory alkalosis', 'Hyperaldosteronism'],
        decreased: ['Vomiting', 'Metabolic alkalosis', 'Respiratory acidosis', 'Diuretics']
      },
      relatedTests: ['Sodium', 'Potassium', 'Bicarbonate', 'Anion Gap'],
      preparation: 'Fasting not required',
      methodology: 'Ion-selective electrode',
      turnaroundTime: 'Same day'
    },

    // Additional Cardiac Markers
    {
      id: 'troponin-t',
      testName: 'Troponin T',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '< 0.01 ng/mL',
        female: '< 0.01 ng/mL',
        children: '< 0.01 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 0.01 ng/mL'
      },
      clinicalSignificance: 'Cardiac-specific protein for myocardial injury detection. Alternative to Troponin I.',
      interpretation: 'Elevated levels indicate myocardial injury. Serial measurements show infarction pattern.',
      causes: {
        increased: ['Myocardial infarction', 'Heart failure', 'Myocarditis', 'Cardiac surgery', 'Renal failure'],
        decreased: ['Normal']
      },
      relatedTests: ['Troponin I', 'CK-MB', 'ECG', 'Echocardiogram'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1 hour (STAT)'
    },

    {
      id: 'nt-probnp',
      testName: 'NT-proBNP',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '< 125 pg/mL',
        female: '< 125 pg/mL',
        children: '< 125 pg/mL',
        units: 'pg/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 450 pg/mL'
      },
      clinicalSignificance: 'N-terminal pro-BNP. More stable than BNP for heart failure assessment.',
      interpretation: 'High levels indicate heart failure. Levels correlate with severity and prognosis.',
      causes: {
        increased: ['Heart failure', 'Pulmonary hypertension', 'Kidney failure', 'Age', 'Obesity'],
        decreased: ['Normal cardiac function', 'Young age']
      },
      relatedTests: ['BNP', 'Echocardiogram', 'Chest X-ray', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Hormone Tests
    {
      id: 'free-t3',
      testName: 'Free Triiodothyronine (Free T3)',
      category: 'hormones',
      subcategory: 'thyroid',
      specimen: 'Serum',
      normalRange: {
        male: '2.3-4.2 pg/mL',
        female: '2.3-4.2 pg/mL',
        children: '2.3-4.2 pg/mL',
        units: 'pg/mL'
      },
      criticalValues: {
        low: '< 1.0 pg/mL',
        high: '> 8.0 pg/mL'
      },
      clinicalSignificance: 'Active thyroid hormone. More potent than T4. Essential for thyroid function assessment.',
      interpretation: 'High levels indicate hyperthyroidism. Low levels indicate hypothyroidism.',
      causes: {
        increased: ['Hyperthyroidism', 'Thyroiditis', 'Excessive thyroid medication', 'Pregnancy'],
        decreased: ['Hypothyroidism', 'Iodine deficiency', 'Thyroid surgery', 'Radiation therapy']
      },
      relatedTests: ['TSH', 'Free T4', 'Total T3', 'Thyroid Antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'insulin',
      testName: 'Insulin',
      category: 'hormones',
      subcategory: 'metabolic',
      specimen: 'Serum',
      normalRange: {
        male: '3-25 μIU/mL',
        female: '3-25 μIU/mL',
        children: '3-25 μIU/mL',
        units: 'μIU/mL'
      },
      criticalValues: {
        low: '< 1 μIU/mL',
        high: '> 100 μIU/mL'
      },
      clinicalSignificance: 'Pancreatic hormone for glucose metabolism. Essential for diabetes evaluation.',
      interpretation: 'High levels indicate insulin resistance or insulinoma. Low levels indicate type 1 diabetes.',
      causes: {
        increased: ['Insulin resistance', 'Insulinoma', 'Obesity', 'Cushing syndrome', 'Acromegaly'],
        decreased: ['Type 1 diabetes', 'Pancreatitis', 'Pancreatectomy', 'Severe illness']
      },
      relatedTests: ['Glucose', 'C-Peptide', 'HbA1c', 'Insulin Antibodies'],
      preparation: 'Fasting required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Tumor Markers
    {
      id: 'ca-19-9',
      testName: 'Cancer Antigen 19-9 (CA 19-9)',
      category: 'tumor-markers',
      subcategory: 'pancreatic',
      specimen: 'Serum',
      normalRange: {
        male: '< 37 U/mL',
        female: '< 37 U/mL',
        children: '< 37 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 200 U/mL'
      },
      clinicalSignificance: 'Tumor marker for pancreatic and biliary tract cancers.',
      interpretation: 'Elevated levels may indicate pancreatic or biliary cancer. Also elevated in benign conditions.',
      causes: {
        increased: ['Pancreatic cancer', 'Biliary tract cancer', 'Colorectal cancer', 'Liver disease', 'Pancreatitis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CEA', 'CA-125', 'CT Scan', 'ERCP', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'afp',
      testName: 'Alpha-Fetoprotein (AFP)',
      category: 'tumor-markers',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '< 10 ng/mL',
        female: '< 10 ng/mL',
        children: '< 10 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 400 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for liver cancer and germ cell tumors.',
      interpretation: 'Elevated levels may indicate hepatocellular carcinoma or germ cell tumors.',
      causes: {
        increased: ['Hepatocellular carcinoma', 'Germ cell tumors', 'Liver cirrhosis', 'Pregnancy', 'Viral hepatitis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CEA', 'Liver Function Tests', 'CT Scan', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Coagulation Tests
    {
      id: 'd-dimer',
      testName: 'D-Dimer',
      category: 'coagulation',
      subcategory: 'coagulation-tests',
      specimen: 'Citrated Plasma',
      normalRange: {
        male: '< 0.5 μg/mL',
        female: '< 0.5 μg/mL',
        children: '< 0.5 μg/mL',
        units: 'μg/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 0.5 μg/mL'
      },
      clinicalSignificance: 'Fibrin degradation product. Essential for DVT and PE evaluation.',
      interpretation: 'Elevated levels indicate active clot formation and breakdown.',
      causes: {
        increased: ['DVT', 'Pulmonary embolism', 'DIC', 'Trauma', 'Surgery', 'Pregnancy'],
        decreased: ['Normal', 'No active clotting']
      },
      relatedTests: ['PT', 'aPTT', 'Fibrinogen', 'Ultrasound', 'CT Scan'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Immunology Tests
    {
      id: 'rheumatoid-factor',
      testName: 'Rheumatoid Factor (RF)',
      category: 'immunology',
      subcategory: 'autoimmune',
      specimen: 'Serum',
      normalRange: {
        male: '< 14 IU/mL',
        female: '< 14 IU/mL',
        children: '< 14 IU/mL',
        units: 'IU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 14 IU/mL'
      },
      clinicalSignificance: 'Autoantibody associated with rheumatoid arthritis and other autoimmune diseases.',
      interpretation: 'Positive result supports rheumatoid arthritis diagnosis. Not specific for RA.',
      causes: {
        increased: ['Rheumatoid arthritis', 'Sjögren syndrome', 'Systemic lupus erythematosus', 'Infection', 'Age'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['Anti-CCP', 'ESR', 'CRP', 'ANA', 'Joint X-rays'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ana',
      testName: 'Antinuclear Antibody (ANA)',
      category: 'immunology',
      subcategory: 'autoimmune',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Screening test for autoimmune diseases, especially systemic lupus erythematosus.',
      interpretation: 'Positive result suggests autoimmune disease. Titer and pattern provide additional information.',
      causes: {
        increased: ['Systemic lupus erythematosus', 'Rheumatoid arthritis', 'Sjögren syndrome', 'Scleroderma', 'Infection'],
        decreased: ['Normal', 'No autoimmune disease']
      },
      relatedTests: ['Anti-dsDNA', 'Anti-Sm', 'ESR', 'CRP', 'Complement'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    // Additional Microbiology Tests
    {
      id: 'urine-culture-advanced',
      testName: 'Urine Culture',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Clean catch urine',
      normalRange: {
        male: '< 10,000 CFU/mL',
        female: '< 10,000 CFU/mL',
        children: '< 10,000 CFU/mL',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 100,000 CFU/mL'
      },
      clinicalSignificance: 'Detects urinary tract infections. Essential for UTI diagnosis and treatment.',
      interpretation: 'High colony counts indicate UTI. Identification and sensitivity testing required.',
      causes: {
        increased: ['E. coli infection', 'Klebsiella infection', 'Proteus infection', 'Enterococcus infection', 'Contamination'],
        decreased: ['Normal', 'No infection']
      },
      relatedTests: ['Urinalysis', 'WBC Count', 'Nitrite', 'Leukocyte Esterase'],
      preparation: 'Clean catch technique required',
      methodology: 'Automated culture system',
      turnaroundTime: '24-48 hours'
    },

    // Additional Molecular Tests
    {
      id: 'hiv-pcr',
      testName: 'HIV PCR (Viral Load)',
      category: 'molecular',
      subcategory: 'viral',
      specimen: 'Plasma (EDTA)',
      normalRange: {
        male: 'Not detected',
        female: 'Not detected',
        children: 'Not detected',
        units: 'copies/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Any detectable level'
      },
      clinicalSignificance: 'Quantifies HIV viral RNA. Essential for HIV monitoring and treatment.',
      interpretation: 'Detectable levels indicate active HIV infection. Undetectable indicates viral suppression.',
      causes: {
        increased: ['HIV infection', 'Treatment failure', 'Non-compliance', 'Drug resistance'],
        decreased: ['No infection', 'Successful treatment', 'Viral suppression']
      },
      relatedTests: ['HIV Antibody', 'CD4 Count', 'HIV Genotype', 'Drug Resistance Testing'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '3-5 days'
    },

    // Additional Urinalysis Tests
    {
      id: 'urine-glucose',
      testName: 'Urine Glucose',
      category: 'urinalysis',
      subcategory: 'chemical',
      specimen: 'Random urine',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects glucose in urine. Essential for diabetes screening and monitoring.',
      interpretation: 'Positive result indicates diabetes or renal glycosuria.',
      causes: {
        increased: ['Diabetes mellitus', 'Renal glycosuria', 'Pregnancy', 'Stress', 'Corticosteroids'],
        decreased: ['Normal', 'Controlled diabetes']
      },
      relatedTests: ['Blood Glucose', 'HbA1c', 'Urine Ketones', 'Renal Function Tests'],
      preparation: 'Clean catch technique',
      methodology: 'Chemical dipstick',
      turnaroundTime: 'Same day'
    },

    // Additional Hematology Tests - Batch 1
    {
      id: 'wbc-differential',
      testName: 'White Blood Cell Differential',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Neutrophils: 40-70%, Lymphocytes: 20-40%, Monocytes: 2-8%, Eosinophils: 1-4%, Basophils: 0.5-1%',
        female: 'Neutrophils: 40-70%, Lymphocytes: 20-40%, Monocytes: 2-8%, Eosinophils: 1-4%, Basophils: 0.5-1%',
        children: 'Neutrophils: 40-70%, Lymphocytes: 20-40%, Monocytes: 2-8%, Eosinophils: 1-4%, Basophils: 0.5-1%',
        units: '%'
      },
      criticalValues: {
        low: 'Neutrophils < 500/μL',
        high: 'Blasts > 20%'
      },
      clinicalSignificance: 'Measures different types of white blood cells. Essential for infection and leukemia evaluation.',
      interpretation: 'Neutrophil increase indicates bacterial infection. Lymphocyte increase suggests viral infection.',
      causes: {
        increased: ['Bacterial infection (neutrophils)', 'Viral infection (lymphocytes)', 'Allergy (eosinophils)', 'Leukemia'],
        decreased: ['Bone marrow suppression', 'Viral infection (neutrophils)', 'Immunodeficiency']
      },
      relatedTests: ['CBC', 'WBC Count', 'Blood Culture', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mch',
      testName: 'Mean Corpuscular Hemoglobin (MCH)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '27-32 pg',
        female: '27-32 pg',
        children: '27-32 pg',
        units: 'pg'
      },
      criticalValues: {
        low: '< 20 pg',
        high: '> 35 pg'
      },
      clinicalSignificance: 'Average amount of hemoglobin per red blood cell. Essential for anemia classification.',
      interpretation: 'Low MCH indicates hypochromic anemia. High MCH suggests macrocytic anemia.',
      causes: {
        increased: ['Vitamin B12 deficiency', 'Folate deficiency', 'Alcoholism', 'Liver disease'],
        decreased: ['Iron deficiency', 'Thalassemia', 'Lead poisoning', 'Chronic disease']
      },
      relatedTests: ['CBC', 'MCV', 'MCHC', 'Iron Studies'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mchc',
      testName: 'Mean Corpuscular Hemoglobin Concentration (MCHC)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '32-36%',
        female: '32-36%',
        children: '32-36%',
        units: '%'
      },
      criticalValues: {
        low: '< 28%',
        high: '> 38%'
      },
      clinicalSignificance: 'Average concentration of hemoglobin in red blood cells. Essential for anemia evaluation.',
      interpretation: 'Low MCHC indicates hypochromic anemia. High MCHC suggests spherocytosis.',
      causes: {
        increased: ['Hereditary spherocytosis', 'Autoimmune hemolytic anemia', 'Burns'],
        decreased: ['Iron deficiency', 'Thalassemia', 'Lead poisoning', 'Chronic disease']
      },
      relatedTests: ['CBC', 'MCV', 'MCH', 'Iron Studies'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'rdw',
      testName: 'Red Cell Distribution Width (RDW)',
      category: 'hematology',
      subcategory: 'blood-count',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '11.5-14.5%',
        female: '11.5-14.5%',
        children: '11.5-14.5%',
        units: '%'
      },
      criticalValues: {
        low: '< 10%',
        high: '> 20%'
      },
      clinicalSignificance: 'Measures variation in red blood cell size. Essential for anemia classification.',
      interpretation: 'High RDW indicates mixed anemia or iron deficiency. Low RDW suggests uniform cell size.',
      causes: {
        increased: ['Iron deficiency', 'Mixed anemia', 'B12/folate deficiency', 'Blood loss'],
        decreased: ['Thalassemia', 'Chronic disease', 'Uniform cell size']
      },
      relatedTests: ['CBC', 'MCV', 'Iron Studies', 'B12/Folate'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer',
      turnaroundTime: 'Same day'
    },

    {
      id: 'tibc',
      testName: 'Total Iron Binding Capacity (TIBC)',
      category: 'hematology',
      subcategory: 'iron-studies',
      specimen: 'Serum',
      normalRange: {
        male: '240-450 μg/dL',
        female: '240-450 μg/dL',
        children: '240-450 μg/dL',
        units: 'μg/dL'
      },
      criticalValues: {
        low: '< 200 μg/dL',
        high: '> 500 μg/dL'
      },
      clinicalSignificance: 'Measures transferrin capacity to bind iron. Essential for iron deficiency diagnosis.',
      interpretation: 'High TIBC indicates iron deficiency. Low TIBC suggests iron overload or inflammation.',
      causes: {
        increased: ['Iron deficiency', 'Pregnancy', 'Estrogen therapy', 'Chronic blood loss'],
        decreased: ['Iron overload', 'Inflammation', 'Liver disease', 'Malnutrition']
      },
      relatedTests: ['Iron', 'Ferritin', 'Transferrin Saturation', 'CBC'],
      preparation: 'Fasting required',
      methodology: 'Colorimetric',
      turnaroundTime: 'Same day'
    },

    {
      id: 'transferrin-sat',
      testName: 'Transferrin Saturation',
      category: 'hematology',
      subcategory: 'iron-studies',
      specimen: 'Serum',
      normalRange: {
        male: '20-50%',
        female: '20-50%',
        children: '20-50%',
        units: '%'
      },
      criticalValues: {
        low: '< 10%',
        high: '> 60%'
      },
      clinicalSignificance: 'Percentage of transferrin bound to iron. Essential for iron status assessment.',
      interpretation: 'Low saturation indicates iron deficiency. High saturation suggests iron overload.',
      causes: {
        increased: ['Iron overload', 'Hemochromatosis', 'Hemolytic anemia', 'Iron therapy'],
        decreased: ['Iron deficiency', 'Inflammation', 'Chronic disease', 'Malnutrition']
      },
      relatedTests: ['Iron', 'TIBC', 'Ferritin', 'CBC'],
      preparation: 'Fasting required',
      methodology: 'Calculated (Iron/TIBC × 100)',
      turnaroundTime: 'Same day'
    },

    {
      id: 'vitamin-b12',
      testName: 'Vitamin B12',
      category: 'hematology',
      subcategory: 'vitamins',
      specimen: 'Serum',
      normalRange: {
        male: '200-900 pg/mL',
        female: '200-900 pg/mL',
        children: '200-900 pg/mL',
        units: 'pg/mL'
      },
      criticalValues: {
        low: '< 200 pg/mL',
        high: '> 1000 pg/mL'
      },
      clinicalSignificance: 'Essential vitamin for DNA synthesis and nerve function. Critical for megaloblastic anemia.',
      interpretation: 'Low levels cause megaloblastic anemia and neurological symptoms.',
      causes: {
        increased: ['Vitamin B12 supplementation', 'Liver disease', 'Myeloproliferative disorders'],
        decreased: ['Pernicious anemia', 'Malabsorption', 'Vegan diet', 'Gastrectomy']
      },
      relatedTests: ['Folate', 'Methylmalonic Acid', 'Homocysteine', 'CBC'],
      preparation: 'Fasting required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'folate',
      testName: 'Folate (Vitamin B9)',
      category: 'hematology',
      subcategory: 'vitamins',
      specimen: 'Serum',
      normalRange: {
        male: '2-20 ng/mL',
        female: '2-20 ng/mL',
        children: '2-20 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: '< 2 ng/mL',
        high: '> 20 ng/mL'
      },
      clinicalSignificance: 'Essential vitamin for DNA synthesis. Critical for megaloblastic anemia prevention.',
      interpretation: 'Low levels cause megaloblastic anemia and neural tube defects in pregnancy.',
      causes: {
        increased: ['Folate supplementation', 'Vitamin B12 deficiency', 'Liver disease'],
        decreased: ['Malnutrition', 'Malabsorption', 'Alcoholism', 'Pregnancy']
      },
      relatedTests: ['Vitamin B12', 'Homocysteine', 'CBC', 'RBC Folate'],
      preparation: 'Fasting required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'haptoglobin',
      testName: 'Haptoglobin',
      category: 'hematology',
      subcategory: 'hemolysis',
      specimen: 'Serum',
      normalRange: {
        male: '30-200 mg/dL',
        female: '30-200 mg/dL',
        children: '30-200 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 10 mg/dL',
        high: '> 300 mg/dL'
      },
      clinicalSignificance: 'Binds free hemoglobin. Essential for hemolysis detection.',
      interpretation: 'Low levels indicate hemolysis. High levels suggest inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Tissue injury', 'Cancer'],
        decreased: ['Hemolysis', 'Liver disease', 'Genetic deficiency']
      },
      relatedTests: ['LDH', 'Bilirubin', 'Reticulocyte Count', 'CBC'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ldh',
      testName: 'Lactate Dehydrogenase (LDH)',
      category: 'hematology',
      subcategory: 'hemolysis',
      specimen: 'Serum',
      normalRange: {
        male: '140-280 U/L',
        female: '140-280 U/L',
        children: '140-280 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 100 U/L',
        high: '> 1000 U/L'
      },
      clinicalSignificance: 'Enzyme released from damaged cells. Marker for hemolysis and tissue injury.',
      interpretation: 'High levels indicate hemolysis, tissue injury, or cancer.',
      causes: {
        increased: ['Hemolysis', 'Myocardial infarction', 'Liver disease', 'Cancer', 'Muscle injury'],
        decreased: ['Normal', 'Genetic deficiency']
      },
      relatedTests: ['Haptoglobin', 'Bilirubin', 'ALT', 'AST', 'CK'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    // Additional Biochemistry Tests - Batch 1
    {
      id: 'total-protein',
      testName: 'Total Protein',
      category: 'biochemistry',
      subcategory: 'protein',
      specimen: 'Serum',
      normalRange: {
        male: '6.0-8.3 g/dL',
        female: '6.0-8.3 g/dL',
        children: '6.0-8.3 g/dL',
        units: 'g/dL'
      },
      criticalValues: {
        low: '< 4.0 g/dL',
        high: '> 10.0 g/dL'
      },
      clinicalSignificance: 'Sum of albumin and globulins. Essential for protein status assessment.',
      interpretation: 'Low levels indicate malnutrition or protein loss. High levels suggest dehydration or paraproteinemia.',
      causes: {
        increased: ['Dehydration', 'Multiple myeloma', 'Chronic inflammation', 'Liver disease'],
        decreased: ['Malnutrition', 'Liver disease', 'Nephrotic syndrome', 'Burns']
      },
      relatedTests: ['Albumin', 'Globulin', 'A/G Ratio', 'Protein Electrophoresis'],
      preparation: 'Fasting not required',
      methodology: 'Biuret method',
      turnaroundTime: 'Same day'
    },

    {
      id: 'globulin',
      testName: 'Globulin',
      category: 'biochemistry',
      subcategory: 'protein',
      specimen: 'Serum',
      normalRange: {
        male: '2.0-3.5 g/dL',
        female: '2.0-3.5 g/dL',
        children: '2.0-3.5 g/dL',
        units: 'g/dL'
      },
      criticalValues: {
        low: '< 1.0 g/dL',
        high: '> 5.0 g/dL'
      },
      clinicalSignificance: 'Includes antibodies and transport proteins. Essential for immune function assessment.',
      interpretation: 'High levels suggest inflammation or paraproteinemia. Low levels indicate immunodeficiency.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Multiple myeloma', 'Liver disease'],
        decreased: ['Immunodeficiency', 'Malnutrition', 'Liver disease']
      },
      relatedTests: ['Total Protein', 'Albumin', 'A/G Ratio', 'Immunoglobulins'],
      preparation: 'Fasting not required',
      methodology: 'Calculated (Total Protein - Albumin)',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ag-ratio-basic',
      testName: 'Albumin/Globulin Ratio (A/G Ratio)',
      category: 'biochemistry',
      subcategory: 'protein',
      specimen: 'Serum',
      normalRange: {
        male: '1.1-2.2',
        female: '1.1-2.2',
        children: '1.1-2.2',
        units: 'Ratio'
      },
      criticalValues: {
        low: '< 0.8',
        high: '> 3.0'
      },
      clinicalSignificance: 'Ratio of albumin to globulin. Useful for protein disorder evaluation.',
      interpretation: 'Low ratio suggests inflammation or paraproteinemia. High ratio indicates dehydration.',
      causes: {
        increased: ['Dehydration', 'Globulin deficiency', 'Albumin excess'],
        decreased: ['Inflammation', 'Multiple myeloma', 'Liver disease', 'Nephrotic syndrome']
      },
      relatedTests: ['Albumin', 'Globulin', 'Total Protein', 'Protein Electrophoresis'],
      preparation: 'Fasting not required',
      methodology: 'Calculated (Albumin/Globulin)',
      turnaroundTime: 'Same day'
    },

    {
      id: 'alkaline-phosphatase-basic',
      testName: 'Alkaline Phosphatase (ALP)',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '44-147 U/L',
        female: '44-147 U/L',
        children: '44-147 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 30 U/L',
        high: '> 500 U/L'
      },
      clinicalSignificance: 'Enzyme from liver, bone, and other tissues. Essential for liver and bone disease evaluation.',
      interpretation: 'High levels suggest liver disease, bone disease, or pregnancy.',
      causes: {
        increased: ['Liver disease', 'Bone disease', 'Pregnancy', 'Bile duct obstruction', 'Cancer'],
        decreased: ['Malnutrition', 'Hypothyroidism', 'Genetic deficiency']
      },
      relatedTests: ['ALT', 'AST', 'GGT', 'Bilirubin', 'Bone Markers'],
      preparation: 'Fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ggt',
      testName: 'Gamma-Glutamyl Transferase (GGT)',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '8-61 U/L',
        female: '5-36 U/L',
        children: '5-36 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 5 U/L',
        high: '> 200 U/L'
      },
      clinicalSignificance: 'Liver enzyme sensitive to alcohol and drugs. Essential for liver function assessment.',
      interpretation: 'High levels suggest liver disease, alcohol use, or drug toxicity.',
      causes: {
        increased: ['Alcohol use', 'Liver disease', 'Drug toxicity', 'Bile duct obstruction', 'Obesity'],
        decreased: ['Normal', 'Severe liver failure']
      },
      relatedTests: ['ALT', 'AST', 'ALP', 'Bilirubin', 'Liver Function Tests'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'direct-bilirubin',
      testName: 'Direct Bilirubin',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '0.0-0.3 mg/dL',
        female: '0.0-0.3 mg/dL',
        children: '0.0-0.3 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 2.0 mg/dL'
      },
      clinicalSignificance: 'Conjugated bilirubin. Essential for jaundice evaluation.',
      interpretation: 'High levels indicate liver disease or bile duct obstruction.',
      causes: {
        increased: ['Liver disease', 'Bile duct obstruction', 'Gilbert syndrome', 'Dubin-Johnson syndrome'],
        decreased: ['Normal']
      },
      relatedTests: ['Total Bilirubin', 'Indirect Bilirubin', 'ALT', 'AST', 'ALP'],
      preparation: 'Fasting not required',
      methodology: 'Diazo method',
      turnaroundTime: 'Same day'
    },

    {
      id: 'indirect-bilirubin',
      testName: 'Indirect Bilirubin',
      category: 'biochemistry',
      subcategory: 'liver',
      specimen: 'Serum',
      normalRange: {
        male: '0.2-0.8 mg/dL',
        female: '0.2-0.8 mg/dL',
        children: '0.2-0.8 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 3.0 mg/dL'
      },
      clinicalSignificance: 'Unconjugated bilirubin. Essential for hemolysis evaluation.',
      interpretation: 'High levels indicate hemolysis or Gilbert syndrome.',
      causes: {
        increased: ['Hemolysis', 'Gilbert syndrome', 'Crigler-Najjar syndrome', 'Neonatal jaundice'],
        decreased: ['Normal', 'Severe liver disease']
      },
      relatedTests: ['Total Bilirubin', 'Direct Bilirubin', 'Haptoglobin', 'LDH'],
      preparation: 'Fasting not required',
      methodology: 'Calculated (Total - Direct)',
      turnaroundTime: 'Same day'
    },

    {
      id: 'phosphorus',
      testName: 'Phosphorus',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '2.5-4.5 mg/dL',
        female: '2.5-4.5 mg/dL',
        children: '3.0-6.0 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 1.0 mg/dL',
        high: '> 8.0 mg/dL'
      },
      clinicalSignificance: 'Essential mineral for bone health and energy metabolism.',
      interpretation: 'High levels can cause calcification. Low levels cause muscle weakness.',
      causes: {
        increased: ['Kidney failure', 'Hypoparathyroidism', 'Rhabdomyolysis', 'Tumor lysis'],
        decreased: ['Hyperparathyroidism', 'Vitamin D deficiency', 'Malnutrition', 'Alcoholism']
      },
      relatedTests: ['Calcium', 'PTH', 'Vitamin D', 'ALP', 'Kidney Function Tests'],
      preparation: 'Fasting required',
      methodology: 'Colorimetric',
      turnaroundTime: 'Same day'
    },

    {
      id: 'magnesium',
      testName: 'Magnesium',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '1.7-2.2 mg/dL',
        female: '1.7-2.2 mg/dL',
        children: '1.7-2.2 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 1.0 mg/dL',
        high: '> 4.0 mg/dL'
      },
      clinicalSignificance: 'Essential mineral for muscle and nerve function.',
      interpretation: 'Low levels cause muscle spasms and arrhythmias. High levels cause weakness.',
      causes: {
        increased: ['Kidney failure', 'Magnesium therapy', 'Hypothyroidism', 'Adrenal insufficiency'],
        decreased: ['Malnutrition', 'Alcoholism', 'Diarrhea', 'Diuretics', 'Diabetes']
      },
      relatedTests: ['Calcium', 'Potassium', 'Kidney Function Tests', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'Colorimetric',
      turnaroundTime: 'Same day'
    },

    {
      id: 'bicarbonate',
      testName: 'Bicarbonate (CO2)',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '22-28 mEq/L',
        female: '22-28 mEq/L',
        children: '22-28 mEq/L',
        units: 'mEq/L'
      },
      criticalValues: {
        low: '< 15 mEq/L',
        high: '> 35 mEq/L'
      },
      clinicalSignificance: 'Major buffer in acid-base balance. Essential for pH regulation.',
      interpretation: 'Low levels indicate metabolic acidosis. High levels suggest metabolic alkalosis.',
      causes: {
        increased: ['Metabolic alkalosis', 'Vomiting', 'Diuretics', 'Cushing syndrome'],
        decreased: ['Metabolic acidosis', 'Kidney failure', 'Diabetic ketoacidosis', 'Diarrhea']
      },
      relatedTests: ['Sodium', 'Potassium', 'Chloride', 'Anion Gap', 'Arterial Blood Gas'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anion-gap',
      testName: 'Anion Gap',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '8-16 mEq/L',
        female: '8-16 mEq/L',
        children: '8-16 mEq/L',
        units: 'mEq/L'
      },
      criticalValues: {
        low: '< 5 mEq/L',
        high: '> 20 mEq/L'
      },
      clinicalSignificance: 'Calculated value for acid-base evaluation. Essential for metabolic acidosis assessment.',
      interpretation: 'High gap indicates metabolic acidosis. Low gap suggests hypoalbuminemia.',
      causes: {
        increased: ['Diabetic ketoacidosis', 'Lactic acidosis', 'Kidney failure', 'Toxins', 'Alcohol'],
        decreased: ['Hypoalbuminemia', 'Multiple myeloma', 'Bromide intoxication']
      },
      relatedTests: ['Sodium', 'Potassium', 'Chloride', 'Bicarbonate', 'Albumin'],
      preparation: 'Fasting not required',
      methodology: 'Calculated (Na+ - Cl- - HCO3-)',
      turnaroundTime: 'Same day'
    },

    // Additional Biochemistry Tests - Batch 2
    {
      id: 'uric-acid',
      testName: 'Uric Acid',
      category: 'biochemistry',
      subcategory: 'metabolic',
      specimen: 'Serum',
      normalRange: {
        male: '3.4-7.0 mg/dL',
        female: '2.4-6.0 mg/dL',
        children: '2.0-5.5 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 1.0 mg/dL',
        high: '> 12.0 mg/dL'
      },
      clinicalSignificance: 'Breakdown product of purines. Essential for gout and kidney stone evaluation.',
      interpretation: 'High levels can cause gout and kidney stones. Low levels may indicate liver disease.',
      causes: {
        increased: ['Gout', 'Kidney disease', 'Cancer', 'Chemotherapy', 'High purine diet'],
        decreased: ['Liver disease', 'Malnutrition', 'Fanconi syndrome', 'Wilson disease']
      },
      relatedTests: ['Creatinine', 'BUN', 'Kidney Function Tests', 'Joint Fluid Analysis'],
      preparation: 'Fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cholesterol-total',
      testName: 'Total Cholesterol',
      category: 'biochemistry',
      subcategory: 'lipids',
      specimen: 'Serum',
      normalRange: {
        male: '< 200 mg/dL',
        female: '< 200 mg/dL',
        children: '< 170 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 100 mg/dL',
        high: '> 300 mg/dL'
      },
      clinicalSignificance: 'Total blood cholesterol. Essential for cardiovascular risk assessment.',
      interpretation: 'High levels increase cardiovascular risk. Low levels may indicate malnutrition.',
      causes: {
        increased: ['High fat diet', 'Obesity', 'Diabetes', 'Hypothyroidism', 'Genetic factors'],
        decreased: ['Malnutrition', 'Liver disease', 'Hyperthyroidism', 'Malabsorption']
      },
      relatedTests: ['HDL', 'LDL', 'Triglycerides', 'Lipid Panel'],
      preparation: '12-14 hours fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hdl',
      testName: 'High-Density Lipoprotein (HDL)',
      category: 'biochemistry',
      subcategory: 'lipids',
      specimen: 'Serum',
      normalRange: {
        male: '> 40 mg/dL',
        female: '> 50 mg/dL',
        children: '> 40 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 30 mg/dL',
        high: '> 80 mg/dL'
      },
      clinicalSignificance: 'Good cholesterol. Protects against cardiovascular disease.',
      interpretation: 'High levels are protective. Low levels increase cardiovascular risk.',
      causes: {
        increased: ['Exercise', 'Moderate alcohol', 'Estrogen', 'Weight loss'],
        decreased: ['Obesity', 'Diabetes', 'Smoking', 'High carbohydrate diet']
      },
      relatedTests: ['LDL', 'Triglycerides', 'Total Cholesterol', 'Lipid Panel'],
      preparation: '12-14 hours fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ldl',
      testName: 'Low-Density Lipoprotein (LDL)',
      category: 'biochemistry',
      subcategory: 'lipids',
      specimen: 'Serum',
      normalRange: {
        male: '< 100 mg/dL',
        female: '< 100 mg/dL',
        children: '< 110 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 50 mg/dL',
        high: '> 190 mg/dL'
      },
      clinicalSignificance: 'Bad cholesterol. Major risk factor for cardiovascular disease.',
      interpretation: 'High levels increase cardiovascular risk. Low levels are protective.',
      causes: {
        increased: ['High fat diet', 'Obesity', 'Diabetes', 'Hypothyroidism', 'Genetic factors'],
        decreased: ['Low fat diet', 'Exercise', 'Statins', 'Liver disease']
      },
      relatedTests: ['HDL', 'Triglycerides', 'Total Cholesterol', 'Lipid Panel'],
      preparation: '12-14 hours fasting required',
      methodology: 'Calculated or direct measurement',
      turnaroundTime: 'Same day'
    },

    {
      id: 'triglycerides',
      testName: 'Triglycerides',
      category: 'biochemistry',
      subcategory: 'lipids',
      specimen: 'Serum',
      normalRange: {
        male: '< 150 mg/dL',
        female: '< 150 mg/dL',
        children: '< 90 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 50 mg/dL',
        high: '> 500 mg/dL'
      },
      clinicalSignificance: 'Blood fats. Essential for cardiovascular risk assessment.',
      interpretation: 'High levels increase cardiovascular risk and pancreatitis risk.',
      causes: {
        increased: ['High fat diet', 'Obesity', 'Diabetes', 'Alcohol', 'Genetic factors'],
        decreased: ['Low fat diet', 'Malnutrition', 'Hyperthyroidism', 'Liver disease']
      },
      relatedTests: ['HDL', 'LDL', 'Total Cholesterol', 'Lipid Panel'],
      preparation: '12-14 hours fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hba1c',
      testName: 'Hemoglobin A1c (HbA1c)',
      category: 'biochemistry',
      subcategory: 'diabetes',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '< 5.7%',
        female: '< 5.7%',
        children: '< 5.7%',
        units: '%'
      },
      criticalValues: {
        low: '< 4.0%',
        high: '> 10.0%'
      },
      clinicalSignificance: 'Average blood glucose over 2-3 months. Gold standard for diabetes monitoring.',
      interpretation: 'High levels indicate poor diabetes control. Low levels suggest hypoglycemia risk.',
      causes: {
        increased: ['Diabetes mellitus', 'Poor glycemic control', 'Stress', 'Corticosteroids'],
        decreased: ['Hypoglycemia', 'Anemia', 'Hemolysis', 'Pregnancy']
      },
      relatedTests: ['Fasting Glucose', 'Random Glucose', 'Insulin', 'C-Peptide'],
      preparation: 'Fasting not required',
      methodology: 'HPLC or immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'c-peptide',
      testName: 'C-Peptide',
      category: 'biochemistry',
      subcategory: 'diabetes',
      specimen: 'Serum',
      normalRange: {
        male: '0.8-3.1 ng/mL',
        female: '0.8-3.1 ng/mL',
        children: '0.8-3.1 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: '< 0.3 ng/mL',
        high: '> 5.0 ng/mL'
      },
      clinicalSignificance: 'Marker of endogenous insulin production. Essential for diabetes classification.',
      interpretation: 'Low levels indicate type 1 diabetes. High levels suggest insulin resistance.',
      causes: {
        increased: ['Type 2 diabetes', 'Insulin resistance', 'Obesity', 'Cushing syndrome'],
        decreased: ['Type 1 diabetes', 'Pancreatitis', 'Pancreatectomy']
      },
      relatedTests: ['Insulin', 'Glucose', 'HbA1c', 'Diabetes Autoantibodies'],
      preparation: 'Fasting required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'lactate-advanced',
      testName: 'Lactate',
      category: 'biochemistry',
      subcategory: 'metabolic',
      specimen: 'Arterial or venous blood',
      normalRange: {
        male: '0.5-2.2 mmol/L',
        female: '0.5-2.2 mmol/L',
        children: '0.5-2.2 mmol/L',
        units: 'mmol/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 4.0 mmol/L'
      },
      clinicalSignificance: 'Marker of tissue hypoxia and anaerobic metabolism.',
      interpretation: 'High levels indicate tissue hypoxia, shock, or severe illness.',
      causes: {
        increased: ['Shock', 'Sepsis', 'Heart failure', 'Severe exercise', 'Metformin toxicity'],
        decreased: ['Normal', 'Adequate oxygenation']
      },
      relatedTests: ['Arterial Blood Gas', 'pH', 'Bicarbonate', 'Anion Gap'],
      preparation: 'Avoid tourniquet, ice immediately',
      methodology: 'Enzymatic',
      turnaroundTime: 'STAT (30 minutes)'
    },

    {
      id: 'ammonia',
      testName: 'Ammonia',
      category: 'biochemistry',
      subcategory: 'metabolic',
      specimen: 'Arterial or venous blood',
      normalRange: {
        male: '15-45 μg/dL',
        female: '15-45 μg/dL',
        children: '15-45 μg/dL',
        units: 'μg/dL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 100 μg/dL'
      },
      clinicalSignificance: 'Toxic byproduct of protein metabolism. Essential for liver function assessment.',
      interpretation: 'High levels indicate liver failure or metabolic disorders.',
      causes: {
        increased: ['Liver failure', 'Reye syndrome', 'Urea cycle defects', 'Gastrointestinal bleeding'],
        decreased: ['Normal', 'Adequate liver function']
      },
      relatedTests: ['Liver Function Tests', 'Bilirubin', 'Albumin', 'Mental Status'],
      preparation: 'Avoid tourniquet, ice immediately',
      methodology: 'Enzymatic',
      turnaroundTime: 'STAT (30 minutes)'
    },

    {
      id: 'osmolality',
      testName: 'Osmolality',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '275-295 mOsm/kg',
        female: '275-295 mOsm/kg',
        children: '275-295 mOsm/kg',
        units: 'mOsm/kg'
      },
      criticalValues: {
        low: '< 250 mOsm/kg',
        high: '> 320 mOsm/kg'
      },
      clinicalSignificance: 'Concentration of solutes in blood. Essential for fluid balance assessment.',
      interpretation: 'High levels indicate dehydration. Low levels suggest overhydration.',
      causes: {
        increased: ['Dehydration', 'Diabetes insipidus', 'Hyperglycemia', 'Alcohol intoxication'],
        decreased: ['Overhydration', 'SIADH', 'Heart failure', 'Liver cirrhosis']
      },
      relatedTests: ['Sodium', 'Glucose', 'BUN', 'Osmolal Gap'],
      preparation: 'Fasting not required',
      methodology: 'Freezing point depression',
      turnaroundTime: 'Same day'
    },

    // Additional Cardiac Markers - Batch 2
    {
      id: 'ck-total',
      testName: 'Creatine Kinase (Total CK)',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '38-174 U/L',
        female: '26-140 U/L',
        children: '26-140 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 20 U/L',
        high: '> 1000 U/L'
      },
      clinicalSignificance: 'Enzyme from muscle tissue. Essential for muscle injury assessment.',
      interpretation: 'High levels indicate muscle injury, heart attack, or other tissue damage.',
      causes: {
        increased: ['Myocardial infarction', 'Muscle injury', 'Exercise', 'Rhabdomyolysis', 'Injection'],
        decreased: ['Normal', 'Muscle wasting']
      },
      relatedTests: ['CK-MB', 'Troponin', 'LDH', 'Myoglobin'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'myoglobin',
      testName: 'Myoglobin',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '28-72 ng/mL',
        female: '25-58 ng/mL',
        children: '25-58 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 200 ng/mL'
      },
      clinicalSignificance: 'Early marker of muscle injury. Rises quickly after heart attack.',
      interpretation: 'High levels indicate muscle injury or heart attack.',
      causes: {
        increased: ['Myocardial infarction', 'Muscle injury', 'Rhabdomyolysis', 'Exercise', 'Trauma'],
        decreased: ['Normal', 'No muscle injury']
      },
      relatedTests: ['Troponin', 'CK-MB', 'CK Total', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1 hour (STAT)'
    },

    {
      id: 'homocysteine',
      testName: 'Homocysteine',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: '5-15 μmol/L',
        female: '5-15 μmol/L',
        children: '5-15 μmol/L',
        units: 'μmol/L'
      },
      criticalValues: {
        low: '< 5 μmol/L',
        high: '> 30 μmol/L'
      },
      clinicalSignificance: 'Amino acid associated with cardiovascular disease risk.',
      interpretation: 'High levels increase cardiovascular and stroke risk.',
      causes: {
        increased: ['Vitamin B12 deficiency', 'Folate deficiency', 'Kidney disease', 'Genetic factors'],
        decreased: ['Normal', 'Adequate B vitamins']
      },
      relatedTests: ['Vitamin B12', 'Folate', 'Methylmalonic Acid', 'Lipid Panel'],
      preparation: 'Fasting required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Hormone Tests - Batch 2
    {
      id: 'total-t4',
      testName: 'Total Thyroxine (T4)',
      category: 'hormones',
      subcategory: 'thyroid',
      specimen: 'Serum',
      normalRange: {
        male: '4.5-12.0 μg/dL',
        female: '4.5-12.0 μg/dL',
        children: '4.5-12.0 μg/dL',
        units: 'μg/dL'
      },
      criticalValues: {
        low: '< 2.0 μg/dL',
        high: '> 20.0 μg/dL'
      },
      clinicalSignificance: 'Total thyroid hormone. Less accurate than free T4 due to protein binding.',
      interpretation: 'High levels suggest hyperthyroidism. Low levels indicate hypothyroidism.',
      causes: {
        increased: ['Hyperthyroidism', 'Thyroiditis', 'Excessive thyroid medication', 'Pregnancy'],
        decreased: ['Hypothyroidism', 'Iodine deficiency', 'Thyroid surgery', 'Radiation therapy']
      },
      relatedTests: ['Free T4', 'TSH', 'T3', 'Thyroid Antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'total-t3',
      testName: 'Total Triiodothyronine (T3)',
      category: 'hormones',
      subcategory: 'thyroid',
      specimen: 'Serum',
      normalRange: {
        male: '80-200 ng/dL',
        female: '80-200 ng/dL',
        children: '80-200 ng/dL',
        units: 'ng/dL'
      },
      criticalValues: {
        low: '< 50 ng/dL',
        high: '> 300 ng/dL'
      },
      clinicalSignificance: 'Total T3 hormone. Less accurate than free T3 due to protein binding.',
      interpretation: 'High levels suggest hyperthyroidism. Low levels indicate hypothyroidism.',
      causes: {
        increased: ['Hyperthyroidism', 'Thyroiditis', 'Excessive thyroid medication', 'Pregnancy'],
        decreased: ['Hypothyroidism', 'Iodine deficiency', 'Thyroid surgery', 'Radiation therapy']
      },
      relatedTests: ['Free T3', 'TSH', 'T4', 'Thyroid Antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'acth',
      testName: 'Adrenocorticotropic Hormone (ACTH)',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Plasma (EDTA)',
      normalRange: {
        male: '7.2-63.3 pg/mL',
        female: '7.2-63.3 pg/mL',
        children: '7.2-63.3 pg/mL',
        units: 'pg/mL'
      },
      criticalValues: {
        low: '< 5 pg/mL',
        high: '> 100 pg/mL'
      },
      clinicalSignificance: 'Pituitary hormone that stimulates cortisol production.',
      interpretation: 'High levels suggest adrenal insufficiency. Low levels indicate Cushing syndrome.',
      causes: {
        increased: ['Primary adrenal insufficiency', 'Stress', 'ACTH-producing tumor'],
        decreased: ['Cushing syndrome', 'Pituitary insufficiency', 'Steroid therapy']
      },
      relatedTests: ['Cortisol', 'DHEA-S', 'Aldosterone', 'Pituitary MRI'],
      preparation: 'Fasting required. Morning sample preferred.',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'aldosterone-basic',
      testName: 'Aldosterone',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Serum',
      normalRange: {
        male: '3-35 ng/dL',
        female: '3-35 ng/dL',
        children: '3-35 ng/dL',
        units: 'ng/dL'
      },
      criticalValues: {
        low: '< 1 ng/dL',
        high: '> 100 ng/dL'
      },
      clinicalSignificance: 'Adrenal hormone for sodium and potassium balance.',
      interpretation: 'High levels suggest hyperaldosteronism. Low levels indicate adrenal insufficiency.',
      causes: {
        increased: ['Primary hyperaldosteronism', 'Secondary hyperaldosteronism', 'Heart failure'],
        decreased: ['Adrenal insufficiency', 'Addison disease', 'Hypoaldosteronism']
      },
      relatedTests: ['Renin', 'Sodium', 'Potassium', 'Cortisol'],
      preparation: 'Fasting required. Upright position for 2 hours.',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'prolactin',
      testName: 'Prolactin',
      category: 'hormones',
      subcategory: 'pituitary',
      specimen: 'Serum',
      normalRange: {
        male: '4.0-15.2 ng/mL',
        female: '4.8-23.3 ng/mL',
        children: '4.0-15.2 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: '< 2 ng/mL',
        high: '> 200 ng/mL'
      },
      clinicalSignificance: 'Pituitary hormone for milk production and reproductive function.',
      interpretation: 'High levels can cause infertility and galactorrhea.',
      causes: {
        increased: ['Prolactinoma', 'Pregnancy', 'Breastfeeding', 'Medications', 'Stress'],
        decreased: ['Pituitary insufficiency', 'Normal', 'Adequate function']
      },
      relatedTests: ['TSH', 'FSH', 'LH', 'Pituitary MRI'],
      preparation: 'Fasting required. Avoid stress and exercise.',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'fsh',
      testName: 'Follicle Stimulating Hormone (FSH)',
      category: 'hormones',
      subcategory: 'reproductive',
      specimen: 'Serum',
      normalRange: {
        male: '1.5-12.4 mIU/mL',
        female: '3.5-12.5 mIU/mL (follicular), 8.7-76.3 mIU/mL (ovulatory), 1.7-21.5 mIU/mL (luteal)',
        children: '1.5-12.4 mIU/mL',
        units: 'mIU/mL'
      },
      criticalValues: {
        low: '< 1 mIU/mL',
        high: '> 100 mIU/mL'
      },
      clinicalSignificance: 'Pituitary hormone for reproductive function and fertility.',
      interpretation: 'High levels suggest menopause or gonadal failure. Low levels indicate pituitary disease.',
      causes: {
        increased: ['Menopause', 'Gonadal failure', 'Turner syndrome', 'Klinefelter syndrome'],
        decreased: ['Pituitary insufficiency', 'Pregnancy', 'Oral contraceptives']
      },
      relatedTests: ['LH', 'Estradiol', 'Testosterone', 'AMH'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'lh',
      testName: 'Luteinizing Hormone (LH)',
      category: 'hormones',
      subcategory: 'reproductive',
      specimen: 'Serum',
      normalRange: {
        male: '1.7-8.6 mIU/mL',
        female: '2.4-12.6 mIU/mL (follicular), 14.0-95.6 mIU/mL (ovulatory), 1.0-11.4 mIU/mL (luteal)',
        children: '1.7-8.6 mIU/mL',
        units: 'mIU/mL'
      },
      criticalValues: {
        low: '< 1 mIU/mL',
        high: '> 100 mIU/mL'
      },
      clinicalSignificance: 'Pituitary hormone for ovulation and testosterone production.',
      interpretation: 'High levels suggest menopause or gonadal failure. Low levels indicate pituitary disease.',
      causes: {
        increased: ['Menopause', 'Gonadal failure', 'PCOS', 'Pituitary tumor'],
        decreased: ['Pituitary insufficiency', 'Pregnancy', 'Oral contraceptives']
      },
      relatedTests: ['FSH', 'Estradiol', 'Testosterone', 'Progesterone'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Serology Tests - Batch 1: Viral Serology
    {
      id: 'hiv-antibody',
      testName: 'HIV Antibody',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects antibodies to HIV. Essential for HIV screening and diagnosis.',
      interpretation: 'Positive result indicates HIV infection. Negative does not rule out recent infection.',
      causes: {
        increased: ['HIV infection', 'False positive', 'Cross-reactivity'],
        decreased: ['No infection', 'Window period', 'Immunodeficiency']
      },
      relatedTests: ['HIV PCR', 'CD4 Count', 'HIV Western Blot', 'HIV Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hepatitis-b-surface-antigen',
      testName: 'Hepatitis B Surface Antigen (HBsAg)',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects active hepatitis B infection. Essential for HBV diagnosis.',
      interpretation: 'Positive result indicates active HBV infection.',
      causes: {
        increased: ['Hepatitis B infection', 'Chronic HBV', 'Acute HBV'],
        decreased: ['No infection', 'Resolved infection', 'Vaccination']
      },
      relatedTests: ['HBsAb', 'HBcAb', 'HBeAg', 'HBV DNA'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hepatitis-b-surface-antibody',
      testName: 'Hepatitis B Surface Antibody (HBsAb)',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'mIU/mL'
      },
      criticalValues: {
        low: '< 10 mIU/mL',
        high: '> 10 mIU/mL'
      },
      clinicalSignificance: 'Detects immunity to hepatitis B. Essential for vaccination assessment.',
      interpretation: 'Positive result indicates immunity from vaccination or resolved infection.',
      causes: {
        increased: ['HBV vaccination', 'Resolved HBV infection', 'Natural immunity'],
        decreased: ['No immunity', 'Vaccination failure', 'Immunodeficiency']
      },
      relatedTests: ['HBsAg', 'HBcAb', 'HBV Vaccination History'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hepatitis-b-core-antibody',
      testName: 'Hepatitis B Core Antibody (HBcAb)',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past or current HBV infection. Essential for HBV status assessment.',
      interpretation: 'Positive result indicates past or current HBV infection.',
      causes: {
        increased: ['Past HBV infection', 'Current HBV infection', 'Resolved HBV'],
        decreased: ['No HBV exposure', 'Immunodeficiency']
      },
      relatedTests: ['HBsAg', 'HBsAb', 'HBeAg', 'HBV DNA'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hepatitis-c-antibody',
      testName: 'Hepatitis C Antibody (HCV Ab)',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects antibodies to hepatitis C. Essential for HCV screening.',
      interpretation: 'Positive result indicates HCV exposure. Confirmation with HCV RNA required.',
      causes: {
        increased: ['HCV infection', 'Past HCV infection', 'False positive'],
        decreased: ['No HCV exposure', 'Window period', 'Immunodeficiency']
      },
      relatedTests: ['HCV RNA', 'Liver Function Tests', 'HCV Genotype'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hepatitis-a-igm',
      testName: 'Hepatitis A IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent hepatitis A infection. Essential for acute HAV diagnosis.',
      interpretation: 'Positive result indicates recent HAV infection.',
      causes: {
        increased: ['Acute HAV infection', 'Recent HAV exposure'],
        decreased: ['No recent HAV infection', 'Past HAV infection']
      },
      relatedTests: ['HAV IgG', 'Liver Function Tests', 'HAV Total Antibody'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'hepatitis-a-igg',
      testName: 'Hepatitis A IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HAV infection or vaccination. Essential for immunity assessment.',
      interpretation: 'Positive result indicates past HAV infection or vaccination.',
      causes: {
        increased: ['Past HAV infection', 'HAV vaccination', 'Natural immunity'],
        decreased: ['No HAV exposure', 'No vaccination']
      },
      relatedTests: ['HAV IgM', 'HAV Total Antibody', 'Vaccination History'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cmv-igm',
      testName: 'Cytomegalovirus IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent CMV infection. Essential for CMV diagnosis.',
      interpretation: 'Positive result indicates recent CMV infection.',
      causes: {
        increased: ['Acute CMV infection', 'CMV reactivation', 'Primary CMV'],
        decreased: ['No recent CMV infection', 'Past CMV infection']
      },
      relatedTests: ['CMV IgG', 'CMV PCR', 'CMV Antigenemia'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cmv-igg',
      testName: 'Cytomegalovirus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past CMV infection. Essential for CMV status assessment.',
      interpretation: 'Positive result indicates past CMV infection.',
      causes: {
        increased: ['Past CMV infection', 'CMV exposure', 'Natural immunity'],
        decreased: ['No CMV exposure', 'Immunodeficiency']
      },
      relatedTests: ['CMV IgM', 'CMV PCR', 'CMV Avidity'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ebv-vca-igm',
      testName: 'Epstein-Barr Virus VCA IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent EBV infection. Essential for mononucleosis diagnosis.',
      interpretation: 'Positive result indicates recent EBV infection.',
      causes: {
        increased: ['Acute EBV infection', 'Infectious mononucleosis', 'Primary EBV'],
        decreased: ['No recent EBV infection', 'Past EBV infection']
      },
      relatedTests: ['EBV VCA IgG', 'EBV EBNA', 'EBV Early Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ebv-vca-igg',
      testName: 'Epstein-Barr Virus VCA IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past EBV infection. Essential for EBV status assessment.',
      interpretation: 'Positive result indicates past EBV infection.',
      causes: {
        increased: ['Past EBV infection', 'EBV exposure', 'Natural immunity'],
        decreased: ['No EBV exposure', 'Immunodeficiency']
      },
      relatedTests: ['EBV VCA IgM', 'EBV EBNA', 'EBV Early Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ebv-ebna',
      testName: 'Epstein-Barr Virus EBNA',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past EBV infection. Appears 2-4 months after infection.',
      interpretation: 'Positive result indicates past EBV infection.',
      causes: {
        increased: ['Past EBV infection', 'EBV exposure', 'Natural immunity'],
        decreased: ['No EBV exposure', 'Recent EBV infection', 'Immunodeficiency']
      },
      relatedTests: ['EBV VCA IgM', 'EBV VCA IgG', 'EBV Early Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'rubella-igm',
      testName: 'Rubella IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent rubella infection. Essential for congenital rubella assessment.',
      interpretation: 'Positive result indicates recent rubella infection.',
      causes: {
        increased: ['Acute rubella infection', 'Recent rubella exposure', 'Congenital rubella'],
        decreased: ['No recent rubella infection', 'Past rubella infection']
      },
      relatedTests: ['Rubella IgG', 'Rubella Avidity', 'Pregnancy Screening'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'rubella-igg',
      testName: 'Rubella IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'IU/mL'
      },
      criticalValues: {
        low: '< 10 IU/mL',
        high: '> 10 IU/mL'
      },
      clinicalSignificance: 'Detects rubella immunity. Essential for pregnancy screening.',
      interpretation: 'Positive result indicates rubella immunity.',
      causes: {
        increased: ['Past rubella infection', 'Rubella vaccination', 'Natural immunity'],
        decreased: ['No rubella immunity', 'Vaccination failure', 'Immunodeficiency']
      },
      relatedTests: ['Rubella IgM', 'Rubella Avidity', 'Pregnancy Screening'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'varicella-igg',
      testName: 'Varicella Zoster IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects varicella immunity. Essential for healthcare worker screening.',
      interpretation: 'Positive result indicates varicella immunity.',
      causes: {
        increased: ['Past varicella infection', 'Varicella vaccination', 'Natural immunity'],
        decreased: ['No varicella immunity', 'Vaccination failure', 'Immunodeficiency']
      },
      relatedTests: ['Varicella IgM', 'Varicella PCR', 'Healthcare Worker Screening'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'measles-igg',
      testName: 'Measles IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects measles immunity. Essential for vaccination assessment.',
      interpretation: 'Positive result indicates measles immunity.',
      causes: {
        increased: ['Past measles infection', 'Measles vaccination', 'Natural immunity'],
        decreased: ['No measles immunity', 'Vaccination failure', 'Immunodeficiency']
      },
      relatedTests: ['Measles IgM', 'MMR Vaccination History'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mumps-igg',
      testName: 'Mumps IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects mumps immunity. Essential for vaccination assessment.',
      interpretation: 'Positive result indicates mumps immunity.',
      causes: {
        increased: ['Past mumps infection', 'Mumps vaccination', 'Natural immunity'],
        decreased: ['No mumps immunity', 'Vaccination failure', 'Immunodeficiency']
      },
      relatedTests: ['Mumps IgM', 'MMR Vaccination History'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'parvovirus-b19-igm',
      testName: 'Parvovirus B19 IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent parvovirus B19 infection. Essential for fifth disease diagnosis.',
      interpretation: 'Positive result indicates recent parvovirus B19 infection.',
      causes: {
        increased: ['Acute parvovirus B19 infection', 'Fifth disease', 'Recent exposure'],
        decreased: ['No recent infection', 'Past parvovirus B19 infection']
      },
      relatedTests: ['Parvovirus B19 IgG', 'Parvovirus B19 PCR'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'parvovirus-b19-igg',
      testName: 'Parvovirus B19 IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past parvovirus B19 infection. Essential for immunity assessment.',
      interpretation: 'Positive result indicates past parvovirus B19 infection.',
      causes: {
        increased: ['Past parvovirus B19 infection', 'Natural immunity'],
        decreased: ['No parvovirus B19 exposure', 'Immunodeficiency']
      },
      relatedTests: ['Parvovirus B19 IgM', 'Parvovirus B19 PCR'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'west-nile-igm',
      testName: 'West Nile Virus IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent West Nile virus infection. Essential for encephalitis diagnosis.',
      interpretation: 'Positive result indicates recent West Nile virus infection.',
      causes: {
        increased: ['Acute West Nile virus infection', 'West Nile encephalitis', 'Recent exposure'],
        decreased: ['No recent infection', 'Past West Nile virus infection']
      },
      relatedTests: ['West Nile IgG', 'West Nile PCR', 'CSF Analysis'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'dengue-igg',
      testName: 'Dengue IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past dengue infection. Essential for dengue status assessment.',
      interpretation: 'Positive result indicates past dengue infection.',
      causes: {
        increased: ['Past dengue infection', 'Dengue exposure', 'Natural immunity'],
        decreased: ['No dengue exposure', 'Immunodeficiency']
      },
      relatedTests: ['Dengue IgM', 'Dengue PCR', 'Dengue NS1'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Serology Tests - Batch 2: Bacterial Serology
    {
      id: 'syphilis-rpr',
      testName: 'Syphilis RPR (Rapid Plasma Reagin)',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Non-reactive',
        female: 'Non-reactive',
        children: 'Non-reactive',
        units: 'Non-reactive'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Reactive'
      },
      clinicalSignificance: 'Screening test for syphilis. Essential for STI screening.',
      interpretation: 'Reactive result suggests syphilis infection. Confirmation with specific tests required.',
      causes: {
        increased: ['Syphilis infection', 'False positive', 'Other treponemal diseases'],
        decreased: ['No syphilis infection', 'Treated syphilis']
      },
      relatedTests: ['FTA-ABS', 'TP-PA', 'Syphilis IgM', 'Syphilis IgG'],
      preparation: 'Fasting not required',
      methodology: 'Card agglutination',
      turnaroundTime: 'Same day'
    },

    {
      id: 'syphilis-fta-abs',
      testName: 'Syphilis FTA-ABS',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Non-reactive',
        female: 'Non-reactive',
        children: 'Non-reactive',
        units: 'Non-reactive'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Reactive'
      },
      clinicalSignificance: 'Confirmatory test for syphilis. Essential for syphilis diagnosis.',
      interpretation: 'Reactive result confirms syphilis infection.',
      causes: {
        increased: ['Syphilis infection', 'Past syphilis infection'],
        decreased: ['No syphilis infection', 'Treated syphilis']
      },
      relatedTests: ['RPR', 'TP-PA', 'Syphilis IgM', 'Syphilis IgG'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'lyme-igm',
      testName: 'Lyme Disease IgM',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent Lyme disease infection. Essential for Lyme diagnosis.',
      interpretation: 'Positive result indicates recent Lyme disease infection.',
      causes: {
        increased: ['Acute Lyme disease', 'Recent Borrelia exposure', 'Lyme arthritis'],
        decreased: ['No recent Lyme infection', 'Past Lyme disease']
      },
      relatedTests: ['Lyme IgG', 'Lyme Western Blot', 'Lyme PCR'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'lyme-igg',
      testName: 'Lyme Disease IgG',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Lyme disease infection. Essential for Lyme status assessment.',
      interpretation: 'Positive result indicates past Lyme disease infection.',
      causes: {
        increased: ['Past Lyme disease', 'Borrelia exposure', 'Chronic Lyme'],
        decreased: ['No Lyme exposure', 'Immunodeficiency']
      },
      relatedTests: ['Lyme IgM', 'Lyme Western Blot', 'Lyme PCR'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'chlamydia-igg',
      testName: 'Chlamydia trachomatis IgG',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Chlamydia infection. Essential for infertility evaluation.',
      interpretation: 'Positive result indicates past Chlamydia infection.',
      causes: {
        increased: ['Past Chlamydia infection', 'Chlamydia exposure'],
        decreased: ['No Chlamydia exposure', 'Immunodeficiency']
      },
      relatedTests: ['Chlamydia IgM', 'Chlamydia PCR', 'Chlamydia Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mycoplasma-pneumoniae-igm',
      testName: 'Mycoplasma pneumoniae IgM',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent Mycoplasma pneumoniae infection. Essential for atypical pneumonia diagnosis.',
      interpretation: 'Positive result indicates recent Mycoplasma pneumoniae infection.',
      causes: {
        increased: ['Acute Mycoplasma infection', 'Atypical pneumonia', 'Recent exposure'],
        decreased: ['No recent infection', 'Past Mycoplasma infection']
      },
      relatedTests: ['Mycoplasma IgG', 'Mycoplasma PCR', 'Chest X-ray'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mycoplasma-pneumoniae-igg',
      testName: 'Mycoplasma pneumoniae IgG',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Mycoplasma pneumoniae infection. Essential for Mycoplasma status assessment.',
      interpretation: 'Positive result indicates past Mycoplasma pneumoniae infection.',
      causes: {
        increased: ['Past Mycoplasma infection', 'Mycoplasma exposure'],
        decreased: ['No Mycoplasma exposure', 'Immunodeficiency']
      },
      relatedTests: ['Mycoplasma IgM', 'Mycoplasma PCR', 'Chest X-ray'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'legionella-igg',
      testName: 'Legionella IgG',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Legionella infection. Essential for Legionella status assessment.',
      interpretation: 'Positive result indicates past Legionella infection.',
      causes: {
        increased: ['Past Legionella infection', 'Legionella exposure'],
        decreased: ['No Legionella exposure', 'Immunodeficiency']
      },
      relatedTests: ['Legionella IgM', 'Legionella PCR', 'Legionella Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'brucella-igg',
      testName: 'Brucella IgG',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Brucella infection. Essential for brucellosis assessment.',
      interpretation: 'Positive result indicates past Brucella infection.',
      causes: {
        increased: ['Past Brucella infection', 'Brucella exposure', 'Brucellosis'],
        decreased: ['No Brucella exposure', 'Immunodeficiency']
      },
      relatedTests: ['Brucella IgM', 'Brucella PCR', 'Brucella Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'q-fever-igg',
      testName: 'Q Fever IgG',
      category: 'immunology',
      subcategory: 'bacterial-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Q fever infection. Essential for Coxiella burnetii assessment.',
      interpretation: 'Positive result indicates past Q fever infection.',
      causes: {
        increased: ['Past Q fever infection', 'Coxiella exposure', 'Q fever'],
        decreased: ['No Q fever exposure', 'Immunodeficiency']
      },
      relatedTests: ['Q Fever IgM', 'Q Fever PCR', 'Coxiella Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Serology Tests - Batch 3: Fungal Serology
    {
      id: 'cryptococcus-antigen',
      testName: 'Cryptococcus Antigen',
      category: 'immunology',
      subcategory: 'fungal-serology',
      specimen: 'Serum or CSF',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects Cryptococcus infection. Essential for cryptococcal meningitis diagnosis.',
      interpretation: 'Positive result indicates Cryptococcus infection.',
      causes: {
        increased: ['Cryptococcus infection', 'Cryptococcal meningitis', 'Cryptococcal pneumonia'],
        decreased: ['No Cryptococcus infection', 'Treated infection']
      },
      relatedTests: ['Cryptococcus Culture', 'CSF Analysis', 'India Ink'],
      preparation: 'Fasting not required',
      methodology: 'Latex agglutination',
      turnaroundTime: 'Same day'
    },

    {
      id: 'histoplasma-antigen',
      testName: 'Histoplasma Antigen',
      category: 'immunology',
      subcategory: 'fungal-serology',
      specimen: 'Serum or Urine',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects Histoplasma infection. Essential for histoplasmosis diagnosis.',
      interpretation: 'Positive result indicates Histoplasma infection.',
      causes: {
        increased: ['Histoplasma infection', 'Histoplasmosis', 'Pulmonary histoplasmosis'],
        decreased: ['No Histoplasma infection', 'Treated infection']
      },
      relatedTests: ['Histoplasma Antibody', 'Histoplasma Culture', 'Chest X-ray'],
      preparation: 'Fasting not required',
      methodology: 'ELISA',
      turnaroundTime: 'Same day'
    },

    {
      id: 'aspergillus-antigen',
      testName: 'Aspergillus Antigen (Galactomannan)',
      category: 'immunology',
      subcategory: 'fungal-serology',
      specimen: 'Serum',
      normalRange: {
        male: '< 0.5',
        female: '< 0.5',
        children: '< 0.5',
        units: 'Index'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 0.5'
      },
      clinicalSignificance: 'Detects Aspergillus infection. Essential for invasive aspergillosis diagnosis.',
      interpretation: 'High levels suggest Aspergillus infection.',
      causes: {
        increased: ['Aspergillus infection', 'Invasive aspergillosis', 'Aspergilloma'],
        decreased: ['No Aspergillus infection', 'Treated infection']
      },
      relatedTests: ['Aspergillus Antibody', 'Aspergillus Culture', 'Chest CT'],
      preparation: 'Fasting not required',
      methodology: 'ELISA',
      turnaroundTime: 'Same day'
    },

    {
      id: 'candida-antigen',
      testName: 'Candida Antigen (Mannan)',
      category: 'immunology',
      subcategory: 'fungal-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects Candida infection. Essential for invasive candidiasis diagnosis.',
      interpretation: 'Positive result indicates Candida infection.',
      causes: {
        increased: ['Candida infection', 'Invasive candidiasis', 'Candidemia'],
        decreased: ['No Candida infection', 'Treated infection']
      },
      relatedTests: ['Candida Antibody', 'Candida Culture', 'Blood Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA',
      turnaroundTime: 'Same day'
    },

    {
      id: 'coccidioides-igg',
      testName: 'Coccidioides IgG',
      category: 'immunology',
      subcategory: 'fungal-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Coccidioides infection. Essential for coccidioidomycosis assessment.',
      interpretation: 'Positive result indicates past Coccidioides infection.',
      causes: {
        increased: ['Past Coccidioides infection', 'Coccidioidomycosis', 'Valley fever'],
        decreased: ['No Coccidioides exposure', 'Immunodeficiency']
      },
      relatedTests: ['Coccidioides IgM', 'Coccidioides Culture', 'Chest X-ray'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'blastomyces-igg',
      testName: 'Blastomyces IgG',
      category: 'immunology',
      subcategory: 'fungal-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Blastomyces infection. Essential for blastomycosis assessment.',
      interpretation: 'Positive result indicates past Blastomyces infection.',
      causes: {
        increased: ['Past Blastomyces infection', 'Blastomycosis', 'Pulmonary blastomycosis'],
        decreased: ['No Blastomyces exposure', 'Immunodeficiency']
      },
      relatedTests: ['Blastomyces IgM', 'Blastomyces Culture', 'Chest X-ray'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Serology Tests - Batch 4: Parasitic Serology
    {
      id: 'toxoplasma-igm',
      testName: 'Toxoplasma IgM',
      category: 'immunology',
      subcategory: 'parasitic-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent Toxoplasma infection. Essential for congenital toxoplasmosis assessment.',
      interpretation: 'Positive result indicates recent Toxoplasma infection.',
      causes: {
        increased: ['Acute Toxoplasma infection', 'Recent exposure', 'Congenital toxoplasmosis'],
        decreased: ['No recent infection', 'Past Toxoplasma infection']
      },
      relatedTests: ['Toxoplasma IgG', 'Toxoplasma Avidity', 'Pregnancy Screening'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'toxoplasma-igg',
      testName: 'Toxoplasma IgG',
      category: 'immunology',
      subcategory: 'parasitic-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'IU/mL'
      },
      criticalValues: {
        low: '< 3 IU/mL',
        high: '> 3 IU/mL'
      },
      clinicalSignificance: 'Detects past Toxoplasma infection. Essential for pregnancy screening.',
      interpretation: 'Positive result indicates past Toxoplasma infection.',
      causes: {
        increased: ['Past Toxoplasma infection', 'Toxoplasma exposure', 'Natural immunity'],
        decreased: ['No Toxoplasma exposure', 'Immunodeficiency']
      },
      relatedTests: ['Toxoplasma IgM', 'Toxoplasma Avidity', 'Pregnancy Screening'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'malaria-antibody',
      testName: 'Malaria Antibody',
      category: 'immunology',
      subcategory: 'parasitic-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past malaria infection. Essential for malaria status assessment.',
      interpretation: 'Positive result indicates past malaria infection.',
      causes: {
        increased: ['Past malaria infection', 'Malaria exposure', 'Travel history'],
        decreased: ['No malaria exposure', 'Immunodeficiency']
      },
      relatedTests: ['Malaria Smear', 'Malaria PCR', 'Malaria Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'leishmania-igg',
      testName: 'Leishmania IgG',
      category: 'immunology',
      subcategory: 'parasitic-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Leishmania infection. Essential for leishmaniasis assessment.',
      interpretation: 'Positive result indicates past Leishmania infection.',
      causes: {
        increased: ['Past Leishmania infection', 'Leishmaniasis', 'Travel history'],
        decreased: ['No Leishmania exposure', 'Immunodeficiency']
      },
      relatedTests: ['Leishmania IgM', 'Leishmania PCR', 'Leishmania Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'trypanosoma-igg',
      testName: 'Trypanosoma IgG',
      category: 'immunology',
      subcategory: 'parasitic-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past Trypanosoma infection. Essential for Chagas disease assessment.',
      interpretation: 'Positive result indicates past Trypanosoma infection.',
      causes: {
        increased: ['Past Trypanosoma infection', 'Chagas disease', 'Travel history'],
        decreased: ['No Trypanosoma exposure', 'Immunodeficiency']
      },
      relatedTests: ['Trypanosoma IgM', 'Trypanosoma PCR', 'ECG'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Serology Tests - Batch 5: Autoimmune Serology
    {
      id: 'ana-advanced',
      testName: 'Antinuclear Antibody (ANA)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Screening test for autoimmune diseases. Essential for SLE and other autoimmune disorders.',
      interpretation: 'Positive result suggests autoimmune disease. Pattern and titer important for diagnosis.',
      causes: {
        increased: ['SLE', 'Rheumatoid arthritis', 'Sjogren syndrome', 'Scleroderma', 'Drug-induced lupus'],
        decreased: ['No autoimmune disease', 'Normal variation']
      },
      relatedTests: ['Anti-dsDNA', 'Anti-Sm', 'Anti-Ro', 'Anti-La', 'Rheumatoid Factor'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-dsdna',
      testName: 'Anti-dsDNA Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'IU/mL'
      },
      criticalValues: {
        low: '< 30 IU/mL',
        high: '> 30 IU/mL'
      },
      clinicalSignificance: 'Specific marker for SLE. Essential for lupus diagnosis and monitoring.',
      interpretation: 'High levels suggest active SLE. Levels correlate with disease activity.',
      causes: {
        increased: ['SLE', 'Lupus nephritis', 'Active lupus', 'Drug-induced lupus'],
        decreased: ['No SLE', 'Inactive lupus', 'Treated lupus']
      },
      relatedTests: ['ANA', 'Anti-Sm', 'C3', 'C4', 'Urinalysis'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-sm',
      testName: 'Anti-Sm Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Highly specific marker for SLE. Essential for lupus diagnosis.',
      interpretation: 'Positive result strongly suggests SLE.',
      causes: {
        increased: ['SLE', 'Lupus nephritis', 'Active lupus'],
        decreased: ['No SLE', 'Other autoimmune diseases']
      },
      relatedTests: ['ANA', 'Anti-dsDNA', 'Anti-Ro', 'Anti-La'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-ro',
      testName: 'Anti-Ro (SS-A) Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with Sjogren syndrome and SLE. Essential for autoimmune diagnosis.',
      interpretation: 'Positive result suggests Sjogren syndrome or SLE.',
      causes: {
        increased: ['Sjogren syndrome', 'SLE', 'Neonatal lupus', 'Subacute cutaneous lupus'],
        decreased: ['No autoimmune disease', 'Other conditions']
      },
      relatedTests: ['Anti-La', 'ANA', 'Anti-dsDNA', 'Schirmer test'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-la',
      testName: 'Anti-La (SS-B) Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with Sjogren syndrome and SLE. Essential for autoimmune diagnosis.',
      interpretation: 'Positive result suggests Sjogren syndrome or SLE.',
      causes: {
        increased: ['Sjogren syndrome', 'SLE', 'Neonatal lupus', 'Subacute cutaneous lupus'],
        decreased: ['No autoimmune disease', 'Other conditions']
      },
      relatedTests: ['Anti-Ro', 'ANA', 'Anti-dsDNA', 'Schirmer test'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-ccp',
      testName: 'Anti-Cyclic Citrullinated Peptide (Anti-CCP)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 U/mL',
        female: '< 20 U/mL',
        children: '< 20 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20 U/mL'
      },
      clinicalSignificance: 'Highly specific marker for rheumatoid arthritis. Essential for RA diagnosis.',
      interpretation: 'Positive result strongly suggests rheumatoid arthritis.',
      causes: {
        increased: ['Rheumatoid arthritis', 'Early RA', 'Seropositive RA'],
        decreased: ['No RA', 'Other autoimmune diseases']
      },
      relatedTests: ['Rheumatoid Factor', 'ESR', 'CRP', 'Joint X-rays'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-centromere',
      testName: 'Anti-Centromere Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with limited scleroderma (CREST syndrome). Essential for scleroderma diagnosis.',
      interpretation: 'Positive result suggests limited scleroderma.',
      causes: {
        increased: ['Limited scleroderma', 'CREST syndrome', 'Primary biliary cirrhosis'],
        decreased: ['No scleroderma', 'Other autoimmune diseases']
      },
      relatedTests: ['Anti-Scl-70', 'ANA', 'Scleroderma antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-scl-70',
      testName: 'Anti-Scl-70 (Anti-Topoisomerase I)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with diffuse scleroderma. Essential for scleroderma diagnosis.',
      interpretation: 'Positive result suggests diffuse scleroderma.',
      causes: {
        increased: ['Diffuse scleroderma', 'Systemic sclerosis', 'Pulmonary fibrosis'],
        decreased: ['No scleroderma', 'Other autoimmune diseases']
      },
      relatedTests: ['Anti-Centromere', 'ANA', 'Scleroderma antibodies'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-mitochondrial',
      testName: 'Anti-Mitochondrial Antibody (AMA)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Highly specific marker for primary biliary cirrhosis. Essential for PBC diagnosis.',
      interpretation: 'Positive result strongly suggests primary biliary cirrhosis.',
      causes: {
        increased: ['Primary biliary cirrhosis', 'Autoimmune hepatitis', 'Scleroderma'],
        decreased: ['No autoimmune liver disease', 'Other liver diseases']
      },
      relatedTests: ['Liver Function Tests', 'Anti-Smooth Muscle', 'PBC antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-smooth-muscle',
      testName: 'Anti-Smooth Muscle Antibody (ASMA)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with autoimmune hepatitis. Essential for AIH diagnosis.',
      interpretation: 'Positive result suggests autoimmune hepatitis.',
      causes: {
        increased: ['Autoimmune hepatitis', 'Primary biliary cirrhosis', 'Viral hepatitis'],
        decreased: ['No autoimmune liver disease', 'Other liver diseases']
      },
      relatedTests: ['Anti-Mitochondrial', 'Liver Function Tests', 'AIH antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-lkm',
      testName: 'Anti-Liver/Kidney Microsomal (Anti-LKM)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with autoimmune hepatitis type 2. Essential for AIH diagnosis.',
      interpretation: 'Positive result suggests autoimmune hepatitis type 2.',
      causes: {
        increased: ['Autoimmune hepatitis type 2', 'Drug-induced hepatitis'],
        decreased: ['No autoimmune liver disease', 'Other liver diseases']
      },
      relatedTests: ['Anti-Smooth Muscle', 'Liver Function Tests', 'AIH antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-gliadin',
      testName: 'Anti-Gliadin Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with celiac disease. Essential for celiac diagnosis.',
      interpretation: 'Positive result suggests celiac disease.',
      causes: {
        increased: ['Celiac disease', 'Gluten sensitivity', 'Dermatitis herpetiformis'],
        decreased: ['No celiac disease', 'Gluten-free diet']
      },
      relatedTests: ['Anti-Tissue Transglutaminase', 'Anti-Endomysial', 'Celiac antibodies'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-tissue-transglutaminase',
      testName: 'Anti-Tissue Transglutaminase (tTG)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 U/mL',
        female: '< 20 U/mL',
        children: '< 20 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20 U/mL'
      },
      clinicalSignificance: 'Highly specific marker for celiac disease. Essential for celiac diagnosis.',
      interpretation: 'High levels strongly suggest celiac disease.',
      causes: {
        increased: ['Celiac disease', 'Active celiac', 'Gluten exposure'],
        decreased: ['No celiac disease', 'Gluten-free diet', 'Treated celiac']
      },
      relatedTests: ['Anti-Gliadin', 'Anti-Endomysial', 'Celiac antibodies'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-endomysial',
      testName: 'Anti-Endomysial Antibody (EMA)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Highly specific marker for celiac disease. Essential for celiac diagnosis.',
      interpretation: 'Positive result strongly suggests celiac disease.',
      causes: {
        increased: ['Celiac disease', 'Active celiac', 'Gluten exposure'],
        decreased: ['No celiac disease', 'Gluten-free diet', 'Treated celiac']
      },
      relatedTests: ['Anti-Gliadin', 'Anti-tTG', 'Celiac antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-neutrophil-cytoplasmic',
      testName: 'Anti-Neutrophil Cytoplasmic Antibody (ANCA)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with vasculitis. Essential for vasculitis diagnosis.',
      interpretation: 'Positive result suggests vasculitis. Pattern important for specific diagnosis.',
      causes: {
        increased: ['Wegener granulomatosis', 'Microscopic polyangiitis', 'Churg-Strauss syndrome', 'Vasculitis'],
        decreased: ['No vasculitis', 'Other autoimmune diseases']
      },
      relatedTests: ['PR3-ANCA', 'MPO-ANCA', 'ESR', 'CRP'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence',
      turnaroundTime: 'Same day'
    },

    {
      id: 'pr3-anca',
      testName: 'PR3-ANCA (Proteinase 3)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 U/mL',
        female: '< 20 U/mL',
        children: '< 20 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20 U/mL'
      },
      clinicalSignificance: 'Specific marker for Wegener granulomatosis. Essential for vasculitis diagnosis.',
      interpretation: 'High levels suggest Wegener granulomatosis.',
      causes: {
        increased: ['Wegener granulomatosis', 'GPA', 'Vasculitis'],
        decreased: ['No vasculitis', 'Other autoimmune diseases']
      },
      relatedTests: ['MPO-ANCA', 'ANCA', 'ESR', 'CRP'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mpo-anca',
      testName: 'MPO-ANCA (Myeloperoxidase)',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 U/mL',
        female: '< 20 U/mL',
        children: '< 20 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20 U/mL'
      },
      clinicalSignificance: 'Associated with microscopic polyangiitis and other vasculitides. Essential for vasculitis diagnosis.',
      interpretation: 'High levels suggest microscopic polyangiitis or other vasculitides.',
      causes: {
        increased: ['Microscopic polyangiitis', 'Churg-Strauss syndrome', 'Vasculitis'],
        decreased: ['No vasculitis', 'Other autoimmune diseases']
      },
      relatedTests: ['PR3-ANCA', 'ANCA', 'ESR', 'CRP'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-phospholipid',
      testName: 'Anti-Phospholipid Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Associated with antiphospholipid syndrome. Essential for APS diagnosis.',
      interpretation: 'Positive result suggests antiphospholipid syndrome.',
      causes: {
        increased: ['Antiphospholipid syndrome', 'SLE', 'Recurrent miscarriages', 'Thrombosis'],
        decreased: ['No APS', 'Other autoimmune diseases']
      },
      relatedTests: ['Lupus Anticoagulant', 'Anti-Cardiolipin', 'APS antibodies'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Serology Tests - Batch 6: Additional Infectious Disease Serology
    {
      id: 'herpes-simplex-1-igg',
      testName: 'Herpes Simplex Virus 1 IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HSV-1 infection. Essential for herpes status assessment.',
      interpretation: 'Positive result indicates past HSV-1 infection.',
      causes: {
        increased: ['Past HSV-1 infection', 'Oral herpes', 'Cold sores'],
        decreased: ['No HSV-1 exposure', 'Immunodeficiency']
      },
      relatedTests: ['HSV-1 IgM', 'HSV-2 IgG', 'HSV PCR'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'herpes-simplex-2-igg',
      testName: 'Herpes Simplex Virus 2 IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HSV-2 infection. Essential for genital herpes assessment.',
      interpretation: 'Positive result indicates past HSV-2 infection.',
      causes: {
        increased: ['Past HSV-2 infection', 'Genital herpes'],
        decreased: ['No HSV-2 exposure', 'Immunodeficiency']
      },
      relatedTests: ['HSV-2 IgM', 'HSV-1 IgG', 'HSV PCR'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'varicella-zoster-igm',
      testName: 'Varicella Zoster IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent VZV infection. Essential for chickenpox diagnosis.',
      interpretation: 'Positive result indicates recent VZV infection.',
      causes: {
        increased: ['Acute VZV infection', 'Chickenpox', 'Recent exposure'],
        decreased: ['No recent VZV infection', 'Past VZV infection']
      },
      relatedTests: ['VZV IgG', 'VZV PCR', 'Shingles diagnosis'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'respiratory-syncytial-virus-igm',
      testName: 'Respiratory Syncytial Virus IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent RSV infection. Essential for RSV diagnosis.',
      interpretation: 'Positive result indicates recent RSV infection.',
      causes: {
        increased: ['Acute RSV infection', 'Bronchiolitis', 'Recent exposure'],
        decreased: ['No recent RSV infection', 'Past RSV infection']
      },
      relatedTests: ['RSV IgG', 'RSV PCR', 'RSV Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'influenza-a-igm',
      testName: 'Influenza A IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent influenza A infection. Essential for flu diagnosis.',
      interpretation: 'Positive result indicates recent influenza A infection.',
      causes: {
        increased: ['Acute influenza A infection', 'Flu', 'Recent exposure'],
        decreased: ['No recent influenza A infection', 'Past influenza A infection']
      },
      relatedTests: ['Influenza A IgG', 'Influenza PCR', 'Influenza Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'influenza-b-igm',
      testName: 'Influenza B IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent influenza B infection. Essential for flu diagnosis.',
      interpretation: 'Positive result indicates recent influenza B infection.',
      causes: {
        increased: ['Acute influenza B infection', 'Flu', 'Recent exposure'],
        decreased: ['No recent influenza B infection', 'Past influenza B infection']
      },
      relatedTests: ['Influenza B IgG', 'Influenza PCR', 'Influenza Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'adenovirus-igg',
      testName: 'Adenovirus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past adenovirus infection. Essential for adenovirus status assessment.',
      interpretation: 'Positive result indicates past adenovirus infection.',
      causes: {
        increased: ['Past adenovirus infection', 'Adenovirus exposure'],
        decreased: ['No adenovirus exposure', 'Immunodeficiency']
      },
      relatedTests: ['Adenovirus IgM', 'Adenovirus PCR', 'Adenovirus Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'enterovirus-igg',
      testName: 'Enterovirus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past enterovirus infection. Essential for enterovirus status assessment.',
      interpretation: 'Positive result indicates past enterovirus infection.',
      causes: {
        increased: ['Past enterovirus infection', 'Coxsackie virus', 'Echovirus'],
        decreased: ['No enterovirus exposure', 'Immunodeficiency']
      },
      relatedTests: ['Enterovirus IgM', 'Enterovirus PCR', 'Enterovirus Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'rotavirus-igg',
      testName: 'Rotavirus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past rotavirus infection. Essential for rotavirus status assessment.',
      interpretation: 'Positive result indicates past rotavirus infection.',
      causes: {
        increased: ['Past rotavirus infection', 'Rotavirus exposure'],
        decreased: ['No rotavirus exposure', 'Immunodeficiency']
      },
      relatedTests: ['Rotavirus IgM', 'Rotavirus PCR', 'Rotavirus Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'norovirus-igg',
      testName: 'Norovirus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past norovirus infection. Essential for norovirus status assessment.',
      interpretation: 'Positive result indicates past norovirus infection.',
      causes: {
        increased: ['Past norovirus infection', 'Norovirus exposure', 'Gastroenteritis'],
        decreased: ['No norovirus exposure', 'Immunodeficiency']
      },
      relatedTests: ['Norovirus IgM', 'Norovirus PCR', 'Norovirus Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mumps-igm',
      testName: 'Mumps IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent mumps infection. Essential for mumps diagnosis.',
      interpretation: 'Positive result indicates recent mumps infection.',
      causes: {
        increased: ['Acute mumps infection', 'Mumps', 'Recent exposure'],
        decreased: ['No recent mumps infection', 'Past mumps infection']
      },
      relatedTests: ['Mumps IgG', 'Mumps PCR', 'Mumps Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'measles-igm',
      testName: 'Measles IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent measles infection. Essential for measles diagnosis.',
      interpretation: 'Positive result indicates recent measles infection.',
      causes: {
        increased: ['Acute measles infection', 'Measles', 'Recent exposure'],
        decreased: ['No recent measles infection', 'Past measles infection']
      },
      relatedTests: ['Measles IgG', 'Measles PCR', 'Measles Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'chickenpox-igm',
      testName: 'Chickenpox IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent chickenpox infection. Essential for chickenpox diagnosis.',
      interpretation: 'Positive result indicates recent chickenpox infection.',
      causes: {
        increased: ['Acute chickenpox infection', 'Chickenpox', 'Recent exposure'],
        decreased: ['No recent chickenpox infection', 'Past chickenpox infection']
      },
      relatedTests: ['Chickenpox IgG', 'VZV PCR', 'VZV Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'shingles-igm',
      testName: 'Shingles IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent shingles infection. Essential for shingles diagnosis.',
      interpretation: 'Positive result indicates recent shingles infection.',
      causes: {
        increased: ['Acute shingles infection', 'Shingles', 'VZV reactivation'],
        decreased: ['No recent shingles infection', 'Past shingles infection']
      },
      relatedTests: ['Shingles IgG', 'VZV PCR', 'VZV Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'mononucleosis-igm',
      testName: 'Mononucleosis IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent mononucleosis infection. Essential for mono diagnosis.',
      interpretation: 'Positive result indicates recent mononucleosis infection.',
      causes: {
        increased: ['Acute mononucleosis infection', 'Mono', 'EBV infection'],
        decreased: ['No recent mononucleosis infection', 'Past mononucleosis infection']
      },
      relatedTests: ['Mononucleosis IgG', 'EBV PCR', 'EBV Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cytomegalovirus-igm',
      testName: 'Cytomegalovirus IgM',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects recent CMV infection. Essential for CMV diagnosis.',
      interpretation: 'Positive result indicates recent CMV infection.',
      causes: {
        increased: ['Acute CMV infection', 'CMV', 'Recent exposure'],
        decreased: ['No recent CMV infection', 'Past CMV infection']
      },
      relatedTests: ['CMV IgG', 'CMV PCR', 'CMV Culture'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'human-papillomavirus-igg',
      testName: 'Human Papillomavirus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HPV infection. Essential for HPV status assessment.',
      interpretation: 'Positive result indicates past HPV infection.',
      causes: {
        increased: ['Past HPV infection', 'HPV exposure', 'Genital warts'],
        decreased: ['No HPV exposure', 'Immunodeficiency']
      },
      relatedTests: ['HPV IgM', 'HPV PCR', 'HPV DNA'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'human-immunodeficiency-virus-1-igg',
      testName: 'Human Immunodeficiency Virus 1 IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HIV-1 infection. Essential for HIV status assessment.',
      interpretation: 'Positive result indicates past HIV-1 infection.',
      causes: {
        increased: ['Past HIV-1 infection', 'HIV-1 exposure', 'AIDS'],
        decreased: ['No HIV-1 exposure', 'Immunodeficiency']
      },
      relatedTests: ['HIV-1 IgM', 'HIV-1 PCR', 'HIV-1 Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'human-immunodeficiency-virus-2-igg',
      testName: 'Human Immunodeficiency Virus 2 IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HIV-2 infection. Essential for HIV status assessment.',
      interpretation: 'Positive result indicates past HIV-2 infection.',
      causes: {
        increased: ['Past HIV-2 infection', 'HIV-2 exposure', 'AIDS'],
        decreased: ['No HIV-2 exposure', 'Immunodeficiency']
      },
      relatedTests: ['HIV-2 IgM', 'HIV-2 PCR', 'HIV-2 Antigen'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'human-t-cell-lymphotropic-virus-igg',
      testName: 'Human T-Cell Lymphotropic Virus IgG',
      category: 'immunology',
      subcategory: 'viral-serology',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects past HTLV infection. Essential for HTLV status assessment.',
      interpretation: 'Positive result indicates past HTLV infection.',
      causes: {
        increased: ['Past HTLV infection', 'HTLV exposure', 'Adult T-cell leukemia'],
        decreased: ['No HTLV exposure', 'Immunodeficiency']
      },
      relatedTests: ['HTLV IgM', 'HTLV PCR', 'HTLV DNA'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anti-cardiolipin',
      testName: 'Anti-Cardiolipin Antibody',
      category: 'immunology',
      subcategory: 'autoimmune-serology',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 GPL U/mL',
        female: '< 20 GPL U/mL',
        children: '< 20 GPL U/mL',
        units: 'GPL U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20 GPL U/mL'
      },
      clinicalSignificance: 'Specific marker for antiphospholipid syndrome. Essential for APS diagnosis.',
      interpretation: 'High levels suggest antiphospholipid syndrome.',
      causes: {
        increased: ['Antiphospholipid syndrome', 'SLE', 'Recurrent miscarriages', 'Thrombosis'],
        decreased: ['No APS', 'Other autoimmune diseases']
      },
      relatedTests: ['Lupus Anticoagulant', 'Anti-Phospholipid', 'APS antibodies'],
      preparation: 'Fasting not required',
      methodology: 'ELISA/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'urine-ketones',
      testName: 'Urine Ketones',
      category: 'urinalysis',
      subcategory: 'chemical',
      specimen: 'Random urine',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Large'
      },
      clinicalSignificance: 'Detects ketone bodies in urine. Essential for diabetic ketoacidosis assessment.',
      interpretation: 'Positive result indicates ketosis or diabetic ketoacidosis.',
      causes: {
        increased: ['Diabetic ketoacidosis', 'Starvation', 'Low-carbohydrate diet', 'Alcoholism', 'Pregnancy'],
        decreased: ['Normal', 'Adequate nutrition']
      },
      relatedTests: ['Blood Glucose', 'Blood Ketones', 'Arterial Blood Gas', 'Electrolytes'],
      preparation: 'Clean catch technique',
      methodology: 'Chemical dipstick',
      turnaroundTime: 'Same day'
    },

    // Specialized Tests - Batch 1: PCR and Molecular Tests
    {
      id: 'covid-19-pcr',
      testName: 'COVID-19 PCR (SARS-CoV-2)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Nasopharyngeal swab',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects SARS-CoV-2 RNA. Gold standard for COVID-19 diagnosis.',
      interpretation: 'Positive result indicates active COVID-19 infection.',
      causes: {
        increased: ['COVID-19 infection', 'SARS-CoV-2 exposure'],
        decreased: ['No COVID-19 infection', 'Recovered infection']
      },
      relatedTests: ['COVID-19 Antigen', 'COVID-19 Antibody', 'Chest X-ray'],
      preparation: 'Nasopharyngeal swab collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '4-24 hours'
    },

    {
      id: 'hiv-pcr-advanced',
      testName: 'HIV PCR (Viral Load)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Plasma (EDTA)',
      normalRange: {
        male: '< 20 copies/mL',
        female: '< 20 copies/mL',
        children: '< 20 copies/mL',
        units: 'copies/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 100,000 copies/mL'
      },
      clinicalSignificance: 'Quantifies HIV RNA. Essential for treatment monitoring.',
      interpretation: 'High levels indicate active viral replication.',
      causes: {
        increased: ['Active HIV infection', 'Treatment failure', 'Drug resistance'],
        decreased: ['Effective treatment', 'Viral suppression']
      },
      relatedTests: ['HIV Antibody', 'CD4 Count', 'HIV Genotype'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'hbv-pcr',
      testName: 'Hepatitis B PCR (HBV DNA)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 IU/mL',
        female: '< 20 IU/mL',
        children: '< 20 IU/mL',
        units: 'IU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 2,000 IU/mL'
      },
      clinicalSignificance: 'Quantifies HBV DNA. Essential for treatment monitoring.',
      interpretation: 'High levels indicate active viral replication.',
      causes: {
        increased: ['Active HBV infection', 'Treatment failure', 'Drug resistance'],
        decreased: ['Effective treatment', 'Viral suppression']
      },
      relatedTests: ['HBsAg', 'HBeAg', 'HBV Genotype'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'hcv-pcr',
      testName: 'Hepatitis C PCR (HCV RNA)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Serum',
      normalRange: {
        male: '< 15 IU/mL',
        female: '< 15 IU/mL',
        children: '< 15 IU/mL',
        units: 'IU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 800,000 IU/mL'
      },
      clinicalSignificance: 'Quantifies HCV RNA. Essential for treatment monitoring.',
      interpretation: 'High levels indicate active viral replication.',
      causes: {
        increased: ['Active HCV infection', 'Treatment failure', 'Drug resistance'],
        decreased: ['Effective treatment', 'Viral suppression']
      },
      relatedTests: ['HCV Antibody', 'HCV Genotype', 'Liver Function Tests'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'cmv-pcr',
      testName: 'Cytomegalovirus PCR (CMV DNA)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Plasma or whole blood',
      normalRange: {
        male: '< 500 copies/mL',
        female: '< 500 copies/mL',
        children: '< 500 copies/mL',
        units: 'copies/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10,000 copies/mL'
      },
      clinicalSignificance: 'Quantifies CMV DNA. Essential for transplant monitoring.',
      interpretation: 'High levels indicate active CMV infection.',
      causes: {
        increased: ['Active CMV infection', 'CMV reactivation', 'Primary CMV'],
        decreased: ['No CMV infection', 'Effective treatment']
      },
      relatedTests: ['CMV IgM', 'CMV IgG', 'CMV Antigenemia'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'ebv-pcr',
      testName: 'Epstein-Barr Virus PCR (EBV DNA)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Plasma or whole blood',
      normalRange: {
        male: '< 500 copies/mL',
        female: '< 500 copies/mL',
        children: '< 500 copies/mL',
        units: 'copies/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10,000 copies/mL'
      },
      clinicalSignificance: 'Quantifies EBV DNA. Essential for transplant monitoring.',
      interpretation: 'High levels indicate active EBV infection.',
      causes: {
        increased: ['Active EBV infection', 'EBV reactivation', 'Post-transplant lymphoproliferative disorder'],
        decreased: ['No EBV infection', 'Effective treatment']
      },
      relatedTests: ['EBV IgM', 'EBV IgG', 'EBV EBNA'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'herpes-simplex-pcr',
      testName: 'Herpes Simplex Virus PCR',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'CSF, swab, or tissue',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects HSV DNA. Essential for encephalitis diagnosis.',
      interpretation: 'Positive result indicates active HSV infection.',
      causes: {
        increased: ['Active HSV infection', 'HSV encephalitis', 'Genital herpes'],
        decreased: ['No HSV infection', 'Treated infection']
      },
      relatedTests: ['HSV IgM', 'HSV IgG', 'CSF Analysis'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'varicella-zoster-pcr',
      testName: 'Varicella Zoster Virus PCR',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'CSF, swab, or tissue',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects VZV DNA. Essential for shingles and encephalitis diagnosis.',
      interpretation: 'Positive result indicates active VZV infection.',
      causes: {
        increased: ['Active VZV infection', 'Shingles', 'VZV encephalitis'],
        decreased: ['No VZV infection', 'Treated infection']
      },
      relatedTests: ['VZV IgM', 'VZV IgG', 'CSF Analysis'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'influenza-pcr',
      testName: 'Influenza PCR (A/B)',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Nasopharyngeal swab',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects influenza A and B RNA. Essential for flu diagnosis.',
      interpretation: 'Positive result indicates active influenza infection.',
      causes: {
        increased: ['Active influenza infection', 'Flu A or B'],
        decreased: ['No influenza infection', 'Recovered infection']
      },
      relatedTests: ['Influenza Antigen', 'Influenza Culture', 'Chest X-ray'],
      preparation: 'Nasopharyngeal swab collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '4-24 hours'
    },

    {
      id: 'rsv-pcr',
      testName: 'Respiratory Syncytial Virus PCR',
      category: 'molecular',
      subcategory: 'viral-pcr',
      specimen: 'Nasopharyngeal swab',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects RSV RNA. Essential for bronchiolitis diagnosis.',
      interpretation: 'Positive result indicates active RSV infection.',
      causes: {
        increased: ['Active RSV infection', 'Bronchiolitis', 'Pneumonia'],
        decreased: ['No RSV infection', 'Recovered infection']
      },
      relatedTests: ['RSV Antigen', 'RSV Culture', 'Chest X-ray'],
      preparation: 'Nasopharyngeal swab collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '4-24 hours'
    },

    // Specialized Tests - Batch 2: Bacterial PCR Tests
    {
      id: 'mycobacterium-tuberculosis-pcr',
      testName: 'Mycobacterium tuberculosis PCR',
      category: 'molecular',
      subcategory: 'bacterial-pcr',
      specimen: 'Sputum, tissue, or body fluid',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects M. tuberculosis DNA. Essential for TB diagnosis.',
      interpretation: 'Positive result indicates active tuberculosis infection.',
      causes: {
        increased: ['Active tuberculosis', 'M. tuberculosis infection'],
        decreased: ['No tuberculosis infection', 'Treated TB']
      },
      relatedTests: ['TB Culture', 'TB Smear', 'Chest X-ray', 'TST'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'chlamydia-pcr',
      testName: 'Chlamydia trachomatis PCR',
      category: 'molecular',
      subcategory: 'bacterial-pcr',
      specimen: 'Urethral swab, cervical swab, or urine',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects C. trachomatis DNA. Essential for STI diagnosis.',
      interpretation: 'Positive result indicates active chlamydia infection.',
      causes: {
        increased: ['Active chlamydia infection', 'STI'],
        decreased: ['No chlamydia infection', 'Treated infection']
      },
      relatedTests: ['Gonorrhea PCR', 'Syphilis Tests', 'STI Panel'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'gonorrhea-pcr',
      testName: 'Neisseria gonorrhoeae PCR',
      category: 'molecular',
      subcategory: 'bacterial-pcr',
      specimen: 'Urethral swab, cervical swab, or urine',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects N. gonorrhoeae DNA. Essential for STI diagnosis.',
      interpretation: 'Positive result indicates active gonorrhea infection.',
      causes: {
        increased: ['Active gonorrhea infection', 'STI'],
        decreased: ['No gonorrhea infection', 'Treated infection']
      },
      relatedTests: ['Chlamydia PCR', 'Syphilis Tests', 'STI Panel'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'mycoplasma-pcr',
      testName: 'Mycoplasma pneumoniae PCR',
      category: 'molecular',
      subcategory: 'bacterial-pcr',
      specimen: 'Throat swab or sputum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects M. pneumoniae DNA. Essential for atypical pneumonia diagnosis.',
      interpretation: 'Positive result indicates active M. pneumoniae infection.',
      causes: {
        increased: ['Active M. pneumoniae infection', 'Atypical pneumonia'],
        decreased: ['No M. pneumoniae infection', 'Treated infection']
      },
      relatedTests: ['Mycoplasma IgM', 'Mycoplasma IgG', 'Chest X-ray'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'legionella-pcr',
      testName: 'Legionella pneumophila PCR',
      category: 'molecular',
      subcategory: 'bacterial-pcr',
      specimen: 'Sputum or respiratory secretion',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects L. pneumophila DNA. Essential for Legionnaires disease diagnosis.',
      interpretation: 'Positive result indicates active Legionella infection.',
      causes: {
        increased: ['Active Legionella infection', 'Legionnaires disease'],
        decreased: ['No Legionella infection', 'Treated infection']
      },
      relatedTests: ['Legionella Culture', 'Legionella Antigen', 'Chest X-ray'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Real-time PCR',
      turnaroundTime: '1-2 days'
    },

    // Specialized Tests - Batch 3: Peripheral Blood Film Analysis
    {
      id: 'peripheral-blood-film',
      testName: 'Peripheral Blood Film',
      category: 'hematology',
      subcategory: 'morphology',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Normal morphology',
        female: 'Normal morphology',
        children: 'Normal morphology',
        units: 'Normal'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Abnormal morphology'
      },
      clinicalSignificance: 'Microscopic examination of blood cells. Essential for morphology assessment.',
      interpretation: 'Abnormal morphology indicates underlying hematologic disorder.',
      causes: {
        increased: ['Anemia', 'Leukemia', 'Infection', 'Inflammation', 'Toxins'],
        decreased: ['Normal', 'No underlying disorder']
      },
      relatedTests: ['CBC', 'WBC Differential', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Microscopy',
      turnaroundTime: 'Same day'
    },

    {
      id: 'reticulocyte-count',
      testName: 'Reticulocyte Count',
      category: 'hematology',
      subcategory: 'morphology',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '0.5-2.5%',
        female: '0.5-2.5%',
        children: '0.5-2.5%',
        units: '%'
      },
      criticalValues: {
        low: '< 0.5%',
        high: '> 5.0%'
      },
      clinicalSignificance: 'Measures immature red blood cells. Essential for anemia evaluation.',
      interpretation: 'High count indicates increased erythropoiesis. Low count suggests bone marrow suppression.',
      causes: {
        increased: ['Hemolysis', 'Blood loss', 'Iron deficiency', 'B12/folate deficiency'],
        decreased: ['Bone marrow suppression', 'Aplastic anemia', 'Chemotherapy']
      },
      relatedTests: ['CBC', 'Iron Studies', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: 'Same day'
    },

    {
      id: 'reticulocyte-index',
      testName: 'Reticulocyte Production Index',
      category: 'hematology',
      subcategory: 'morphology',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '1.0-2.0',
        female: '1.0-2.0',
        children: '1.0-2.0',
        units: 'Index'
      },
      criticalValues: {
        low: '< 0.5',
        high: '> 3.0'
      },
      clinicalSignificance: 'Corrected reticulocyte count for anemia severity. Essential for anemia classification.',
      interpretation: 'High index indicates appropriate bone marrow response. Low index suggests bone marrow failure.',
      causes: {
        increased: ['Hemolysis', 'Blood loss', 'Iron deficiency'],
        decreased: ['Bone marrow failure', 'Aplastic anemia', 'Chemotherapy']
      },
      relatedTests: ['Reticulocyte Count', 'CBC', 'Iron Studies'],
      preparation: 'Fasting not required',
      methodology: 'Calculated',
      turnaroundTime: 'Same day'
    },

    {
      id: 'nucleated-rbc',
      testName: 'Nucleated Red Blood Cells',
      category: 'hematology',
      subcategory: 'morphology',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '0/100 WBC',
        female: '0/100 WBC',
        children: '0/100 WBC',
        units: '/100 WBC'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 5/100 WBC'
      },
      clinicalSignificance: 'Immature red blood cells in peripheral blood. Essential for bone marrow assessment.',
      interpretation: 'Presence indicates bone marrow stress or pathology.',
      causes: {
        increased: ['Severe anemia', 'Bone marrow infiltration', 'Hemolysis', 'Splenectomy'],
        decreased: ['Normal', 'No bone marrow stress']
      },
      relatedTests: ['CBC', 'Peripheral Blood Film', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Microscopy',
      turnaroundTime: 'Same day'
    },

    {
      id: 'blast-cells',
      testName: 'Blast Cells',
      category: 'hematology',
      subcategory: 'morphology',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '0%',
        female: '0%',
        children: '0%',
        units: '%'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20%'
      },
      clinicalSignificance: 'Immature white blood cells. Essential for leukemia diagnosis.',
      interpretation: 'Presence suggests leukemia or bone marrow disorder.',
      causes: {
        increased: ['Acute leukemia', 'Myelodysplastic syndrome', 'Bone marrow infiltration'],
        decreased: ['Normal', 'No leukemia']
      },
      relatedTests: ['CBC', 'WBC Differential', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Microscopy',
      turnaroundTime: 'Same day'
    },

    // Specialized Tests - Batch 4: Advanced Molecular Tests
    {
      id: 'bcr-abl-pcr',
      testName: 'BCR-ABL PCR (Philadelphia Chromosome)',
      category: 'molecular',
      subcategory: 'genetic-pcr',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '< 0.1%',
        female: '< 0.1%',
        children: '< 0.1%',
        units: '%'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10%'
      },
      clinicalSignificance: 'Detects BCR-ABL fusion gene. Essential for CML diagnosis and monitoring.',
      interpretation: 'High levels indicate active CML. Low levels suggest treatment response.',
      causes: {
        increased: ['Chronic myeloid leukemia', 'CML relapse', 'Treatment resistance'],
        decreased: ['Treatment response', 'CML remission']
      },
      relatedTests: ['CBC', 'Bone Marrow Biopsy', 'Cytogenetics'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'jak2-mutation',
      testName: 'JAK2 V617F Mutation',
      category: 'molecular',
      subcategory: 'genetic-pcr',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects JAK2 mutation. Essential for myeloproliferative disorder diagnosis.',
      interpretation: 'Positive result suggests myeloproliferative disorder.',
      causes: {
        increased: ['Polycythemia vera', 'Essential thrombocythemia', 'Primary myelofibrosis'],
        decreased: ['No myeloproliferative disorder', 'Secondary causes']
      },
      relatedTests: ['CBC', 'Bone Marrow Biopsy', 'Erythropoietin'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'flt3-mutation',
      testName: 'FLT3 Mutation',
      category: 'molecular',
      subcategory: 'genetic-pcr',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects FLT3 mutation. Essential for AML prognosis.',
      interpretation: 'Positive result indicates poor prognosis in AML.',
      causes: {
        increased: ['Acute myeloid leukemia', 'AML with FLT3 mutation'],
        decreased: ['No AML', 'AML without FLT3 mutation']
      },
      relatedTests: ['CBC', 'Bone Marrow Biopsy', 'Cytogenetics'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'npm1-mutation',
      testName: 'NPM1 Mutation',
      category: 'molecular',
      subcategory: 'genetic-pcr',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects NPM1 mutation. Essential for AML prognosis.',
      interpretation: 'Positive result indicates favorable prognosis in AML.',
      causes: {
        increased: ['Acute myeloid leukemia', 'AML with NPM1 mutation'],
        decreased: ['No AML', 'AML without NPM1 mutation']
      },
      relatedTests: ['CBC', 'Bone Marrow Biopsy', 'Cytogenetics'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'cebpa-mutation',
      testName: 'CEBPA Mutation',
      category: 'molecular',
      subcategory: 'genetic-pcr',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects CEBPA mutation. Essential for AML prognosis.',
      interpretation: 'Positive result indicates favorable prognosis in AML.',
      causes: {
        increased: ['Acute myeloid leukemia', 'AML with CEBPA mutation'],
        decreased: ['No AML', 'AML without CEBPA mutation']
      },
      relatedTests: ['CBC', 'Bone Marrow Biopsy', 'Cytogenetics'],
      preparation: 'Fasting not required',
      methodology: 'Real-time PCR',
      turnaroundTime: '3-5 days'
    },

    // Specialized Tests - Batch 5: Flow Cytometry Tests
    {
      id: 'cd4-count',
      testName: 'CD4 Count',
      category: 'immunology',
      subcategory: 'flow-cytometry',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '500-1500 cells/μL',
        female: '500-1500 cells/μL',
        children: '500-1500 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: '< 200 cells/μL',
        high: '> 2000 cells/μL'
      },
      clinicalSignificance: 'Measures helper T cells. Essential for HIV monitoring.',
      interpretation: 'Low levels indicate immunodeficiency. High levels suggest immune activation.',
      causes: {
        increased: ['Immune activation', 'Inflammation', 'Autoimmune disease'],
        decreased: ['HIV infection', 'Immunodeficiency', 'Chemotherapy']
      },
      relatedTests: ['CD8 Count', 'CD4/CD8 Ratio', 'HIV Viral Load'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'cd8-count',
      testName: 'CD8 Count',
      category: 'immunology',
      subcategory: 'flow-cytometry',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '200-800 cells/μL',
        female: '200-800 cells/μL',
        children: '200-800 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: '< 100 cells/μL',
        high: '> 1500 cells/μL'
      },
      clinicalSignificance: 'Measures cytotoxic T cells. Essential for immune function assessment.',
      interpretation: 'Low levels indicate immunodeficiency. High levels suggest immune activation.',
      causes: {
        increased: ['Viral infection', 'Immune activation', 'Autoimmune disease'],
        decreased: ['HIV infection', 'Immunodeficiency', 'Chemotherapy']
      },
      relatedTests: ['CD4 Count', 'CD4/CD8 Ratio', 'HIV Viral Load'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'cd4-cd8-ratio',
      testName: 'CD4/CD8 Ratio',
      category: 'immunology',
      subcategory: 'flow-cytometry',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '1.0-4.0',
        female: '1.0-4.0',
        children: '1.0-4.0',
        units: 'Ratio'
      },
      criticalValues: {
        low: '< 0.5',
        high: '> 5.0'
      },
      clinicalSignificance: 'Ratio of helper to cytotoxic T cells. Essential for immune function assessment.',
      interpretation: 'Low ratio indicates immunodeficiency. High ratio suggests immune activation.',
      causes: {
        increased: ['Immune activation', 'Autoimmune disease', 'Chronic infection'],
        decreased: ['HIV infection', 'Immunodeficiency', 'Viral infection']
      },
      relatedTests: ['CD4 Count', 'CD8 Count', 'HIV Viral Load'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'nk-cell-count',
      testName: 'Natural Killer Cell Count',
      category: 'immunology',
      subcategory: 'flow-cytometry',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '100-500 cells/μL',
        female: '100-500 cells/μL',
        children: '100-500 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: '< 50 cells/μL',
        high: '> 1000 cells/μL'
      },
      clinicalSignificance: 'Measures natural killer cells. Essential for immune function assessment.',
      interpretation: 'Low levels indicate immunodeficiency. High levels suggest immune activation.',
      causes: {
        increased: ['Viral infection', 'Immune activation', 'Autoimmune disease'],
        decreased: ['Immunodeficiency', 'Chemotherapy', 'Bone marrow failure']
      },
      relatedTests: ['CD4 Count', 'CD8 Count', 'Lymphocyte Subsets'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'b-cell-count',
      testName: 'B Cell Count',
      category: 'immunology',
      subcategory: 'flow-cytometry',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: '100-500 cells/μL',
        female: '100-500 cells/μL',
        children: '100-500 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: '< 50 cells/μL',
        high: '> 1000 cells/μL'
      },
      clinicalSignificance: 'Measures B lymphocytes. Essential for humoral immunity assessment.',
      interpretation: 'Low levels indicate humoral immunodeficiency. High levels suggest B cell malignancy.',
      causes: {
        increased: ['B cell malignancy', 'Chronic lymphocytic leukemia', 'Multiple myeloma'],
        decreased: ['Humoral immunodeficiency', 'Chemotherapy', 'Bone marrow failure']
      },
      relatedTests: ['CD4 Count', 'CD8 Count', 'Immunoglobulins'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: '1-2 days'
    },

    // Specialized Tests - Batch 6: Bone Marrow and Cytogenetics
    {
      id: 'bone-marrow-aspiration',
      testName: 'Bone Marrow Aspiration',
      category: 'hematology',
      subcategory: 'bone-marrow',
      specimen: 'Bone marrow aspirate',
      normalRange: {
        male: 'Normal cellularity and morphology',
        female: 'Normal cellularity and morphology',
        children: 'Normal cellularity and morphology',
        units: 'Normal'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Abnormal cellularity or morphology'
      },
      clinicalSignificance: 'Direct examination of bone marrow. Essential for hematologic disorder diagnosis.',
      interpretation: 'Abnormal findings indicate bone marrow disorder or infiltration.',
      causes: {
        increased: ['Leukemia', 'Myelodysplastic syndrome', 'Myeloproliferative disorder', 'Infection'],
        decreased: ['Aplastic anemia', 'Bone marrow failure', 'Chemotherapy effect']
      },
      relatedTests: ['Peripheral Blood Film', 'CBC', 'Cytogenetics'],
      preparation: 'Local anesthesia required',
      methodology: 'Microscopy and flow cytometry',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'bone-marrow-biopsy',
      testName: 'Bone Marrow Biopsy',
      category: 'hematology',
      subcategory: 'bone-marrow',
      specimen: 'Bone marrow core biopsy',
      normalRange: {
        male: 'Normal cellularity and architecture',
        female: 'Normal cellularity and architecture',
        children: 'Normal cellularity and architecture',
        units: 'Normal'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Abnormal cellularity or architecture'
      },
      clinicalSignificance: 'Histologic examination of bone marrow. Essential for hematologic disorder diagnosis.',
      interpretation: 'Abnormal findings indicate bone marrow disorder or infiltration.',
      causes: {
        increased: ['Leukemia', 'Myelodysplastic syndrome', 'Myeloproliferative disorder', 'Infection'],
        decreased: ['Aplastic anemia', 'Bone marrow failure', 'Fibrosis']
      },
      relatedTests: ['Bone Marrow Aspiration', 'CBC', 'Cytogenetics'],
      preparation: 'Local anesthesia required',
      methodology: 'Histology',
      turnaroundTime: '2-5 days'
    },

    {
      id: 'cytogenetics',
      testName: 'Cytogenetics (Karyotype)',
      category: 'molecular',
      subcategory: 'cytogenetics',
      specimen: 'Bone marrow or peripheral blood',
      normalRange: {
        male: '46,XY',
        female: '46,XX',
        children: '46,XY or 46,XX',
        units: 'Karyotype'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Abnormal karyotype'
      },
      clinicalSignificance: 'Chromosomal analysis. Essential for leukemia and genetic disorder diagnosis.',
      interpretation: 'Abnormal karyotype indicates genetic disorder or malignancy.',
      causes: {
        increased: ['Leukemia', 'Myelodysplastic syndrome', 'Genetic disorders'],
        decreased: ['Normal karyotype', 'No genetic abnormality']
      },
      relatedTests: ['Bone Marrow Biopsy', 'FISH', 'Molecular Tests'],
      preparation: 'Fasting not required',
      methodology: 'Chromosome analysis',
      turnaroundTime: '7-14 days'
    },

    {
      id: 'fish-analysis',
      testName: 'Fluorescence In Situ Hybridization (FISH)',
      category: 'molecular',
      subcategory: 'cytogenetics',
      specimen: 'Bone marrow or peripheral blood',
      normalRange: {
        male: 'Normal signal pattern',
        female: 'Normal signal pattern',
        children: 'Normal signal pattern',
        units: 'Normal'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Abnormal signal pattern'
      },
      clinicalSignificance: 'Molecular cytogenetic analysis. Essential for specific genetic abnormality detection.',
      interpretation: 'Abnormal signal pattern indicates specific genetic abnormality.',
      causes: {
        increased: ['Leukemia', 'Myelodysplastic syndrome', 'Genetic disorders'],
        decreased: ['Normal signal pattern', 'No genetic abnormality']
      },
      relatedTests: ['Cytogenetics', 'Molecular Tests', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'FISH',
      turnaroundTime: '3-7 days'
    },

    {
      id: 'bcr-abl-fish',
      testName: 'BCR-ABL FISH',
      category: 'molecular',
      subcategory: 'cytogenetics',
      specimen: 'Bone marrow or peripheral blood',
      normalRange: {
        male: '0%',
        female: '0%',
        children: '0%',
        units: '%'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 1%'
      },
      clinicalSignificance: 'Detects Philadelphia chromosome. Essential for CML diagnosis.',
      interpretation: 'Positive result indicates CML or Philadelphia chromosome.',
      causes: {
        increased: ['Chronic myeloid leukemia', 'CML relapse', 'Philadelphia chromosome'],
        decreased: ['No CML', 'Treatment response']
      },
      relatedTests: ['BCR-ABL PCR', 'Cytogenetics', 'CBC'],
      preparation: 'Fasting not required',
      methodology: 'FISH',
      turnaroundTime: '3-7 days'
    },

    // Specialized Tests - Batch 7: Advanced Immunology Tests
    {
      id: 'complement-c3',
      testName: 'Complement C3',
      category: 'immunology',
      subcategory: 'complement',
      specimen: 'Serum',
      normalRange: {
        male: '90-180 mg/dL',
        female: '90-180 mg/dL',
        children: '90-180 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 50 mg/dL',
        high: '> 300 mg/dL'
      },
      clinicalSignificance: 'Measures C3 complement protein. Essential for immune function assessment.',
      interpretation: 'Low levels indicate complement consumption. High levels suggest inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Autoimmune disease'],
        decreased: ['Complement consumption', 'Genetic deficiency', 'Liver disease']
      },
      relatedTests: ['Complement C4', 'CH50', 'Autoimmune Panel'],
      preparation: 'Fasting not required',
      methodology: 'Nephelometry',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'complement-c4',
      testName: 'Complement C4',
      category: 'immunology',
      subcategory: 'complement',
      specimen: 'Serum',
      normalRange: {
        male: '10-40 mg/dL',
        female: '10-40 mg/dL',
        children: '10-40 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 5 mg/dL',
        high: '> 80 mg/dL'
      },
      clinicalSignificance: 'Measures C4 complement protein. Essential for immune function assessment.',
      interpretation: 'Low levels indicate complement consumption. High levels suggest inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Autoimmune disease'],
        decreased: ['Complement consumption', 'Genetic deficiency', 'Liver disease']
      },
      relatedTests: ['Complement C3', 'CH50', 'Autoimmune Panel'],
      preparation: 'Fasting not required',
      methodology: 'Nephelometry',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'ch50',
      testName: 'CH50 (Total Hemolytic Complement)',
      category: 'immunology',
      subcategory: 'complement',
      specimen: 'Serum',
      normalRange: {
        male: '30-75 U/mL',
        female: '30-75 U/mL',
        children: '30-75 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: '< 15 U/mL',
        high: '> 100 U/mL'
      },
      clinicalSignificance: 'Measures total complement activity. Essential for immune function assessment.',
      interpretation: 'Low levels indicate complement deficiency. High levels suggest inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Autoimmune disease'],
        decreased: ['Complement deficiency', 'Complement consumption', 'Liver disease']
      },
      relatedTests: ['Complement C3', 'Complement C4', 'Autoimmune Panel'],
      preparation: 'Fasting not required',
      methodology: 'Hemolytic assay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'cryoglobulins',
      testName: 'Cryoglobulins',
      category: 'immunology',
      subcategory: 'autoimmune',
      specimen: 'Serum (warm collection)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detects cold-precipitating immunoglobulins. Essential for vasculitis diagnosis.',
      interpretation: 'Positive result suggests cryoglobulinemia or vasculitis.',
      causes: {
        increased: ['Cryoglobulinemia', 'Vasculitis', 'Hepatitis C', 'Multiple myeloma'],
        decreased: ['No cryoglobulinemia', 'Normal']
      },
      relatedTests: ['Autoimmune Panel', 'Hepatitis C', 'Protein Electrophoresis'],
      preparation: 'Warm collection required',
      methodology: 'Cryoprecipitation',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'anti-dsdna-advanced',
      testName: 'Anti-dsDNA Antibody',
      category: 'immunology',
      subcategory: 'autoimmune',
      specimen: 'Serum',
      normalRange: {
        male: '< 30 IU/mL',
        female: '< 30 IU/mL',
        children: '< 30 IU/mL',
        units: 'IU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 200 IU/mL'
      },
      clinicalSignificance: 'Detects anti-dsDNA antibodies. Essential for SLE diagnosis.',
      interpretation: 'High levels suggest systemic lupus erythematosus.',
      causes: {
        increased: ['Systemic lupus erythematosus', 'SLE flare', 'Autoimmune disease'],
        decreased: ['No SLE', 'SLE remission', 'Normal']
      },
      relatedTests: ['ANA', 'Anti-Sm', 'SLE Panel'],
      preparation: 'Fasting not required',
      methodology: 'ELISA',
      turnaroundTime: '1-2 days'
    },

    // Specialized Tests - Batch 8: Advanced Microbiology Tests
    {
      id: 'blood-culture-specialized',
      testName: 'Blood Culture',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Blood (aerobic and anaerobic bottles)',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'No growth'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive growth'
      },
      clinicalSignificance: 'Detects bloodstream infection. Essential for sepsis diagnosis.',
      interpretation: 'Positive result indicates bloodstream infection.',
      causes: {
        increased: ['Bacteremia', 'Fungemia', 'Sepsis', 'Endocarditis'],
        decreased: ['No bloodstream infection', 'Sterile blood']
      },
      relatedTests: ['Gram Stain', 'Antibiotic Susceptibility', 'CRP'],
      preparation: 'Sterile collection required',
      methodology: 'Automated culture system',
      turnaroundTime: '1-5 days'
    },

    {
      id: 'urine-culture-specialized',
      testName: 'Urine Culture',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Midstream urine',
      normalRange: {
        male: '< 10,000 CFU/mL',
        female: '< 10,000 CFU/mL',
        children: '< 10,000 CFU/mL',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 100,000 CFU/mL'
      },
      clinicalSignificance: 'Detects urinary tract infection. Essential for UTI diagnosis.',
      interpretation: 'High colony count suggests urinary tract infection.',
      causes: {
        increased: ['Urinary tract infection', 'Bacteriuria', 'Contamination'],
        decreased: ['No UTI', 'Sterile urine']
      },
      relatedTests: ['Urinalysis', 'Antibiotic Susceptibility', 'Urine Microscopy'],
      preparation: 'Clean catch collection',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'sputum-culture',
      testName: 'Sputum Culture',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Sputum',
      normalRange: {
        male: 'Normal flora',
        female: 'Normal flora',
        children: 'Normal flora',
        units: 'Normal flora'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Pathogenic organism'
      },
      clinicalSignificance: 'Detects respiratory infection. Essential for pneumonia diagnosis.',
      interpretation: 'Pathogenic organism suggests respiratory infection.',
      causes: {
        increased: ['Pneumonia', 'Bronchitis', 'Tuberculosis', 'Fungal infection'],
        decreased: ['No respiratory infection', 'Normal flora']
      },
      relatedTests: ['Gram Stain', 'AFB Culture', 'Antibiotic Susceptibility'],
      preparation: 'Deep cough specimen',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'afb-culture',
      testName: 'AFB Culture (Mycobacteria)',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Sputum, tissue, or body fluid',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'No growth'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive growth'
      },
      clinicalSignificance: 'Detects mycobacterial infection. Essential for TB diagnosis.',
      interpretation: 'Positive result indicates mycobacterial infection.',
      causes: {
        increased: ['Tuberculosis', 'Nontuberculous mycobacteria', 'Mycobacterial infection'],
        decreased: ['No mycobacterial infection', 'Sterile specimen']
      },
      relatedTests: ['AFB Smear', 'TB PCR', 'Chest X-ray'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Mycobacterial culture',
      turnaroundTime: '2-8 weeks'
    },

    {
      id: 'fungal-culture',
      testName: 'Fungal Culture',
      category: 'microbiology',
      subcategory: 'culture',
      specimen: 'Tissue, body fluid, or swab',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'No growth'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive growth'
      },
      clinicalSignificance: 'Detects fungal infection. Essential for fungal disease diagnosis.',
      interpretation: 'Positive result indicates fungal infection.',
      causes: {
        increased: ['Fungal infection', 'Candidiasis', 'Aspergillosis', 'Cryptococcosis'],
        decreased: ['No fungal infection', 'Sterile specimen']
      },
      relatedTests: ['Fungal Stain', 'Antifungal Susceptibility', 'Fungal PCR'],
      preparation: 'Appropriate specimen collection',
      methodology: 'Fungal culture',
      turnaroundTime: '1-4 weeks'
    },

    // Specialized Tests - Batch 9: Advanced Biochemistry Tests
    {
      id: 'osmolality-advanced',
      testName: 'Serum Osmolality',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '275-295 mOsm/kg',
        female: '275-295 mOsm/kg',
        children: '275-295 mOsm/kg',
        units: 'mOsm/kg'
      },
      criticalValues: {
        low: '< 250 mOsm/kg',
        high: '> 320 mOsm/kg'
      },
      clinicalSignificance: 'Measures serum osmolality. Essential for electrolyte disorder assessment.',
      interpretation: 'High levels suggest hyperosmolar state. Low levels suggest hyposmolar state.',
      causes: {
        increased: ['Dehydration', 'Hyperglycemia', 'Uremia', 'Alcohol intoxication'],
        decreased: ['Overhydration', 'SIADH', 'Hyponatremia']
      },
      relatedTests: ['Sodium', 'Glucose', 'BUN', 'Creatinine'],
      preparation: 'Fasting not required',
      methodology: 'Freezing point depression',
      turnaroundTime: 'Same day'
    },

    {
      id: 'urine-osmolality',
      testName: 'Urine Osmolality',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Urine',
      normalRange: {
        male: '300-900 mOsm/kg',
        female: '300-900 mOsm/kg',
        children: '300-900 mOsm/kg',
        units: 'mOsm/kg'
      },
      criticalValues: {
        low: '< 100 mOsm/kg',
        high: '> 1200 mOsm/kg'
      },
      clinicalSignificance: 'Measures urine concentrating ability. Essential for kidney function assessment.',
      interpretation: 'Low levels suggest impaired concentrating ability. High levels suggest normal function.',
      causes: {
        increased: ['Dehydration', 'Normal kidney function', 'SIADH'],
        decreased: ['Diabetes insipidus', 'Kidney disease', 'Overhydration']
      },
      relatedTests: ['Serum Osmolality', 'Urine Specific Gravity', 'Creatinine Clearance'],
      preparation: 'Random or timed collection',
      methodology: 'Freezing point depression',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anion-gap-advanced',
      testName: 'Anion Gap',
      category: 'biochemistry',
      subcategory: 'electrolytes',
      specimen: 'Serum',
      normalRange: {
        male: '8-16 mEq/L',
        female: '8-16 mEq/L',
        children: '8-16 mEq/L',
        units: 'mEq/L'
      },
      criticalValues: {
        low: '< 4 mEq/L',
        high: '> 20 mEq/L'
      },
      clinicalSignificance: 'Calculated measure of unmeasured anions. Essential for acid-base disorder assessment.',
      interpretation: 'High gap suggests metabolic acidosis. Low gap suggests metabolic alkalosis.',
      causes: {
        increased: ['Metabolic acidosis', 'Ketoacidosis', 'Lactic acidosis', 'Renal failure'],
        decreased: ['Metabolic alkalosis', 'Hypoalbuminemia', 'Multiple myeloma']
      },
      relatedTests: ['Sodium', 'Chloride', 'Bicarbonate', 'Albumin'],
      preparation: 'Fasting not required',
      methodology: 'Calculated',
      turnaroundTime: 'Same day'
    },

    {
      id: 'pyruvate',
      testName: 'Pyruvate',
      category: 'biochemistry',
      subcategory: 'metabolism',
      specimen: 'Whole blood',
      normalRange: {
        male: '0.03-0.10 mmol/L',
        female: '0.03-0.10 mmol/L',
        children: '0.03-0.10 mmol/L',
        units: 'mmol/L'
      },
      criticalValues: {
        low: '< 0.02 mmol/L',
        high: '> 0.20 mmol/L'
      },
      clinicalSignificance: 'Measures pyruvic acid. Essential for metabolic disorder assessment.',
      interpretation: 'High levels suggest metabolic disorder. Low levels suggest normal metabolism.',
      causes: {
        increased: ['Metabolic disorder', 'Mitochondrial disease', 'Thiamine deficiency'],
        decreased: ['Normal metabolism', 'Adequate thiamine']
      },
      relatedTests: ['Lactate', 'Lactate/Pyruvate Ratio', 'Thiamine'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: '1-2 days'
    },

    // Specialized Tests - Batch 10: Advanced Endocrinology Tests
    {
      id: 'aldosterone-advanced',
      testName: 'Aldosterone',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Serum',
      normalRange: {
        male: '3-35 ng/dL',
        female: '3-35 ng/dL',
        children: '3-35 ng/dL',
        units: 'ng/dL'
      },
      criticalValues: {
        low: '< 1 ng/dL',
        high: '> 100 ng/dL'
      },
      clinicalSignificance: 'Measures aldosterone hormone. Essential for hypertension and electrolyte assessment.',
      interpretation: 'High levels suggest primary aldosteronism. Low levels suggest adrenal insufficiency.',
      causes: {
        increased: ['Primary aldosteronism', 'Renal artery stenosis', 'Heart failure'],
        decreased: ['Adrenal insufficiency', 'Addison disease', 'Hypoaldosteronism']
      },
      relatedTests: ['Renin', 'Aldosterone/Renin Ratio', 'Sodium', 'Potassium'],
      preparation: 'Morning sample preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'renin',
      testName: 'Renin',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Plasma (EDTA)',
      normalRange: {
        male: '0.25-5.82 ng/mL/hr',
        female: '0.25-5.82 ng/mL/hr',
        children: '0.25-5.82 ng/mL/hr',
        units: 'ng/mL/hr'
      },
      criticalValues: {
        low: '< 0.1 ng/mL/hr',
        high: '> 20 ng/mL/hr'
      },
      clinicalSignificance: 'Measures renin activity. Essential for hypertension assessment.',
      interpretation: 'High levels suggest secondary hypertension. Low levels suggest primary aldosteronism.',
      causes: {
        increased: ['Renal artery stenosis', 'Heart failure', 'Cirrhosis', 'Nephrotic syndrome'],
        decreased: ['Primary aldosteronism', 'Volume overload', 'Beta blocker use']
      },
      relatedTests: ['Aldosterone', 'Aldosterone/Renin Ratio', 'Blood Pressure'],
      preparation: 'Morning sample preferred',
      methodology: 'Radioimmunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'aldosterone-renin-ratio',
      testName: 'Aldosterone/Renin Ratio',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Serum and plasma',
      normalRange: {
        male: '< 20',
        female: '< 20',
        children: '< 20',
        units: 'Ratio'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 30'
      },
      clinicalSignificance: 'Ratio of aldosterone to renin. Essential for primary aldosteronism screening.',
      interpretation: 'High ratio suggests primary aldosteronism.',
      causes: {
        increased: ['Primary aldosteronism', 'Conn syndrome', 'Adrenal adenoma'],
        decreased: ['Normal', 'Secondary hypertension', 'Adrenal insufficiency']
      },
      relatedTests: ['Aldosterone', 'Renin', 'Adrenal CT', 'Adrenal Venous Sampling'],
      preparation: 'Morning sample preferred',
      methodology: 'Calculated',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'metanephrines',
      testName: 'Plasma Metanephrines',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Plasma (EDTA)',
      normalRange: {
        male: '< 0.5 nmol/L',
        female: '< 0.5 nmol/L',
        children: '< 0.5 nmol/L',
        units: 'nmol/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 2.0 nmol/L'
      },
      clinicalSignificance: 'Measures catecholamine metabolites. Essential for pheochromocytoma diagnosis.',
      interpretation: 'High levels suggest pheochromocytoma.',
      causes: {
        increased: ['Pheochromocytoma', 'Paraganglioma', 'Stress', 'Exercise'],
        decreased: ['Normal', 'No pheochromocytoma']
      },
      relatedTests: ['24h Urine Catecholamines', 'Adrenal CT', 'MIBG Scan'],
      preparation: 'Supine rest for 30 minutes',
      methodology: 'LC-MS/MS',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'normetanephrines',
      testName: 'Plasma Normetanephrines',
      category: 'hormones',
      subcategory: 'adrenal',
      specimen: 'Plasma (EDTA)',
      normalRange: {
        male: '< 0.9 nmol/L',
        female: '< 0.9 nmol/L',
        children: '< 0.9 nmol/L',
        units: 'nmol/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 2.5 nmol/L'
      },
      clinicalSignificance: 'Measures norepinephrine metabolite. Essential for pheochromocytoma diagnosis.',
      interpretation: 'High levels suggest pheochromocytoma.',
      causes: {
        increased: ['Pheochromocytoma', 'Paraganglioma', 'Stress', 'Exercise'],
        decreased: ['Normal', 'No pheochromocytoma']
      },
      relatedTests: ['Plasma Metanephrines', '24h Urine Catecholamines', 'Adrenal CT'],
      preparation: 'Supine rest for 30 minutes',
      methodology: 'LC-MS/MS',
      turnaroundTime: '1-2 days'
    },



    // Additional Tumor Markers - Batch 2: Prostate and Urological Markers
    {
      id: 'psa-total',
      testName: 'Prostate-Specific Antigen (PSA) - Total',
      category: 'tumor-markers',
      subcategory: 'prostate',
      specimen: 'Serum',
      normalRange: {
        male: '< 4.0 ng/mL',
        female: 'Not applicable',
        children: 'Not applicable',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 ng/mL'
      },
      clinicalSignificance: 'Primary tumor marker for prostate cancer screening and monitoring.',
      interpretation: 'Elevated levels suggest prostate cancer, BPH, or prostatitis. Age-specific reference ranges apply.',
      causes: {
        increased: ['Prostate cancer', 'Benign prostatic hyperplasia', 'Prostatitis', 'Prostate biopsy', 'Digital rectal exam'],
        decreased: ['Normal', 'Successful treatment', 'Prostatectomy']
      },
      relatedTests: ['PSA Free', 'PSA Ratio', 'Digital Rectal Exam', 'Prostate Biopsy'],
      preparation: 'Fasting not required. Avoid ejaculation 48 hours before.',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'psa-free',
      testName: 'Prostate-Specific Antigen (PSA) - Free',
      category: 'tumor-markers',
      subcategory: 'prostate',
      specimen: 'Serum',
      normalRange: {
        male: '0.1-1.0 ng/mL',
        female: 'Not applicable',
        children: 'Not applicable',
        units: 'ng/mL'
      },
      criticalValues: {
        low: '< 0.1 ng/mL',
        high: '> 2.0 ng/mL'
      },
      clinicalSignificance: 'Free PSA fraction. Used with total PSA to calculate free/total PSA ratio.',
      interpretation: 'Lower free PSA percentage suggests higher risk of prostate cancer.',
      causes: {
        increased: ['Benign prostatic hyperplasia', 'Prostatitis', 'Normal prostate'],
        decreased: ['Prostate cancer', 'Prostate inflammation']
      },
      relatedTests: ['PSA Total', 'PSA Ratio', 'Digital Rectal Exam', 'Prostate Biopsy'],
      preparation: 'Fasting not required. Avoid ejaculation 48 hours before.',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'psa-ratio',
      testName: 'Free/Total PSA Ratio',
      category: 'tumor-markers',
      subcategory: 'prostate',
      specimen: 'Serum',
      normalRange: {
        male: '> 0.25 (25%)',
        female: 'Not applicable',
        children: 'Not applicable',
        units: 'Ratio'
      },
      criticalValues: {
        low: '< 0.10 (10%)',
        high: 'Normal'
      },
      clinicalSignificance: 'Ratio of free PSA to total PSA. Helps distinguish prostate cancer from benign conditions.',
      interpretation: 'Lower ratio suggests higher risk of prostate cancer. Higher ratio suggests benign conditions.',
      causes: {
        increased: ['Benign prostatic hyperplasia', 'Prostatitis', 'Normal prostate'],
        decreased: ['Prostate cancer', 'Prostate inflammation']
      },
      relatedTests: ['PSA Total', 'PSA Free', 'Digital Rectal Exam', 'Prostate Biopsy'],
      preparation: 'Fasting not required. Avoid ejaculation 48 hours before.',
      methodology: 'Calculated',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ca-27-29',
      testName: 'Cancer Antigen 27.29 (CA 27.29)',
      category: 'tumor-markers',
      subcategory: 'breast',
      specimen: 'Serum',
      normalRange: {
        male: '< 38 U/mL',
        female: '< 38 U/mL',
        children: '< 38 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 100 U/mL'
      },
      clinicalSignificance: 'Tumor marker for breast cancer. More specific than CA 15-3 for breast cancer monitoring.',
      interpretation: 'Elevated levels suggest breast cancer or recurrence. More specific than other breast cancer markers.',
      causes: {
        increased: ['Breast cancer', 'Breast cancer recurrence', 'Metastatic breast cancer'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CA-15-3', 'CEA', 'Mammography', 'Breast Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Tumor Markers - Batch 3: Lung and Thoracic Markers
    {
      id: 'cyfra-21-1',
      testName: 'Cytokeratin 19 Fragment (CYFRA 21-1)',
      category: 'tumor-markers',
      subcategory: 'lung',
      specimen: 'Serum',
      normalRange: {
        male: '< 3.3 ng/mL',
        female: '< 3.3 ng/mL',
        children: '< 3.3 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for non-small cell lung cancer. Used for monitoring treatment response.',
      interpretation: 'Elevated levels suggest non-small cell lung cancer or other epithelial malignancies.',
      causes: {
        increased: ['Non-small cell lung cancer', 'Squamous cell carcinoma', 'Adenocarcinoma', 'Other epithelial cancers'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['NSE', 'CEA', 'Chest X-ray', 'CT Scan', 'Lung Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'nse',
      testName: 'Neuron-Specific Enolase (NSE)',
      category: 'tumor-markers',
      subcategory: 'neuroendocrine',
      specimen: 'Serum',
      normalRange: {
        male: '< 16.3 ng/mL',
        female: '< 16.3 ng/mL',
        children: '< 16.3 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 50 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for small cell lung cancer and neuroendocrine tumors.',
      interpretation: 'Elevated levels suggest small cell lung cancer or neuroendocrine tumors.',
      causes: {
        increased: ['Small cell lung cancer', 'Neuroendocrine tumors', 'Medullary thyroid cancer', 'Pheochromocytoma'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CYFRA 21-1', 'CEA', 'Chest X-ray', 'CT Scan', 'Lung Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'scc',
      testName: 'Squamous Cell Carcinoma Antigen (SCC)',
      category: 'tumor-markers',
      subcategory: 'squamous',
      specimen: 'Serum',
      normalRange: {
        male: '< 1.5 ng/mL',
        female: '< 1.5 ng/mL',
        children: '< 1.5 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 5.0 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for squamous cell carcinomas of various organs.',
      interpretation: 'Elevated levels suggest squamous cell carcinoma of cervix, lung, head/neck, or esophagus.',
      causes: {
        increased: ['Cervical cancer', 'Lung cancer', 'Head/neck cancer', 'Esophageal cancer', 'Skin cancer'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CYFRA 21-1', 'CEA', 'Pap Smear', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ca-72-4',
      testName: 'Cancer Antigen 72-4 (CA 72-4)',
      category: 'tumor-markers',
      subcategory: 'gastric',
      specimen: 'Serum',
      normalRange: {
        male: '< 6.9 U/mL',
        female: '< 6.9 U/mL',
        children: '< 6.9 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 20 U/mL'
      },
      clinicalSignificance: 'Tumor marker for gastric cancer and ovarian cancer. Used for monitoring treatment response.',
      interpretation: 'Elevated levels may indicate gastric cancer, ovarian cancer, or other gastrointestinal malignancies.',
      causes: {
        increased: ['Gastric cancer', 'Ovarian cancer', 'Colorectal cancer', 'Pancreatic cancer', 'Liver cirrhosis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CEA', 'CA-19-9', 'CA-125', 'Endoscopy', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'ca-242',
      testName: 'Cancer Antigen 242 (CA 242)',
      category: 'tumor-markers',
      subcategory: 'pancreatic',
      specimen: 'Serum',
      normalRange: {
        male: '< 20 U/mL',
        female: '< 20 U/mL',
        children: '< 20 U/mL',
        units: 'U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 100 U/mL'
      },
      clinicalSignificance: 'Tumor marker for pancreatic cancer and colorectal cancer. More specific than CA 19-9.',
      interpretation: 'Elevated levels suggest pancreatic cancer or colorectal cancer. More specific than CA 19-9.',
      causes: {
        increased: ['Pancreatic cancer', 'Colorectal cancer', 'Gastric cancer', 'Liver cirrhosis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CA-19-9', 'CEA', 'Pancreatic CT', 'Colonoscopy', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Additional Tumor Markers - Batch 4: Advanced and Emerging Markers
    {
      id: 'dkk-1',
      testName: 'Dickkopf-1 (DKK-1)',
      category: 'tumor-markers',
      subcategory: 'hepatic',
      specimen: 'Serum',
      normalRange: {
        male: '< 2.0 ng/mL',
        female: '< 2.0 ng/mL',
        children: '< 2.0 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for hepatocellular carcinoma. Emerging marker with good specificity.',
      interpretation: 'Elevated levels suggest hepatocellular carcinoma. Good specificity for HCC.',
      causes: {
        increased: ['Hepatocellular carcinoma', 'Liver cirrhosis', 'Hepatitis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['AFP', 'CEA', 'Liver Function Tests', 'Liver CT', 'Liver Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'gpc3',
      testName: 'Glypican-3 (GPC3)',
      category: 'tumor-markers',
      subcategory: 'hepatic',
      specimen: 'Serum',
      normalRange: {
        male: '< 2.0 ng/mL',
        female: '< 2.0 ng/mL',
        children: '< 2.0 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10.0 ng/mL'
      },
      clinicalSignificance: 'Tumor marker for hepatocellular carcinoma. Emerging marker with good sensitivity.',
      interpretation: 'Elevated levels suggest hepatocellular carcinoma. Good sensitivity for HCC.',
      causes: {
        increased: ['Hepatocellular carcinoma', 'Liver cirrhosis', 'Hepatitis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['AFP', 'DKK-1', 'Liver Function Tests', 'Liver CT', 'Liver Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'afp-l3',
      testName: 'AFP-L3 Fraction',
      category: 'tumor-markers',
      subcategory: 'hepatic',
      specimen: 'Serum',
      normalRange: {
        male: '< 10% of total AFP',
        female: '< 10% of total AFP',
        children: '< 10% of total AFP',
        units: '%'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 35% of total AFP'
      },
      clinicalSignificance: 'Lens culinaris agglutinin-reactive fraction of AFP. More specific for hepatocellular carcinoma.',
      interpretation: 'High percentage suggests hepatocellular carcinoma. More specific than total AFP.',
      causes: {
        increased: ['Hepatocellular carcinoma', 'Liver cirrhosis', 'Hepatitis'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['AFP Total', 'DKK-1', 'GPC3', 'Liver Function Tests', 'Liver CT'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'tpa',
      testName: 'Tissue Polypeptide Antigen (TPA)',
      category: 'tumor-markers',
      subcategory: 'general',
      specimen: 'Serum',
      normalRange: {
        male: '< 85 U/L',
        female: '< 85 U/L',
        children: '< 85 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 200 U/L'
      },
      clinicalSignificance: 'General tumor marker for various epithelial cancers. Used for monitoring treatment response.',
      interpretation: 'Elevated levels suggest epithelial cancer. Non-specific marker.',
      causes: {
        increased: ['Various epithelial cancers', 'Lung cancer', 'Breast cancer', 'Colorectal cancer', 'Bladder cancer'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['CEA', 'CA-125', 'CA-19-9', 'Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'pro-grp',
      testName: 'Pro-Gastrin Releasing Peptide (Pro-GRP)',
      category: 'tumor-markers',
      subcategory: 'neuroendocrine',
      specimen: 'Serum',
      normalRange: {
        male: '< 81 pg/mL',
        female: '< 81 pg/mL',
        children: '< 81 pg/mL',
        units: 'pg/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 200 pg/mL'
      },
      clinicalSignificance: 'Tumor marker for small cell lung cancer and neuroendocrine tumors.',
      interpretation: 'Elevated levels suggest small cell lung cancer or neuroendocrine tumors.',
      causes: {
        increased: ['Small cell lung cancer', 'Neuroendocrine tumors', 'Medullary thyroid cancer'],
        decreased: ['Normal', 'Successful treatment']
      },
      relatedTests: ['NSE', 'CYFRA 21-1', 'Chest X-ray', 'CT Scan', 'Lung Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    // Screening Tests - Comprehensive Health Screening
    {
      id: 'comprehensive-screening',
      testName: 'Comprehensive Health Screening Panel',
      category: 'biochemistry',
      subcategory: 'screening-panel',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual tests',
        female: 'See individual tests',
        children: 'See individual tests',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual tests',
        high: 'See individual tests'
      },
      clinicalSignificance: 'Comprehensive screening for overall health status, metabolic disorders, and organ function.',
      interpretation: 'Combined assessment of multiple parameters provides comprehensive health overview.',
      causes: {
        increased: ['Metabolic syndrome', 'Diabetes', 'Liver disease', 'Kidney disease', 'Cardiovascular risk'],
        decreased: ['Good health', 'Proper nutrition', 'Regular exercise', 'Healthy lifestyle']
      },
      relatedTests: ['Lipid Panel', 'Liver Function Tests', 'Kidney Function Tests', 'Diabetes Screening', 'Thyroid Function'],
      preparation: '12-hour fasting required',
      methodology: 'Multiple automated analyzers',
      turnaroundTime: '1-2 days',
      isPopular: true
    },

    {
      id: 'diabetes-screening',
      testName: 'Diabetes Screening Panel',
      category: 'biochemistry',
      subcategory: 'screening-panel',
      specimen: 'Serum',
      normalRange: {
        male: 'Fasting: < 100 mg/dL, HbA1c: < 5.7%',
        female: 'Fasting: < 100 mg/dL, HbA1c: < 5.7%',
        children: 'Fasting: < 100 mg/dL, HbA1c: < 5.7%',
        units: 'mg/dL, %'
      },
      criticalValues: {
        low: 'Fasting: < 70 mg/dL',
        high: 'Fasting: > 126 mg/dL, HbA1c: > 6.5%'
      },
      clinicalSignificance: 'Screening for diabetes and prediabetes. Essential for early detection and prevention.',
      interpretation: 'Elevated fasting glucose or HbA1c indicates diabetes risk or diabetes.',
      causes: {
        increased: ['Type 2 diabetes', 'Prediabetes', 'Metabolic syndrome', 'Obesity', 'Family history'],
        decreased: ['Good glycemic control', 'Healthy diet', 'Regular exercise', 'Weight management']
      },
      relatedTests: ['Fasting Glucose', 'HbA1c', 'Oral Glucose Tolerance Test', 'Insulin', 'C-Peptide'],
      preparation: '12-hour fasting required',
      methodology: 'Enzymatic/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cardiovascular-screening',
      testName: 'Cardiovascular Risk Screening',
      category: 'cardiac',
      subcategory: 'risk-assessment',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual tests',
        female: 'See individual tests',
        children: 'See individual tests',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual tests',
        high: 'See individual tests'
      },
      clinicalSignificance: 'Assessment of cardiovascular risk factors and heart health status.',
      interpretation: 'Combined evaluation of lipids, inflammation markers, and cardiac enzymes.',
      causes: {
        increased: ['High cholesterol', 'Inflammation', 'Metabolic syndrome', 'Atherosclerosis', 'Heart disease'],
        decreased: ['Healthy lifestyle', 'Good diet', 'Regular exercise', 'Low risk factors']
      },
      relatedTests: ['Lipid Panel', 'CRP', 'Troponin', 'BNP', 'Homocysteine'],
      preparation: '12-hour fasting required',
      methodology: 'Multiple automated analyzers',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'thyroid-screening',
      testName: 'Thyroid Function Screening',
      category: 'hormones',
      subcategory: 'thyroid-function',
      specimen: 'Serum',
      normalRange: {
        male: 'TSH: 0.4-4.0 mIU/L, T4: 5.0-12.0 μg/dL',
        female: 'TSH: 0.4-4.0 mIU/L, T4: 5.0-12.0 μg/dL',
        children: 'TSH: 0.7-6.4 mIU/L, T4: 6.0-14.0 μg/dL',
        units: 'mIU/L, μg/dL'
      },
      criticalValues: {
        low: 'TSH: < 0.1 mIU/L',
        high: 'TSH: > 10 mIU/L'
      },
      clinicalSignificance: 'Screening for thyroid disorders including hypothyroidism and hyperthyroidism.',
      interpretation: 'High TSH indicates hypothyroidism, low TSH suggests hyperthyroidism.',
      causes: {
        increased: ['Hypothyroidism', 'Hashimoto thyroiditis', 'Iodine deficiency', 'Thyroid surgery'],
        decreased: ['Hyperthyroidism', 'Graves disease', 'Thyroid nodules', 'Thyroiditis']
      },
      relatedTests: ['TSH', 'Free T4', 'Free T3', 'Thyroid Antibodies', 'Thyroid Ultrasound'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'liver-screening',
      testName: 'Liver Function Screening',
      category: 'biochemistry',
      subcategory: 'liver-function',
      specimen: 'Serum',
      normalRange: {
        male: 'ALT: 7-55 U/L, AST: 8-48 U/L, ALP: 44-147 U/L',
        female: 'ALT: 7-55 U/L, AST: 8-48 U/L, ALP: 44-147 U/L',
        children: 'ALT: 7-55 U/L, AST: 8-48 U/L, ALP: 44-147 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: 'Normal',
        high: 'ALT/AST: > 1000 U/L'
      },
      clinicalSignificance: 'Assessment of liver health and detection of liver disease or damage.',
      interpretation: 'Elevated enzymes indicate liver damage or disease.',
      causes: {
        increased: ['Viral hepatitis', 'Alcoholic liver disease', 'NAFLD', 'Drug toxicity', 'Liver cancer'],
        decreased: ['Normal liver function', 'Healthy lifestyle', 'Proper nutrition']
      },
      relatedTests: ['ALT', 'AST', 'ALP', 'Bilirubin', 'Albumin', 'Liver Ultrasound'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: 'Same day'
    },

    {
      id: 'kidney-screening',
      testName: 'Kidney Function Screening',
      category: 'biochemistry',
      subcategory: 'kidney-function',
      specimen: 'Serum',
      normalRange: {
        male: 'Creatinine: 0.7-1.3 mg/dL, eGFR: > 90 mL/min/1.73m²',
        female: 'Creatinine: 0.6-1.1 mg/dL, eGFR: > 90 mL/min/1.73m²',
        children: 'Age-dependent',
        units: 'mg/dL, mL/min/1.73m²'
      },
      criticalValues: {
        low: 'eGFR: < 15 mL/min/1.73m²',
        high: 'Creatinine: > 5.0 mg/dL'
      },
      clinicalSignificance: 'Assessment of kidney function and detection of kidney disease.',
      interpretation: 'Elevated creatinine and low eGFR indicate kidney dysfunction.',
      causes: {
        increased: ['Chronic kidney disease', 'Acute kidney injury', 'Diabetes', 'Hypertension', 'Glomerulonephritis'],
        decreased: ['Normal kidney function', 'Good hydration', 'Healthy diet']
      },
      relatedTests: ['Creatinine', 'eGFR', 'BUN', 'Cystatin C', 'Urinalysis'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic/Jaffe',
      turnaroundTime: 'Same day'
    },

    {
      id: 'anemia-screening',
      testName: 'Anemia Screening Panel',
      category: 'hematology',
      subcategory: 'anemia-workup',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Hemoglobin: 13.5-17.5 g/dL, Iron: 60-170 μg/dL',
        female: 'Hemoglobin: 12.0-15.5 g/dL, Iron: 60-170 μg/dL',
        children: 'Age-dependent',
        units: 'g/dL, μg/dL'
      },
      criticalValues: {
        low: 'Hemoglobin: < 7.0 g/dL',
        high: 'Iron: > 200 μg/dL'
      },
      clinicalSignificance: 'Comprehensive evaluation for anemia and iron deficiency.',
      interpretation: 'Low hemoglobin with low iron suggests iron deficiency anemia.',
      causes: {
        increased: ['Iron overload', 'Hemochromatosis', 'Blood transfusions', 'Liver disease'],
        decreased: ['Iron deficiency', 'Blood loss', 'Poor nutrition', 'Chronic disease', 'Pregnancy']
      },
      relatedTests: ['CBC', 'Iron Studies', 'Vitamin B12', 'Folate', 'Reticulocyte Count'],
      preparation: 'Fasting not required',
      methodology: 'Automated hematology analyzer/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'vitamin-screening',
      testName: 'Vitamin and Mineral Screening',
      category: 'biochemistry',
      subcategory: 'nutritional-assessment',
      specimen: 'Serum',
      normalRange: {
        male: 'Vitamin D: 30-100 ng/mL, B12: 200-900 pg/mL',
        female: 'Vitamin D: 30-100 ng/mL, B12: 200-900 pg/mL',
        children: 'Age-dependent',
        units: 'ng/mL, pg/mL'
      },
      criticalValues: {
        low: 'Vitamin D: < 20 ng/mL, B12: < 200 pg/mL',
        high: 'Vitamin D: > 100 ng/mL, B12: > 900 pg/mL'
      },
      clinicalSignificance: 'Assessment of vitamin and mineral status for nutritional health.',
      interpretation: 'Low levels indicate deficiency, high levels may indicate toxicity.',
      causes: {
        increased: ['Supplementation', 'Sun exposure (Vitamin D)', 'Dietary intake', 'Malabsorption'],
        decreased: ['Poor diet', 'Malabsorption', 'Limited sun exposure', 'Vegan diet', 'Aging']
      },
      relatedTests: ['Vitamin D', 'Vitamin B12', 'Folate', 'Iron', 'Zinc'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'inflammation-screening',
      testName: 'Inflammation and Autoimmune Screening',
      category: 'immunology',
      subcategory: 'inflammation-markers',
      specimen: 'Serum',
      normalRange: {
        male: 'CRP: < 3.0 mg/L, ESR: < 15 mm/hr',
        female: 'CRP: < 3.0 mg/L, ESR: < 20 mm/hr',
        children: 'Age-dependent',
        units: 'mg/L, mm/hr'
      },
      criticalValues: {
        low: 'Normal',
        high: 'CRP: > 10 mg/L, ESR: > 50 mm/hr'
      },
      clinicalSignificance: 'Detection of inflammation and autoimmune conditions.',
      interpretation: 'Elevated markers indicate inflammation or autoimmune disease.',
      causes: {
        increased: ['Infection', 'Autoimmune disease', 'Inflammation', 'Cancer', 'Tissue injury'],
        decreased: ['Normal health', 'Anti-inflammatory treatment', 'Disease remission']
      },
      relatedTests: ['CRP', 'ESR', 'ANA', 'Rheumatoid Factor', 'Anti-CCP'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay/Westergren',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cancer-screening',
      testName: 'Cancer Screening Markers',
      category: 'tumor-markers',
      subcategory: 'screening-markers',
      specimen: 'Serum',
      normalRange: {
        male: 'PSA: < 4.0 ng/mL, CEA: < 3.0 ng/mL',
        female: 'CEA: < 3.0 ng/mL, CA-125: < 35 U/mL',
        children: 'Not applicable',
        units: 'ng/mL, U/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: 'PSA: > 10 ng/mL, CEA: > 10 ng/mL'
      },
      clinicalSignificance: 'Screening for common cancers including prostate, colorectal, and ovarian.',
      interpretation: 'Elevated markers may indicate cancer risk or presence.',
      causes: {
        increased: ['Cancer', 'Benign conditions', 'Inflammation', 'Infection', 'Smoking'],
        decreased: ['Normal health', 'Successful treatment', 'Cancer remission']
      },
      relatedTests: ['PSA', 'CEA', 'CA-125', 'AFP', 'CA 19-9'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'infectious-screening',
      testName: 'Infectious Disease Screening',
      category: 'microbiology',
      subcategory: 'screening-tests',
      specimen: 'Serum',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Screening for common infectious diseases including HIV, hepatitis, and syphilis.',
      interpretation: 'Positive results require confirmatory testing.',
      causes: {
        increased: ['HIV infection', 'Hepatitis B/C', 'Syphilis', 'Other STIs', 'Vaccination'],
        decreased: ['No infection', 'Successful treatment', 'False positive']
      },
      relatedTests: ['HIV Antibody', 'Hepatitis B Surface Antigen', 'Hepatitis C Antibody', 'Syphilis RPR'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'hormone-screening',
      testName: 'Hormone Balance Screening',
      category: 'hormones',
      subcategory: 'hormone-panel',
      specimen: 'Serum',
      normalRange: {
        male: 'Testosterone: 300-1000 ng/dL, Estradiol: 10-50 pg/mL',
        female: 'Estradiol: 12.5-166 pg/mL, Progesterone: 0.1-0.8 ng/mL',
        children: 'Age-dependent',
        units: 'ng/dL, pg/mL, ng/mL'
      },
      criticalValues: {
        low: 'Testosterone: < 200 ng/dL',
        high: 'Estradiol: > 200 pg/mL'
      },
      clinicalSignificance: 'Assessment of hormone balance and endocrine function.',
      interpretation: 'Imbalanced hormones may indicate endocrine disorders.',
      causes: {
        increased: ['Hormone therapy', 'Endocrine tumors', 'Obesity', 'Stress', 'Medications'],
        decreased: ['Aging', 'Endocrine disorders', 'Poor nutrition', 'Stress', 'Medications']
      },
      relatedTests: ['Testosterone', 'Estradiol', 'Progesterone', 'FSH', 'LH'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'bone-screening',
      testName: 'Bone Health Screening',
      category: 'biochemistry',
      subcategory: 'bone-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: 'Calcium: 8.5-10.5 mg/dL, Vitamin D: 30-100 ng/mL',
        female: 'Calcium: 8.5-10.5 mg/dL, Vitamin D: 30-100 ng/mL',
        children: 'Age-dependent',
        units: 'mg/dL, ng/mL'
      },
      criticalValues: {
        low: 'Calcium: < 7.0 mg/dL',
        high: 'Calcium: > 12.0 mg/dL'
      },
      clinicalSignificance: 'Assessment of bone health and calcium metabolism.',
      interpretation: 'Low calcium and vitamin D may indicate osteoporosis risk.',
      causes: {
        increased: ['Hyperparathyroidism', 'Cancer', 'Vitamin D toxicity', 'Immobilization'],
        decreased: ['Osteoporosis', 'Vitamin D deficiency', 'Poor nutrition', 'Aging', 'Menopause']
      },
      relatedTests: ['Calcium', 'Vitamin D', 'PTH', 'Alkaline Phosphatase', 'Bone Density'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic/Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'metabolic-screening',
      testName: 'Metabolic Syndrome Screening',
      category: 'biochemistry',
      subcategory: 'metabolic-panel',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual tests',
        female: 'See individual tests',
        children: 'See individual tests',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual tests',
        high: 'See individual tests'
      },
      clinicalSignificance: 'Assessment of metabolic syndrome components and cardiovascular risk.',
      interpretation: 'Multiple abnormal results indicate metabolic syndrome.',
      causes: {
        increased: ['Obesity', 'Poor diet', 'Sedentary lifestyle', 'Insulin resistance', 'Genetics'],
        decreased: ['Healthy lifestyle', 'Weight loss', 'Exercise', 'Good nutrition']
      },
      relatedTests: ['Glucose', 'Lipid Panel', 'Blood Pressure', 'Waist Circumference', 'Insulin'],
      preparation: '12-hour fasting required',
      methodology: 'Multiple automated analyzers',
      turnaroundTime: '1-2 days'
    },

    // Additional Specialized Tests - Advanced Diagnostics
    {
      id: 'cardiac-enzymes',
      testName: 'Cardiac Enzymes Panel',
      category: 'cardiac',
      subcategory: 'cardiac-markers',
      specimen: 'Serum',
      normalRange: {
        male: 'Troponin I: < 0.04 ng/mL, CK-MB: < 5.0 ng/mL',
        female: 'Troponin I: < 0.04 ng/mL, CK-MB: < 5.0 ng/mL',
        children: 'Age-dependent',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Troponin I: > 0.5 ng/mL'
      },
      clinicalSignificance: 'Diagnosis and monitoring of myocardial infarction and cardiac damage.',
      interpretation: 'Elevated troponin indicates cardiac muscle damage or infarction.',
      causes: {
        increased: ['Myocardial infarction', 'Cardiac surgery', 'Heart failure', 'Myocarditis', 'Cardiac trauma'],
        decreased: ['Normal cardiac function', 'Successful treatment', 'No cardiac damage']
      },
      relatedTests: ['Troponin I', 'CK-MB', 'BNP', 'ECG', 'Echocardiogram'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 hours',
      isPopular: true
    },

    {
      id: 'lipid-advanced',
      testName: 'Advanced Lipid Panel',
      category: 'biochemistry',
      subcategory: 'lipid-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: 'LDL-P: < 1000 nmol/L, ApoB: < 100 mg/dL',
        female: 'LDL-P: < 1000 nmol/L, ApoB: < 100 mg/dL',
        children: 'Age-dependent',
        units: 'nmol/L, mg/dL'
      },
      criticalValues: {
        low: 'Normal',
        high: 'LDL-P: > 1500 nmol/L, ApoB: > 120 mg/dL'
      },
      clinicalSignificance: 'Advanced assessment of cardiovascular risk with particle number and apolipoprotein analysis.',
      interpretation: 'High LDL-P and ApoB indicate increased cardiovascular risk regardless of LDL-C levels.',
      causes: {
        increased: ['Metabolic syndrome', 'Diabetes', 'Obesity', 'Genetic disorders', 'Poor diet'],
        decreased: ['Healthy lifestyle', 'Medication', 'Weight loss', 'Exercise']
      },
      relatedTests: ['LDL-P', 'ApoB', 'ApoA1', 'Lp(a)', 'Standard Lipid Panel'],
      preparation: '12-hour fasting required',
      methodology: 'NMR Spectroscopy/Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'diabetes-advanced',
      testName: 'Advanced Diabetes Assessment',
      category: 'biochemistry',
      subcategory: 'diabetes-management',
      specimen: 'Serum',
      normalRange: {
        male: 'Insulin: 3-25 μIU/mL, C-Peptide: 0.8-3.1 ng/mL',
        female: 'Insulin: 3-25 μIU/mL, C-Peptide: 0.8-3.1 ng/mL',
        children: 'Age-dependent',
        units: 'μIU/mL, ng/mL'
      },
      criticalValues: {
        low: 'Insulin: < 2 μIU/mL',
        high: 'Insulin: > 50 μIU/mL'
      },
      clinicalSignificance: 'Comprehensive diabetes assessment including insulin resistance and beta-cell function.',
      interpretation: 'High insulin with normal glucose suggests insulin resistance. Low C-peptide indicates beta-cell failure.',
      causes: {
        increased: ['Insulin resistance', 'Type 2 diabetes', 'Obesity', 'Metabolic syndrome', 'Insulinoma'],
        decreased: ['Type 1 diabetes', 'Beta-cell failure', 'Pancreatic disease', 'Insulin therapy']
      },
      relatedTests: ['Insulin', 'C-Peptide', 'Glucose', 'HbA1c', 'HOMA-IR'],
      preparation: '12-hour fasting required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'thyroid-advanced',
      testName: 'Advanced Thyroid Function',
      category: 'hormones',
      subcategory: 'thyroid-comprehensive',
      specimen: 'Serum',
      normalRange: {
        male: 'Free T3: 2.3-4.2 pg/mL, Reverse T3: 8-25 ng/dL',
        female: 'Free T3: 2.3-4.2 pg/mL, Reverse T3: 8-25 ng/dL',
        children: 'Age-dependent',
        units: 'pg/mL, ng/dL'
      },
      criticalValues: {
        low: 'Free T3: < 1.5 pg/mL',
        high: 'Free T3: > 6.0 pg/mL'
      },
      clinicalSignificance: 'Comprehensive thyroid assessment including T3 metabolism and conversion.',
      interpretation: 'Low T3 with high reverse T3 suggests impaired T4 to T3 conversion.',
      causes: {
        increased: ['Hyperthyroidism', 'T3 toxicosis', 'Thyroid hormone resistance', 'T3 therapy'],
        decreased: ['Hypothyroidism', 'Sick euthyroid syndrome', 'Malnutrition', 'Chronic illness']
      },
      relatedTests: ['Free T3', 'Reverse T3', 'TSH', 'Free T4', 'Thyroid Antibodies'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'adrenal-function',
      testName: 'Adrenal Function Panel',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: 'Serum',
      normalRange: {
        male: 'Cortisol AM: 6.2-19.4 μg/dL, ACTH: 7.2-63.3 pg/mL',
        female: 'Cortisol AM: 6.2-19.4 μg/dL, ACTH: 7.2-63.3 pg/mL',
        children: 'Age-dependent',
        units: 'μg/dL, pg/mL'
      },
      criticalValues: {
        low: 'Cortisol: < 3 μg/dL',
        high: 'Cortisol: > 25 μg/dL'
      },
      clinicalSignificance: 'Assessment of adrenal gland function and cortisol production.',
      interpretation: 'Low cortisol with high ACTH suggests primary adrenal insufficiency.',
      causes: {
        increased: ['Cushing syndrome', 'Stress', 'Obesity', 'Depression', 'Medications'],
        decreased: ['Addison disease', 'Adrenal insufficiency', 'Pituitary disease', 'Chronic illness']
      },
      relatedTests: ['Cortisol', 'ACTH', 'DHEA-S', 'Aldosterone', 'Renin'],
      preparation: 'Fasting not required, AM collection preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'reproductive-hormones',
      testName: 'Reproductive Hormone Panel',
      category: 'hormones',
      subcategory: 'reproductive-function',
      specimen: 'Serum',
      normalRange: {
        male: 'FSH: 1.5-12.4 mIU/mL, LH: 1.7-8.6 mIU/mL',
        female: 'FSH: 3.5-12.5 mIU/mL, LH: 2.4-12.6 mIU/mL',
        children: 'Age-dependent',
        units: 'mIU/mL'
      },
      criticalValues: {
        low: 'FSH/LH: < 1.0 mIU/mL',
        high: 'FSH: > 25 mIU/mL (female)'
      },
      clinicalSignificance: 'Assessment of reproductive function and fertility status.',
      interpretation: 'High FSH in females suggests ovarian failure. Low levels may indicate pituitary dysfunction.',
      causes: {
        increased: ['Menopause', 'Ovarian failure', 'Testicular failure', 'Pituitary disease', 'Aging'],
        decreased: ['Pregnancy', 'Pituitary dysfunction', 'Hypothalamic disease', 'Medications']
      },
      relatedTests: ['FSH', 'LH', 'Estradiol', 'Progesterone', 'Testosterone'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'coagulation-advanced',
      testName: 'Advanced Coagulation Panel',
      category: 'coagulation',
      subcategory: 'coagulation-comprehensive',
      specimen: 'Citrated Plasma',
      normalRange: {
        male: 'Factor VIII: 50-150%, Protein C: 70-140%',
        female: 'Factor VIII: 50-150%, Protein C: 70-140%',
        children: 'Age-dependent',
        units: '%'
      },
      criticalValues: {
        low: 'Factor VIII: < 30%',
        high: 'Factor VIII: > 200%'
      },
      clinicalSignificance: 'Comprehensive evaluation of coagulation factors and natural anticoagulants.',
      interpretation: 'Low factor VIII suggests hemophilia A. Low protein C increases thrombosis risk.',
      causes: {
        increased: ['Inflammation', 'Pregnancy', 'Oral contraceptives', 'Stress', 'Exercise'],
        decreased: ['Hemophilia', 'Liver disease', 'Vitamin K deficiency', 'Warfarin therapy']
      },
      relatedTests: ['Factor VIII', 'Protein C', 'Protein S', 'Antithrombin III', 'D-Dimer'],
      preparation: 'Fasting not required',
      methodology: 'Clotting assays',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'immunology-advanced',
      testName: 'Advanced Immunology Panel',
      category: 'immunology',
      subcategory: 'immune-function',
      specimen: 'Serum',
      normalRange: {
        male: 'IgG: 700-1600 mg/dL, IgA: 70-400 mg/dL',
        female: 'IgG: 700-1600 mg/dL, IgA: 70-400 mg/dL',
        children: 'Age-dependent',
        units: 'mg/dL'
      },
      criticalValues: {
        low: 'IgG: < 400 mg/dL',
        high: 'IgG: > 2000 mg/dL'
      },
      clinicalSignificance: 'Comprehensive assessment of immune function and immunoglobulin levels.',
      interpretation: 'Low immunoglobulins suggest immunodeficiency. High levels may indicate infection or autoimmune disease.',
      causes: {
        increased: ['Infection', 'Autoimmune disease', 'Multiple myeloma', 'Chronic inflammation', 'Liver disease'],
        decreased: ['Immunodeficiency', 'Protein loss', 'Malnutrition', 'Medications', 'Cancer']
      },
      relatedTests: ['IgG', 'IgA', 'IgM', 'IgE', 'Complement C3/C4'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'molecular-genetic',
      testName: 'Molecular Genetic Testing',
      category: 'molecular',
      subcategory: 'genetic-testing',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Detection of genetic mutations and inherited disorders.',
      interpretation: 'Positive results indicate presence of genetic mutation or variant.',
      causes: {
        increased: ['Genetic mutation', 'Inherited disorder', 'Family history', 'Consanguinity'],
        decreased: ['No genetic mutation', 'Normal genetic profile']
      },
      relatedTests: ['BRCA1/2', 'CFTR', 'HFE', 'APC', 'MLH1/MSH2'],
      preparation: 'Fasting not required',
      methodology: 'PCR/Sequencing',
      turnaroundTime: '2-4 weeks'
    },

    {
      id: 'microbiology-advanced',
      testName: 'Advanced Microbiology Panel',
      category: 'microbiology',
      subcategory: 'advanced-culture',
      specimen: 'Various',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'No growth'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive culture'
      },
      clinicalSignificance: 'Comprehensive microbiological testing for bacterial, fungal, and viral infections.',
      interpretation: 'Positive cultures indicate infection. Sensitivity testing guides antibiotic therapy.',
      causes: {
        increased: ['Bacterial infection', 'Fungal infection', 'Viral infection', 'Contamination', 'Colonization'],
        decreased: ['No infection', 'Successful treatment', 'Proper specimen collection']
      },
      relatedTests: ['Blood Culture', 'Urine Culture', 'Sputum Culture', 'Wound Culture', 'Antibiotic Sensitivity'],
      preparation: 'Proper specimen collection required',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '2-5 days'
    },

    {
      id: 'urinalysis-advanced',
      testName: 'Advanced Urinalysis',
      category: 'urinalysis',
      subcategory: 'urine-comprehensive',
      specimen: 'Midstream Urine',
      normalRange: {
        male: 'Protein: < 150 mg/24h, Microalbumin: < 30 mg/24h',
        female: 'Protein: < 150 mg/24h, Microalbumin: < 30 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Protein: > 3.5 g/24h'
      },
      clinicalSignificance: 'Comprehensive urine analysis for kidney disease and metabolic disorders.',
      interpretation: 'High protein suggests kidney disease. Microalbumin indicates early kidney damage.',
      causes: {
        increased: ['Kidney disease', 'Diabetes', 'Hypertension', 'Glomerulonephritis', 'Nephrotic syndrome'],
        decreased: ['Normal kidney function', 'Good hydration', 'Healthy diet']
      },
      relatedTests: ['24h Protein', 'Microalbumin', 'Creatinine Clearance', 'Urine Protein/Creatinine Ratio'],
      preparation: '24-hour collection required',
      methodology: 'Immunoassay/Colorimetric',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'tumor-markers-advanced',
      testName: 'Advanced Tumor Markers',
      category: 'tumor-markers',
      subcategory: 'advanced-markers',
      specimen: 'Serum',
      normalRange: {
        male: 'HE4: < 70 pmol/L, ROMA: < 11.4%',
        female: 'HE4: < 70 pmol/L, ROMA: < 11.4%',
        children: 'Not applicable',
        units: 'pmol/L, %'
      },
      criticalValues: {
        low: 'Normal',
        high: 'HE4: > 140 pmol/L'
      },
      clinicalSignificance: 'Advanced tumor markers for improved cancer detection and monitoring.',
      interpretation: 'Elevated markers may indicate cancer presence or recurrence.',
      causes: {
        increased: ['Ovarian cancer', 'Endometrial cancer', 'Lung cancer', 'Benign conditions', 'Inflammation'],
        decreased: ['Normal health', 'Successful treatment', 'Cancer remission']
      },
      relatedTests: ['HE4', 'ROMA Score', 'OVA1', 'CA-125', 'Risk of Malignancy Algorithm'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'hematology-advanced',
      testName: 'Advanced Hematology Panel',
      category: 'hematology',
      subcategory: 'advanced-hematology',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Reticulocytes: 0.5-2.5%, CD4: 500-1500 cells/μL',
        female: 'Reticulocytes: 0.5-2.5%, CD4: 500-1500 cells/μL',
        children: 'Age-dependent',
        units: '%, cells/μL'
      },
      criticalValues: {
        low: 'CD4: < 200 cells/μL',
        high: 'Reticulocytes: > 5%'
      },
      clinicalSignificance: 'Advanced hematological assessment including reticulocytes and lymphocyte subsets.',
      interpretation: 'High reticulocytes suggest increased erythropoiesis. Low CD4 indicates immune suppression.',
      causes: {
        increased: ['Anemia recovery', 'Hemolysis', 'Blood loss', 'Erythropoietin therapy', 'HIV infection'],
        decreased: ['Bone marrow failure', 'Aplastic anemia', 'HIV/AIDS', 'Chemotherapy', 'Radiation']
      },
      relatedTests: ['Reticulocyte Count', 'CD4 Count', 'CD8 Count', 'Flow Cytometry', 'Bone Marrow Biopsy'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry/Automated counting',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'biochemistry-advanced',
      testName: 'Advanced Biochemistry Panel',
      category: 'biochemistry',
      subcategory: 'advanced-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: 'Lactate: 0.5-2.2 mmol/L, Ammonia: 15-45 μmol/L',
        female: 'Lactate: 0.5-2.2 mmol/L, Ammonia: 15-45 μmol/L',
        children: 'Age-dependent',
        units: 'mmol/L, μmol/L'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Lactate: > 4.0 mmol/L, Ammonia: > 100 μmol/L'
      },
      clinicalSignificance: 'Advanced metabolic assessment including lactate and ammonia levels.',
      interpretation: 'High lactate suggests tissue hypoxia. High ammonia indicates liver dysfunction.',
      causes: {
        increased: ['Shock', 'Sepsis', 'Liver failure', 'Urea cycle disorders', 'Exercise'],
        decreased: ['Normal metabolism', 'Good oxygenation', 'Healthy liver function']
      },
      relatedTests: ['Lactate', 'Ammonia', 'Pyruvate', 'Ketones', 'Organic Acids'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic/Colorimetric',
      turnaroundTime: 'Same day'
    },

    {
      id: 'cardiac-stress',
      testName: 'Cardiac Stress Biomarkers',
      category: 'cardiac',
      subcategory: 'stress-testing',
      specimen: 'Serum',
      normalRange: {
        male: 'BNP: < 100 pg/mL, NT-proBNP: < 125 pg/mL',
        female: 'BNP: < 100 pg/mL, NT-proBNP: < 125 pg/mL',
        children: 'Age-dependent',
        units: 'pg/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: 'BNP: > 400 pg/mL, NT-proBNP: > 1000 pg/mL'
      },
      clinicalSignificance: 'Assessment of cardiac stress and heart failure markers.',
      interpretation: 'Elevated BNP suggests heart failure or cardiac stress.',
      causes: {
        increased: ['Heart failure', 'Cardiac stress', 'Pulmonary hypertension', 'Kidney disease', 'Exercise'],
        decreased: ['Normal cardiac function', 'Successful treatment', 'Good cardiac health']
      },
      relatedTests: ['BNP', 'NT-proBNP', 'Troponin', 'Echocardiogram', 'Stress Test'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 hours'
    },

    {
      id: 'endocrine-advanced',
      testName: 'Advanced Endocrine Panel',
      category: 'hormones',
      subcategory: 'endocrine-comprehensive',
      specimen: 'Serum',
      normalRange: {
        male: 'Growth Hormone: < 5 ng/mL, IGF-1: 100-300 ng/mL',
        female: 'Growth Hormone: < 5 ng/mL, IGF-1: 100-300 ng/mL',
        children: 'Age-dependent',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'IGF-1: < 50 ng/mL',
        high: 'Growth Hormone: > 20 ng/mL'
      },
      clinicalSignificance: 'Comprehensive endocrine assessment including growth hormone and IGF-1.',
      interpretation: 'High growth hormone with high IGF-1 suggests acromegaly.',
      causes: {
        increased: ['Acromegaly', 'Gigantism', 'Pituitary tumor', 'Stress', 'Exercise'],
        decreased: ['Growth hormone deficiency', 'Pituitary disease', 'Malnutrition', 'Aging']
      },
      relatedTests: ['Growth Hormone', 'IGF-1', 'Prolactin', 'ACTH', 'Pituitary MRI'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '1-2 days'
    },

    // Additional Comprehensive Tests - Specialized Diagnostics
    {
      id: 'allergy-testing',
      testName: 'Comprehensive Allergy Panel',
      category: 'immunology',
      subcategory: 'allergy-testing',
      specimen: 'Serum',
      normalRange: {
        male: 'Total IgE: < 100 kU/L, Specific IgE: < 0.35 kU/L',
        female: 'Total IgE: < 100 kU/L, Specific IgE: < 0.35 kU/L',
        children: 'Age-dependent',
        units: 'kU/L'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Total IgE: > 1000 kU/L'
      },
      clinicalSignificance: 'Comprehensive allergy assessment including food, environmental, and drug allergies.',
      interpretation: 'Elevated specific IgE indicates allergy to particular allergens.',
      causes: {
        increased: ['Allergic rhinitis', 'Food allergies', 'Atopic dermatitis', 'Asthma', 'Drug allergies'],
        decreased: ['No allergies', 'Successful immunotherapy', 'Avoidance of allergens']
      },
      relatedTests: ['Total IgE', 'Specific IgE', 'Skin Prick Test', 'Food Challenge', 'Eosinophil Count'],
      preparation: 'Fasting not required',
      methodology: 'ImmunoCAP/Immunoassay',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'autoimmune-comprehensive',
      testName: 'Comprehensive Autoimmune Panel',
      category: 'immunology',
      subcategory: 'autoimmune-comprehensive',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual tests',
        female: 'See individual tests',
        children: 'See individual tests',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual tests',
        high: 'See individual tests'
      },
      clinicalSignificance: 'Comprehensive autoimmune disease screening and monitoring.',
      interpretation: 'Multiple positive antibodies suggest autoimmune disease.',
      causes: {
        increased: ['SLE', 'Rheumatoid arthritis', 'Sjogren syndrome', 'Scleroderma', 'Vasculitis'],
        decreased: ['No autoimmune disease', 'Successful treatment', 'Disease remission']
      },
      relatedTests: ['ANA', 'Anti-dsDNA', 'Anti-Sm', 'Rheumatoid Factor', 'Anti-CCP'],
      preparation: 'Fasting not required',
      methodology: 'Immunofluorescence/Immunoassay',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'neurotransmitter-panel',
      testName: 'Neurotransmitter Assessment',
      category: 'biochemistry',
      subcategory: 'neurochemistry',
      specimen: 'Urine/Serum',
      normalRange: {
        male: 'Serotonin: 50-200 ng/mL, Dopamine: 20-100 ng/mL',
        female: 'Serotonin: 50-200 ng/mL, Dopamine: 20-100 ng/mL',
        children: 'Age-dependent',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Serotonin: < 30 ng/mL',
        high: 'Serotonin: > 300 ng/mL'
      },
      clinicalSignificance: 'Assessment of neurotransmitter levels for neurological and psychiatric disorders.',
      interpretation: 'Imbalanced neurotransmitters may indicate neurological or psychiatric conditions.',
      causes: {
        increased: ['Carcinoid syndrome', 'Medications', 'Stress', 'Dietary factors', 'Genetic factors'],
        decreased: ['Depression', 'Anxiety', 'Parkinson disease', 'Medications', 'Nutritional deficiency']
      },
      relatedTests: ['Serotonin', 'Dopamine', 'Norepinephrine', 'GABA', 'Glutamate'],
      preparation: '24-hour urine collection preferred',
      methodology: 'HPLC/LC-MS/MS',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'heavy-metal-testing',
      testName: 'Heavy Metal Toxicity Panel',
      category: 'biochemistry',
      subcategory: 'toxicology',
      specimen: 'Whole Blood/Urine',
      normalRange: {
        male: 'Lead: < 5 μg/dL, Mercury: < 3 μg/L, Arsenic: < 35 μg/L',
        female: 'Lead: < 5 μg/dL, Mercury: < 3 μg/L, Arsenic: < 35 μg/L',
        children: 'Lead: < 3.5 μg/dL',
        units: 'μg/dL, μg/L'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Lead: > 10 μg/dL, Mercury: > 10 μg/L'
      },
      clinicalSignificance: 'Assessment of heavy metal exposure and toxicity.',
      interpretation: 'Elevated levels indicate exposure and potential toxicity.',
      causes: {
        increased: ['Environmental exposure', 'Occupational exposure', 'Contaminated food/water', 'Traditional medicines'],
        decreased: ['No exposure', 'Chelation therapy', 'Environmental cleanup']
      },
      relatedTests: ['Lead', 'Mercury', 'Arsenic', 'Cadmium', 'Aluminum'],
      preparation: 'Fasting not required',
      methodology: 'ICP-MS/Atomic Absorption',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'drug-monitoring',
      testName: 'Therapeutic Drug Monitoring',
      category: 'biochemistry',
      subcategory: 'pharmacology',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual drugs',
        female: 'See individual drugs',
        children: 'See individual drugs',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'Subtherapeutic',
        high: 'Toxic'
      },
      clinicalSignificance: 'Monitoring drug levels to ensure therapeutic efficacy and prevent toxicity.',
      interpretation: 'Levels below therapeutic range may indicate poor response, above range may indicate toxicity.',
      causes: {
        increased: ['Overdose', 'Drug interactions', 'Liver disease', 'Kidney disease', 'Genetic factors'],
        decreased: ['Non-compliance', 'Drug interactions', 'Increased metabolism', 'Poor absorption']
      },
      relatedTests: ['Digoxin', 'Lithium', 'Phenytoin', 'Carbamazepine', 'Valproic Acid'],
      preparation: 'Trough levels preferred',
      methodology: 'Immunoassay/HPLC',
      turnaroundTime: 'Same day'
    },

    {
      id: 'pregnancy-testing',
      testName: 'Pregnancy and Fertility Panel',
      category: 'hormones',
      subcategory: 'pregnancy-fertility',
      specimen: 'Serum',
      normalRange: {
        male: 'Not applicable',
        female: 'hCG: < 5 mIU/mL, Progesterone: 0.1-0.8 ng/mL',
        children: 'Not applicable',
        units: 'mIU/mL, ng/mL'
      },
      criticalValues: {
        low: 'hCG: < 5 mIU/mL',
        high: 'hCG: > 100,000 mIU/mL'
      },
      clinicalSignificance: 'Pregnancy detection and fertility assessment.',
      interpretation: 'Elevated hCG indicates pregnancy. Progesterone levels indicate ovulation and pregnancy viability.',
      causes: {
        increased: ['Pregnancy', 'Gestational trophoblastic disease', 'Ovarian cancer', 'Testicular cancer'],
        decreased: ['No pregnancy', 'Miscarriage', 'Ectopic pregnancy', 'Infertility']
      },
      relatedTests: ['hCG', 'Progesterone', 'Estradiol', 'FSH', 'LH'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: 'Same day'
    },

    {
      id: 'pediatric-screening',
      testName: 'Pediatric Screening Panel',
      category: 'biochemistry',
      subcategory: 'pediatric-assessment',
      specimen: 'Serum',
      normalRange: {
        male: 'Age-dependent',
        female: 'Age-dependent',
        children: 'Age-dependent',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'Age-dependent',
        high: 'Age-dependent'
      },
      clinicalSignificance: 'Comprehensive pediatric health assessment and developmental screening.',
      interpretation: 'Age-appropriate ranges must be used for interpretation.',
      causes: {
        increased: ['Growth disorders', 'Metabolic disorders', 'Endocrine disorders', 'Genetic conditions'],
        decreased: ['Growth disorders', 'Nutritional deficiency', 'Chronic illness', 'Genetic conditions']
      },
      relatedTests: ['Growth Hormone', 'IGF-1', 'Thyroid Function', 'Iron Studies', 'Lead Level'],
      preparation: 'Fasting not required',
      methodology: 'Multiple automated analyzers',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'geriatric-assessment',
      testName: 'Geriatric Health Assessment',
      category: 'biochemistry',
      subcategory: 'geriatric-assessment',
      specimen: 'Serum',
      normalRange: {
        male: 'Age-adjusted',
        female: 'Age-adjusted',
        children: 'Not applicable',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'Age-adjusted',
        high: 'Age-adjusted'
      },
      clinicalSignificance: 'Comprehensive health assessment for elderly patients including frailty and cognitive markers.',
      interpretation: 'Age-adjusted reference ranges must be used for accurate interpretation.',
      causes: {
        increased: ['Aging', 'Chronic disease', 'Medications', 'Frailty', 'Cognitive decline'],
        decreased: ['Good health', 'Active lifestyle', 'Proper nutrition', 'Regular exercise']
      },
      relatedTests: ['Vitamin D', 'B12', 'Folate', 'Thyroid Function', 'Kidney Function'],
      preparation: 'Fasting not required',
      methodology: 'Multiple automated analyzers',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'sports-medicine',
      testName: 'Sports Medicine Panel',
      category: 'biochemistry',
      subcategory: 'sports-assessment',
      specimen: 'Serum',
      normalRange: {
        male: 'Testosterone: 300-1000 ng/dL, CK: 38-174 U/L',
        female: 'Testosterone: 15-70 ng/dL, CK: 26-140 U/L',
        children: 'Age-dependent',
        units: 'ng/dL, U/L'
      },
      criticalValues: {
        low: 'Testosterone: < 200 ng/dL (male)',
        high: 'CK: > 1000 U/L'
      },
      clinicalSignificance: 'Assessment of athletic performance, recovery, and hormonal balance.',
      interpretation: 'Elevated CK suggests muscle damage. Testosterone levels affect performance and recovery.',
      causes: {
        increased: ['Intense exercise', 'Muscle injury', 'Overtraining', 'Anabolic steroids', 'Supplements'],
        decreased: ['Overtraining', 'Poor nutrition', 'Inadequate recovery', 'Hormonal imbalance']
      },
      relatedTests: ['Testosterone', 'CK', 'Cortisol', 'IGF-1', 'Iron Studies'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay/Enzymatic',
      turnaroundTime: '1-2 days'
    },

    {
      id: 'nutritional-assessment',
      testName: 'Comprehensive Nutritional Assessment',
      category: 'biochemistry',
      subcategory: 'nutritional-evaluation',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual nutrients',
        female: 'See individual nutrients',
        children: 'See individual nutrients',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'Deficiency',
        high: 'Toxicity'
      },
      clinicalSignificance: 'Comprehensive assessment of nutritional status and deficiencies.',
      interpretation: 'Low levels indicate deficiency, high levels may indicate toxicity or supplementation.',
      causes: {
        increased: ['Supplementation', 'Dietary intake', 'Malabsorption', 'Genetic factors'],
        decreased: ['Poor diet', 'Malabsorption', 'Increased requirements', 'Chronic disease']
      },
      relatedTests: ['Vitamin A', 'Vitamin E', 'Vitamin K', 'Zinc', 'Copper', 'Selenium'],
      preparation: 'Fasting not required',
      methodology: 'HPLC/ICP-MS',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'metabolic-disorders',
      testName: 'Inborn Errors of Metabolism',
      category: 'biochemistry',
      subcategory: 'metabolic-disorders',
      specimen: 'Urine/Serum',
      normalRange: {
        male: 'See individual metabolites',
        female: 'See individual metabolites',
        children: 'See individual metabolites',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual metabolites',
        high: 'See individual metabolites'
      },
      clinicalSignificance: 'Detection of inherited metabolic disorders and enzyme deficiencies.',
      interpretation: 'Abnormal metabolite patterns suggest specific metabolic disorders.',
      causes: {
        increased: ['Enzyme deficiency', 'Genetic mutation', 'Metabolic block', 'Dietary factors'],
        decreased: ['Normal metabolism', 'Successful treatment', 'Dietary management']
      },
      relatedTests: ['Amino Acids', 'Organic Acids', 'Acylcarnitines', 'Galactose', 'Phenylalanine'],
      preparation: 'Fasting required for some tests',
      methodology: 'Tandem MS/HPLC',
      turnaroundTime: '1-2 weeks'
    },

    {
      id: 'cardiovascular-genetic',
      testName: 'Cardiovascular Genetic Testing',
      category: 'molecular',
      subcategory: 'cardiovascular-genetics',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Genetic testing for inherited cardiovascular conditions.',
      interpretation: 'Positive results indicate genetic predisposition to cardiovascular disease.',
      causes: {
        increased: ['Genetic mutation', 'Family history', 'Inherited condition', 'Consanguinity'],
        decreased: ['No genetic mutation', 'Normal genetic profile']
      },
      relatedTests: ['BRCA1/2', 'LDLR', 'APOB', 'PCSK9', 'Familial Hypercholesterolemia Panel'],
      preparation: 'Fasting not required',
      methodology: 'Next Generation Sequencing',
      turnaroundTime: '2-4 weeks'
    },

    {
      id: 'cancer-genetic',
      testName: 'Cancer Genetic Testing',
      category: 'molecular',
      subcategory: 'cancer-genetics',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Genetic testing for inherited cancer syndromes.',
      interpretation: 'Positive results indicate increased cancer risk and need for surveillance.',
      causes: {
        increased: ['Genetic mutation', 'Family history', 'Inherited cancer syndrome', 'Consanguinity'],
        decreased: ['No genetic mutation', 'Normal genetic profile']
      },
      relatedTests: ['BRCA1/2', 'TP53', 'APC', 'MLH1/MSH2', 'PTEN'],
      preparation: 'Fasting not required',
      methodology: 'Next Generation Sequencing',
      turnaroundTime: '2-4 weeks'
    },

    {
      id: 'pharmacogenetic',
      testName: 'Pharmacogenetic Testing',
      category: 'molecular',
      subcategory: 'pharmacogenetics',
      specimen: 'Whole Blood (EDTA)',
      normalRange: {
        male: 'See individual genes',
        female: 'See individual genes',
        children: 'See individual genes',
        units: 'Genotype'
      },
      criticalValues: {
        low: 'Normal metabolizer',
        high: 'Poor metabolizer'
      },
      clinicalSignificance: 'Genetic testing for drug metabolism and response prediction.',
      interpretation: 'Genotype determines drug metabolism capacity and dosing requirements.',
      causes: {
        increased: ['Genetic polymorphism', 'Family history', 'Ethnic background', 'Inherited variation'],
        decreased: ['Normal metabolism', 'Wild-type genotype']
      },
      relatedTests: ['CYP2D6', 'CYP2C19', 'CYP2C9', 'VKORC1', 'SLCO1B1'],
      preparation: 'Fasting not required',
      methodology: 'PCR/Sequencing',
      turnaroundTime: '1-2 weeks'
    },

    {
      id: 'infectious-molecular',
      testName: 'Molecular Infectious Disease Testing',
      category: 'molecular',
      subcategory: 'infectious-molecular',
      specimen: 'Various',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Molecular detection of infectious agents including viruses, bacteria, and parasites.',
      interpretation: 'Positive results indicate active infection with specific pathogen.',
      causes: {
        increased: ['Viral infection', 'Bacterial infection', 'Parasitic infection', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Proper specimen collection']
      },
      relatedTests: ['COVID-19 PCR', 'HIV Viral Load', 'HCV Genotype', 'CMV PCR', 'EBV PCR'],
      preparation: 'Proper specimen collection required',
      methodology: 'Real-time PCR/Sequencing',
      turnaroundTime: '1-3 days'
    },

    {
      id: 'liquid-biopsy',
      testName: 'Liquid Biopsy for Cancer',
      category: 'molecular',
      subcategory: 'liquid-biopsy',
      specimen: 'Plasma',
      normalRange: {
        male: 'Negative',
        female: 'Negative',
        children: 'Negative',
        units: 'Negative'
      },
      criticalValues: {
        low: 'Normal',
        high: 'Positive'
      },
      clinicalSignificance: 'Non-invasive cancer detection and monitoring using circulating tumor DNA.',
      interpretation: 'Positive results indicate presence of cancer or cancer recurrence.',
      causes: {
        increased: ['Cancer', 'Cancer recurrence', 'Metastasis', 'Treatment resistance'],
        decreased: ['No cancer', 'Successful treatment', 'Cancer remission']
      },
      relatedTests: ['ctDNA', 'Circulating Tumor Cells', 'Exosomes', 'Cell-free DNA'],
      preparation: 'Fasting not required',
      methodology: 'Next Generation Sequencing',
      turnaroundTime: '1-2 weeks'
    },

    {
      id: 'microbiome-testing',
      testName: 'Gut Microbiome Analysis',
      category: 'microbiology',
      subcategory: 'microbiome-analysis',
      specimen: 'Stool',
      normalRange: {
        male: 'See individual species',
        female: 'See individual species',
        children: 'See individual species',
        units: 'Relative abundance'
      },
      criticalValues: {
        low: 'Dysbiosis',
        high: 'Overgrowth'
      },
      clinicalSignificance: 'Assessment of gut microbiome composition and diversity.',
      interpretation: 'Dysbiosis may indicate gastrointestinal disorders or systemic disease.',
      causes: {
        increased: ['Dietary changes', 'Antibiotics', 'Probiotics', 'Disease states'],
        decreased: ['Antibiotics', 'Poor diet', 'Stress', 'Disease states']
      },
      relatedTests: ['16S rRNA Sequencing', 'Metagenomics', 'Short-chain Fatty Acids', 'Microbial Diversity'],
      preparation: 'Fresh stool sample required',
      methodology: 'Next Generation Sequencing',
      turnaroundTime: '2-3 weeks'
    },

    {
      id: 'exosome-analysis',
      testName: 'Exosome and Extracellular Vesicle Analysis',
      category: 'molecular',
      subcategory: 'exosome-analysis',
      specimen: 'Plasma/Urine',
      normalRange: {
        male: 'See individual markers',
        female: 'See individual markers',
        children: 'See individual markers',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual markers',
        high: 'See individual markers'
      },
      clinicalSignificance: 'Analysis of extracellular vesicles for disease biomarkers and cell communication.',
      interpretation: 'Altered exosome profiles may indicate disease states or cellular dysfunction.',
      causes: {
        increased: ['Cancer', 'Inflammation', 'Stress', 'Disease states', 'Cellular damage'],
        decreased: ['Normal health', 'Successful treatment', 'Cellular homeostasis']
      },
      relatedTests: ['Exosome Count', 'Protein Markers', 'RNA Analysis', 'Lipid Analysis'],
      preparation: 'Fasting not required',
      methodology: 'Flow Cytometry/Nanoparticle Tracking',
      turnaroundTime: '1-2 weeks'
    },

    // Specialized Chemistry Tests - Advanced Biochemical Analysis
    {
      id: 'amino-acid-profile',
      testName: 'Amino Acid Profile',
      category: 'biochemistry',
      subcategory: 'amino-acid-analysis',
      specimen: 'Serum/Plasma',
      normalRange: {
        male: 'See individual amino acids',
        female: 'See individual amino acids',
        children: 'See individual amino acids',
        units: 'μmol/L'
      },
      criticalValues: {
        low: 'See individual amino acids',
        high: 'See individual amino acids'
      },
      clinicalSignificance: 'Comprehensive analysis of amino acid levels for metabolic disorders and nutritional assessment.',
      interpretation: 'Abnormal patterns may indicate inborn errors of metabolism, nutritional deficiencies, or liver disease.',
      causes: {
        increased: ['Liver disease', 'Inborn errors of metabolism', 'Protein catabolism', 'Medications'],
        decreased: ['Protein malnutrition', 'Malabsorption', 'Liver disease', 'Increased requirements']
      },
      relatedTests: ['Essential Amino Acids', 'Branched Chain Amino Acids', 'Aromatic Amino Acids', 'Urea Cycle'],
      preparation: 'Fasting required',
      methodology: 'HPLC/LC-MS/MS',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'organic-acid-analysis',
      testName: 'Organic Acid Analysis',
      category: 'biochemistry',
      subcategory: 'organic-acid-analysis',
      specimen: 'Urine',
      normalRange: {
        male: 'See individual acids',
        female: 'See individual acids',
        children: 'See individual acids',
        units: 'mmol/mol creatinine'
      },
      criticalValues: {
        low: 'See individual acids',
        high: 'See individual acids'
      },
      clinicalSignificance: 'Detection of organic acidemias and metabolic disorders through urine analysis.',
      interpretation: 'Elevated organic acids suggest metabolic blocks or enzyme deficiencies.',
      causes: {
        increased: ['Inborn errors of metabolism', 'Organic acidemias', 'Vitamin deficiencies', 'Toxic exposure'],
        decreased: ['Normal metabolism', 'Successful treatment', 'Dietary management']
      },
      relatedTests: ['Methylmalonic Acid', 'Propionic Acid', 'Isovaleric Acid', 'Glutaric Acid'],
      preparation: 'Random urine collection',
      methodology: 'GC-MS',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'acylcarnitine-profile',
      testName: 'Acylcarnitine Profile',
      category: 'biochemistry',
      subcategory: 'fatty-acid-oxidation',
      specimen: 'Dried Blood Spot/Serum',
      normalRange: {
        male: 'See individual acylcarnitines',
        female: 'See individual acylcarnitines',
        children: 'See individual acylcarnitines',
        units: 'μmol/L'
      },
      criticalValues: {
        low: 'See individual acylcarnitines',
        high: 'See individual acylcarnitines'
      },
      clinicalSignificance: 'Assessment of fatty acid oxidation disorders and carnitine metabolism.',
      interpretation: 'Abnormal patterns indicate fatty acid oxidation defects or carnitine deficiency.',
      causes: {
        increased: ['Fatty acid oxidation disorders', 'Carnitine deficiency', 'Metabolic stress', 'Fasting'],
        decreased: ['Normal metabolism', 'Carnitine supplementation', 'Dietary management']
      },
      relatedTests: ['Free Carnitine', 'Total Carnitine', 'Carnitine Palmitoyltransferase', 'Fatty Acid Oxidation'],
      preparation: 'Fasting preferred',
      methodology: 'Tandem MS',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'bile-acid-profile',
      testName: 'Bile Acid Profile',
      category: 'biochemistry',
      subcategory: 'bile-acid-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: 'Total: 0.5-10 μmol/L',
        female: 'Total: 0.5-10 μmol/L',
        children: 'Age-dependent',
        units: 'μmol/L'
      },
      criticalValues: {
        low: 'Total: < 0.5 μmol/L',
        high: 'Total: > 20 μmol/L'
      },
      clinicalSignificance: 'Assessment of liver function and bile acid metabolism disorders.',
      interpretation: 'Elevated levels suggest cholestasis or liver disease. Low levels may indicate bile acid malabsorption.',
      causes: {
        increased: ['Cholestasis', 'Liver disease', 'Biliary obstruction', 'Pregnancy', 'Medications'],
        decreased: ['Bile acid malabsorption', 'Ileal resection', 'Crohn disease', 'Normal variation']
      },
      relatedTests: ['Total Bile Acids', 'Primary Bile Acids', 'Secondary Bile Acids', 'Liver Function Tests'],
      preparation: 'Fasting required',
      methodology: 'LC-MS/MS',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'steroid-hormone-profile',
      testName: 'Steroid Hormone Profile',
      category: 'biochemistry',
      subcategory: 'steroid-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'See individual steroids',
        female: 'See individual steroids',
        children: 'See individual steroids',
        units: 'ng/mL, μg/24h'
      },
      criticalValues: {
        low: 'See individual steroids',
        high: 'See individual steroids'
      },
      clinicalSignificance: 'Comprehensive analysis of steroid hormone metabolism and adrenal function.',
      interpretation: 'Abnormal patterns may indicate adrenal disorders, congenital adrenal hyperplasia, or steroid abuse.',
      causes: {
        increased: ['Adrenal tumors', 'Congenital adrenal hyperplasia', 'Steroid abuse', 'Stress'],
        decreased: ['Adrenal insufficiency', 'Hypopituitarism', 'Medications', 'Chronic illness']
      },
      relatedTests: ['Cortisol', 'DHEA-S', 'Testosterone', 'Estradiol', 'Progesterone'],
      preparation: '24-hour urine or fasting serum',
      methodology: 'LC-MS/MS',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'vitamin-d-metabolites',
      testName: 'Vitamin D Metabolites Profile',
      category: 'biochemistry',
      subcategory: 'vitamin-d-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: '25-OH-D: 30-100 ng/mL, 1,25-OH-D: 20-60 pg/mL',
        female: '25-OH-D: 30-100 ng/mL, 1,25-OH-D: 20-60 pg/mL',
        children: 'Age-dependent',
        units: 'ng/mL, pg/mL'
      },
      criticalValues: {
        low: '25-OH-D: < 20 ng/mL',
        high: '25-OH-D: > 100 ng/mL'
      },
      clinicalSignificance: 'Assessment of vitamin D status and metabolism including active and storage forms.',
      interpretation: 'Low 25-OH-D indicates deficiency. High 1,25-OH-D may indicate hyperparathyroidism.',
      causes: {
        increased: ['Vitamin D supplementation', 'Sun exposure', 'Hyperparathyroidism', 'Sarcoidosis'],
        decreased: ['Vitamin D deficiency', 'Malabsorption', 'Limited sun exposure', 'Liver disease']
      },
      relatedTests: ['25-OH-Vitamin D', '1,25-OH-Vitamin D', 'PTH', 'Calcium', 'Phosphorus'],
      preparation: 'Fasting not required',
      methodology: 'LC-MS/MS',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'fatty-acid-profile',
      testName: 'Fatty Acid Profile',
      category: 'biochemistry',
      subcategory: 'fatty-acid-analysis',
      specimen: 'Serum/Red Blood Cells',
      normalRange: {
        male: 'See individual fatty acids',
        female: 'See individual fatty acids',
        children: 'See individual fatty acids',
        units: '% of total fatty acids'
      },
      criticalValues: {
        low: 'See individual fatty acids',
        high: 'See individual fatty acids'
      },
      clinicalSignificance: 'Assessment of essential fatty acid status and omega-3/omega-6 balance.',
      interpretation: 'Imbalanced ratios may indicate cardiovascular risk, inflammation, or nutritional deficiency.',
      causes: {
        increased: ['Dietary intake', 'Supplementation', 'Metabolic disorders', 'Genetic factors'],
        decreased: ['Poor diet', 'Malabsorption', 'Increased requirements', 'Metabolic disorders']
      },
      relatedTests: ['Omega-3 Index', 'Omega-6/Omega-3 Ratio', 'Essential Fatty Acids', 'Trans Fatty Acids'],
      preparation: 'Fasting required',
      methodology: 'GC-MS',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'oxidative-stress-markers',
      testName: 'Oxidative Stress Markers',
      category: 'biochemistry',
      subcategory: 'oxidative-stress',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'See individual markers',
        female: 'See individual markers',
        children: 'See individual markers',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual markers',
        high: 'See individual markers'
      },
      clinicalSignificance: 'Assessment of oxidative stress and antioxidant capacity.',
      interpretation: 'Elevated markers indicate increased oxidative stress and potential tissue damage.',
      causes: {
        increased: ['Inflammation', 'Chronic disease', 'Environmental toxins', 'Poor nutrition', 'Aging'],
        decreased: ['Antioxidant supplementation', 'Healthy lifestyle', 'Good nutrition', 'Reduced stress']
      },
      relatedTests: ['MDA', '8-OHdG', 'Glutathione', 'Vitamin E', 'CoQ10'],
      preparation: 'Fasting required',
      methodology: 'HPLC/Colorimetric',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'methylation-profile',
      testName: 'Methylation Profile',
      category: 'biochemistry',
      subcategory: 'methylation-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'See individual markers',
        female: 'See individual markers',
        children: 'See individual markers',
        units: 'Multiple'
      },
      criticalValues: {
        low: 'See individual markers',
        high: 'See individual markers'
      },
      clinicalSignificance: 'Assessment of methylation capacity and one-carbon metabolism.',
      interpretation: 'Abnormal methylation may indicate genetic polymorphisms or nutritional deficiencies.',
      causes: {
        increased: ['Genetic polymorphisms', 'Nutritional deficiencies', 'Chronic disease', 'Aging'],
        decreased: ['B-vitamin supplementation', 'Healthy lifestyle', 'Good nutrition', 'Genetic factors']
      },
      relatedTests: ['Homocysteine', 'Methylmalonic Acid', 'Folate', 'B12', 'SAM/SAH Ratio'],
      preparation: 'Fasting required',
      methodology: 'LC-MS/MS',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'neurotransmitter-metabolites',
      testName: 'Neurotransmitter Metabolites',
      category: 'biochemistry',
      subcategory: 'neurotransmitter-metabolism',
      specimen: 'Urine',
      normalRange: {
        male: 'See individual metabolites',
        female: 'See individual metabolites',
        children: 'See individual metabolites',
        units: 'μg/g creatinine'
      },
      criticalValues: {
        low: 'See individual metabolites',
        high: 'See individual metabolites'
      },
      clinicalSignificance: 'Assessment of neurotransmitter metabolism and brain function.',
      interpretation: 'Abnormal patterns may indicate neurological or psychiatric disorders.',
      causes: {
        increased: ['Neurological disorders', 'Psychiatric conditions', 'Medications', 'Stress', 'Dietary factors'],
        decreased: ['Neurotransmitter deficiency', 'Metabolic disorders', 'Medications', 'Nutritional deficiency']
      },
      relatedTests: ['5-HIAA', 'VMA', 'HVA', 'DOPAC', 'MHPG'],
      preparation: '24-hour urine collection',
      methodology: 'HPLC/LC-MS/MS',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'ketone-body-profile',
      testName: 'Ketone Body Profile',
      category: 'biochemistry',
      subcategory: 'ketone-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'β-hydroxybutyrate: < 0.6 mmol/L',
        female: 'β-hydroxybutyrate: < 0.6 mmol/L',
        children: 'Age-dependent',
        units: 'mmol/L'
      },
      criticalValues: {
        low: 'Normal',
        high: 'β-hydroxybutyrate: > 3.0 mmol/L'
      },
      clinicalSignificance: 'Assessment of ketone body metabolism and energy utilization.',
      interpretation: 'Elevated ketones indicate increased fat metabolism, fasting, or diabetic ketoacidosis.',
      causes: {
        increased: ['Fasting', 'Ketogenic diet', 'Diabetes', 'Starvation', 'Exercise'],
        decreased: ['Normal feeding', 'High carbohydrate diet', 'Insulin therapy', 'Normal metabolism']
      },
      relatedTests: ['β-hydroxybutyrate', 'Acetoacetate', 'Acetone', 'Glucose', 'Insulin'],
      preparation: 'Fasting preferred',
      methodology: 'Enzymatic/GC',
      turnaroundTime: 'Same day'
    },

    {
      id: 'purine-metabolism',
      testName: 'Purine Metabolism Profile',
      category: 'biochemistry',
      subcategory: 'purine-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'Uric acid: 3.4-7.0 mg/dL',
        female: 'Uric acid: 2.4-6.0 mg/dL',
        children: 'Age-dependent',
        units: 'mg/dL'
      },
      criticalValues: {
        low: 'Uric acid: < 2.0 mg/dL',
        high: 'Uric acid: > 10.0 mg/dL'
      },
      clinicalSignificance: 'Assessment of purine metabolism and uric acid production.',
      interpretation: 'Elevated uric acid may indicate gout, kidney disease, or metabolic syndrome.',
      causes: {
        increased: ['Gout', 'Kidney disease', 'Metabolic syndrome', 'High purine diet', 'Medications'],
        decreased: ['Liver disease', 'Fanconi syndrome', 'Medications', 'Low purine diet']
      },
      relatedTests: ['Uric Acid', 'Xanthine', 'Hypoxanthine', 'Allopurinol Metabolites'],
      preparation: 'Fasting required',
      methodology: 'Enzymatic/HPLC',
      turnaroundTime: 'Same day'
    },

    {
      id: 'porphyrin-profile',
      testName: 'Porphyrin Profile',
      category: 'biochemistry',
      subcategory: 'porphyrin-metabolism',
      specimen: 'Urine/Stool/Blood',
      normalRange: {
        male: 'See individual porphyrins',
        female: 'See individual porphyrins',
        children: 'See individual porphyrins',
        units: 'μg/L, μg/g'
      },
      criticalValues: {
        low: 'See individual porphyrins',
        high: 'See individual porphyrins'
      },
      clinicalSignificance: 'Assessment of porphyrin metabolism and detection of porphyrias.',
      interpretation: 'Abnormal patterns indicate specific types of porphyria or liver disease.',
      causes: {
        increased: ['Porphyrias', 'Liver disease', 'Lead poisoning', 'Iron deficiency', 'Medications'],
        decreased: ['Normal metabolism', 'Successful treatment', 'Iron supplementation']
      },
      relatedTests: ['Coproporphyrin', 'Uroporphyrin', 'Protoporphyrin', 'ALA', 'PBG'],
      preparation: '24-hour urine collection',
      methodology: 'HPLC/Fluorescence',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'sphingolipid-profile',
      testName: 'Sphingolipid Profile',
      category: 'biochemistry',
      subcategory: 'sphingolipid-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: 'See individual sphingolipids',
        female: 'See individual sphingolipids',
        children: 'See individual sphingolipids',
        units: 'μmol/L'
      },
      criticalValues: {
        low: 'See individual sphingolipids',
        high: 'See individual sphingolipids'
      },
      clinicalSignificance: 'Assessment of sphingolipid metabolism and detection of lysosomal storage disorders.',
      interpretation: 'Abnormal patterns may indicate Gaucher disease, Niemann-Pick disease, or other storage disorders.',
      causes: {
        increased: ['Lysosomal storage disorders', 'Metabolic disorders', 'Liver disease', 'Genetic factors'],
        decreased: ['Normal metabolism', 'Successful treatment', 'Enzyme replacement therapy']
      },
      relatedTests: ['Ceramide', 'Sphingomyelin', 'Glucosylceramide', 'Lactosylceramide'],
      preparation: 'Fasting required',
      methodology: 'LC-MS/MS',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'glycosaminoglycan-profile',
      testName: 'Glycosaminoglycan Profile',
      category: 'biochemistry',
      subcategory: 'glycosaminoglycan-metabolism',
      specimen: 'Urine',
      normalRange: {
        male: 'See individual GAGs',
        female: 'See individual GAGs',
        children: 'See individual GAGs',
        units: 'mg/g creatinine'
      },
      criticalValues: {
        low: 'See individual GAGs',
        high: 'See individual GAGs'
      },
      clinicalSignificance: 'Assessment of glycosaminoglycan metabolism and detection of mucopolysaccharidoses.',
      interpretation: 'Elevated levels suggest mucopolysaccharidosis or other storage disorders.',
      causes: {
        increased: ['Mucopolysaccharidoses', 'Storage disorders', 'Connective tissue disorders', 'Genetic factors'],
        decreased: ['Normal metabolism', 'Successful treatment', 'Enzyme replacement therapy']
      },
      relatedTests: ['Heparan Sulfate', 'Dermatan Sulfate', 'Chondroitin Sulfate', 'Keratan Sulfate'],
      preparation: 'Random urine collection',
      methodology: 'HPLC/Electrophoresis',
      turnaroundTime: '5-7 days'
    },

    {
      id: 'biotin-metabolism',
      testName: 'Biotin Metabolism Profile',
      category: 'biochemistry',
      subcategory: 'biotin-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'Biotin: 0.5-2.0 ng/mL',
        female: 'Biotin: 0.5-2.0 ng/mL',
        children: 'Age-dependent',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Biotin: < 0.2 ng/mL',
        high: 'Biotin: > 5.0 ng/mL'
      },
      clinicalSignificance: 'Assessment of biotin status and metabolism.',
      interpretation: 'Low biotin may indicate deficiency. Elevated metabolites suggest biotinidase deficiency.',
      causes: {
        increased: ['Biotin supplementation', 'Biotinidase deficiency', 'Genetic factors', 'Dietary intake'],
        decreased: ['Biotin deficiency', 'Malabsorption', 'Prolonged antibiotic use', 'Poor diet']
      },
      relatedTests: ['Biotin', 'Biotinidase Activity', '3-Hydroxyisovaleric Acid', 'Methylcitric Acid'],
      preparation: 'Fasting not required',
      methodology: 'LC-MS/MS/Enzymatic',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'copper-metabolism',
      testName: 'Copper Metabolism Profile',
      category: 'biochemistry',
      subcategory: 'copper-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'Copper: 70-140 μg/dL, Ceruloplasmin: 20-60 mg/dL',
        female: 'Copper: 80-155 μg/dL, Ceruloplasmin: 20-60 mg/dL',
        children: 'Age-dependent',
        units: 'μg/dL, mg/dL'
      },
      criticalValues: {
        low: 'Copper: < 50 μg/dL',
        high: 'Copper: > 200 μg/dL'
      },
      clinicalSignificance: 'Assessment of copper metabolism and detection of Wilson disease or Menkes disease.',
      interpretation: 'Low copper with low ceruloplasmin suggests Wilson disease. High copper may indicate inflammation.',
      causes: {
        increased: ['Inflammation', 'Pregnancy', 'Estrogen therapy', 'Liver disease', 'Medications'],
        decreased: ['Wilson disease', 'Menkes disease', 'Malnutrition', 'Malabsorption', 'Nephrotic syndrome']
      },
      relatedTests: ['Copper', 'Ceruloplasmin', '24h Urine Copper', 'Liver Copper', 'Zinc'],
      preparation: 'Fasting required',
      methodology: 'Atomic Absorption/Immunoassay',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'zinc-metabolism',
      testName: 'Zinc Metabolism Profile',
      category: 'biochemistry',
      subcategory: 'zinc-metabolism',
      specimen: 'Serum',
      normalRange: {
        male: 'Zinc: 70-120 μg/dL',
        female: 'Zinc: 70-120 μg/dL',
        children: 'Age-dependent',
        units: 'μg/dL'
      },
      criticalValues: {
        low: 'Zinc: < 50 μg/dL',
        high: 'Zinc: > 150 μg/dL'
      },
      clinicalSignificance: 'Assessment of zinc status and metabolism.',
      interpretation: 'Low zinc may indicate deficiency. High zinc may indicate supplementation or toxicity.',
      causes: {
        increased: ['Zinc supplementation', 'Zinc toxicity', 'Hemolysis', 'Contamination'],
        decreased: ['Zinc deficiency', 'Malabsorption', 'Increased requirements', 'Chronic disease']
      },
      relatedTests: ['Zinc', 'Alkaline Phosphatase', 'Copper', 'Albumin', 'Zinc Protoporphyrin'],
      preparation: 'Fasting required',
      methodology: 'Atomic Absorption',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'selenium-metabolism',
      testName: 'Selenium Metabolism Profile',
      category: 'biochemistry',
      subcategory: 'selenium-metabolism',
      specimen: 'Serum/Whole Blood',
      normalRange: {
        male: 'Serum: 70-150 μg/L, Whole Blood: 100-300 μg/L',
        female: 'Serum: 70-150 μg/L, Whole Blood: 100-300 μg/L',
        children: 'Age-dependent',
        units: 'μg/L'
      },
      criticalValues: {
        low: 'Serum: < 50 μg/L',
        high: 'Serum: > 200 μg/L'
      },
      clinicalSignificance: 'Assessment of selenium status and antioxidant function.',
      interpretation: 'Low selenium indicates deficiency. High selenium may indicate supplementation or toxicity.',
      causes: {
        increased: ['Selenium supplementation', 'Selenium toxicity', 'Geographic factors', 'Dietary intake'],
        decreased: ['Selenium deficiency', 'Malabsorption', 'Geographic factors', 'Poor diet']
      },
      relatedTests: ['Selenium', 'Glutathione Peroxidase', 'Selenoprotein P', 'Thyroid Function'],
      preparation: 'Fasting not required',
      methodology: 'ICP-MS/Atomic Absorption',
      turnaroundTime: '3-5 days'
    },

    {
      id: 'molybdenum-metabolism',
      testName: 'Molybdenum Metabolism Profile',
      category: 'biochemistry',
      subcategory: 'molybdenum-metabolism',
      specimen: 'Serum/Urine',
      normalRange: {
        male: 'Molybdenum: 0.3-1.5 μg/L',
        female: 'Molybdenum: 0.3-1.5 μg/L',
        children: 'Age-dependent',
        units: 'μg/L'
      },
      criticalValues: {
        low: 'Molybdenum: < 0.1 μg/L',
        high: 'Molybdenum: > 3.0 μg/L'
      },
      clinicalSignificance: 'Assessment of molybdenum status and sulfite oxidase function.',
      interpretation: 'Low molybdenum may indicate deficiency. High levels may indicate supplementation or toxicity.',
      causes: {
        increased: ['Molybdenum supplementation', 'Molybdenum toxicity', 'Geographic factors', 'Dietary intake'],
        decreased: ['Molybdenum deficiency', 'Genetic disorders', 'Malabsorption', 'Poor diet']
      },
      relatedTests: ['Molybdenum', 'Sulfite', 'Xanthine', 'Uric Acid', 'Sulfite Oxidase'],
      preparation: 'Fasting not required',
      methodology: 'ICP-MS',
      turnaroundTime: '5-7 days'
    },

    // LIMS Test List - Chunk 1 (Tests 1-50)
    {
      id: 'fluid-ada-level',
      testName: 'Fluid ADA Level',
      category: 'biochemistry',
      subcategory: 'fluid-analysis',
      specimen: 'Pleural Fluid',
      normalRange: {
        male: '< 40 U/L',
        female: '< 40 U/L',
        children: '< 40 U/L',
        units: 'U/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 40 U/L'
      },
      clinicalSignificance: 'Diagnosis of tuberculous pleural effusion and differentiation from other causes.',
      interpretation: 'Elevated ADA levels suggest tuberculous pleural effusion.',
      causes: {
        increased: ['Tuberculosis', 'Empyema', 'Malignancy', 'Rheumatoid arthritis', 'Systemic lupus erythematosus'],
        decreased: ['Transudative effusion', 'Congestive heart failure', 'Cirrhosis', 'Nephrotic syndrome']
      },
      relatedTests: ['Pleural Fluid Analysis', 'AFB Culture', 'Tuberculin Test', 'Chest X-ray'],
      preparation: 'Pleural fluid collection',
      methodology: 'Enzymatic',
      turnaroundTime: '24 hours'
    },

    {
      id: 'immature-platelet-fraction',
      testName: 'Immature Platelet Fraction (IPF)',
      category: 'hematology',
      subcategory: 'platelet-analysis',
      specimen: '3 cc EDTA Blood',
      normalRange: {
        male: '1.1-6.1%',
        female: '1.1-6.1%',
        children: '1.1-6.1%',
        units: '%'
      },
      criticalValues: {
        low: '< 1.0%',
        high: '> 10.0%'
      },
      clinicalSignificance: 'Assessment of platelet production and bone marrow function.',
      interpretation: 'High IPF indicates increased platelet production, low IPF suggests decreased production.',
      causes: {
        increased: ['Thrombocytopenia recovery', 'Bone marrow stimulation', 'Inflammation', 'Infection'],
        decreased: ['Bone marrow failure', 'Aplastic anemia', 'Chemotherapy', 'Radiation']
      },
      relatedTests: ['Platelet Count', 'CBC', 'Bone Marrow Examination', 'Reticulocyte Count'],
      preparation: 'Fasting not required',
      methodology: 'Flow cytometry',
      turnaroundTime: '48 hours'
    },

    {
      id: 'blood-sugar-fasting',
      testName: 'Blood Sugar Fasting (BSF)',
      category: 'biochemistry',
      subcategory: 'glucose-metabolism',
      specimen: '2 CC Sodium Fluoride',
      normalRange: {
        male: '70-100 mg/dL',
        female: '70-100 mg/dL',
        children: '70-100 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 70 mg/dL',
        high: '> 126 mg/dL'
      },
      clinicalSignificance: 'Screening for diabetes and assessment of glucose metabolism.',
      interpretation: 'Fasting glucose ≥126 mg/dL suggests diabetes, 100-125 mg/dL indicates prediabetes.',
      causes: {
        increased: ['Diabetes mellitus', 'Stress', 'Medications', 'Cushing syndrome', 'Acromegaly'],
        decreased: ['Insulin overdose', 'Liver disease', 'Adrenal insufficiency', 'Malnutrition']
      },
      relatedTests: ['HbA1c', 'Oral Glucose Tolerance Test', 'Insulin', 'C-Peptide'],
      preparation: '8-12 hour fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: '2 hours'
    },

    {
      id: 'blood-sugar-random',
      testName: 'Blood Sugar Random (BSR)',
      category: 'biochemistry',
      subcategory: 'glucose-metabolism',
      specimen: '2 CC Sodium Fluoride',
      normalRange: {
        male: '< 140 mg/dL',
        female: '< 140 mg/dL',
        children: '< 140 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 70 mg/dL',
        high: '> 200 mg/dL'
      },
      clinicalSignificance: 'Assessment of current glucose status without fasting requirement.',
      interpretation: 'Random glucose ≥200 mg/dL with symptoms suggests diabetes.',
      causes: {
        increased: ['Diabetes mellitus', 'Recent meal', 'Stress', 'Infection', 'Medications'],
        decreased: ['Insulin overdose', 'Hypoglycemia', 'Liver disease', 'Adrenal insufficiency']
      },
      relatedTests: ['Fasting Glucose', 'HbA1c', 'Insulin', 'C-Peptide'],
      preparation: 'No fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: '2 hours'
    },

    {
      id: 'triglycerides-advanced',
      testName: 'Triglycerides (TG)',
      category: 'biochemistry',
      subcategory: 'lipid-metabolism',
      specimen: '3 CC Clotted Blood/Serum',
      normalRange: {
        male: '< 150 mg/dL',
        female: '< 150 mg/dL',
        children: '< 150 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 50 mg/dL',
        high: '> 500 mg/dL'
      },
      clinicalSignificance: 'Assessment of cardiovascular risk and lipid metabolism.',
      interpretation: 'Elevated triglycerides increase cardiovascular risk.',
      causes: {
        increased: ['Obesity', 'Diabetes', 'Alcohol consumption', 'High carbohydrate diet', 'Genetic disorders'],
        decreased: ['Malnutrition', 'Hyperthyroidism', 'Liver disease', 'Malabsorption']
      },
      relatedTests: ['Total Cholesterol', 'HDL', 'LDL', 'Lipid Profile'],
      preparation: '12-14 hour fasting required',
      methodology: 'Enzymatic',
      turnaroundTime: '3 hours'
    },

    {
      id: '17-hydroxyprogesterone',
      testName: '17-OHP (17-Hydroxyprogesterone)',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: '5 cc Clotted Blood/Serum',
      normalRange: {
        male: '0.5-2.4 ng/mL',
        female: '0.5-2.4 ng/mL',
        children: 'Age-dependent',
        units: 'ng/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10 ng/mL'
      },
      clinicalSignificance: 'Diagnosis of congenital adrenal hyperplasia (CAH) and adrenal disorders.',
      interpretation: 'Elevated levels suggest CAH or adrenal enzyme deficiency.',
      causes: {
        increased: ['Congenital adrenal hyperplasia', 'Adrenal tumors', 'Pregnancy', 'Stress'],
        decreased: ['Adrenal insufficiency', 'Hypopituitarism', 'Medications']
      },
      relatedTests: ['Cortisol', 'ACTH', 'DHEA-S', 'Testosterone'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '48 hours'
    },

    {
      id: '24h-urinary-albumin',
      testName: '24 Hours Urinary Albumin',
      category: 'urinalysis',
      subcategory: 'protein-analysis',
      specimen: 'Urine 20-25ml',
      normalRange: {
        male: '< 30 mg/24h',
        female: '< 30 mg/24h',
        children: '< 30 mg/24h',
        units: 'mg/24h'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 300 mg/24h'
      },
      clinicalSignificance: 'Assessment of kidney function and early detection of kidney disease.',
      interpretation: 'Elevated levels indicate proteinuria and kidney damage.',
      causes: {
        increased: ['Diabetes', 'Hypertension', 'Glomerulonephritis', 'Nephrotic syndrome', 'Pregnancy'],
        decreased: ['Normal kidney function', 'Good hydration', 'Healthy diet']
      },
      relatedTests: ['Creatinine Clearance', 'Protein/Creatinine Ratio', 'Microalbuminuria'],
      preparation: '24-hour urine collection',
      methodology: 'Immunoassay',
      turnaroundTime: '24 hours'
    },

    {
      id: '24h-urinary-amylase',
      testName: '24 Hours Urinary Amylase',
      category: 'urinalysis',
      subcategory: 'enzyme-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '1-17 U/h',
        female: '1-17 U/h',
        children: 'Age-dependent',
        units: 'U/h'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 50 U/h'
      },
      clinicalSignificance: 'Assessment of pancreatic function and detection of pancreatic disorders.',
      interpretation: 'Elevated levels suggest pancreatic inflammation or obstruction.',
      causes: {
        increased: ['Acute pancreatitis', 'Chronic pancreatitis', 'Pancreatic cancer', 'Biliary obstruction'],
        decreased: ['Pancreatic insufficiency', 'Cystic fibrosis', 'Chronic pancreatitis']
      },
      relatedTests: ['Serum Amylase', 'Lipase', 'Pancreatic Function Tests'],
      preparation: '24-hour urine collection',
      methodology: 'Enzymatic',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-calcium',
      testName: '24 Hours Urinary Calcium',
      category: 'urinalysis',
      subcategory: 'mineral-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '100-300 mg/24h',
        female: '100-300 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: '< 50 mg/24h',
        high: '> 400 mg/24h'
      },
      clinicalSignificance: 'Assessment of calcium metabolism and kidney stone risk.',
      interpretation: 'High levels increase kidney stone risk, low levels may indicate deficiency.',
      causes: {
        increased: ['Hyperparathyroidism', 'Vitamin D excess', 'Immobilization', 'High calcium diet'],
        decreased: ['Hypoparathyroidism', 'Vitamin D deficiency', 'Malabsorption', 'Low calcium diet']
      },
      relatedTests: ['Serum Calcium', 'PTH', 'Vitamin D', 'Phosphorus'],
      preparation: '24-hour urine collection',
      methodology: 'Colorimetric',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-chloride',
      testName: '24 Hours Urinary Chloride',
      category: 'urinalysis',
      subcategory: 'electrolyte-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '110-250 mEq/24h',
        female: '110-250 mEq/24h',
        children: 'Age-dependent',
        units: 'mEq/24h'
      },
      criticalValues: {
        low: '< 50 mEq/24h',
        high: '> 400 mEq/24h'
      },
      clinicalSignificance: 'Assessment of electrolyte balance and kidney function.',
      interpretation: 'Abnormal levels may indicate kidney disease or electrolyte disorders.',
      causes: {
        increased: ['High salt diet', 'Diuretic use', 'Kidney disease', 'Metabolic alkalosis'],
        decreased: ['Low salt diet', 'Dehydration', 'Kidney disease', 'Metabolic acidosis']
      },
      relatedTests: ['Serum Chloride', 'Sodium', 'Potassium', 'Bicarbonate'],
      preparation: '24-hour urine collection',
      methodology: 'Ion-selective electrode',
      turnaroundTime: '48 hours'
    },

    // LIMS Test List - Chunk 2 (Tests 11-20)
    {
      id: '24h-urinary-cortisol',
      testName: '24 Hours Urinary Cortisol',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '10-100 μg/24h',
        female: '10-100 μg/24h',
        children: 'Age-dependent',
        units: 'μg/24h'
      },
      criticalValues: {
        low: '< 10 μg/24h',
        high: '> 200 μg/24h'
      },
      clinicalSignificance: 'Assessment of adrenal function and cortisol production over 24 hours.',
      interpretation: 'High levels suggest Cushing syndrome, low levels indicate adrenal insufficiency.',
      causes: {
        increased: ['Cushing syndrome', 'Stress', 'Obesity', 'Depression', 'Medications'],
        decreased: ['Addison disease', 'Adrenal insufficiency', 'Pituitary disease', 'Chronic illness']
      },
      relatedTests: ['Serum Cortisol', 'ACTH', 'Dexamethasone Suppression Test', 'Adrenal Function'],
      preparation: '24-hour urine collection',
      methodology: 'Immunoassay',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-creatinine',
      testName: '24 Hours Urinary Creatinine',
      category: 'urinalysis',
      subcategory: 'kidney-function',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '800-2000 mg/24h',
        female: '600-1800 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: '< 500 mg/24h',
        high: '> 2500 mg/24h'
      },
      clinicalSignificance: 'Assessment of kidney function and muscle mass.',
      interpretation: 'Low levels may indicate kidney disease or reduced muscle mass.',
      causes: {
        increased: ['High muscle mass', 'High protein diet', 'Exercise', 'Creatine supplementation'],
        decreased: ['Kidney disease', 'Low muscle mass', 'Malnutrition', 'Aging']
      },
      relatedTests: ['Creatinine Clearance', 'Serum Creatinine', 'BUN', 'eGFR'],
      preparation: '24-hour urine collection',
      methodology: 'Jaffe reaction',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-glucose',
      testName: '24 Hours Urinary Glucose',
      category: 'urinalysis',
      subcategory: 'glucose-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '< 130 mg/24h',
        female: '< 130 mg/24h',
        children: '< 130 mg/24h',
        units: 'mg/24h'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 500 mg/24h'
      },
      clinicalSignificance: 'Assessment of glucose excretion and kidney threshold.',
      interpretation: 'Elevated levels suggest diabetes or kidney dysfunction.',
      causes: {
        increased: ['Diabetes mellitus', 'Kidney disease', 'Pregnancy', 'High glucose diet'],
        decreased: ['Normal glucose metabolism', 'Good glycemic control', 'Low glucose diet']
      },
      relatedTests: ['Blood Glucose', 'HbA1c', 'Kidney Function Tests', 'Urinalysis'],
      preparation: '24-hour urine collection',
      methodology: 'Enzymatic',
      turnaroundTime: '600 hours'
    },

    {
      id: '24h-urinary-magnesium',
      testName: '24 Hours Urinary Magnesium',
      category: 'urinalysis',
      subcategory: 'mineral-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '50-200 mg/24h',
        female: '50-200 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: '< 30 mg/24h',
        high: '> 300 mg/24h'
      },
      clinicalSignificance: 'Assessment of magnesium metabolism and kidney function.',
      interpretation: 'Abnormal levels may indicate kidney disease or magnesium disorders.',
      causes: {
        increased: ['High magnesium diet', 'Diuretic use', 'Kidney disease', 'Magnesium supplementation'],
        decreased: ['Low magnesium diet', 'Malabsorption', 'Kidney disease', 'Magnesium deficiency']
      },
      relatedTests: ['Serum Magnesium', 'Calcium', 'Phosphorus', 'Kidney Function Tests'],
      preparation: '24-hour urine collection',
      methodology: 'Atomic absorption',
      turnaroundTime: '48 hours'
    },

    {
      id: '24h-urinary-phosphorous',
      testName: '24 Hours Urinary Phosphorous',
      category: 'urinalysis',
      subcategory: 'mineral-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '400-1300 mg/24h',
        female: '400-1300 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: '< 200 mg/24h',
        high: '> 2000 mg/24h'
      },
      clinicalSignificance: 'Assessment of phosphorus metabolism and kidney function.',
      interpretation: 'High levels may indicate hyperparathyroidism, low levels suggest deficiency.',
      causes: {
        increased: ['Hyperparathyroidism', 'High phosphorus diet', 'Kidney disease', 'Vitamin D excess'],
        decreased: ['Hypoparathyroidism', 'Low phosphorus diet', 'Malabsorption', 'Vitamin D deficiency']
      },
      relatedTests: ['Serum Phosphorus', 'PTH', 'Calcium', 'Vitamin D'],
      preparation: '24-hour urine collection',
      methodology: 'Colorimetric',
      turnaroundTime: '48 hours'
    },

    {
      id: '24h-urinary-potassium',
      testName: '24 Hours Urinary Potassium',
      category: 'urinalysis',
      subcategory: 'electrolyte-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '25-125 mEq/24h',
        female: '25-125 mEq/24h',
        children: 'Age-dependent',
        units: 'mEq/24h'
      },
      criticalValues: {
        low: '< 15 mEq/24h',
        high: '> 200 mEq/24h'
      },
      clinicalSignificance: 'Assessment of potassium balance and kidney function.',
      interpretation: 'Abnormal levels may indicate kidney disease or electrolyte disorders.',
      causes: {
        increased: ['High potassium diet', 'Diuretic use', 'Kidney disease', 'Metabolic acidosis'],
        decreased: ['Low potassium diet', 'Dehydration', 'Kidney disease', 'Metabolic alkalosis']
      },
      relatedTests: ['Serum Potassium', 'Sodium', 'Chloride', 'Bicarbonate'],
      preparation: '24-hour urine collection',
      methodology: 'Ion-selective electrode',
      turnaroundTime: '12 hours'
    },

    {
      id: '24h-urinary-protein',
      testName: '24 Hours Urinary Protein',
      category: 'urinalysis',
      subcategory: 'protein-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '< 150 mg/24h',
        female: '< 150 mg/24h',
        children: '< 150 mg/24h',
        units: 'mg/24h'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 3.5 g/24h'
      },
      clinicalSignificance: 'Assessment of proteinuria and kidney function.',
      interpretation: 'Elevated levels indicate kidney disease or proteinuria.',
      causes: {
        increased: ['Kidney disease', 'Diabetes', 'Hypertension', 'Glomerulonephritis', 'Nephrotic syndrome'],
        decreased: ['Normal kidney function', 'Good hydration', 'Healthy diet']
      },
      relatedTests: ['Protein/Creatinine Ratio', 'Creatinine Clearance', 'Kidney Function Tests'],
      preparation: '24-hour urine collection',
      methodology: 'Colorimetric',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-sodium',
      testName: '24 Hours Urinary Sodium',
      category: 'urinalysis',
      subcategory: 'electrolyte-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '40-220 mEq/24h',
        female: '40-220 mEq/24h',
        children: 'Age-dependent',
        units: 'mEq/24h'
      },
      criticalValues: {
        low: '< 20 mEq/24h',
        high: '> 300 mEq/24h'
      },
      clinicalSignificance: 'Assessment of sodium balance and kidney function.',
      interpretation: 'Abnormal levels may indicate kidney disease or electrolyte disorders.',
      causes: {
        increased: ['High salt diet', 'Diuretic use', 'Kidney disease', 'Metabolic alkalosis'],
        decreased: ['Low salt diet', 'Dehydration', 'Kidney disease', 'Metabolic acidosis']
      },
      relatedTests: ['Serum Sodium', 'Potassium', 'Chloride', 'Bicarbonate'],
      preparation: '24-hour urine collection',
      methodology: 'Ion-selective electrode',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-urea',
      testName: '24 Hours Urinary Urea',
      category: 'urinalysis',
      subcategory: 'nitrogen-analysis',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '12-20 g/24h',
        female: '12-20 g/24h',
        children: 'Age-dependent',
        units: 'g/24h'
      },
      criticalValues: {
        low: '< 8 g/24h',
        high: '> 30 g/24h'
      },
      clinicalSignificance: 'Assessment of protein metabolism and kidney function.',
      interpretation: 'Low levels may indicate low protein intake, high levels suggest high protein diet.',
      causes: {
        increased: ['High protein diet', 'Catabolic states', 'Kidney disease', 'Dehydration'],
        decreased: ['Low protein diet', 'Liver disease', 'Malnutrition', 'Kidney disease']
      },
      relatedTests: ['BUN', 'Serum Creatinine', 'Protein Metabolism', 'Kidney Function Tests'],
      preparation: '24-hour urine collection',
      methodology: 'Enzymatic',
      turnaroundTime: '6 hours'
    },

    {
      id: '24h-urinary-uric-acid',
      testName: '24 Hours Urinary Uric Acid',
      category: 'urinalysis',
      subcategory: 'purine-metabolism',
      specimen: '20-30 ml urine',
      normalRange: {
        male: '250-750 mg/24h',
        female: '250-750 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: '< 150 mg/24h',
        high: '> 1000 mg/24h'
      },
      clinicalSignificance: 'Assessment of purine metabolism and kidney stone risk.',
      interpretation: 'High levels increase kidney stone risk, low levels may indicate deficiency.',
      causes: {
        increased: ['High purine diet', 'Gout', 'Kidney disease', 'Tumor lysis syndrome'],
        decreased: ['Low purine diet', 'Kidney disease', 'Malabsorption', 'Medications']
      },
      relatedTests: ['Serum Uric Acid', 'Kidney Function Tests', 'Purine Metabolism'],
      preparation: '24-hour urine collection',
      methodology: 'Enzymatic',
      turnaroundTime: '6 hours'
    },

    // LIMS Test List - Chunk 3 (Tests 21-30)
    {
      id: '24h-urine-protein-creatinine',
      testName: '24 Hours Urine for Protein and Creatinine',
      category: 'urinalysis',
      subcategory: 'kidney-function',
      specimen: '24-hour urine',
      normalRange: {
        male: 'Protein/Creatinine < 0.2',
        female: 'Protein/Creatinine < 0.2',
        children: 'Protein/Creatinine < 0.2',
        units: 'mg/mg'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 3.5 mg/mg'
      },
      clinicalSignificance: 'Assessment of proteinuria and kidney function with creatinine normalization.',
      interpretation: 'High ratio indicates significant proteinuria and kidney damage.',
      causes: {
        increased: ['Kidney disease', 'Diabetes', 'Hypertension', 'Glomerulonephritis', 'Nephrotic syndrome'],
        decreased: ['Normal kidney function', 'Good hydration', 'Healthy diet']
      },
      relatedTests: ['Creatinine Clearance', 'Microalbuminuria', 'Kidney Function Tests'],
      preparation: '24-hour urine collection',
      methodology: 'Colorimetric',
      turnaroundTime: '24 hours'
    },

    {
      id: '24h-urine-vma',
      testName: '24 Hours Urine for VMA (Vanillylmandelic Acid)',
      category: 'urinalysis',
      subcategory: 'catecholamine-metabolism',
      specimen: '24-hour urine',
      normalRange: {
        male: '2-7 mg/24h',
        female: '2-7 mg/24h',
        children: 'Age-dependent',
        units: 'mg/24h'
      },
      criticalValues: {
        low: '< 1 mg/24h',
        high: '> 15 mg/24h'
      },
      clinicalSignificance: 'Assessment of catecholamine metabolism and detection of pheochromocytoma.',
      interpretation: 'Elevated levels suggest pheochromocytoma or neuroblastoma.',
      causes: {
        increased: ['Pheochromocytoma', 'Neuroblastoma', 'Stress', 'Medications', 'Dietary factors'],
        decreased: ['Normal metabolism', 'Successful treatment', 'Dietary restrictions']
      },
      relatedTests: ['Catecholamines', 'Metanephrines', 'Normetanephrines', 'Pheochromocytoma Workup'],
      preparation: '24-hour urine collection with acid preservative',
      methodology: 'HPLC',
      turnaroundTime: '48 hours'
    },

    {
      id: '24h-urine-protein',
      testName: '24-Hour Urine Protein',
      category: 'urinalysis',
      subcategory: 'protein-analysis',
      specimen: '24-hour urine sample',
      normalRange: {
        male: '< 150 mg/24h',
        female: '< 150 mg/24h',
        children: '< 150 mg/24h',
        units: 'mg/24h'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 3.5 g/24h'
      },
      clinicalSignificance: 'Assessment of proteinuria and kidney function.',
      interpretation: 'Elevated levels indicate kidney disease or proteinuria.',
      causes: {
        increased: ['Kidney disease', 'Diabetes', 'Hypertension', 'Glomerulonephritis', 'Nephrotic syndrome'],
        decreased: ['Normal kidney function', 'Good hydration', 'Healthy diet']
      },
      relatedTests: ['Protein/Creatinine Ratio', 'Creatinine Clearance', 'Kidney Function Tests'],
      preparation: '24-hour urine collection',
      methodology: 'Colorimetric',
      turnaroundTime: '4 hours'
    },

    {
      id: '25-hydroxy-vitamin-d',
      testName: '25-Hydroxy Vitamin D',
      category: 'biochemistry',
      subcategory: 'vitamin-analysis',
      specimen: '2-3 cc Clotted Blood or serum',
      normalRange: {
        male: '30-100 ng/mL',
        female: '30-100 ng/mL',
        children: '30-100 ng/mL',
        units: 'ng/mL'
      },
      criticalValues: {
        low: '< 20 ng/mL',
        high: '> 100 ng/mL'
      },
      clinicalSignificance: 'Assessment of vitamin D status and bone health.',
      interpretation: 'Low levels indicate deficiency, high levels may indicate toxicity.',
      causes: {
        increased: ['Vitamin D supplementation', 'Sun exposure', 'Hyperparathyroidism', 'Sarcoidosis'],
        decreased: ['Vitamin D deficiency', 'Malabsorption', 'Limited sun exposure', 'Liver disease']
      },
      relatedTests: ['1,25-OH-Vitamin D', 'PTH', 'Calcium', 'Phosphorus'],
      preparation: 'Fasting not required',
      methodology: 'LC-MS/MS',
      turnaroundTime: '3 hours'
    },

    {
      id: 'ag-ratio-advanced',
      testName: 'A/G Ratio (Albumin/Globulin Ratio)',
      category: 'biochemistry',
      subcategory: 'protein-analysis',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '1.1-2.2',
        female: '1.1-2.2',
        children: '1.1-2.2',
        units: 'ratio'
      },
      criticalValues: {
        low: '< 1.0',
        high: '> 3.0'
      },
      clinicalSignificance: 'Assessment of protein balance and liver function.',
      interpretation: 'Low ratio may indicate liver disease, high ratio suggests dehydration.',
      causes: {
        increased: ['Dehydration', 'High protein diet', 'Exercise', 'Burns'],
        decreased: ['Liver disease', 'Inflammation', 'Multiple myeloma', 'Chronic disease']
      },
      relatedTests: ['Total Protein', 'Albumin', 'Globulin', 'Liver Function Tests'],
      preparation: 'Fasting not required',
      methodology: 'Colorimetric',
      turnaroundTime: '10 hours'
    },

    {
      id: 'abscess-culture-sensitivity',
      testName: 'Abscess for Culture and Sensitivity with Gram Stain',
      category: 'microbiology',
      subcategory: 'bacterial-culture',
      specimen: 'Pus, Abscess material',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Identification of bacteria causing abscess and antibiotic susceptibility.',
      interpretation: 'Positive culture indicates bacterial infection requiring specific antibiotics.',
      causes: {
        increased: ['Bacterial infection', 'Staphylococcus aureus', 'Streptococcus', 'Anaerobic bacteria'],
        decreased: ['Sterile abscess', 'Viral infection', 'Fungal infection', 'Successful treatment']
      },
      relatedTests: ['Gram Stain', 'Blood Culture', 'Wound Culture', 'Antibiotic Susceptibility'],
      preparation: 'Sterile collection of pus/abscess material',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '96 hours'
    },

    {
      id: 'absolute-eosinophil-count',
      testName: 'Absolute Eosinophil Count',
      category: 'hematology',
      subcategory: 'white-blood-cells',
      specimen: '3 CC EDTA Blood (CBC Vial)',
      normalRange: {
        male: '0-500 cells/μL',
        female: '0-500 cells/μL',
        children: '0-500 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 1500 cells/μL'
      },
      clinicalSignificance: 'Assessment of allergic reactions and parasitic infections.',
      interpretation: 'Elevated levels suggest allergy, parasitic infection, or eosinophilic disorders.',
      causes: {
        increased: ['Allergic reactions', 'Parasitic infections', 'Asthma', 'Eosinophilic disorders', 'Drug reactions'],
        decreased: ['Acute infection', 'Corticosteroid use', 'Stress', 'Bone marrow suppression']
      },
      relatedTests: ['CBC', 'Differential Count', 'Allergy Testing', 'Parasite Testing'],
      preparation: 'Fasting not required',
      methodology: 'Automated cell counting',
      turnaroundTime: '2 hours'
    },

    {
      id: 'absolute-lymphocytes-count',
      testName: 'Absolute Lymphocytes Count',
      category: 'hematology',
      subcategory: 'white-blood-cells',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '1000-4800 cells/μL',
        female: '1000-4800 cells/μL',
        children: '1000-4800 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: '< 1000 cells/μL',
        high: '> 4800 cells/μL'
      },
      clinicalSignificance: 'Assessment of immune function and viral infections.',
      interpretation: 'Low levels suggest immunodeficiency, high levels may indicate viral infection.',
      causes: {
        increased: ['Viral infections', 'Lymphocytic leukemia', 'Mononucleosis', 'Tuberculosis'],
        decreased: ['Immunodeficiency', 'HIV/AIDS', 'Chemotherapy', 'Radiation therapy']
      },
      relatedTests: ['CBC', 'Differential Count', 'CD4 Count', 'Viral Testing'],
      preparation: 'Fasting not required',
      methodology: 'Automated cell counting',
      turnaroundTime: '2 hours'
    },

    {
      id: 'absolute-neutrophil',
      testName: 'Absolute Neutrophil',
      category: 'hematology',
      subcategory: 'white-blood-cells',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '1800-7800 cells/μL',
        female: '1800-7800 cells/μL',
        children: '1800-7800 cells/μL',
        units: 'cells/μL'
      },
      criticalValues: {
        low: '< 1000 cells/μL',
        high: '> 10000 cells/μL'
      },
      clinicalSignificance: 'Assessment of bacterial infection and bone marrow function.',
      interpretation: 'Low levels increase infection risk, high levels suggest bacterial infection.',
      causes: {
        increased: ['Bacterial infection', 'Inflammation', 'Stress', 'Leukemia', 'Medications'],
        decreased: ['Neutropenia', 'Bone marrow failure', 'Chemotherapy', 'Viral infection']
      },
      relatedTests: ['CBC', 'Differential Count', 'Bone Marrow Examination', 'Infection Markers'],
      preparation: 'Fasting not required',
      methodology: 'Automated cell counting',
      turnaroundTime: '15 hours'
    },

    {
      id: 'ace-angiotensin-converting-enzyme',
      testName: 'ACE (Angiotensin Converting Enzyme)',
      category: 'biochemistry',
      subcategory: 'enzyme-analysis',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '8-52 U/L',
        female: '8-52 U/L',
        children: 'Age-dependent',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 8 U/L',
        high: '> 100 U/L'
      },
      clinicalSignificance: 'Assessment of sarcoidosis and other granulomatous diseases.',
      interpretation: 'Elevated levels suggest sarcoidosis, normal levels do not rule out disease.',
      causes: {
        increased: ['Sarcoidosis', 'Tuberculosis', 'Leprosy', 'Gaucher disease', 'Hyperthyroidism'],
        decreased: ['ACE inhibitor therapy', 'Liver disease', 'Malnutrition', 'Normal variation']
      },
      relatedTests: ['Chest X-ray', 'Lung Function Tests', 'Biopsy', 'Calcium'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: '96 hours'
    },

    // LIMS Test List - Chunk 4 (Tests 31-40)
    {
      id: 'acid-phosphatase',
      testName: 'Acid Phosphatase',
      category: 'biochemistry',
      subcategory: 'enzyme-analysis',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '0.5-5.5 U/L',
        female: '0.5-5.5 U/L',
        children: 'Age-dependent',
        units: 'U/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 10 U/L'
      },
      clinicalSignificance: 'Assessment of prostate cancer and bone disease.',
      interpretation: 'Elevated levels may indicate prostate cancer or bone disease.',
      causes: {
        increased: ['Prostate cancer', 'Bone disease', 'Gaucher disease', 'Multiple myeloma', 'Liver disease'],
        decreased: ['Normal levels', 'Successful treatment', 'Prostate removal']
      },
      relatedTests: ['PSA', 'Prostate Biopsy', 'Bone Scan', 'Alkaline Phosphatase'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: '72 hours'
    },

    {
      id: 'acra-acetylcholine-receptor-abs',
      testName: 'ACRA (Acetylcholine Receptor Abs)',
      category: 'immunology',
      subcategory: 'autoimmune-testing',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '< 0.02 nmol/L',
        female: '< 0.02 nmol/L',
        children: '< 0.02 nmol/L',
        units: 'nmol/L'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 0.02 nmol/L'
      },
      clinicalSignificance: 'Diagnosis of myasthenia gravis and assessment of autoimmune neuromuscular disease.',
      interpretation: 'Positive result suggests myasthenia gravis.',
      causes: {
        increased: ['Myasthenia gravis', 'Autoimmune disease', 'Thymoma', 'Medications'],
        decreased: ['Normal immune function', 'Successful treatment', 'Remission']
      },
      relatedTests: ['Muscle Antibodies', 'EMG', 'Chest CT', 'Thymus Evaluation'],
      preparation: 'Fasting not required',
      methodology: 'Radioimmunoassay',
      turnaroundTime: '72 hours'
    },

    {
      id: 'acth-adrenocorticotropic-hormone',
      testName: 'ACTH (Adrenocorticotropic Hormone)',
      category: 'hormones',
      subcategory: 'pituitary-function',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '7.2-63.3 pg/mL',
        female: '7.2-63.3 pg/mL',
        children: 'Age-dependent',
        units: 'pg/mL'
      },
      criticalValues: {
        low: '< 5 pg/mL',
        high: '> 100 pg/mL'
      },
      clinicalSignificance: 'Assessment of pituitary and adrenal function.',
      interpretation: 'High levels suggest adrenal insufficiency, low levels suggest Cushing syndrome.',
      causes: {
        increased: ['Adrenal insufficiency', 'Stress', 'Pituitary tumor', 'Ectopic ACTH'],
        decreased: ['Cushing syndrome', 'Pituitary disease', 'Glucocorticoid therapy']
      },
      relatedTests: ['Cortisol', 'Dexamethasone Suppression Test', 'Adrenal Function Tests'],
      preparation: 'Fasting required, morning collection preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    {
      id: 'afb-cs-first-report',
      testName: 'AFB C/S (Any Specimen) (First Report)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sample',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of Mycobacterium tuberculosis and other acid-fast bacteria.',
      interpretation: 'Positive culture indicates tuberculosis or other mycobacterial infection.',
      causes: {
        increased: ['Tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Tuberculin Test', 'Chest X-ray', 'PCR Testing'],
      preparation: 'Sterile collection of appropriate specimen',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '24 hours'
    },

    {
      id: 'afb-cs-final-report',
      testName: 'AFB C/S (Final Report After 7 Day)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sample',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Complete identification and susceptibility testing of mycobacteria.',
      interpretation: 'Final report includes species identification and antibiotic susceptibility.',
      causes: {
        increased: ['Tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Tuberculin Test', 'Chest X-ray', 'PCR Testing'],
      preparation: 'Sterile collection of appropriate specimen',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '24 hours'
    },

    {
      id: 'afb-culture-pus',
      testName: 'AFB Culture Report (Pus)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Pus',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in pus specimens.',
      interpretation: 'Positive culture indicates mycobacterial infection in abscess.',
      causes: {
        increased: ['Tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Gram Stain', 'Bacterial Culture', 'PCR Testing'],
      preparation: 'Sterile collection of pus',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    {
      id: 'afb-culture-special',
      testName: 'AFB Culture Report (Special)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'As Required',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in special specimens.',
      interpretation: 'Positive culture indicates mycobacterial infection.',
      causes: {
        increased: ['Tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Special Stains', 'PCR Testing'],
      preparation: 'As per specimen type requirements',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    {
      id: 'afb-culture-sputum-1st-day',
      testName: 'AFB Culture Report (Sputum 1st Day)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sputum',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in sputum specimens.',
      interpretation: 'Positive culture indicates pulmonary tuberculosis.',
      causes: {
        increased: ['Pulmonary tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Chest X-ray', 'Tuberculin Test', 'PCR Testing'],
      preparation: 'Early morning sputum collection',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    {
      id: 'afb-culture-sputum-2nd-day',
      testName: 'AFB Culture Report (Sputum 2nd Day)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sputum',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in sputum specimens.',
      interpretation: 'Positive culture indicates pulmonary tuberculosis.',
      causes: {
        increased: ['Pulmonary tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Chest X-ray', 'Tuberculin Test', 'PCR Testing'],
      preparation: 'Early morning sputum collection',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    {
      id: 'afb-culture-sputum-3rd-day',
      testName: 'AFB Culture Report (Sputum 3rd Day)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sputum',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in sputum specimens.',
      interpretation: 'Positive culture indicates pulmonary tuberculosis.',
      causes: {
        increased: ['Pulmonary tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Chest X-ray', 'Tuberculin Test', 'PCR Testing'],
      preparation: 'Early morning sputum collection',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    // LIMS Test List - Chunk 5 (Tests 41-50)
    {
      id: 'afb-culture-sputum-basic',
      testName: 'AFB Culture Report (Sputum)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sputum',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in sputum specimens.',
      interpretation: 'Positive culture indicates pulmonary tuberculosis.',
      causes: {
        increased: ['Pulmonary tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Chest X-ray', 'Tuberculin Test', 'PCR Testing'],
      preparation: 'Early morning sputum collection',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    {
      id: 'albumin-csf',
      testName: 'Albumin (CSF)',
      category: 'biochemistry',
      subcategory: 'cerebrospinal-fluid-analysis',
      specimen: '0.5-1 cc CSF',
      normalRange: {
        male: '15-45 mg/dL',
        female: '15-45 mg/dL',
        children: '15-45 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 10 mg/dL',
        high: '> 100 mg/dL'
      },
      clinicalSignificance: 'Assessment of blood-brain barrier integrity and CSF protein levels.',
      interpretation: 'Elevated levels suggest blood-brain barrier disruption or inflammation.',
      causes: {
        increased: ['Meningitis', 'Multiple sclerosis', 'Guillain-Barré syndrome', 'Brain tumor', 'Trauma'],
        decreased: ['Normal CSF', 'Dilution', 'Technical factors']
      },
      relatedTests: ['CSF Protein', 'CSF Glucose', 'CSF Cell Count', 'Blood-Brain Barrier'],
      preparation: 'Lumbar puncture',
      methodology: 'Colorimetric',
      turnaroundTime: '2 hours'
    },

    {
      id: 'albumin-fluid',
      testName: 'Albumin (Fluid)',
      category: 'biochemistry',
      subcategory: 'fluid-analysis',
      specimen: '1 CC Fluid',
      normalRange: {
        male: 'See individual fluids',
        female: 'See individual fluids',
        children: 'See individual fluids',
        units: 'g/dL'
      },
      criticalValues: {
        low: 'See individual fluids',
        high: 'See individual fluids'
      },
      clinicalSignificance: 'Assessment of protein content in body fluids.',
      interpretation: 'Elevated levels may indicate inflammation or malignancy.',
      causes: {
        increased: ['Inflammation', 'Malignancy', 'Infection', 'Trauma'],
        decreased: ['Normal fluid', 'Dilution', 'Technical factors']
      },
      relatedTests: ['Fluid Analysis', 'Total Protein', 'Cell Count', 'Culture'],
      preparation: 'Sterile fluid collection',
      methodology: 'Colorimetric',
      turnaroundTime: '2 hours'
    },

    {
      id: 'albumin-serum',
      testName: 'Albumin (Serum)',
      category: 'biochemistry',
      subcategory: 'protein-analysis',
      specimen: '3 CC Clotted Blood/Serum',
      normalRange: {
        male: '3.5-5.0 g/dL',
        female: '3.5-5.0 g/dL',
        children: '3.5-5.0 g/dL',
        units: 'g/dL'
      },
      criticalValues: {
        low: '< 2.0 g/dL',
        high: '> 6.0 g/dL'
      },
      clinicalSignificance: 'Assessment of liver function and nutritional status.',
      interpretation: 'Low levels suggest liver disease, malnutrition, or protein loss.',
      causes: {
        increased: ['Dehydration', 'High protein diet', 'Exercise', 'Burns'],
        decreased: ['Liver disease', 'Malnutrition', 'Nephrotic syndrome', 'Inflammation']
      },
      relatedTests: ['Total Protein', 'Globulin', 'Liver Function Tests', 'Nutritional Assessment'],
      preparation: 'Fasting not required',
      methodology: 'Colorimetric',
      turnaroundTime: '2 hours'
    },

    {
      id: 'aldosterone-plasma-renin-ratio',
      testName: 'Aldosterone/Plasma Renin Ratio',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: 'Sample',
      normalRange: {
        male: '< 20',
        female: '< 20',
        children: '< 20',
        units: 'ratio'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 30'
      },
      clinicalSignificance: 'Assessment of primary aldosteronism and hypertension.',
      interpretation: 'High ratio suggests primary aldosteronism.',
      causes: {
        increased: ['Primary aldosteronism', 'Adrenal adenoma', 'Adrenal hyperplasia', 'Medications'],
        decreased: ['Normal function', 'Secondary aldosteronism', 'Renal artery stenosis']
      },
      relatedTests: ['Aldosterone', 'Plasma Renin Activity', 'Adrenal Function Tests'],
      preparation: 'Fasting required, morning collection preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '48 hours'
    },

    {
      id: 'aldosterone-advanced',
      testName: 'Aldosterone',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '3-35 ng/dL',
        female: '3-35 ng/dL',
        children: 'Age-dependent',
        units: 'ng/dL'
      },
      criticalValues: {
        low: '< 3 ng/dL',
        high: '> 100 ng/dL'
      },
      clinicalSignificance: 'Assessment of adrenal function and electrolyte balance.',
      interpretation: 'High levels suggest aldosteronism, low levels suggest adrenal insufficiency.',
      causes: {
        increased: ['Primary aldosteronism', 'Secondary aldosteronism', 'Heart failure', 'Cirrhosis'],
        decreased: ['Adrenal insufficiency', 'Hypoaldosteronism', 'Medications']
      },
      relatedTests: ['Plasma Renin Activity', 'Sodium', 'Potassium', 'Adrenal Function Tests'],
      preparation: 'Fasting required, morning collection preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    {
      id: 'aldosterone-24h-urine',
      testName: 'Aldosterone (24 hr Urine)',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: '24-hour urine',
      normalRange: {
        male: '2-26 μg/24h',
        female: '2-26 μg/24h',
        children: 'Age-dependent',
        units: 'μg/24h'
      },
      criticalValues: {
        low: '< 2 μg/24h',
        high: '> 50 μg/24h'
      },
      clinicalSignificance: 'Assessment of aldosterone production over 24 hours.',
      interpretation: 'High levels suggest aldosteronism, low levels suggest adrenal insufficiency.',
      causes: {
        increased: ['Primary aldosteronism', 'Secondary aldosteronism', 'Heart failure', 'Cirrhosis'],
        decreased: ['Adrenal insufficiency', 'Hypoaldosteronism', 'Medications']
      },
      relatedTests: ['Serum Aldosterone', 'Plasma Renin Activity', 'Sodium', 'Potassium'],
      preparation: '24-hour urine collection',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },



    {
      id: 'alkaline-phosphatase-advanced',
      testName: 'Alkaline Phosphatase',
      category: 'biochemistry',
      subcategory: 'enzyme-analysis',
      specimen: '3 CC Clotted Blood/Serum',
      normalRange: {
        male: '44-147 U/L',
        female: '44-147 U/L',
        children: 'Age-dependent',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 30 U/L',
        high: '> 300 U/L'
      },
      clinicalSignificance: 'Assessment of liver and bone function.',
      interpretation: 'Elevated levels suggest liver disease or bone disease.',
      causes: {
        increased: ['Liver disease', 'Bone disease', 'Pregnancy', 'Growth', 'Medications'],
        decreased: ['Malnutrition', 'Hypothyroidism', 'Zinc deficiency', 'Genetic factors']
      },
      relatedTests: ['Liver Function Tests', 'Bone Markers', 'GGT', 'Bilirubin'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: '2 hours'
    },

    {
      id: 'allergy-disorders-ige',
      testName: 'ALLERGY DISORDERS (IgE)',
      category: 'immunology',
      subcategory: 'allergy-testing',
      specimen: 'Blood serum 2-3 ml',
      normalRange: {
        male: '< 100 IU/mL',
        female: '< 100 IU/mL',
        children: '< 100 IU/mL',
        units: 'IU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 1000 IU/mL'
      },
      clinicalSignificance: 'Assessment of allergic disorders and IgE-mediated hypersensitivity.',
      interpretation: 'Elevated levels suggest allergy or parasitic infection.',
      causes: {
        increased: ['Allergic disorders', 'Parasitic infections', 'Atopic dermatitis', 'Asthma', 'Food allergies'],
        decreased: ['Normal immune function', 'Immunodeficiency', 'Successful treatment']
      },
      relatedTests: ['Specific IgE', 'Skin Testing', 'Allergy Panel', 'Eosinophil Count'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    {
      id: 'alpha-1-antitrypsin-level',
      testName: 'Alpha 1-Antitrypsin Level',
      category: 'biochemistry',
      subcategory: 'protein-analysis',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '90-200 mg/dL',
        female: '90-200 mg/dL',
        children: '90-200 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 50 mg/dL',
        high: '> 300 mg/dL'
      },
      clinicalSignificance: 'Assessment of alpha-1-antitrypsin deficiency and liver disease.',
      interpretation: 'Low levels suggest deficiency, high levels suggest inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Pregnancy', 'Oral contraceptives', 'Stress'],
        decreased: ['Alpha-1-antitrypsin deficiency', 'Liver disease', 'Genetic factors']
      },
      relatedTests: ['Liver Function Tests', 'Phenotyping', 'Lung Function Tests', 'Genetic Testing'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    // LIMS Test List - Chunk 5 (Tests 41-50)
    {
      id: 'afb-culture-sputum-advanced',
      testName: 'AFB Culture Report (Sputum)',
      category: 'microbiology',
      subcategory: 'mycobacterial-culture',
      specimen: 'Sputum',
      normalRange: {
        male: 'No growth',
        female: 'No growth',
        children: 'No growth',
        units: 'CFU/mL'
      },
      criticalValues: {
        low: 'No growth',
        high: 'Any growth'
      },
      clinicalSignificance: 'Detection of mycobacteria in sputum specimens.',
      interpretation: 'Positive culture indicates pulmonary tuberculosis.',
      causes: {
        increased: ['Pulmonary tuberculosis', 'Nontuberculous mycobacteria', 'Contamination'],
        decreased: ['No infection', 'Successful treatment', 'Inadequate specimen']
      },
      relatedTests: ['AFB Smear', 'Chest X-ray', 'Tuberculin Test', 'PCR Testing'],
      preparation: 'Early morning sputum collection',
      methodology: 'Culture and sensitivity',
      turnaroundTime: '72 hours'
    },

    {
      id: 'albumin-csf',
      testName: 'Albumin (CSF)',
      category: 'biochemistry',
      subcategory: 'cerebrospinal-fluid-analysis',
      specimen: '0.5-1 cc CSF',
      normalRange: {
        male: '15-45 mg/dL',
        female: '15-45 mg/dL',
        children: '15-45 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 10 mg/dL',
        high: '> 100 mg/dL'
      },
      clinicalSignificance: 'Assessment of blood-brain barrier integrity and CSF protein levels.',
      interpretation: 'Elevated levels suggest blood-brain barrier disruption or inflammation.',
      causes: {
        increased: ['Meningitis', 'Multiple sclerosis', 'Guillain-Barré syndrome', 'Brain tumor', 'Trauma'],
        decreased: ['Normal CSF', 'Dilution', 'Technical factors']
      },
      relatedTests: ['CSF Protein', 'CSF Glucose', 'CSF Cell Count', 'Blood-Brain Barrier'],
      preparation: 'Lumbar puncture',
      methodology: 'Colorimetric',
      turnaroundTime: '2 hours'
    },

    {
      id: 'albumin-fluid',
      testName: 'Albumin (Fluid)',
      category: 'biochemistry',
      subcategory: 'fluid-analysis',
      specimen: '1 CC Fluid',
      normalRange: {
        male: 'See individual fluids',
        female: 'See individual fluids',
        children: 'See individual fluids',
        units: 'g/dL'
      },
      criticalValues: {
        low: 'See individual fluids',
        high: 'See individual fluids'
      },
      clinicalSignificance: 'Assessment of protein content in body fluids.',
      interpretation: 'Elevated levels may indicate inflammation or malignancy.',
      causes: {
        increased: ['Inflammation', 'Malignancy', 'Infection', 'Trauma'],
        decreased: ['Normal fluid', 'Dilution', 'Technical factors']
      },
      relatedTests: ['Fluid Analysis', 'Total Protein', 'Cell Count', 'Culture'],
      preparation: 'Sterile fluid collection',
      methodology: 'Colorimetric',
      turnaroundTime: '2 hours'
    },

    {
      id: 'albumin-serum',
      testName: 'Albumin (Serum)',
      category: 'biochemistry',
      subcategory: 'protein-analysis',
      specimen: '3 CC Clotted Blood/Serum',
      normalRange: {
        male: '3.5-5.0 g/dL',
        female: '3.5-5.0 g/dL',
        children: '3.5-5.0 g/dL',
        units: 'g/dL'
      },
      criticalValues: {
        low: '< 2.0 g/dL',
        high: '> 6.0 g/dL'
      },
      clinicalSignificance: 'Assessment of liver function and nutritional status.',
      interpretation: 'Low levels suggest liver disease, malnutrition, or protein loss.',
      causes: {
        increased: ['Dehydration', 'High protein diet', 'Exercise', 'Burns'],
        decreased: ['Liver disease', 'Malnutrition', 'Nephrotic syndrome', 'Inflammation']
      },
      relatedTests: ['Total Protein', 'Globulin', 'Liver Function Tests', 'Nutritional Assessment'],
      preparation: 'Fasting not required',
      methodology: 'Colorimetric',
      turnaroundTime: '2 hours'
    },

    {
      id: 'aldosterone-plasma-renin-ratio',
      testName: 'Aldosterone/Plasma Renin Ratio',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: 'Sample',
      normalRange: {
        male: '< 20',
        female: '< 20',
        children: '< 20',
        units: 'ratio'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 30'
      },
      clinicalSignificance: 'Assessment of primary aldosteronism and hypertension.',
      interpretation: 'High ratio suggests primary aldosteronism.',
      causes: {
        increased: ['Primary aldosteronism', 'Adrenal adenoma', 'Adrenal hyperplasia', 'Medications'],
        decreased: ['Normal function', 'Secondary aldosteronism', 'Renal artery stenosis']
      },
      relatedTests: ['Aldosterone', 'Plasma Renin Activity', 'Adrenal Function Tests'],
      preparation: 'Fasting required, morning collection preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '48 hours'
    },

    {
      id: 'aldosterone-comprehensive',
      testName: 'Aldosterone',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '3-35 ng/dL',
        female: '3-35 ng/dL',
        children: 'Age-dependent',
        units: 'ng/dL'
      },
      criticalValues: {
        low: '< 3 ng/dL',
        high: '> 100 ng/dL'
      },
      clinicalSignificance: 'Assessment of adrenal function and electrolyte balance.',
      interpretation: 'High levels suggest aldosteronism, low levels suggest adrenal insufficiency.',
      causes: {
        increased: ['Primary aldosteronism', 'Secondary aldosteronism', 'Heart failure', 'Cirrhosis'],
        decreased: ['Adrenal insufficiency', 'Hypoaldosteronism', 'Medications']
      },
      relatedTests: ['Plasma Renin Activity', 'Sodium', 'Potassium', 'Adrenal Function Tests'],
      preparation: 'Fasting required, morning collection preferred',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    {
      id: 'aldosterone-24h-urine',
      testName: 'Aldosterone (24 hr Urine)',
      category: 'hormones',
      subcategory: 'adrenal-function',
      specimen: '24-hour urine',
      normalRange: {
        male: '2-26 μg/24h',
        female: '2-26 μg/24h',
        children: 'Age-dependent',
        units: 'μg/24h'
      },
      criticalValues: {
        low: '< 2 μg/24h',
        high: '> 50 μg/24h'
      },
      clinicalSignificance: 'Assessment of aldosterone production over 24 hours.',
      interpretation: 'High levels suggest aldosteronism, low levels suggest adrenal insufficiency.',
      causes: {
        increased: ['Primary aldosteronism', 'Secondary aldosteronism', 'Heart failure', 'Cirrhosis'],
        decreased: ['Adrenal insufficiency', 'Hypoaldosteronism', 'Medications']
      },
      relatedTests: ['Serum Aldosterone', 'Plasma Renin Activity', 'Sodium', 'Potassium'],
      preparation: '24-hour urine collection',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    {
      id: 'alkaline-phosphatase-comprehensive',
      testName: 'Alkaline Phosphatase',
      category: 'biochemistry',
      subcategory: 'enzyme-analysis',
      specimen: '3 CC Clotted Blood/Serum',
      normalRange: {
        male: '44-147 U/L',
        female: '44-147 U/L',
        children: 'Age-dependent',
        units: 'U/L'
      },
      criticalValues: {
        low: '< 30 U/L',
        high: '> 300 U/L'
      },
      clinicalSignificance: 'Assessment of liver and bone function.',
      interpretation: 'Elevated levels suggest liver disease or bone disease.',
      causes: {
        increased: ['Liver disease', 'Bone disease', 'Pregnancy', 'Growth', 'Medications'],
        decreased: ['Malnutrition', 'Hypothyroidism', 'Zinc deficiency', 'Genetic factors']
      },
      relatedTests: ['Liver Function Tests', 'Bone Markers', 'GGT', 'Bilirubin'],
      preparation: 'Fasting not required',
      methodology: 'Enzymatic',
      turnaroundTime: '2 hours'
    },

    {
      id: 'allergy-disorders-ige',
      testName: 'ALLERGY DISORDERS (IgE)',
      category: 'immunology',
      subcategory: 'allergy-testing',
      specimen: 'Blood serum 2-3 ml',
      normalRange: {
        male: '< 100 IU/mL',
        female: '< 100 IU/mL',
        children: '< 100 IU/mL',
        units: 'IU/mL'
      },
      criticalValues: {
        low: 'Normal',
        high: '> 1000 IU/mL'
      },
      clinicalSignificance: 'Assessment of allergic disorders and IgE-mediated hypersensitivity.',
      interpretation: 'Elevated levels suggest allergy or parasitic infection.',
      causes: {
        increased: ['Allergic disorders', 'Parasitic infections', 'Atopic dermatitis', 'Asthma', 'Food allergies'],
        decreased: ['Normal immune function', 'Immunodeficiency', 'Successful treatment']
      },
      relatedTests: ['Specific IgE', 'Skin Testing', 'Allergy Panel', 'Eosinophil Count'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    },

    {
      id: 'alpha-1-antitrypsin-level',
      testName: 'Alpha 1-Antitrypsin Level',
      category: 'biochemistry',
      subcategory: 'protein-analysis',
      specimen: '3-5 cc Clotted Blood or Serum',
      normalRange: {
        male: '90-200 mg/dL',
        female: '90-200 mg/dL',
        children: '90-200 mg/dL',
        units: 'mg/dL'
      },
      criticalValues: {
        low: '< 50 mg/dL',
        high: '> 300 mg/dL'
      },
      clinicalSignificance: 'Assessment of alpha-1-antitrypsin deficiency and liver disease.',
      interpretation: 'Low levels suggest deficiency, high levels suggest inflammation.',
      causes: {
        increased: ['Inflammation', 'Infection', 'Pregnancy', 'Oral contraceptives', 'Stress'],
        decreased: ['Alpha-1-antitrypsin deficiency', 'Liver disease', 'Genetic factors']
      },
      relatedTests: ['Liver Function Tests', 'Phenotyping', 'Lung Function Tests', 'Genetic Testing'],
      preparation: 'Fasting not required',
      methodology: 'Immunoassay',
      turnaroundTime: '96 hours'
    }
  ];

  const filteredTests = diagnosticTests.filter(test => {
    const matchesSearch = searchTerm === '' ||
      test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.clinicalSignificance.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.interpretation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test.relatedTests.some(rt => rt.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || test.category === selectedCategory;
    const matchesSubcategory = selectedSubcategory === 'all' || test.subcategory === selectedSubcategory;
    const matchesBookmark = !showBookmarksOnly || bookmarkedItems.has(test.id);
    const matchesCritical = !showCriticalOnly || (test.criticalValues.low || test.criticalValues.high);

    return matchesSearch && matchesCategory && matchesSubcategory && matchesBookmark && matchesCritical;
  });

  const toggleExpanded = (testId: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedItems(newExpanded);
  };

  const toggleBookmark = (testId: string) => {
    const newBookmarked = new Set(bookmarkedItems);
    if (newBookmarked.has(testId)) {
      newBookmarked.delete(testId);
    } else {
      newBookmarked.add(testId);
    }
    setBookmarkedItems(newBookmarked);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'hematology': return 'red';
      case 'biochemistry': return 'blue';
      case 'immunology': return 'green';
      case 'microbiology': return 'purple';
      case 'molecular': return 'orange';
      case 'urinalysis': return 'teal';
      case 'coagulation': return 'pink';
      case 'hormones': return 'indigo';
      case 'tumor-markers': return 'yellow';
      case 'cardiac': return 'rose';
      default: return 'gray';
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Diagnostic Knowledge Hub</h1>
          <p className="text-gray-600">Comprehensive reference for laboratory diagnostic tests, ranges, and interpretation</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Tests</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by test name, significance, or related tests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Categories</option>
                <option value="hematology">Hematology</option>
                <option value="biochemistry">Biochemistry</option>
                <option value="immunology">Immunology</option>
                <option value="microbiology">Microbiology</option>
                <option value="molecular">Molecular</option>
                <option value="urinalysis">Urinalysis</option>
                <option value="coagulation">Coagulation</option>
                <option value="hormones">Hormones</option>
                <option value="tumor-markers">Tumor Markers</option>
                <option value="cardiac">Cardiac</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory</label>
              <select
                value={selectedSubcategory}
                onChange={(e) => setSelectedSubcategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Subcategories</option>
                {Array.from(new Set(diagnosticTests
                  .filter(test => selectedCategory === 'all' || test.category === selectedCategory)
                  .map(test => test.subcategory)))
                  .sort()
                  .map(subcategory => (
                    <option key={subcategory} value={subcategory}>{subcategory}</option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col space-y-2">
              <label className="block text-sm font-medium text-gray-700">Filters</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showBookmarksOnly}
                    onChange={(e) => setShowBookmarksOnly(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Bookmarks Only</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showCriticalOnly}
                    onChange={(e) => setShowCriticalOnly(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="text-sm">Critical Tests Only</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              {filteredTests.length} Test{filteredTests.length !== 1 ? 's' : ''} Found
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredTests.map((test) => (
              <div key={test.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`p-2 rounded-lg bg-${getCategoryColor(test.category)}-100`}>
                        <TestTube className={`w-5 h-5 text-${getCategoryColor(test.category)}-600`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{test.testName}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="capitalize">{test.category.replace('-', ' ')}</span>
                          <span>•</span>
                          <span className="capitalize">{test.subcategory.replace('-', ' ')}</span>
                          <span>•</span>
                          <span>{test.specimen}</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-gray-600 mb-3">{test.clinicalSignificance}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Normal Range</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {test.normalRange.male && <div>Male: {test.normalRange.male}</div>}
                          {test.normalRange.female && <div>Female: {test.normalRange.female}</div>}
                          {test.normalRange.children && <div>Children: {test.normalRange.children}</div>}
                          {test.normalRange.elderly && <div>Elderly: {test.normalRange.elderly}</div>}
                          <div className="font-medium">Units: {test.normalRange.units}</div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Critical Values</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          {test.criticalValues.low && <div>Low: {test.criticalValues.low}</div>}
                          {test.criticalValues.high && <div>High: {test.criticalValues.high}</div>}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Methodology & Turnaround</h4>
                        <div className="text-sm text-gray-600 space-y-1">
                          <div>{test.methodology}</div>
                          <div>{test.turnaroundTime}</div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mb-4">
                      <button
                        onClick={() => {
                          console.log('Toggle expanded clicked for:', test.id);
                          toggleExpanded(test.id);
                        }}
                        className="flex items-center text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors duration-200 cursor-pointer border border-blue-200 hover:border-blue-300"
                      >
                        {expandedItems.has(test.id) ? (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronRight className="w-4 h-4 mr-1" />
                            Show More
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => toggleBookmark(test.id)}
                        className={`flex items-center text-sm font-medium px-3 py-2 rounded-lg transition-colors duration-200 cursor-pointer ${
                          bookmarkedItems.has(test.id)
                            ? 'text-yellow-600 hover:text-yellow-800 hover:bg-yellow-50'
                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 mr-1 ${bookmarkedItems.has(test.id) ? 'fill-current' : ''}`} />
                        {bookmarkedItems.has(test.id) ? 'Bookmarked' : 'Bookmark'}
                      </button>

                      {(test.criticalValues.low || test.criticalValues.high) && (
                        <span className="flex items-center text-red-600 text-sm font-medium">
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Critical Test
                        </span>
                      )}
                    </div>

                    {expandedItems.has(test.id) && (
                      <div className="border-t border-gray-200 pt-4 space-y-4 animate-fade-in-up bg-gray-50 rounded-lg p-4">
                        <div>
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Interpretation
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{test.interpretation}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-white p-3 rounded-lg border border-green-200">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Causes of Increased Levels
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {test.causes.increased.map((cause, index) => (
                                <li key={index} className="flex items-start">
                                  <TrendingUp className="w-4 h-4 mr-2 mt-0.5 text-green-600 flex-shrink-0" />
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="bg-white p-3 rounded-lg border border-red-200">
                            <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                              <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                              Causes of Decreased Levels
                            </h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {test.causes.decreased.map((cause, index) => (
                                <li key={index} className="flex items-start">
                                  <TrendingDown className="w-4 h-4 mr-2 mt-0.5 text-red-600 flex-shrink-0" />
                                  {cause}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-blue-200">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                            Related Tests
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {test.relatedTests.map((relatedTest, index) => (
                              <span
                                key={index}
                                className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full hover:bg-blue-200 transition-colors duration-200 cursor-pointer"
                              >
                                {relatedTest}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-white p-3 rounded-lg border border-purple-200">
                          <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                            <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                            Preparation
                          </h4>
                          <p className="text-gray-600 leading-relaxed">{test.preparation}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticKnowledgeHub;