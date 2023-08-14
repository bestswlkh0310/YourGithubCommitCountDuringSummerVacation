import React from 'react';

const CommitInfoList = ({ commitInfoList, callback }) => {
    const handleButtonClick = (userName) => {
        callback(userName);
    };

  return (
    <>
        <h1 className="text-2xl font-bold text-white mb-4">최근 조회된 Github 아이디</h1>
        <div className="ahh shadow-md w-80 mt-4 overflow-auto">
            {!commitInfoList.length && <h3 className="text-1xl font-bold text-white mb-4">아직 아무도 조회하지 않았어요 ㅜㅜ</h3>}
            {commitInfoList.map((user, idx) => (
                <button
                    onClick={() => handleButtonClick(user.name)}
                    key={user.name} className="bg-gray-800 hover:bg-gray-700 p-4 rounded-lg flex flex-col mb-2">
                <p className="text-lg font-semibold text-white">{user.name}&nbsp;&nbsp;&nbsp;<span className="text-gray-300">{user.total}번</span></p>
                </button>
            ))}
        </div>
    </>
  );
};

export default CommitInfoList;
