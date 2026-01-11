// Script para criar o primeiro admin
// Execute: node seed-admin.js

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const AdminUser = require('./models/AdminUser.model');

async function createAdmin() {
    try {
        // Conectar ao MongoDB
        await mongoose.connect(process.env.MONGODB);
        console.log('Conectado ao MongoDB');

        // Dados do admin
        const adminData = {
            username: 'lucas',
            email: 'lucas.user.xyz@gmail.com',
            password: 'Sx1Admin@2024!',  // Senha gerada
            role: 'admin'
        };

        // Verificar se já existe
        const existingAdmin = await AdminUser.findOne({ email: adminData.email });
        if (existingAdmin) {
            console.log('Admin já existe com este email!');
            process.exit(0);
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminData.password, salt);

        // Criar admin
        const admin = new AdminUser({
            username: adminData.username,
            email: adminData.email,
            password: hashedPassword,
            role: 'admin'
        });

        await admin.save();

        console.log('\n========================================');
        console.log('Admin criado com sucesso!');
        console.log('========================================');
        console.log('Email:', adminData.email);
        console.log('Senha:', adminData.password);
        console.log('========================================\n');

        process.exit(0);
    } catch (error) {
        console.error('Erro:', error.message);
        process.exit(1);
    }
}

createAdmin();