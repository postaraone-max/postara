
"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

type Props = {
  name?: string;
  accept?: string;
  maxSizeMB?: number;
  helperText?: string;
  onFileChange?: (file: File | null) => void;
};

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024, sizes = ["B","KB","MB","GB","TB"];
  const i = Math.floor(Math.log(bytes)/Math.log(k));
  const v = bytes / Math.pow(k, i);
  return `${v.toFixed(v>=100?0:v>=10?1:2)} ${sizes[i]}`;
}

export default function MediaUploader({
  name = "file",
  accept = "image/*,video/*",
  maxSizeMB = 200,
  helperText = "Images or videos. Max 200 MB.",
  onFileChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");

  const setHiddenInput = (f: File | null) => {
    if (!inputRef.current) return;
    const dt = new DataTransfer();
    if (f) dt.items.add(f);
    inputRef.current.files = dt.files;
  };

  const applyFile = (f: File | null) => {
    setHiddenInput(f);
    setFile(f);
    onFileChange?.(f);
  };

  const onFiles = useCallback((files: FileList | null) => {
    setError("");
    if (!files || files.length === 0) return;
    const f = files[0];
    if (f.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large. Max ${maxSizeMB} MB.`);
      return;
    }
    applyFile(f);
  }, [maxSizeMB]);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onFiles(e.dataTransfer.files);
  }, [onFiles]);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  const isVideo = useMemo(() => (file ? file.type.startsWith("video/") : false), [file]);

  const clearFile = useCallback(() => {
    setError("");
    applyFile(null);
    if (inputRef.current) inputRef.current.value = "";
  }, []);

  return (
    <div className="w-full" id="uploader-sandbox">
      <input
        ref={inputRef}
        id="upload-input"
        name={name}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onFiles(e.currentTarget.files)}
      />

      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="border-2 border-dashed rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center transition hover:border-gray-400 bg-white/60 dark:bg-neutral-900/60"
        style={{ minHeight: 220 }}
      >
        {!file ? (
          <>
            <div className="mb-4">
              <svg width="56" height="56" viewBox="0 0 24 24" className="opacity-80" aria-hidden="true">
                <path fill="currentColor" d="M19 13v6H5v-6H3v6a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6zM11 6.83L9.41 8.41L8 7l4-4l4 4l-1.41 1.41L13 6.83V16h-2z"/>
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload your media</h3>
            <p className="text-sm opacity-80 mb-6">Drag & drop here or browse your device</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black"
              >
                Browse files
              </button>
              <span className="text-xs opacity-70">{helperText}</span>
            </div>
          </>
        ) : (
          <div className="w-full" style={{ maxWidth: 720, margin: "0 auto" }}>
            <div className="frame">
              <div className="inner">
                {isVideo ? (
                  <video src={previewUrl} className="media-el" controls />
                ) : (
                  <img src={previewUrl} alt="preview" className="media-el" />
                )}
              </div>
            </div>

            <div className="w-full grid md:grid-cols-[1fr,auto] gap-4 items-start mt-4">
              <div className="text-left">
                <div className="font-medium break-all">{file.name}</div>
                <div className="text-sm opacity-70">{formatBytes(file.size)}</div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => inputRef.current?.click()} className="px-3 py-2 rounded-lg border">
                  Replace
                </button>
                <button type="button" onClick={clearFile} className="px-3 py-2 rounded-lg border">
                  Remove
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</div>}

      <style jsx>{`
        #uploader-sandbox .frame {
          position: relative;
          width: 100%;
          max-width: 640px;
          padding-top: 56.25%;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(0,0,0,0.12);
          background: #00000008;
          margin: 0 auto;
        }
        #uploader-sandbox .inner {
          position: absolute;
          inset: 0;
        }
        #uploader-sandbox :global(video),
        #uploader-sandbox :global(img) {
          display: block !important;
          width: 100% !important;
          height: 100% !important;
          max-width: 100% !important;
          max-height: 100% !important;
          object-fit: contain !important;
          position: static !important;
        }
      `}</style>
    </div>
  );
}
