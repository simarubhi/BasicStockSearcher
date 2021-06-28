import React, { useState } from 'react';
const socket = new WebSocket('wss://ws.finnhub.io?token=c378702ad3ib6g7ehurg');

const Card = () => {
    const [stockQuery, setStockQuery] = useState('');
    const [stock, setStock] = useState();
    const [stockPrice, setStockPrice] = useState();
    const [add, setAdd] = useState(true);

    const formSubmit = event => {
        event.preventDefault();
        if(stockQuery == null) return;
        if(add === true) {
            sendData();
            setStock(stockQuery);
            setStockQuery('');
            setAdd(false);
        }

        if(add === false) {
            setAdd(true);
            removeData();
            setStock();
            setStockPrice();
        }
    }

    const sendData = () => {
        socket.send(JSON.stringify({'type':'subscribe', 'symbol': stockQuery}));
    }
    
    socket.addEventListener('open', () => {
        sendData();
    });

    const removeData = () => {
        socket.send(JSON.stringify({'type':'unsubscribe', 'symbol': stock}))
    }

    // Listen for messages
    socket.addEventListener('message', event => {
        let data = JSON.parse(event.data);
        if (data.type !== "trade") return;
        if(data.data[0].p !== stockPrice){
            setStockPrice(data.data[0].p);
        }
        if(add === true) setStockPrice();
    });

    return (
        <div className='card'>
            <h1 className='title'>Stock Searcher</h1>
            <form className='search-form' onSubmit={formSubmit}>
                <input className='search-input' type='text' placeholder='Search Stock Symbol Here' value={stockQuery} onChange={event => setStockQuery(event.target.value)}/>
                <button className='search-btn' type='submit' value='submit' style={add ? {background: '#16c427'} : {background: '#e74b09'}}>{add ? 'Search' : 'Remove'}</button>
            </form>

            {/* <h1 className='stock-price'>{stockPrice ? `${stock} Last Trade Price: $${stockPrice}` : null}</h1> */}
            {stockPrice && <h1 className='stock-price'>{stock} Last Trade Price: ${stockPrice}</h1>}
        </div>
    )
}

export default Card
