import { Helmet } from "react-helmet-async";

export function SEO({ title, description, image }) {
  const fullTitle = title ? `${title} | Nirman Udyog` : "Nirman Udyog | Premium Tiles — Authorized Kajaria Dealer";
  const desc =
    description || "Premium PVT, GVT and Ceramic tiles for bathroom, kitchen, living, outdoor, wall and floor. Authorized Kajaria Dealer, Cooch Behar.";
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
