import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { supabase } from './db/supabase';

import {
  calculateClearanceDate,
  getWithdrawalStatus,
} from './services/withdrawalService';

/* =========================================================
   PALYA BACKEND
========================================================= */

const app = express();

const PORT =
  Number(process.env.PORT) || 5000;

app.use(cors());

app.use(
  express.json({
    limit: '10mb',
  })
);

/* =========================================================
   HEALTH CHECK
========================================================= */

app.get('/api/health', (_req, res) => {
  return res.json({
    status: 'ok',
    message: 'PALYA backend is running',
  });
});

/* =========================================================
   ANIMALS
========================================================= */

/* ---------------------------------------------------------
   REGISTER ANIMAL
--------------------------------------------------------- */

app.post('/api/animals', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('animals')
      .insert([req.body])
      .select()
      .single();

    if (error) {
      throw error;
    }

    return res.status(201).json(data);

  } catch (error) {
    console.error(
      'Animal registration error:',
      error
    );

    return res.status(500).json({
      error: 'Failed to register animal',
    });
  }
});

/* ---------------------------------------------------------
   GET ALL ANIMALS
--------------------------------------------------------- */

app.get('/api/animals', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    return res.json(data || []);

  } catch (error) {
    console.error(
      'Fetch animals error:',
      error
    );

    return res.status(500).json({
      error: 'Failed to fetch animals',
    });
  }
});

/* ---------------------------------------------------------
   DELETE ANIMAL
--------------------------------------------------------- */

app.delete(
  '/api/animals/:animalId',
  async (req, res) => {
    try {
      const { animalId } = req.params;

      if (!animalId) {
        return res.status(400).json({
          status: 'error',
          message: 'Animal ID is required',
        });
      }

      /*
        Check animal exists.
      */

      const {
        data: animal,
        error: lookupError,
      } = await supabase
        .from('animals')
        .select('id')
        .eq('id', animalId)
        .maybeSingle();

      if (lookupError) {
        throw lookupError;
      }

      if (!animal) {
        return res.status(404).json({
          status: 'error',
          message: 'Animal not found',
        });
      }

      /*
        Delete treatments first to avoid
        foreign-key conflict.
      */

      const {
        error: treatmentDeleteError,
      } = await supabase
        .from('treatments')
        .delete()
        .eq('animal_id', animalId);

      if (treatmentDeleteError) {
        console.error(
          'Treatment delete error:',
          treatmentDeleteError
        );

        return res.status(500).json({
          status: 'error',
          message:
            treatmentDeleteError.message,
        });
      }

      /*
        Delete animal.
      */

      const {
        error: animalDeleteError,
      } = await supabase
        .from('animals')
        .delete()
        .eq('id', animalId);

      if (animalDeleteError) {
        throw animalDeleteError;
      }

      return res.json({
        status: 'ok',
        message:
          `Animal ${animalId} deleted successfully`,
      });

    } catch (error) {
      console.error(
        'Animal delete error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to delete animal',
      });
    }
  }
);

/* =========================================================
   DATABASE TEST
========================================================= */

app.get('/api/test-db', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('animals')
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }

    return res.json({
      status: 'ok',
      message: 'Supabase connected',
      data,
    });

  } catch (error) {
    console.error(
      'Database connection error:',
      error
    );

    return res.status(500).json({
      status: 'error',

      message:
        error instanceof Error
          ? error.message
          : 'Database connection failed',
    });
  }
});

/* =========================================================
   MEDICINES
========================================================= */

app.get('/api/medicines', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('medicines')
      .select('*');

    if (error) {
      throw error;
    }

    return res.json({
      status: 'ok',
      data: data || [],
    });

  } catch (error) {
    console.error(
      'Medicine fetch error:',
      error
    );

    return res.status(500).json({
      status: 'error',

      message:
        error instanceof Error
          ? error.message
          : 'Failed to fetch medicines',
    });
  }
});

/* =========================================================
   TREATMENTS
========================================================= */

/* ---------------------------------------------------------
   GET ALL TREATMENTS
--------------------------------------------------------- */

