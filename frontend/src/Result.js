import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ko-KR', options);
}

const Result = ({ totalCommits, commitInfoList }) => {

    const startDate = new Date('2023-07-18');
    const endDate = new Date('2023-08-15');

    const filteredCommitInfoList = commitInfoList.filter(commitInfo => {
        const commitDate = new Date(commitInfo.date);
        return commitDate >= startDate && commitDate <= endDate;
    });

    const datesInRange = [];
    const currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        datesInRange.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }

    const commitCountMap = new Map();
    datesInRange.forEach(date => {
        commitCountMap.set(formatDate(date), 0);
    });

    filteredCommitInfoList.forEach(commitInfo => {
        const commitDate = new Date(commitInfo.date);
        const formattedDate = formatDate(commitDate);
        commitCountMap.set(formattedDate, commitInfo.count);
    });

    const chartData = {
        labels: Array.from(commitCountMap.keys()),
        datasets: [
            {
                label: '커밋 수',
                backgroundColor: 'rgba(114, 137, 218, 0.4)',
                borderColor: 'rgba(114, 137, 218, 1)',
                borderWidth: 1,
                hoverBackgroundColor: 'rgba(75,192,192,0.8)',
                hoverBorderColor: 'rgba(75,192,192,1)',
                data: Array.from(commitCountMap.values()),
            },
        ],
    };
    
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            x: {
                grid: {
                    drawOnChartArea: false,
                },
            },
            y: {
                beginAtZero: true,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
        }
    };

    return (
        <div className="bg-gray-800 p-8 w-full rounded-lg">
            <h2 className="text-2xl font-semibold text-white mb-6">조회 결과</h2>
            <p className="text-white text-lg">총 커밋 수: {totalCommits}</p>
            <div className="mt-6 w-full">
                <Bar className='w-full' data={chartData} options={chartOptions} />
            </div>
        </div>
    );
}


export default Result;