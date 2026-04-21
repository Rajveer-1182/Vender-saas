// Simplified Invoice Generator (PDF generation disabled for now)
// Install jspdf and jspdf-autotable later for production

const generatePDFInvoice = async (booking, vendorData) => {
  try {
    // Return a text representation for now
    // Later, use jsPDF to generate actual PDF
    
    const invoiceText = `
═══════════════════════════════════════════════
            VENDOR INVOICE
═══════════════════════════════════════════════

Business: ${vendorData.businessName}
Phone: ${vendorData.phone}
Email: ${vendorData.email || "N/A"}
GST: ${vendorData.gstNumber || "N/A"}

───────────────────────────────────────────────
Invoice ID: ${booking._id}
Date: ${new Date().toLocaleDateString("en-IN")}

BILLING DETAILS:
───────────────────────────────────────────────
Client Name: ${booking.clientName}
Phone: ${booking.clientPhone}
Email: ${booking.clientEmail || "N/A"}
Event Date: ${new Date(booking.eventDate).toLocaleDateString("en-IN")}
Venue: ${booking.venue || "N/A"}
Guest Count: ${booking.guestCount || "N/A"}

ITEMS BOOKED:
───────────────────────────────────────────────
${booking.itemsBooked
  .map(
    (item) =>
      `${item.itemName} x${item.quantity} @ ₹${item.rentPrice} = ₹${item.subtotal}`
  )
  .join("\n")}

───────────────────────────────────────────────
Total Amount:    ₹${booking.totalAmount}
Advance Paid:    ₹${booking.advancePaid || 0}
Balance Due:     ₹${booking.totalAmount - (booking.advancePaid || 0)}

TERMS & CONDITIONS:
───────────────────────────────────────────────
1. Payment should be made as per booking terms
2. Damage charges will be levied as per agreement
3. Items must be returned in original condition

═══════════════════════════════════════════════
    Thank you for your business!
═══════════════════════════════════════════════
    `;

    return invoiceText;
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    throw error;
  }
};

// Send Invoice via WhatsApp
export const generateAndSendInvoice = async (booking) => {
  try {
    // Get vendor details
    const User = (await import("../models/User.js")).default;
    const vendor = await User.findById(booking.vendorId);

    if (!vendor) {
      throw new Error("Vendor not found");
    }

    // Generate invoice text
    const invoiceText = await generatePDFInvoice(booking, vendor);

    // Create WhatsApp deep link with invoice details
    const invoiceUrl = `https://wa.me/${booking.clientPhone.replace("+", "")}?text=${encodeURIComponent(invoiceText)}`;

    return invoiceUrl;
  } catch (error) {
    console.error("Invoice Send Error:", error);
    throw error;
  }
};

// Generate Invoice without sending (for storage)
export const generateInvoicePDF = async (booking, vendorData) => {
  return await generatePDFInvoice(booking, vendorData);
};