app.get(
  '/api/treatments',
  async (_req, res) => {
    try {
      const { data, error } = await supabase
        .from('treatments')
        .select('*')
        .order('created_at', {
          ascending: false,
        });

      if (error) {
        throw error;
      }

      return res.json({
        status: 'ok',
        data: data || [],
      });

    } catch (error) {
      console.error(
        'Treatment fetch error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to fetch treatments',
      });
    }
  }
);

/* ---------------------------------------------------------
   SAVE NEW TREATMENT
--------------------------------------------------------- */

app.post(
  '/api/treatments',
  async (req, res) => {
    try {
      const {
        animal_id,
        drug,
        active_ingredient,
        category,
        dosage,
        dose_value,
        dose_unit,
        route,
        frequency,
        start_date,
        end_date,
        last_dose_date,
        withdrawal_days,
        veterinarian,
        status,
        notes,
      } = req.body;

      if (
        !animal_id ||
        !drug ||
        !last_dose_date
      ) {
        return res.status(400).json({
          status: 'error',

          message:
            'animal_id, drug and last_dose_date are required',
        });
      }

      const safeWithdrawalDays =
        Number(withdrawal_days) || 0;

      const clearance_date =
        calculateClearanceDate(
          last_dose_date,
          safeWithdrawalDays
        );

      const { data, error } = await supabase
        .from('treatments')
        .insert({
          animal_id,
          drug,
          active_ingredient,
          category,
          dosage,
          dose_value,
          dose_unit,
          route,
          frequency,
          start_date,
          end_date,
          last_dose_date,

          withdrawal_days:
            safeWithdrawalDays,

          clearance_date,

          veterinarian,
          status,
          notes,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      return res.status(201).json({
        status: 'ok',
        message:
          'Treatment saved successfully',
        data,
      });

    } catch (error) {
      console.error(
        'Treatment save error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to save treatment',
      });
    }
  }
);

/* =========================================================
   LAB RESIDUE / MRL
========================================================= */

app.patch(
  '/api/treatments/:id/residue',
  async (req, res) => {
    try {
      const treatmentId =
        Number(req.params.id);

      const {
        detected_residue,
      } = req.body;

      if (
        !Number.isFinite(treatmentId)
      ) {
        return res.status(400).json({
          status: 'error',
          message:
            'Invalid treatment ID',
        });
      }

      if (
        typeof detected_residue !==
          'number' ||
        detected_residue < 0
      ) {
        return res.status(400).json({
          status: 'error',

          message:
            'detected_residue must be a valid non-negative number',
        });
      }

      const {
        data: treatment,
        error: treatmentError,
      } = await supabase
        .from('treatments')
        .select('*')
        .eq('id', treatmentId)
        .maybeSingle();

      if (treatmentError) {
        throw treatmentError;
      }

      if (!treatment) {
        return res.status(404).json({
          status: 'error',
          message:
            'Treatment not found',
        });
      }

      const {
        data: medicine,
        error: medicineError,
      } = await supabase
        .from('medicines')
        .select('*')
        .eq('drug', treatment.drug)
        .maybeSingle();

      if (medicineError) {
        throw medicineError;
      }

      if (!medicine) {
        return res.status(404).json({
          status: 'error',

          message:
            `Medicine "${treatment.drug}" not found`,
        });
      }

      const mrl =
        Number(medicine.mrl) || 0;

      let mrlStatus:
        | 'within_limit'
        | 'warning'
        | 'violation';

      /*
        MRL = 0 means regulatory value
        not verified in demo database.
      */

      if (mrl <= 0) {
        mrlStatus =
          'within_limit';

      } else if (
        detected_residue > mrl
      ) {
        mrlStatus =
          'violation';

      } else if (
        detected_residue >=
        mrl * 0.8
      ) {
        mrlStatus =
          'warning';

      } else {
        mrlStatus =
          'within_limit';
      }

      const {
        data: updated,
        error: updateError,
      } = await supabase
        .from('treatments')
        .update({
          detected_residue,
        })
        .eq('id', treatmentId)
        .select()
        .single();

      if (updateError) {
        throw updateError;
      }

      return res.json({
        status: 'ok',

        data: {
          ...updated,

          mrl_status:
            mrlStatus,

          mrl_limit:
            mrl,

          mrl_unit:
            medicine.unit,
        },
      });

    } catch (error) {
      console.error(
        'Residue update error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to update residue result',
      });
    }
  }
);

