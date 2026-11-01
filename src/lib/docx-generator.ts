import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  ImageRun,
  Header,
  Footer,
  PageNumber,
} from "docx";
import { OfferLetterRecord } from "@/types/internship";

// Helper to fetch image as Uint8Array/ArrayBuffer for DOCX embedding
async function fetchImageBuffer(url: string): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch (e) {
    console.warn("Could not load image for docx embedding:", url, e);
    return null;
  }
}

export async function generateOfferLetterDocx(offer: OfferLetterRecord): Promise<Blob> {
  const { candidate, internship, companySnapshot: company, signatorySnapshot: signatory } = offer;

  // Try to load images
  let logoBuffer: ArrayBuffer | null = null;
  let signatureBuffer: ArrayBuffer | null = null;

  try {
    logoBuffer = await fetchImageBuffer(company.logoUrl || "/images/ivr-official-logo.png");
  } catch (e) {
    console.warn("Logo fetch failed", e);
  }

  if (signatory.includeSignatureImage && signatory.signatureUrl) {
    try {
      signatureBuffer = await fetchImageBuffer(signatory.signatureUrl);
    } catch (e) {
      console.warn("Signature fetch failed", e);
    }
  }

  const navyColor = "071B3A";
  const royalBlueColor = "0866E8";
  const goldColor = "F5B82E";
  const grayTextColor = "475569";
  const darkTextColor = "0F172A";

  const doc = new Document({
    creator: company.name,
    title: `Internship Offer Letter - ${candidate.fullName} - ${offer.referenceNumber}`,
    description: `Official Internship Offer Letter issued by ${company.name}`,
    styles: {
      default: {
        document: {
          run: {
            font: "Calibri",
            size: 21, // 10.5 pt
            color: darkTextColor,
          },
          paragraph: {
            spacing: { line: 260, before: 60, after: 60 },
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1000,
              bottom: 1000,
              left: 1100,
              right: 1100,
            },
          },
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: `${company.name} | Ref: ${offer.referenceNumber}`,
                    size: 16,
                    color: "94A3B8",
                  }),
                ],
              }),
            ],
          }),
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: [
                      company.name,
                      company.address && company.address.trim() ? company.address.trim() : null,
                      `Email: ${company.email}`,
                      `Tel: +91 ${company.phone}`,
                    ]
                      .filter(Boolean)
                      .join(" • "),
                    size: 15,
                    color: "64748B",
                  }),
                ],
              }),
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: "Page ",
                    size: 15,
                    color: "94A3B8",
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    size: 15,
                    color: "94A3B8",
                  }),
                  new TextRun({
                    text: " of ",
                    size: 15,
                    color: "94A3B8",
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    size: 15,
                    color: "94A3B8",
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          // LETTERHEAD HEADER
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 8, color: royalBlueColor },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: logoBuffer ? 30 : 5, type: WidthType.PERCENTAGE },
                    children: logoBuffer
                      ? [
                          new Paragraph({
                            children: [
                              new ImageRun({
                                data: logoBuffer,
                                transformation: { width: 140, height: 60 },
                                type: "png",
                              }),
                            ],
                          }),
                        ]
                      : [],
                  }),
                  new TableCell({
                    width: { size: logoBuffer ? 70 : 95, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: company.name.toUpperCase(),
                            bold: true,
                            size: 26,
                            color: navyColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: company.tagline,
                            italics: true,
                            size: 18,
                            color: royalBlueColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: `${company.website} | ${company.email} | +91 ${company.phone}`,
                            size: 16,
                            color: grayTextColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: company.registrationNumber || "CIN: Corporate Registered Entity",
                            size: 14,
                            color: "94A3B8",
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // SPACING
          new Paragraph({ text: "" }),

          // DOCUMENT TITLE & METADATA BAR
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.SINGLE, size: 4, color: "CBD5E1" },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 60, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Ref: ",
                            bold: true,
                            size: 18,
                            color: grayTextColor,
                          }),
                          new TextRun({
                            text: offer.referenceNumber,
                            bold: true,
                            size: 19,
                            color: navyColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                  new TableCell({
                    width: { size: 40, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        alignment: AlignmentType.RIGHT,
                        children: [
                          new TextRun({
                            text: "Date of Issue: ",
                            bold: true,
                            size: 18,
                            color: grayTextColor,
                          }),
                          new TextRun({
                            text: new Date(offer.issueDate).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            }),
                            bold: true,
                            size: 18,
                            color: darkTextColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // HEADING
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 180 },
            children: [
              new TextRun({
                text: "INTERNSHIP OFFER & APPOINTMENT LETTER",
                bold: true,
                size: 26,
                color: navyColor,
              }),
            ],
          }),

          // CANDIDATE SALUTATION BLOCK
          new Paragraph({
            children: [
              new TextRun({ text: "To,", bold: true, color: grayTextColor }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({ text: candidate.fullName, bold: true, size: 23, color: navyColor }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${candidate.degree} - ${candidate.department}`,
                color: grayTextColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `${candidate.college}${candidate.university ? ` (${candidate.university})` : ""}`,
                color: grayTextColor,
              }),
            ],
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `Email: ${candidate.email}  |  Contact: +91 ${candidate.phone}`,
                color: grayTextColor,
              }),
            ],
          }),

          // FORMAL SELECTION ANNOUNCEMENT
          new Paragraph({
            spacing: { before: 180, after: 120 },
            children: [
              new TextRun({
                text: `Dear ${candidate.fullName},`,
                bold: true,
                size: 22,
                color: navyColor,
              }),
            ],
          }),
          new Paragraph({
            alignment: AlignmentType.JUSTIFIED,
            children: [
              new TextRun({
                text: `On behalf of `,
              }),
              new TextRun({
                text: `${company.name}`,
                bold: true,
              }),
              new TextRun({
                text: `, we are pleased to offer you an appointment as an `,
              }),
              new TextRun({
                text: `${internship.role}`,
                bold: true,
                color: royalBlueColor,
              }),
              new TextRun({
                text: ` under our Corporate Internship Program. This appointment is made based on your academic credentials, technical aptitude, and successful participation in our selection process.`,
              }),
            ],
          }),

          // PROGRAM DETAILS TABLE
          new Paragraph({
            spacing: { before: 140, after: 80 },
            children: [
              new TextRun({
                text: "INTERNSHIP PROGRAM SCHEDULE & DETAILS",
                bold: true,
                size: 20,
                color: navyColor,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
              left: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
              right: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "E2E8F0" },
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    width: { size: 30, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: "Internship Domain", bold: true })] })],
                  }),
                  new TableCell({
                    width: { size: 70, type: WidthType.PERCENTAGE },
                    children: [new Paragraph({ children: [new TextRun({ text: internship.domain, bold: true, color: royalBlueColor })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Designated Role", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: internship.role })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Duration & Tenure", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${internship.duration}  (` }),
                          new TextRun({
                            text: `${new Date(internship.startDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} to ${new Date(internship.endDate).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`,
                            bold: true,
                          }),
                          new TextRun({ text: ")" }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Internship Mode & Batch", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${internship.mode}  |  Batch: ${internship.batch}` }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Reporting Mentor & Manager", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({ text: `${internship.reportingMentor}  |  Manager: ${internship.reportingManager}` }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Working Hours", bold: true })] })],
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: internship.workingHours })] })],
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    shading: { fill: "F8FAFC" },
                    children: [new Paragraph({ children: [new TextRun({ text: "Stipend / Honorarium", bold: true })] })],
                  }),
                  new TableCell({
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: internship.stipend || "Academic Internship (Unpaid / Performance Incentive based)",
                            bold: Boolean(internship.stipend),
                            color: internship.stipend ? royalBlueColor : grayTextColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // TERMS AND CONDITIONS HEADING
          new Paragraph({
            spacing: { before: 200, after: 80 },
            children: [
              new TextRun({
                text: "TERMS AND CONDITIONS OF INTERNSHIP",
                bold: true,
                size: 20,
                color: navyColor,
              }),
            ],
          }),

          // RENDER CLAUSES
          ...company.terms.flatMap((term) => [
            new Paragraph({
              spacing: { before: 80, after: 40 },
              children: [
                new TextRun({
                  text: term.title,
                  bold: true,
                  size: 19,
                  color: navyColor,
                }),
              ],
            }),
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED,
              spacing: { before: 0, after: 80 },
              children: [
                new TextRun({
                  text: term.content,
                  size: 18,
                  color: grayTextColor,
                }),
              ],
            }),
          ]),

          // ACCEPTANCE & SIGNATORY BLOCK (KEPT TOGETHER)
          new Paragraph({
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({
                text: "OFFER ACCEPTANCE & AUTHORIZED SIGNATORY",
                bold: true,
                size: 20,
                color: navyColor,
              }),
            ],
          }),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
              bottom: { style: BorderStyle.SINGLE, size: 2, color: "CBD5E1" },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE },
            },
            rows: [
              new TableRow({
                children: [
                  // CANDIDATE ACCEPTANCE COLUMN
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Candidate Acceptance Undertaking",
                            bold: true,
                            size: 19,
                            color: navyColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { before: 40, after: 80 },
                        children: [
                          new TextRun({
                            text: "I hereby accept the internship appointment under the terms and conditions outlined above.",
                            size: 16,
                            color: grayTextColor,
                            italics: true,
                          }),
                        ],
                      }),
                      new Paragraph({ text: "" }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Signature: __________________________",
                            size: 18,
                            color: grayTextColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        spacing: { before: 40, after: 20 },
                        children: [
                          new TextRun({
                            text: `Candidate Name: ${candidate.fullName}`,
                            size: 17,
                            bold: true,
                            color: darkTextColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: "Date: _______________________________",
                            size: 17,
                            color: grayTextColor,
                          }),
                        ],
                      }),
                    ],
                  }),

                  // AUTHORIZED SIGNATORY COLUMN (NO SEAL!)
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `For ${company.name}`,
                            bold: true,
                            size: 19,
                            color: navyColor,
                          }),
                        ],
                      }),
                      // Signature image if uploaded/enabled, or clean blank signature line
                      ...(signatureBuffer && signatory.includeSignatureImage
                        ? [
                            new Paragraph({
                              spacing: { before: 40, after: 40 },
                              children: [
                                new ImageRun({
                                  data: signatureBuffer,
                                  transformation: { width: 140, height: 45 },
                                  type: "png",
                                }),
                              ],
                            }),
                          ]
                        : [
                            new Paragraph({ text: "" }),
                            new Paragraph({
                              spacing: { before: 80, after: 40 },
                              children: [
                                new TextRun({
                                  text: "____________________________",
                                  size: 18,
                                  color: grayTextColor,
                                }),
                              ],
                            }),
                          ]),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: signatory.name,
                            bold: true,
                            size: 19,
                            color: darkTextColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: signatory.designation,
                            bold: true,
                            size: 17,
                            color: royalBlueColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: company.name,
                            size: 16,
                            color: grayTextColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Email: ${signatory.email}`,
                            size: 16,
                            color: grayTextColor,
                          }),
                        ],
                      }),
                      new Paragraph({
                        children: [
                          new TextRun({
                            text: `Contact: +91 ${signatory.phone}`,
                            size: 16,
                            color: grayTextColor,
                          }),
                        ],
                      }),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      },
    ],
  });

  return await Packer.toBlob(doc);
}
