
const prisma = require("../helpers/prisma.ts")
const { v4: uuidv4 } = require('uuid');
const bcrypt = require("bcrypt")
const dotenv = require('dotenv');
var jwt  = require("jsonwebtoken");

const register = async (req,res)=>{
    try {
        
        const {
            fullname,
            email,
            password,
            confirm_password
        } = req.body;
        
        if(password != confirm_password ) {
            res.status(404).json({
                message : 'Password tidak sama!',
                success : false,
                data : null,
            });
            return;
          }

        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        
        //buat user
        const newUser = await prisma.users.create({
            data : {
                id : uuidv4(),
                fullname :fullname,
                email : email,
                password : passwordHash
            }
        })

        token = jwt.sign({
            id: newUser.id
        },'secretkey');
    

        res.status(201).json({
            message : 'Register berhasil',
            success : true,
            data : newUser,
            token : token
        });
    } catch (error) {   
        console.log(error);
        res.status(500).json({
            message : 'Register Gagal',
            success : false,
            data : null,
        });
    }
};

const login = async (req,res)=>{
    try{
        const{
            email,
            password
        } = req.body;

        const user = await prisma.users.findUnique({
            where: {
              email: email,
            },
          });
       

          //user tidak ditemukan
          if(!user ) {
            res.status(404).json({
                message : 'Tidak menemukan user!',
                success : false,
                data : null,
            });
            return;
          }
         

          const verified = bcrypt.compareSync(password, user.password);
          if(!verified ) {
            res.status(404).json({
                message : 'Password salah!',
                success : false,
                data : null,
            });
            return;
          }
          token = jwt.sign({
            id: user.id
        },'secretkey');
          
          res.status(200).json({
            message : 'Login Berhasil',
            success : true,
            data : user,
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


// const logout = async (req, res) => {
//     try {
//         const token = req.headers["token"];
//         const decoded = jwt.verify(token,"secretkey");
//         const id = decoded.id;
//         const t = jwt.sign({ id: id }, 'secretkey', { expiresIn: '1s' });
//         res.status(200).json({
//             message : 'Logout Berhasil',
//             success : true,
//             data : null
//         });
           
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             message : 'Internal Server Error',
//             success : false,
//             data : null,
//         });
//     }
// }

module.exports = {
    register,
    login
};