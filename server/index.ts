// .env file se environment variables load karta hai
import 'dotenv/config';

// Express backend/API server ke liye
import express from 'express';

import cors from 'cors';

// Supabase database connection
import { supabase } from './db/supabase';

// Withdrawal calculation ke functions
import {
  calculateClearanceDate,
  getWithdrawalStatus,
} from './services/withdrawalService';


const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ---------------------------------------------------------
// HEALTH CHECK
// ---------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', message: 'PALYA backend is running' });
});


// ---------------------------------------------------------
// DATABASE CONNECTION TEST
// ---------------------------------------------------------
app.get('/api/test-db', async (_req, res) => {
  const { data, error } = await supabase.from('animals').select('*').limit(1);
  if (error) return res.status(500).json({ status: 'error', message: error.message });
  res.json({ status: 'ok', message: 'Supabase connected', data });
});


// ---------------------------------------------------------
// GET ALL MEDICINES
// ---------------------------------------------------------
app.get('/api/medicines', async (_req, res) => {
  const { data, error } = await supabase.from('medicines').select('*');
  if (error) return res.status(500).json({ status: 'error', message: error.message });
  res.json({ status: 'ok', data });
});


// ---------------------------------------------------------
// GET ALL TREATMENTS
// ---------------------------------------------------------
app.get('/api/treatments', async (_req, res) => {
  const { data, error } = await supabase
    .from('treatments')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return res.status(500).json({ status: 'error', message: error.message });
  res.json({ status: 'ok', data });
});


// ---------------------------------------------------------
// SAVE LAB TEST RESULT (detected residue) FOR A TREATMENT
// ---------------------------------------------------------
app.patch('/api/treatments/:id/residue', async (req, res) => {
  const treatmentId = Number(req.params.id);
  const { detected_residue } = req.body;

  if (typeof detected_residue !== 'number' || detected_residue < 0) {
    return res.status(400).json({ status: 'error', message: 'detected_residue must be a valid non-negative number' });
  }

  const { data: treatment, error: treatmentError } = await supabase
    .from('treatments').select('*').eq('id', treatmentId).single();

  if (treatmentError || !treatment) {
    return res.status(404).json({ status: 'error', message: 'Treatment not found' });
  }

  const { data: medicine, error: medicineError } = await supabase
    .from('medicines').select('*').eq('drug', treatment.drug).single();

  if (medicineError || !medicine) {
    return res.status(404).json({ status: 'error', message: `Medicine "${treatment.drug}" not found in medicines table` });
  }

  const WARNING_THRESHOLD = 0.8;
  let mrlStatus: 'within_limit' | 'warning' | 'violation';

  if (detected_residue > medicine.mrl) mrlStatus = 'violation';
  else if (detected_residue >= medicine.mrl * WARNING_THRESHOLD) mrlStatus = 'warning';
  else mrlStatus = 'within_limit';

  const { data: updated, error: updateError } = await supabase
    .from('treatments').update({ detected_residue }).eq('id', treatmentId).select().single();

  if (updateError) return res.status(500).json({ status: 'error', message: updateError.message });

  res.json({
    status: 'ok',
    data: { ...updated, mrl_status: mrlStatus, mrl_limit: medicine.mrl, mrl_unit: medicine.unit },
  });
});


