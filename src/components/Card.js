import React, { useState } from 'react';
const token = process.env.REACT_APP_API_TOKEN;
const socket = new WebSocket(`wss://ws.finnhub.io?token=${token}`);

const Card = () => {
	// Use as controlled input
	const [stockQuery, setStockQuery] = useState('');
	// Stored input value
	const [stock, setStock] = useState();
	// Returned Stock Price
	const [stockPrice, setStockPrice] = useState();
	// Add or remove stock
	const [add, setAdd] = useState(true);

	// Add stock to socket
	socket.addEventListener('open', () => {
		sendData();
	});

	const formSubmit = event => {
		event.preventDefault();
		if (stockQuery == null) return;
		if (add === true) {
			sendData();
			setStock(stockQuery);
			setStockQuery('');
			setAdd(false);
		}

		if (add === false) {
			setAdd(true);
			removeData();
			setStock();
			setStockPrice();
		}
	};

	const sendData = () => {
		socket.send(JSON.stringify({ type: 'subscribe', symbol: stockQuery }));
	};

	const removeData = () => {
		socket.send(JSON.stringify({ type: 'unsubscribe', symbol: stock }));
	};

	// Listen for messages
	socket.addEventListener('message', event => {
		let data = JSON.parse(event.data);
		if (data.type !== 'trade') return;
		if (data.data[0].p !== stockPrice) {
			setStockPrice(data.data[0].p);
		}
		if (add === true) setStockPrice();
	});

	return (
		<div className='card'>
			<h1 className='title'>Stock Searcher</h1>

			<form className='search-form' onSubmit={formSubmit}>
				<input
					className='search-input'
					type='text'
					placeholder='Search Stock Symbol Here'
					value={stockQuery}
					onChange={event => setStockQuery(event.target.value)}
				/>

				<button
					className='search-btn'
					type='submit'
					value='submit'
					style={
						add
							? { background: '#16c427' }
							: { background: '#e74b09' }
					}
				>
					{add ? 'Search' : 'Remove'}
				</button>
			</form>

			{stockPrice && (
				<h1 className='stock-price'>
					{stock} Last Trade Price: ${stockPrice}
				</h1>
			)}
		</div>
	);
};

export default Card;
