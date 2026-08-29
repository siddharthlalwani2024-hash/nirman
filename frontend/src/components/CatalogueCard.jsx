import { FileText, Download, Eye } from "lucide-react";
import { resolveImageUrl } from "../lib/image";
import { api } from "../lib/api";

export function CatalogueCard({ catalogue }) {
  const track = () => {
    api.post(`/catalogues/${catalogue.slug}/track-download`).catch(() => {});
  };

  return (
    <div
      data-testid={`catalogue-card-${catalogue.slug}`}
      className="group bg-white border border-stone rounded-md overflow-hidden shadow-soft hover:shadow-md hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col"
    >
      <div className="relative aspect-[3/4] bg-ivory overflow-hidden">
        {catalogue.cover_image ? (
          <img
            src={resolveImageUrl(catalogue.cover_image)}
            alt={`${catalogue.title} cover`}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-navy/30">
            <FileText size={48} />
          </div>
        )}
        <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wide text-ink bg-gold rounded-full px-2.5 py-1 shadow-soft">
          {catalogue.category}
        </span>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-serif text-lg text-ink leading-snug">{catalogue.title}</h3>
        <p className="text-xs text-ink/60 mt-1">
          {catalogue.year ? `${catalogue.year} · ` : ""}
          {catalogue.page_count ? `${catalogue.page_count} pages · ` : ""}
          {catalogue.file_size_mb ? `${catalogue.file_size_mb} MB` : "PDF"}
        </p>
        {catalogue.description && <p className="text-sm text-ink/70 mt-2 leading-relaxed line-clamp-2">{catalogue.description}</p>}
        <div className="mt-4 flex gap-2">
          <a
            href={resolveImageUrl(catalogue.pdf_url)}
            target="_blank"
            rel="noreferrer"
            data-testid={`catalogue-view-${catalogue.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 border border-navy text-navy text-sm font-medium py-2.5 rounded-sm hover:bg-navy hover:text-white transition-colors duration-200"
          >
            <Eye size={15} /> View
          </a>
          <a
            href={resolveImageUrl(catalogue.pdf_url)}
            download
            onClick={track}
            data-testid={`catalogue-download-${catalogue.slug}`}
            className="flex-1 flex items-center justify-center gap-1.5 bg-navy text-white text-sm font-medium py-2.5 rounded-sm hover:bg-gold transition-colors duration-200"
          >
            <Download size={15} /> Download
          </a>
        </div>
      </div>
    </div>
  );
}
