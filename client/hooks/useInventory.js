import { useState, useEffect } from "react";
import { inventoryAPI } from "../lib/api";

export const useInventory = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all inventory
  const fetchInventory = async () => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getAllInventory();
 
          console.log("API RESPONSE:", response);   // 🔥 ADD THIS
    // console.log("DATA:", response.data.data);  

      setInventory(response || []);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch inventory");
      console.error("Inventory fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add new inventory item
  const addItem = async (itemData) => {
    setLoading(true);
    try {
      const response = await inventoryAPI.addInventory(itemData);
      setInventory([...inventory, response.data]);
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || "Failed to add item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Update inventory item
  const updateItem = async (id, itemData) => {
    setLoading(true);
    try {
      const response = await inventoryAPI.updateInventory(id, itemData);
      setInventory(
        inventory.map((item) => (item._id === id ? response : item))
      );
      setError(null);
      return response;
    } catch (err) {
      setError(err.message || "Failed to update item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Delete inventory item
  const deleteItem = async (id) => {
    setLoading(true);
    try {
      await inventoryAPI.deleteInventory(id);
      setInventory(inventory.filter((item) => item._id !== id));
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to delete item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Get items by category
  const getByCategory = async (category) => {
    setLoading(true);
    try {
      const response = await inventoryAPI.getByCategory(category);
      setError(null);
      return response.data;
    } catch (err) {
      setError(err.message || "Failed to fetch category items");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Check availability
  const checkAvailability = async (itemsNeeded, eventDate) => {
    try {
      const response = await inventoryAPI.checkAvailability({
        itemsNeeded,
        eventDate
      });
      return response.data;
    } catch (err) {
      console.error("Availability check error:", err);
      throw err;
    }
  };

  useEffect(() => {
    // Token is automatically sent via cookies
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    fetchInventory,
    addItem,
    updateItem,
    deleteItem,
    getByCategory,
    checkAvailability
  };
};
