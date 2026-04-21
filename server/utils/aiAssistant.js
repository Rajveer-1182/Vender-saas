// AI Assistant Utilities (Google GenAI Integration)
// Note: Google GenAI API requires GOOGLE_GENAI_API_KEY environment variable

// Simple quote generator (without GenAI for MVP)
export const generateQuoteFromGuestCount = async (vendorId, guestCount) => {
  try {
    const Inventory = (await import("../models/Inventory.js")).default;
    const inventory = await Inventory.find({ vendorId });

    if (inventory.length === 0) {
      return {
        success: false,
        message: "No inventory found for this vendor"
      };
    }

    // Simple logic: Estimate based on guest count
    // Standard formula: 1 chair per guest + 1 table per 10 guests + decorations
    
    const recommendations = [
      {
        item: "Chairs",
        quantity: Math.ceil(guestCount * 1.1), // 10% extra
        reason: "Standard wedding: 1 chair per guest + 10% contingency",
        estimatedCost: guestCount * 50
      },
      {
        item: "Tables",
        quantity: Math.ceil(guestCount / 10),
        reason: "1 table per 10 guests",
        estimatedCost: Math.ceil(guestCount / 10) * 500
      },
      {
        item: "Decoration Lights",
        quantity: Math.ceil(guestCount / 100) + 5,
        reason: "For ambiance and venue coverage",
        estimatedCost: (Math.ceil(guestCount / 100) + 5) * 1000
      }
    ];

    const totalEstimatedCost = recommendations.reduce((sum, item) => sum + item.estimatedCost, 0);

    return {
      success: true,
      recommendation: {
        recommendations,
        totalEstimatedCost,
        notes: `Based on ${guestCount} guests. Adjust quantities as needed based on venue size and wedding style.`
      }
    };
  } catch (error) {
    console.error("Quote Generation Error:", error);
    return {
      success: false,
      message: "Error generating quote",
      error: error.message
    };
  }
};

// Analyze booking trends (simplified)
export const analyzeBookingTrends = async (vendorId) => {
  try {
    const Booking = (await import("../models/Booking.js")).default;

    const recentBookings = await Booking.find({ vendorId }).limit(10);

    return {
      success: true,
      trendData: {
        totalBookings: recentBookings.length,
        averageBookingValue: recentBookings.reduce((sum, b) => sum + b.totalAmount, 0) / recentBookings.length || 0
      }
    };
  } catch (error) {
    console.error("Trend Analysis Error:", error);
    return {
      success: false,
      message: "Error analyzing trends"
    };
  }
};

// Estimate damage costs (simplified)
export const estimateDamageCosts = async (damagedItems) => {
  try {
    const totalCost = damagedItems.reduce((sum, item) => sum + (item.damageCost || 0), 0);

    return {
      success: true,
      damageAssessment: {
        itemsDamaged: damagedItems,
        totalDamageCost: totalCost
      }
    };
  } catch (error) {
    console.error("Damage Cost Estimation Error:", error);
    return {
      success: false,
      message: "Error estimating damage costs"
    };
  }
};
