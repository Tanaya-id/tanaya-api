const prisma = require("../helpers/prisma.ts");
var jwt  = require("jsonwebtoken");
const bcrypt = require("bcrypt")

//endpoint untuk profile, mendapatkan data user yang sedang login
const me = async (req,res)=>{
    try {
        const token = req.headers["token"];
        const decoded = jwt.verify(token,"secretkey");
        const id = decoded.id;
        const user = await prisma.users.findUnique({
            where: {
              id: id,
            },
          });

        res.status(200).json({
            message : 'Success',
            success : true,
            data : user
        });
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            message : 'Internal Server Error',
            success : false,
            data : null,
        });
    }
};

//endpoint untuk profile, mendapatkan data user yang sedang login
const changePassword = async (req,res)=>{
    try {

        const {
            password,
            new_password,
            password_confirmation
        } = req.body;
        const token = req.headers["token"];
        const decoded = jwt.verify(token,"secretkey");
        const id = decoded.id;
        const user = await prisma.users.findUnique({
            where: {
              id: id,
            },
        });

        const verified = bcrypt.compareSync(password, user.password);
        if(!verified ) {
            res.status(422).json({
                message : 'Password saat ini salah!',
                success : false,
                data : null,
            });
            return;
        }

        if (new_password !== password_confirmation){
            res.status(422).json({
                message : 'Password baru dan password konfirmasi tidak sama!',
                success : false,
                data : null,
            });
            return;
        }
    

        const verified2 = bcrypt.compareSync(new_password, user.password);
        if(verified2 ) {
            res.status(422).json({
                message : 'Password tidak boleh sama seperti sebelumnya!',
                success : false,
                data : null,
            });
            return;
        }
        
        
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(new_password, salt);

        const updateUser = await prisma.users.update({
            where: {
                id: id,
            },
            data: {
                password: passwordHash 
            }
        });

        res.status(200).json({
            message : 'Berhasil mengganti password!',
            success : true,
            data : user
        });
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            message : 'Internal Server Error',
            success : false,
            data : null,
        });
    }
};

const updateProfile = async (req,res)=>{
    try {
           
        const {
            fullname,
            email
        } = req.body;
        
        const token = req.headers["token"];
        const decoded = jwt.verify(token,"secretkey");
        const id = decoded.id;
        const user = await prisma.users.findUnique({
            where: {
              id: id,
            },
        });

        const alreadyUser = await prisma.users.findUnique({
            where: {
              email: email
            },
        });

        if (alreadyUser){
            if (alreadyUser.email !== user.email){
                res.status(422).json({
                    message : 'Email telah digunakan!',
                    success : false,
                    data : null,
                });
                return;
            }
        }

        const updateUser = await prisma.users.update({
            where: {
              id: id,
            },
            data: {
              fullname: fullname,
              email: email,
            }
        });

        res.status(200).json({
            message : 'Berhasil mengubah profile!',
            success : true,
            data : updateUser,
            token : token
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Internal Server Error',
            success : false,
            data : null,
        });
    }
}

module.exports = {
    me, updateProfile, changePassword
};