import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const Alarm1GChart = ({ value }) => {
    const [data, setData] = useState(value);
    const percent = (tot, succ) => (succ / tot);

    useEffect(() => {
        if (data != value) value == 1 ? setData(100) : setData(0);
    }, [value]);

    return (
        <div className='d-flex h-100'>
            <div style={{ flex: '0.7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ textTransform: 'uppercase' }}>Alarm 1</div>
            </div>
            <div style={{ flex: '0.3' }}>
                <GaugeChart id="alarm1" style={{ width: '160px', height: '100%', fill: 'black' }}
                    nrOfLevels={2}
                    animate={false}
                    colors={["#00FF00AB", "#FF0000AB"]}
                    textColor='var(--primary)'
                    percent={percent(100, data)}
                    formatTextValue={value => (value == 0) ? 'OFF' : 'ON'}
                />
            </div>
        </div>
    );
};

export default Alarm1GChart;
