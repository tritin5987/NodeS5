var express = require('express');
var router = express.Router();
let UserModel = require('../schemas/users');
let { CreateErrorRes, CreateSuccessRes } = require('../utils/responseHandler');


/* GET all user */
router.get('/', async function(req, res, next) {
    try {
        let { username, fullName, minLoginCount, maxLoginCount } = req.query;
        let filter = {};

        // Tìm username chứa chuỗi nhập vào 
        if (username) {
            filter.username = { $regex: username, $options: 'i' };
        }

        // Tìm fullName chứa chuỗi nhập vào 
        if (fullName) {
            filter.fullName = { $regex: fullName, $options: 'i' };
        }

        // Lọc loginCount >= minLoginCount
        if (minLoginCount) {
            filter.loginCount = { ...filter.loginCount, $gte: parseInt(minLoginCount) };
        }

        // Lọc loginCount <= maxLoginCount
        if (maxLoginCount) {
            filter.loginCount = { ...filter.loginCount, $lte: parseInt(maxLoginCount) };
        }

        let users = await UserModel.find(filter).populate('role');

        CreateSuccessRes(res, users, 200);
    } catch (error) {
        next(error);
    }
});


/* GET user by ID */
router.get('/:id', async function(req, res, next) {
    try {
        let user = await UserModel.findById(req.params.id).populate('role');
        if (!user) return CreateErrorRes(res, "User not found", 404);
        CreateSuccessRes(res, user, 200);
    } catch (error) {
        next(error);
    }
});

/* CREATE a new user */
router.post('/', async function(req, res, next) {
    try {
        let body = req.body;
        let newUser = new UserModel({
            username: body.username,
            password: body.password,
            email: body.email,
            fullName: body.fullName || "",
            avatarUrl: body.avatarUrl || "",
            status: body.status || false,
            role: body.role,
            loginCount: 0
        });
        await newUser.save();
        CreateSuccessRes(res, newUser, 201);
    } catch (error) {
        next(error);
    }
});

/* UPDATE user */
router.put('/:id', async function(req, res, next) {
    try {
        let updatedUser = await UserModel.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('role');
        if (!updatedUser) return CreateErrorRes(res, "User not found", 404);
        CreateSuccessRes(res, updatedUser, 200);
    } catch (error) {
        next(error);
    }
});

/* DELETE (soft delete) a user */
router.delete('/:id', async function(req, res, next) {
    try {
        let id = req.params.id;

        let updatedUser = await UserModel.findByIdAndUpdate(
            id,
            { isDeleted: true }, // Đánh dấu user đã bị vô hiệu hóa
            { new: true }
        );

        if (!updatedUser) return CreateErrorRes(res, "User not found", 404);

        CreateSuccessRes(res, updatedUser, 200);
    } catch (error) {
        next(error);
    }
});

/* POST - Verify email và username, cập nhật status = true */
router.post('/verify', async function(req, res, next) {
    try {
        let { email, username } = req.body;

        // Kiểm tra xem User có tồn tại không
        let user = await UserModel.findOne({ email, username });

        if (!user) return CreateErrorRes(res, "User not found", 404);

        // Cập nhật status thành true
        user.status = true;
        await user.save();

        CreateSuccessRes(res, user, 200);
    } catch (error) {
        next(error);
    }
});


module.exports = router;
