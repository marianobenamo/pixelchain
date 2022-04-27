import React from 'react';

/*class Asset extends React.Component {
    render() {
        return <div className="asset" key={index}>
            <img src={img} alt={name} />
            <h4>{name}</h4>
        </div>;
    }
}*/

function Asset({img, name, index}){
    return <div className="asset" key={index}>
        <img src={img} alt={name} />
        <h4>{name}</h4>
    </div>;
}

export default Asset;