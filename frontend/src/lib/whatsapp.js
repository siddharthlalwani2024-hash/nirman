export function buildWhatsAppLink(whatsappNumber, message) {
  const digits = (whatsappNumber || "").replace(/[^\d]/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function tileInquiryMessage(tile) {
  return `Hi Nirman Udyog, I'm interested in *${tile.name}* (SKU: ${tile.sku}). Could you share more details and availability?`;
}

export function generalInquiryMessage() {
  return "Hi Nirman Udyog, I'd like to know more about your tile collection.";
}
