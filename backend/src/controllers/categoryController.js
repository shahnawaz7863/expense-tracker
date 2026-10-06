import Category from "../models/Category.js";

export const createCategory = async (req, res, next) => {
  try {
    const existingCategory = await Category.findOne({
      user: req.user.userId,
      name: req.body.name,
      type: req.body.type,
    });

    if (existingCategory) {
      return res.status(409).json({
        success: false,
        message: "Category already exists",
      });
    }

    const category = await Category.create({
      name: req.body.name,
      type: req.body.type,
      isActive: req.body.isActive,
      user: req.user.userId,
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};


export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      user: req.user.userId,
      isActive: true,
    }).sort({ type: 1, name: 1 });

    return res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    next(error);
  }
};


export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        name: req.body.name,
        type: req.body.type,
        isActive: req.body.isActive,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category updated successfully",
      category,
    });
  } catch (error) {
    next(error);
  }
};



export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};