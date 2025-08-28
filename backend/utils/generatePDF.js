const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const fetch = require('node-fetch');
async function fetchBuffer(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function generateTicketId() {
  return Math.floor(Math.random() * 900000) + 100000; // 6-digit clean ID
}

async function generateTicketPDF(bookingData, filePath) {
  const doc = new PDFDocument({
    size: "A5",
    margins: { top: 30, bottom: 30, left: 30, right: 30 },
  });
  doc.pipe(fs.createWriteStream(filePath));

  const pageWidth = doc.page.width;
  const pageHeight = doc.page.height;

  // ===== Fetch and Register Poppins Font from Online URL =====
  const poppinsUrl = "https://fonts.gstatic.com/s/poppins/v21/pxiEyp8kv8JHgFVrJJfedw.woff2"; 
  // Note: WOFF2 won't work; make sure to use a TTF URL from Google Fonts GitHub or other source.
  const poppinsTtfUrl = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Regular.ttf";
  const poppinsBoldTtfUrl = "https://github.com/google/fonts/raw/main/ofl/poppins/Poppins-Bold.ttf";

  const [regularFont, boldFont] = await Promise.all([
    fetch(poppinsTtfUrl).then((r) => r.arrayBuffer()),
    fetch(poppinsBoldTtfUrl).then((r) => r.arrayBuffer()),
  ]);

  doc.registerFont("Poppins", Buffer.from(regularFont));
  doc.registerFont("Poppins-Bold", Buffer.from(boldFont));

  // ===== Ticket Border =====
  doc.rect(10, 10, pageWidth - 20, pageHeight - 20).stroke("#1a73e8");

  // ===== Background =====
  doc.rect(0, 0, pageWidth, pageHeight).fill("#f9fbff");
  doc.fillColor("#000"); // Reset text color

  // ===== Header =====
  const logoPath = path.join(__dirname, "..", "images", "4.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, pageWidth / 2 - 20, 25, { width: 40 });
  }

  doc.moveDown(2);
  doc.font("Poppins-Bold").fontSize(18).fillColor("#1a73e8")
    .text("Make The Eve", { align: "center" });

  doc.moveDown(1);
  doc.font("Poppins-Bold").fontSize(16).fillColor("#000")
    .text("Kavi Sammelan - Event Ticket", { align: "center" });
  doc.font("Poppins").fontSize(10).fillColor("#666")
    .text("Your Ticket to an Unforgettable Experience", { align: "center" });

  // ===== Ticket ID Highlight =====
  doc.moveDown(1);
  const idBoxW = 180, idBoxH = 25;
  const idBoxX = (pageWidth - idBoxW) / 2;
  const idBoxY = doc.y;
  doc.roundedRect(idBoxX, idBoxY, idBoxW, idBoxH, 6).fill("#1a73e8");
  doc.fillColor("#fff").font("Poppins-Bold").fontSize(12)
    .text(`Ticket ID: #${bookingData.ticketId}`, idBoxX, idBoxY + 6, { align: "center", width: idBoxW });

  doc.moveDown(1);

  // ===== Event Details Box =====
  const detailsY = doc.y;
  doc.roundedRect(30, detailsY, pageWidth - 60, 70, 8).stroke("#1a73e8").fill("#fff");
  doc.font("Poppins-Bold").fontSize(11).fillColor("#000");
  doc.text("Date: September 20, 2025", 40, detailsY + 10);
  doc.text("Venue:Swami Vivekananda Auditorium, IIIT Manipur", 40, detailsY + 30);
  doc.text("Event: Kavi Sammelan", 40, detailsY + 50);

  doc.moveDown(1);

  // ===== Booking Details =====
  doc.font("Poppins-Bold").fontSize(13).fillColor("#1a73e8")
    .text("Booking Details", { align: "left" });
  doc.moveTo(30, doc.y).lineTo(pageWidth - 30, doc.y).stroke("#1a73e8");

  const addField = (label, value, icon) => {
    doc.moveDown(0.8);
    doc.font("Poppins-Bold").fontSize(11).fillColor("#444")
      .text(`${icon} ${label}: `, { continued: true });
    doc.font("Poppins").fillColor("#000").text(value);
  };

  addField("Name", bookingData.name, "");
  addField("Email", bookingData.email, "");
  addField("Mobile", bookingData.mobile, "");
  addField("Amount Paid", `₹${bookingData.amount}`, "");
  addField("Payment ID", bookingData.paymentId, "");


  doc.moveDown(1);

  // ===== Footer =====
  doc.font("Poppins-Bold").fontSize(10).fillColor("#000")
    .text(" Present this ticket at the entrance", { align: "center" });
  doc.moveDown(0.5);
  doc.font("Poppins").fontSize(8).fillColor("#666")
    .text("For any queries, contact us at maketheeve@gmail.com", { align: "center" });

  // ===== Dotted Cut Line =====
  doc.moveTo(20, pageHeight - 40)
    .lineTo(pageWidth - 20, pageHeight - 40)
    .dash(5, { space: 5 })
    .stroke("#999");

  doc.end();
}

module.exports = {
  generateTicketPDF,
  generateTicketId,
};