/* =========================================================
   AMU SUMMARY
========================================================= */

app.get(
  '/api/amu-summary',
  async (_req, res) => {
    try {
      const {
        data: treatments,
        error,
      } = await supabase
        .from('treatments')
        .select('*');

      if (error) {
        throw error;
      }

      const allTreatments =
        treatments || [];

      const antibioticTreatments =
        allTreatments.filter(
          (t) =>
            t.category ===
            'Antibiotic'
        );

      const drugCounts:
        Record<string, number> = {};

      for (
        const treatment
        of antibioticTreatments
      ) {
        drugCounts[
          treatment.drug
        ] =
          (
            drugCounts[
              treatment.drug
            ] || 0
          ) + 1;
      }

      const totalAntibiotics =
        antibioticTreatments.length;

      const drugBreakdown =
        Object.entries(drugCounts)
          .map(
            ([drug, count]) => ({
              drug,
              count,

              percentage:
                totalAntibiotics > 0
                  ? Math.round(
                      (
                        count /
                        totalAntibiotics
                      ) *
                      100
                    )
                  : 0,
            })
          )
          .sort(
            (a, b) =>
              b.count - a.count
          );

      const mostUsedDrug =
        drugBreakdown.length > 0
          ? drugBreakdown[0]
          : null;

      const monthCounts:
        Record<string, number> = {};

      for (
        const treatment
        of antibioticTreatments
      ) {
        if (!treatment.start_date) {
          continue;
        }

        const month =
          treatment.start_date.substring(
            0,
            7
          );

        monthCounts[month] =
          (
            monthCounts[month] || 0
          ) + 1;
      }

      const monthlyTrend =
        Object.entries(monthCounts)
          .map(
            ([month, count]) => ({
              month,
              count,
            })
          )
          .sort(
            (a, b) =>
              a.month.localeCompare(
                b.month
              )
          );

      return res.json({
        status: 'ok',

        data: {
          totalAllTreatments:
            allTreatments.length,

          totalAntibioticTreatments:
            totalAntibiotics,

          drugBreakdown,
          mostUsedDrug,
          monthlyTrend,
        },
      });

    } catch (error) {
      console.error(
        'AMU summary error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to calculate AMU summary',
      });
    }
  }
);

/* =========================================================
   ALERTS
========================================================= */

