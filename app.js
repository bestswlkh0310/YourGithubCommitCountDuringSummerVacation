const express = require('express');
const path = require('path');
const cors = require('cors');
const cheerio = require('cheerio');
const axios = require('axios');
const rateLimit = require("express-rate-limit");
const users = []
let tran = 0
const getUserInfo = async (id) => {
    const url = `https://github.com/${id}`;
    const response = await axios.get(url);

    if (response.status === 200) {
        const html = await response.data;
        const $ = cheerio.load(html);

        const grassSelector = 'tbody';
        const grassData = $(grassSelector);
        let totalCommits = 0;
        const result = []

        grassData.find('td').each((index, element) => {
            const dateString = $(element).attr('data-date');
            const span = $(element).find('span');
            t = span.text().split(' ')[0]
            if (t != "No" && dateString != undefined && isVacation(dateString)) {
                const contributions = parseInt(t);
                totalCommits += contributions;
                console.log(dateString, contributions);
                result.push({
                    date: dateString,
                    count: contributions
                })
            }
        });
        result.sort((a, b) => (a.date > b.date) ? 1 : -1);
        console.log('Total contributions:', totalCommits);
        for (let i = 0; i < users.length; i++) {
            if (users[i].name == id) {
                users.splice(i, 1)
                break
            }
        }

        if (users.length > 20) {
            users.splice(0, 1)
        }

        users.push({
            name: id,
            total: totalCommits
        })

        return {
            total: totalCommits,
            commits: result
        }
    } else {
        return undefined
    }
}

const isVacation = (date) => {
    const commitDate = new Date(date);
    const startDate = new Date('2023-07-18');
    const endDate = new Date('2023-08-15');
    return commitDate >= startDate && commitDate <= endDate;
}

const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, '../react-build')))
app.use(express.json());

app.use(rateLimit({
        windowMs: 1*60*1000, 
        max: 200
    })
);
app.options('*', cors());

app.post('/result', async (req,res) => {
    tran++
    console.log('/result')

    const { id } = req.body
    console.log(req.body)
    try {
        const result = await getUserInfo(id);
        if (result != undefined) {
            res.send(result);
        } else {
            res.send('GitHub 프로필을 찾을 수 없습니다.');
        }
    } catch (e) {
        console.log(e.message)
        res.status(404).send('Github 프로필을 찾을 수 없습니다')
    }
})

app.get('/heal', (req, res) => {
    console.log('/heal')
    res.send('heal')
})

app.get('/users', (req, res) => {
    tran++
    console.log('/users')
    res.send(users)
})

app.get('/tran', (req, res) => {
    res.send({
        'total': tran
    })
})

app.get('*', (req, res) => {
    tran++
    console.log('/*')
    res.sendFile(path.join(__dirname, '../react-build/index.html'))
})

app.listen(3001, () => {
    console.log('Hello ! v2')
})