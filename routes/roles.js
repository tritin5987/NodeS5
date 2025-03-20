var express = require('express');
var router = express.Router();
let RoleModel = require('../schemas/roles');
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');

/* GET all role */
router.get('/', async function(req, res, next) {
    try {
        let roles = await RoleModel.find({ isDeleted: false }); 
        CreateSuccessRes(res, roles, 200);
    } catch (error) {
        next(error);
    }
});


/* GET role by ID */
router.get('/:id', async function(req, res, next) {
    try {
        let role = await RoleModel.findById(req.params.id);
        if (!role) return CreateErrorRes(res, "Role not found", 404);
        CreateSuccessRes(res, role, 200);
    } catch (error) {
        next(error);
    }
});

/* CREATE a new role */
router.post('/', async function(req, res, next) {
    try {
        let body = req.body;
        let newRole = new RoleModel({
            name: body.name,
            description: body.description || ""
        });
        await newRole.save();
        CreateSuccessRes(res, newRole, 201);
    } catch (error) {
        next(error);
    }
});

/* UPDATE a role */
router.put('/:id', async function(req, res, next) {
    try {
        let updatedRole = await RoleModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedRole) return CreateErrorRes(res, "Role not found", 404);
        CreateSuccessRes(res, updatedRole, 200);
    } catch (error) {
        next(error);
    }
});

/* DELETE (soft delete) a role */
router.delete('/:id', async function(req, res, next) {
    try {
        let id = req.params.id;

        let updatedRole = await RoleModel.findByIdAndUpdate(
            id,
            { isDeleted: true }, // Đánh dấu role là đã bị xoá
            { new: true }
        );

        if (!updatedRole) return CreateErrorRes(res, "Role not found", 404);

        CreateSuccessRes(res, updatedRole, 200);
    } catch (error) {
        next(error);
    }
});

module.exports = router;
