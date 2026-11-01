import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { OfferLetterRecord } from "@/types/internship";

export async function generateOfferLetterPdf(
  elementId: string,
  offer: OfferLetterRecord
): Promise<Blob> {
  const element = document.getElementById(elementId);
  if (!element) {
    throw new Error(`Element with id "${elementId}" not found`);
  }

  // Hide any elements with data-html2canvas-ignore if needed
  const canvas = await html2canvas(element, {
    scale: 2.5, // Crisp high-DPI rendering
    useCORS: true,
    logging: false,
    backgroundColor: "#ffffff",
    windowWidth: element.scrollWidth,
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  // A4 dimensions in mm: 210 x 297
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = pdfWidth;
  const imgHeight = (canvas.height * pdfWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  // Add first page
  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
  heightLeft -= pdfHeight;

  // Add subsequent pages if document exceeds one page
  while (heightLeft > 0) {
    position = -(imgHeight - heightLeft);
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight, undefined, "FAST");
    heightLeft -= pdfHeight;
  }

  // Set document metadata
  pdf.setProperties({
    title: `Internship Offer Letter - ${offer.candidate.fullName}`,
    subject: `Internship Offer Reference: ${offer.referenceNumber}`,
    author: offer.companySnapshot.name,
    creator: "IVR Document Automation Suite",
  });

  return pdf.output("blob");
}

export function triggerBrowserPrint(): void {
  if (typeof window !== "undefined") {
    window.print();
  }
}
