import { useRef, useState } from "react";
import { Upload, X, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { api } from "../../lib/api";
import { resolveImageUrl } from "../../lib/image";

export function ImageUploader({ images = [], onChange, multiple = true, folder = "tiles" }) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef(null);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append("files", f));
      formData.append("folder", folder);
      const { data } = await api.post("/admin/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const newImages = multiple ? [...images, ...data.images] : [data.images[0]];
      onChange(newImages);
    } catch (e) {
      console.error(e);
    } finally {
      setUploading(false);
    }
  };

  const removeAt = (i) => onChange(images.filter((_, idx) => idx !== i));
  const moveAt = (i, dir) => {
    const next = [...images];
    const target = i + dir;
    if (target < 0 || target >= next.length) return;
    [next[i], next[target]] = [next[target], next[i]];
    onChange(next);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        data-testid="image-upload-dropzone"
        className={`border-2 border-dashed rounded-md p-8 text-center cursor-pointer transition-colors ${dragOver ? "border-clay bg-clay/5" : "border-greige"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
          data-testid="image-upload-input"
        />
        {uploading ? (
          <div className="flex items-center justify-center gap-2 text-taupe">
            <Loader2 className="animate-spin" size={18} /> Uploading…
          </div>
        ) : (
          <div className="text-taupe text-sm flex flex-col items-center gap-2">
            <Upload size={22} className="text-clay" />
            Drag &amp; drop images here, or click to browse
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-4">
          {images.map((img, i) => (
            <div key={img.id || i} data-testid={`uploaded-image-${i}`} className="relative aspect-square rounded-md overflow-hidden border border-greige group">
              <img src={resolveImageUrl(img.thumb_url || img.url)} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                data-testid={`remove-image-${i}`}
                className="absolute top-1 right-1 bg-charcoal/70 text-bone rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
              {multiple && images.length > 1 && (
                <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <button type="button" onClick={() => moveAt(i, -1)} data-testid={`move-left-${i}`} className="bg-charcoal/70 text-bone rounded-full p-1">
                    <ChevronLeft size={12} />
                  </button>
                  <button type="button" onClick={() => moveAt(i, 1)} data-testid={`move-right-${i}`} className="bg-charcoal/70 text-bone rounded-full p-1">
                    <ChevronRight size={12} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
