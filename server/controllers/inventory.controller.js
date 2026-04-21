import Inventory from "../models/Inventory.js";

// @route   POST /api/inventory/add
// @desc    Add new inventory item
export const addInventory = async (req, res) => {
  try {
    const { name, category, totalStock, rentPrice, purchasePrice, description, location, photoUrl } = req.body;

    // Validation
    if (!name || !category || !totalStock || !rentPrice) {
      return res.status(400).json({ message: "Required fields missing" });
    }

   

    const inventory = new Inventory({
      vendorId: req.userId,
      name,
      category,
      totalStock,
      availableStock: totalStock,
      rentPrice,
      purchasePrice,
      description,
      location,
      photoUrl,
      itemCondition: "Good"
    });

    console.log(inventory)

    await inventory.save();
    res.status(201).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/inventory/all
// @desc    Get all inventory items for vendor
export const getAllInventory = async (req, res) => {
  try {
    const inventory = await Inventory.find({ vendorId: req.userId }).sort({ createdAt: -1 });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/inventory/:id
// @desc    Get single inventory item
export const getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory || inventory.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Inventory not found" });
    }
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/inventory/category/:category
// @desc    Get inventory by category
export const getByCategory = async (req, res) => {
  try {
    const inventory = await Inventory.find({
      vendorId: req.userId,
      category: req.params.category
    });
    res.status(200).json(inventory);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/inventory/:id
// @desc    Update inventory item
export const updateInventory = async (req, res) => {
  try {
    const { name, totalStock, availableStock, rentPrice, itemCondition, location } = req.body;

    const inventory = await Inventory.findById(req.params.id);
    if (!inventory || inventory.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    // Update fields
    if (name) inventory.name = name;
    if (totalStock) inventory.totalStock = totalStock;
    if (availableStock !== undefined) inventory.availableStock = availableStock;
    if (rentPrice) inventory.rentPrice = rentPrice;
    if (itemCondition) inventory.itemCondition = itemCondition;
    if (location) inventory.location = location;

    await inventory.save();
    res.status(200).json({ message: "Inventory updated", inventory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/inventory/:id
// @desc    Delete inventory item
export const deleteInventory = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory || inventory.vendorId.toString() !== req.userId) {
      return res.status(404).json({ message: "Inventory not found" });
    }

    await Inventory.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Inventory deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   POST /api/inventory/check-availability
// @desc    Check availability of items for a booking
export const checkAvailability = async (req, res) => {
  try {
    const { itemsNeeded, eventDate } = req.body;
    // itemsNeeded = [{ itemId, quantity }, ...]

    const bookings = await Inventory.find({ vendorId: req.userId });
    
    if (!itemsNeeded || itemsNeeded.length === 0) {
      return res.status(400).json({ message: "Items needed required" });
    }

    let availableItems = [];
    let unavailableItems = [];

    for (const item of itemsNeeded) {
      const inventoryItem = await Inventory.findById(item.itemId);
      
      if (!inventoryItem) {
        unavailableItems.push({ itemId: item.itemId, reason: "Item not found" });
        continue;
      }

      if (inventoryItem.availableStock >= item.quantity) {
        availableItems.push({
          itemId: item.itemId,
          itemName: inventoryItem.name,
          availableQuantity: inventoryItem.availableStock,
          requestedQuantity: item.quantity,
          rentPrice: inventoryItem.rentPrice
        });
      } else {
        unavailableItems.push({
          itemId: item.itemId,
          itemName: inventoryItem.name,
          available: inventoryItem.availableStock,
          requested: item.quantity
        });
      }
    }

    res.status(200).json({
      availableItems,
      unavailableItems,
      isFullyAvailable: unavailableItems.length === 0
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