app.get('/api/alerts', async (_req, res) => {
  try {
    const {
      data: treatments,
      error: tError,
    } = await supabase
      .from('treatments')
      .select('*');

    const {
      data: medicines,
      error: mError,
    } = await supabase
      .from('medicines')
      .select('*');

    if (tError) {
      throw tError;
    }

    if (mError) {
      throw mError;
    }

    const allTreatments =
      treatments || [];

    const allMedicines =
      medicines || [];

    const alerts: any[] = [];

    const today =
      new Date();

    /* -------------------------------------------------------
       ACTIVE WITHDRAWALS
    ------------------------------------------------------- */

    for (
      const treatment
      of allTreatments
    ) {
      if (
        treatment.clearance_date &&
        new Date(
          treatment.clearance_date
        ) > today
      ) {
        alerts.push({
          id:
            `withdrawal-${treatment.id}`,

          type:
            'critical',

          title:
            'Active Withdrawal Clock',

          animalId:
            treatment.animal_id,

          description:
            `${treatment.drug} treatment recorded. Food-chain withdrawal remains active until ${treatment.clearance_date}.`,

          timestamp:
            treatment.last_dose_date,
        });
      }
    }

    /* -------------------------------------------------------
       MRL ALERTS
    ------------------------------------------------------- */

    for (
      const treatment
      of allTreatments
    ) {
      if (
        treatment.detected_residue ===
          null ||
        treatment.detected_residue ===
          undefined
      ) {
        continue;
      }

      const medicine =
        allMedicines.find(
          (m) =>
            m.drug ===
            treatment.drug
        );

      if (!medicine) {
        continue;
      }

      const mrl =
        Number(medicine.mrl) || 0;

      /*
        Ignore unverified MRL = 0.
      */

      if (mrl <= 0) {
        continue;
      }

      if (
        treatment.detected_residue >
        mrl
      ) {
        alerts.push({
          id:
            `mrl-violation-${treatment.id}`,

          type:
            'critical',

          title:
            'MRL Violation Detected',

          animalId:
            treatment.animal_id,

          description:
            `Detected residue ${treatment.detected_residue} ${medicine.unit} exceeds recorded limit ${mrl} ${medicine.unit} for ${treatment.drug}.`,

          timestamp:
            treatment.last_dose_date,
        });

      } else if (
        treatment.detected_residue >=
        mrl * 0.8
      ) {
        alerts.push({
          id:
            `mrl-warning-${treatment.id}`,

          type:
            'warning',

          title:
            'MRL Warning — Close to Limit',

          animalId:
            treatment.animal_id,

          description:
            `Detected residue ${treatment.detected_residue} ${medicine.unit} is close to recorded limit ${mrl} ${medicine.unit} for ${treatment.drug}.`,

          timestamp:
            treatment.last_dose_date,
        });
      }
    }

    /* -------------------------------------------------------
       REPEATED TREATMENT ALERT
    ------------------------------------------------------- */

    const byAnimal:
      Record<
        string,
        typeof allTreatments
      > = {};

    for (
      const treatment
      of allTreatments
    ) {
      if (
        !byAnimal[
          treatment.animal_id
        ]
      ) {
        byAnimal[
          treatment.animal_id
        ] = [];
      }

      byAnimal[
        treatment.animal_id
      ].push(treatment);
    }

    for (
      const animalId
      in byAnimal
    ) {
      const animalTreatments =
        byAnimal[animalId]
          .filter(
            (t) =>
              t.start_date
          )
          .sort(
            (a, b) =>
              new Date(
                a.start_date
              ).getTime() -
              new Date(
                b.start_date
              ).getTime()
          );

      for (
        let i = 1;
        i <
        animalTreatments.length;
        i++
      ) {
        const previous =
          new Date(
            animalTreatments[
              i - 1
            ].start_date
          );

        const current =
          new Date(
            animalTreatments[
              i
            ].start_date
          );

        const daysBetween =
          (
            current.getTime() -
            previous.getTime()
          ) /
          (
            1000 *
            60 *
            60 *
            24
          );

        if (
          daysBetween <= 30
        ) {
          alerts.push({
            id:
              `repeated-${animalTreatments[i].id}`,

            type:
              'action_required',

            title:
              'Repeated Treatment Within 30 Days',

            animalId,

            description:
              `${animalId} has another treatment record within ${Math.round(
                daysBetween
              )} days. Veterinary review is recommended.`,

            timestamp:
              animalTreatments[
                i
              ].start_date,
          });

          break;
        }
      }
    }

    alerts.sort(
      (a, b) =>
        new Date(
          b.timestamp || 0
        ).getTime() -
        new Date(
          a.timestamp || 0
        ).getTime()
    );

    return res.json({
      status: 'ok',
      data: alerts,
    });

  } catch (error) {
    console.error(
      'Alerts error:',
      error
    );

    return res.status(500).json({
      status: 'error',

      message:
        error instanceof Error
          ? error.message
          : 'Failed to generate alerts',
    });
  }
});

/* =========================================================
   STEWARDSHIP SCORE
========================================================= */

