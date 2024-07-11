import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const FanEnableGChart = ({ value }) => {
    const [data, setData] = useState(value);
    const percent = (tot, succ) => (succ / tot);

    useEffect(() => {
        if (data != value) value == 1 ? setData(100) : setData(0);
    }, [value]);

    return (
        <div className='d-flex h-100'>
            <div style={{ flex: '0.7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ textTransform: 'uppercase' }}>Fan Enable</div>
            </div>
            <div style={{ flex: '0.3' }}>
                <GaugeChart id="fanEnable" style={{ width: '160px', height: '100%', fill: 'black' }}
                    nrOfLevels={2}
                    animate={false}
                    colors={["#FF0000AB", "#00FF00AB"]}
                    textColor='var(--primary)'
                    percent={percent(100, data)}
                    formatTextValue={value => (value == 0) ? 'Disabled' : 'Enabled'}
                />
            </div>
        </div>
    );
};

export default FanEnableGChart;
