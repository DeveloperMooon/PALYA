import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Stethoscope,
  Send,
  Building,
  Camera,
  MapPin,
  RefreshCw,
  Navigation,
  ShieldCheck,
  XCircle
} from 'lucide-react';

import {
  VeterinaryCase,
  ScreenId
} from '../../types';

interface VeterinaryCaseScreenProps {
  vetCase: VeterinaryCase;
  onNavigate: (screen: ScreenId) => void;
  onApproveCase: (caseId: string) => void;
}

interface VisitLocation {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

export const VeterinaryCaseScreen: React.FC<
  VeterinaryCaseScreenProps
> = ({
  vetCase,
  onNavigate,
  onApproveCase
}) => {
  const [vetNotes, setVetNotes] = useState(
    'Recommend immediate bacteriological milk culture and antimicrobial susceptibility testing (AST) before authorizing further 4th-gen cephalosporin courses. Maintain animal in isolation pen with dedicated milking cluster.'
  );

  const [selectedAction, setSelectedAction] =
    useState<
      'approve' | 'diagnostics' | 'quarantine'
    >('diagnostics');

  const [isSubmitted, setIsSubmitted] =
    useState(false);

  // =========================================================
  // VERIFIED VISIT STATE
  // =========================================================

  const [visitLocation, setVisitLocation] =
    useState<VisitLocation | null>(null);

  const [isGettingLocation, setIsGettingLocation] =
    useState(false);

  const [locationError, setLocationError] =
    useState('');

  const [isCameraOpen, setIsCameraOpen] =
    useState(false);

  const [cameraError, setCameraError] =
    useState('');

  const [selfieDataUrl, setSelfieDataUrl] =
    useState<string | null>(null);

  const [verificationError, setVerificationError] =
    useState('');

  const videoRef =
    useRef<HTMLVideoElement | null>(null);

  const streamRef =
    useRef<MediaStream | null>(null);

  // =========================================================
  // CLEANUP CAMERA
  // =========================================================

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  // =========================================================
  // LOCATION CAPTURE
  // =========================================================

  const handleCaptureLocation = () => {
    if (!navigator.geolocation) {
      setLocationError(
        'Geolocation is not supported on this device.'
      );
      return;
    }

    setIsGettingLocation(true);
    setLocationError('');
    setVerificationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setVisitLocation({
          latitude:
            position.coords.latitude,
          longitude:
            position.coords.longitude,
          accuracy:
            position.coords.accuracy,
          timestamp:
            new Date().toLocaleString()
        });

        setIsGettingLocation(false);
      },

      (error) => {
        console.error(
          'Location capture failed:',
          error
        );

        setIsGettingLocation(false);

        if (error.code === 1) {
          setLocationError(
            'Location permission denied. Allow location access to verify the veterinary visit.'
          );
        } else if (error.code === 2) {
          setLocationError(
            'Current location could not be determined.'
          );
        } else if (error.code === 3) {
          setLocationError(
            'Location request timed out. Please try again.'
          );
        } else {
          setLocationError(
            'Unable to capture live location.'
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  // =========================================================
  // CAMERA
  // =========================================================

  const handleStartCamera = async () => {
    setCameraError('');
    setVerificationError('');

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError(
          'Camera access is not supported by this browser.'
        );
        return;
      }

      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'user'
          },
          audio: false
        });

      streamRef.current = stream;

      setIsCameraOpen(true);

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject =
            stream;
        }
      }, 100);
    } catch (error) {
      console.error(
        'Camera access failed:',
        error
      );

      setCameraError(
        'Unable to access camera. Please allow camera permission and try again.'
      );
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track) =>
          track.stop()
        );

      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject =
        null;
    }

    setIsCameraOpen(false);
  };

  const handleCaptureSelfie = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;

    if (
      video.videoWidth === 0 ||
      video.videoHeight === 0
    ) {
      setCameraError(
        'Camera is still loading. Please wait a moment and try again.'
      );
      return;
    }

    const canvas =
      document.createElement('canvas');

    canvas.width =
      video.videoWidth;

    canvas.height =
      video.videoHeight;

    const context =
      canvas.getContext('2d');

    if (!context) {
      setCameraError(
        'Unable to capture image.'
      );
      return;
    }

    context.drawImage(
      video,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const image =
      canvas.toDataURL(
        'image/jpeg',
        0.85
      );

    setSelfieDataUrl(image);

    stopCamera();

    setCameraError('');
  };

  const handleRetakeSelfie = () => {
    setSelfieDataUrl(null);
    handleStartCamera();
  };

  // =========================================================
  // VISIT VERIFICATION
  // =========================================================

  const locationVerified =
    visitLocation !== null;

  const selfieVerified =
    selfieDataUrl !== null;

  const visitVerified =
    locationVerified &&
    selfieVerified;

  // =========================================================
  // FINAL SUBMIT
  // =========================================================

  const handleSubmitReview = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!visitLocation) {
      setVerificationError(
        'Live location verification is required before resolving this case.'
      );
      return;
    }

    if (!selfieDataUrl) {
      setVerificationError(
        'Veterinarian visit photo is required before resolving this case.'
      );
      return;
    }

    setVerificationError('');

    setIsSubmitted(true);

    onApproveCase(
      vetCase.id
    );

    setTimeout(() => {
      setIsSubmitted(false);
    }, 4000);
  };

  return (
    <div className="space-y-6 pb-12">

      {/* Back */}
      <div>
        <button
          onClick={() =>
            onNavigate(
              'veterinary-review'
            )
          }
          className="inline-flex items-center gap-2 text-xs font-bold text-primary hover:underline mb-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />

          <span>
            Back to Review Center
          </span>
        </button>
      </div>

      {/* Success */}
      {isSubmitted && (
        <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700" />

            <div>
              <p className="text-xs font-black uppercase tracking-wider">
                Veterinary Visit Verified & Action Authorized
              </p>

              <p className="text-xs">
                Visit evidence and clinical
                instructions have been recorded
                for {vetCase.farmName}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Patient Header */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

          <div className="flex items-start gap-4">
            <img
              src={vetCase.imageUrl}
              alt={vetCase.tag}
              className="w-20 h-20 rounded-xl object-cover border border-outline-variant shrink-0"
            />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-black text-primary">
                  {vetCase.animalId}
                </h1>

                <span className="text-sm font-mono text-outline font-semibold">
                  ({vetCase.tag})
                </span>

                <span className="text-xs font-black uppercase px-2.5 py-0.5 rounded-full bg-error-container text-error">
                  {vetCase.riskLevel} Risk
                </span>

                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  Veterinary Review Required
                </span>
              </div>

              <p className="text-xs text-on-surface-variant mt-1">
                {vetCase.species}
                {' • '}
                {vetCase.breed}
                {' • '}
                {vetCase.age}
                {' • '}
                {vetCase.weight} kg
              </p>

              <p className="text-xs font-bold text-primary mt-1 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-outline" />

                <span>
                  {vetCase.farmName}
                </span>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-outline block">
              Escalation Date
            </span>

            <span className="text-xs font-mono font-bold text-primary">
              15 Aug 2026, 08:20 AM
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-7 space-y-6">

          {/* Timeline */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            <h2 className="text-base font-bold text-primary pb-3 border-b border-outline-variant/40 mb-4">
              Clinical Timeline
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-outline-variant">

              {vetCase.timeline.map(
                (event) => (
                  <div
                    key={event.id}
                    className="relative"
                  >
                    <span
                      className={`absolute -left-6 top-0.5 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center ${
                        event.type ===
                        'alert'
                          ? 'bg-error'
                          : event.type ===
                            'escalation'
                          ? 'bg-purple-600'
                          : event.type ===
                            'treatment'
                          ? 'bg-secondary'
                          : 'bg-primary'
                      }`}
                    />

                    <div className="text-[11px] font-mono text-outline">
                      {
                        event.timestamp
                      }
                    </div>

                    <div className="text-xs font-bold text-primary mt-0.5">
                      {event.title}
                    </div>

                    <p className="text-xs text-on-surface-variant mt-0.5 leading-relaxed">
                      {
                        event.description
                      }
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* AMU History */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            <div className="pb-3 border-b border-outline-variant/40 mb-4 flex items-center justify-between">

              <div>
                <h2 className="text-base font-bold text-primary">
                  Antimicrobial History
                  (Past 12 Months)
                </h2>

                <p className="text-xs text-on-surface-variant">
                  Complete longitudinal
                  AMU audit trail
                </p>
              </div>

              <span className="text-[11px] font-bold text-error bg-error-container px-2 py-0.5 rounded">
                HP-CIA Detected
              </span>
            </div>

            <div className="overflow-x-auto">

              <table className="w-full text-left text-xs">

                <thead>
                  <tr className="border-b border-outline-variant/60 text-[11px] uppercase tracking-wider text-on-surface-variant font-bold">

                    <th className="py-2.5 px-3">
                      Drug / Active Ingredient
                    </th>

                    <th className="py-2.5 px-3">
                      Dose & Route
                    </th>

                    <th className="py-2.5 px-3">
                      Date
                    </th>

                    <th className="py-2.5 px-3">
                      Veterinarian
                    </th>

                  </tr>
                </thead>

                <tbody className="divide-y divide-outline-variant/40">

                  {vetCase.antimicrobialHistory.map(
                    (item) => (
                      <tr
                        key={item.id}
                        className="hover:bg-surface-container-low transition-colors"
                      >
                        <td className="py-2.5 px-3">

                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-primary">
                              {
                                item.drug
                              }
                            </span>

                            {item.isHpCia && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-error text-white">
                                HP-CIA
                              </span>
                            )}
                          </div>

                          <span className="text-[10px] text-outline block">
                            {
                              item.activeIngredient
                            }
                          </span>

                        </td>

                        <td className="py-2.5 px-3 font-mono text-on-surface">
                          {
                            item.doseRoute
                          }
                        </td>

                        <td className="py-2.5 px-3 text-outline">
                          {item.date}
                        </td>

                        <td className="py-2.5 px-3 font-medium text-on-surface">
                          {item.vet}
                        </td>
                      </tr>
                    )
                  )}

                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-5 space-y-6">

          {/* Withdrawal */}
          <div className="bg-amber-500/10 border border-amber-500/30 p-5 rounded-2xl">

            <div className="flex items-center justify-between text-xs font-bold text-amber-900 mb-2">

              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-amber-700" />

                Active Withdrawal Period
              </span>

              <span className="px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-black">
                {
                  vetCase.withdrawalDaysLeft
                }{' '}
                Days Remaining
              </span>

            </div>

            <p className="text-xs text-amber-950 leading-relaxed">
              Milk and meat withholding
              remains active until the
              withdrawal period is completed.
            </p>
          </div>

          {/* Risk Analysis */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-3">

            <h3 className="text-base font-bold text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2">

              <ShieldAlert className="w-4 h-4 text-error" />

              <span>
                Veterinary Risk Analysis
              </span>
            </h3>

            <div className="space-y-2 text-xs">

              <div className="p-2.5 rounded-xl bg-error-container/30 border border-error/20">

                <span className="font-bold text-error block">
                  HP-CIA Usage Detected
                </span>

                <span className="text-[11px] text-on-surface">
                  High-priority antimicrobial
                  use requires veterinary
                  oversight.
                </span>

              </div>

              <div className="p-2.5 rounded-xl bg-surface-container-low border border-outline-variant">

                <span className="font-bold text-primary block">
                  Clinical Review Required
                </span>

                <span className="text-[11px] text-on-surface-variant">
                  Case must be reviewed before
                  further treatment decisions.
                </span>

              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* VERIFIED VISIT */}
          {/* ================================================= */}

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs space-y-5">

            <div className="flex items-start justify-between gap-3">

              <div>
                <h3 className="text-base font-bold text-primary flex items-center gap-2">

                  <ShieldCheck className="w-5 h-5 text-secondary" />

                  Verified Veterinary Visit
                </h3>

                <p className="text-xs text-on-surface-variant mt-1">
                  Live GPS and a current visit
                  photograph are required before
                  this case can be authorized.
                </p>
              </div>

              {visitVerified ? (
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                  Verified
                </span>
              ) : (
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                  Pending
                </span>
              )}

            </div>

            {/* LOCATION */}

            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">

                  <MapPin className="w-5 h-5 text-primary" />

                  <div>
                    <p className="text-xs font-black text-primary">
                      Live Location
                    </p>

                    <p className="text-[10px] text-on-surface-variant">
                      Current device GPS
                    </p>
                  </div>
                </div>

                {locationVerified && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}

              </div>

              {!visitLocation ? (
                <button
                  type="button"
                  onClick={
                    handleCaptureLocation
                  }
                  disabled={
                    isGettingLocation
                  }
                  className="w-full mt-3 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  <Navigation className="w-4 h-4" />

                  {isGettingLocation
                    ? 'Capturing Live Location...'
                    : 'Capture Live Location'}
                </button>
              ) : (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl">

                  <p className="text-xs font-bold text-emerald-800">
                    Live location captured
                  </p>

                  <div className="mt-2 text-[11px] text-emerald-900 space-y-1">

                    <p>
                      Latitude:{' '}
                      {visitLocation.latitude.toFixed(
                        6
                      )}
                    </p>

                    <p>
                      Longitude:{' '}
                      {visitLocation.longitude.toFixed(
                        6
                      )}
                    </p>

                    <p>
                      GPS accuracy:{' '}
                      ±
                      {Math.round(
                        visitLocation.accuracy
                      )}{' '}
                      metres
                    </p>

                    <p>
                      Captured:{' '}
                      {
                        visitLocation.timestamp
                      }
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={
                      handleCaptureLocation
                    }
                    className="mt-3 text-[11px] font-bold text-primary flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    Refresh location
                  </button>

                </div>
              )}

              {locationError && (
                <div className="mt-3 flex items-start gap-2 text-xs text-error">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>
                    {locationError}
                  </span>
                </div>
              )}

            </div>

            {/* CAMERA */}

            <div className="p-4 rounded-xl border border-outline-variant bg-surface-container-low">

              <div className="flex items-center justify-between gap-3">

                <div className="flex items-center gap-2">

                  <Camera className="w-5 h-5 text-primary" />

                  <div>
                    <p className="text-xs font-black text-primary">
                      Veterinarian Visit Photo
                    </p>

                    <p className="text-[10px] text-on-surface-variant">
                      Capture a current front-camera
                      photograph
                    </p>
                  </div>

                </div>

                {selfieVerified && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                )}

              </div>

              {!isCameraOpen &&
                !selfieDataUrl && (
                  <button
                    type="button"
                    onClick={
                      handleStartCamera
                    }
                    className="w-full mt-3 py-2.5 px-4 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-4 h-4" />
                    Open Front Camera
                  </button>
                )}

              {isCameraOpen && (
                <div className="mt-3 space-y-3">

                  <div className="overflow-hidden rounded-xl bg-black aspect-video">

                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                  </div>

                  <div className="grid grid-cols-2 gap-2">

                    <button
                      type="button"
                      onClick={
                        handleCaptureSelfie
                      }
                      className="py-2.5 rounded-xl bg-primary text-on-primary text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Camera className="w-4 h-4" />
                      Capture Photo
                    </button>

                    <button
                      type="button"
                      onClick={
                        stopCamera
                      }
                      className="py-2.5 rounded-xl border border-outline-variant text-xs font-bold cursor-pointer"
                    >
                      Cancel
                    </button>

                  </div>
                </div>
              )}

              {selfieDataUrl && (
                <div className="mt-3">

                  <img
                    src={selfieDataUrl}
                    alt="Veterinarian visit evidence"
                    className="w-full max-h-64 object-cover rounded-xl border border-emerald-300"
                  />

                  <div className="mt-2 flex items-center justify-between">

                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">

                      <CheckCircle2 className="w-4 h-4" />

                      Visit photo captured

                    </span>

                    <button
                      type="button"
                      onClick={
                        handleRetakeSelfie
                      }
                      className="text-xs font-bold text-primary flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      Retake
                    </button>

                  </div>

                </div>
              )}

              {cameraError && (
                <div className="mt-3 flex items-start gap-2 text-xs text-error">

                  <AlertTriangle className="w-4 h-4 shrink-0" />

                  <span>
                    {cameraError}
                  </span>

                </div>
              )}

            </div>

            {/* verification checklist */}

            <div className="grid grid-cols-2 gap-2">

              <div
                className={`p-3 rounded-xl border ${
                  locationVerified
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-surface-container border-outline-variant'
                }`}
              >
                <p className="text-[10px] text-outline">
                  GPS Evidence
                </p>

                <p className="text-xs font-bold mt-1">
                  {locationVerified
                    ? 'Verified'
                    : 'Required'}
                </p>
              </div>

              <div
                className={`p-3 rounded-xl border ${
                  selfieVerified
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-surface-container border-outline-variant'
                }`}
              >
                <p className="text-[10px] text-outline">
                  Visit Photo
                </p>

                <p className="text-xs font-bold mt-1">
                  {selfieVerified
                    ? 'Verified'
                    : 'Required'}
                </p>
              </div>

            </div>

          </div>

          {/* ACTION FORM */}

          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/60 shadow-xs">

            <h3 className="text-base font-bold text-primary pb-2 border-b border-outline-variant/40 flex items-center gap-2">

              <Stethoscope className="w-4 h-4 text-secondary" />

              <span>
                Veterinary Order & Actions
              </span>

            </h3>

            <form
              onSubmit={
                handleSubmitReview
              }
              className="mt-4 space-y-4"
            >

              <div>

                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">
                  Select Action Directive
                </label>

                <div className="grid grid-cols-3 gap-2 text-xs font-bold">

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAction(
                        'diagnostics'
                      )
                    }
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAction ===
                      'diagnostics'
                        ? 'bg-purple-100 text-purple-900 border-purple-400 ring-2 ring-purple-200'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Request AST Test
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAction(
                        'quarantine'
                      )
                    }
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAction ===
                      'quarantine'
                        ? 'bg-amber-100 text-amber-900 border-amber-400 ring-2 ring-amber-200'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Isolation Flag
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedAction(
                        'approve'
                      )
                    }
                    className={`p-2 rounded-xl border text-center transition-all cursor-pointer ${
                      selectedAction ===
                      'approve'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-400 ring-2 ring-emerald-200'
                        : 'border-outline-variant hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    Approve Protocol
                  </button>

                </div>
              </div>

              <div>

                <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">
                  Clinical Instructions for
                  Farm Manager
                </label>

                <textarea
                  rows={4}
                  value={vetNotes}
                  onChange={(e) =>
                    setVetNotes(
                      e.target.value
                    )
                  }
                  className="w-full p-3 rounded-xl border border-outline-variant text-xs bg-surface-container-low text-on-surface focus:outline-none focus:border-primary"
                  required
                />

              </div>

              {!visitVerified && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">

                  <div className="flex gap-2 items-start">

                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />

                    <div>
                      <p className="text-xs font-bold text-amber-900">
                        On-site verification
                        incomplete
                      </p>

                      <p className="text-[11px] text-amber-800 mt-1">
                        Capture both live GPS
                        location and veterinarian
                        visit photograph to authorize
                        this case.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {visitVerified && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">

                  <div className="flex gap-2 items-start">

                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />

                    <div>
                      <p className="text-xs font-bold text-emerald-900">
                        On-site visit verified
                      </p>

                      <p className="text-[11px] text-emerald-800 mt-1">
                        GPS and visit-photo
                        evidence captured.
                        Authorization is now
                        enabled.
                      </p>
                    </div>

                  </div>
                </div>
              )}

              {verificationError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">

                  <XCircle className="w-4 h-4 text-red-700 shrink-0" />

                  <span className="text-xs text-red-800">
                    {
                      verificationError
                    }
                  </span>

                </div>
              )}

              <button
                type="submit"
                id="btn-sign-vet-review"
                disabled={!visitVerified}
                className="w-full py-3 bg-primary hover:bg-primary-container active:scale-[0.99] text-on-primary rounded-xl text-xs font-bold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />

                <span>
                  {visitVerified
                    ? 'Verify Visit & Authorize Order'
                    : 'Visit Verification Required'}
                </span>
              </button>

            </form>
          </div>

        </div>
      </div>
    </div>
  );
};