app.get(
  '/api/stewardship-score',
  async (_req, res) => {
    try {
      const {
        data: treatments,
        error: tError,
      } = await supabase
        .from('treatments')
        .select('*');

      const {
        data: medicines,
        error: mError,
      } = await supabase
        .from('medicines')
        .select('*');

      if (tError) {
        throw tError;
      }

      if (mError) {
        throw mError;
      }

      const allTreatments =
        treatments || [];

      const allMedicines =
        medicines || [];

      const today =
        new Date();

      let violations = 0;
      let warnings = 0;
      let repeatedCount = 0;
      let activeWithdrawals = 0;

      /* -----------------------------------------------------
         MRL + WITHDRAWAL FACTORS
      ----------------------------------------------------- */

      for (
        const treatment
        of allTreatments
      ) {
        if (
          treatment.clearance_date &&
          new Date(
            treatment.clearance_date
          ) > today
        ) {
          activeWithdrawals++;
        }

        if (
          treatment.detected_residue ===
            null ||
          treatment.detected_residue ===
            undefined
        ) {
          continue;
        }

        const medicine =
          allMedicines.find(
            (m) =>
              m.drug ===
              treatment.drug
          );

        if (!medicine) {
          continue;
        }

        const mrl =
          Number(
            medicine.mrl
          ) || 0;

        if (mrl <= 0) {
          continue;
        }

        if (
          treatment.detected_residue >
          mrl
        ) {
          violations++;

        } else if (
          treatment.detected_residue >=
          mrl * 0.8
        ) {
          warnings++;
        }
      }

      /* -----------------------------------------------------
         REPEATED TREATMENTS
      ----------------------------------------------------- */

      const byAnimal:
        Record<
          string,
          typeof allTreatments
        > = {};

      for (
        const treatment
        of allTreatments
      ) {
        if (
          !byAnimal[
            treatment.animal_id
          ]
        ) {
          byAnimal[
            treatment.animal_id
          ] = [];
        }

        byAnimal[
          treatment.animal_id
        ].push(treatment);
      }

      for (
        const animalId
        in byAnimal
      ) {
        const sorted =
          byAnimal[animalId]
            .filter(
              (t) =>
                t.start_date
            )
            .sort(
              (a, b) =>
                new Date(
                  a.start_date
                ).getTime() -
                new Date(
                  b.start_date
                ).getTime()
            );

        for (
          let i = 1;
          i < sorted.length;
          i++
        ) {
          const daysBetween =
            (
              new Date(
                sorted[
                  i
                ].start_date
              ).getTime() -
              new Date(
                sorted[
                  i - 1
                ].start_date
              ).getTime()
            ) /
            (
              1000 *
              60 *
              60 *
              24
            );

          if (
            daysBetween <=
            30
          ) {
            repeatedCount++;
            break;
          }
        }
      }

      /* -----------------------------------------------------
         SCORE
      ----------------------------------------------------- */

      let score = 100;

      score -=
        violations * 15;

      score -=
        warnings * 5;

      score -=
        repeatedCount * 10;

      score -=
        activeWithdrawals * 2;

      score =
        Math.max(
          0,
          Math.min(
            100,
            score
          )
        );

      let rating:
        string;

      if (
        score >= 85
      ) {
        rating =
          'Excellent';

      } else if (
        score >= 70
      ) {
        rating =
          'Good';

      } else if (
        score >= 50
      ) {
        rating =
          'Needs Attention';

      } else {
        rating =
          'Poor';
      }

      return res.json({
        status: 'ok',

        data: {
          score,
          rating,

          factors: {
            mrlViolations:
              violations,

            mrlWarnings:
              warnings,

            repeatedTreatments:
              repeatedCount,

            activeWithdrawals,
          },

          totalTreatments:
            allTreatments.length,
        },
      });

    } catch (error) {
      console.error(
        'Stewardship score error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to calculate stewardship score',
      });
    }
  }
);

/* =========================================================
   WITHDRAWAL TEST
========================================================= */

app.get(
  '/api/test-withdrawal',
  (_req, res) => {
    const lastDoseDate =
      '2026-08-18';

    const withdrawalDays =
      5;

    const clearanceDate =
      calculateClearanceDate(
        lastDoseDate,
        withdrawalDays
      );

    const withdrawal =
      getWithdrawalStatus(
        clearanceDate
      );

    return res.json({
      lastDoseDate,
      withdrawalDays,
      clearanceDate,
      ...withdrawal,
    });
  }
);

/* =========================================================
   ACTUAL ANIMAL WITHDRAWAL STATUS
========================================================= */

