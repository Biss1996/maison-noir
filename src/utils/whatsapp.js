const WHATSAPP_NUMBER = "254727783444";

export function waLink(message = "") {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}