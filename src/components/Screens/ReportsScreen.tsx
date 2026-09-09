import React, { useRef, useState } from 'react';
import {
  FileText,
  Upload,
  Trash2,
  ExternalLink,
  FilePlus2,
} from 'lucide-react';

interface PdfRecord {
  id: string;
  name: string;
  size: string;
  url: string;
}

export const ReportsScreen: React.FC = () => {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [pdfFiles, setPdfFiles] =
    useState<PdfRecord[]>([]);

  const handleChoosePdf = () => {
    fileInputRef.current?.click();
  };

  const handlePdfUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file =
      event.target.files?.[0];

    if (!file) return;

    if (
      file.type !== 'application/pdf'
    ) {
      alert('Please select a PDF file only.');
      event.target.value = '';
      return;
    }

    const fileUrl =
      URL.createObjectURL(file);

    const sizeInMB =
      file.size / (1024 * 1024);

    const newPdf: PdfRecord = {
      id: `${Date.now()}`,
      name: file.name,
      size:
        sizeInMB < 1
          ? `${Math.round(
              file.size / 1024
            )} KB`
          : `${sizeInMB.toFixed(2)} MB`,
      url: fileUrl,
    };

    setPdfFiles((prev) => [
      newPdf,
      ...prev,
    ]);

    event.target.value = '';
  };

  const handleDeletePdf = (
    pdf: PdfRecord
  ) => {
    URL.revokeObjectURL(pdf.url);

    setPdfFiles((prev) =>
      prev.filter(
        (item) =>
          item.id !== pdf.id
      )
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">

      {/* HEADER */}

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
          onClick={handleChoosePdf}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-sm hover:opacity-90 transition"
        >
          <FilePlus2 className="w-5 h-5" />

          Add PDF
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf,.pdf"
          onChange={handlePdfUpload}
          className="hidden"
        />

      </div>

      {/* UPLOAD CARD */}

      <div
        onClick={handleChoosePdf}
        className="border-2 border-dashed border-outline-variant rounded-2xl p-8 text-center cursor-pointer hover:bg-surface-container-low transition"
      >
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Upload className="w-7 h-7 text-primary" />
        </div>

        <h2 className="text-lg font-bold text-on-surface">
          Add a PDF Report
        </h2>

        <p className="text-sm text-on-surface-variant mt-2">
          Click here or use the Add PDF
          button to select a PDF from your
          computer.
        </p>
      </div>

      {/* PDF LIST */}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-hidden">

        <div className="px-5 py-4 border-b border-outline-variant">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />

            <h2 className="font-bold text-on-surface">
              Uploaded Reports
            </h2>
          </div>
        </div>

        {pdfFiles.length === 0 ? (
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
          <div className="divide-y divide-outline-variant">

            {pdfFiles.map((pdf) => (
              <div
                key={pdf.id}
                className="flex items-center gap-4 p-4 sm:p-5"
              >

                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">

                  <p className="font-semibold text-on-surface truncate">
                    {pdf.name}
                  </p>

                  <p className="text-xs text-on-surface-variant mt-1">
                    {pdf.size}
                  </p>

                </div>

                <a
                  href={pdf.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-surface-container text-primary transition"
                  title="Open PDF"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>

                <button
                  onClick={() =>
                    handleDeletePdf(pdf)
                  }
                  className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-error-container text-error transition"
                  title="Remove PDF"
                >
                  <Trash2 className="w-5 h-5" />
                </button>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};