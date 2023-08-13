const Alert = ({ message, onClose }) => {
    return (
        <div
            className={`absolute top-10 right-50 bg-red-500 p-4 rounded-lg`}
            style={{
                width: 'auto',
                color: '#fff',
                zIndex: 999,
            }}
        >
            <p>{message}</p>
            <div className="text-right mt-2">
                <button
                    className="ml-2 font-bold"
                    onClick={onClose}
                >
                    닫기
                </button>
            </div>
        </div>
    );
};

export default Alert;