app.get(
  '/api/withdrawal/:animalId',
  async (req, res) => {
    try {
      const {
        animalId,
      } = req.params;

      const {
        data,
        error,
      } = await supabase
        .from('treatments')
        .select(
          'last_dose_date, withdrawal_days, drug'
        )
        .eq(
          'animal_id',
          animalId
        )
        .order(
          'last_dose_date',
          {
            ascending:
              false,
          }
        )
        .limit(1)
        .maybeSingle();

      if (error) {
        throw error;
      }

      if (!data) {
        return res.status(404).json({
          status: 'error',

          message:
            'No treatment record found for this animal',
        });
      }

      const withdrawalDays =
        Number(
          data.withdrawal_days
        ) || 0;

      const clearanceDate =
        calculateClearanceDate(
          data.last_dose_date,
          withdrawalDays
        );

      const withdrawal =
        getWithdrawalStatus(
          clearanceDate
        );

      return res.json({
        animalId,

        drug:
          data.drug,

        lastDoseDate:
          data.last_dose_date,

        withdrawalDays,

        clearanceDate,

        ...withdrawal,
      });

    } catch (error) {
      console.error(
        'Withdrawal status error:',
        error
      );

      return res.status(500).json({
        status: 'error',

        message:
          error instanceof Error
            ? error.message
            : 'Failed to calculate withdrawal status',
      });
    }
  }
);

/* =========================================================
   SARVAM AI VOICE ASSISTANT

   IMPORTANT:
   This is intentionally using the simple request format
   that was already working in PALYA.

   Flow:
   AUDIO
      ↓
   Saaras STT
      ↓
   Sarvam 105B Conversations
      ↓
   Bulbul TTS
      ↓
   FRONTEND
========================================================= */

