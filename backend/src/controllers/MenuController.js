import path from "path";
import { getMenu, saveMenu } from "../Utils/MenuStore.js";

const filePath = path.resolve("./src/Db/menuData.json");

export const getAllMenuItem =async (req, res) => {
  try {
    const menu = await getMenu();

    res.status(200).json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
}

export const addMenuItem =  async (req, res) => {
  try {
    const { name, category, price, description, available } = req.body;
    const response = await getMenu();

    const id =
      response.length > 0
        ? Math.max(...response.map((item) => item.id)) + 1
        : 1;
    const newData = {
      id,
      name,
      category,
      price: Number(price),
      description,
      available: available === true,
    };

    response.push(newData);

    await saveMenu(response);
    res.status(201).json({
      message: "Menu item added successfully",
      data: newData,
    });
  } catch (error) {
    console.error("Error adding menu item:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add menu item",
      error: error.message,
    });
  }
}


export const getById = async (req, res) => {
  try {
    
    const id = Number(req.params.id);
    const response = await getMenu();

    //console.log(response);

    const item = response.find((item) => item.id === id);

    if (!item) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }

    res.json(item);
   
  } catch (error) {
    res.status(500).json({
      err: error.message,
    });
  }
}


export const updateItem = async (req, res) => {
  try {
    const { name, category, price, description, available } = req.body;
    const id = Number(req.params.id);
    const response = await getMenu();

    const item = response.find((item) => item.id === id);
      if (!item) {
      return res.status(404).json({
        message: "Menu item not found",
      });
    }
    
    

        if (name !== undefined) item.name = name;
        if (category !== undefined) item.category = category;
        if (price !== undefined) item.price = Number(price);
        if (description !== undefined) item.description = description;

        if (available !== undefined) {
            item.available = available === true || available === 'true';
        }

    await saveMenu(response);
    res.status(200).json({
      message: "Menu item updated successfully",
      data: item,
    });
    
  } catch (error) {
     res.status(500).json({
      err: error.message,
    });
  }
}

export const deleteItem= async (req, res) => {
    try {
        const id = Number(req.params.id);
        const response = await getMenu();

        // Check if the item exists before deleting
        const itemExists = response.find(item => item.id === id);

        if (!itemExists) {
            return res.status(404).json({
                success: false,
                message: 'Menu item not found'
            });
        }

        // Filter out the item with the matching id
        const updatedMenu = response.filter(item => item.id !== id);

        // Save the updated menu array back to storage
        await saveMenu(updatedMenu);

        return res.status(200).json({
            success: true,
            message: 'Menu item deleted successfully'
        });

    } catch (error) {
        console.error('Error deleting menu item:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to delete menu item',
            err: error.message
        });
    }
}