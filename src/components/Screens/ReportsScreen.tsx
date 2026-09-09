import React, {
  useEffect,
  useRef,
  useState
} from 'react';

import {
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  FilePlus2
} from 'lucide-react';

/* =========================================================
   TYPES
========================================================= */

interface PdfRecord {
  id: string;
  name: string;
  size: string;
  blob: Blob;
}

/* =========================================================
   INDEXED DB CONFIG
========================================================= */

const DB_NAME =
  'PALYA_REPORTS_DB';

const DB_VERSION =
  1;

const STORE_NAME =
  'pdfReports';

/* =========================================================
   OPEN DATABASE
========================================================= */

const openDatabase =
  (): Promise<IDBDatabase> => {

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const request =
          indexedDB.open(
            DB_NAME,
            DB_VERSION
          );

        request.onupgradeneeded =
          () => {

            const db =
              request.result;

            if (
              !db.objectStoreNames.contains(
                STORE_NAME
              )
            ) {

              db.createObjectStore(
                STORE_NAME,
                {
                  keyPath: 'id'
                }
              );
            }
          };

        request.onsuccess =
          () => {

            resolve(
              request.result
            );
          };

        request.onerror =
          () => {

            reject(
              request.error
            );
          };
      }
    );
  };

/* =========================================================
   LOAD ALL PDFS
========================================================= */

const loadPdfRecords =
  async (): Promise<PdfRecord[]> => {

    const db =
      await openDatabase();

    return new Promise(
      (
        resolve,
        reject
      ) => {

        const transaction =
          db.transaction(
            STORE_NAME,
            'readonly'
          );

        const store =
          transaction.objectStore(
            STORE_NAME
          );

        const request =
          store.getAll();

        request.onsuccess =
          () => {

            const records =
              request.result as PdfRecord[];

            resolve(
              records.reverse()
            );

            db.close();
          };

        request.onerror =
          () => {

            reject(
              request.error
            );

            db.close();
          };
      }
    );
  };

/* =========================================================
   SAVE PDF
========================================================= */

const savePdfRecord =
  async (
    record: PdfRecord
  ) => {

    const db =
      await openDatabase();

    return new Promise<void>(
      (
        resolve,
        reject
      ) => {

        const transaction =
          db.transaction(
            STORE_NAME,
            'readwrite'
          );

        const store =
          transaction.objectStore(
            STORE_NAME
          );

        const request =
          store.put(record);

        request.onsuccess =
          () => {

            resolve();

            db.close();
          };

        request.onerror =
          () => {

            reject(
              request.error
            );

            db.close();
          };
      }
    );
  };

/* =========================================================
   DELETE PDF
========================================================= */

const deletePdfRecord =
  async (
    id: string
  ) => {

    const db =
      await openDatabase();

    return new Promise<void>(
      (
        resolve,
        reject
      ) => {

        const transaction =
          db.transaction(
            STORE_NAME,
            'readwrite'
          );

        const store =
          transaction.objectStore(
            STORE_NAME
          );

        const request =
          store.delete(id);

        request.onsuccess =
          () => {

            resolve();

            db.close();
          };

        request.onerror =
          () => {

            reject(
              request.error
            );

            db.close();
          };
      }
    );
  };

/* =========================================================
   COMPONENT
========================================================= */

