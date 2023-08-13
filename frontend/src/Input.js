import React, { useState, useEffect } from 'react';
import ReactModal from 'react-modal';
import Alert from './Alert';
import Result from './Result';

const Input = () => {
    const [inputValue, setInputValue] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [result, setResult] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    useEffect(() => {
        ReactModal.setAppElement('#root');
    }, []);

    const handleInputChange = (e) => {
        setInputValue(e.target.value);
    };
    const handleButtonClick = async () => {
        try {
            const res = await fetch('https://localhost:3001/result', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: inputValue }),
            });
            if (res.status == 429) {
                setErrorMessage('서버가 힘들어해요')
                setTimeout(() => {
                    setErrorMessage(null);
                }, 3000);
                return
            }
            const data = await res.json()
            console.log(data)
            setResult(data);
            setIsModalOpen(true);
        } catch (e) {
            console.log(e.message)
            setErrorMessage('Github 프로필을 찾을 수 없습니다')
            setTimeout(() => {
                setErrorMessage(null);
            }, 3000);
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <h1 className="text-2xl font-bold text-white mb-4">방학 때 얼마나 커밋을 했을까요...</h1>
            <div className="bg-gray-800 p-1 rounded-lg shadow-md w-80 mb-4">
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
            {errorMessage && (
            <Alert message={errorMessage} onClose={() => setErrorMessage(null)} />
            )}
            {/* <Result
                totalCommits={result ? result.total : null}
                commitInfoList={result ? result.commits : null}
            /> */}
           <ReactModal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            className="Modal"
            overlayClassName="Overlay"
            style={{
                content: {
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '60vw',
                    minWidth: '350px',
                    background: '#2D3748',
                    border: '1px solid #111',
                    padding: '1rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                }
            }}
        >
            <div className="flex flex-col h-full items-center">
                {result ? (
                    <Result
                        totalCommits={result.total}
                        commitInfoList={result.commits}
                    />
                ) : (
                    <></>
                 )}
                <button
                    onClick={handleModalClose}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded focus:outline-none">
                    닫기
                </button>
            </div>
        </ReactModal>
        </div>
    )
}

export default Input;