app.post(
  '/api/ai/voice',
  async (req, res) => {
    try {
      const {
        audioBase64,
        mimeType,
      } = req.body;

      if (!audioBase64) {
        return res.status(400).json({
          error:
            'Audio is required',
        });
      }

      const apiKey =
        process.env
          .SARVAM_API_KEY;

      if (!apiKey) {
        console.error(
          'SARVAM_API_KEY missing from .env'
        );

        return res.status(500).json({
          error:
            'Sarvam API key is not configured',
        });
      }

      const totalStart =
        Date.now();

      /* =====================================================
         STEP 1
         SPEECH -> TEXT
      ===================================================== */

      const sttStart =
        Date.now();

      const audioBuffer =
        Buffer.from(
          audioBase64,
          'base64'
        );

      console.log(
        '\n------------------------------------'
      );

      console.log(
        'NEW PALYA VOICE REQUEST'
      );

      console.log(
        'SENDING AUDIO TO SARVAM:',
        audioBuffer.length
      );

      const formData =
        new FormData();

      formData.append(
        'file',

        new Blob(
          [audioBuffer],
          {
            type:
              mimeType ||
              'audio/webm',
          }
        ),

        'recording.webm'
      );

      formData.append(
        'model',
        'saaras:v3'
      );

      formData.append(
        'mode',
        'codemix'
      );

      formData.append(
        'language_code',
        'hi-IN'
      );

      const sttResponse =
        await fetch(
          'https://api.sarvam.ai/speech-to-text',

          {
            method:
              'POST',

            headers: {
              'api-subscription-key':
                apiKey,
            },

            body:
              formData,
          }
        );

      if (!sttResponse.ok) {
        const errorText =
          await sttResponse.text();

        console.error(
          'SARVAM STT ERROR:',
          sttResponse.status,
          errorText
        );

        return res.status(500).json({
          error:
            'Speech recognition failed',
        });
      }

      const sttData:
        any =
        await sttResponse.json();

      console.log(
        'SARVAM STT RESPONSE:',
        sttData
      );

      const transcript =
        String(
          sttData.transcript ||
          ''
        ).trim();

      console.log(
        'STT:',
        transcript
      );

      console.log(
        'STT TIME:',
        Date.now() -
          sttStart,
        'ms'
      );

      if (!transcript) {
        return res.status(400).json({
          error:
            'No speech detected',
        });
      }

      /* =====================================================
         STEP 2
         TEXT -> SARVAM AI

         DO NOT ADD:
         reasoning_effort
         max_tokens
         experimental parameters

         We first restore stable behaviour.
      ===================================================== */

      const aiStart =
        Date.now();

      const aiResponse =
        await fetch(
          'https://api.sarvam.ai/v1/chat/completions',

          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',

              'api-subscription-key':
                apiKey,
            },

            body:
              JSON.stringify({
                model:
                  'sarvam-105b-conversations',

                messages: [
                  {
                    role:
                      'system',

                    content:
                      `You are PALYA AI Assistant.

PALYA is a livestock health, antimicrobial stewardship, veterinary monitoring, withdrawal monitoring and food-safety platform.

Important PALYA terminology:
- AMU means Antimicrobial Usage.
- MRL means Maximum Residue Limit.
- PALYA is not a government portal.
- Never invent acronym meanings.
- Never invent PALYA features.

Your job is to help farmers and veterinarians understand livestock health, treatment records, medicine records, antimicrobial stewardship, withdrawal monitoring and food safety.

Answer in the same language style used by the user.

If the user speaks Hindi, respond in simple Hindi or natural Hinglish.
If the user speaks English, respond in English.

Keep answers practical, concise and easy to understand.

Do not independently prescribe medicines or medicine doses.

Do not invent MRL values, withdrawal periods or regulatory values.

When treatment or regulatory verification is required, recommend veterinarian or official-source verification.`,
                  },

                  {
                    role:
                      'user',

                    content:
                      transcript,
                  },
                ],
              }),
          }
        );

      if (!aiResponse.ok) {
        const errorText =
          await aiResponse.text();

        console.error(
          'SARVAM AI ERROR:',
          aiResponse.status,
          errorText
        );

        return res.status(500).json({
          error:
            'AI response failed',

          /*
            Useful while debugging.
            Browser will show actual
            upstream error too.
          */

          details:
            errorText,
        });
      }

      const aiData:
        any =
        await aiResponse.json();

      const reply =
        String(
          aiData
            .choices?.[0]
            ?.message
            ?.content ||
          ''
        ).trim();

      if (!reply) {
        console.error(
          'SARVAM AI EMPTY RESPONSE:',
          aiData
        );

        return res.status(500).json({
          error:
            'AI returned empty response',
        });
      }

      console.log(
        'AI:',
        reply
      );

      console.log(
        'AI TIME:',
        Date.now() -
          aiStart,
        'ms'
      );

      /* =====================================================
         STEP 3
         TEXT -> SPEECH
      ===================================================== */

      const ttsStart =
        Date.now();

      const ttsResponse =
        await fetch(
          'https://api.sarvam.ai/text-to-speech',

          {
            method:
              'POST',

            headers: {
              'Content-Type':
                'application/json',

              'api-subscription-key':
                apiKey,
            },

            body:
              JSON.stringify({
                text:
                  reply,

                language_code:
                  'hi-IN',

                speaker:
                  'shubh',

                model:
                  'bulbul:v3',

                output_audio_codec:
                  'wav',
              }),
          }
        );

      /*
        TTS failure should NOT destroy
        successful AI text response.
      */

      if (!ttsResponse.ok) {
        const errorText =
          await ttsResponse.text();

        console.error(
          'SARVAM TTS ERROR:',
          ttsResponse.status,
          errorText
        );

        console.log(
          'TOTAL TIME:',
          Date.now() -
            totalStart,
          'ms'
        );

        return res.json({
          transcript,
          reply,
          audio: null,
        });
      }

      const ttsData:
        any =
        await ttsResponse.json();

      const audio =
        ttsData
          .audios?.[0] ||
        null;

      console.log(
        'TTS generated:',
        Boolean(audio)
      );

      console.log(
        'TTS TIME:',
        Date.now() -
          ttsStart,
        'ms'
      );

      console.log(
        'TOTAL TIME:',
        Date.now() -
          totalStart,
        'ms'
      );

      console.log(
        '------------------------------------\n'
      );

      return res.json({
        transcript,
        reply,
        audio,
      });

    } catch (error) {
      console.error(
        'VOICE AI ERROR:',
        error
      );

      return res.status(500).json({
        error:
          'Voice assistant failed',

        details:
          error instanceof Error
            ? error.message
            : String(error),
      });
    }
  }
);

/* =========================================================
   START SERVER
========================================================= */

app.listen(PORT, () => {
  console.log(
    '\n===================================='
  );

  console.log(
    `PALYA backend running on port ${PORT}`
  );

  console.log(
    `Health check: http://localhost:${PORT}/api/health`
  );

  console.log(
    'Sarvam AI: sarvam-105b-conversations'
  );

  console.log(
    '====================================\n'
  );
});