export const ReportsScreen:
  React.FC = () => {

  const fileInputRef =
    useRef<HTMLInputElement | null>(
      null
    );

  const [
    pdfFiles,
    setPdfFiles
  ] =
    useState<PdfRecord[]>([]);

  const [
    isLoading,
    setIsLoading
  ] =
    useState(true);

  const [
    isUploading,
    setIsUploading
  ] =
    useState(false);

  /* =======================================================
     LOAD SAVED PDFS WHEN SCREEN OPENS
  ======================================================= */

  useEffect(() => {

    const loadReports =
      async () => {

        try {

          const records =
            await loadPdfRecords();

          setPdfFiles(
            records
          );

        } catch (error) {

          console.error(
            'Unable to load saved PDF reports:',
            error
          );

        } finally {

          setIsLoading(
            false
          );
        }
      };

    loadReports();

  }, []);

  /* =======================================================
     SELECT FILE
  ======================================================= */

  const handleChoosePdf =
    () => {

      fileInputRef
        .current
        ?.click();
    };

  /* =======================================================
     UPLOAD PDF
  ======================================================= */

  const handlePdfUpload =
    async (
      event:
        React.ChangeEvent<HTMLInputElement>
    ) => {

      const file =
        event.target.files?.[0];

      if (!file) return;

      /* PDF CHECK */

      if (
        file.type !==
          'application/pdf' &&
        !file.name
          .toLowerCase()
          .endsWith('.pdf')
      ) {

        alert(
          'Please select a PDF file only.'
        );

        event.target.value =
          '';

        return;
      }

      setIsUploading(true);

      try {

        const sizeInMB =
          file.size /
          (1024 * 1024);

        const newPdf:
          PdfRecord = {

          id:
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`,

          name:
            file.name,

          size:
            sizeInMB < 1
              ? `${Math.round(
                  file.size /
                  1024
                )} KB`
              : `${sizeInMB.toFixed(
                  2
                )} MB`,

          blob:
            file
        };

        /* SAVE TO BROWSER DATABASE */

        await savePdfRecord(
          newPdf
        );

        /* UPDATE UI */

        setPdfFiles(
          (previous) => [
            newPdf,
            ...previous
          ]
        );

      } catch (error) {

        console.error(
          'PDF save failed:',
          error
        );

        alert(
          'Unable to save PDF. Please try again.'
        );

      } finally {

        setIsUploading(
          false
        );

        event.target.value =
          '';
      }
    };

  /* =======================================================
     OPEN PDF
  ======================================================= */

  const handleOpenPdf =
    (
      pdf: PdfRecord
    ) => {

      const fileUrl =
        URL.createObjectURL(
          pdf.blob
        );

      window.open(
        fileUrl,
        '_blank',
        'noopener,noreferrer'
      );

      /*
        Give the browser enough time
        to load the new tab before
        releasing the object URL.
      */

      setTimeout(
        () => {

          URL.revokeObjectURL(
            fileUrl
          );

        },
        60000
      );
    };

  /* =======================================================
     DELETE PDF
  ======================================================= */

  const handleDeletePdf =
    async (
      pdf: PdfRecord
    ) => {

      const confirmed =
        window.confirm(
          `Remove "${pdf.name}"?`
        );

      if (!confirmed) {
        return;
      }

      try {

        await deletePdfRecord(
          pdf.id
        );

        setPdfFiles(
          (previous) =>
            previous.filter(
              (item) =>
                item.id !==
                pdf.id
            )
        );

      } catch (error) {

        console.error(
          'PDF deletion failed:',
          error
        );

        alert(
          'Unable to remove PDF.'
        );
      }
    };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* ===================================================
          HEADER
      =================================================== */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

        <div>

          <h1 className="text-2xl sm:text-3xl font-black text-on-surface">

            Reports & Records

          </h1>

          <p className="text-sm text-on-surface-variant mt-1">

            Upload and manage PDF reports,
            laboratory records and supporting
            documents.

          </p>

        </div>

        <button
          type="button"

          onClick={
            handleChoosePdf
          }

          disabled={
            isUploading
          }

          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-sm hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >

          <FilePlus2 className="w-5 h-5" />

          {isUploading
            ? 'Adding PDF...'
            : 'Add PDF'}

        </button>

        <input
          ref={
            fileInputRef
          }

          type="file"

          accept="application/pdf,.pdf"

          onChange={
            handlePdfUpload
          }

          className="hidden"
        />

      </div>

      {/* ===================================================
          UPLOAD CARD
      =================================================== */}

      <div
        onClick={() => {

          if (
            !isUploading
          ) {

            handleChoosePdf();
          }
        }}

        className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center cursor-pointer hover:bg-surface-container-low transition"
      >

        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">

          <Upload className="w-7 h-7 text-primary" />

        </div>

        <h2 className="text-lg font-bold text-on-surface">

          {isUploading
            ? 'Saving PDF...'
            : 'Add a PDF Report'}

        </h2>

        <p className="text-sm text-on-surface-variant mt-2">

          {isUploading
            ? 'Please wait while the report is stored.'
            : 'Click here or use the Add PDF button to select a PDF from your computer.'}

        </p>

      </div>

      {/* ===================================================
          PDF LIST
      =================================================== */}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-outline-variant">

          <div className="flex items-center justify-between gap-3">

            <div className="flex items-center gap-2">

              <FileText className="w-5 h-5 text-primary" />

              <h2 className="font-bold text-on-surface">

                Uploaded Reports

              </h2>

            </div>

            {pdfFiles.length > 0 && (

              <span className="text-xs font-bold text-on-surface-variant">

                {pdfFiles.length}{' '}

                {pdfFiles.length === 1
                  ? 'report'
                  : 'reports'}

              </span>

            )}

          </div>

        </div>

        {/* LOADING */}

        {isLoading ? (

          <div className="py-14 text-center">

            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />

            <p className="text-sm text-on-surface-variant mt-3">

              Loading saved reports...

            </p>

          </div>

        ) : pdfFiles.length === 0 ? (

          /* EMPTY */

          <div className="py-14 text-center">

            <FileText className="w-12 h-12 mx-auto text-on-surface-variant/40 mb-3" />

            <p className="font-semibold text-on-surface">

              No PDF reports added yet

            </p>

            <p className="text-sm text-on-surface-variant mt-1">

              Add a PDF to see it here.

            </p>

          </div>

        ) : (

          /* REPORT LIST */

          <div className="divide-y divide-outline-variant">

            {pdfFiles.map(
              (pdf) => (

                <div
                  key={
                    pdf.id
                  }

                  className="flex items-center gap-4 p-4 sm:p-5"
                >

                  {/* ICON */}

                  <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">

                    <FileText className="w-5 h-5 text-primary" />

                  </div>

                  {/* FILE INFO */}

                  <div className="flex-1 min-w-0">

                    <p className="font-semibold text-on-surface truncate">

                      {pdf.name}

                    </p>

                    <p className="text-xs text-on-surface-variant mt-1">

                      {pdf.size}

                    </p>

                  </div>

                  {/* OPEN */}

                  <button
                    type="button"

                    onClick={() =>
                      handleOpenPdf(
                        pdf
                      )
                    }

                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-primary transition cursor-pointer"

                    title="Open PDF"
                  >

                    <ExternalLink className="w-5 h-5" />

                  </button>

                  {/* DELETE */}

                  <button
                    type="button"

                    onClick={() =>
                      handleDeletePdf(
                        pdf
                      )
                    }

                    className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-error-container text-error transition cursor-pointer"

                    title="Remove PDF"
                  >

                    <Trash2 className="w-5 h-5" />

                  </button>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* ===================================================
          STORAGE NOTE
      =================================================== */}

      <div className="text-xs text-on-surface-variant px-1">

        Reports saved here remain available after refreshing
        this browser.

      </div>

    </div>
  );
};