const prisma = require("../helpers/prisma.ts");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
var jwt = require("jsonwebtoken");

const register = async (req, res) => {
    try {
        const {
            fullname,
            email,
            password,
            confirm_password,
        } = req.body;

        if (password != confirm_password) {
            res.status(404).json({
                message: "Password tidak sama!",
                success: false,
                data: null,
            });
            return;
        }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);


        //buat user
        const newUser = await prisma.users.create({
            data: {
                id: uuidv4(),
                fullname: fullname,
                email: email,
                password: passwordHash,
            },
        });

        token = jwt.sign(
            {
                id: newUser.id,
            },
            "secretkey"
        );

        user = await prisma.users.findUnique({
            where: {
                id: newUser.id,
            },
        });

        res.status(201).json({
            code: 201,
            status: "success",
            message: "Signup berhasil",
            data: newUser,
            token: token,
        });
    } catch (error) { 
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Internal Server Error",
            data: null,
        });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.users.findUnique({
            where: {
                email: email,
            },
        });

        //user tidak ditemukan
        if (!user) {
            res.status(404).json({
                message: "Tidak menemukan user!",
                success: false,
                data: null,
            });
            return;
        }

        const verified = bcrypt.compareSync(password, user.password);
        if (!verified) {
            res.status(404).json({
                message: "Password salah!",
                success: false,
                data: null,
            });
            return;
        }
        token = jwt.sign(
            {
                id: user.id,
            },
            "secretkey"
        );

        res.status(200).json({
            code: 200,
            status: "success",
            message: "Signin berhasil",
            user_id: user.id,
            token: token,
        });
    } catch (error) {
        res.status(500).json({
            code: 500,
            status: "error",
            message: "Internal Server Error",
        });
    }
};

const logout = async (req, res) => {
    try {
        res.status(200).json({
            message: "Logout Berhasil",
            success: true,
            data: null,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            data: null,
        });
    }
};

module.exports = {
    register,
    login,
    logout,
};
