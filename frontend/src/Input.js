import React, { useState } from 'react';
const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
}

const Result = ({ totalCommits, commitInfoList }) => {
    if (totalCommits === null || commitInfoList === null) {
        return (
            <div className="text-white">
                조회 결과가 없습니다.
            </div>
        );
    }

    const filteredCommitInfoList = commitInfoList.filter(commitInfo => {
        const commitDate = new Date(commitInfo.date);
        const startDate = new Date('2023-07-18');
        const endDate = new Date('2023-08-15');
        return commitDate >= startDate && commitDate <= endDate;
    });
    
    return (
        <div className="bg-gray-800 p-4 rounded-lg mt-4">
            <h2 className="text-xl font-semibold text-white mb-4">조회 결과</h2>
            <p className="text-white">총 커밋 수: {totalCommits}</p>
            <div className="overflow-y-auto max-h-48 mt-4">
                {filteredCommitInfoList.map((commitInfo, index) => (
                    <div key={index} className="bg-gray-700 p-3 rounded-md mt-2">
                        <p className="text-gray-400">{formatDate(commitInfo.date)} - {commitInfo.count}번</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


const Input = () => {
    const [inputValue, setInputValue] = useState('');
    const [result, setResult] = useState(null);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleButtonClick = async () => {
        try {
            const res = await fetch('http://localhost:3001/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: inputValue }),
            });
            const data = await res.json()
            console.log(data)
            setResult(data);
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">방학 때 얼마나 커밋을 했을까요...</h1>
            <div className="bg-gray-800 p-2 rounded-lg shadow-md w-80 mb-4">
                <input
                    className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                    type="text"
                    placeholder="깃허브 아이디를 입력해 주세요"
                    value={inputValue}
                    onChange={handleInputChange}
                />
            </div>
            <button
                onClick={handleButtonClick}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none">
                조회하기
            </button>
            <Result
                totalCommits={result ? result.total : null}
                commitInfoList={result ? result.commits : null}
            />
        </div>
    )
}

export default Input;
