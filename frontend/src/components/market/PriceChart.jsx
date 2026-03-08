import { useEffect, useState } from 'react';
import { getPriceHistory } from '../../services/market.service';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const AGRICOLORS = {
  line: '#2D5016',
  grid: 'rgba(62, 39, 35, 0.12)',
  tooltip: '#FAF8F3',
};

export default function PriceChart({ commodity, market }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function fetch() {
      const history = await getPriceHistory(commodity, market, 30);
      setData(history.map(d => ({ date: d.price_date, price: d.modal_price })));
    }
    fetch();
  }, [commodity, market]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke={AGRICOLORS.grid} />
        <XAxis dataKey="date" stroke="#4E342E" fontSize={12} />
        <YAxis stroke="#4E342E" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: AGRICOLORS.tooltip,
            border: '1px solid rgba(45, 80, 22, 0.2)',
            borderRadius: '12px',
          }}
          labelStyle={{ color: '#3E2723' }}
        />
        <Line type="monotone" dataKey="price" stroke={AGRICOLORS.line} strokeWidth={2} dot={{ fill: AGRICOLORS.line }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
