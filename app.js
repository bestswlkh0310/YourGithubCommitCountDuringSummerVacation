var express = require('express');
var path = require('path');
var cors = require('cors');
var app = express();
const cheerio = require('cheerio');
const axios = require('axios');
var rateLimit = require("express-rate-limit"); 

app.use(express.static(path.join(__dirname, '../react-build')))
app.use(express.json());
app.use(cors({
    origin: '*'
}));

app.use(rateLimit({ 
        windowMs: 1*60*1000, 
        max: 200
    })
);

app.post('/result', async (req,res) => {
    const { id } = req.body
    console.log(req.body)
    const url = `https://github.com/${id}`;
    var response
    try {
        response = await axios.get(url);

        const isVacation = (date) => {
            const commitDate = new Date(date);
            const startDate = new Date('2023-07-18');
            const endDate = new Date('2023-08-15');
            return commitDate >= startDate && commitDate <= endDate;
        }

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
            res.send({
                total: totalCommits,
                commits: result
            });
        } else {
        res.send('GitHub 프로필을 찾을 수 없습니다.');
        }
    } catch (e) {
        console.log(e)
        res.status(404).send('Github 프로필을 찾을 수 없습니다')
    }

    // github api 는 개쓰레기야
    
    // const access_token = "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";
    // const url = `https://api.github.com/users/${id}/events/public?per_page=100&page=`;

    // const headers = {
    // "Authorization": `token ${access_token}`
    // };

    // let total_commits = 0;
    // let commit_info_list = [];

    // let page = 1;

    // function fetchCommitEvents(page) {
    //     fetch(url + page, { headers })
    //         .then(response => response.json())
    //         .then(events => {
    //             console.log(events)
    //             if (!Array.isArray(events)) {
    //                 console.log(`${id} 사용자의 모든 커밋 수: ${total_commits}`);
    //                 for (const commitInfo of commit_info_list) {
    //                     // console.log(commitInfo);
    //                 }
    //                 res.send({
    //                     total: total_commits,
    //                     commits: commit_info_list,
    //                 });
    //                 return;
    //             }
    //         for (const event of events) {
    //             console.log(event)
    //             if (event.type === "PushEvent") {
    //                 // commits url로 커밋한 날짜 조회해줘
    //                 const commits = event.payload.commits;

    //                 for (const commit of commits) {
    //                     fetch(commit.url, { headers })
    //                     .then(commitResponse => commitResponse.json())
    //                     .then(commitData => {
    //                         console.log(commitData.commit.author.date)
    //                             const eventDate = new Date(commitData.commit.author.date).toISOString().split("T")[0];
    //                             const existingCommitInfo = commit_info_list.find(info => info.date === eventDate);
    //                             // console.log(eventDate)
    //                             if (existingCommitInfo) {
    //                                 existingCommitInfo.count += 1;
    //                             } else {
    //                                 commit_info_list.push({ date: eventDate, count: 1 });
    //                             }
    //                             total_commits += 1;
    //                         // }
    //                     })
    //                     .catch(error => {
    //                         // console.log(error);
    //                         console.error("GitHub API 호출에 실패하였습니다.");
    //                     });

    //                 }
    //             }
    //         }
    //             fetchCommitEvents(page + 1);
    //         })
    //         .catch(error => {
    //             console.log(error);
    //             console.error("GitHub API 호출에 실패하였습니다.");
    //         });
    // }
    

    // fetchCommitEvents(page);

})


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../react-build/index.html'))
})

app.listen(3001, () => {
    console.log('Hello')
})