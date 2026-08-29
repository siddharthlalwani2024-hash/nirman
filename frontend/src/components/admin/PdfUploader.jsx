import { useRef, useState } from "react";
import { FileText, Upload, X } from "lucide-react";
import { api } from "../../lib/api";

export function PdfUploader({ value, onChange }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await api.post("/admin/upload-pdf", formData, { headers: { "Content-Type": "multipart/form-data" } });
      onChange({ url: res.data.url, file_size_mb: res.data.file_size_mb });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div data-testid="pdf-uploader">
      {value ? (
        <div className="flex items-center gap-3 border border-stone rounded-md p-3 bg-white">
          <FileText size={20} className="text-navy shrink-0" />
          <span className="text-sm text-ink truncate flex-1">{value.split("/").pop()}</span>
          <button type="button" data-testid="pdf-uploader-remove" onClick={() => onChange(null)} className="text-ink/40 hover:text-gold shrink-0">
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          data-testid="pdf-uploader-trigger"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full flex flex-col items-center gap-2 border-2 border-dashed border-stone rounded-md py-8 text-ink/60 hover:border-gold hover:text-gold transition-colors disabled:opacity-60"
        >
          <Upload size={22} />
          <span className="text-sm">{uploading ? "Uploading…" : "Click to upload PDF (max 30MB)"}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
