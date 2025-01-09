const express = require('express');
const app = express();
require('dotenv').config();

const { MongoClient } = require('mongodb');

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

async function fetchQuestions() {
    try {
        console.log("Tentando conectar ao MongoDB...");
        if (!client.isConnected) await client.connect(); 
        console.log("Conectado ao MongoDB!");

        const database = client.db('DevQuiz');
        const collection = database.collection('Questions');

        const questions = await collection.find({}).toArray();
        return questions;
    } catch (error) {
        console.error('Erro ao buscar os dados:', error);
        throw error; 
    }
}

app.get('/', async (req, res) => {
    try {
        const questions = await fetchQuestions();
        res.json(questions); 
    } catch (error) {
        res.status(500).send('Erro ao buscar as perguntas');
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});