// ---------------------------------------------------------
// AMU (ANTIMICROBIAL USAGE) SUMMARY
// ---------------------------------------------------------
app.get('/api/amu-summary', async (_req, res) => {
  const { data: treatments, error } = await supabase.from('treatments').select('*');
  if (error) return res.status(500).json({ status: 'error', message: error.message });

  const allTreatments = treatments || [];
  const antibioticTreatments = allTreatments.filter((t) => t.category === 'Antibiotic');

  const drugCounts: Record<string, number> = {};
  for (const t of antibioticTreatments) {
    drugCounts[t.drug] = (drugCounts[t.drug] || 0) + 1;
  }

  const totalAntibiotics = antibioticTreatments.length;
  const drugBreakdown = Object.entries(drugCounts)
    .map(([drug, count]) => ({
      drug, count,
      percentage: totalAntibiotics > 0 ? Math.round((count / totalAntibiotics) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);

  const mostUsedDrug = drugBreakdown.length > 0 ? drugBreakdown[0] : null;

  const monthCounts: Record<string, number> = {};
  for (const t of antibioticTreatments) {
    if (!t.start_date) continue;
    const month = t.start_date.substring(0, 7);
    monthCounts[month] = (monthCounts[month] || 0) + 1;
  }

  const monthlyTrend = Object.entries(monthCounts)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => a.month.localeCompare(b.month));

  res.json({
    status: 'ok',
    data: {
      totalAllTreatments: allTreatments.length,
      totalAntibioticTreatments: totalAntibiotics,
      drugBreakdown, mostUsedDrug, monthlyTrend,
    },
  });
});


// ---------------------------------------------------------
// REAL ALERTS
// ---------------------------------------------------------
app.get('/api/alerts', async (_req, res) => {
  const { data: treatments, error: tError } = await supabase.from('treatments').select('*');
  const { data: medicines, error: mError } = await supabase.from('medicines').select('*');

  if (tError || mError) {
    return res.status(500).json({ status: 'error', message: (tError || mError)?.message });
  }

  const allTreatments = treatments || [];
  const allMedicines = medicines || [];
  const alerts: any[] = [];
  const today = new Date();

  for (const t of allTreatments) {
    if (t.clearance_date && new Date(t.clearance_date) > today) {
      alerts.push({
        id: `withdrawal-${t.id}`, type: 'critical', title: 'Active Withdrawal Clock',
        animalId: t.animal_id,
        description: `${t.drug} administered. Milk/meat withholding mandatory until ${t.clearance_date}.`,
        timestamp: t.last_dose_date,
      });
    }
  }

  for (const t of allTreatments) {
    if (t.detected_residue === null || t.detected_residue === undefined) continue;
    const medicine = allMedicines.find((m) => m.drug === t.drug);
    if (!medicine) continue;

    if (t.detected_residue > medicine.mrl) {
      alerts.push({
        id: `mrl-violation-${t.id}`, type: 'critical', title: 'MRL Violation Detected',
        animalId: t.animal_id,
        description: `Detected residue ${t.detected_residue} ${medicine.unit} exceeds allowed limit ${medicine.mrl} ${medicine.unit} for ${t.drug}.`,
        timestamp: t.last_dose_date,
      });
    } else if (t.detected_residue >= medicine.mrl * 0.8) {
      alerts.push({
        id: `mrl-warning-${t.id}`, type: 'warning', title: 'MRL Warning — Close to Limit',
        animalId: t.animal_id,
        description: `Detected residue ${t.detected_residue} ${medicine.unit} is close to allowed limit ${medicine.mrl} ${medicine.unit} for ${t.drug}.`,
        timestamp: t.last_dose_date,
      });
    }
  }

  const byAnimal: Record<string, typeof allTreatments> = {};
  for (const t of allTreatments) {
    if (!byAnimal[t.animal_id]) byAnimal[t.animal_id] = [];
    byAnimal[t.animal_id].push(t);
  }

  for (const animalId in byAnimal) {
    const animalTreatments = byAnimal[animalId].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    for (let i = 1; i < animalTreatments.length; i++) {
      const daysBetween =
        (new Date(animalTreatments[i].start_date).getTime() - new Date(animalTreatments[i - 1].start_date).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysBetween <= 30) {
        alerts.push({
          id: `repeated-${animalTreatments[i].id}`, type: 'action_required', title: 'Repeated Treatment Within 30 Days',
          animalId,
          description: `${animalId} treated again within ${Math.round(daysBetween)} days of previous treatment. Review for underlying cause.`,
          timestamp: animalTreatments[i].start_date,
        });
        break;
      }
    }
  }

  alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json({ status: 'ok', data: alerts });
});


// ---------------------------------------------------------
// STEWARDSHIP / RISK SCORE
// 100 se start, real issues ke hisaab se deduct karta hai.
// URL: http://localhost:5000/api/stewardship-score
// ---------------------------------------------------------
app.get('/api/stewardship-score', async (_req, res) => {

  const { data: treatments, error: tError } = await supabase.from('treatments').select('*');
  const { data: medicines, error: mError } = await supabase.from('medicines').select('*');

  if (tError || mError) {
    return res.status(500).json({ status: 'error', message: (tError || mError)?.message });
  }

  const allTreatments = treatments || [];
  const allMedicines = medicines || [];
  const today = new Date();

  let violations = 0;
  let warnings = 0;
  let repeatedCount = 0;
  let activeWithdrawals = 0;

  for (const t of allTreatments) {
    if (t.clearance_date && new Date(t.clearance_date) > today) {
      activeWithdrawals++;
    }

    if (t.detected_residue !== null && t.detected_residue !== undefined) {
      const medicine = allMedicines.find((m) => m.drug === t.drug);
      if (medicine) {
        if (t.detected_residue > medicine.mrl) violations++;
        else if (t.detected_residue >= medicine.mrl * 0.8) warnings++;
      }
    }
  }

  const byAnimal: Record<string, typeof allTreatments> = {};
  for (const t of allTreatments) {
    if (!byAnimal[t.animal_id]) byAnimal[t.animal_id] = [];
    byAnimal[t.animal_id].push(t);
  }

  for (const animalId in byAnimal) {
    const sorted = byAnimal[animalId].sort(
      (a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
    );
    for (let i = 1; i < sorted.length; i++) {
      const daysBetween =
        (new Date(sorted[i].start_date).getTime() - new Date(sorted[i - 1].start_date).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysBetween <= 30) {
        repeatedCount++;
        break;
      }
    }
  }

  let score = 100;
  score -= violations * 15;
  score -= warnings * 5;
  score -= repeatedCount * 10;
  score -= activeWithdrawals * 2;
  score = Math.max(0, Math.min(100, score));

  let rating: string;
  if (score >= 85) rating = 'Excellent';
  else if (score >= 70) rating = 'Good';
  else if (score >= 50) rating = 'Needs Attention';
  else rating = 'Poor';

  res.json({
    status: 'ok',
    data: {
      score,
      rating,
      factors: {
        mrlViolations: violations,
        mrlWarnings: warnings,
        repeatedTreatments: repeatedCount,
        activeWithdrawals,
      },
      totalTreatments: allTreatments.length,
    },
  });
});


// ---------------------------------------------------------
// WITHDRAWAL LOGIC TEST
// ---------------------------------------------------------
app.get('/api/test-withdrawal', (_req, res) => {
  const lastDoseDate = '2026-08-18';
  const withdrawalDays = 5;
  const clearanceDate = calculateClearanceDate(lastDoseDate, withdrawalDays);
  const withdrawal = getWithdrawalStatus(clearanceDate);
  res.json({ lastDoseDate, withdrawalDays, clearanceDate, ...withdrawal });
});


// ---------------------------------------------------------
// ACTUAL ANIMAL WITHDRAWAL STATUS
// ---------------------------------------------------------
app.get('/api/withdrawal/:animalId', async (req, res) => {
  const { animalId } = req.params;

  const { data, error } = await supabase
    .from('treatments')
    .select('last_dose_date, withdrawal_days')
    .eq('animal_id', animalId)
    .order('last_dose_date', { ascending: false })
    .limit(1)
    .single();

  if (error) return res.status(500).json({ status: 'error', message: error.message });

  const clearanceDate = calculateClearanceDate(data.last_dose_date, data.withdrawal_days);
  const withdrawal = getWithdrawalStatus(clearanceDate);

  res.json({
    animalId,
    lastDoseDate: data.last_dose_date,
    withdrawalDays: data.withdrawal_days,
    clearanceDate,
    ...withdrawal,
  });
});


// ---------------------------------------------------------
// SAVE NEW TREATMENT
// ---------------------------------------------------------
app.post('/api/treatments', async (req, res) => {
  const {
    animal_id, drug, active_ingredient, category, dosage, dose_value, dose_unit,
    route, frequency, start_date, end_date, last_dose_date, withdrawal_days,
    veterinarian, status, notes,
  } = req.body;

  const clearance_date = calculateClearanceDate(last_dose_date, withdrawal_days);

  const { data, error } = await supabase
    .from('treatments')
    .insert({
      animal_id, drug, active_ingredient, category, dosage, dose_value, dose_unit,
      route, frequency, start_date, end_date, last_dose_date, withdrawal_days,
      clearance_date, veterinarian, status, notes,
    })
    .select()
    .single();

  if (error) return res.status(500).json({ status: 'error', message: error.message });

  res.status(201).json({ status: 'ok', message: 'Treatment saved successfully', data });
});


// ---------------------------------------------------------
// START BACKEND SERVER
// ---------------------------------------------------------
app.listen(PORT, () => {
  console.log(`PALYA backend running at http://localhost:${PORT}`);
});