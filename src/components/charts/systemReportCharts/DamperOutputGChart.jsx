import React, { useState, useEffect } from 'react';
import GaugeChart from 'react-gauge-chart';

const DamperOutputGChart = ({ value }) => {
    const [data, setData] = useState(0);
    const percent = (tot, succ) => (succ / tot);

    useEffect( async () => {
        let values = value;
        let degreeVal = values / 1000 * 90;
        let result = degreeVal / 90 * 50 ;
        result = result.toFixed()
        await setData(result)
    }, [value]);
    
    return (
        <div className='d-flex h-100'>
            <div style={{ flex: '0.7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{ textTransform: 'uppercase' }}>Damper Output</div>
            </div>
            <div style={{ flex: '0.3' }}>
                <GaugeChart id="warnStatus" style={{ width: '160px', height: '100%', fill: 'black' }}
                    nrOfLevels={2}
                    animate={false}
                    colors={["#00FF00AB", "#FF0000AB"]}
                    textColor='var(--primary)'
                    percent={percent(100, data)}
                    formatTextValue={value => ((value / 50) * 90).toFixed()+'°'}
                />
            </div>
        </div>
    );
};

export default DamperOutputGChart;
