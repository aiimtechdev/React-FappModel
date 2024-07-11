import React from 'react';
import { Col, Row } from 'react-bootstrap';
import GaugeChart from 'react-gauge-chart';

const SensorSuccessGauge = ({ title, total, success }) => {
    const percent = (tot, succ) => (succ/tot);
    return (
        <div className='d-flex h-100'>
            <div style={{flex: '0.7', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'center' }}>
                <div style={{textTransform: 'uppercase'}}>{title}</div>
                <div>{success}/{total}</div>
            </div>
            <div style={{flex: '0.3'}}>
                <GaugeChart id={title.split(' ').join('_')} style={{width: '160px', fill: 'black'}}
                    nrOfLevels={3}
                    colors={["#FF0000AB", "#FFFF00AB", "#00FF00AB"]}
                    textColor='var(--primary)'
                    percent={percent(total, success)}
                />
            </div>
        </div>
    );
};

export default SensorSuccessGauge;
