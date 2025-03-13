var express = require('express');
var router = express.Router();
let CategoryModel = require('../schemas/categories');
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');


router.get('/', async function(req, res, next) {
  try {
    let categories = await CategoryModel.find(
      { isDeleted: false 

      });
    CreateSuccessRes(res, categories, 200);
  } catch (error) {
    next(error);
  }
});


router.get('/:id', async function(req, res, next) {
  try {
    let category = await CategoryModel.findOne(
      { _id: req.params.id, 
        isDeleted: false 

      });
    if (!category) return CreateErrorRes(res, "Không tìm thấy danh mục!", 404);
    CreateSuccessRes(res, category, 200);
  } catch (error) {
    next(error);
  }
});


router.post('/', async function(req, res, next) {
  try {
    let { name, description } = req.body;
    let newCategory = new CategoryModel(
      { name, 
        description 
      });
    await newCategory.save();
    CreateSuccessRes(res, newCategory, 201);
  } catch (error) {
    next(error);
  }
});


router.put('/:id', async function(req, res, next) {
  try {
    let updateData = {};
    if (req.body.name) updateData.name = req.body.name;
    if (req.body.description) updateData.description = req.body.description;

    let updatedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!updatedCategory) return CreateErrorRes(res, "Không tìm thấy danh mục!", 404);
    CreateSuccessRes(res, updatedCategory, 200);
  } catch (error) {
    next(error);
  }
});


router.delete('/:id', async function(req, res, next) {
  try {
    let deletedCategory = await CategoryModel.findByIdAndUpdate(
      req.params.id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCategory) return CreateErrorRes(res, "Không tìm thấy danh mục!", 404);
    CreateSuccessRes(res, deletedCategory, 200);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
